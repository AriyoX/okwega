export default function NotFound() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Oops - Page Not Found</h1>
        <p className="text-gray-600 mb-8">Sorry, the page you are looking for does not exist.</p>
        <a 
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Return Home
        </a>
      </div>
    );
  }