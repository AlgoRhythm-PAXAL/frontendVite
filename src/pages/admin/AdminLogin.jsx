import FormField from "../../components/admin/FormField";
import axios from "axios";
import { useState } from "react";
import LOGO from "../../assets/Velox-Logo.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import formValidator from "../../utils/formValidator.js";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents form from reloading

    // ✅ Validate email and password using formValidator
    const isEmailValid = formValidator.validateEmail(formData.email);
    

    if (!isEmailValid || !formData.password) {
      return; // 🛑 Stop if validation fails
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/admin/login",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Login Successful", {
        description: `Hello ${response.data.admin.name}`,
        duration: 2000,
        action: { label: "Dashboard", onClick: () => navigate("/admin") },
      });
      console.log("Login successful");

      setTimeout(() => navigate("/admin"), 1000);
    } catch (error) {
      const errorMessage = "Login failed. Please check your credentials.";
      // const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error("Authentication Error", {
        description: errorMessage,
        action: {
          label: "Retry",
          onClick: () => window.location.reload(),
        },
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col h-screen bg-Background items-center justify-center relative">
      <div className="flex flex-col items-center justify-center w-1/3 bg-white pb-8 px-16 rounded-3xl relative z-10">
        <img src={LOGO} alt="LOGO" width={120} height={120} className="mt-8" />

        <div className="text-center w-full">
          <h1 className="font-semibold text-3xl my-10 font-mulish">
            Admin Login
          </h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center gap-5 w-full"
        >
          <div className="flex flex-col items-center justify-center w-full  gap-3">
            <FormField
              label="Email :"
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@gmail.com"
              required
            />
            <FormField
              label="Password: "
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-2/3 px-4 py-3 bg-Primary text-white rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                Loggin in.....
              </div>
            ) : (
              "Login"
            )}
          </button>
          <Link
            to="/admin/forgotPassword"
            className="text-Primary hover:text-primary-dark transition-colors"
          >
            Forgot Password?
          </Link>
        </form>
      </div>

      {/* Overlapping SVGs */}
      <div className="absolute bottom-0 w-full ">
        <div className="relative w-full h-[200px]">
          {/* First SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 390"
            className="absolute bottom-0 w-full"
          >
            <path
              fill="#1f818c"
              fillOpacity="1"
              d="M0,192L60,197.3C120,203,240,213,360,229.3C480,245,600,267,720,250.7C840,235,960,181,1080,165.3C1200,149,1320,171,1380,181.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
          {/* Second SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1400 280"
            className="absolute bottom-0 w-full"
          >
            <path
              fill="#000000"
              fillOpacity="1"
              d="M0,192L60,197.3C120,203,240,213,360,197.3C480,181,600,139,720,122.7C840,107,960,117,1080,133.3C1200,149,1320,171,1380,181.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
