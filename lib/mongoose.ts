'use server'
import mongoose from 'mongoose';

const connectToDB = async () => {
  
  const mongodbUri = process.env.NEXT_PUBLIC_SOMETHING_MONGODB_URI;


  if (!mongodbUri) {
    console.log('No MONGODB_URI specified');
    return;
  }

  try {
    await mongoose.connect(mongodbUri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Database connection failed');
  }
};

export default connectToDB;
