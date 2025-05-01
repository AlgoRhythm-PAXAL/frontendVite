// import SectionTitle from "../../components/admin/SectionTitle";
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// // import { useToast } from '../../components/admin/adminProfile/ToastContext';
// // import LoadingSpinner from "../../components/common/LoadingSpinner";
// // import ActivityLog from "../../components/admin/ActivityLog";

// const AdminProfile = () => {
//   // const { showToast } = useToast();
//   const [isEditing, setIsEditing] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [profileData, setProfileData] = useState({
//     name: '',
//     email: '',
//     avatar: '',
//     twoFactorEnabled: false
//   });
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const [activityLogs, setActivityLogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [errors, setErrors] = useState({});

//   // useEffect(() => {
//   //   const fetchProfileData = async () => {
//   //     try {
//   //       const [profileRes, activityRes] = await Promise.all([
//   //         axios.get('/api/admin/profile'),
//   //         axios.get('/api/admin/activity-logs')
//   //       ]);

//   //       setProfileData(profileRes.data);
//   //       setActivityLogs(activityRes.data);
//   //     } catch (error) {
//   //       showToast('Failed to load profile data', 'error');
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchProfileData();
//   // }, [showToast]);

//   const validateProfileForm = () => {
//     const newErrors = {};
//     if (!profileData.name.trim()) newErrors.name = 'Name is required';
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
//       newErrors.email = 'Invalid email address';
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validatePasswordForm = () => {
//     const newErrors = {};
//     if (passwordData.newPassword.length < 8) {
//       newErrors.newPassword = 'Password must be at least 8 characters';
//     }
//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleProfileUpdate = async (e) => {
//     e.preventDefault();
//     if (!validateProfileForm()) return;

//     setIsSubmitting(true);
//     try {
//       const response = await axios.put('/api/admin/profile', profileData);
//       setProfileData(response.data);
//       setIsEditing(false);
//     //   showToast('Profile updated successfully', 'success');
//     // } catch (error) {
//       // showToast(error.response?.data?.message || 'Update failed', 'error');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handlePasswordUpdate = async (e) => {
//     e.preventDefault();
//     if (!validatePasswordForm()) return;

//     setIsSubmitting(true);
//     try {
//       await axios.put('/api/admin/security', {
//         currentPassword: passwordData.currentPassword,
//         newPassword: passwordData.newPassword
//       });
//       setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
//       // showToast('Password updated successfully', 'success');
//     } catch (error) {
//       // showToast(error.response?.data?.message || 'Password update failed', 'error');
//       console.log(error)
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append('avatar', file);

//     try {
//       const response = await axios.post('/api/admin/avatar', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//       setProfileData(prev => ({ ...prev, avatar: response.data.avatarUrl }));
//       // showToast('Profile picture updated', 'success');
//     } catch (error) {
//       // showToast('Failed to upload image', 'error');
//     }
//   };

//   // if (loading) return <LoadingSpinner />;

//   return (
//     <div className="mx-8 space-y-8">
//       <SectionTitle title="Admin Profile" />

//       {/* Profile Information Section */}
//       <div className="bg-white p-6 rounded-lg shadow-sm">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-lg font-semibold">Personal Information</h3>
// {!isEditing ? (
//   <button
//     onClick={() => setIsEditing(true)}
//     className="btn-primary"
//   >
//     Edit Profile
//   </button>
// ) : (
//   <div className="space-x-4">
//     <button
//       onClick={handleProfileUpdate}
//       disabled={isSubmitting}
//       className="btn-primary"
//     >
//       {isSubmitting ? 'Saving...' : 'Save Changes'}
//     </button>
//     <button
//       onClick={() => setIsEditing(false)}
//       className="btn-secondary"
//     >
//       Cancel
//     </button>
//   </div>
// )}
//         </div>

//         <div className="flex flex-col md:flex-row gap-8">
//           <div className="flex flex-col items-center space-y-4">
//             <img
//               src={profileData.avatar || '/default-avatar.png'}
//               alt="Profile"
//               className="w-32 h-32 rounded-full object-cover"
//             />
//             {isEditing && (
//               <label className="cursor-pointer text-blue-600 hover:text-blue-800">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFileUpload}
//                   className="hidden"
//                 />
//                 Change Photo
//               </label>
//             )}
//           </div>

// <form className="flex-1 space-y-4">
//   <div>
//     <label className="block text-sm font-medium text-gray-700">Name</label>
//     <input
//       type="text"
//       value={profileData.name}
//       onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
//       disabled={!isEditing}
//       className={`mt-1 block w-full rounded-md ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-100'}`}
//     />
//     {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
//   </div>

//   <div>
//     <label className="block text-sm font-medium text-gray-700">Email</label>
//     <input
//       type="email"
//       value={profileData.email}
//       onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
//       disabled={!isEditing}
//       className={`mt-1 block w-full rounded-md ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-100'}`}
//     />
//     {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
//   </div>

//   <div className="flex items-center space-x-2">
//     <input
//       type="checkbox"
//       checked={profileData.twoFactorEnabled}
//       onChange={(e) => setProfileData({ ...profileData, twoFactorEnabled: e.target.checked })}
//       disabled={!isEditing}
//       className="rounded text-blue-600"
//     />
//     <label className="text-sm text-gray-700">Two-Factor Authentication</label>
//   </div>
// </form>
//         </div>
//       </div>

//       {/* Security Section */}
//       <div className="bg-white p-6 rounded-lg shadow-sm">
//         <h3 className="text-lg font-semibold mb-6">Security Settings</h3>
//         <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-xl">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Current Password</label>
//             <input
//               type="password"
//               value={passwordData.currentPassword}
//               onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
//               className="mt-1 block w-full rounded-md border-gray-300"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">New Password</label>
//             <input
//               type="password"
//               value={passwordData.newPassword}
//               onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
//               className="mt-1 block w-full rounded-md border-gray-300"
//             />
//             {errors.newPassword && <span className="text-red-500 text-sm">{errors.newPassword}</span>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
//             <input
//               type="password"
//               value={passwordData.confirmPassword}
//               onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
//               className="mt-1 block w-full rounded-md border-gray-300"
//             />
//             {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword}</span>}
//           </div>

//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="btn-primary"
//           >
//             {isSubmitting ? 'Updating...' : 'Update Password'}
//           </button>
//         </form>
//       </div>

//       {/* Activity Logs Section */}
//       <div className="bg-white p-6 rounded-lg shadow-sm">
//         <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
//         {/* <ActivityLog logs={activityLogs} /> */}
//       </div>
//     </div>
//   );
// };

// export default AdminProfile;

// import ProfilePicture from "../../components/admin/ImageUpload/ProfilePicture"
// import SectionTitle from "../../components/admin/SectionTitle"
// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import { Button } from "@/components/ui/button"
// import { ImagePlus } from "lucide-react"

// const AdminProfile = () => {

//   const [profileData, setProfileData] = useState([]);

//   useEffect(() => {

//     const backendURL = import.meta.env.VITE_BACKEND_URL;
//     const apiEndPoint = `${backendURL}/admin/get/myData`
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(apiEndPoint, { withCredentials: true });
//         const rawData = response.data.myData;

//         const updatedData = {
//           ...rawData,
//           createdAt: new Date(rawData.createdAt).toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric'
//           })
//         };
//         console.log(updatedData);
//         setProfileData(updatedData);

//       } catch (error) {
//         console.error(`Error fetching `, error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="flex flex-col mx-5">
//       <SectionTitle title="Admin Profile" />

//       <div className="flex gap-8 items-end">
//         <ProfilePicture publicId={profileData.profilePicLink} />
//         <div className="">
//           <h1 className="text-3xl font-semibold mb-6 ">{profileData.name}</h1>
//           <Button size="icon" onClick={() => console.log("Clicked!")}>
//             <ImagePlus/>
//           </Button>

//         </div>
//       </div>

//       <div className="flex-flex-col">
//         <h1>Personal Details</h1>
//         {/* <form className="flex-1 space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Name</label>
//               <input
//                 type="text"
//                 value={profileData.name}
//                 onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
//                 disabled={!isEditing}
//                 className={`mt-1 block w-full rounded-md ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-100'}`}
//               />
//               {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Email</label>
//               <input
//                 type="email"
//                 value={profileData.email}
//                 onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
//                 disabled={!isEditing}
//                 className={`mt-1 block w-full rounded-md ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-100'}`}
//               />
//               {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
//             </div>

//             <div className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 checked={profileData.twoFactorEnabled}
//                 onChange={(e) => setProfileData({ ...profileData, twoFactorEnabled: e.target.checked })}
//                 disabled={!isEditing}
//                 className="rounded text-blue-600"
//               />
//               <label className="text-sm text-gray-700">Two-Factor Authentication</label>
//             </div>
//           </form> */}

//       </div>
//     </div>
//   )
// }

// export default AdminProfile

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ImagePlus, Lock, Edit3, Save, X } from 'lucide-react';
import ProfilePicture from '../../components/admin/ImageUpload/ProfilePicture';
import SectionTitle from '../../components/admin/SectionTitle';
import ImageUpload from '../../components/admin/ImageUpload/ImageUpload';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import Modal from '../../components/admin/adminProfile/Modal';
import ForgotPassword from '../../components/admin/authentication/ForgotPassword';

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
          ).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
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
        console.error('Profile fetch error:', error);
      }
    };

    fetchProfileData();
  }, [reset]);

  const onSubmit = async (data) => {
    console.log('Form submitting ONLY:', data);
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/update/profile`,
        data,
        { withCredentials: true }
      );
      setIsEditing(false);
      toast.success('Profile updated successfully', { duration: 800 });
      setTimeout(() => reload(), 800);
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error(error.response?.data?.message || 'Update failed', {
        description: 'Hello',
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
                {...register('name', { required: 'Name is required' })}
                disabled={!isEditing}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isEditing
                    ? 'bg-background border-input'
                    : 'bg-muted/50 border-transparent'
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
                {...register('nic', {
                  required: 'NIC is required',
                  pattern: {
                    value: /^(?:\d{9}[vVxX]|\d{12})$/,

                    message: 'Invalid NIC',
                  },
                })}
                disabled={!isEditing}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isEditing
                    ? 'bg-background border-input'
                    : 'bg-muted/50 border-transparent'
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
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address',
                  },
                })}
                disabled={!isEditing}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isEditing
                    ? 'bg-background border-input'
                    : 'bg-muted/50 border-transparent'
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
                {...register('contactNo', {
                  required: 'Contact Number is required',
                  pattern: {
                    value: /^(?:\+94|94|0)(\d{9})$/i,
                    message: 'Invalid contact number address',
                  },
                })}
                disabled={!isEditing}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isEditing
                    ? 'bg-background border-input'
                    : 'bg-muted/50 border-transparent'
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
              {/* <PasswordResetDialog 
                open={resetPassOpen}
                onOpenChange={setResetPassOpen}
              > */}
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpenReset(true)}
              >
                Reset Password
              </Button>
              <Modal open={openReset} onClose={() => setOpenReset(false)}>
                <ForgotPassword />
              </Modal>
              {/* </PasswordResetDialog> */}
            </div>

            {/* <div className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50">
              <input type="checkbox" checked={profileData.twoFactorEnabled} onChange={(e) => setProfileData(prev => ({ ...prev, twoFactorEnabled: e.target.checked}))} className="h-5 w-5 rounded-md border border-input" />
              <div className="space-y-1">
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  {profileData.twoFactorEnabled
                    ? "Enabled (requires verification code)"
                    : "Disabled (recommended for security)"}
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;
