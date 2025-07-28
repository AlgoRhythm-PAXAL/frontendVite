import { useEffect, useState } from "react";
import LoginInput from "../ui/LoginInput";
import { toast } from "sonner";
import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL;


const PasswordResetCodePopup = ({ isOpen, onClose, email}) => {
  if (!isOpen) return null;
const [confirm, setConfirm] = useState(false);
  const [resetCode, setResetCode] = useState("");
const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

 useEffect(() => {
    if (!isOpen) {
      setConfirm(false);
      setResetCode("");
      setShowPasswordReset(false);
      setNewPassword("");
      setConfirmPassword("");
    }

  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setConfirm(true);
    try {
      console.log("code confirming");
      const response = await axios.post(
        `${backendURL}/staff/verify-reset-code`,
        { email, resetCode }
      );

      console.log(response.data.success, response.data.message);
       if (response.data.success) {
        toast.success("Code Verified", {
          description: response.data.message,
          duration: 4000,
        });
        setShowPasswordReset(true); // Move to password stage.
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
    }finally {
        setConfirm(false);
    } 
    
  };

  const handlePasswordReset = async (e) => {
if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", {
        duration: 3000,
      });
      return;
    }
    setConfirm(true);
    try {
      console.log("password updating");
      const response = await axios.post(
        `${backendURL}/staff/reset-password`,
        { newPassword: newPassword, resetCode: resetCode, email: email }
      );

      if (response.data.success) {
        toast.success("Password Reset Successful", {
          description: "You can now log in with your new password.",
          duration: 4000,
        });
        onClose();
      }
    } catch (error) {
      console.error("Error :", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update the password. Please try again";
      toast.error("Error", {
        description: errorMessage,
        duration: 4000,
        action: {
          label: "Retry",
          onClick: () => window.location.reload(),
        },
      });
    }finally {
      setConfirm(false);
    }
  };

  return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md animate-fade-in">
        {!showPasswordReset ? (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-8">
              Enter the 6-digit code
            </h2>
            <LoginInput
              type="number"
              placeholder="Reset Code"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
            />
            <div className="flex justify-end gap-4 mt-7">
              <button
                disabled={confirm}
                onClick={onClose}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                disabled={confirm}
                onClick={handleConfirm}
                className="px-4 py-2 rounded-md bg-Primary text-white font-semibold hover:bg-Primary-dark transition"
              >
                {confirm ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                    Confirming..
                  </div>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-8">
              Enter New Password
            </h2>
          <p className="text-md ">New Password:</p>
            <LoginInput
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <br/><br/>
            <p className="text-md ">Confirm Password:</p>
            <LoginInput
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="flex justify-end gap-4 mt-7">
              <button
                disabled={confirm}
                onClick={onClose}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                disabled={confirm}
                onClick={handlePasswordReset}
                className="px-4 py-2 rounded-md bg-Primary text-white font-semibold hover:bg-Primary-dark transition"
              >
                {confirm ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                    Resetting..
                  </div>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PasswordResetCodePopup;
