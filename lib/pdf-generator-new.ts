import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Consultation } from './supabase';
import { errorHandler, ErrorCategory } from './error-handling/production-error-handler';

// New PDF Generator matching handwritten form layout exactly
export class NewPDFGenerator {
  private static instance: NewPDFGenerator;

  private constructor() {
    // Empty block
  }

  public static getInstance(): NewPDFGenerator {
    if (!NewPDFGenerator.instance) {
      NewPDFGenerator.instance = new NewPDFGenerator();
    }
    return NewPDFGenerator.instance;
  }

  /**
   * Generate patient prescription PDF matching handwritten form layout
   */
  public async generatePatientPrescriptionPDF(consultation: Consultation): Promise<Blob> {
    return this.generatePatientPDF(consultation);
  }

  /**
   * Generate admin prescription PDF (same layout)
   */
  public async generateAdminPrescriptionPDF(consultation: Consultation): Promise<Blob> {
    return this.generateAdminPDF(consultation);
  }

  /**
   * Core PDF generation matching handwritten form layout
   */
  private async generatePatientPDF(consultation: Consultation): Promise<Blob> {

    if (!consultation || !consultation.id) {
      throw new Error('Invalid consultation data provided');
    }

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 50; // Increased margin for better spacing
    const pageWidth = doc.internal.pageSize.getWidth();
    const availableWidth = pageWidth - (margin * 2); // 495 points available
    let y = margin;

    // ========== HEADER SECTION ==========
    const iconSize = 60; // Icon size maintaining original proportions
    const headerY = y;
    
    // Load Arogyam icon (left) with better error handling
    let arogyamIconLoaded = false;
    try {

      const arogyamIconPath = '/images/branding/ai-generated-8836694_1280.png';

      const arogyamIconBase64 = await this.getImageAsBase64(arogyamIconPath, 120); // Higher quality for icon

      if (arogyamIconBase64 && arogyamIconBase64.length > 100) {

        // Position icon right before the clinic name text
        const textStartX = margin + iconSize + 15; // Where clinic name starts
        const iconX = textStartX - iconSize - 10; // Position icon right before text
        doc.addImage(arogyamIconBase64, 'PNG', iconX, headerY, iconSize, iconSize);

        arogyamIconLoaded = true;
      } else {

        throw new Error('Icon data too small or invalid');
      }
    } catch (error) {

      arogyamIconLoaded = false;
    }
    
    if (!arogyamIconLoaded) {
      // Fallback: Create a professional looking logo

      const textStartX = margin + iconSize + 15; // Where clinic name starts
      const iconX = textStartX - iconSize - 10; // Position icon right before text
      doc.setFillColor(34, 197, 94); // Green color
      doc.rect(iconX, headerY, iconSize, iconSize, 'F');
      
      // Add "Arogyam" text in the logo
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text('A', margin + 18, headerY + 30);
      
      // Add "arogyam" text below the logo box
      doc.setTextColor(34, 197, 94);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text('arogyam', iconX + 8, headerY + iconSize + 8);
    }
    
    doc.setTextColor(0, 0, 0);

    // Removed Caduceus symbol for cleaner, more professional look

    // Clinic name (positioned right next to icon) - Elegant medical font
    doc.setFont("times", "bold"); // Times font for more elegant, medical appearance
    doc.setFontSize(16); // Smaller, more refined size
    doc.setTextColor(0, 0, 0);
    doc.text("AROGYAM HOMOEOPATHIC CLINIC", margin + iconSize + 15, headerY + 20);

    // Tagline (aligned with clinic name)
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("A Place of Natural Healing", margin + iconSize + 15, headerY + 35);

    // Contact info (aligned with clinic name)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text("Phone: 9430030564 | Email: arogyamclinicare@gmail.com | Website: arogyamhomeo.com", 
             margin + iconSize + 15, headerY + 50);

    // Add a professional line separator
    y = headerY + iconSize + 20; // Adjusted spacing for icon
    doc.setDrawColor(34, 197, 94); // Green color
    doc.setLineWidth(1);
    doc.line(margin, y, doc.internal.pageSize.getWidth() - margin, y);
    y += 20;

    y += 30; // Adjusted spacing for proper layout with icon

    // ========== PATIENT INFORMATION SECTION ==========
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Patient Information", margin, y);
    
    // Add underline for section header
    const textWidth = doc.getTextWidth("Patient Information");
    doc.setDrawColor(0, 0, 0);
    doc.line(margin, y + 3, margin + textWidth, y + 3);
    
    y += 30;

