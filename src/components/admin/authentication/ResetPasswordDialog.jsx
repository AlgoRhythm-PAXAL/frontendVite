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

  const resetDialogState = () => {
    setStep(1);
    setCode("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordErrors([]);
    setConfirmPasswordError("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsLoading(false);
    setDirection("forward");
  };

  const handleClose = () => {
    resetDialogState();
    onClose();
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
      handleClose(); // Use the new reset function
    } catch (err) {
      toast.error("Failed to reset password", {
        description: err.response?.data?.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={`
        max-h-[90vh] overflow-y-auto max-w-md w-[95vw] sm:w-full
        transition-all duration-300 ease-in-out
        ${step === 1 ? 'min-h-[200px]' : ''}
        ${step === 2 ? 'min-h-[300px]' : ''}
        ${step === 3 ? 'min-h-[500px] max-h-[85vh]' : ''}
      `}>
        <DialogHeader>
          <DialogTitle className="transition-opacity duration-200 hover:opacity-75">
            Reset Password {step > 1 && `- Step ${step} of 3`}
          </DialogTitle>
          {/* Step Progress Indicator */}
          <div className="flex items-center justify-center space-x-2 pt-2">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${stepNumber === step 
                    ? 'bg-primary scale-150' 
                    : stepNumber < step 
                      ? 'bg-green-500' 
                      : 'bg-gray-300'
                  }
                `}
              />
            ))}
          </div>
        </DialogHeader>

        <div className={`
          relative w-full transition-all duration-300 ease-in-out
          ${step === 1 ? 'min-h-[120px]' : ''}
          ${step === 2 ? 'min-h-[100px]' : ''}
          ${step === 3 ? 'min-h-[300px]' : ''}
        `}>
          {/* Step 1 - Send Code */}
          {step === 1 && (
            <div
              className={`absolute inset-0 flex flex-col justify-center ${
                direction === "forward"
                  ? "animate-slide-in-right"
                  : "animate-slide-in-left"
              }`}
            >
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-muted-foreground text-sm transition-opacity duration-300">
                  A verification code will be sent to your registered email
                </p>
                <Button
                  onClick={sendCode}
                  disabled={isLoading}
                  className="w-full transition-transform duration-150 hover:scale-[1.02] active:scale-95"
                >
                  {isLoading ? "Sending..." : "Send Verification Code"}
                </Button>
              </div>
            </div>
          )}

          {/* Step 2 - Enter Code */}
          {step === 2 && (
            <div
              className={`absolute inset-0 flex flex-col justify-center ${
                direction === "forward"
                  ? "animate-slide-in-right"
                  : "animate-slide-in-left"
              }`}
            >
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Enter the verification code sent to your email
                  </p>
                </div>
                <Input
                  placeholder="Enter Verification Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="text-center text-lg tracking-wider transition-all duration-200 focus:ring-2 focus:ring-primary"
                  maxLength={6}
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
                    disabled={isLoading || !code.trim()}
                  >
                    {isLoading ? "Verifying..." : "Verify Code"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 - Reset Password */}
          {step === 3 && (
            <div
              className={`absolute inset-0 flex flex-col ${
                direction === "forward"
                  ? "animate-slide-in-right"
                  : "animate-slide-in-left"
              }`}
            >
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">
                  Create your new secure password
                </p>
              </div>
              
              <div className="flex-1 space-y-3 overflow-y-auto">
                {/* New Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">New Password</label>
                  <div className="relative">
                    <Input
                      placeholder="Enter new password"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      className={`pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary ${
                        passwordErrors.length > 0 ? "border-red-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-75"
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
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              getPasswordStrength(newPassword).color
                            }`}
                            style={{
                              width: `${(getPasswordStrength(newPassword).strength / 7) * 100}%`
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600 min-w-[40px]">
                          {getPasswordStrength(newPassword).label}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Password Requirements - Compact */}
                  {passwordErrors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-2">
                      <p className="text-xs font-medium text-red-800 mb-1">Requirements not met:</p>
                      <div className="text-xs text-red-700 space-y-0.5 max-h-20 overflow-y-auto">
                        {passwordErrors.slice(0, 2).map((error, index) => (
                          <div key={index} className="flex items-start gap-1">
                            <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                            <span className="text-xs">{error}</span>
                          </div>
                        ))}
                        {passwordErrors.length > 2 && (
                          <div className="text-red-600 text-xs font-medium">
                            +{passwordErrors.length - 2} more requirements
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <Input
                      placeholder="Confirm new password"
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
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-75"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  {/* Password Match Validation */}
                  {confirmPasswordError && (
                    <div className="flex items-center gap-1 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      {confirmPasswordError}
                    </div>
                  )}
                  
                  {confirmPassword && !confirmPasswordError && newPassword === confirmPassword && (
                    <div className="flex items-center gap-1 text-green-600 text-xs">
                      <CheckCircle className="w-3 h-3" />
                      Passwords match perfectly
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 mt-4 border-t border-gray-100">
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
