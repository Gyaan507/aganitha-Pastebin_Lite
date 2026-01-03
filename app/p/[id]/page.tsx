import { notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import Paste from '@/models/Paste';
import { getCurrentTime } from '@/lib/time';
import { headers } from 'next/headers'; 
import { NextRequest } from 'next/server';

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
    <main className="min-h-screen p-8 max-w-2xl mx-auto font-sans">
      <div className="mb-4">
        <a href="/" className="text-blue-600 hover:underline">&larr; Create New</a>
      </div>
      
      <div className="border rounded-lg shadow-sm bg-white p-6 text-black">
        <h1 className="text-xl font-bold mb-4 pb-2 border-b">Paste Content</h1>
        <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded">
          {paste.content}
        </pre>
        
        <div className="mt-4 text-xs text-gray-400 flex gap-4">
          <span>Created: {new Date(paste.created_at).toLocaleString()}</span>
          {paste.max_views && (
            <span>Remaining Views: {Math.max(0, paste.max_views - paste.views)}</span>
          )}
        </div>
      </div>
    </main>
  );
}