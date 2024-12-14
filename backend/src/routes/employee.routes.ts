import { Router } from 'express';
import { createEmployee, getEmployees, getEmployeeById, updateEmployee } from '../controllers/employee.controller';

const router = Router();

/**
 * @route POST /employees
 * @description Create a new employee record and generate a PDF
 * @access Public
 */
router.post('/', createEmployee);

/**
 * @route GET /employees/search
 * @description Search employees by joining date range and department
 * @access Public
 */
router.get('/search', getEmployees);

/**
 * @route GET /employees/:id
 * @description Fetch an employee's details by ID
 * @access Public
 */
router.get('/:id', getEmployeeById);

/**
 * @route PUT /employees/:id
 * @description Update an employee's details and regenerate the PDF
 * @access Public
 */
router.put('/:id', updateEmployee);

export default router;