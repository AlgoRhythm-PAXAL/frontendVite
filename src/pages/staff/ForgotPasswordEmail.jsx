import Input from "../../components/ui/LoginInput";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPasswordEmail = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(email);
      const response = await axios.post(
        "http://localhost:8000/staff/forgot-password",
        { email }
      );

      setTimeout(() => {
        navigate("/staff/forgot-password-code", { state: { email: email } });
      }, 2000); // Optional delay for demo purposes
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error :", error);

      setMessage("Error: Unable to send reset email");
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
              Enter Your Email
            </label>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-center mb-6 mt-10">
            <button
              className="bg-Primary text-white px-20 py-4 w-64 rounded-xl font-semibold text-l hover:bg-PrimaryHover"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordEmail;
