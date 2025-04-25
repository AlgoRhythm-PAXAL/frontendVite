import Input from "../../components/ui/LoginInput";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const location = useLocation();

  const { email, resetCode } = location.state || {};

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim() || !confirmPassword.trim()) {
      alert("Password fields cannot be empty");
      return;
    }

    if (password !== confirmPassword) {
      alert("password doesn't match");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8000/staff/reset-password",
        { newPassword: password, resetCode: resetCode, email: email }
      );

      setMessage(response.data.message);

      if (response.data.success) {
        navigate("/staff/login");
      }
    } catch (error) {
      console.error(error);
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
              PASSWORD
            </label>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 mb-2 font-semibold text-sm">
              CONFIRM PASSWORD
            </label>
            <Input
              type="password"
              placeholder="Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-center mb-6 mt-10">
            <button
              className="bg-Primary text-white px-20 py-4 w-64 rounded-xl font-semibold text-l hover:bg-PrimaryHover"
              type="submit"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
