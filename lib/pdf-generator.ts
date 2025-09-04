import { Consultation } from './supabase';
import { PrescriptionDrugService } from './prescription-drug-service';

// PDF generation utility using jsPDF
export class PDFGenerator {
  private static instance: PDFGenerator;
  private jsPDF: any;

  private constructor() {
    // Lazy load jsPDF to avoid SSR issues
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

  private checkAndAddPage(doc: any, yPosition: number, requiredSpace: number = 20) {
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      return margin;
    }
    return yPosition;
  }





  /**
   * Generate patient prescription PDF (limited info for patient view)
   */
  public async generatePatientPrescriptionPDF(consultation: Consultation): Promise<Blob> {
    if (!this.jsPDF) {
      await this.loadJSPDF();
    }

    const doc = new this.jsPDF({
      compress: true, // Enable compression
      precision: 2, // Reduce precision to save space
      userUnit: 1.0 // Standard unit
    });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;
    let currentPage = 1;

    // Add professional header (same as admin)
    yPosition = this.addProfessionalHeader(doc, yPosition, pageWidth);
    
    // Add Patient Information section (same as admin)
    yPosition = this.addPatientInfoSection(doc, consultation, yPosition, pageHeight, margin);
    yPosition = this.checkAndAddPageForAdmin(doc, yPosition, pageHeight, margin, currentPage);
    if (yPosition === margin) currentPage++;
    
    // Add Service Information section (without Case Type for patients)
    yPosition = this.addPatientServiceInfoSection(doc, consultation, yPosition, pageHeight, margin);
    yPosition = this.checkAndAddPageForAdmin(doc, yPosition, pageHeight, margin, currentPage);
    if (yPosition === margin) currentPage++;
    
    // Add Medical Information section (same as admin)
    yPosition = this.addMedicalInfoSection(doc, consultation, yPosition, pageHeight, margin);
    yPosition = this.checkAndAddPageForAdmin(doc, yPosition, pageHeight, margin, currentPage);
    if (yPosition === margin) currentPage++;
    
    // Add prescription drugs section (same as admin)
    const contentWidth = pageWidth - (margin * 2);
    yPosition = await this.addPrescriptionDrugsSection(doc, consultation, yPosition, margin, contentWidth, pageHeight);
    yPosition = this.checkAndAddPageForAdmin(doc, yPosition, pageHeight, margin, currentPage);
    if (yPosition === margin) currentPage++;
    
    // Add professional footer (same as admin)
    this.addProfessionalFooter(doc, pageWidth, pageHeight);

    return doc.output('blob', {
      filename: 'patient-prescription.pdf',
      compression: 'FAST' // Fast compression for smaller file size
    });
  }

  /**
   * Generate admin prescription PDF (full info for admin view)
   */
  public async generateAdminPrescriptionPDF(consultation: Consultation): Promise<Blob> {
    if (!this.jsPDF) {
      await this.loadJSPDF();
    }

    const doc = new this.jsPDF({
      compress: true, // Enable compression
      precision: 2, // Reduce precision to save space
      userUnit: 1.0 // Standard unit
    });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;
    let currentPage = 1;

    // Add professional header
    yPosition = this.addProfessionalHeader(doc, yPosition, pageWidth);
    
    // Add all content sections with smart page management
    yPosition = this.addPatientInfoSection(doc, consultation, yPosition, pageHeight, margin);
    yPosition = this.checkAndAddPageForAdmin(doc, yPosition, pageHeight, margin, currentPage);
    if (yPosition === margin) currentPage++;
    
    yPosition = this.addServiceInfoSection(doc, consultation, yPosition, pageHeight, margin);
    yPosition = this.checkAndAddPageForAdmin(doc, yPosition, pageHeight, margin, currentPage);
    if (yPosition === margin) currentPage++;
    
    yPosition = this.addMedicalInfoSection(doc, consultation, yPosition, pageHeight, margin);
    yPosition = this.checkAndAddPageForAdmin(doc, yPosition, pageHeight, margin, currentPage);
    if (yPosition === margin) currentPage++;
    
    yPosition = this.addAdditionalNotesSection(doc, consultation, yPosition, pageHeight, margin);
    yPosition = this.checkAndAddPageForAdmin(doc, yPosition, pageHeight, margin, currentPage);
    if (yPosition === margin) currentPage++;
    
    // Add prescription drugs section
    yPosition = await this.addPrescriptionDrugsSection(doc, consultation, yPosition, margin, contentWidth, pageHeight);
    yPosition = this.checkAndAddPageForAdmin(doc, yPosition, pageHeight, margin, currentPage);
    if (yPosition === margin) currentPage++;
    
    // Add professional footer
    this.addProfessionalFooter(doc, pageWidth, pageHeight);

    return doc.output('blob', {
      filename: 'prescription-report.pdf',
      compression: 'FAST' // Fast compression for smaller file size
    });
  }

