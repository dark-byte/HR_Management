import { Request, Response } from 'express';
import { EmployeeModel } from '../models/employee.model';
import { generatePDF } from '../utils/pdfGenerator';

/**
 * @description Create a new employee record and generate a PDF
 * @route POST /employees
 */
export async function createEmployee(req: Request, res: Response) {
  try {
    // Create the employee in the database
    req.body.pdfPaths ={
      form1: "",
      form2: ""
    }
    
    const employee = await EmployeeModel.create(req.body);
    try{
      // Generate PDFs for the employee
      const { form1Path, form2Path } = await generatePDF(employee);
      // Save the PDF paths back to the database
      employee.pdfPaths = { form1: form1Path, form2: form2Path };
      console.log(employee)
      await employee.save();

    } catch(error: any){
      console.error("Error generating PDF: ", error)
      res.status(500).json({
        message: "Error generating PDF"
      })
    }

    res.status(201).json({
      message: 'Employee created successfully',
      employee,
    });
  } catch (error: any) {
    console.error("Error creating Employee: ", error)
    res.status(500).json({
      error: error.message,
    });
  }
}

/**
 * @description Fetch employees by joining date range and department
 * @route GET /employees/search
 */
export async function getEmployees(req: Request, res: Response) {
  const { startDate, endDate, department } = req.query;

  try {
    const query: any = {};

    // Add joining date range to the query
    if (startDate && endDate) {
      query.dateOfJoining = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    // Add department filter to the query
    if (department) {
      query.department = department;
    }

    // Fetch employees based on the query
    const employees = await EmployeeModel.find(query).select(
      'name department dateOfJoining pdfPath'
    );

    res.status(200).json(employees);
  } catch (error: any) {
    console.error("Error fetching Employees: ", error)
    res.status(500).json({
      error: error.message,
    });
  }
}

/**
 * @description Fetch a single employee by ID
 * @route GET /employees/:id
 */
export async function getEmployeeById(req: Request, res: Response) {
  try {
    const employee = await EmployeeModel.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: 'Employee not found',
      });
    }

    res.status(200).json(employee);
  } catch (error: any) {
    console.error("Error getting Employee: ", error)
    res.status(500).json({
      error: error.message,
    });
  }
}

/**
 * @description Update an employee's details and regenerate their PDF
 * @route PUT /employees/:id
 */
export async function updateEmployee(req: Request, res: Response) {
  try {
    // Find the employee by ID and update their details
    const employee = await EmployeeModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({
        message: 'Employee not found',
      });
    }

    // Regenerate the PDF with updated data
    const { form1Path, form2Path } = await generatePDF(employee);
    employee.pdfPaths = { form1: form1Path, form2: form2Path };

    // Save the updated PDF path to the database
    await employee.save();

    res.status(200).json({
      message: 'Employee updated successfully',
      employee,
    });
  } catch (error: any) {
    console.error("Error updating Employee: ", error)
    res.status(500).json({
      error: error.message,
    });
  }
}