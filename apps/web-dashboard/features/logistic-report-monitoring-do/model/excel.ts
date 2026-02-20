import type { MonitoringRow } from '@/features/logistic-report-monitoring-do/model/types';
import {
  addDaysFromDate,
  computeKpiStatus,
  fmtExcelDate,
  normalizeNumber,
} from '@/features/logistic-report-monitoring-do/model/utils';

export async function buildMonitoringDoExcelBuffer(
  rows: MonitoringRow[],
  selectedProvinceName: string,
): Promise<ArrayBuffer> {
  const ExcelJS = (await import('exceljs')).default;

  const tableHeader = [
    'No',
    'NOMOR DO',
    'TANGGAL DO',
    'BU (Bagian Usaha)',
    'TANGGAL MASUK DO',
    'MASTER CUSTOMER',
    'DESTINATION',
    'STD LEAD TIME',
    'TANGGAL KIRIM',
    'STANDARD BRG DI TERIMA',
    'AKTUAL BRG  DITERIMA SESUAI DO',
    'DITERIMA OLEH',
    'TANGGAL SCAN DO KEMBALI',
    'TANGGAL DO ASLI DITERIMA CITEUREUP',
    'KPI',
    'TANGGAL DO KEMBALI',
    'STD RETURN DO',
    'STD DO KEMBALI',
    'KPI',
    'TOTAL BARANG',
    'TOTAL KG',
  ];

  const dataRows = rows.map((row, index) => {
    const stdLeadTimeDays = Number(row.stdLeadTimeDays ?? 0);
    const stdReturnDoDays = Number(row.stdReturnDoDays ?? 0);

    const standardReceivedDate = addDaysFromDate(row.shippingDate, stdLeadTimeDays);
    const stdDoReturnDate = addDaysFromDate(row.shippingDate, stdReturnDoDays);

    const kpiDeliveryStatus = computeKpiStatus(row.actualReceivedDate, standardReceivedDate);
    const kpiDoReturnStatus = computeKpiStatus(row.doScanReturnDate, stdDoReturnDate);

    return [
      index + 1,
      row.doNumber || '',
      fmtExcelDate(row.createdAt),
      row.bu || '',
      fmtExcelDate(row.doReceivedDate),
      row.customer?.name || '',
      row.destinationCity?.name || '',
      stdLeadTimeDays,
      fmtExcelDate(row.shippingDate),
      fmtExcelDate(standardReceivedDate),
      fmtExcelDate(row.actualReceivedDate),
      row.receivedBy || '',
      fmtExcelDate(row.doScanReturnDate),
      '',
      kpiDeliveryStatus,
      fmtExcelDate(row.doScanReturnDate),
      stdReturnDoDays,
      fmtExcelDate(stdDoReturnDate),
      kpiDoReturnStatus,
      normalizeNumber(row.totalItemTypes ?? row.totalQtyPcs),
      normalizeNumber(row.totalKg),
    ];
  });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Monitoring DO');

  worksheet.mergeCells(1, 1, 1, 21);
  worksheet.getCell(1, 1).value = 'MONITORING DO DAN DELIVERY';
  worksheet.getCell(1, 1).font = { bold: true, size: 14 };
  worksheet.getCell(1, 1).alignment = { horizontal: 'center', vertical: 'middle' };

  worksheet.getCell(2, 1).value = 'Provinsi';
  worksheet.getCell(2, 2).value = selectedProvinceName;
  worksheet.getCell(2, 1).font = { bold: true };

  worksheet.getRow(4).values = tableHeader;
  worksheet.getRow(4).font = { bold: true };
  worksheet.getRow(4).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

  dataRows.forEach((row, i) => {
    worksheet.getRow(5 + i).values = row;
  });

  worksheet.columns = [
    { width: 14 },
    { width: 24 },
    { width: 24 },
    { width: 20 },
    { width: 20 },
    { width: 26 },
    { width: 20 },
    { width: 14 },
    { width: 15 },
    { width: 20 },
    { width: 26 },
    { width: 24 },
    { width: 22 },
    { width: 30 },
    { width: 10 },
    { width: 18 },
    { width: 14 },
    { width: 16 },
    { width: 10 },
    { width: 15 },
    { width: 12 },
  ];

  const lastRow = Math.max(4, 4 + dataRows.length);
  for (let rowIndex = 4; rowIndex <= lastRow; rowIndex += 1) {
    for (let col = 1; col <= 21; col += 1) {
      const cell = worksheet.getCell(rowIndex, col);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      if (rowIndex > 4 && (col === 1 || col === 8 || col === 17 || col === 20 || col === 21)) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }
    }
  }

  const headerFill = {
    type: 'pattern' as const,
    pattern: 'solid' as const,
    fgColor: { argb: 'FFEFEFEF' },
  };
  for (let col = 1; col <= 21; col += 1) {
    worksheet.getCell(4, col).fill = headerFill;
  }

  return (await workbook.xlsx.writeBuffer()) as ArrayBuffer;
}
