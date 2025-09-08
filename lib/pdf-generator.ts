import { Consultation } from './supabase';
import { PrescriptionDrugService } from './prescription-drug-service';

// Professional Medical PDF Report Generator - OPTIMIZED WITH PROPER SPACING
export class PDFGenerator {
  private static instance: PDFGenerator;
  private jsPDF: any;
  private readonly sectionGap = 14;

  private constructor() {
    this.loadJSPDF();
  }

  public static getInstance(): PDFGenerator {
    if (!PDFGenerator.instance) {
      PDFGenerator.instance = new PDFGenerator();
    }
    return PDFGenerator.instance;
  }

  private async loadJSPDF() {
    try {
      const { jsPDF } = await import('jspdf');
      this.jsPDF = jsPDF;
    } catch (error) {
      console.error('Failed to load jsPDF:', error);
    }
  }

  /**
   * Generate patient prescription PDF (optimized with proper spacing)
   */
  public async generatePatientPrescriptionPDF(consultation: Consultation): Promise<Blob> {
    if (!this.jsPDF) {
      await this.loadJSPDF();
    }

    const doc = new this.jsPDF({
      compress: true,
      precision: 2,
      userUnit: 1.0
    });
    
    const pageWidth = doc.internal.pageSize.getWidth(); // 210mm = 595 points
    const pageHeight = doc.internal.pageSize.getHeight(); // 297mm = 842 points
    const margin = 20; // 0.75 inch margins
    let yPosition = margin;

    // Add professional header
    yPosition = this.addProfessionalHeader(doc, yPosition, pageWidth, margin);
    
    // Add patient info with proper spacing
    yPosition = this.addPatientInfoBox(doc, consultation, yPosition, pageWidth, margin);
    
    // Add appointment info with proper spacing
    yPosition = this.addAppointmentInfoBox(doc, consultation, yPosition, pageWidth, margin);
    
    // Patient Portal PDF: Intentionally omit Prescription History (kept only for admin)
    
    // Add medical details with proper spacing
    yPosition = this.addMedicalDetailsBox(doc, consultation, yPosition, pageWidth, margin, pageHeight);
    
    // Add treatment info with proper spacing
    yPosition = this.addTreatmentInfoBox(doc, consultation, yPosition, pageWidth, margin, pageHeight);
    
    // Add service classification with proper spacing
    yPosition = this.addServiceInfoBox(doc, consultation, yPosition, pageWidth, margin, pageHeight);
    
    // Add professional footer
    this.addProfessionalFooter(doc, pageWidth, pageHeight);

    return doc.output('blob', {
      filename: 'prescription-report.pdf',
      compression: 'FAST'
    });
  }

  /**
   * Generate admin prescription PDF (optimized with proper spacing)
   */
  public async generateAdminPrescriptionPDF(consultation: Consultation): Promise<Blob> {
    if (!this.jsPDF) {
      await this.loadJSPDF();
    }

    const doc = new this.jsPDF({
      compress: true,
      precision: 2,
      userUnit: 1.0
    });
    
    const pageWidth = doc.internal.pageSize.getWidth(); // 210mm = 595 points
    const pageHeight = doc.internal.pageSize.getHeight(); // 297mm = 842 points
    const margin = 20; // 0.75 inch margins
    let yPosition = margin;

    // Add professional header
    yPosition = this.addProfessionalHeader(doc, yPosition, pageWidth, margin);
    
    // Add patient info with proper spacing
    yPosition = this.addPatientInfoBox(doc, consultation, yPosition, pageWidth, margin);
    
    // Add appointment info with proper spacing
    yPosition = this.addAppointmentInfoBox(doc, consultation, yPosition, pageWidth, margin);
    
    // Add prescription table with proper spacing
    yPosition = await this.addPrescriptionTable(doc, consultation, yPosition, pageWidth, margin, pageHeight);
    
    // Add medical details with proper spacing
    yPosition = this.addMedicalDetailsBox(doc, consultation, yPosition, pageWidth, margin, pageHeight);
    
    // Add treatment info with proper spacing
    yPosition = this.addTreatmentInfoBox(doc, consultation, yPosition, pageWidth, margin, pageHeight);
    
    // Add service classification with proper spacing
    yPosition = this.addServiceInfoBox(doc, consultation, yPosition, pageWidth, margin, pageHeight);
    
    // Add additional notes (admin only) with proper spacing
    yPosition = this.addAdditionalNotesBox(doc, consultation, yPosition, pageWidth, margin, pageHeight);
    
    // Add professional footer
    this.addProfessionalFooter(doc, pageWidth, pageHeight);

    return doc.output('blob', {
      filename: 'complete-medical-report.pdf',
      compression: 'FAST'
    });
  }

