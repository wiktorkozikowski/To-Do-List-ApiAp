import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import { initializeDatabase } from './database/database';
import taskRoutes from './routes/taskRoutes';
import taskListRoutes from './routes/taskListRoutes';
import authRoutes from './routes/authRoutes';
import { requireAuth } from './middleware/authMiddleware';

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

const SQLiteStore = connectSqlite3(session);
app.use(
  session({
    store: new SQLiteStore({
      db: 'sessions.db',
      dir: path.join(__dirname, '../../')
    }),
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax'
    }
  })
);
app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.get('/api', (req: Request, res: Response) => {
  res.json({ success: true, message: 'API OK' });
});

app.use('/api/auth', authRoutes);
app.use('/api/lists', requireAuth, taskListRoutes);
app.use('/api/tasks', requireAuth, taskRoutes);

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
