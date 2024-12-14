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
  contact: {
    mobile: string;
    email: string;
    address: {
      present: string;
      permanent: string;
    };
  };
  emergencyContact: {
    name: string;
    mobile: string;
  };
  bankDetails: {
    accountNumber: string;
    branch: string;
    ifsc: string;
  };
  aadhar: string;
  pan: string;
  uan: string;
  designation: string;
  department: Department;
  dateOfJoining: string;
  experience: {
    teaching: number;
    industry: number;
    research: number;
  };
  qualifications: {
    type: string;
    year: number;
    percentage: number;
    boardOrUniversity: string;
  }[];
  publications: number;
  guestLectures: number;
  familyDetails: {
    name: string;
    dob: string;
    relationship: string;
  }[];
  pdfPath: string;
}

const EmployeeSchema = new Schema<Employee>({
  name: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  dob: { type: String, required: true },
  age: { type: Number, required: true },
  maritalStatus: { type: String, enum: ['Married', 'Unmarried'], required: true },
  contact: {
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    address: {
      present: { type: String, required: true },
      permanent: { type: String, required: true },
    },
  },
  emergencyContact: {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
  },
  bankDetails: {
    accountNumber: { type: String, required: true },
    branch: { type: String, required: true },
    ifsc: { type: String, required: true },
  },
  aadhar: { type: String, required: true },
  pan: { type: String, required: true },
  uan: { type: String, required: true },
  designation: { type: String, required: true },
  department: { type: String, enum: Object.values(Department), required: true },
  dateOfJoining: { type: String, required: true },
  experience: {
    teaching: { type: Number, required: true },
    industry: { type: Number, required: true },
    research: { type: Number, required: true },
  },
  qualifications: [
    {
      type: { type: String, required: true },
      year: { type: Number, required: true },
      percentage: { type: Number, required: true },
      boardOrUniversity: { type: String, required: true },
    },
  ],
  publications: { type: Number, required: true },
  guestLectures: { type: Number, required: true },
  familyDetails: [
    {
      name: { type: String, required: true },
      dob: { type: String, required: true },
      relationship: { type: String, required: true },
    },
  ],
  pdfPath: { type: String, required: true },
});

export const EmployeeModel = mongoose.model<Employee>('Employee', EmployeeSchema);