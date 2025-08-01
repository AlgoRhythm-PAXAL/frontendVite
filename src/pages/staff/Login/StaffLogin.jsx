import Input from "../../../components/ui/LoginInput";
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import Logo from "../../../assets/userAssets/logo.jpg";

const backendURL = import.meta.env.VITE_BACKEND_URL;


const StaffLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${backendURL}/staff/login`,
        { email, password },
        { withCredentials: true }
      );

      console.log("=== FRONTEND: STAFF LOGIN RESPONSE ===");
      console.log("Full response:", response.data);
      console.log("Staff object:", response.data.staff);
      console.log("Staff branchId:", response.data.staff?.branchId);
      
      // Store staff information in localStorage
      const staffData = response.data.staff;
      
      if (!staffData) {
        console.error("No staff data in response");
        toast.error("Login Error", {
          description: "Invalid response from server",
          duration: 4000,
        });
        return;
      }
      
      // Extract branchId - handle both populated and non-populated cases
      let userCenter;
      if (typeof staffData.branchId === 'object' && staffData.branchId !== null) {
        userCenter = staffData.branchId._id;
      } else {
        userCenter = staffData.branchId;
      }
      
      console.log("=== STORING IN LOCALSTORAGE ===");
      console.log("staffData.branchId:", staffData.branchId);
      console.log("typeof staffData.branchId:", typeof staffData.branchId);
      console.log("extracted userCenter:", userCenter);
      console.log("staffId:", staffData._id);
      console.log("staffName:", staffData.name);
      
      if (!userCenter) {
        console.error("No valid branchId found in staff data");
        toast.error("Login Error", {
          description: "No branch assigned to this staff member",
          duration: 4000,
        });
        return;
      }
      
      localStorage.setItem('userCenter', userCenter.toString());
      localStorage.setItem('staffId', staffData._id.toString());
      localStorage.setItem('staffName', staffData.name);
      
      // Verify storage
      console.log("=== VERIFICATION ===");
      console.log("Stored userCenter:", localStorage.getItem('userCenter'));
      console.log("Stored staffId:", localStorage.getItem('staffId'));
      console.log("Stored staffName:", localStorage.getItem('staffName'));
      
      console.log("=== STAFF LOGIN SUCCESS ===");
      console.log("Full response:", response);
      console.log("Response data:", response.data);
      console.log("Staff object:", response.data.staff);
      console.log("Staff branchId:", response.data.staff?.branchId);
      console.log("Staff _id:", response.data.staff?._id);
      console.log("Staff name:", response.data.staff?.name);
      
      // Check if staff object and required fields exist
      if (!response.data.staff) {
        console.error("No staff object in response!");
        toast.error("Login Error", {
          description: "Invalid response from server",
          duration: 4000,
        });
        return;
      }
      
      if (!response.data.staff.branchId) {
        console.error("No branchId in staff object!");
        toast.error("Login Error", {
          description: "Staff center information missing",
          duration: 4000,
        });
        return;
      }
      
      // Verify storage (userCenter already set above)
      console.log("=== AFTER STORING IN LOCALSTORAGE ===");
      console.log("Stored userCenter:", localStorage.getItem('userCenter'));
      console.log("Stored staffId:", localStorage.getItem('staffId'));
      console.log("Stored staffName:", localStorage.getItem('staffName'));
      
      toast.success("Login Successful", {
        description: `Hello ${staffData.name}`,
        duration: 4000,
      });

      navigate("/staff/main-menu");
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";

      toast.error("Authentication Error", {
        description: errorMessage,
        duration: 4000,
        action: {
          label: "Retry",
          onClick: () => window.location.reload(),
        },
      });
      
    }finally {
      setIsLoading(false);
      setEmail("");
      setPassword("");
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
          Staff Login
        </h2>
        <form method="post" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 font-semibold text-sm">
              EMAIL
            </label>
            <Input
              type="email"
              placeholder="staff@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 mb-2 font-semibold text-sm">
              PASSWORD
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                  Authenticating...
                </div>
              ) : (
                "Login"
              )}
            </button>
          </div>

          <div className="flex items-center justify-center mb-6">
            <p
              className="text-s text-Primary hover:text-PrimaryHover transition-colors                                                                            
              duration-200 hover:underline underline-offset-4"
            >
              <Link to="/staff/forgot-password">Forgot password?</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffLogin;
