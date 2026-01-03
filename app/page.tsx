'use client';

import { useState } from 'react';

export default function Home() {
  const [content, setContent] = useState('');
  const [ttl, setTtl] = useState<number | ''>('');
  const [maxViews, setMaxViews] = useState<number | ''>('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setGeneratedUrl('');

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

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto font-sans bg-white text-black">
      <h1 className="text-3xl font-bold mb-6">Pastebin Lite</h1>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4 border p-6 rounded-lg shadow-sm bg-gray-50">
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            required
            className="w-full border rounded p-2 h-40 bg-white"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your text here..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">TTL (Seconds)</label>
            <input
              type="number"
              className="w-full border rounded p-2 bg-white"
              value={ttl}
              onChange={(e) => setTtl(Number(e.target.value))}
              placeholder="e.g. 60"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Max Views</label>
            <input
              type="number"
              className="w-full border rounded p-2 bg-white"
              value={maxViews}
              onChange={(e) => setMaxViews(Number(e.target.value))}
              placeholder="e.g. 5"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:bg-gray-400"
        >
          {loading ? 'Creating...' : 'Create Paste'}
        </button>
      </form>

      {/* Success Output */}
      {generatedUrl && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <p className="font-semibold text-green-800">Paste Created!</p>
          <div className="flex items-center gap-2 mt-2">
            <input
              readOnly
              className="flex-1 p-2 border rounded bg-white"
              value={generatedUrl}
            />
            <a
              href={generatedUrl}
              target="_blank" // Opens in new tab
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              Visit
            </a>
          </div>
        </div>
      )}

      {/* Error Output */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}
    </main>
  );
}