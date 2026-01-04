'use client';

import { useState, useEffect } from 'react';

export default function PasteViewer({ content, date, views, maxViews }: any) {
  const [copied, setCopied] = useState(false);
  const [formattedDate, setFormattedDate] = useState(''); // 1. Start empty

  // 2. Calculate date ONLY after the component mounts in the browser
  useEffect(() => {
    setFormattedDate(new Date(date).toLocaleString());
  }, [date]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans p-4 md:p-8">
      <div className="max-w-3xl mx-auto w-full">
        
        {/* Header / Navigation */}
        <div className="flex justify-between items-center mb-6">
          <a 
            href="/" 
            className="flex items-center text-gray-400 hover:text-white transition group"
          >
            <span className="mr-2 group-hover:-translate-x-1 transition-transform">&larr;</span>
            Create New Paste
          </a>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Pastebin Lite
          </h1>
        </div>

        {/* Main Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
          
          {/* Toolbar */}
          <div className="bg-gray-900/50 border-b border-gray-700 p-4 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span className="flex items-center">
                {/* 3. Render the state variable, or a generic placeholder while loading */}
                📅 {formattedDate || '...'} 
              </span>
              {maxViews && (
                <span className="flex items-center text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded">
                  👁️ {Math.max(0, maxViews - views)} views left
                </span>
              )}
            </div>

            <button
              onClick={handleCopy}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition flex items-center gap-2 ${
                copied 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              }`}
            >
              {copied ? 'Copied!' : 'Copy Content'}
            </button>
          </div>

          {/* Code/Content Area */}
          <div className="p-0 overflow-auto">
            <pre className="p-6 text-sm md:text-base font-mono leading-relaxed text-gray-300 bg-[#0d1117] overflow-x-auto min-h-[300px]">
              {content}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600 text-sm">
          <p>
            Securely stored. 
            {maxViews ? ' Will self-destruct after limit.' : ' Permanently available.'}
          </p>
        </footer>
      </div>
    </div>
  );
}