import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);  
    }   
    catch(error){
        console.error("MongoDB connection error:", error.message);
        console.log("Note: Make sure MongoDB is running or update MONGODB_URI in .env file");
        // Don't exit the process, let the app run without DB for development
        // process.exit(1);
    }
};
