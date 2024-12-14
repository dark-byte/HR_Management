import express from 'express';
import router from './routes/employee.routes';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/employees', router);

// Static folder for PDFs
app.use('/pdfs', express.static(__dirname + '/storage/pdfs'));

export default app;