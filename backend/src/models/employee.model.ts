import mongoose, { Schema, Document } from 'mongoose';

export enum Department {
  HR = 'HR',
  IT = 'IT',
  FINANCE = 'Finance',
  ADMIN = 'Admin',
  ACADEMIC = 'Academic',
  RESEARCH = 'Research',
}

export interface Employee extends Document {
  name: string;
  gender: 'Male' | 'Female';
  dob: string;
  age: number;
  maritalStatus: 'Married' | 'Unmarried';
  academicQualification: string;
  dateOfJoining: string;
  designation: string;
  department: Department;
  contact: {
    presentAddress: string;
    presentPinCode: string;
    presentContactNumber: string;
    permanentAddress: string;
    permanentPinCode: string;
    permanentContactNumber: string;
    emailId: string;
  };
  bankDetails: {
    accountNumber: string;
    branch: string;
    ifsc: string;
  };
  emergencyContact: {
    name: string;
    phoneNumber: string;
  };
  reference: string[];
  fatherName: string;
  spouseName: string;
  caste: string;
  category: string;
  bloodGroup: string;
  experienceInYears: number;
  researchPapersPublished: number;
  guestLectures: number;
  sslc: {
    yearOfPassing: number;
    percentage: number;
    boardOrUniversity: string;
  };
  puc: {
    yearOfPassing: number;
    percentage: number;
    boardOrUniversity: string;
  };
  ug: {
    courseName: string;
    yearOfPassing: number;
    percentage: number;
    boardOrUniversity: string;
  };
  pg: {
    courseName: string;
    yearOfPassing: number;
    percentage: number;
    boardOrUniversity: string;
  };
  phd: {
    university: string;
    dateOfCompletion: string;
    specialization: string;
  };
  others: {
    yearOfPassing: number;
    percentage: number;
    boardOrUniversity: string;
  }[];
  experiences: {
    institutionName: string;
    designation: string;
    from: string;
    to: string;
    totalPeriod: string;
  }[];
  familyDetails: {
    name: string;
    dob: string;
    relationship: 'Spouse' | 'Father' | 'Mother' | 'Son' | 'Daughter';
  }[];
  panNumber: string;
  aadharNumber: string;
  uanNumber: string;
  pdfPaths: {
    form1Path: string,
    form2Path: string,
  }
}

const EmployeeSchema = new Schema({
  name: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  dob: { type: String, required: true },
  age: { type: Number, required: true },
  maritalStatus: { type: String, enum: ['Married', 'Unmarried'], required: true },
  academicQualification: { type: String, required: true },
  dateOfJoining: { type: String, required: true },
  designation: { type: String, required: true },
  department: { type: String, enum: Object.values(Department), required: true },
  contact: {
    presentAddress: { type: String, required: true },
    presentPinCode: { type: String, required: true },
    presentContactNumber: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    permanentPinCode: { type: String, required: true },
    permanentContactNumber: { type: String, required: true },
    emailId: { type: String, required: true },
  },
  bankDetails: {
    accountNumber: { type: String, required: true },
    branch: { type: String, required: true },
    ifsc: { type: String, required: true },
  },
  emergencyContact: {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  reference: [{ type: String, required: true }],
  fatherName: { type: String, required: true },
  spouseName: { type: String, default: '' },
  caste: { type: String, default: '' },
  category: { type: String, default: '' },
  bloodGroup: { type: String, default: '' },
  experienceInYears: { type: Number, required: true },
  researchPapersPublished: { type: Number, default: 0 },
  guestLectures: { type: Number, default: 0 },
  sslc: {
    yearOfPassing: { type: Number, required: true },
    percentage: { type: Number, required: true },
    boardOrUniversity: { type: String, required: true },
  },
  puc: {
    yearOfPassing: { type: Number, required: true },
    percentage: { type: Number, required: true },
    boardOrUniversity: { type: String, required: true },
  },
  ug: {
    courseName: { type: String, required: true },
    yearOfPassing: { type: Number, required: true },
    percentage: { type: Number, required: true },
    boardOrUniversity: { type: String, required: true },
  },
  pg: {
    courseName: { type: String, required: true },
    yearOfPassing: { type: Number, required: true },
    percentage: { type: Number, required: true },
    boardOrUniversity: { type: String, required: true },
  },
  phd: {
    university: { type: String, default: '' },
    dateOfCompletion: { type: String, default: '' },
    specialization: { type: String, default: '' },
  },
  others: [
    {
      yearOfPassing: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 },
      boardOrUniversity: { type: String, default: '' },
    },
  ],
  experiences: [
    {
      institutionName: { type: String, required: true },
      designation: { type: String, required: true },
      from: { type: String, required: true },
      to: { type: String, required: true },
      totalPeriod: { type: String, required: true },
    },
  ],
  familyDetails: [
    {
      name: { type: String, required: true },
      dob: { type: String, required: true },
      relationship: {
        type: String,
        enum: ['Spouse', 'Father', 'Mother', 'Son', 'Daughter'],
        required: true,
      },
    },
  ],
  panNumber: { type: String, required: true },
  aadharNumber: { type: String, required: true },
  uanNumber: { type: String, required: true },
  pdfPaths: {
    form1Path: {type: String},
    form2Path: {type: String},
  }
});

export const EmployeeModel = mongoose.model<Employee>('Employee', EmployeeSchema);