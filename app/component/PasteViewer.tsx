import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans">
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        
        {/* Error Card */}
        <div className="bg-gray-800/50 border border-gray-700 p-8 md:p-12 rounded-2xl shadow-2xl max-w-lg w-full backdrop-blur-sm">
          
          {/* Icon */}
          <div className="text-6xl mb-6 animate-bounce">
            😕
          </div>

          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400">
            Paste Unavailable
          </h2>
          
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            This paste is no longer accessible. It may have <span className="text-red-400 font-semibold">expired</span>, reached its <span className="text-orange-400 font-semibold">view limit</span>, or the link is incorrect.
          </p>

          {/* Action Button */}
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-all shadow-lg hover:shadow-blue-500/30 group"
          >
            <span className="mr-2 group-hover:-translate-x-1 transition-transform">&larr;</span>
            Create a New Paste
          </Link>

        </div>

      </div>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-gray-500 text-sm border-t border-gray-800 bg-gray-900/50">
        <p>
          Made with <span className="text-red-500">❤️</span> by{' '}
          <span className="text-gray-300 font-medium">Gyaneshwar Kumar</span>
        </p>
      </footer>

    </div>
  );
}