  /**
   * Add professional header with proper spacing
   */
  private addProfessionalHeader(doc: any, yPosition: number, pageWidth: number, margin: number): number {
    const centerX = pageWidth / 2;
    
    // Add small logo (top-left)
    try {
      doc.addImage('/images/branding/arogyam-logo.png', 'PNG', margin, yPosition, 20, 20, undefined, 'FAST');
    } catch (error) {
      console.log('Logo not available');
    }

    // Clinic name - professional styling (centered)
    doc.setFontSize(19);
    doc.setFont('helvetica', 'bold');
    doc.text('Dr Arogyam Homoeopathy', centerX, yPosition + 14, { align: 'center' });

    // Report title - professional styling (centered)
    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.text('Complete Medical Report', centerX, yPosition + 26, { align: 'center' });

    // Generated date - centered under title
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    doc.text(`Generated: ${currentDate}`, centerX, yPosition + 36, { align: 'center' });

    return yPosition + 46; // compact but clear
  }

  /**
   * Add section title with shaded background and proper spacing
   */
  private addSectionTitle(doc: any, title: string, yPosition: number, pageWidth: number, margin: number): number {
    // Horizontal line above
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    
    // Shaded title bar
    const titleHeight = 12;
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPosition + 2, pageWidth - (margin * 2), titleHeight, 'F');
    
