import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { initializeDatabase } from './database/database';
import taskRoutes from './routes/taskRoutes';
import taskListRoutes from './routes/taskListRoutes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.get('/api', (req: Request, res: Response) => {
  res.json({ success: true, message: 'API OK' });
});

app.use('/api/lists', taskListRoutes);
app.use('/api/tasks', taskRoutes);

app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Not found' });
});

try {
  initializeDatabase();
} catch (error) {
  console.error('DB init error:', error);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
});

export default app;
