'use client';

import { useState } from 'react';

export default function Home() {
  const [content, setContent] = useState('');
  const [ttl, setTtl] = useState<number | ''>('');
  const [maxViews, setMaxViews] = useState<number | ''>('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setGeneratedUrl('');
    setCopied(false);

    try {
      const res = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          ttl_seconds: ttl ? Number(ttl) : undefined,
          max_views: maxViews ? Number(maxViews) : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setGeneratedUrl(data.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans">
      
      <main className="flex-1 p-4 md:p-8 max-w-2xl mx-auto w-full flex flex-col justify-center">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Pastebin Lite</h1>
          <p className="text-gray-400">Share text securely with auto-expiry and view limits.</p>
        </div>

        {/* Card Container */}
        <div className="bg-gray-800 border border-gray-700 p-6 md:p-8 rounded-2xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Content Input */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">New Paste</label>
              <textarea
                required
                className="w-full border border-gray-600 rounded-lg p-4 h-40 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type or paste your content here..."
              />
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  TTL (Seconds) <span className="text-xs text-gray-500">(Optional)</span>
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-600 rounded-lg p-2.5 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={ttl}
                  onChange={(e) => setTtl(Number(e.target.value))}
                  placeholder="e.g. 60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Max Views <span className="text-xs text-gray-500">(Optional)</span>
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-600 rounded-lg p-2.5 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={maxViews}
                  onChange={(e) => setMaxViews(Number(e.target.value))}
                  placeholder="e.g. 5"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-lg transition-all transform active:scale-95 ${
                loading
                  ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/30'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Paste'
              )}
            </button>
          </form>

          {/* Success Section */}
          {generatedUrl && (
            <div className="mt-8 p-4 bg-green-900/30 border border-green-500/50 rounded-lg animate-in fade-in slide-in-from-top-4 duration-500">
              <p className="font-semibold text-green-400 mb-2"> Paste Created Successfully!</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  readOnly
                  className="flex-1 p-2.5 border border-green-500/30 rounded bg-black/40 text-green-100 text-sm truncate"
                  value={generatedUrl}
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition flex items-center justify-center gap-2 min-w-[100px]"
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                      Copy
                    </>
                  )}
                </button>
                <a
                  href={generatedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded transition text-center"
                >
                  Visit
                </a>
              </div>
            </div>
          )}

          {/* Error Section */}
          {error && (
            <div className="mt-6 p-4 bg-red-900/30 border border-red-500/50 text-red-200 rounded-lg animate-pulse">
              ⚠️ {error}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-gray-500 text-sm border-t border-gray-800 mt-auto">
        <p>
          Made with <span className="text-red-500 animate-pulse">❤️</span> by{' '}
          <span className="text-gray-300 font-medium">Gyaneshwar Kumar</span>
        </p>
      </footer>
    </div>
  );
}