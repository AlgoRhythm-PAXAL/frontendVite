import { useState } from "react";
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
const backendURL = import.meta.env.VITE_BACKEND_URL;

const ResetPasswordDialog = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [direction, setDirection] = useState("forward");

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
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
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
      setStep(1);
      setCode("");
      setNewPassword("");
      setConfirmPassword("");
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

        <div className="relative h-28">
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
                <Input
                  placeholder="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                />
                <Input
                  placeholder="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                />
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
                    disabled={isLoading}
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

export default ResetPasswordDialog;
