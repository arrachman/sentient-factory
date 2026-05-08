import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

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
  constructor(private readonly prisma: PrismaService) {}

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

  /** Generate simple HTML receipt (PDF generation deferred). */
  async receiptHtml(id: number): Promise<string> {
    const payment = await this.prisma.clinicPayment.findUnique({ where: { id } });
    if (!payment) throw new NotFoundException(`Payment ${id} not found`);
    return `<!DOCTYPE html>
<html><head><title>Receipt #${payment.id}</title>
<style>body{font-family:sans-serif;max-width:600px;margin:40px auto;padding:24px;border:1px solid #ddd}
h1{color:#5b8a66}table{width:100%;border-collapse:collapse}td{padding:8px;border-bottom:1px solid #eee}</style>
</head><body>
<h1>Althea Psychology — Payment Receipt</h1>
<p>Receipt #${payment.id} • Booking #${payment.bookingId}</p>
<table>
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
}