    // Title text
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 8, yPosition + 10);
    
    // Horizontal line below
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition + titleHeight + 2, pageWidth - margin, yPosition + titleHeight + 2);
    
    return yPosition + titleHeight + 6; // slightly tighter spacing
  }

  /**
   * Add patient information in 2-column box with proper spacing
   */
  private addPatientInfoBox(doc: any, consultation: Consultation, yPosition: number, pageWidth: number, margin: number): number {
    // Section title
    yPosition = this.addSectionTitle(doc, 'Patient Information', yPosition, pageWidth, margin);
    
    // Draw main box (auto height based on rows)
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    
    // 2-column layout with proper spacing
    const colWidth = (pageWidth - (margin * 2)) / 2;
    const rowHeight = 12; // Increased row height
    const cellPadding = 6; // 6px padding inside cells
    
    const patientData = [
      ['Name', consultation.name],
      ['Age/Gender', `${consultation.age} years / ${consultation.gender}`],
      ['Phone', consultation.phone],
      ['Email', consultation.email || 'Not provided']
    ];
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    
    const boxHeight = cellPadding * 2 + patientData.length * rowHeight;
    doc.rect(margin, yPosition, pageWidth - (margin * 2), boxHeight);

    for (let i = 0; i < patientData.length; i++) {
      const rowY = yPosition + cellPadding + (i * rowHeight);
      
      // Vertical line between columns
      if (i === 0) {
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(margin + colWidth, yPosition, margin + colWidth, yPosition + boxHeight);
      }
      
      // Horizontal line between rows
      if (i > 0) {
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(margin, rowY - cellPadding, margin + (pageWidth - margin * 2), rowY - cellPadding);
      }
      
      // Left column (field name) - bold, vertically centered
      doc.setFont('helvetica', 'bold');
      doc.text(patientData[i][0], margin + cellPadding, rowY + rowHeight / 2, { baseline: 'middle' } as any);
      
      // Right column (value) - normal, vertically centered
      doc.setFont('helvetica', 'normal');
      doc.text(patientData[i][1], margin + colWidth + cellPadding, rowY + rowHeight / 2, { baseline: 'middle' } as any);
    }
    
    return yPosition + boxHeight + this.sectionGap; // consistent section spacing
  }

  /**
   * Add appointment info in 2-column box with proper spacing
   */
  private addAppointmentInfoBox(doc: any, consultation: Consultation, yPosition: number, pageWidth: number, margin: number): number {
    // Section title
    yPosition = this.addSectionTitle(doc, 'Appointment & Prescription Info', yPosition, pageWidth, margin);
    
    // Draw main box (auto height based on rows)
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    
    // 2-column layout with proper spacing
    const colWidth = (pageWidth - (margin * 2)) / 2;
    const rowHeight = 12; // Increased row height
    const cellPadding = 6; // 6px padding inside cells
    
    const infoData = [
      ['Prescription Date', this.formatDate(consultation.created_at)],
      ['Appointment Date', this.formatDate(consultation.preferred_date)],
      ['Enquiry ID', consultation.id.substring(0, 12) + '...']
    ];
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    
    const boxHeight = cellPadding * 2 + infoData.length * rowHeight;
    doc.rect(margin, yPosition, pageWidth - (margin * 2), boxHeight);

    for (let i = 0; i < infoData.length; i++) {
      const rowY = yPosition + cellPadding + (i * rowHeight);
      
      // Vertical line between columns
      if (i === 0) {
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(margin + colWidth, yPosition, margin + colWidth, yPosition + boxHeight);
      }
      
      // Horizontal line between rows
      if (i > 0) {
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(margin, rowY - cellPadding, margin + (pageWidth - margin * 2), rowY - cellPadding);
      }
      
      // Left column (field name) - bold, vertically centered
      doc.setFont('helvetica', 'bold');
      doc.text(infoData[i][0], margin + cellPadding, rowY + rowHeight / 2, { baseline: 'middle' } as any);
      
      // Right column (value) - normal, vertically centered
      doc.setFont('helvetica', 'normal');
      doc.text(infoData[i][1], margin + colWidth + cellPadding, rowY + rowHeight / 2, { baseline: 'middle' } as any);
    }
    
    return yPosition + boxHeight + this.sectionGap; // consistent section spacing
  }

  /**
   * Add prescription table with proper spacing and alignment
   */
  private async addPrescriptionTable(doc: any, consultation: Consultation, yPosition: number, pageWidth: number, margin: number, pageHeight: number): Promise<number> {
    // Section title
    yPosition = this.addSectionTitle(doc, 'Prescription History', yPosition, pageWidth, margin);
    
    try {
      // Fetch prescription drugs
      const prescriptionDrugs = await PrescriptionDrugService.getPrescriptionDrugs(consultation.id);
      
      if (prescriptionDrugs.length === 0) {
        // No prescriptions message
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('No prescriptions available.', margin, yPosition);
        return yPosition + 20;
      }

      // Check if we need a new page
      const requiredSpace = 30 + (prescriptionDrugs.length * 18); // Increased row height
      if (yPosition + requiredSpace > pageHeight - 50) {
        doc.addPage();
        yPosition = 20;
        yPosition = this.addSectionTitle(doc, 'Prescription History', yPosition, pageWidth, margin);
      }

      // Table dimensions with proper spacing
      const tableWidth = pageWidth - (margin * 2);
      const colWidths = [
        tableWidth * 0.25, // Drug
        tableWidth * 0.12, // Potency
        tableWidth * 0.10, // Dosage
        tableWidth * 0.15, // Repetition
        tableWidth * 0.10, // Quantity
        tableWidth * 0.10, // Period
        tableWidth * 0.18  // Remarks
      ];

      // Table header with proper spacing
      const headerY = yPosition;
      const headerHeight = 18; // Increased header height
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, headerY, tableWidth, headerHeight, 'F');
      
      // Header border
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.rect(margin, headerY, tableWidth, headerHeight);

      // Header text with proper spacing
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      const headers = ['Drug', 'Potency', 'Dosage', 'Repetition', 'Quantity', 'Period', 'Remarks'];
      let xPos = margin + 6; // 6px padding
      
      for (let i = 0; i < headers.length; i++) {
        doc.text(headers[i], xPos, headerY + 12); // Centered vertically
        xPos += colWidths[i];
      }

      yPosition = headerY + headerHeight;

      // Table rows with proper spacing
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      
      for (let i = 0; i < prescriptionDrugs.length; i++) {
        const drug = prescriptionDrugs[i];
        
        // Get common name for the drug
        const drugTemplates = await PrescriptionDrugService.getDrugTemplates();
        const template = drugTemplates.find(t => t.drug_name === drug.drug_name);
        const drugDisplayName = template?.common_name || drug.drug_name;
        
        // Row border
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.rect(margin, yPosition, tableWidth, 18); // Increased row height
        
        // Row data with proper alignment
        const rowData = [
          drugDisplayName,
          drug.potency || '-',
          drug.dosage || '-',
          drug.repetition_frequency && drug.repetition_interval && drug.repetition_unit 
            ? `${drug.repetition_frequency}/${drug.repetition_interval} ${drug.repetition_unit}`
            : '-',
          drug.quantity ? drug.quantity.toString() : '-',
          drug.period ? drug.period.toString() : '-',
          drug.remarks || '-'
        ];
        
        xPos = margin + 6; // 6px padding
        for (let j = 0; j < rowData.length; j++) {
          // Center align numeric columns (Dosage, Quantity, Period)
          const align = (j === 2 || j === 4 || j === 5) ? 'center' : 'left';
          doc.text(rowData[j], xPos + (align === 'center' ? colWidths[j] / 2 : 0), yPosition + 12, { align });
          xPos += colWidths[j];
        }
        
        yPosition += 18; // Increased row height
      }

      return yPosition + 12; // 12px space after section
    } catch (error) {
      console.error('Error adding prescription table:', error);
      return yPosition + 20;
    }
  }

  /**
   * Add medical details in 2-column box with proper spacing
   */
  private addMedicalDetailsBox(doc: any, consultation: Consultation, yPosition: number, pageWidth: number, margin: number, pageHeight: number): number {
    // Check if we need a new page
    if (yPosition + 60 > pageHeight - 50) {
      doc.addPage();
      yPosition = 20;
    }

    // Section title
    yPosition = this.addSectionTitle(doc, 'Medical Details', yPosition, pageWidth, margin);
    
    // Draw main box (auto height based on rows)
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    
    // 2-column layout with proper spacing
    const colWidth = (pageWidth - (margin * 2)) / 2;
    const rowHeight = 12; // Increased row height
    const cellPadding = 6; // 6px padding inside cells
    
    const medicalData = [
      ['Diagnosis', consultation.diagnosis || 'Not specified'],
      ['Symptoms', consultation.symptoms || 'Not specified'],
      ['Condition', consultation.condition || 'Not specified']
    ];
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    
    const boxHeight = cellPadding * 2 + medicalData.length * rowHeight;
    doc.rect(margin, yPosition, pageWidth - (margin * 2), boxHeight);

    for (let i = 0; i < medicalData.length; i++) {
      const rowY = yPosition + cellPadding + (i * rowHeight);
      
      // Vertical line between columns
      if (i === 0) {
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(margin + colWidth, yPosition, margin + colWidth, yPosition + boxHeight);
      }
      
      // Horizontal line between rows
      if (i > 0) {
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(margin, rowY - cellPadding, margin + (pageWidth - margin * 2), rowY - cellPadding);
      }
      
      // Left column (field name) - bold, vertically centered
      doc.setFont('helvetica', 'bold');
      doc.text(medicalData[i][0], margin + cellPadding, rowY + rowHeight / 2, { baseline: 'middle' } as any);
      
      // Right column (value) - normal, vertically centered
      doc.setFont('helvetica', 'normal');
      doc.text(medicalData[i][1], margin + colWidth + cellPadding, rowY + rowHeight / 2, { baseline: 'middle' } as any);
    }
    
    return yPosition + boxHeight + this.sectionGap; // consistent section spacing
  }

  /**
   * Add treatment info in 2-column box with proper spacing
   */
  private addTreatmentInfoBox(doc: any, consultation: Consultation, yPosition: number, pageWidth: number, margin: number, pageHeight: number): number {
    // Check if we need a new page
    if (yPosition + 60 > pageHeight - 50) {
      doc.addPage();
      yPosition = 20;
    }

    // Section title
    yPosition = this.addSectionTitle(doc, 'Treatment & Instructions', yPosition, pageWidth, margin);
    
    // Draw main box (auto height; estimate based on lines to avoid overflow)
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    
    // 2-column layout with proper spacing
    const colWidth = (pageWidth - (margin * 2)) / 2;
    const rowHeight = 12; // Increased row height
    const cellPadding = 6; // 6px padding inside cells
    
    const treatmentData = [
      ['Treatment Plan', consultation.treatment_plan || 'Not specified'],
      ['Instructions', consultation.dosage_instructions || 'Not specified'],
      ['Medicines', consultation.medicines_prescribed || 'Not specified']
    ];
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    
    // Prepare wrapped/structured content for each field
    const rightColWidth = (pageWidth - (margin * 2)) / 2 - cellPadding * 2;
    // Helper to sanitize list items (remove stray symbols like '-', '!', '*', '•' from start)
    const sanitizeItem = (text: string) => text.replace(/^[-!*•]+\s*/, '').trim();
    const valueLinesPerRow: string[][] = treatmentData.map(([label, value]) => {
      const safe = (value || '').trim();
      if (label === 'Instructions') {
        const parts = safe
          .split(/\r?\n|,|;|\u2022/g)
          .map(sanitizeItem)
          .filter(Boolean);
        const numbered = parts.length > 0 ? parts.map((p, idx) => `${idx + 1}. ${p}`) : ['Not specified'];
        return numbered
          .map(line => doc.splitTextToSize(line, rightColWidth) as string[])
          .flat();
      }
      if (label === 'Medicines') {
        const parts = safe
          .split(/\r?\n|,|;|\u2022/g)
          .map(sanitizeItem)
          .filter(Boolean);
        const bulleted = parts.length > 0 ? parts.map(p => `•   ${p}`) : ['Not specified'];
        return bulleted
          .map(line => doc.splitTextToSize(line, rightColWidth) as string[])
          .flat();
      }
      return doc.splitTextToSize(safe, rightColWidth) as string[];
    });

    const estimatedRows = valueLinesPerRow.map(lines => Math.max(1, lines.length));
    const boxHeight = cellPadding * 2 + estimatedRows.reduce((sum, n) => sum + n * rowHeight, 0);
    doc.rect(margin, yPosition, pageWidth - (margin * 2), boxHeight);

    let consumedRows = 0;
    for (let i = 0; i < treatmentData.length; i++) {
      const rowY = yPosition + cellPadding + (consumedRows * rowHeight);
      
      // Vertical line between columns
      if (i === 0) {
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(margin + colWidth, yPosition, margin + colWidth, yPosition + boxHeight);
      }
      
      // Horizontal line between rows
      if (i > 0) {
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(margin, rowY - cellPadding, margin + (pageWidth - margin * 2), rowY - cellPadding);
      }
      
      // Left column (field name) - bold, vertically centered for first line block
      doc.setFont('helvetica', 'bold');
      doc.text(treatmentData[i][0], margin + cellPadding, rowY + rowHeight / 2, { baseline: 'middle' } as any);
      
      // Right column (value) - normal (support wrapping, lists)
      doc.setFont('helvetica', 'normal');
      const valueLines = valueLinesPerRow[i];
      // Render line-by-line with consistent spacing and indentation preserved
      const startY = rowY + rowHeight / 2; // slight top padding
      const lineGap = rowHeight; // consistent vertical spacing
      valueLines.forEach((line, idx) => {
        doc.text(line, margin + colWidth + cellPadding, startY + idx * lineGap, { baseline: 'middle' } as any);
      });
      consumedRows += estimatedRows[i];
    }
    
    return yPosition + boxHeight + this.sectionGap; // consistent section spacing
  }

  /**
   * Add service info in 2-column box with proper spacing
   */
  private addServiceInfoBox(doc: any, consultation: Consultation, yPosition: number, pageWidth: number, margin: number, pageHeight: number): number {
    // Check if we need a new page
    if (yPosition + 50 > pageHeight - 50) {
      doc.addPage();
      yPosition = 20;
    }

    // Section title
    yPosition = this.addSectionTitle(doc, 'Service Classification', yPosition, pageWidth, margin);
    
    // Draw main box (auto height based on rows)
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    
    // 2-column layout with proper spacing
    const colWidth = (pageWidth - (margin * 2)) / 2;
    const rowHeight = 12; // Increased row height
    const cellPadding = 6; // 6px padding inside cells
    
    const serviceData = [
      ['Service', consultation.service_type || 'Not specified'],
      ['Segment', consultation.segment || 'Not specified'],
      ['Case Type', consultation.case_type || 'Not specified']
    ];
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    
    const boxHeight = cellPadding * 2 + serviceData.length * rowHeight;
    doc.rect(margin, yPosition, pageWidth - (margin * 2), boxHeight);

    for (let i = 0; i < serviceData.length; i++) {
      const rowY = yPosition + cellPadding + (i * rowHeight);
      
      // Vertical line between columns
      if (i === 0) {
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(margin + colWidth, yPosition, margin + colWidth, yPosition + boxHeight);
      }
      
      // Horizontal line between rows
      if (i > 0) {
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(margin, rowY - cellPadding, margin + (pageWidth - margin * 2), rowY - cellPadding);
      }
      
      // Left column (field name) - bold, vertically centered
      doc.setFont('helvetica', 'bold');
      doc.text(serviceData[i][0], margin + cellPadding, rowY + rowHeight / 2, { baseline: 'middle' } as any);
      
      // Right column (value) - normal, vertically centered
      doc.setFont('helvetica', 'normal');
      doc.text(serviceData[i][1], margin + colWidth + cellPadding, rowY + rowHeight / 2, { baseline: 'middle' } as any);
    }
    
    return yPosition + boxHeight + this.sectionGap; // consistent section spacing
  }

  /**
   * Add additional notes in bordered box with proper spacing (admin only)
   */
  private addAdditionalNotesBox(doc: any, consultation: Consultation, yPosition: number, pageWidth: number, margin: number, pageHeight: number): number {
    // Check if we need a new page
    if (yPosition + 50 > pageHeight - 50) {
      doc.addPage();
      yPosition = 20;
    }

    // Section title
    yPosition = this.addSectionTitle(doc, 'Additional Notes', yPosition, pageWidth, margin);
    
    // Draw main box
    const boxHeight = 40; // Increased height for proper spacing
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(margin, yPosition, pageWidth - (margin * 2), boxHeight);
    
    // Additional notes content with proper padding
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    
    let notesText = '';
    if (consultation.notes) notesText += `Notes: ${consultation.notes}\n`;
    if (consultation.remarks) notesText += `Remarks: ${consultation.remarks}\n`;
    if (consultation.associated_segments && consultation.associated_segments.length > 0) {
      notesText += `Associated Segments: ${consultation.associated_segments.join(', ')}`;
    }
    
    if (notesText) {
      // Split text into lines for proper wrapping with padding
      const lines = doc.splitTextToSize(notesText, pageWidth - (margin * 2) - 12); // 6px padding on each side
      doc.text(lines, margin + 6, yPosition + 12); // 6px padding
    } else {
      doc.text('No additional notes available.', margin + 6, yPosition + 12);
    }
    
    return yPosition + boxHeight + 12; // 12px space after section
  }

  /**
   * Add professional footer with proper spacing
   */
  private addProfessionalFooter(doc: any, pageWidth: number, pageHeight: number): void {
    const footerY = pageHeight - 34; // Extra spacing above footer
    
    // Footer content with proper spacing
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('Arogyam Homoeopathy - Professional Healthcare Services', pageWidth / 2, footerY, { align: 'center' });
    
    doc.setFontSize(8);
    doc.text('This document is generated electronically and is valid without signature', pageWidth / 2, footerY + 10, { align: 'center' });
  }

  /**
   * Format date for display
   */
  private formatDate(dateString: string | null): string {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}

// Export singleton instance
export const pdfGenerator = PDFGenerator.getInstance();