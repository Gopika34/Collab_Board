import mongoose from "mongoose";

const connectDB=async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB is connected!");
    }
    catch(err){
        console.log('MongoDB connection failed:',err.message);
        throw err;
        // process.exit(1);
    }
}

export default connectDB;