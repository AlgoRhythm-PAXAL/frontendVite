import React, { useState, useEffect } from "react";
import {
  LockClosedIcon,
  PencilIcon,
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { ImagePlus, SaveIcon } from "lucide-react";
import axios from "axios";
import ProfilePicture from "../../components/admin/ImageUpload/ProfilePicture";
import { Button } from "@/components/ui/button";
import Modal from "../../components/admin/adminProfile/Modal";
import ImageUploadingStaff from "../../components/staff/ImageUploadingStaff";
import PasswordResetCodePopup from "../../components/staff/PasswordResetCodePopup";
import NavigationBar from "../../components/staff/NavigationBar";
import toast from "react-hot-toast";

const backendURL = import.meta.env.VITE_BACKEND_URL;


const StaffProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});



  const getStaffInfo = async () => {
    try {
      const response = await axios.get(
        `${backendURL}/staff/ui/get-staff-information`,
        { withCredentials: true }
      );
      console.log(response.data);
      setProfileData(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching staff info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getStaffInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  {
    /* Update staff information */
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    // check emapty fields
    if (!formData.name?.trim()) errors.name = "Full Name is required";
    if (!formData.nic?.trim()) errors.nic = "NIC is required";
    if (!formData.email?.trim()) errors.email = "Email is required";
    if (!formData.contactNo?.trim())
      errors.contactNo = "Contact number is required";

    // NIC validation
    if (formData.nic && !/^\d{9}[vV]$|^\d{12}$/.test(formData.nic))
      errors.nic = "NIC format is invalid";

    // email validation
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email))
      errors.email = "Email format is invalid";

    // contact number validation
    if (formData.contactNo && !/^0\d{9}$/.test(formData.contactNo))
      errors.contactNo = "Contact number must be 10 digits and start with 0";

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      setIsLoading(true);

      // Send updated data to backend
      const response = await axios.put(
        `${backendURL}/staff/update-staff-info`,
        formData,
        { withCredentials: true }
      );

      setProfileData(response.data);
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      setErrorMessage("Failed to update profile");
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);
    }
  };

  {
    /* reset password */
  }
  const openResetCodePopup = async (email) => {
    try {
      console.log("send email");
      const response = await axios.post(
        `${backendURL}/staff/forgot-password`,
        { email }
      );

      setDialogOpen(true);
    } catch (error) {
      const errorMessage =
        error.response?.message ||
        "Failed to update the staff password. Please try again.";
      console.log(error)
      toast.error(errorMessage, {
        duration: 4000,
        
      });
    }
  };

  if (isLoading && !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg inline-block">
            <p>Failed to load profile data. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavigationBar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="font-bold text-3xl text-gray-800 bg-gradient-to-r from-Primary to-PrimaryHover bg-clip-text text-transparent">
              Staff Profile
            </h1>
          </div>

          {/* Success and error messages */}
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-green-700">{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-red-700">{errorMessage}</p>
            </div>
          )}
          <div className="flex flex-col md:flex-row items-start gap-6 rounded-2xl p-6 bg-white shadow-lg border border-gray-100 mb-8">
            {/* Profile Picture Section */}
            <div className="relative flex-shrink-0">
              <div className="bg-Primary rounded-full p-1">
                <div className="bg-white rounded-full p-1 relative">
                  <ProfilePicture
                    publicId={profileData.profilePicLink}
                    width="200"
                    className="rounded-full w-24 h-24 object-cover border-2 border-white"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 bottom-0 rounded-full bg-background shadow-md hover:bg-muted transform translate-x-1/4 translate-y-1/4"
                    onClick={() => setOpen(true)}
                  >
                    <ImagePlus className="w-5 h-5 text-Primary" />
                  </Button>
                </div>
              </div>
              <Modal open={open} onClose={() => setOpen(false)}>
                <ImageUploadingStaff />
              </Modal>
            </div>

            {/* Profile Information */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col justify-between h-full">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 truncate">
                    {profileData.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <LockClosedIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-500">
                      Staff since{" "}
                      {new Date(profileData.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-blue-800 text-sm font-medium">
                    {profileData.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form Section */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="border rounded-2xl p-6 space-y-6 bg-white shadow-sm border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <UserIcon className="w-5 h-5 mr-2 text-PrimaryHover" />
                  Personal Information
                </h2>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData(profileData);
                        }}
                        disabled={isLoading}
                      >
                        <XMarkIcon className="w-4 h-4" /> Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-4 py-2 text-white bg-Primary rounded-lg hover:bg-PrimaryHover transition-colors shadow-md disabled:opacity-70"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <ArrowPathIcon className="w-4 h-4 text-white animate-spin" />
                        ) : (
                          <>
                            <SaveIcon className="w-4 h-4" /> Save Changes
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 text-white bg-Primary rounded-lg hover:bg-PrimaryHover transition-colors shadow-md"
                      onClick={() => setIsEditing(true)}
                    >
                      <PencilIcon className="w-4 h-4" /> Edit Profile
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      name="name"
                      value={formData.name || ""}
                      onChange={handleChange}
                      disabled={!isEditing || isLoading}
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        isEditing
                          ? "bg-white border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600"
                          : "bg-gray-50 border-transparent"
                      }`}
                    />
                  </div>
                  {validationErrors.name && (
                    <p className="text-sm text-red-600">
                      {validationErrors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Staff ID
                  </label>
                  <input
                    value={profileData.staffId}
                    disabled
                    className="w-full px-4 py-2.5 rounded-lg border bg-gray-50 border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    NIC
                  </label>
                  <input
                    name="nic"
                    value={formData.nic || ""}
                    onChange={handleChange}
                    disabled={!isEditing || isLoading}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      isEditing
                        ? "bg-white border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600"
                        : "bg-gray-50 border-transparent"
                    }`}
                  />
                  {validationErrors.nic && (
                    <p className="text-sm text-red-600">
                      {validationErrors.nic}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Branch
                  </label>
                  <div className="relative">
                    <input
                      value={profileData.branchId?.location}
                      disabled
                      className="w-full px-4 py-2.5 rounded-lg border bg-gray-50 border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      name="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                      disabled={!isEditing || isLoading}
                      className={`w-full pl-10 px-4 py-2.5 rounded-lg border ${
                        isEditing
                          ? "bg-white border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600"
                          : "bg-gray-50 border-transparent"
                      }`}
                    />
                    <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                  {validationErrors.email && (
                    <p className="text-sm text-red-600">
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Number
                  </label>
                  <div className="relative">
                    <input
                      name="contactNo"
                      value={formData.contactNo || ""}
                      onChange={handleChange}
                      disabled={!isEditing || isLoading}
                      className={`w-full pl-10 px-4 py-2.5 rounded-lg border ${
                        isEditing
                          ? "bg-white border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600"
                          : "bg-gray-50 border-transparent"
                      }`}
                    />
                    <PhoneIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                  {validationErrors.contactNo && (
                    <p className="text-sm text-red-600">
                      {validationErrors.contactNo}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="border rounded-2xl p-6 space-y-6 bg-white shadow-sm border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <ShieldCheckIcon className="w-5 h-5 mr-2 text-green-600" />
                Security
              </h2>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="space-y-1">
                    <h3 className="font-medium text-gray-700 flex items-center gap-2">
                      <LockClosedIcon className="w-5 h-5 text-green-600" />{" "}
                      Password
                    </h3>
                    <p className="text-sm text-gray-500">••••••••</p>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 text-green-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mt-4 md:mt-0 shadow-sm"
                    onClick={() => openResetCodePopup(formData.email)}
                  >
                    Reset Password
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <PasswordResetCodePopup
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        email={formData.email}
      />
    </>
  );
};

export default StaffProfile;
