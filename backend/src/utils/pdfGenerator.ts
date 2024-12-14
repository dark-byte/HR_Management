import { Employee } from '../models/employee.model';
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export async function generatePDF(employee: Employee): Promise<string> {
  const pdfDoc = await PDFDocument.create();

  const page = pdfDoc.addPage();
  page.drawText(`Employee Details`, { x: 50, y: 750, size: 20, color: rgb(0, 0, 1) });

  page.drawText(`Name: ${employee.name}`, { x: 50, y: 720, size: 12 });
  page.drawText(`Department: ${employee.department}`, { x: 50, y: 700, size: 12 });
  // Add more fields as needed...

  const pdfPath = path.join(__dirname, '../storage/pdfs', `employee-${employee._id}.pdf`);
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(pdfPath, pdfBytes);

  return `/pdfs/employee-${employee._id}.pdf`;
}