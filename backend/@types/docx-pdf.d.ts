// docx-pdf.d.ts
declare module 'docx-pdf' {
    function convertDocxToPdf(
      docxPath: string, 
      pdfPath: string, 
      callback: (error: Error | null) => void
    ): void;
  
    export = convertDocxToPdf;
  }