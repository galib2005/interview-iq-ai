import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorMiddleware';

// Route imports
import authRoutes from './routes/auth';
import interviewRoutes from './routes/interview';
import resumeRoutes from './routes/resume';
import codingRoutes from './routes/coding';
import dashboardRoutes from './routes/dashboard';
import roadmapRoutes from './routes/roadmap';

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Mounting API Routes
app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/roadmaps', roadmapRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});
