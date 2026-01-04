import { notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import Paste from '@/models/Paste';
import { getCurrentTime } from '@/lib/time';
import { headers } from 'next/headers'; 
import { NextRequest } from 'next/server';
import PasteViewer from '@/components/PasteViewer';
// Helper to mock a NextRequest
async function createMockRequest() {
  const headersList = await headers(); 
  return new NextRequest('http://localhost', { headers: headersList });
}

async function getPaste(id: string) {
  await connectDB();
  
  const paste = await Paste.findById(id);
  if (!paste) return null;

  // Check Expiry
  const req = await createMockRequest();
  const now = getCurrentTime(req);
  
  if (paste.expires_at && new Date(paste.expires_at).getTime() < now) {
    return null;
  }

  // Check View Limit & Increment
  if (paste.max_views !== undefined && paste.max_views !== null) {
    if (paste.views >= paste.max_views) return null;

    const updated = await Paste.findOneAndUpdate(
      { _id: id, views: { $lt: paste.max_views } },
      { $inc: { views: 1 } },
      { new: true }
    );
    
    if (!updated) return null;
    return updated;
  } else {
    await Paste.findByIdAndUpdate(id, { $inc: { views: 1 } });
    return paste;
  }
}

export default async function ViewPaste(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const paste = await getPaste(params.id);

  if (!paste) {
    notFound();
  }

  return (
    <PasteViewer 
      content={paste.content} 
      date={paste.created_at.toString()}
      views={paste.views}
      maxViews={paste.max_views}
    />
  );
}