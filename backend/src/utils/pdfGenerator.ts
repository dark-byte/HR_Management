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

  // Helper function to map family details
  const mapFamilyDetails = (familyDetails: any[]) => {
    const familyData: any = {
      spouse_name: ' ',
      spouse_dob: ' ',
      ward_name1: '',
      ward_dob1: '',
      ward_name2: '',
      ward_dob2: '',
      ward_name3: '',
      ward_dob3: '',
      father_name: ' ',
      father_dob: ' ',
      mother_name: ' ',
      mother_dob: ' ',
    };

    // Loop through familyDetails and assign to the correct fields
    familyDetails.forEach((member, idx) => {
      switch (member.relationship) {
        case 'Spouse':
          familyData.spouse_name = member.name || ' ';
          familyData.spouse_dob = member.dob || ' ';
          break;
        case 'Son':
        case 'Daughter':
          if (!familyData.ward_name1) {
            familyData.ward_name1 = member.name || ' ';
            familyData.ward_dob1 = member.dob || ' ';
          } else if (!familyData.ward_name2) {
            familyData.ward_name2 = member.name || ' ';
            familyData.ward_dob2 = member.dob || ' ';
          } else if (!familyData.ward_name3) {
            familyData.ward_name3 = member.name || ' ';
            familyData.ward_dob3 = member.dob || ' ';
          }
          break;
        case 'Father':
          familyData.father_name = member.name || ' ';
          familyData.father_dob = member.dob || ' ';
          break;
        case 'Mother':
          familyData.mother_name = member.name || ' ';
          familyData.mother_dob = member.dob || ' ';
          break;
      }
    });

    return familyData;
  };

  // Map family details correctly
  const familyDetails = mapFamilyDetails(employee.familyDetails);

  // Map experience data with empty values for unused rows
  const mapExperiences = (experiences: any[]) => {
    const expData: any = {};
    // Initialize all 6 possible experience rows with empty values
    for (let i = 1; i <= 6; i++) {
      expData[`name_org${i}`] = ' ';
      expData[`designation_${i}`] = ' ';
      expData[`from_${i}`] = ' ';
      expData[`to_${i}`] = ' ';
      expData[`period_${i}`] = ' ';
    }

    // Fill in actual experience data
    experiences.slice(0, 6).forEach((exp, idx) => {
      const i = idx + 1;
      expData[`name_org${i}`] = exp.institutionName || ' ';
      expData[`designation_${i}`] = exp.designation || ' ';
      expData[`from_${i}`] = exp.from || ' ';
      expData[`to_${i}`] = exp.to || ' ';
      expData[`period_${i}`] = exp.totalPeriod || ' ';
    });

    return expData;
  };

  // Map others education data
  const mapOthers = (others: any[]) => {
    const othersData: any = {
      other_yop1: ' ',
      other_percent1: ' ',
      other_uni1: ' ',
      other_yop2: ' ',
      other_percent2: ' ',
      other_uni2: ' ',
      other_yop3: ' ',
      other_percent3: ' ',
      other_uni3: ' ',
      other_yop4: ' ',
      other_percent4: ' ',
      other_uni4: ' ',
      other_yop5: ' ',
      other_percent5: ' ',
      other_uni5: ' ',
    };

    others.slice(0, 5).forEach((other, idx) => {
      const i = idx + 1;
      othersData[`other_yop${i}`] = other.yearOfPassing || ' ';
      othersData[`other_percent${i}`] = other.percentage || ' ';
      othersData[`other_uni${i}`] = other.boardOrUniversity || ' ';
    });

    return othersData;
  };

  // Prepare data for templates
  const templateData = {
    // General details for both forms
    name: employee.name || ' ',
    gender: employee.gender || ' ',
    photo: " ",
    residence: employee.contact.permanentAddress,
    dob: employee.dob || ' ',
    age: employee.age ? employee.age.toString() : ' ',
    marital_status: employee.maritalStatus || ' ',
    date_of_joining: employee.dateOfJoining || ' ',
    designation: employee.designation || ' ',
    department: employee.department || ' ',
    qual_type: employee.academicQualification,
    qualification: employee.academicQualification,
    present_address: employee.contact?.presentAddress || ' ',
    present_pin_code: employee.contact?.presentPinCode || ' ',
    mobile: employee.contact?.presentContactNumber || ' ',
    permanent_address: employee.contact?.permanentAddress || ' ',
    permanent_pin_code: employee.contact?.permanentPinCode || ' ',
    email: employee.contact?.emailId || ' ',
    pan: employee.panNumber || ' ',
    aadhar: employee.aadharNumber || ' ',
    uan: employee.uanNumber || ' ',
    bank_account_number: employee.bankDetails?.accountNumber || ' ',
    bank_branch: employee.bankDetails?.branch || ' ',
    bank_ifsc: employee.bankDetails?.ifsc || ' ',
    emergency_contact_name: employee.emergencyContact?.name || ' ',
    emergency_contact_mobile: employee.emergencyContact?.phoneNumber || ' ',
    reference_1: employee.reference[0] || ' ',
    reference_2: employee.reference[1] || ' ',
    father_name: employee.fatherName || ' ',
    spouse_name: employee.spouseName || ' ',
    caste: employee.caste || ' ',
    category: employee.category || ' ',
    blood_group: employee.bloodGroup || ' ',

    // Education table details (Form 2)
    education: {
      sslc_yop: employee.sslc?.yearOfPassing || ' ',
      sslc_percent: employee.sslc?.percentage || ' ',
      sslc_board: employee.sslc?.boardOrUniversity || ' ',
      puc_yop: employee.puc?.yearOfPassing || ' ',
      puc_percent: employee.puc?.percentage || ' ',
      puc_board: employee.puc?.boardOrUniversity || ' ',
      ug_course_name: employee.ug?.courseName || ' ',
      ug_yop: employee.ug?.yearOfPassing || ' ',
      ug_percent: employee.ug?.percentage || ' ',
      ug_uni: employee.ug?.boardOrUniversity || ' ',
      pg_course_name: employee.pg?.courseName || ' ',
      pg_yop: employee.pg?.yearOfPassing || ' ',
      pg_percent: employee.pg?.percentage || ' ',
      pg_uni: employee.pg?.boardOrUniversity || ' ',
      phd_title: employee.phd?.specialization || ' ',
      phd_yop: employee.phd?.dateOfCompletion || ' ',
      phd_other: employee.phd?.university || ' ',
      ...mapOthers(employee.others || []),
    },

    // Experience table details (Form 2)
    ...mapExperiences(employee.experiences || []),

    // Family details (Mapped correctly)
    ...familyDetails,

    // Additional fields for Form 2
    no_research_paper: employee.researchPapersPublished?.toString() || '0',
    no_invited_guest_lecture: employee.guestLectures?.toString() || '0',
    experience: `${employee.experienceInYears || 0}`,
    date: new Date().toLocaleDateString(),
  };

  // Helper function to process templates
  const processTemplate = (templatePath: string, outputPath: string, data: any) => {
    const templateContent = fs.readFileSync(templatePath);
    const zip = new PizZip(templateContent);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
    doc.render(data);
    const generatedContent = doc.getZip().generate({ type: 'nodebuffer' });
    fs.writeFileSync(outputPath, generatedContent);
  };

  // Process forms
  processTemplate(form1TemplatePath, outputForm1Path, templateData);
  processTemplate(form2TemplatePath, outputForm2Path, templateData);

  // Convert DOCX to PDF
  await new Promise<void>((resolve, reject) =>
    convertDocxToPdf(outputForm1Path, outputForm1PdfPath, (err: any) =>
      err ? reject(err) : resolve()
    )
  );

  await new Promise<void>((resolve, reject) =>
    convertDocxToPdf(outputForm2Path, outputForm2PdfPath, (err: any) =>
      err ? reject(err) : resolve()
    )
  );

  return {
    form1Path: outputForm1PdfPath,
    form2Path: outputForm2PdfPath,
  };
}