  /**
   * Generate patient information PDF for admin download
   */
  public async generatePatientInfoPDF(consultation: Consultation): Promise<Blob> {
    if (!this.jsPDF) {
      await this.loadJSPDF();
    }

    const doc = new this.jsPDF({
      compress: true, // Enable compression
      precision: 2, // Reduce precision to save space
      userUnit: 1.0 // Standard unit
    });
    
    // Header
    this.addHeader(doc, 'Patient Information Report');
    
    // Complete Patient Information
    this.addCompletePatientInfoSection(doc, consultation);
    
    // Footer
    this.addFooter(doc);
    
    return doc.output('blob', {
      filename: 'patient-info.pdf',
      compression: 'FAST' // Fast compression for smaller file size
    });
  }

  private addHeader(doc: any, title: string) {
    const centerX = 105; // Center of page
    const margin = 15; // Reduced margin for closer positioning
    
    // Add logo in top left corner with better positioning
    try {
      // Add logo image (25x25 pixels) - larger size, positioned closer to edges
      doc.addImage('/images/branding/arogyam-logo.png', 'PNG', margin, margin, 25, 25, undefined, 'FAST');
    } catch (error) {
      // Fallback: just use text if logo fails to load
      console.log('Logo not available, using text fallback');
    }
    
    // Clinic Name - most prominent
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Arogyam Homoeopathy', centerX, 20, { align: 'center' });
    
    // Title - secondary, less bold
    doc.setFontSize(14); // Reduced from 16
    doc.setFont('helvetica', 'normal'); // Changed from bold to normal
    doc.text(title, centerX, 38, { align: 'center' }); // Increased spacing from 35 to 38
    
    // Date - smallest
    doc.setFontSize(9); // Reduced from 10
    doc.setFont('helvetica', 'italic'); // Changed to italic for better hierarchy
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, centerX, 50, { align: 'center' }); // Increased spacing from 45 to 50
    
