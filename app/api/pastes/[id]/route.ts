import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Paste from '@/models/Paste';
import { getCurrentTime } from '@/lib/time';

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const { id } = params;

  try {
    await connectDB();

    // 1. Find the paste
    const paste = await Paste.findById(id);

    if (!paste) {
      console.log(`Failed to find paste with ID: ${id}`); // Debug log
      return NextResponse.json({ error: 'Paste not found' }, { status: 404 });
    }

    // 2. Check Expiry (TTL)
    const now = getCurrentTime(req);
    if (paste.expires_at && new Date(paste.expires_at).getTime() < now) {
      return NextResponse.json({ error: 'Paste expired' }, { status: 404 });
    }

    // 3. Check View Limits & Atomically Increment
    if (paste.max_views !== undefined && paste.max_views !== null) {
      if (paste.views >= paste.max_views) {
        return NextResponse.json({ error: 'View limit exceeded' }, { status: 404 });
      }

      // Atomic Increment
      const updatedPaste = await Paste.findOneAndUpdate(
        { _id: id, views: { $lt: paste.max_views } },
        { $inc: { views: 1 } },
        { new: true }
      );

      if (!updatedPaste) {
        return NextResponse.json({ error: 'View limit exceeded' }, { status: 404 });
      }
      
      paste.views = updatedPaste.views;
    } else {
      await Paste.findByIdAndUpdate(id, { $inc: { views: 1 } });
    }

    // 4. Return Response
    return NextResponse.json({
      content: paste.content,
      remaining_views: paste.max_views ? Math.max(0, paste.max_views - paste.views) : null,
      expires_at: paste.expires_at ? paste.expires_at.toISOString() : null,
    });

  } catch (error) {
    console.error('Get Paste Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}