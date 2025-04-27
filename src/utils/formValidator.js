import { toast } from "sonner";

const validateEmail = (email) => {
  const requiredMessage = "Please enter your email to sign up!";
  const invalidMessage = "Oops! That doesn't look like a valid email.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    toast.error(requiredMessage);
    return false;
  } else if (!emailRegex.test(email)) {
    toast.error(invalidMessage);
    return false;
  }
  return true;
};

const validatePassword = (password) => {
    return true; 
  if (!password) {
    toast.error("Password is required");
    return false;
  } else if (password.length < 8) {
    toast.error("Password must be at least 8 characters");
    return false;
  } else if (!/[A-Z]/.test(password)) {
    toast.error("Password must contain at least one uppercase letter");
    return false;
  } else if (!/[a-z]/.test(password)) {
    toast.error("Password must contain at least one lowercase letter");
    return false;
  } else if (!/[0-9]/.test(password)) {
    toast.error("Password must contain at least one number");
    return false;
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    toast.error("Password must contain at least one special character");
    return false;
  }
  return true; 
};

export default { validateEmail, validatePassword };
