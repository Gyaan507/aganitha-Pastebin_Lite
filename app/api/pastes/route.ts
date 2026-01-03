import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Paste from '@/models/Paste';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  try {
    await connectDB(); 

    const body = await req.json();
    const { content, ttl_seconds, max_views } = body;

   
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // Prepare Data
    const id = nanoid(8);
    const pasteData: any = {
      _id: id,
      content,
    };

    if (max_views) pasteData.max_views = max_views;
    
    // Calculate Expiry
    if (ttl_seconds) {
      const now = Date.now();
      pasteData.expires_at = new Date(now + (ttl_seconds * 1000));
    }

    // Save to MongoDB
    await Paste.create(pasteData);

    const url = `${req.nextUrl.origin}/p/${id}`;
    return NextResponse.json({ id, url }, { status: 200 });

  } catch (error) {
    console.error('Create Paste Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}