import { Suspense, lazy } from 'react';

// Lazy load the ForgotPassword component for better performance
const ForgotPassword = lazy(() => import('../../components/admin/authentication/ForgotPassword'));

// Loading component for better UX
const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-Primary border-t-transparent rounded-full animate-spin"></div>
    <span className="ml-2 text-gray-600">Loading...</span>
  </div>
);

// Background decorative component (extracted for better code organization)
const BackgroundDecorations = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute bottom-0 w-full">
      <div className="relative w-full h-[200px]">
        {/* First decorative SVG */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 390" 
          className="absolute bottom-0 w-full"
          aria-hidden="true"
        >
          <path 
            fill="#1f818c" 
            fillOpacity="1" 
            d="M0,192L60,197.3C120,203,240,213,360,229.3C480,245,600,267,720,250.7C840,235,960,181,1080,165.3C1200,149,1320,171,1380,181.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>
        {/* Second decorative SVG */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1400 280" 
          className="absolute bottom-0 w-full"
          aria-hidden="true"
        >
          <path 
            fill="#000000" 
            fillOpacity="1" 
            d="M0,192L60,197.3C120,203,240,213,360,197.3C480,181,600,139,720,122.7C840,107,960,117,1080,133.3C1200,149,1320,171,1380,181.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>
      </div>
    </div>
  </div>
);

const AdminForgotPassword = () => {
  return (
    <div className="min-h-screen bg-Background flex items-center justify-center relative overflow-hidden">
      {/* Main Content Container */}
      <div className="w-full max-w-lg mx-4 relative z-10">
        <Suspense fallback={<LoadingSpinner />}>
          <ForgotPassword />
        </Suspense>
      </div>

      {/* Background Decorations */}
      <BackgroundDecorations />
    </div>
  );
};

export default AdminForgotPassword;
