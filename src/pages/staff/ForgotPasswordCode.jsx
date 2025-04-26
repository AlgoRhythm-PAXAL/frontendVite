import Input from "../../components/ui/LoginInput";
import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ForgotPasswordCode = () => {
  const location = useLocation();
  const { email } = location.state || {};

  const [resetCode, setResetCode] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/staff/verify-reset-code",
        { email, resetCode }
      );

      setMessage(response.data.message);

      if (response.data.success) {
        navigate("/staff/reset-password", {
          state: { email: email, resetCode: resetCode },
        });
      }
    } catch (error) {
      console.error("Axios error:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Something went wrong");
      alert(error.response?.data?.message || "Invalid reset code");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
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
              className={`bg-Primary text-white px-20 py-4 w-64 rounded-xl font-semibold text-l 
                ${
                  resetCode.length !== 6
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-PrimaryHover"
                }`}
              type="submit"
              disabled={resetCode.length !== 6}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordCode;
