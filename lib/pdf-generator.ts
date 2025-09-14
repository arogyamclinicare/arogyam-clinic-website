import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Consultation } from './supabase';
import { errorHandler, ErrorCategory } from './error-handling/production-error-handler';
import { newPDFGenerator } from './pdf-generator-new';

// Professional Medical PDF Report Generator - CLEAN AUTO-SCALING LAYOUT
export class PDFGenerator {
  private static instance: PDFGenerator;

  private constructor() {
    // Empty block
  }

  public static getInstance(): PDFGenerator {
    if (!PDFGenerator.instance) {
      PDFGenerator.instance = new PDFGenerator();
    }
    return PDFGenerator.instance;
  }

  /**
   * Generate patient prescription PDF with new handwritten form layout
   */
  public async generatePatientPrescriptionPDF(consultation: Consultation): Promise<Blob> {
    return newPDFGenerator.generatePatientPrescriptionPDF(consultation);
  }

  /**
   * Generate admin prescription PDF (uses same new layout)
   */
  public async generateAdminPrescriptionPDF(consultation: Consultation): Promise<Blob> {
    return newPDFGenerator.generateAdminPrescriptionPDF(consultation);
  }

  /**
   * Core PDF generation for PATIENT portal (excludes sensitive info)
   */
  private async generatePatientPDF(consultation: Consultation): Promise<Blob> {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 40;
    let y = margin;

    // ========== HEADER ==========
    // Add Arogyam logo
    try {
      // Load the actual Arogyam logo from public folder - make it much larger and more prominent
      const logoPath = './images/branding/arogyam-logo.png';
      doc.addImage(logoPath, 'PNG', margin, y, 60, 60, undefined, 'FAST');
    } catch (error) {
      // Fallback to placeholder logo if image fails to load - make it much larger
      errorHandler.handleError(error, ErrorCategory.SYSTEM, 'pdf_generation', 'logo_loading');
      doc.setFillColor(59, 130, 246); // Blue color to match website
      doc.circle(margin + 30, y + 30, 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text('A', margin + 24, y + 38);
      doc.setTextColor(0, 0, 0);
    }

    // Clinic name with logo spacing - updated name and blue color
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246); // Blue color to match website
    doc.text("Arogyam Clinic", doc.internal.pageSize.getWidth() / 2, y + 35, { align: "center" });

    // Add contact information below clinic name
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Email: arogyamclinicare@gmail.com | Web: https://www.arogyamhomeo.com/", doc.internal.pageSize.getWidth() / 2, y + 50, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    y += 75; // Increased spacing to accommodate contact info
    doc.text("Prescription Report", doc.internal.pageSize.getWidth() / 2, y, { align: "center" });

    y += 15;
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`, doc.internal.pageSize.getWidth() / 2, y, { align: "center" });
    
    // Add security/compliance notice
    y += 12;
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text("[CONFIDENTIAL] MEDICAL DOCUMENT - For Patient Use Only", doc.internal.pageSize.getWidth() / 2, y, { align: "center" });
    y += 20;

    // ========= HELPER FOR TABLES =========
    const addTable = (title: string, data: [string, string][]) => {
      // Section header
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(title, margin, y);
      y += 8;

      // Auto-scaling table with single-column layout
      autoTable(doc, {
        startY: y,
        head: [],
        body: data,
        theme: "grid",
        styles: { 
          fontSize: 10, 
          cellPadding: 8,
          halign: 'left',
          valign: 'middle'
        },
        columnStyles: {
          0: { fontStyle: 'bold', fillColor: [248, 249, 250], cellWidth: 120 },
          1: { cellWidth: 'auto' }
        },
        headStyles: { fillColor: [240, 240, 240] },
        margin: { left: margin, right: margin },
        tableWidth: 'auto',
        didDrawPage: () => {
    // Empty block
  }
      });

      // Update y position after table
      y = (doc as any).lastAutoTable.finalY + 20;
    };

    // ========= PATIENT INFO =========
    addTable("Patient Information", [
      ["Name", consultation.name],
      ["Age/Gender", `${consultation.age} years / ${consultation.gender}`],
      ["Phone", consultation.phone],
      ["Email", consultation.email || "Not provided"]
    ]);

    // ========= APPOINTMENT INFO =========
    addTable("Appointment & Prescription Info", [
      ["Prescription Date", this.formatDate(consultation.created_at)],
      ["Appointment Date", this.formatDate(consultation.preferred_date)],
      ["Enquiry ID", consultation.id.substring(0, 12) + "..."]
    ]);

    // ========= PRESCRIPTION DRUGS INFO =========
    try {
      const prescriptionData = await this.getPrescriptionDrugs(consultation.id);
      if (prescriptionData.length > 0) {
        const drugInfo: [string, string][] = prescriptionData.map(drug => [
          drug.drug_name || "Medicine",
          `Potency: ${drug.potency || 'Not specified'} | Dosage: ${drug.dosage || 'As prescribed'} | Quantity: ${drug.quantity || 'As needed'}`
        ]);
        addTable("Prescription Drugs Information", drugInfo);
      }
    } catch (error) {
      errorHandler.handlePDFError(error, undefined, consultation.id);
    }

    // ========= MEDICAL DETAILS =========
    addTable("Medical Details", [
      ["Diagnosis", consultation.diagnosis || "Under evaluation"],
      ["Symptoms", consultation.symptoms || "To be documented"],
      ["Condition", consultation.condition || "Not specified"]
    ]);

    // ========= TREATMENT =========
    addTable("Treatment & Instructions", [
      ["Treatment Plan", consultation.treatment_plan || "Not specified"],
      ["Instructions", consultation.dosage_instructions || "Not specified"],
      ["Medicines", consultation.medicines_prescribed || "Not specified"]
    ]);

    // ========= SERVICE INFO (WITHOUT CASE TYPE) =========
    addTable("Service Classification", [
      ["Service", consultation.service_type || "Homoeopathy"],
      ["Segment", consultation.segment || "General"]
      // Case Type removed for patient privacy
    ]);

    // ========= ADDITIONAL NOTES & INSTRUCTIONS =========
    addTable("Important Instructions", [
      ["Follow-up", "Please schedule follow-up appointment as advised"],
      ["Emergency", "Contact clinic immediately if symptoms worsen"],
      ["Medication", "Take medicines as prescribed, do not self-medicate"]
    ]);

    // ========= SIGNATURE AREA =========
    // Add some space before signature
    y += 20;
    
    // Doctor signature area
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Doctor's Signature:", doc.internal.pageSize.getWidth() - 200, y);
    
    // Signature line
    doc.setDrawColor(0, 0, 0);
    doc.line(doc.internal.pageSize.getWidth() - 200, y + 30, doc.internal.pageSize.getWidth() - 40, y + 30);
    
    // Date and time
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Date: ${new Date().toLocaleDateString("en-IN")} | Time: ${new Date().toLocaleTimeString("en-IN", { hour12: true })}`, doc.internal.pageSize.getWidth() - 200, y + 45);

