import type { MutationRow, StockBatchRow } from '@/features/logistic-stock-report/model/types';
import { fmtExcelDate, formatProductLabel } from '@/features/logistic-stock-report/model/utils';

export async function buildStockMutationReportExcel(rows: MutationRow[]): Promise<ArrayBuffer> {
  const ExcelJS = (await import('exceljs')).default;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Stock Mutation Report');
  worksheet.columns = [
    { width: 8 },
    { width: 34 },
    { width: 20 },
    { width: 14 },
    { width: 12 },
    { width: 12 },
    { width: 12 },
    { width: 12 },
    { width: 16 },
    { width: 24 },
  ];

  worksheet.getCell(1, 1).value = 'DETAIL STOCK PERTANGGAL :';
  worksheet.getCell(1, 1).font = { bold: true };
  worksheet.mergeCells(1, 1, 1, 10);

  worksheet.getRow(3).height = 22;
  worksheet.getRow(4).height = 22;

  worksheet.mergeCells(3, 1, 4, 1);
  worksheet.mergeCells(3, 2, 4, 2);
  worksheet.mergeCells(3, 3, 3, 5);
  worksheet.mergeCells(3, 6, 3, 8);
  worksheet.mergeCells(3, 9, 4, 9);
  worksheet.mergeCells(3, 10, 4, 10);

  worksheet.getCell(3, 1).value = 'No.';
  worksheet.getCell(3, 2).value = 'Description';
  worksheet.getCell(3, 3).value = 'Stock Card';
  worksheet.getCell(3, 6).value = 'Actual Stock';
  worksheet.getCell(3, 9).value = 'Expire';
  worksheet.getCell(3, 10).value = 'Remarks';

  worksheet.getCell(4, 3).value = 'No. Batch';
  worksheet.getCell(4, 4).value = 'Exp. Dated';
  worksheet.getCell(4, 5).value = 'Total';
  worksheet.getCell(4, 6).value = 'To day';
  worksheet.getCell(4, 7).value = '3 Mth';
  worksheet.getCell(4, 8).value = '6 Mth';

  for (let col = 1; col <= 10; col += 1) {
    worksheet.getCell(3, col).font = { bold: true };
    worksheet.getCell(3, col).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(3, col).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFEFEFEF' },
    };
    worksheet.getCell(4, col).font = { bold: true };
    worksheet.getCell(4, col).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(4, col).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFEFEFEF' },
    };
  }

  let rowCursor = 5;
  rows.forEach((row, index) => {
    worksheet.getRow(rowCursor).values = [
      index + 1,
      row.description || '',
      row.batchNumber || '',
      fmtExcelDate(row.expiryDate),
      Number(row.total ?? 0),
      Number(row.actualToday ?? 0),
      Number(row.actualThreeMonths ?? 0),
      Number(row.actualSixMonths ?? 0),
      row.expire || '',
      row.remarks || '',
    ];
    rowCursor += 1;
  });

  for (let r = 3; r < rowCursor; r += 1) {
    for (let c = 1; c <= 10; c += 1) {
      const cell = worksheet.getCell(r, c);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      if (r >= 5 && (c === 1 || c === 3 || c === 4 || c === 5 || c === 6 || c === 7 || c === 8)) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }
    }
  }

  return (await workbook.xlsx.writeBuffer()) as ArrayBuffer;
}

export async function buildStockBatchReportExcel(rows: StockBatchRow[]): Promise<ArrayBuffer> {
  const ExcelJS = (await import('exceljs')).default;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Stock Batch Report');
  worksheet.columns = [
    { width: 14 },
    { width: 20 },
    { width: 32 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
  ];

  const groups = new Map<string, StockBatchRow[]>();
  rows.forEach((row) => {
    const key = `${row.item?.uuid ?? ''}::${row.batch?.batchNumber ?? ''}::${row.warehouse?.uuid ?? ''}`;
    const current = groups.get(key) ?? [];
    current.push(row);
    groups.set(key, current);
  });

  let rowCursor = 1;
  groups.forEach((groupRows) => {
    const first = groupRows[0];
    const productName = formatProductLabel(first);

    worksheet.getCell(rowCursor, 1).value = 'Produk';
    worksheet.getCell(rowCursor, 2).value = productName;
    worksheet.getCell(rowCursor, 1).font = { bold: true };
    worksheet.mergeCells(rowCursor, 2, rowCursor, 7);

    rowCursor += 2;

    worksheet.getRow(rowCursor).values = ['Tanggal', 'MMF/DO', 'Keterangan', 'Inbound', 'Outbound', 'Balance', 'Replenish'];
    worksheet.getRow(rowCursor).font = { bold: true };
    worksheet.getRow(rowCursor).alignment = { horizontal: 'center', vertical: 'middle' };
    for (let col = 1; col <= 7; col += 1) {
      worksheet.getCell(rowCursor, col).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFEFEFEF' },
      };
    }

    rowCursor += 1;

    groupRows.forEach((row) => {
      worksheet.getRow(rowCursor).values = [
        fmtExcelDate(row.transactionDate),
        row.mmfOrDo || '',
        row.description || '',
        Number(row.inbound ?? 0),
        Number(row.outbound ?? 0),
        Number(row.balance ?? 0),
        row.replenish || '',
      ];
      rowCursor += 1;
    });

    rowCursor += 1;
  });

  for (let r = 1; r <= rowCursor; r += 1) {
    for (let c = 1; c <= 7; c += 1) {
      const cell = worksheet.getCell(r, c);
      if (r > 0 && worksheet.getRow(r).values?.length) {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }
    }
  }

  return (await workbook.xlsx.writeBuffer()) as ArrayBuffer;
}
