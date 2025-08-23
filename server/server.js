import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/db.js'
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"


const app = express()
const PORT = 3000
app.use(clerkMiddleware())

await connectDB()

//Middleware
app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())
app.use("/api/inngest", serve({ client: inngest, functions }));

//Routes
app.get('/',(req, res) => res.send("Server is Live!"))


app.listen(PORT,() => console.log(`Server listening at http://localhost:${PORT}`))