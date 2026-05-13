import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import standsRoutes from './routes/stands.js'
import requestsRoutes from './routes/requests.js'
import uploadsRoutes from './routes/uploads.js'
import faqsRoutes from './routes/faqs.js'

const app = express()
const PORT = process.env.PORT || 4000

const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/stands', standsRoutes)
app.use('/api/requests', requestsRoutes)
app.use('/api/uploads', uploadsRoutes)
app.use('/api/faqs', faqsRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`)
})
