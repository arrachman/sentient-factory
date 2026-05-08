import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as PDFDocument from 'pdfkit';
import { PrismaService } from '../prisma/prisma.service';
import { ClinicWaService } from '../clinic-wa/clinic-wa.service';

export type CreatePaymentDto = {
  bookingId: number;
  totalAmount: number;
  taxAmount?: number;
  dpAmount?: number;
  paymentMethod?: string;
  notes?: string;
};

export type RecordPaymentDto = {
  paidAmount: number;
  paymentMethod?: string;
  notes?: string;
};

@Injectable()
export class ClinicPaymentService {
  private readonly logger = new Logger(ClinicPaymentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly wa: ClinicWaService,
  ) {}

  /** Create payment record untuk booking — biasanya saat booking confirmed. */
  async create(dto: CreatePaymentDto, actorId?: number) {
    const existing = await this.prisma.clinicPayment.findUnique({ where: { bookingId: dto.bookingId } });
    if (existing) throw new BadRequestException(`Payment untuk booking ${dto.bookingId} sudah ada`);

    const total = new Prisma.Decimal(dto.totalAmount);
    const dp = new Prisma.Decimal(dto.dpAmount ?? 0);
    const tax = new Prisma.Decimal(dto.taxAmount ?? 0);

    const created = await this.prisma.clinicPayment.create({
      data: {
        bookingId: dto.bookingId,
        totalAmount: total,
        taxAmount: tax,
        dpAmount: dp,
        paidAmount: new Prisma.Decimal(0),
        status: 'pending',
        paymentMethod: dto.paymentMethod,
        notes: dto.notes,
        createdBy: actorId,
        updatedBy: actorId,
      },
    });
    return { success: true, data: created, message: 'Payment created' };
  }

  /** Record payment installment. Auto-update status: dp_paid → lunas. */
  async record(id: number, dto: RecordPaymentDto, actorId?: number) {
    const existing = await this.prisma.clinicPayment.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Payment ${id} not found`);

    const newPaid = existing.paidAmount.plus(new Prisma.Decimal(dto.paidAmount));
    const total = existing.totalAmount;

    let status = existing.status;
    let dpPaidAt = existing.dpPaidAt;
    let lunasAt = existing.lunasAt;
    if (newPaid.gte(total)) {
      status = 'lunas';
      lunasAt = new Date();
      if (!dpPaidAt) dpPaidAt = new Date();
    } else if (newPaid.gte(existing.dpAmount) && existing.dpAmount.gt(0)) {
      status = 'dp_paid';
      if (!dpPaidAt) dpPaidAt = new Date();
    }

    const updated = await this.prisma.clinicPayment.update({
      where: { id },
      data: {
        paidAmount: newPaid,
        status,
        dpPaidAt,
        lunasAt,
        paymentMethod: dto.paymentMethod ?? existing.paymentMethod,
        notes: dto.notes ?? existing.notes,
        updatedBy: actorId,
      },
    });
    return { success: true, data: updated, message: `Payment status: ${status}` };
  }

  async findByBooking(bookingId: number) {
    const payment = await this.prisma.clinicPayment.findUnique({ where: { bookingId } });
    if (!payment) throw new NotFoundException(`No payment for booking ${bookingId}`);
    return { success: true, data: payment };
  }

  async findOne(id: number) {
    const payment = await this.prisma.clinicPayment.findUnique({ where: { id } });
    if (!payment) throw new NotFoundException(`Payment ${id} not found`);
    return { success: true, data: payment };
  }

  /** Generate simple HTML receipt (legacy, kept for "Print" workflow). */
  async receiptHtml(id: number): Promise<string> {
    const payment = await this.fetchPaymentWithDetails(id);
    return `<!DOCTYPE html>
<html><head><title>Receipt #${payment.id}</title>
<style>body{font-family:sans-serif;max-width:600px;margin:40px auto;padding:24px;border:1px solid #ddd}
h1{color:#5b8a66}table{width:100%;border-collapse:collapse}td{padding:8px;border-bottom:1px solid #eee}</style>
</head><body>
<h1>Althea Psychology — Payment Receipt</h1>
<p>Receipt #${payment.id} • Booking #${payment.bookingId}</p>
<table>
  <tr><td>Klien</td><td>${payment.booking?.client?.name ?? '—'}</td></tr>
  <tr><td>Layanan</td><td>${payment.booking?.service?.name ?? '—'}</td></tr>
  <tr><td>Total Amount</td><td>Rp ${payment.totalAmount.toString()}</td></tr>
  <tr><td>Tax</td><td>Rp ${payment.taxAmount.toString()}</td></tr>
  <tr><td>DP</td><td>Rp ${payment.dpAmount.toString()}</td></tr>
  <tr><td>Paid</td><td>Rp ${payment.paidAmount.toString()}</td></tr>
  <tr><td>Status</td><td>${payment.status}</td></tr>
  <tr><td>Method</td><td>${payment.paymentMethod ?? '—'}</td></tr>
  <tr><td>Date</td><td>${payment.lunasAt?.toISOString() ?? payment.dpPaidAt?.toISOString() ?? '—'}</td></tr>
</table>
<p style="margin-top:24px;color:#666;font-size:12px">Generated ${new Date().toISOString()}</p>
</body></html>`;
  }

  /**
   * Generate PDF receipt as Buffer. Uses pdfkit (server-side, no browser dep).
   * Returns binary that controller streams as application/pdf.
   */
  async receiptPdf(id: number): Promise<Buffer> {
    const payment = await this.fetchPaymentWithDetails(id);

    return new Promise<Buffer>((resolve, reject) => {
      const doc = new (PDFDocument as any)({ size: 'A5', margin: 36 });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fillColor('#5b8a66').fontSize(20).text('Althea Psychology', { align: 'center' });
      doc.fontSize(10).fillColor('#666').text('Payment Receipt', { align: 'center' });
      doc.moveDown(0.5);
      doc
        .fillColor('#000')
        .fontSize(8)
        .text(`Receipt #${payment.id}  •  Booking #${payment.bookingId}`, { align: 'center' });
      doc.moveDown();

      // Divider
      doc.strokeColor('#5b8a66').lineWidth(1).moveTo(36, doc.y).lineTo(383, doc.y).stroke();
      doc.moveDown(0.5);

      // Body — table-like rows
      const rows: Array<[string, string]> = [
        ['Klien', payment.booking?.client?.name ?? '—'],
        ['Telp WA', payment.booking?.client?.phoneWa ?? '—'],
        ['Layanan', payment.booking?.service?.name ?? '—'],
        ['Psikolog', payment.booking?.psikolog?.fullName ?? '—'],
        ['Tanggal Sesi', payment.booking?.scheduledStart?.toISOString().slice(0, 16).replace('T', ' ') ?? '—'],
        ['Total', this.formatRupiah(payment.totalAmount)],
        ['PPN', this.formatRupiah(payment.taxAmount)],
        ['DP', this.formatRupiah(payment.dpAmount)],
        ['Dibayar', this.formatRupiah(payment.paidAmount)],
        ['Status', String(payment.status).toUpperCase()],
        ['Metode Bayar', payment.paymentMethod ?? '—'],
      ];

      doc.fontSize(10);
      for (const [label, value] of rows) {
        const startY = doc.y;
        doc.fillColor('#666').text(label, 36, startY, { width: 130 });
        doc.fillColor('#000').text(value, 170, startY, { width: 213, align: 'right' });
        doc.moveDown(0.3);
      }

      doc.moveDown();
      doc.strokeColor('#ddd').lineWidth(0.5).moveTo(36, doc.y).lineTo(383, doc.y).stroke();
      doc.moveDown(0.3);
      doc
        .fontSize(7)
        .fillColor('#999')
        .text(`Generated ${new Date().toISOString()}`, { align: 'center' });
      doc.text('Receipt ini sah tanpa cap basah. Simpan untuk record kamu.', { align: 'center' });

      doc.end();
    });
  }

