import Input from "../../../components/ui/LoginInput";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Logo from "../../../assets/userAssets/logo.jpg";

const ForgotPasswordEmail = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      console.log(email);
      const response = await axios.post(
        "http://localhost:8000/staff/forgot-password",
        { email }
      );

      setTimeout(() => {
        navigate("/staff/forgot-password-code", { state: { email: email } });
      }, 2000);
      toast.success("Success", {
        description: response.data.message,
        duration: 4000,
      });
    } catch (error) {
      console.error("Error :", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send the password reset email. Please check your email address.";
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
          <img src={Logo} alt="PAXAL logo" className="w-[220px]  my-7" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Forgot Password
        </h2>
        <form method="post" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 font-semibold text-sm">
              Enter Your Email
            </label>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-center mb-6 mt-10">
            <button
              type="submit"
              disabled={isLoading}
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
          <div className="flex items-center justify-center mb-6">
            <p
              className="text-s text-Primary hover:text-PrimaryHover transition-colors                                                                            
              duration-200 hover:underline underline-offset-4"
            >
              <Link to="/staff/login">Login?</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordEmail;
