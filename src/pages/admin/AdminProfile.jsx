import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ImagePlus, Lock, Edit3, Save, X } from "lucide-react";
import ProfilePicture from "../../components/admin/ImageUpload/ProfilePicture";
import SectionTitle from "../../components/admin/SectionTitle";
import ImageUpload from "../../components/admin/ImageUpload/ImageUpload";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Modal from "../../components/admin/adminProfile/Modal";
import ForgotPassword from "../../components/admin/authentication/ForgotPassword";
import ResetPasswordDialog from '../../components/admin/authentication/ResetPasswordDialog'; 

const AdminProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const fileInputRef = useRef(null);
  const [openReset, setOpenReset] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const backendURL = import.meta.env.VITE_BACKEND_URL;
        const response = await axios.get(`${backendURL}/admin/get/myData`, {
          withCredentials: true,
        });

        const processedData = {
          ...response.data.myData,
          createdAt: new Date(
            response.data.myData.createdAt
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
        };

        setProfileData(processedData);
        reset({
          name: processedData.name,
          email: processedData.email,
          nic: processedData.nic,
          contactNo: processedData.contactNo,
        });
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    };

    fetchProfileData();
  }, [reset]);

  const onSubmit = async (data) => {
    console.log("Form submitting ONLY:", data);
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/update/profile`,
        data,
        { withCredentials: true }
      );
      setIsEditing(false);
      toast.success("Profile updated successfully", { duration: 800 });
      setTimeout(() => reload(), 800);
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error(error.response?.data?.message || "Update failed", {
        description: "Hello",
      });
    }
  };

  const reload = () => {
    setIsEditing(false);
    window.location.reload();
  };

  if (!profileData)
    return (
      <div className="space-y-8 p-6 max-w-4xl mx-auto">
        <SectionTitle title="Admin Profile" />
        <div className="space-y-4">
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-48" />
          </div>
        </div>
      </div>
    );

  return (
    <div className="px-6 max-w-6xl mx-10 space-y-8 ">
      <SectionTitle title="Admin Profile" />

      {/* Profile Header Section */}
      <div className="flex items-start gap-6 border rounded-xl p-6 space-y-6 bg-white">
        <div className="relative group">
          <ProfilePicture publicId={profileData.profilePicLink} width="200" />

          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-2 -bottom-2 rounded-full bg-background shadow-md hover:bg-muted"
            onClick={() => setOpen(true)}
          >
            <ImagePlus className="w-5 h-5" />
          </Button>
          <Modal open={open} onClose={() => setOpen(false)}>
            <ImageUpload />
          </Modal>
        </div>

        <div className="space-y-2 ">
          <h1 className="text-3xl font-bold text-foreground">
            {profileData.name}
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Admin since {profileData.createdAt}
          </p>
        </div>
      </div>

      {/* Profile Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 ">
        <div className="border rounded-xl p-6 space-y-6 bg-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={() => setIsEditing(true)}>
                  <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Full Name
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                disabled={!isEditing}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isEditing
                    ? "bg-background border-input"
                    : "bg-muted/50 border-transparent"
                }`}
              />
              {errors.name && (
                <span className="text-sm text-destructive">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                NIC
              </label>
              <input
                {...register("nic", {
                  required: "NIC is required",
                  pattern: {
                    value: /^(?:\d{9}[vVxX]|\d{12})$/,

                    message: "Invalid NIC",
                  },
                })}
                disabled={!isEditing}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isEditing
                    ? "bg-background border-input"
                    : "bg-muted/50 border-transparent"
                }`}
              />
              {errors.nic && (
                <span className="text-sm text-destructive">
                  {errors.nic.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Email Address
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                disabled={!isEditing}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isEditing
                    ? "bg-background border-input"
                    : "bg-muted/50 border-transparent"
                }`}
              />
              {errors.email && (
                <span className="text-sm text-destructive">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Contact Number
              </label>
              <input
                {...register("contactNo", {
                  required: "Contact Number is required",
                  pattern: {
                    value: /^(?:\+94|94|0)(\d{9})$/i,
                    message: "Invalid contact number address",
                  },
                })}
                disabled={!isEditing}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isEditing
                    ? "bg-background border-input"
                    : "bg-muted/50 border-transparent"
                }`}
              />
              {errors.contactNo && (
                <span className="text-sm text-destructive">
                  {errors.contactNo.message}
                </span>
              )}
            </div>

            {/* Add similar blocks for contactNo, nic, etc. */}
          </div>
        </div>

        {/* Security Section */}
        <div className="border rounded-xl p-6 space-y-6 bg-white">
          <h2 className="text-xl font-semibold">Security</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="space-y-1">
                <h3 className="font-medium">Password</h3>
                <p className="text-sm text-muted-foreground">••••••••</p>
              </div>
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpenReset(true)}
              >
                Reset Password
              </Button>
            </div>
          </div>
        </div>

        {/* Add ResetPasswordDialog at the bottom of your component */}
        <ResetPasswordDialog
          open={openReset}
          onClose={() => setOpenReset(false)}
        />
      </form>
    </div>
  );
};

export default AdminProfile;
