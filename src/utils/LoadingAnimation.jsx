import { Loader } from "lucide-react";

const LoadingAnimation = ({ message = "Loading..." }) => {
  return (
    // <div className="flex flex-col justify-center items-center h-fit gap-4">
    //   <Loader2 className="animate-spin h-8 w-8 " />
    //   <p className="text-gray-600">{message} </p>
    // </div>


    // <div className="flex flex-col items-center justify-center p-8 ">
    //   <div className="w-8 h-8 border-4 border-Primary border-t-transparent rounded-full animate-spin mb-4"></div>
    //   <p className="text-gray-600 text-sm">{message}</p>
    // </div>

    <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">{message}</span>
      </div>
  );
};

export default LoadingAnimation;