    this.addWatermark(doc);
    this.addFooter(doc);
    return doc.output("blob");
  }

  /**
   * Core PDF generation for ADMIN portal (includes all info)
   */
  private generateAdminPDF(consultation: Consultation): Blob {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 40;
    let y = margin;

    // ========== HEADER ==========
    // Add Arogyam logo
    try {
      // Load the actual Arogyam logo from public folder - make it much larger and more prominent
      const logoPath = './images/branding/arogyam-logo.png';
      doc.addImage(logoPath, 'PNG', margin, y, 60, 60, undefined, 'FAST');
    } catch (error) {
      // Fallback to placeholder logo if image fails to load - make it much larger
      errorHandler.handleError(error, ErrorCategory.SYSTEM, 'pdf_generation', 'logo_loading');
      doc.setFillColor(59, 130, 246); // Blue color to match website
      doc.circle(margin + 30, y + 30, 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text('A', margin + 24, y + 38);
      doc.setTextColor(0, 0, 0);
    }

    // Clinic name with logo spacing - updated name and blue color
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246); // Blue color to match website
    doc.text("Arogyam Clinic", doc.internal.pageSize.getWidth() / 2, y + 35, { align: "center" });

    // Add contact information below clinic name
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Email: arogyamclinicare@gmail.com | Web: https://www.arogyamhomeo.com/", doc.internal.pageSize.getWidth() / 2, y + 50, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    y += 75; // Increased spacing to accommodate contact info
    doc.text("Complete Medical Report", doc.internal.pageSize.getWidth() / 2, y, { align: "center" });

    y += 15;
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`, doc.internal.pageSize.getWidth() / 2, y, { align: "center" });
    
    // Add security/compliance notice
    y += 12;
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text("[CONFIDENTIAL] MEDICAL DOCUMENT - For Administrative Use Only", doc.internal.pageSize.getWidth() / 2, y, { align: "center" });
    y += 20;

    // ========= HELPER FOR TABLES =========
    const addTable = (title: string, data: [string, string][]) => {
      // Section header
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(title, margin, y);
      y += 8;

      // Auto-scaling table with single-column layout
      autoTable(doc, {
        startY: y,
        head: [],
        body: data,
        theme: "grid",
        styles: { 
          fontSize: 10, 
          cellPadding: 8,
          halign: 'left',
          valign: 'middle'
        },
        columnStyles: {
          0: { fontStyle: 'bold', fillColor: [248, 249, 250], cellWidth: 120 },
          1: { cellWidth: 'auto' }
        },
        headStyles: { fillColor: [240, 240, 240] },
        margin: { left: margin, right: margin },
        tableWidth: 'auto',
        didDrawPage: () => {
    // Empty block
  }
      });

      // Update y position after table
      y = (doc as any).lastAutoTable.finalY + 20;
    };

    // ========= PATIENT INFO =========
    addTable("Patient Information", [
      ["Name", consultation.name],
      ["Age/Gender", `${consultation.age} years / ${consultation.gender}`],
      ["Phone", consultation.phone],
      ["Email", consultation.email || "Not provided"]
    ]);

    // ========= APPOINTMENT INFO =========
    addTable("Appointment & Prescription Info", [
      ["Prescription Date", this.formatDate(consultation.created_at)],
      ["Appointment Date", this.formatDate(consultation.preferred_date)],
      ["Enquiry ID", consultation.id.substring(0, 12) + "..."]
    ]);

    // ========= MEDICAL DETAILS =========
    addTable("Medical Details", [
      ["Diagnosis", consultation.diagnosis || "Under evaluation"],
      ["Symptoms", consultation.symptoms || "To be documented"],
      ["Condition", consultation.condition || "Not specified"]
    ]);

    // ========= TREATMENT =========
    addTable("Treatment & Instructions", [
      ["Treatment Plan", consultation.treatment_plan || "Not specified"],
      ["Instructions", consultation.dosage_instructions || "Not specified"],
      ["Medicines", consultation.medicines_prescribed || "Not specified"]
    ]);

    // ========= SERVICE INFO (INCLUDES CASE TYPE FOR ADMIN) =========
    addTable("Service Classification", [
      ["Service", consultation.service_type || "Homoeopathy"],
      ["Segment", consultation.segment || "General"],
      ["Case Type", consultation.case_type || "Normal"]
    ]);

    // ========= ADDITIONAL NOTES & INSTRUCTIONS =========
    addTable("Important Instructions", [
      ["Follow-up", "Please schedule follow-up appointment as advised"],
      ["Emergency", "Contact clinic immediately if symptoms worsen"],
      ["Medication", "Take medicines as prescribed, do not self-medicate"]
    ]);

    // ========= SIGNATURE AREA =========
    // Add some space before signature
    y += 20;
    
    // Doctor signature area
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Doctor's Signature:", doc.internal.pageSize.getWidth() - 200, y);
    
    // Signature line
    doc.setDrawColor(0, 0, 0);
    doc.line(doc.internal.pageSize.getWidth() - 200, y + 30, doc.internal.pageSize.getWidth() - 40, y + 30);
    
    // Date and time
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Date: ${new Date().toLocaleDateString("en-IN")} | Time: ${new Date().toLocaleTimeString("en-IN", { hour12: true })}`, doc.internal.pageSize.getWidth() - 200, y + 45);

    this.addWatermark(doc);
    this.addFooter(doc);
    return doc.output("blob");
  }

  /**
   * Get prescription drugs for a consultation
   */
  private async getPrescriptionDrugs(consultationId: string): Promise<any[]> {
    try {
      // Import dynamically to avoid circular dependencies
      const { PrescriptionDrugService } = await import('./prescription-drug-service');
      return await PrescriptionDrugService.getPrescriptionDrugs(consultationId);
    } catch (error) {
      return [];
    }
  }

  /**
   * Add professional watermark to PDF
   */
  private addWatermark(doc: any): void {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Save current state
    doc.saveGraphicsState();
    
    // Set watermark properties
    doc.setGState(new doc.GState({ opacity: 0.1 }));
    doc.setTextColor(59, 130, 246);
    doc.setFontSize(50);
    doc.setFont("helvetica", "bold");
    
    // Rotate and position watermark
    doc.text("AROGYAM CLINIC", pageWidth / 2, pageHeight / 2, {
      align: "center",
      angle: 45
    });
    
    // Restore state
    doc.restoreGraphicsState();
  }

  /**
   * Add footer to PDF
   */
  private addFooter(doc: any): void {
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    
    // Professional divider line
    doc.setDrawColor(59, 130, 246); // Blue color to match website
    doc.setLineWidth(2);
    doc.line(margin, pageHeight - 55, pageWidth - margin, pageHeight - 55);

    // Clinic name
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(59, 130, 246); // Blue color to match website
    doc.text("Arogyam Clinic", pageWidth / 2, pageHeight - 42, { align: "center" });

    // Tagline
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Professional Healthcare Services | Excellence in Homoeopathy", pageWidth / 2, pageHeight - 32, { align: "center" });
    
    // Disclaimer
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text("This is a computer-generated prescription. Please verify details and contact clinic for any clarifications.", pageWidth / 2, pageHeight - 20, { align: "center" });
    
    // Document ID for tracking
    doc.setFontSize(6);
    doc.text(`Doc ID: AC-${Date.now().toString().slice(-8)}`, pageWidth / 2, pageHeight - 10, { align: "center" });
  }

  /**
   * Format date for display
   */
  private formatDate(dateString: string | null): string {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }
}

// Export singleton instance
export const pdfGenerator = PDFGenerator.getInstance();