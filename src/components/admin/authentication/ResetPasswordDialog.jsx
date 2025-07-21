import { useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";
import { AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";

const backendURL = import.meta.env.VITE_BACKEND_URL;

// Password validation function
const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    errors.push("Password is required");
  } else {
    if (password.length < 8) {
      errors.push("Must be at least 8 characters long");
    }
    if (password.length > 128) {
      errors.push("Must not exceed 128 characters");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Must contain at least one number");
    }
    if (!/[@$!%*?&]/.test(password)) {
      errors.push("Must contain at least one special character (@$!%*?&)");
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Password strength calculator
const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: "None", color: "bg-gray-200" };
  
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[@$!%*?&]/.test(password)) score++;
  if (password.length >= 16) score++;
  
  if (score <= 2) return { strength: score, label: "Weak", color: "bg-red-500" };
  if (score <= 4) return { strength: score, label: "Fair", color: "bg-yellow-500" };
  if (score <= 6) return { strength: score, label: "Good", color: "bg-blue-500" };
  return { strength: score, label: "Strong", color: "bg-green-500" };
};

const ResetPasswordDialog = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [direction, setDirection] = useState("forward");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Validate password in real-time
  const handlePasswordChange = (password) => {
    setNewPassword(password);
    const validation = validatePassword(password);
    setPasswordErrors(validation.errors);
  };

  // Validate password confirmation
  const handleConfirmPasswordChange = (confirmPwd) => {
    setConfirmPassword(confirmPwd);
    if (confirmPwd && newPassword && confirmPwd !== newPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const animateStep = (newStep, direction) => {
    setDirection(direction);
    setStep(newStep);
  };

  const sendCode = async () => {
    setIsLoading(true);
    try {
      await axios.post(
        `${backendURL}/api/admin/auth/send-otp`,
        {},
        { withCredentials: true }
      );
      toast.success("Verification code sent to your email");
      animateStep(2, "forward");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send code");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!code) {
      toast.error("Please enter the verification code");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(
        `${backendURL}/api/admin/auth/verify-otp-logged`,
        { otp: code },
        { withCredentials: true }
      );
      toast.success("OTP verified successfully");
      animateStep(3, "forward");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    // Validate password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      toast.error("Please fix password requirements", {
        description: passwordValidation.errors[0]
      });
      return;
    }

    // Check password confirmation
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    setIsLoading(true);
    try {
      await axios.patch(
        `${backendURL}/api/admin/auth/reset-password-logged`,
        {
          otp: code,
          password: newPassword,
          confirmPassword: confirmPassword,
        },
        { withCredentials: true }
      );
      toast.success("Password updated successfully");
      onClose();
      // Reset all form state
      setStep(1);
      setCode("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordErrors([]);
      setConfirmPasswordError("");
    } catch (err) {
      toast.error("Failed to reset password", {
        description: err.response?.data?.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden">
        <DialogHeader>
          <DialogTitle className="transition-opacity duration-200 hover:opacity-75">
            Reset Password
          </DialogTitle>
        </DialogHeader>

        <div className="relative min-h-[200px]">
          {/* Step 1 */}
          {step === 1 && (
            <div
              className={`absolute inset-0 ${
                direction === "forward"
                  ? "animate-slide-in-right"
                  : "animate-slide-in-left"
              }`}
            >
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm transition-opacity duration-300">
                  A verification code will be sent to your registered email
                </p>
                <Button
                  onClick={sendCode}
                  disabled={isLoading}
                  className="transition-transform duration-150 hover:scale-[1.02] active:scale-95"
                >
                  {isLoading ? "Sending..." : "Send Verification Code"}
                </Button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div
              className={`absolute inset-0 ${
                direction === "forward"
                  ? "animate-slide-in-right"
                  : "animate-slide-in-left"
              }`}
            >
              <div className="space-y-4">
                <Input
                  placeholder="Enter Verification Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => animateStep(1, "back")}
                    className="flex-1 transition-transform duration-150 hover:scale-[1.02] active:scale-95"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={verifyOTP}
                    className="flex-1 transition-transform duration-150 hover:scale-[1.02] active:scale-95"
                    disabled={isLoading}
                  >
                    {isLoading ? "Verifying..." : "Verify Code"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div
              className={`absolute inset-0 ${
                direction === "forward"
                  ? "animate-slide-in-right"
                  : "animate-slide-in-left"
              }`}
            >
              <div className="space-y-4">
                {/* New Password Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      placeholder="New Password"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      className={`pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary ${
                        passwordErrors.length > 0 ? "border-red-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              getPasswordStrength(newPassword).color
                            }`}
                            style={{
                              width: `${(getPasswordStrength(newPassword).strength / 7) * 100}%`
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                          {getPasswordStrength(newPassword).label}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Password Requirements */}
                  {passwordErrors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-xs font-medium text-red-800 mb-1">Password must:</p>
                      <ul className="text-xs text-red-700 space-y-1">
                        {passwordErrors.map((error, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      placeholder="Confirm New Password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                      className={`pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary ${
                        confirmPasswordError ? "border-red-500" : ""
                      } ${
                        confirmPassword && !confirmPasswordError && newPassword === confirmPassword 
                          ? "border-green-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  {/* Confirm Password Validation */}
                  {confirmPasswordError && (
                    <div className="flex items-center gap-1 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      {confirmPasswordError}
                    </div>
                  )}
                  
                  {confirmPassword && !confirmPasswordError && newPassword === confirmPassword && (
                    <div className="flex items-center gap-1 text-green-600 text-xs">
                      <CheckCircle className="w-3 h-3" />
                      Passwords match
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => animateStep(2, "back")}
                    className="flex-1 transition-transform duration-150 hover:scale-[1.02] active:scale-95"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleReset}
                    className="flex-1 transition-transform duration-150 hover:scale-[1.02] active:scale-95"
                    disabled={
                      isLoading || 
                      passwordErrors.length > 0 || 
                      confirmPasswordError || 
                      !newPassword || 
                      !confirmPassword ||
                      newPassword !== confirmPassword
                    }
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

ResetPasswordDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ResetPasswordDialog;
