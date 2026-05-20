"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ClinicPaymentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicPaymentService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const PDFDocument = __importStar(require("pdfkit"));
const prisma_service_1 = require("../prisma/prisma.service");
const clinic_wa_service_1 = require("../clinic-wa/clinic-wa.service");
let ClinicPaymentService = ClinicPaymentService_1 = class ClinicPaymentService {
    prisma;
    wa;
    logger = new common_1.Logger(ClinicPaymentService_1.name);
    constructor(prisma, wa) {
        this.prisma = prisma;
        this.wa = wa;
    }
    async create(dto, actorId) {
        const existing = await this.prisma.clinicPayment.findUnique({
            where: { bookingId: dto.bookingId },
        });
        if (existing)
            throw new common_1.BadRequestException(`Payment untuk booking ${dto.bookingId} sudah ada`);
        const total = new client_1.Prisma.Decimal(dto.totalAmount);
        const dp = new client_1.Prisma.Decimal(dto.dpAmount ?? 0);
        const tax = new client_1.Prisma.Decimal(dto.taxAmount ?? 0);
        const created = await this.prisma.clinicPayment.create({
            data: {
                bookingId: dto.bookingId,
                totalAmount: total,
                taxAmount: tax,
                dpAmount: dp,
                paidAmount: new client_1.Prisma.Decimal(0),
                status: 'pending',
                paymentMethod: dto.paymentMethod,
                notes: dto.notes,
                createdBy: actorId,
                updatedBy: actorId,
            },
        });
        return { success: true, data: created, message: 'Payment created' };
    }
    async record(id, dto, actorId) {
        const existing = await this.prisma.clinicPayment.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException(`Payment ${id} not found`);
        const newPaid = existing.paidAmount.plus(new client_1.Prisma.Decimal(dto.paidAmount));
        const total = existing.totalAmount;
        let status = existing.status;
        let dpPaidAt = existing.dpPaidAt;
        let lunasAt = existing.lunasAt;
        if (newPaid.gte(total)) {
            status = 'lunas';
            lunasAt = new Date();
            if (!dpPaidAt)
                dpPaidAt = new Date();
        }
        else if (newPaid.gte(existing.dpAmount) && existing.dpAmount.gt(0)) {
            status = 'dp_paid';
            if (!dpPaidAt)
                dpPaidAt = new Date();
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
    async refund(id, args, actorId) {
        const existing = await this.prisma.clinicPayment.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException(`Payment ${id} not found`);
        if (existing.status === 'refunded') {
            throw new common_1.BadRequestException('Payment sudah di-refund');
        }
        if (existing.status === 'pending') {
            throw new common_1.BadRequestException('Payment belum dibayar, tidak perlu refund (cancel saja)');
        }
        const refundAmount = args.full
            ? existing.paidAmount
            : new client_1.Prisma.Decimal(args.amount ?? existing.paidAmount);
        if (refundAmount.gt(existing.paidAmount)) {
            throw new common_1.BadRequestException(`Refund (${refundAmount}) > dibayar (${existing.paidAmount})`);
        }
        const newPaid = existing.paidAmount.minus(refundAmount);
        const updated = await this.prisma.clinicPayment.update({
            where: { id },
            data: {
                status: 'refunded',
                paidAmount: newPaid,
                notes: [existing.notes, `[REFUND ${refundAmount}] ${args.reason ?? '-'}`]
                    .filter(Boolean)
                    .join('\n'),
                updatedBy: actorId,
            },
        });
        return {
            success: true,
            data: updated,
            message: `Refunded ${refundAmount.toString()}`,
        };
    }
    async findByBooking(bookingId) {
        const payment = await this.prisma.clinicPayment.findUnique({ where: { bookingId } });
        if (!payment)
            throw new common_1.NotFoundException(`No payment for booking ${bookingId}`);
        return { success: true, data: payment };
    }
    async findOne(id) {
        const payment = await this.prisma.clinicPayment.findUnique({ where: { id } });
        if (!payment)
            throw new common_1.NotFoundException(`Payment ${id} not found`);
        return { success: true, data: payment };
    }
    async receiptHtml(id) {
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
    async receiptPdf(id) {
        const payment = await this.fetchPaymentWithDetails(id);
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ size: 'A5', margin: 36 });
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
            doc.fillColor('#5b8a66').fontSize(20).text('Althea Psychology', { align: 'center' });
            doc.fontSize(10).fillColor('#666').text('Payment Receipt', { align: 'center' });
            doc.moveDown(0.5);
            doc
                .fillColor('#000')
                .fontSize(8)
                .text(`Receipt #${payment.id}  •  Booking #${payment.bookingId}`, { align: 'center' });
            doc.moveDown();
            doc.strokeColor('#5b8a66').lineWidth(1).moveTo(36, doc.y).lineTo(383, doc.y).stroke();
            doc.moveDown(0.5);
            const rows = [
                ['Klien', payment.booking?.client?.name ?? '—'],
                ['Telp WA', payment.booking?.client?.phoneWa ?? '—'],
                ['Layanan', payment.booking?.service?.name ?? '—'],
                ['Psikolog', payment.booking?.psikolog?.fullName ?? '—'],
                [
                    'Tanggal Sesi',
                    payment.booking?.scheduledStart?.toISOString().slice(0, 16).replace('T', ' ') ?? '—',
                ],
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
    async sendReceiptViaWa(id, actorId) {
        const payment = await this.fetchPaymentWithDetails(id);
        const phone = payment.booking?.client?.phoneWa;
        if (!phone) {
            throw new common_1.BadRequestException('Klien tidak punya nomor WhatsApp');
        }
        if (payment.booking?.client?.waOptedOut) {
            throw new common_1.BadRequestException('Klien opt-out dari notifikasi WA');
        }
        const variables = {
            nama_klien: payment.booking?.client?.name ?? '',
            layanan: payment.booking?.service?.name ?? '',
            total: this.formatRupiah(payment.totalAmount),
            dibayar: this.formatRupiah(payment.paidAmount),
            status: String(payment.status).toUpperCase(),
            receipt_id: String(payment.id),
        };
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
    async fetchPaymentWithDetails(id) {
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
        if (!payment)
            throw new common_1.NotFoundException(`Payment ${id} not found`);
        return payment;
    }
    formatRupiah(value) {
        const num = Number(value.toString());
        return 'Rp ' + num.toLocaleString('id-ID');
    }
};
exports.ClinicPaymentService = ClinicPaymentService;
exports.ClinicPaymentService = ClinicPaymentService = ClinicPaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        clinic_wa_service_1.ClinicWaService])
], ClinicPaymentService);
//# sourceMappingURL=clinic-payment.service.js.map