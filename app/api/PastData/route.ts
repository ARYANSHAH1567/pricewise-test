// app/api/TrackedData/route.ts
import { NextResponse } from 'next/server';
import User from '@/lib/models/users.models';
import connectToDB from '../../../lib/mongoose';

export async function POST(request: Request) {
    try {
  const body = await request.json();
  const  userEmail  = body.userEmail;


    await connectToDB();

    if (!userEmail) {
      return NextResponse.json({ message: 'User email is required' }, { status: 400 });
    }

 
    const user = await User.findOne({ email: userEmail }).populate('PastProd');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ products: user.PastProd }, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}
