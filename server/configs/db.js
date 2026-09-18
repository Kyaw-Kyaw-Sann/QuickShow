import mongoose from "mongoose";

const connectDB = async () => {
    try{
        if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not configured');
        mongoose.connection.once('connected',() => console.log("Database connected"));
        await mongoose.connect(process.env.MONGODB_URI)
    } catch (error) {
        console.error('Database connection failed:', error.message);
        throw error;
    }
}
export default connectDB
