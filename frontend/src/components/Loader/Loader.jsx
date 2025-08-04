export default function Loader() {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        
        {/* Inner pulsing dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
        
        {/* Glowing effect */}
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin opacity-60 blur-sm"></div>
      </div>
      
      {/* Loading text */}
      <div className="absolute mt-24 text-gray-600 font-medium animate-pulse">
        Loading...
      </div>
    </div>
  );
}