  /**
   * Send WA notification with receipt info to client.
   * Uses template "Bukti Pembayaran" (seeded di seed-clinic-wa.ts).
   * Receipt itself accessible via separate endpoint /payment/:id/receipt.pdf.
   */
  async sendReceiptViaWa(id: number, actorId?: number) {
    const payment = await this.fetchPaymentWithDetails(id);
    const phone = payment.booking?.client?.phoneWa;
    if (!phone) {
      throw new BadRequestException('Klien tidak punya nomor WhatsApp');
    }
    if (payment.booking?.client?.waOptedOut) {
      throw new BadRequestException('Klien opt-out dari notifikasi WA');
    }

    const variables = {
      nama_klien: payment.booking?.client?.name ?? '',
      layanan: payment.booking?.service?.name ?? '',
      total: this.formatRupiah(payment.totalAmount),
      dibayar: this.formatRupiah(payment.paidAmount),
      status: String(payment.status).toUpperCase(),
      receipt_id: String(payment.id),
    };

    // Try template-based dispatch first (matches Slice 8 ClinicWaService.dispatch signature).
    // Falls back gracefully if template tidak ada — controller still returns success since
    // we don't want payment flow to fail on WA dispatch errors.
    const result = await this.wa.dispatch({
      templateName: 'Bukti Pembayaran',
      recipientType: 'klien',
      recipientPhone: phone,
      variables,
      bookingId: payment.bookingId,
    });
    void actorId;

    return {
      success: true,
      data: { paymentId: payment.id, ...result },
      message: 'Receipt notification dispatched',
    };
  }

  // ----- Helpers -----

  private async fetchPaymentWithDetails(id: number) {
    const payment = await this.prisma.clinicPayment.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            client: { select: { id: true, name: true, phoneWa: true, waOptedOut: true } },
            service: { select: { id: true, name: true, category: true } },
            psikolog: { select: { id: true, fullName: true } },
          },
        },
      },
    });
    if (!payment) throw new NotFoundException(`Payment ${id} not found`);
    return payment;
  }

  private formatRupiah(value: Prisma.Decimal): string {
    const num = Number(value.toString());
    return 'Rp ' + num.toLocaleString('id-ID');
  }
}