    // Add subtle separator line
    doc.setDrawColor(200, 200, 200); // Light gray color
    doc.setLineWidth(0.5);
    doc.line(20, 55, 190, 55); // Moved separator down and made it subtle
  }









  private addCompletePatientInfoSection(doc: any, consultation: Consultation) {
    let yPosition = 70;
    
    yPosition = this.checkAndAddPage(doc, yPosition, 30);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Complete Patient Information', 20, yPosition);
    yPosition += 20;
    
    // Personal Information
    yPosition = this.checkAndAddPage(doc, yPosition, 20);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Personal Information', 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    yPosition = this.checkAndAddPage(doc, yPosition, 15);
    doc.text(`Name: ${consultation.name}`, 20, yPosition);
    yPosition += 15;
    
    yPosition = this.checkAndAddPage(doc, yPosition, 15);
    doc.text(`Age: ${consultation.age} years`, 20, yPosition);
    yPosition += 15;
    
    yPosition = this.checkAndAddPage(doc, yPosition, 15);
    doc.text(`Gender: ${consultation.gender}`, 20, yPosition);
    yPosition += 15;
    
    yPosition = this.checkAndAddPage(doc, yPosition, 15);
    doc.text(`Phone: ${consultation.phone}`, 20, yPosition);
    yPosition += 15;
    
    if (consultation.email) {
      yPosition = this.checkAndAddPage(doc, yPosition, 15);
      doc.text(`Email: ${consultation.email}`, 20, yPosition);
      yPosition += 15;
    }
    
    yPosition += 10;
    
    // Consultation Details
    yPosition = this.checkAndAddPage(doc, yPosition, 20);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Consultation Details', 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    yPosition = this.checkAndAddPage(doc, yPosition, 15);
    doc.text(`Consultation ID: ${consultation.id}`, 20, yPosition);
    yPosition += 15;
    
    yPosition = this.checkAndAddPage(doc, yPosition, 15);
    doc.text(`Status: ${consultation.status || 'Pending'}`, 20, yPosition);
    yPosition += 15;
    
    yPosition = this.checkAndAddPage(doc, yPosition, 15);
    doc.text(`Consultation Type: ${consultation.consultation_type}`, 20, yPosition);
    yPosition += 15;
    
    yPosition = this.checkAndAddPage(doc, yPosition, 15);
    doc.text(`Preferred Date: ${this.formatDate(consultation.preferred_date)}`, 20, yPosition);
    yPosition += 15;
    
    yPosition = this.checkAndAddPage(doc, yPosition, 15);
    doc.text(`Preferred Time: ${this.formatTime(consultation.preferred_time)}`, 20, yPosition);
    yPosition += 15;
    
    yPosition = this.checkAndAddPage(doc, yPosition, 15);
    doc.text(`Created: ${this.formatDate(consultation.created_at)}`, 20, yPosition);
    yPosition += 15;
    
    yPosition += 10;
    
    // Service Information
    if (consultation.service_type || consultation.segment || consultation.sub_segment) {
      yPosition = this.checkAndAddPage(doc, yPosition, 20);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Service Information', 20, yPosition);
      yPosition += 15;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      if (consultation.service_type) {
        yPosition = this.checkAndAddPage(doc, yPosition, 15);
        doc.text(`Service Type: ${consultation.service_type}`, 20, yPosition);
        yPosition += 15;
      }
      
      if (consultation.segment) {
        yPosition = this.checkAndAddPage(doc, yPosition, 15);
        doc.text(`Segment: ${consultation.segment}`, 20, yPosition);
        yPosition += 15;
      }
      
      if (consultation.sub_segment) {
        yPosition = this.checkAndAddPage(doc, yPosition, 15);
        doc.text(`Sub-Segment: ${consultation.sub_segment}`, 20, yPosition);
        yPosition += 15;
      }
      
      if (consultation.sub_sub_segment_text) {
        yPosition = this.checkAndAddPage(doc, yPosition, 15);
        doc.text(`Sub-Sub-Segment: ${consultation.sub_sub_segment_text}`, 20, yPosition);
        yPosition += 15;
      }
      
      if (consultation.case_type) {
        yPosition = this.checkAndAddPage(doc, yPosition, 15);
        doc.text(`Case Type: ${consultation.case_type}`, 20, yPosition);
        yPosition += 15;
      }
      
      if (consultation.remarks) {
        yPosition = this.checkAndAddPage(doc, yPosition, 15);
        doc.text(`Remarks: ${consultation.remarks}`, 20, yPosition);
        yPosition += 15;
      }
      
      if (consultation.manual_case_type) {
        yPosition = this.checkAndAddPage(doc, yPosition, 15);
        doc.text(`Manual Case Type: ${consultation.manual_case_type}`, 20, yPosition);
        yPosition += 15;
      }
      
      if (consultation.associated_segments && consultation.associated_segments.length > 0) {
        yPosition = this.checkAndAddPage(doc, yPosition, 15);
        doc.text(`Associated Segments: ${consultation.associated_segments.join(', ')}`, 20, yPosition);
        yPosition += 15;
      }
      
      yPosition += 5;
    }
    
    // Medical Information
    if (consultation.condition || consultation.treatment_type || consultation.medicines_prescribed || consultation.describe_it || consultation.segment || consultation.sub_segment) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Medical Information', 20, yPosition);
      yPosition += 15; // More space after title
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      if (consultation.condition) {
        doc.text(`Condition: ${consultation.condition}`, 20, yPosition);
        yPosition += 12; // More space between items
      }
      
      if (consultation.treatment_type) {
        doc.text(`Treatment Type: ${consultation.treatment_type}`, 20, yPosition);
        yPosition += 12;
      }
      
      if (consultation.medicines_prescribed) {
        doc.text(`Medicines Prescribed: ${consultation.medicines_prescribed}`, 20, yPosition);
        yPosition += 12;
      }
      
      if (consultation.dosage_instructions) {
        doc.text(`Dosage Instructions: ${consultation.dosage_instructions}`, 20, yPosition);
        yPosition += 12;
      }
      
      if (consultation.segment) {
        doc.text(`Segment: ${consultation.segment}`, 20, yPosition);
        yPosition += 12;
      }
      
      if (consultation.sub_segment) {
        doc.text(`Sub-Segment: ${consultation.sub_segment}`, 20, yPosition);
        yPosition += 12;
      }
      
      if (consultation.describe_it) {
        doc.text(`Description: ${consultation.describe_it}`, 20, yPosition);
        yPosition += 12;
      }
      
      yPosition += 10; // More space after section
    }
    
    // Notes
    if (consultation.notes) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Notes', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(consultation.notes, 20, yPosition);
    }
  }

  private addFooter(doc: any) {
    const pageHeight = doc.internal.pageSize.height;
    
    doc.line(20, pageHeight - 30, 190, pageHeight - 30);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Arogyam Homoeopathy - Professional Healthcare Services', 105, pageHeight - 20, { align: 'center' });
    doc.text('This document is generated electronically and is valid without signature', 105, pageHeight - 15, { align: 'center' });
  }

  private formatDate(dateString: string | null): string {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private formatTime(timeString: string | null): string {
    if (!timeString) return 'Not specified';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }





  private addPageNumber(doc: any, pageNumber: number, pageWidth: number, pageHeight: number) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${pageNumber}`, pageWidth - 20, pageHeight - 10, { align: 'right' });
  }

  // ===== PROFESSIONAL MEDICAL REPORT FORMATTING METHODS =====

  /**
   * Add professional header with clinic name, report title, and generation date
   */
  private addProfessionalHeader(doc: any, yPosition: number, pageWidth: number): number {
    const centerX = pageWidth / 2;
    const margin = 15; // Reduced margin for closer positioning
    
    // Add logo in top left corner with better positioning
    try {
      // Add logo image (25x25 pixels) - larger size, positioned closer to edges
      doc.addImage('/images/branding/arogyam-logo.png', 'PNG', margin, margin, 25, 25, undefined, 'FAST');
    } catch (error) {
      // Fallback: just use text if logo fails to load
      console.log('Logo not available, using text fallback');
    }

    // Clinic name - large, bold, centered (most prominent)
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Arogyam Homoeopathy', centerX, yPosition, { align: 'center' });
    yPosition += 18; // Increased spacing from 12 to 18

    // Report title - medium, centered, less bold (secondary)
    doc.setFontSize(12); // Reduced from 14 to make it secondary
    doc.setFont('helvetica', 'normal'); // Changed from bold to normal
    doc.text('Prescription Report', centerX, yPosition, { align: 'center' });
    yPosition += 15; // Increased spacing from 10 to 15

    // Generation date - small, centered (smallest)
    doc.setFontSize(9); // Slightly reduced from 10
    doc.setFont('helvetica', 'italic');
    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    doc.text(`Generated on: ${currentDate}`, centerX, yPosition, { align: 'center' });
    yPosition += 20;

    // Add subtle separator line below header
    doc.setDrawColor(200, 200, 200); // Light gray color
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 15; // Space after separator

    return yPosition;
  }

  /**
   * Add section separator line
   */
  private addSectionSeparator(doc: any, yPosition: number, margin: number): number {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const separator = '-------------------------------';
    doc.text(separator, margin, yPosition);
    yPosition += 8;
    return yPosition;
  }

  /**
   * Add section title with separator
   */
  private addSectionTitle(doc: any, title: string, yPosition: number, margin: number): number {
    // Section separator
    yPosition = this.addSectionSeparator(doc, yPosition, margin);
    
    // Section title
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, yPosition);
    yPosition += 8;
    
    // Section separator
    yPosition = this.addSectionSeparator(doc, yPosition, margin);
    yPosition += 8;
    
    return yPosition;
  }

  /**
   * Add field with consistent formatting
   */
  private addField(doc: any, label: string, value: string, yPosition: number, margin: number): number {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const displayValue = value || 'Not provided';
    doc.text(`${label}: ${displayValue}`, margin, yPosition);
    yPosition += 6;
    
    return yPosition;
  }

  /**
   * Add field with text wrapping for long content
   */
  private addFieldWithWrapping(doc: any, label: string, value: string, yPosition: number, margin: number, contentWidth: number): number {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const displayValue = value || 'Not provided';
    const fullText = `${label}: ${displayValue}`;
    
    // Split text into lines if too long
    const lines = doc.splitTextToSize(fullText, contentWidth - (margin * 2));
    
    for (let i = 0; i < lines.length; i++) {
      doc.text(lines[i], margin, yPosition);
      yPosition += 6;
    }
    
    return yPosition;
  }

  /**
   * Check if we need a new page and add one if necessary (for admin PDF)
   */
  private checkAndAddPageForAdmin(doc: any, yPosition: number, pageHeight: number, margin: number, currentPage: number): number {
    const footerSpace = 40; // Space needed for footer
    const minContentSpace = 50; // Minimum space needed for content
    
    if (yPosition + minContentSpace > pageHeight - footerSpace) {
      doc.addPage();
      this.addPageNumber(doc, currentPage + 1, doc.internal.pageSize.getWidth(), pageHeight);
      return margin; // Start from top of new page
    }
    
    return yPosition;
  }

  /**
   * Add Patient Information section
   */
  private addPatientInfoSection(doc: any, consultation: Consultation, yPosition: number, _pageHeight: number, margin: number): number {
    
    // Add section title
    yPosition = this.addSectionTitle(doc, 'Patient Information', yPosition, margin);
    
    // Add patient fields
    yPosition = this.addField(doc, 'Name', consultation.name, yPosition, margin);
    yPosition = this.addField(doc, 'Age', `${consultation.age} years`, yPosition, margin);
    yPosition = this.addField(doc, 'Gender', consultation.gender, yPosition, margin);
    yPosition = this.addField(doc, 'Phone', consultation.phone, yPosition, margin);
    yPosition = this.addField(doc, 'Email', consultation.email || 'no email provided', yPosition, margin);
    yPosition = this.addField(doc, 'Consultation ID', consultation.id, yPosition, margin);
    yPosition = this.addField(doc, 'Status', consultation.status || 'Pending', yPosition, margin);
    yPosition = this.addField(doc, 'Preferred Date', this.formatDate(consultation.preferred_date), yPosition, margin);
    yPosition = this.addField(doc, 'Preferred Time', this.formatTime(consultation.preferred_time), yPosition, margin);
    
    yPosition += 10;
    return yPosition;
  }

  /**
   * Add Service Information section
   */
  private addServiceInfoSection(doc: any, consultation: Consultation, yPosition: number, _pageHeight: number, margin: number): number {
    
    // Add section title
    yPosition = this.addSectionTitle(doc, 'Service Information', yPosition, margin);
    
    // Add service fields
    yPosition = this.addField(doc, 'Service Type', consultation.service_type || 'Not specified', yPosition, margin);
    yPosition = this.addField(doc, 'Segment', consultation.segment || 'Not specified', yPosition, margin);
    yPosition = this.addField(doc, 'Sub-Segment', consultation.sub_segment || 'Not specified', yPosition, margin);
    yPosition = this.addField(doc, 'Case Type', consultation.case_type || 'Not specified', yPosition, margin);
    
    yPosition += 10;
    return yPosition;
  }

  /**
   * Add Service Information section for patients (without Case Type)
   */
  private addPatientServiceInfoSection(doc: any, consultation: Consultation, yPosition: number, _pageHeight: number, margin: number): number {
    
    // Add section title
    yPosition = this.addSectionTitle(doc, 'Service Information', yPosition, margin);
    
    // Add service fields (without Case Type for patients)
    yPosition = this.addField(doc, 'Service Type', consultation.service_type || 'Not specified', yPosition, margin);
    yPosition = this.addField(doc, 'Segment', consultation.segment || 'Not specified', yPosition, margin);
    yPosition = this.addField(doc, 'Sub-Segment', consultation.sub_segment || 'Not specified', yPosition, margin);
    // Note: Case Type is intentionally omitted for patient view
    
    yPosition += 10;
    return yPosition;
  }

  /**
   * Add Medical Information section
   */
  private addMedicalInfoSection(doc: any, consultation: Consultation, yPosition: number, _pageHeight: number, margin: number): number {
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (margin * 2);
    
    // Add section title
    yPosition = this.addSectionTitle(doc, 'Medical Information', yPosition, margin);
    
    // Add medical fields
    yPosition = this.addField(doc, 'Treatment Type', consultation.consultation_type || 'General Consultation', yPosition, margin);
    
    // Only show prescription info if medicines are prescribed
    if (consultation.medicines_prescribed) {
      yPosition = this.addFieldWithWrapping(doc, 'Medicines Prescribed', consultation.medicines_prescribed, yPosition, margin, contentWidth);
    }
    
    if (consultation.dosage_instructions) {
      yPosition = this.addFieldWithWrapping(doc, 'Dosage Instructions', consultation.dosage_instructions, yPosition, margin, contentWidth);
    }
    
    yPosition = this.addField(doc, 'Segment', consultation.segment || 'Not specified', yPosition, margin);
    yPosition = this.addField(doc, 'Sub-Segment', consultation.sub_segment || 'Not specified', yPosition, margin);
    
    if (consultation.condition) {
      yPosition = this.addFieldWithWrapping(doc, 'Description', consultation.condition, yPosition, margin, contentWidth);
    }
    
    yPosition += 10;
    return yPosition;
  }

  /**
   * Add Additional Notes section
   */
  private addAdditionalNotesSection(doc: any, consultation: Consultation, yPosition: number, _pageHeight: number, margin: number): number {
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (margin * 2);
    
    // Add section title
    yPosition = this.addSectionTitle(doc, 'Additional Notes', yPosition, margin);
    
    // Add notes fields with text wrapping
    if (consultation.notes) {
      yPosition = this.addFieldWithWrapping(doc, 'Notes', consultation.notes, yPosition, margin, contentWidth);
    }
    
    if (consultation.remarks) {
      yPosition = this.addFieldWithWrapping(doc, 'Remarks', consultation.remarks, yPosition, margin, contentWidth);
    }
    
    if (consultation.manual_case_type) {
      yPosition = this.addFieldWithWrapping(doc, 'Manual Case Type', consultation.manual_case_type, yPosition, margin, contentWidth);
    }
    
    if (consultation.associated_segments && consultation.associated_segments.length > 0) {
      yPosition = this.addFieldWithWrapping(doc, 'Associated Segments', consultation.associated_segments.join(', '), yPosition, margin, contentWidth);
    }
    
    yPosition += 10;
    return yPosition;
  }

  /**
   * Add professional footer
   */
  private addProfessionalFooter(doc: any, pageWidth: number, pageHeight: number): void {
    const footerY = pageHeight - 30;
    
    // Section separator
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const separator = '-------------------------------';
    doc.text(separator, pageWidth / 2, footerY, { align: 'center' });
    
    // Footer content
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Arogyam Homoeopathy - Professional Healthcare Services', pageWidth / 2, footerY + 8, { align: 'center' });
    doc.text('This document is generated electronically and is valid without signature.', pageWidth / 2, footerY + 16, { align: 'center' });
  }

  /**
   * Add prescription drugs section to PDF
   */
  private async addPrescriptionDrugsSection(doc: any, consultation: Consultation, yPosition: number, margin: number, contentWidth: number, pageHeight: number): Promise<number> {
    try {
      // Fetch prescription drugs for this consultation
      const prescriptionDrugs = await PrescriptionDrugService.getPrescriptionDrugs(consultation.id);
      
      if (prescriptionDrugs.length === 0) {
        return yPosition;
      }

      // Add section title
      yPosition = this.checkAndAddPageForAdmin(doc, yPosition, pageHeight, margin, 1);
      yPosition = this.addSectionTitle(doc, 'Prescription Drugs', yPosition, margin);
      
      // Add each drug
      for (const drug of prescriptionDrugs) {
        yPosition = this.checkAndAddPageForAdmin(doc, yPosition, pageHeight, margin, 1);
        
        // Get common name for the drug
        const drugTemplates = await PrescriptionDrugService.getDrugTemplates();
        const template = drugTemplates.find(t => t.drug_name === drug.drug_name);
        
        // Show only common name for patients
        const drugDisplayName = template?.common_name || drug.drug_name;
        
        yPosition = this.addFieldWithWrapping(doc, 'Drug Name', drugDisplayName, yPosition, margin, contentWidth);
        
        if (drug.potency) {
          yPosition = this.addField(doc, 'Potency', drug.potency, yPosition, margin);
        }
        if (drug.dosage) {
          yPosition = this.addField(doc, 'Dosage', drug.dosage, yPosition, margin);
        }
        if (drug.repetition_frequency && drug.repetition_interval && drug.repetition_unit) {
          const repetition = `${drug.repetition_frequency} x ${drug.repetition_interval} ${drug.repetition_unit}`;
          yPosition = this.addField(doc, 'Repetition', repetition, yPosition, margin);
        }
        if (drug.quantity) {
          yPosition = this.addField(doc, 'Quantity', drug.quantity.toString(), yPosition, margin);
        }
        if (drug.period) {
          yPosition = this.addField(doc, 'Period', `${drug.period} days`, yPosition, margin);
        }
        if (drug.remarks) {
          yPosition = this.addFieldWithWrapping(doc, 'Remarks', drug.remarks, yPosition, margin, contentWidth);
        }
        
        // Add separator between drugs
        yPosition += 5;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPosition, margin + contentWidth, yPosition);
        yPosition += 10;
      }
      
      return yPosition;
    } catch (error) {
      console.error('Error adding prescription drugs section:', error);
      return yPosition;
    }
  }
}

// Export singleton instance
export const pdfGenerator = PDFGenerator.getInstance();
