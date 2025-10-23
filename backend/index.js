import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import customerRoutes from './routes/customerRoutes.js';
import customerAuthRoutes from './routes/customerAuthRoutes.js';
import agentRoutes from './routes/agentRoutes.js';

dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: ['https://insure-setu-frontend.onrender.com', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));


app.use(express.raw({ type: 'application/octet-stream', limit: '10mb' }));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Test route to check if server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CRM Backend is running!', timestamp: new Date().toISOString() });
});

// Customer routes
app.use('/api/customers', customerRoutes);
app.use('/api/users', customerRoutes);

// Customer authentication routes
app.use('/api/auth/customer', customerAuthRoutes);

// Agent routes
app.use('/api/agents', agentRoutes);

app.use(function (req, res) {
  res.status(404).send({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(status).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});