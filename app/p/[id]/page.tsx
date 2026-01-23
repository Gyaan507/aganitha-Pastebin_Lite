import { notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import Paste from '@/models/Paste';
import { getCurrentTime } from '@/lib/time';
import { headers } from 'next/headers'; 
import { NextRequest } from 'next/server';

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans">
      <div className="flex-1 p-4 md:p-8 max-w-3xl mx-auto w-full flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <a href="/" className="flex items-center text-gray-400 hover:text-white transition group">
            <span className="mr-2 group-hover:-translate-x-1 transition-transform">&larr;</span>
            Create New Paste
          </a>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Pastebin Lite
          </h1>
        </div>

        {/* Content Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden mb-8">
          <div className="bg-gray-900/50 border-b border-gray-700 p-4 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span className="flex items-center">
                📅 {new Date(paste.created_at).toLocaleString()}
              </span>
              {paste.max_views && (
                <span className="flex items-center text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded">
                  👁️ {Math.max(0, paste.max_views - paste.views)} views left
                </span>
              )}
            </div>
            {/* Note: Copy button removed to keep this single-file (server component) */}
            <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              Read Only
            </div>
          </div>

          <div className="p-0 overflow-auto">
            <pre className="p-6 text-sm md:text-base font-mono leading-relaxed text-gray-300 bg-[#0d1117] overflow-x-auto min-h-[300px]">
              {paste.content}
            </pre>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-gray-500 text-sm border-t border-gray-800 bg-gray-900/50 mt-auto">
        <p className="mb-2 text-gray-600 text-xs">
          {paste.max_views ? '⚠️ This paste will self-destruct after the view limit.' : '🔒 Securely stored in database.'}
        </p>
        <p>Made with <span className="text-red-500 animate-pulse">❤️</span> by <span className="text-gray-300 font-medium">Gyaneshwar Kumar</span></p>
      </footer>
    </div>
  );
}