    // Compact patient info layout
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    
    // Line 1: Name — Age — Gender
    const nameX = margin;
    const ageX = margin + 150;
    const genderX = margin + 250;
    
    doc.text("Name —", nameX, y);
    doc.text(consultation.name || "________________", nameX + 50, y);
    
    doc.text("Age —", ageX, y);
    doc.text(consultation.age?.toString() || "____", ageX + 40, y);
    
    doc.text("Gender —", genderX, y);
    doc.text(consultation.gender || "____", genderX + 60, y);

    y += 25;

    // Line 2: Mobile — Email (less space)
    doc.text("Mobile —", nameX, y);
    doc.text(consultation.phone || "________________", nameX + 50, y);
    
    doc.text("Email —", ageX, y);
    doc.text(consultation.email || "________________", ageX + 50, y);

    y += 40;

    // ========== APPOINTMENT DETAILS SECTION ==========
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Appointment Details", margin, y);
    
    // Add underline for section header
    const appointmentTextWidth = doc.getTextWidth("Appointment Details");
    doc.setDrawColor(0, 0, 0);
    doc.line(margin, y + 3, margin + appointmentTextWidth, y + 3);
    
    y += 25;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    
    doc.text("Pt. Id. —", margin, y);
    // Generate proper patient ID format: PAT-2025-XXXX-XXXX
    const patientId = consultation.id ? `PAT-2025-${consultation.id.substring(0, 4).toUpperCase()}-${consultation.id.substring(4, 8).toUpperCase()}` : "PAT-2025-XXXX-XXXX";
    doc.text(patientId, margin + 60, y);
    
    doc.text("Appointment Date —", margin + 200, y);
    doc.text(this.formatDate(consultation.preferred_date) || "________", margin + 350, y);
    
    y += 20;
    
    doc.text("Unit Doctor —", margin, y);
    doc.text(consultation.unit_doctor || "Dr. Kajal Kumari", margin + 80, y);
    
    doc.text("Next Appointment —", margin + 200, y);
    doc.text(this.formatDate(consultation.next_appointment_date) || "Not scheduled", margin + 350, y);

    y += 40;

    // ========== MEDICAL EVALUATION SECTION ==========
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Medical Evaluation", margin, y);
    
    // Add underline for section header
    const medicalTextWidth = doc.getTextWidth("Medical Evaluation");
    doc.setDrawColor(0, 0, 0);
    doc.line(margin, y + 3, margin + medicalTextWidth, y + 3);
    
    y += 25;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    
    // Line 1: Clinical Finding — Sub-Finding (same line like Patient Information)
    const clinicalFindingX = margin;
    const subFindingX = margin + 200;
    
    doc.text("Clinical Finding —", clinicalFindingX, y);
    doc.text(consultation.segment || "________________", clinicalFindingX + 100, y);
    
    doc.text("Sub-Finding —", subFindingX, y);
    doc.text(consultation.sub_segment || "________________", subFindingX + 100, y);

    y += 40;

    // ========== PRESCRIPTION DETAILS SECTION ==========
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Prescription Details", margin, y);
    
    // Add underline for section header
    const prescriptionTextWidth = doc.getTextWidth("Prescription Details");
    doc.setDrawColor(0, 0, 0);
    doc.line(margin, y + 3, margin + prescriptionTextWidth, y + 3);
    
    y += 25;

