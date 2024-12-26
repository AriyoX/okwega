export default function Error() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-7xl font-bold mb-4">Error</h1>
        <p className="text-gray-600 mb-8">Unfortunately, you have encountered an error, but don&apos;t fret, it&apos;s on our side.</p>
        <a 
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Return Home
        </a>
      </div>
    );
  }