import { Employee } from '../models/employee.model';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import fs from 'fs';
import path from 'path';
import convertDocxToPdf from 'docx-pdf';

export async function generatePDF(employee: Employee): Promise<{ form1Path: string; form2Path: string }> {
  // Load template files
  const form1TemplatePath = path.join(__dirname, '../templates', 'PESITM_Form1.docx');
  const form2TemplatePath = path.join(__dirname, '../templates', 'PESITM_Form2.docx');

  // Prepare output paths
  const outputForm1Path = path.join(__dirname, '../storage/joining_form_1', `employee-${employee._id}-form1.docx`);
  const outputForm1PdfPath = path.join(__dirname, '../storage/joining_form_1', `employee-${employee._id}-form1.pdf`);
  const outputForm2Path = path.join(__dirname, '../storage/joining_form_2', `employee-${employee._id}-form2.docx`);
  const outputForm2PdfPath = path.join(__dirname, '../storage/joining_form_2', `employee-${employee._id}-form2.pdf`);

  // Prepare data for template
  const templateData = {
    // Common Details
    name: employee.name || '',
    gender: employee.gender || '',
    dob: employee.dob || '',
    age: employee.age ? employee.age.toString() : '',
    marital_status: employee.maritalStatus || '',
    date_of_joining: employee.dateOfJoining || '',
    designation: employee.designation || '',
    department: employee.department || '',
    present_address: employee.contact?.address?.present || '',
    present_pin_code: employee.contact?.address?.presentPinCode || '',
    mobile: employee.contact?.mobile || '',
    permanent_address: employee.contact?.address?.permanent || '',
    permanent_pin_code: employee.contact?.address?.permanentPinCode || '',
    email: employee.contact?.email || '',
    pan: employee.pan || '',
    aadhar: employee.aadhar || '',
    uan: employee.uan || '',
    bank_account_number: employee.bankDetails?.accountNumber || '',
    bank_branch: employee.bankDetails?.branch || '',
    bank_ifsc: employee.bankDetails?.ifsc || '',
    emergency_contact_name: employee.emergencyContact?.name || '',
    emergency_contact_mobile: employee.emergencyContact?.mobile || '',
    reference_1: '', // Add logic for references if needed
    reference_2: '',
    date: new Date().toLocaleDateString(),

    // Form 2 Specific Details
    father_name: employee.fatherName || '',
    spouse_name: employee.spouseName || '',
    caste: employee.caste || '',
    category: employee.category || '',
    blood_group: employee.bloodGroup || '',
    qualification: (employee.qualifications || []).map(q => `${q.type}, ${q.year}, ${q.percentage}%, ${q.boardOrUniversity}`).join('; '),
    experience: `${employee.experience?.teaching || 0} + ${employee.experience?.industry || 0} + ${employee.experience?.research || 0}`,
    no_research_paper: employee.publications?.toString() || '0',
    no_invited_guest_lecture: employee.guestLectures?.toString() || '0',
    residence: employee.residence || '',

    // Qualification Details
    sslc_yop: '', // Populate from qualifications
    sslc_percent: '',
    sslc_board: '',
    puc_yop: '',
    puc_percent: '',
    puc_board: '',
    ug_course_name: '',
    ug_yop: '',
    ug_percent: '',
    ug_uni: '',
    pg_course_name: '',
    pg_yop: '',
    pg_percent: '',
    pg_uni: '',
    phd_title: '',
    phd_yop: '',
    phd_other: '',

    // Family Details (first six members)
    familyDetails: (employee.familyDetails || []).slice(0, 6).map(member => ({
      name: member.name || '',
      dob: member.dob || '',
      relationship: member.relationship || ''
    }))
  };

  // Helper function to process a form
  const processForm = (templatePath: string, outputPath: string, data: any) => {
    const templateContent = fs.readFileSync(templatePath);
    const zip = new PizZip(templateContent);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
    doc.render(data);
    const generatedContent = doc.getZip().generate({ type: 'nodebuffer' });
    fs.writeFileSync(outputPath, generatedContent);
  };

  // Process Form 1
  processForm(form1TemplatePath, outputForm1Path, templateData);

  // Process Form 2
  processForm(form2TemplatePath, outputForm2Path, templateData);

  // Convert DOCX to PDF
  await new Promise<void>((resolve, reject) => {
    convertDocxToPdf(outputForm1Path, outputForm1PdfPath, (err: any) => {
      if (err) reject(err);
      else resolve();
    });
  });

  await new Promise<void>((resolve, reject) => {
    convertDocxToPdf(outputForm2Path, outputForm2PdfPath, (err: any) => {
      if (err) reject(err);
      else resolve();
    });
  });

  // Update employee's PDF paths
  employee.pdfPaths = {
    form1: outputForm1PdfPath,
    form2: outputForm2PdfPath
  };

  return {
    form1Path: outputForm1PdfPath,
    form2Path: outputForm2PdfPath,
  };
}
