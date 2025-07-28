import Input from "../../../components/ui/LoginInput";
import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Logo from "../../../assets/userAssets/logo.jpg";

const backendURL = import.meta.env.VITE_BACKEND_URL;


const ForgotPasswordCode = () => {
  const location = useLocation();
  const { email } = location.state || {};

  const [resetCode, setResetCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${backendURL}/staff/verify-reset-code`,
        { email, resetCode }
      );

      console.log(response.data.success, response.data.message);
      if (response.data.success) {
        toast.success("Success", {
          description: response.data.message,
          duration: 4000,
        });

        navigate("/staff/reset-password", {
          state: { email: email, resetCode: resetCode },
        });
      }
    } catch (error) {
      console.error("Error :", error);
      const errorMessage =
        error.response?.data?.message ||
        "Invalid reset code. Please try again.";
      toast.error("Error", {
        description: errorMessage,
        duration: 4000,
        action: {
          label: "Retry",
          onClick: () => window.location.reload(),
        },
      });
    }
  };

  return (
      <div className="relative min-h-screen bg-[#f5f5fa] flex items-center justify-center overflow-hidden">
      {/* Background Waves */}
      <div className="absolute bottom-10 left-0 w-full z-0">
         <svg
          className="w-full h-auto"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#21767f"
            fillOpacity="1"
            d="M0,192L60,202.7C120,213,240,235,360,245.3C480,256,600,256,720,234.7C840,213,960,171,1080,149.3C1200,128,1320,128,1380,128L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-full z-0">
        <svg
          className="w-full h-auto"
          viewBox="0 0 1440 150"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#000000"
            d="M0,64L60,69.3C120,75,240,85,360,83.3C480,85,600,75,720,69.3C840,64,960,64,1080,74.7C1200,85,1320,95,1420,107.3L1440,110V160H1380C1320,160,1200,160,1080,160C960,160,840,160,720,160C600,160,480,160,360,160C240,160,120,160,60,160H0Z"
          />
        </svg>
      </div>
      <div className="z-10 w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex justify-center ">
          <img src={Logo} alt="PAXAL logo" className="w-[220px]  my-10" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Forgot Password
        </h2>
        <form method="post" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 font-semibold text-sm">
              Enter Code with 6 digits
            </label>
            <Input
              type="number"
              placeholder="Code"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-center mb-6 mt-10">
            <button
              type="submit"
              disabled={isLoading || resetCode.length != 6}
              className="w-2/3 px-4 py-4 bg-Primary text-white rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                  Submitting...
                </div>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordCode;
