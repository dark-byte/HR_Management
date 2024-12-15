import request from 'supertest';
import app from '../app';
import { EmployeeModel } from '../models/employee.model';
import mongoose from 'mongoose';
import { generatePDF } from '../utils/pdfGenerator';

jest.mock('../utils/pdfGenerator');
const mockedGeneratePDF = generatePDF as jest.MockedFunction<typeof generatePDF>;

describe('Employee API Endpoints', () => {
  // Run before all tests to set up the database
  beforeAll(async () => {
    const testMongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/testdb';
    await mongoose.connect(testMongoUri);
  });

  // Run after all tests to clean up the database
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  let employeeId: string;

  it('should create a new employee and generate PDFs', async () => {
    const employeeData = {
      name: 'John Doe',
      department: 'Engineering',
      dateOfJoining: '2024-01-01',
    };

    const createdEmployee = {
      _id: '12345',
      ...employeeData,
      save: jest.fn(),
    };

    const mockPDFPaths = {
      form1Path: '/storage/joining_form_1/employee-12345-form1.pdf',
      form2Path: '/storage/joining_form_2/employee-12345-form2.pdf',
    };

    // Mock database calls and PDF generation
    jest.spyOn(EmployeeModel, 'create').mockResolvedValueOnce(createdEmployee as any);
    mockedGeneratePDF.mockResolvedValueOnce(mockPDFPaths);

    const response = await request(app).post('/employees').send(employeeData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Employee created successfully');
    expect(response.body.employee).toBeDefined();
    expect(response.body.employee.pdfPaths).toEqual(mockPDFPaths);

    employeeId = response.body.employee._id;
  });

  it('should fetch the created employee by ID', async () => {
    const response = await request(app).get(`/employees/${employeeId}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('John Doe');
    expect(response.body.department).toBe('Engineering');
    expect(response.body.pdfPaths.form1Path).toMatch(/\/storage\/joining_form_1\/employee-.*-form1\.pdf/);
    expect(response.body.pdfPaths.form2Path).toMatch(/\/storage\/joining_form_2\/employee-.*-form2\.pdf/);
  });

  it('should update the employee and regenerate PDFs', async () => {
    const updatedData = {
      name: 'John Smith',
      department: 'HR',
    };

    const updatedEmployee = {
      _id: employeeId,
      ...updatedData,
      save: jest.fn(),
    };

    const updatedPDFPaths = {
      form1Path: '/storage/joining_form_1/employee-12345-form1-updated.pdf',
      form2Path: '/storage/joining_form_2/employee-12345-form2-updated.pdf',
    };

    jest.spyOn(EmployeeModel, 'findByIdAndUpdate').mockResolvedValueOnce(updatedEmployee as any);
    mockedGeneratePDF.mockResolvedValueOnce(updatedPDFPaths);

    const response = await request(app).put(`/employees/${employeeId}`).send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Employee updated successfully');
    expect(response.body.employee.name).toBe('John Smith');
    expect(response.body.employee.department).toBe('HR');
    expect(response.body.employee.pdfPaths).toEqual(updatedPDFPaths);
  });

  it('should handle errors and respond with 500', async () => {
    jest.spyOn(EmployeeModel, 'create').mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app).post('/employees').send({ name: 'Jane Doe' });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Database error');
  });
});
