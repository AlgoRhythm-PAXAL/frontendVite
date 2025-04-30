import Input from "../../../components/ui/LoginInput";
import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Logo from "../../../assets/userAssets/logo.jpg";

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
        "http://localhost:8000/staff/verify-reset-code",
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
    <div className="flex h-screen items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
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
