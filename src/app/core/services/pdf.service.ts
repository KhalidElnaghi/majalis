import { Injectable } from '@angular/core';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  async submit(elements: Record<string, HTMLElement>) {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const intro = await html2canvas(elements['intro']);
      const attendance = await html2canvas(elements['attendance']);
      const voting = await html2canvas(elements['voting']);

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      [intro, attendance, voting].forEach((canvas, index) => {
        if (index > 0) pdf.addPage();
        let position = 0;
        const canvasHeight = (canvas.height * imgWidth) / canvas.width;
        let canvasHeightLeft = canvasHeight;
        pdf.addImage(canvas, 'PNG', 0, position, imgWidth, canvasHeight);
        position -= pageHeight;
        canvasHeightLeft -= pageHeight;

        while (canvasHeightLeft >= 0) {
          position = canvasHeightLeft - canvasHeight;
          pdf.addPage();
          pdf.addImage(canvas, 'PNG', 0, position, imgWidth, canvasHeight);
          canvasHeightLeft -= pageHeight;
        }
      })
      return pdf.output('blob');
  }
}
