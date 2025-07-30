
const LoadingSpinner = () => {
    return (
           <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="inline-block relative w-20 h-20">
          {/* Outer ring */}
          <div className="absolute inset-0 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          
          {/* Inner ring */}
          <div className="absolute inset-3 border-4 border-green-300 border-b-transparent rounded-full animate-spin animation-delay-200"></div>
          
          
          <div className="absolute inset-4 flex items-center justify-center">
         
          </div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Verifying your credentials...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait while we check your access</p>
      </div>
    </div>
    )
}

export default LoadingSpinner;