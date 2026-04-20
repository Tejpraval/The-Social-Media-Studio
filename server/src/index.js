import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import { authRouter } from './routes/auth.js';
import { brandRouter } from './routes/brand.js';
import { projectRouter } from './routes/projects.js';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 60_000, limit: 120 }));

app.get('/health', (_req, res) => res.json({ ok: true, name: 'CreatorOS API' }));
app.use('/api/auth', authRouter);
app.use('/api/brand', brandRouter);
app.use('/api/projects', projectRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong' });
});

connectDb()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`CreatorOS API listening on ${env.port}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed', error);
    process.exit(1);
  });
