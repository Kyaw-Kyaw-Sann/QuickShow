import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/db.js'
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import showRouter from './routes/showRoutes.js'
import bookingRouter from './routes/bookingRoutes.js'


const app = express()
const PORT = process.env.PORT || 3000

await connectDB()

//Middleware
app.use(express.json())
app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || true, credentials: true }))
app.use(clerkMiddleware())

//API Routes
app.get('/',(req, res) => res.send("Server is Working!"))
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use('/api/shows',showRouter)
app.use('/api/bookings', bookingRouter)


if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT,() => console.log(`Server listening at http://localhost:${PORT}`))
}

export default app
