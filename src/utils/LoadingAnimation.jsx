import { Loader2 } from "lucide-react";

const LoadingAnimation = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <Loader2 className="animate-spin h-8 w-8 " />
      <p className="text-gray-600">Loading...</p>
    </div>
  );
};

export default LoadingAnimation;
