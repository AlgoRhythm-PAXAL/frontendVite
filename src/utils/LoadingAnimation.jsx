import { Loader2 } from "lucide-react";

const LoadingAnimation = ({ message = "Loading..." }) => {
  return (
    // <div className="flex flex-col justify-center items-center h-fit gap-4">
    //   <Loader2 className="animate-spin h-8 w-8 " />
    //   <p className="text-gray-600">{message} </p>
    // </div>
    <div className="flex flex-col items-center justify-center p-8 ">
      <div className="w-8 h-8 border-4 border-Primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
};

export default LoadingAnimation;