    // Prescription table with only required columns
    try {

      const prescriptionData = await this.getPrescriptionDrugs(consultation.id);

      if (prescriptionData && prescriptionData.length > 0) {
        const tableData = prescriptionData.map(drug => [
          drug.drug_name || "",
          drug.potency || "",
          drug.period || "", 
          drug.remarks || "",
          drug.repetition_frequency || "",
          drug.repetition_interval || "",
          drug.repetition_unit || ""
        ]);

        autoTable(doc, {
          startY: y,
          head: [["Medicine", "Potency", "Period", "Remarks", "Repeat Start", "Repeat End", "Repeat Type"]],
          body: tableData,
          theme: "striped",
          styles: { 
            fontSize: 7, 
            cellPadding: 3,
            halign: 'left',
            valign: 'middle',
            lineColor: [200, 200, 200],
            lineWidth: 0.5
          },
          columnStyles: {
            0: { cellWidth: availableWidth * 0.25 }, // Medicine - 25%
            1: { cellWidth: availableWidth * 0.15 }, // Potency - 15%
            2: { cellWidth: availableWidth * 0.12 }, // Period - 12%
            3: { cellWidth: availableWidth * 0.18 }, // Remarks - 18%
            4: { cellWidth: availableWidth * 0.10 }, // Repeat Start - 10%
            5: { cellWidth: availableWidth * 0.10 }, // Repeat End - 10%
            6: { cellWidth: availableWidth * 0.10 }  // Repeat Type - 10%
          },
          headStyles: { 
            fillColor: [34, 197, 94],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          margin: { left: margin, right: margin },
          tableWidth: availableWidth
        });

        y = (doc as any).lastAutoTable.finalY + 20;
      } else {
        // Empty prescription table
        autoTable(doc, {
          startY: y,
          head: [["Medicine", "Potency", "Period", "Remarks", "Repeat Start", "Repeat End", "Repeat Type"]],
          body: [["", "", "", "", "", "", ""]],
          theme: "striped",
          styles: { 
            fontSize: 7, 
            cellPadding: 3,
            halign: 'left',
            valign: 'middle',
            lineColor: [200, 200, 200],
            lineWidth: 0.5
          },
          columnStyles: {
            0: { cellWidth: availableWidth * 0.25 }, // Medicine - 25%
            1: { cellWidth: availableWidth * 0.15 }, // Potency - 15%
            2: { cellWidth: availableWidth * 0.12 }, // Period - 12%
            3: { cellWidth: availableWidth * 0.18 }, // Remarks - 18%
            4: { cellWidth: availableWidth * 0.10 }, // Repeat Start - 10%
            5: { cellWidth: availableWidth * 0.10 }, // Repeat End - 10%
            6: { cellWidth: availableWidth * 0.10 }  // Repeat Type - 10%
          },
          headStyles: { 
            fillColor: [34, 197, 94],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          margin: { left: margin, right: margin },
          tableWidth: availableWidth
        });
        y = (doc as any).lastAutoTable.finalY + 20;
      }
    } catch (error) {
      errorHandler.handlePDFError(error, undefined, consultation.id);
    }

    y += 20;

    // ========== INVESTIGATIONS SECTION ==========
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Investigations:", margin, y);
    
    // Add underline for section header
    const investigationsTextWidth = doc.getTextWidth("Investigations:");
    doc.setDrawColor(0, 0, 0);
    doc.line(margin, y + 3, margin + investigationsTextWidth, y + 3);
    
    y += 25;

    // Pathological investigations - Show only selected ones
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("1). Pathological investigation", margin, y);
    y += 20;

    // Get selected pathological investigations from consultation
    const selectedPathological = consultation.pathological_investigations || [];
    if (selectedPathological.length > 0) {
      this.addSelectedCheckboxOptions(doc, selectedPathological, margin, y, 3);
      y += Math.ceil(selectedPathological.length / 3) * 15 + 20;
    } else {
      doc.text("No pathological investigations selected", margin, y);
      y += 20;
    }

    // Radio diagnosis - Show only selected ones
    doc.text("2). Radio Diagnosis", margin, y);
    y += 20;

    // Get selected radio diagnosis from consultation
    const selectedRadio = consultation.radio_diagnosis || [];
    if (selectedRadio.length > 0) {
      this.addSelectedCheckboxOptions(doc, selectedRadio, margin, y, 2);
      y += Math.ceil(selectedRadio.length / 2) * 15 + 30;
    } else {
      doc.text("No radio diagnosis selected", margin, y);
      y += 30;
    }

    // ========== RECOMMENDATIONS SECTION ==========
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Recommendations:", margin, y);
    
    // Add underline for section header
    const recommendationsTextWidth = doc.getTextWidth("Recommendations:");
    doc.setDrawColor(0, 0, 0);
    doc.line(margin, y + 3, margin + recommendationsTextWidth, y + 3);
    
    y += 25;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    
    // Check if we need a new page for recommendations
    const pageHeight = doc.internal.pageSize.getHeight();
    const recommendationsHeight = 60; // Approximate height needed for recommendations
    
    if (y + recommendationsHeight > pageHeight - 100) {
      doc.addPage();
      y = 40; // Reset to top of new page
    }
    
    // Add the standard recommendations with better formatting
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Follow-up:", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text("Please schedule follow-up appointment as advised", margin + 60, y);
    y += 18;
    
    doc.setFont("helvetica", "bold");
    doc.text("Emergency:", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text("Contact clinic immediately if symptoms worsen", margin + 60, y);
    y += 18;
    
    doc.setFont("helvetica", "bold");
    doc.text("Medication:", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text("Take medicines as prescribed, do not self-medicate", margin + 60, y);
    y += 18;
    
    // Add custom recommendations if any
    if (consultation.recommendations) {
      doc.setFont("helvetica", "bold");
      doc.text("Additional:", margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(consultation.recommendations, margin + 60, y);
      y += 18;
    }

    y += 40;

    // ========== NO DOCTOR SIGNATURE (as requested) ==========
    // Doctor signature section removed as per requirements

    this.addWatermark(doc);
    this.addFooter(doc);

    const blob = doc.output("blob");

    return blob;
  }

  /**
   * Generate admin PDF (same layout)
   */
  private async generateAdminPDF(consultation: Consultation): Promise<Blob> {
    // For now, use same layout as patient PDF
    // Can be extended later if needed
    return this.generatePatientPDF(consultation);
  }

  // Removed drawCaduceus function - no longer needed for cleaner design

  /**
   * Add checkbox options in columns
   */
  private addCheckboxOptions(doc: any, options: string[], startX: number, startY: number, columns: number): void {
    const colWidth = 200;
    const rowHeight = 15;
    
    options.forEach((option, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      
      const x = startX + (col * colWidth);
      const y = startY + (row * rowHeight);
      
      // Draw checkbox
      doc.rect(x, y - 8, 8, 8);
      // Simple checkbox - just the square, no symbol
      
      // Add option text
      doc.setFontSize(9);
      doc.text(option, x + 15, y - 2);
    });
  }

  /**
   * Add selected checkbox options (checked) in columns
   */
  private addSelectedCheckboxOptions(doc: any, selectedOptions: string[], startX: number, startY: number, columns: number): void {
    const colWidth = 200;
    const rowHeight = 18;
    
    selectedOptions.forEach((option, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      
      const x = startX + (col * colWidth);
      const y = startY + (row * rowHeight);
      
      // Draw professional checkbox with rounded corners effect
      doc.setDrawColor(34, 197, 94);
      doc.setLineWidth(1);
      doc.rect(x, y - 10, 10, 10);
      
      // Fill checkbox with light green background
      doc.setFillColor(240, 248, 240);
      doc.rect(x + 0.5, y - 9.5, 9, 9, 'F');
      
      // Add professional checkmark with green color
      doc.setDrawColor(34, 197, 94);
      doc.setLineWidth(1.5);
      doc.line(x + 2, y - 6, x + 4, y - 4);
      doc.line(x + 4, y - 4, x + 7, y - 7);
      
      // Add option text with better spacing
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(option, x + 18, y - 3);
    });
  }

  /**
   * Draw professional section border
   */
  private drawSectionBorder(doc: any, startY: number, endY: number, margin: number): void {
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Draw subtle border around section
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.rect(margin - 5, startY - 5, pageWidth - 2 * margin + 10, endY - startY + 10);
    
    // Add subtle background
    doc.setFillColor(250, 250, 250);
    doc.rect(margin - 4, startY - 4, pageWidth - 2 * margin + 8, endY - startY + 8, 'F');
  }


  /**
   * Convert image to Base64 for PDF embedding (optimized for size and quality)
   */
  private async getImageAsBase64(imagePath: string, maxSize: number = 50): Promise<string> {
    try {

      const response = await fetch(imagePath);

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText} (${response.status})`);
      }
      
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {

          // Always optimize for PDF (reduce size to prevent 80MB PDFs)
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          // Calculate new dimensions maintaining aspect ratio
          let { width, height } = img;
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw with high quality but optimized size
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with PNG format to preserve quality and transparency
          const base64 = canvas.toDataURL('image/png', 1.0).split(',')[1];

          resolve(base64);
        };
        img.onerror = () => {

          reject(new Error('Failed to load image'));
        };
        img.src = URL.createObjectURL(blob);
      });
    } catch (error) {


      throw error;
    }
  }

  /**
   * Get prescription drugs for a consultation
   */
  private async getPrescriptionDrugs(consultationId: string): Promise<any[]> {
    try {
      const { PrescriptionDrugService } = await import('./prescription-drug-service');
      const result = await PrescriptionDrugService.getPrescriptionDrugs(consultationId);
      return result || [];
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
    doc.setTextColor(34, 197, 94); // Green color
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
    doc.setDrawColor(34, 197, 94); // Green color
    doc.setLineWidth(2);
    doc.line(margin, pageHeight - 55, pageWidth - margin, pageHeight - 55);

    // Disclaimer
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text("This is a computer-generated prescription. Please verify details and contact clinic for any clarifications.", pageWidth / 2, pageHeight - 42, { align: "center" });
    
    // Document ID for tracking
    doc.setFontSize(6);
    doc.text(`Doc ID: AHC-${Date.now().toString().slice(-8)}`, pageWidth / 2, pageHeight - 10, { align: "center" });
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
export const newPDFGenerator = NewPDFGenerator.getInstance();
