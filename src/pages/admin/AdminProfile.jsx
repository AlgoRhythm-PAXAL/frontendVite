import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ImagePlus, Lock, Edit3, Save, X, AlertCircle } from "lucide-react";
import ProfilePicture from "../../components/admin/ImageUpload/ProfilePicture";
import SectionTitle from "../../components/admin/SectionTitle";
import ImageUpload from "../../components/admin/ImageUpload/ImageUpload";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Modal from "../../components/admin/adminProfile/Modal";
import ResetPasswordDialog from "../../components/admin/authentication/ResetPasswordDialog";

const backendURL = import.meta.env.VITE_BACKEND_URL;

// Constants for validation
const VALIDATION_RULES = {
  name: {
    required: "Name is required",
    minLength: { value: 2, message: "Name must be at least 2 characters" },
    maxLength: { value: 50, message: "Name must not exceed 50 characters" }
  },
  email: {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address"
    }
  },
  nic: {
    required: "NIC is required",
    pattern: {
      value: /^(?:\d{9}[vVxX]|\d{12})$/,
      message: "NIC must be 9 digits followed by V/X or 12 digits"
    }
  },
  contactNo: {
    required: "Contact number is required",
    pattern: {
      value: /^(?:\+94|94|0)(\d{9})$/,
      message: "Enter a valid Sri Lankan phone number"
    }
  }
};

const AdminProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [openReset, setOpenReset] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      nic: "",
      contactNo: ""
    }
  });

  // Memoized form validation status
  const hasErrors = useMemo(() => 
    Object.keys(errors).length > 0, [errors]
  );

  // Format date consistently
  const formatDate = useCallback((dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Unknown";
    }
  }, []);

  // Fetch profile data with proper error handling
  const fetchProfileData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(`${backendURL}/api/admin/profile`, {
        withCredentials: true,
        timeout: 10000, // 10 second timeout
      });

      if (!response.data?.myData) {
        throw new Error("Invalid response format");
      }

      const userData = response.data.myData;
      const processedData = {
        ...userData,
        createdAt: formatDate(userData.createdAt),
      };

      setProfileData(processedData);
      reset({
        name: userData.name || "",
        email: userData.email || "",
        nic: userData.nic || "",
        contactNo: userData.contactNo || "",
      });
    } catch (error) {
      console.error("Profile fetch error:", error);
      
      let errorMessage = "Failed to load profile data";
      if (error.code === 'ECONNABORTED') {
        errorMessage = "Request timeout. Please check your connection.";
      } else if (error.response?.status === 401) {
        errorMessage = "You are not authorized to view this profile";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [formatDate, reset]);

  // Submit form with comprehensive error handling
  const onSubmit = useCallback(async (data) => {
    if (isSubmitting) return; // Prevent double submission
    
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await axios.patch(
        `${backendURL}/api/admin/profile/update`, 
        data, 
        {
          withCredentials: true,
          timeout: 10000,
        }
      );

      if (response.status === 200) {
        setIsEditing(false);
        toast.success("Profile updated successfully");
        
        // Update local state with new data
        setProfileData(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      
      let errorMessage = "Failed to update profile";
      if (error.code === 'ECONNABORTED') {
        errorMessage = "Request timeout. Please try again.";
      } else if (error.response?.status === 401) {
        errorMessage = "You are not authorized to update this profile";
      } else if (error.response?.status === 422) {
        errorMessage = "Please check your input data";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting]);

  // Cancel editing with confirmation if form is dirty
  const handleCancelEdit = useCallback(() => {
    if (isDirty) {
      if (window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        setIsEditing(false);
        reset(); // Reset form to original values
        setError(null);
      }
    } else {
      setIsEditing(false);
      setError(null);
    }
  }, [isDirty, reset]);

  // Initialize data on component mount
  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-8 p-6 max-w-4xl mx-auto">
        <SectionTitle title="Admin Profile" />
        <div className="space-y-4">
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !profileData) {
    return (
      <div className="space-y-8 p-6 max-w-4xl mx-auto">
        <SectionTitle title="Admin Profile" />
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <AlertCircle className="w-16 h-16 text-destructive" />
          <h3 className="text-lg font-semibold text-destructive">Error Loading Profile</h3>
          <p className="text-muted-foreground text-center max-w-md">{error}</p>
          <Button onClick={fetchProfileData} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 max-w-6xl mx-10 space-y-8">
      <SectionTitle title="Admin Profile" />

      {/* Error Alert */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
          <p className="text-destructive text-sm">{error}</p>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setError(null)}
            className="ml-auto"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Profile Header Section */}
      <div className="flex items-start gap-6 border rounded-xl p-6 bg-white shadow-sm">
        <div className="relative group">
          <ProfilePicture 
            publicId={profileData?.profilePicLink} 
            width="200" 
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-2 -bottom-2 rounded-full bg-background shadow-md hover:bg-muted transition-colors"
            onClick={() => setOpen(true)}
            aria-label="Change profile picture"
          >
            <ImagePlus className="w-5 h-5" />
          </Button>
          <Modal open={open} onClose={() => setOpen(false)}>
            <ImageUpload />
          </Modal>
        </div>

        <div className="space-y-2 flex-1">
          <h1 className="text-3xl font-bold text-foreground">
            {profileData?.name || "Unknown Admin"}
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Admin since {profileData?.createdAt || "Unknown"}
          </p>
        </div>
      </div>

      {/* Profile Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="border rounded-xl p-6 space-y-6 bg-white shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                  >
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || hasErrors}
                    className="relative"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button 
                  type="button" 
                  onClick={() => setIsEditing(true)}
                  disabled={!profileData}
                >
                  <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                {...register("name", VALIDATION_RULES.name)}
                disabled={!isEditing}
                placeholder="Enter your full name"
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  isEditing
                    ? "bg-background border-input focus:border-primary focus:ring-2 focus:ring-primary/20"
                    : "bg-muted/50 border-transparent"
                } ${errors.name ? "border-destructive" : ""}`}
              />
              {errors.name && (
                <span className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* NIC Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                NIC <span className="text-destructive">*</span>
              </label>
              <input
                {...register("nic", VALIDATION_RULES.nic)}
                disabled={!isEditing}
                placeholder="Enter your NIC number"
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  isEditing
                    ? "bg-background border-input focus:border-primary focus:ring-2 focus:ring-primary/20"
                    : "bg-muted/50 border-transparent"
                } ${errors.nic ? "border-destructive" : ""}`}
              />
              {errors.nic && (
                <span className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.nic.message}
                </span>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Email Address <span className="text-destructive">*</span>
              </label>
              <input
                {...register("email", VALIDATION_RULES.email)}
                disabled={!isEditing}
                type="email"
                placeholder="Enter your email address"
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  isEditing
                    ? "bg-background border-input focus:border-primary focus:ring-2 focus:ring-primary/20"
                    : "bg-muted/50 border-transparent"
                } ${errors.email ? "border-destructive" : ""}`}
              />
              {errors.email && (
                <span className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Contact Number Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Contact Number <span className="text-destructive">*</span>
              </label>
              <input
                {...register("contactNo", VALIDATION_RULES.contactNo)}
                disabled={!isEditing}
                type="tel"
                placeholder="Enter your contact number"
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  isEditing
                    ? "bg-background border-input focus:border-primary focus:ring-2 focus:ring-primary/20"
                    : "bg-muted/50 border-transparent"
                } ${errors.contactNo ? "border-destructive" : ""}`}
              />
              {errors.contactNo && (
                <span className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.contactNo.message}
                </span>
              )}
            </div>
          </div>

          {/* Form Helper Text */}
          {isEditing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Note:</span> Make sure all information is accurate before saving. 
                Changes will be reflected immediately across the system.
              </p>
            </div>
          )}
        </div>

        {/* Security Section */}
        <div className="border rounded-xl p-6 space-y-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold">Security</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
              <div className="space-y-1">
                <h3 className="font-medium">Password</h3>
                <p className="text-sm text-muted-foreground">
                  Last updated: Never shown for security
                </p>
              </div>
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpenReset(true)}
              >
                <Lock className="mr-2 h-4 w-4" />
                Reset Password
              </Button>
            </div>
          </div>
        </div>

        {/* Reset Password Dialog */}
        <ResetPasswordDialog
          open={openReset}
          onClose={() => setOpenReset(false)}
        />
      </form>
    </div>
  );
};

export default AdminProfile;
