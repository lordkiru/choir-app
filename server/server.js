require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')

// Routes
const authRoutes = require('./routes/auth')
const songRoutes = require('./routes/songs')
const submissionRoutes = require('./routes/submissions')
const approvalRoutes = require('./routes/approvals')
const userRoutes = require('./routes/users')

// Cron jobs (registers itself on require)
require('./jobs/weeklyReset')

const app = express()

// --- Middleware ---
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:4173',
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (mobile apps, curl, Render health checks)
    if (!origin) return callback(null, true)
    if (allowedOrigins.some((o) => origin.startsWith(o))) return callback(null, true)
    callback(new Error(`CORS: origin ${origin} not allowed`))
  },
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// --- Routes ---
app.use('/api/auth', authRoutes)
app.use('/api/songs', songRoutes)
app.use('/api/submissions', submissionRoutes)
app.use('/api/approvals', approvalRoutes)
app.use('/api/users', userRoutes)

// Admin reset is nested under approvals router but aliased here too for clarity
// (already handled inside approvals.js as POST /api/approvals/admin/reset-week)

// --- Health check ---
app.get('/api/health', (req, res) => res.json({ ok: true }))

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

// --- Start ---
const PORT = process.env.PORT || 5000
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
