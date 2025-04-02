import Input from "../../components/ui/LoginInput";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";

const StaffLogin = () => {
  const [email, setEmail] = useState(""); // Declare a state variable
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    // prevent the browser from reloading the page
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/staff/login",
        { email, password },
        { withCredentials: true }
      );

      Cookies.set("StaffToken", response.data.token, {
        expires: 1,
        secure: true,
      });
      console.log("Token = " + Cookies.get("StaffToken"));

      console.log("Login successful, token stored in cookie.");
      alert(response.data.message); // Show success message

      navigate("/staff/MainMenu");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
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
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 mb-2 font-semibold text-sm">
              PASSWORD
            </label>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-center mb-6 mt-10">
            <button
              className="bg-Primary text-white px-20 py-4 w-64 rounded-xl font-semibold text-l hover:bg-PrimaryHover"
              type="submit"
            >
              Login
            </button>
          </div>

          <div className="flex items-center justify-center mb-6">
            <p className="text-s text-Primary hover:text-PrimaryHover">
              <Link to="/staff/forgot-password">Forgot password?</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffLogin;
