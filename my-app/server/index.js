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

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
)
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/stands', standsRoutes)
app.use('/api/requests', requestsRoutes)
app.use('/api/uploads', uploadsRoutes)
app.use('/api/faqs', faqsRoutes)

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`)
})
