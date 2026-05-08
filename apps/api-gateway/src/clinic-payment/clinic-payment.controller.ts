import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  ClinicPaymentService,
  type CreatePaymentDto,
  type RecordPaymentDto,
} from './clinic-payment.service';

@ApiTags('Clinic — Payment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clinic/payment')
export class ClinicPaymentController {
  constructor(private readonly service: ClinicPaymentService) {}

  @Post()
  @Roles('clinic-admin', 'clinic-resepsionis')
  @ApiOperation({ summary: 'Create payment record untuk booking' })
  create(@Body() dto: CreatePaymentDto, @Request() req: any) {
    return this.service.create(dto, req.user?.sub ?? req.user?.id);
  }

  @Post(':id/record')
  @Roles('clinic-admin', 'clinic-resepsionis')
  @ApiOperation({ summary: 'Record payment installment (DP atau lunas)' })
  record(@Param('id', ParseIntPipe) id: number, @Body() dto: RecordPaymentDto, @Request() req: any) {
    return this.service.record(id, dto, req.user?.sub ?? req.user?.id);
  }

  @Get(':id')
  @Roles('clinic-admin', 'clinic-resepsionis', 'clinic-owner')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Get('booking/:bookingId')
  @Roles('clinic-admin', 'clinic-resepsionis', 'clinic-owner')
  findByBooking(@Param('bookingId', ParseIntPipe) bookingId: number) {
    return this.service.findByBooking(bookingId);
  }

  @Get(':id/receipt')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @Roles('clinic-admin', 'clinic-resepsionis')
  @ApiOperation({ summary: 'Receipt HTML (untuk print atau preview)' })
  async receipt(@Param('id', ParseIntPipe) id: number) {
    return this.service.receiptHtml(id);
  }

  @Get(':id/receipt.pdf')
  @Roles('clinic-admin', 'clinic-resepsionis')
  @ApiOperation({ summary: 'Receipt PDF (binary download via pdfkit)' })
  async receiptPdf(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    const buffer = await this.service.receiptPdf(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="receipt-${id}.pdf"`,
      'Content-Length': buffer.length.toString(),
    });
    res.end(buffer);
  }

  @Post(':id/send-receipt')
  @Roles('clinic-admin', 'clinic-resepsionis')
  @ApiOperation({ summary: 'Send receipt notification to client via WhatsApp' })
  sendReceipt(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.service.sendReceiptViaWa(id, req.user?.sub ?? req.user?.id);
  }
}
