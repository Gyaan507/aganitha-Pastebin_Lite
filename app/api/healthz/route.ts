import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    if (mongoose.connection.readyState === 1) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false }, { status: 500 });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}