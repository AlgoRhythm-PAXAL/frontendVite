// import FormField from "./FormField";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "sonner";
// const backendUrl = import.meta.env.VITE_BACKEND_URL;

// const UserRegistrationForm = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     nic: "",
//     password: "Password will genereate ramdomly",
//     email: "",
//     contactNo: "",
//     userType: "",
//     licenseId: "",
//     branchId: "",
//   });

//   const [branches, setBranches] = useState([]);
//   const [vehicles, setVehicles] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     const fetchBranches = async () => {
//       try {
//         const response = await axios.get(`${backendUrl}/api/admin/branches`, {
//           withCredentials: true,
//           timeout: 10000,
//         });
//         setBranches(response.data.branches);
//       } catch (error) {
//         const errorMessage = error.response?.data?.message || error.message;
//         console.error("Error fetching branches:", error);
//         toast.error("Failed to load branches", {
//           description: errorMessage,
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };

   

//     fetchBranches();
    
//   }, []);

//   const handleChange = async (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });


//      const fetchVehicles = async (value) => {
      
//       try {
//         const response = await axios.get(`${backendUrl}/api/admin/vehicles/branch/${value}`, {
//           withCredentials: true,
//           timeout: 10000,
//         });
//         setVehicles(response.data);
//       } catch (error) {
//         const errorMessage = error.response?.data?.message || error.message;
//         console.error("Error fetching branches:", error);
//         toast.error("Failed to load branches", {
//           description: errorMessage,
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (name === "branchId" && value  && formData.userType == "driver") {
//       try {
//         await fetchVehicles(value);
        
//       } catch (error) {
//         console.error("Error fetching vehicles:", error);
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const toast1 = toast.loading("Processing registration...");
//     setIsSubmitting(true);

//     try {
//       if (!formData.userType) {
//         throw new Error("Please select a user type");
//       }

//       if (formData.userType === "driver" && !formData.licenseId) {
//         throw new Error("License ID is required for drivers");
//       }

//       let apiURL = `${backendUrl}/api/admin/users/${formData.userType}/register`;
      
//       const response = await axios.post(apiURL, formData, {
//         withCredentials: true,
//         timeout: 15000,
//       });
//       toast.success(response.data.message || "Registration successful!", {
//         id: toast1,
//         action: {
//           label: "Reload",
//           onClick: () => window.location.reload(),
//         },
//       });
//       setTimeout(() => window.location.reload(), 1000);
//     } catch (error) {
//       const errorData = error.response?.data;
//       const errorMessage =
//         errorData?.message ||
//         errorData?.error ||
//         error.message ||
//         "Registration failed";
//       toast.error("Registration Error", {
//         id: toast1,
//         description: errorMessage,
//         ...(error.response?.status === 401 && {
//           action: {
//             label: "Login",
//             onClick: () => (window.location.href = "/admin/login"),
//           },
//         }),
//       });
//       console.error("Registration error:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const SkeletonLoader = () => (
//     <div className="animate-pulse space-y-2">
//       <div className="h-4 bg-gray-200 rounded w-1/3"></div>
//       <div className="h-10 bg-gray-200 rounded-lg"></div>
//     </div>
//   );

//   return (
//     <div className="p-8 w-full bg-white rounded-xl border border-gray-200 shadow-sm">
//       <h1 className="text-2xl font-semibold text-gray-900 mb-6">
//         User Registration
//       </h1>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <FormField
//             label="Full Name"
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             disabled={isSubmitting}
//           />

//           <FormField
//             label="NIC Number"
//             type="text"
//             name="nic"
//             value={formData.nic}
//             onChange={handleChange}
//             pattern="^(?:\d{9}[vVxX]|\d{12})$"
//             title="Please enter a valid NIC number (Old format: 123456789V or New format: 200203601188)"
//             placeholder="Ex: 200203601188 or 987654321V"
//             required
//             disabled={isSubmitting}
//           />

//           <FormField
//             label="Email Address"
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="name@company.com"
//             required
//             disabled={isSubmitting}
//           />

//           <FormField
//             label="Contact Number"
//             type="tel"
//             name="contactNo"
//             value={formData.contactNo}
//             onChange={handleChange}
//             pattern="[0-9]{10}"
//             placeholder="077 123 4567"
//             disabled={isSubmitting}
//           />

//           {isLoading ? (
//             <SkeletonLoader />
//           ) : (
//             <FormField
//               label="User Type"
//               type="select"
//               name="userType"
//               value={formData.userType}
//               onChange={handleChange}
//               options={[
//                 { value: "", label: "Select User Type" },
//                 { value: "admin", label: "Administrator" },
//                 { value: "driver", label: "Driver" },
//                 { value: "staff", label: "Staff Member" },
//               ]}
//               required
//               disabled={isSubmitting}
//             />
//           )}
//         </div>

//         {/* Conditional Fields */}
//         <div className="space-y-6">
//           {formData.userType === "driver" && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <FormField
//                 label="Driver's License ID"
//                 type="text"
//                 name="licenseId"
//                 value={formData.licenseId}
//                 onChange={handleChange}
//                 required
//                 disabled={isSubmitting}
//               />

//               {isLoading ? (
//                 <SkeletonLoader />
//               ) : formData.branchId && vehicles.length > 0 ? (
//                 <FormField
//                   label="Assigned Vehicle"
//                   type="select"
//                   name="vehicleId"
//                   value={formData.vehicleId}
//                   onChange={handleChange}
//                   options={[
//                     { value: "", label: "Select Vehicle" },
//                     ...vehicles.map((vehicle) => ({
//                       value: vehicle._id,
//                       label: `${vehicle.registrationNo} (${vehicle.vehicleType})`,
//                     })),
//                   ]}
//                   required
//                   disabled={isSubmitting}
//                 />
//               ) : null}

//               {isLoading ? (
//                 <SkeletonLoader />
//               ) : branches.length > 0 ? (
//                 <FormField
//                   label="Assigned Branch"
//                   type="select"
//                   name="branchId"
//                   value={formData.branchId}
//                   onChange={handleChange}
//                   options={[
//                     { value: "", label: "Select Branch" },
//                     ...branches.map((branch) => ({
//                       value: branch._id,
//                       label: branch.location,
//                     })),
//                   ]}
//                   required
//                   disabled={isSubmitting}
//                 />
//               ) : null}
//             </div>
//           )}

//           {formData.userType === "staff" &&
//             (isLoading ? (
//               <SkeletonLoader />
//             ) : branches.length > 0 ? (
//               <FormField
//                 label="Assigned Branch"
//                 type="select"
//                 name="branchId"
//                 value={formData.branchId}
//                 onChange={handleChange}
//                 options={[
//                   { value: "", label: "Select Branch" },
//                   ...branches.map((branch) => ({
//                     value: branch._id,
//                     label: branch.location,
//                   })),
//                 ]}
//                 required
//                 disabled={isSubmitting}
//               />
//             ) : null)}
//         </div>

//         <button
//           type="submit"
//           className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           disabled={isSubmitting || isLoading}
//         >
//           {isSubmitting ? (
//             <div className="flex items-center justify-center gap-2">
//               <svg
//                 className="animate-spin h-5 w-5 text-white"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 ></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                 ></path>
//               </svg>
//               Registering...
//             </div>
//           ) : (
//             "Register User"
//           )}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default UserRegistrationForm;


// import React from 'react'
// import FormField from "./FormField";
// import { useState, useEffect, useCallback, useMemo, useRef } from "react";
// import axios from "axios";
// import { toast } from "sonner";
// import { 
//   UserPlus, 
//   AlertCircle, 
//   CheckCircle, 
//   RefreshCw, 
//   Users,
//   Shield,
//   Truck,
//   UserCheck
// } from "lucide-react";

// const backendUrl = import.meta.env.VITE_BACKEND_URL;

// const UserRegistrationForm = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     nic: "",
//     email: "",
//     contactNo: "",
//     userType: "",
//     licenseId: "",
//     branchId: "",
//     vehicleId: "",
//   });

//   const [branches, setBranches] = useState([]);
//   const [vehicles, setVehicles] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [validFields, setValidFields] = useState({});
//   const [showSuccess, setShowSuccess] = useState(false);
  
//   // Refs for form management
//   const formRef = useRef(null);
//   const abortControllerRef = useRef(null);

//   // Enhanced user type configurations
//   const userTypeConfigs = useMemo(() => ({
//     admin: {
//       value: "admin",
//       label: "Administrator",
//       icon: Shield,
//       color: "text-purple-600",
//       bgColor: "bg-purple-50",
//       description: "Full system access and management capabilities"
//     },
//     driver: {
//       value: "driver",
//       label: "Driver",
//       icon: Truck,
//       color: "text-orange-600",
//       bgColor: "bg-orange-50",
//       description: "Delivery and transportation management"
//     },
//     staff: {
//       value: "staff",
//       label: "Staff Member",
//       icon: UserCheck,
//       color: "text-green-600",
//       bgColor: "bg-green-50",
//       description: "Branch operations and customer service"
//     }
//   }), []);

//   const userTypeOptions = useMemo(() => [
//     { value: "", label: "Select User Type" },
//     ...Object.values(userTypeConfigs).map(config => ({
//       value: config.value,
//       label: config.label
//     }))
//   ], [userTypeConfigs]);

//   // Enhanced validation functions with real-time feedback
//   const validateNIC = useCallback((nic) => {
//     const nicPattern = /^(?:\d{9}[vVxX]|\d{12})$/;
//     return {
//       isValid: nicPattern.test(nic),
//       message: nicPattern.test(nic) ? "" : "Invalid NIC format (use 123456789V or 200203601188)"
//     };
//   }, []);

//   const validateEmail = useCallback((email) => {
//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return {
//       isValid: emailPattern.test(email),
//       message: emailPattern.test(email) ? "" : "Please enter a valid email address"
//     };
//   }, []);

//   const validateContactNo = useCallback((contactNo) => {
//     const phonePattern = /^[0-9]{10}$/;
//     return {
//       isValid: phonePattern.test(contactNo),
//       message: phonePattern.test(contactNo) ? "" : "Contact number must be 10 digits"
//     };
//   }, []);

//   const validateName = useCallback((name) => {
//     const namePattern = /^[a-zA-Z\s]{2,50}$/;
//     return {
//       isValid: namePattern.test(name.trim()),
//       message: namePattern.test(name.trim()) ? "" : "Name must be 2-50 characters, letters only"
//     };
//   }, []);

//   const validateLicenseId = useCallback((licenseId) => {
//     const isValid = licenseId.trim().length >= 5;
//     return {
//       isValid,
//       message: isValid ? "" : "License ID must be at least 5 characters"
//     };
//   }, []);

//   // Real-time field validation
//   const validateField = useCallback((name, value) => {
//     switch (name) {
//       case 'name':
//         return validateName(value);
//       case 'nic':
//         return validateNIC(value);
//       case 'email':
//         return validateEmail(value);
//       case 'contactNo':
//         return validateContactNo(value);
//       case 'licenseId':
//         return validateLicenseId(value);
//       default:
//         return { isValid: true, message: "" };
//     }
//   }, [validateName, validateNIC, validateEmail, validateContactNo, validateLicenseId]);

//   // Complete form validation
//   const validateForm = useCallback(() => {
//     const newErrors = {};
//     const newValidFields = {};

//     // Validate all fields
//     Object.keys(formData).forEach(key => {
//       if (key === 'vehicleId') return; // Optional field
      
//       const value = formData[key];
//       const validation = validateField(key, value);
      
//       if (key === 'userType' && !value) {
//         newErrors[key] = "User type is required";
//         return;
//       }
      
//       if (key === 'branchId' && (formData.userType === 'driver' || formData.userType === 'staff') && !value) {
//         newErrors[key] = "Branch selection is required";
//         return;
//       }
      
//       if (key === 'licenseId' && formData.userType === 'driver' && !value.trim()) {
//         newErrors[key] = "License ID is required for drivers";
//         return;
//       }

//       if (validation && !validation.isValid) {
//         newErrors[key] = validation.message;
//       } else if (value || key === 'userType' || key === 'branchId') {
//         newValidFields[key] = true;
//       }
//     });

//     setErrors(newErrors);
//     setValidFields(newValidFields);
//     return Object.keys(newErrors).length === 0;
//   }, [formData, validateField]);

//   // Enhanced fetch functions with abort controller
//   const fetchBranches = useCallback(async () => {
//     try {
//       setIsLoading(true);
      
//       // Cancel previous request
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }
      
//       abortControllerRef.current = new AbortController();
      
//       const response = await axios.get(`${backendUrl}/api/admin/branches`, {
//         withCredentials: true,
//         timeout: 15000,
//         signal: abortControllerRef.current.signal,
//       });
//       // Validate response data
//       if (response.data?.branches && Array.isArray(response.data.branches)) {
//         setBranches(response.data.branches);
//       } else {
//         throw new Error("Invalid branches data format");
//       }
//     } catch (error) {
//       if (error.name === 'AbortError') return;
      
//       const errorMessage = error.response?.data?.message || error.message || "Failed to load branches";
//       console.error("Error fetching branches:", error);
      
//       toast.error("Failed to load branches", {
//         description: errorMessage,
//         action: {
//           label: "Retry",
//           onClick: () => fetchBranches(),
//         },
//       });
//       setBranches([]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const fetchVehicles = useCallback(async (branchId) => {
//     if (!branchId) {
//       setVehicles([]);
//       return;
//     }

//     try {
//       setIsLoadingVehicles(true);
      
//       const response = await axios.get(`${backendUrl}/api/admin/vehicles/branch/${branchId}`, {
//         withCredentials: true,
//         timeout: 15000,
//       });
      
//       if (Array.isArray(response.data)) {
//         setVehicles(response.data);
//       } else {
//         throw new Error("Invalid vehicles data format");
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || error.message || "Failed to load vehicles";
//       console.error("Error fetching vehicles:", error);
      
//       toast.error("Failed to load vehicles", {
//         description: errorMessage,
//         action: {
//           label: "Retry",
//           onClick: () => fetchVehicles(branchId),
//         },
//       });
//       setVehicles([]);
//     } finally {
//       setIsLoadingVehicles(false);
//     }
//   }, []);

//   // Initialize data
//   useEffect(() => {
//     fetchBranches();
    
//     return () => {
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }
//     };
//   }, [fetchBranches]);

//   // Enhanced form change handler
//   const handleChange = useCallback(async (e) => {
//     const { name, value } = e.target;
    
//     // Real-time validation
//     const validation = validateField(name, value);
    
//     // Update form data
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     // Update validation state
//     if (validation.isValid) {
//       setErrors(prev => ({ ...prev, [name]: "" }));
//       setValidFields(prev => ({ ...prev, [name]: true }));
//     } else {
//       setErrors(prev => ({ ...prev, [name]: validation.message }));
//       setValidFields(prev => ({ ...prev, [name]: false }));
//     }

//     // Handle special cases
//     if (name === "branchId" && value && formData.userType === "driver") {
//       setFormData(prev => ({ ...prev, vehicleId: "" }));
//       await fetchVehicles(value);
//     }

//     if (name === "userType") {
//       setFormData(prev => ({ 
//         ...prev, 
//         branchId: "", 
//         vehicleId: "", 
//         licenseId: value === "driver" ? prev.licenseId : "" 
//       }));
//       setVehicles([]);
//       // Clear related errors
//       setErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors.branchId;
//         delete newErrors.vehicleId;
//         delete newErrors.licenseId;
//         return newErrors;
//       });
//     }
//   }, [formData.userType, fetchVehicles, validateField]);

//   // Enhanced form submission
//   const handleSubmit = useCallback(async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       toast.error("Please fix all form errors before submitting", {
//         description: "Check the highlighted fields for issues"
//       });
//       return;
//     }

//     const toastId = toast.loading("Creating user account...", {
//       description: "Please wait while we process the registration"
//     });
//     setIsSubmitting(true);

//     try {
//       const apiURL = `${backendUrl}/api/admin/users/${formData.userType}/register`;
      
//       // Prepare submission data
//       const submissionData = { ...formData };
      
//       const response = await axios.post(apiURL, submissionData, {
//         withCredentials: true,
//         timeout: 20000,
//       });

//       // Show success
//       setShowSuccess(true);
//       toast.success("User registered successfully!", {
//         id: toastId,
//         description: response.data?.message || `${formData.userType} account created`,
//         action: {
//           label: "Create Another",
//           onClick: () => resetForm(),
//         },
//       });

//       // Reset form after delay
//       setTimeout(() => {
//         resetForm();
//         setShowSuccess(false);
//       }, 2000);

//     } catch (error) {
//       const errorData = error.response?.data;
//       const errorMessage = errorData?.message || errorData?.error || error.message || "Registration failed";
      
//       // Handle specific error cases
//       if (error.response?.status === 409) {
//         toast.error("User already exists", {
//           id: toastId,
//           description: "A user with this email or NIC already exists",
//         });
//       } else if (error.response?.status === 401) {
//         toast.error("Authentication required", {
//           id: toastId,
//           description: "Please log in to continue",
//           action: {
//             label: "Login",
//             onClick: () => (window.location.href = "/admin/login"),
//           },
//         });
//       } else {
//         toast.error("Registration failed", {
//           id: toastId,
//           description: errorMessage,
//           action: {
//             label: "Try Again",
//             onClick: () => handleSubmit(e),
//           },
//         });
//       }
      
//       console.error("Registration error:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   }, [formData, validateForm]);

//   // Memoized options
//   const branchOptions = useMemo(() => [
//     { value: "", label: "Select Branch" },
//     ...branches.map((branch) => ({
//       value: branch._id,
//       label: `${branch.location} ${branch.contactNo ? `(${branch.contactNo})` : ''}`,
//     })),
//   ], [branches]);

//   const vehicleOptions = useMemo(() => [
//     { value: "", label: "Select Vehicle (Optional)" },
//     ...vehicles.map((vehicle) => ({
//       value: vehicle._id,
//       label: `${vehicle.registrationNo} - ${vehicle.vehicleType}`,
//     })),
//   ], [vehicles]);

//   // Enhanced reset function
//   const resetForm = useCallback(() => {
//     setFormData({
//       name: "",
//       nic: "",
//       email: "",
//       contactNo: "",
//       userType: "",
//       licenseId: "",
//       branchId: "",
//       vehicleId: "",
//     });
//     setVehicles([]);
//     setErrors({});
//     setValidFields({});
//     setShowSuccess(false);
    
//     // Focus first field
//     if (formRef.current) {
//       const firstInput = formRef.current.querySelector('input, select');
//       if (firstInput) firstInput.focus();
//     }
//   }, []);

//   // Loading skeleton component
//   const SkeletonLoader = () => (
//     <div className="animate-pulse space-y-2">
//       <div className="h-4 bg-gray-200 rounded w-1/3"></div>
//       <div className="h-10 bg-gray-200 rounded-lg"></div>
//     </div>
//   );

//   // Field status indicator
//   const FieldStatusIcon = ({ fieldName }) => {
//     if (errors[fieldName]) {
//       return <AlertCircle className="h-4 w-4 text-red-500" />;
//     }
//     if (validFields[fieldName]) {
//       return <CheckCircle className="h-4 w-4 text-green-500" />;
//     }
//     return null;
//   };

//   // Error message component
//   const ErrorMessage = ({ message }) => (
//     message ? (
//       <div className="flex items-center gap-1 mt-1">
//         <AlertCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
//         <p className="text-sm text-red-600">{message}</p>
//       </div>
//     ) : null
//   );

//   // Success message component
//   const SuccessMessage = ({ message }) => (
//     message ? (
//       <div className="flex items-center gap-1 mt-1">
//         <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
//         <p className="text-sm text-green-600">{message}</p>
//       </div>
//     ) : null
//   );

//   // User type selection component
//   const UserTypeSelection = () => {
//     const selectedConfig = userTypeConfigs[formData.userType];
    
//     return (
//       <div className="space-y-3">
//         <FormField
//           label="User Type"
//           type="select"
//           name="userType"
//           value={formData.userType}
//           onChange={handleChange}
//           options={userTypeOptions}
//           required
//           disabled={isSubmitting}
//         />
        
//         {selectedConfig && (
//           <div className={`p-3 rounded-lg border ${selectedConfig.bgColor} border-opacity-50`}>
//             <div className="flex items-center gap-2 mb-1">
//               <selectedConfig.icon className={`h-4 w-4 ${selectedConfig.color}`} />
//               <span className={`text-sm font-medium ${selectedConfig.color}`}>
//                 {selectedConfig.label}
//               </span>
//             </div>
//             <p className="text-xs text-gray-600">{selectedConfig.description}</p>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
//       {/* Header */}
//       <div className="mb-8 text-center">
//         <div className="flex items-center justify-center gap-3 mb-3">
//           <div className="p-2 bg-blue-50 rounded-lg">
//             <UserPlus className="h-6 w-6 text-blue-600" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900">User Registration</h1>
//         </div>
//         <p className="text-gray-600 max-w-2xl mx-auto">
//           Create a new user account with appropriate permissions and access levels
//         </p>
//       </div>

//       {/* Success Banner */}
//       {showSuccess && (
//         <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
//           <div className="flex items-center gap-2">
//             <CheckCircle className="h-5 w-5 text-green-600" />
//             <span className="text-green-800 font-medium">Registration Successful!</span>
//           </div>
//         </div>
//       )}

//       {/* Form */}
//       <form ref={formRef} onSubmit={handleSubmit} className="space-y-8" noValidate>
//         {/* Basic Information */}
//         <div className="space-y-6">
//           <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//             <Users className="h-5 w-5 text-gray-600" />
//             Basic Information
//           </h3>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="relative">
//               <FormField
//                 label="Full Name"
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//                 disabled={isSubmitting}
//                 placeholder="Enter full name"
//               />
//               <div className="absolute right-3 top-8">
//                 <FieldStatusIcon fieldName="name" />
//               </div>
//               <ErrorMessage message={errors.name} />
//             </div>

//             <div className="relative">
//               <FormField
//                 label="NIC Number"
//                 type="text"
//                 name="nic"
//                 value={formData.nic}
//                 onChange={handleChange}
//                 pattern="^(?:\d{9}[vVxX]|\d{12})$"
//                 title="Old format: 123456789V or New format: 200203601188"
//                 placeholder="Ex: 200203601188 or 987654321V"
//                 required
//                 disabled={isSubmitting}
//               />
//               <div className="absolute right-3 top-8">
//                 <FieldStatusIcon fieldName="nic" />
//               </div>
//               <ErrorMessage message={errors.nic} />
//             </div>

//             <div className="relative">
//               <FormField
//                 label="Email Address"
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="name@company.com"
//                 required
//                 disabled={isSubmitting}
//               />
//               <div className="absolute right-3 top-8">
//                 <FieldStatusIcon fieldName="email" />
//               </div>
//               <ErrorMessage message={errors.email} />
//             </div>

//             <div className="relative">
//               <FormField
//                 label="Contact Number"
//                 type="tel"
//                 name="contactNo"
//                 value={formData.contactNo}
//                 onChange={handleChange}
//                 pattern="[0-9]{10}"
//                 placeholder="0771234567"
//                 required
//                 disabled={isSubmitting}
//               />
//               <div className="absolute right-3 top-8">
//                 <FieldStatusIcon fieldName="contactNo" />
//               </div>
//               <ErrorMessage message={errors.contactNo} />
//             </div>

//             <div className="md:col-span-2">
//               {isLoading ? <SkeletonLoader /> : <UserTypeSelection />}
//               <ErrorMessage message={errors.userType} />
//             </div>
//           </div>
//         </div>

//         {/* Role-specific Information */}
//         {formData.userType && (
//           <div className="space-y-6 border-t pt-6">
//             <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//               {React.createElement(userTypeConfigs[formData.userType]?.icon || Users, {
//                 className: "h-5 w-5 text-gray-600"
//               })}
//               {userTypeConfigs[formData.userType]?.label} Information
//             </h3>
            
//             {formData.userType === "driver" && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="relative">
//                   <FormField
//                     label="Driver's License ID"
//                     type="text"
//                     name="licenseId"
//                     value={formData.licenseId}
//                     onChange={handleChange}
//                     required
//                     disabled={isSubmitting}
//                     placeholder="Enter license ID"
//                   />
//                   <div className="absolute right-3 top-8">
//                     <FieldStatusIcon fieldName="licenseId" />
//                   </div>
//                   <ErrorMessage message={errors.licenseId} />
//                 </div>

//                 <div>
//                   {isLoading ? (
//                     <SkeletonLoader />
//                   ) : (
//                     <FormField
//                       label="Assigned Branch"
//                       type="select"
//                       name="branchId"
//                       value={formData.branchId}
//                       onChange={handleChange}
//                       options={branchOptions}
//                       required
//                       disabled={isSubmitting}
//                     />
//                   )}
//                   <ErrorMessage message={errors.branchId} />
//                 </div>

//                 {formData.branchId && (
//                   <div className="md:col-span-2">
//                     {isLoadingVehicles ? (
//                       <SkeletonLoader />
//                     ) : vehicles.length > 0 ? (
//                       <FormField
//                         label="Assigned Vehicle (Optional)"
//                         type="select"
//                         name="vehicleId"
//                         value={formData.vehicleId}
//                         onChange={handleChange}
//                         options={vehicleOptions}
//                         disabled={isSubmitting}
//                       />
//                     ) : (
//                       <div className="space-y-2">
//                         <label className="block text-sm font-medium text-gray-700">
//                           Assigned Vehicle
//                         </label>
//                         <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
//                           <AlertCircle className="h-4 w-4 text-amber-600" />
//                           <span className="text-sm text-amber-800">
//                             No vehicles available for the selected branch
//                           </span>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}

//             {formData.userType === "staff" && (
//               <div>
//                 {isLoading ? (
//                   <SkeletonLoader />
//                 ) : (
//                   <FormField
//                     label="Assigned Branch"
//                     type="select"
//                     name="branchId"
//                     value={formData.branchId}
//                     onChange={handleChange}
//                     options={branchOptions}
//                     required
//                     disabled={isSubmitting}
//                   />
//                 )}
//                 <ErrorMessage message={errors.branchId} />
//               </div>
//             )}
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
//           <button
//             type="button"
//             onClick={resetForm}
//             className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             disabled={isSubmitting}
//           >
//             <RefreshCw className="h-4 w-4" />
//             Reset Form
//           </button>
          
//           <button
//             type="submit"
//             className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//             disabled={isSubmitting || isLoading || Object.keys(errors).length > 0}
//           >
//             {isSubmitting ? (
//               <>
//                 <RefreshCw className="h-4 w-4 animate-spin" />
//                 Creating Account...
//               </>
//             ) : (
//               <>
//                 <UserPlus className="h-4 w-4" />
//                 Register User
//               </>
//             )}
//           </button>
//         </div>
//       </form>

//       {/* Form Validation Summary */}
//       {Object.keys(errors).length > 0 && (
//         <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//           <div className="flex items-center gap-2 mb-2">
//             <AlertCircle className="h-4 w-4 text-red-600" />
//             <h4 className="text-sm font-medium text-red-800">
//               Please fix the following errors:
//             </h4>
//           </div>
//           <ul className="text-sm text-red-700 space-y-1 ml-6">
//             {Object.entries(errors).map(([field, error]) => (
//               <li key={field} className="flex items-center gap-1">
//                 <span className="w-1 h-1 bg-red-600 rounded-full"></span>
//                 <span className="capitalize">{field.replace(/([A-Z])/g, ' $1')}:</span>
//                 <span>{error}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Form Progress Indicator */}
//       <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
//         <div className="flex items-center justify-between text-xs text-gray-600">
//           <span>Form Progress</span>
//           <span>
//             {Object.keys(validFields).length}/{Object.keys(formData).filter(key => 
//               key !== 'vehicleId' && // Optional field
//               (key !== 'licenseId' || formData.userType === 'driver') &&
//               (key !== 'branchId' || ['driver', 'staff'].includes(formData.userType))
//             ).length} fields completed
//           </span>
//         </div>
//         <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
//           <div 
//             className="bg-blue-600 h-1 rounded-full transition-all duration-300"
//             style={{ 
//               width: `${(Object.keys(validFields).length / Math.max(1, Object.keys(formData).filter(key => 
//                 key !== 'vehicleId' &&
//                 (key !== 'licenseId' || formData.userType === 'driver') &&
//                 (key !== 'branchId' || ['driver', 'staff'].includes(formData.userType))
//               ).length)) * 100}%` 
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserRegistrationForm;


import React from 'react'
import FormField from "./FormField";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { 
  UserPlus, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  Users,
  Shield,
  Truck,
  UserCheck
} from "lucide-react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const UserRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    nic: "",
    email: "",
    contactNo: "",
    userType: "",
    licenseId: "",
    branchId: "",
    vehicleId: "",
  });

  const [branches, setBranches] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [errors, setErrors] = useState({});
  const [validFields, setValidFields] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const formRef = useRef(null);
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  const userTypeConfigs = useMemo(() => ({
    admin: {
      value: "admin",
      label: "Administrator",
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Full system access and management capabilities"
    },
    driver: {
      value: "driver",
      label: "Driver",
      icon: Truck,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Delivery and transportation management"
    },
    staff: {
      value: "staff",
      label: "Staff Member",
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Branch operations and customer service"
    }
  }), []);

  const userTypeOptions = useMemo(() => [
    { value: "", label: "Select User Type" },
    ...Object.values(userTypeConfigs).map(config => ({
      value: config.value,
      label: config.label
    }))
  ], [userTypeConfigs]);

  // Validation functions - memoized to prevent recreation
  const validateNIC = useCallback((nic) => {
    if (!nic) return { isValid: false, message: "NIC is required" };
    const nicPattern = /^(?:\d{9}[vVxX]|\d{12})$/;
    return {
      isValid: nicPattern.test(nic),
      message: nicPattern.test(nic) ? "" : "Invalid NIC format (use 123456789V or 200203601188)"
    };
  }, []);

  const validateEmail = useCallback((email) => {
    if (!email) return { isValid: false, message: "Email is required" };
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      isValid: emailPattern.test(email),
      message: emailPattern.test(email) ? "" : "Please enter a valid email address"
    };
  }, []);

  const validateContactNo = useCallback((contactNo) => {
    if (!contactNo) return { isValid: false, message: "Contact number is required" };
    const phonePattern = /^[0-9]{10}$/;
    return {
      isValid: phonePattern.test(contactNo),
      message: phonePattern.test(contactNo) ? "" : "Contact number must be 10 digits"
    };
  }, []);

  const validateName = useCallback((name) => {
    if (!name) return { isValid: false, message: "Name is required" };
    const namePattern = /^[a-zA-Z\s]{2,50}$/;
    return {
      isValid: namePattern.test(name.trim()),
      message: namePattern.test(name.trim()) ? "" : "Name must be 2-50 characters, letters only"
    };
  }, []);

  const validateLicenseId = useCallback((licenseId) => {
    if (!licenseId) return { isValid: false, message: "License ID is required" };
    const isValid = licenseId.trim().length >= 5;
    return {
      isValid,
      message: isValid ? "" : "License ID must be at least 5 characters"
    };
  }, []);

  // Fixed validateField function to avoid dependency issues
  const validateField = useCallback((name, value, currentFormData = formData) => {
    switch (name) {
      case 'name':
        return validateName(value);
      case 'nic':
        return validateNIC(value);
      case 'email':
        return validateEmail(value);
      case 'contactNo':
        return validateContactNo(value);
      case 'licenseId':
        return validateLicenseId(value);
      case 'userType':
        return { isValid: !!value, message: value ? "" : "User type is required" };
      case 'branchId':
        const needsBranch = ['driver', 'staff'].includes(currentFormData.userType);
        return {
          isValid: !needsBranch || !!value,
          message: value || !needsBranch ? "" : "Branch selection is required"
        };
      default:
        return { isValid: true, message: "" };
    }
  }, [validateName, validateNIC, validateEmail, validateContactNo, validateLicenseId]);

  // Fixed validateForm to avoid infinite loops
  const isFormValid = useMemo(() => {
    const requiredFields = ['name', 'nic', 'email', 'contactNo', 'userType'];
    if (formData.userType === 'driver') {
      requiredFields.push('licenseId', 'branchId');
    } else if (formData.userType === 'staff') {
      requiredFields.push('branchId');
    }

    return requiredFields.every(key => {
      const validation = validateField(key, formData[key], formData);
      return validation.isValid;
    });
  }, [formData, validateField]);

  const fetchBranches = useCallback(async () => {
    if (!isMountedRef.current) return;
    try {
      setIsLoading(true);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      
      const response = await axios.get(`${backendUrl}/api/admin/branches`, {
        withCredentials: true,
        timeout: 15000,
        signal: abortControllerRef.current.signal,
      });
      
      if (!isMountedRef.current) return;
      
      if (response.data?.branches && Array.isArray(response.data.branches)) {
        setBranches(response.data.branches);
      } else {
        throw new Error("Invalid branches data format");
      }
    } catch (error) {
      if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED' || !isMountedRef.current) {
        return;
      }
      toast.error("Failed to load branches", {
        description: error.response?.data?.message || error.message || "Failed to load branches",
        action: { label: "Retry", onClick: () => fetchBranches() },
      });
      if (isMountedRef.current) setBranches([]);
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  }, []);

  const fetchVehicles = useCallback(async (branchId) => {
    if (!branchId || !isMountedRef.current) {
      setVehicles([]);
      return;
    }
    try {
      setIsLoadingVehicles(true);
      const response = await axios.get(`${backendUrl}/api/admin/vehicles/branch/${branchId}`, {
        withCredentials: true,
        timeout: 15000,
      });
      if (!isMountedRef.current) return;
      if (Array.isArray(response.data)) {
        setVehicles(response.data);
      } else {
        throw new Error("Invalid vehicles data format");
      }
    } catch (error) {
      if (!isMountedRef.current) return;
      toast.error("Failed to load vehicles", {
        description: error.response?.data?.message || error.message || "Failed to load vehicles",
        action: { label: "Retry", onClick: () => fetchVehicles(branchId) },
      });
      setVehicles([]);
    } finally {
      if (isMountedRef.current) setIsLoadingVehicles(false);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchBranches();
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchBranches]);

  // Fixed handleChange to prevent infinite re-renders
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    // Update form data first
    setFormData(prev => {
      const newFormData = { ...prev, [name]: value };
      
      // Handle special cases within the same state update
      if (name === "userType") {
        newFormData.branchId = "";
        newFormData.vehicleId = "";
        newFormData.licenseId = value === "driver" ? prev.licenseId : "";
      } else if (name === "branchId" && value && prev.userType === "driver") {
        newFormData.vehicleId = "";
      }
      
      return newFormData;
    });

    // Handle validation
    const newFormData = { ...formData, [name]: value };
    if (name === "userType") {
      newFormData.branchId = "";
      newFormData.vehicleId = "";
      newFormData.licenseId = value === "driver" ? formData.licenseId : "";
    }
    
    const validation = validateField(name, value, newFormData);

    setErrors(prev => {
      const newErrors = { ...prev };
      if (validation.isValid) {
        delete newErrors[name];
      } else {
        newErrors[name] = validation.message;
      }
      
      // Clear related errors when userType changes
      if (name === "userType") {
        delete newErrors.branchId;
        delete newErrors.vehicleId;
        delete newErrors.licenseId;
      }
      
      return newErrors;
    });

    setValidFields(prev => {
      const newValid = { ...prev, [name]: validation.isValid };
      
      // Clear related valid fields when userType changes
      if (name === "userType") {
        delete newValid.branchId;
        delete newValid.vehicleId;
        delete newValid.licenseId;
      }
      
      return newValid;
    });

    // Handle async operations
    if (name === "branchId" && value && formData.userType === "driver") {
      fetchVehicles(value);
    }

    if (name === "userType") {
      setVehicles([]);
    }
  }, [formData, validateField, fetchVehicles]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast.error("Please fix all form errors before submitting", {
        description: "Check the highlighted fields for issues"
      });
      return;
    }
    
    const toastId = toast.loading("Creating user account...", {
      description: "Please wait while we process the registration"
    });
    setIsSubmitting(true);
    
    try {
      const apiURL = `${backendUrl}/api/admin/users/${formData.userType}/register`;
      const submissionData = { ...formData };
      const response = await axios.post(apiURL, submissionData, {
        withCredentials: true,
        timeout: 20000,
      });
      
      if (!isMountedRef.current) return;
      
      setShowSuccess(true);
      toast.success("User registered successfully!", {
        id: toastId,
        description: response.data?.message || `${formData.userType} account created`,
        action: { label: "Create Another", onClick: () => resetForm() },
      });
      
      setTimeout(() => {
        if (isMountedRef.current) {
          resetForm();
          setShowSuccess(false);
        }
      }, 2000);
    } catch (error) {
      if (!isMountedRef.current) return;
      
      const errorData = error.response?.data;
      const errorMessage = errorData?.message || errorData?.error || error.message || "Registration failed";
      
      if (error.response?.status === 409) {
        toast.error("User already exists", {
          id: toastId,
          description: "A user with this email or NIC already exists",
        });
      } else if (error.response?.status === 401) {
        toast.error("Authentication required", {
          id: toastId,
          description: "Please log in to continue",
          action: { label: "Login", onClick: () => (window.location.href = "/admin/login") },
        });
      } else {
        toast.error("Registration failed", {
          id: toastId,
          description: errorMessage,
        });
      }
      console.error("Registration error:", error);
    } finally {
      if (isMountedRef.current) setIsSubmitting(false);
    }
  }, [formData, isFormValid]);

  const branchOptions = useMemo(() => [
    { value: "", label: "Select Branch" },
    ...branches.map((branch) => ({
      value: branch._id,
      label: `${branch.location} ${branch.contactNo ? `(${branch.contactNo})` : ''}`,
    })),
  ], [branches]);

  const vehicleOptions = useMemo(() => [
    { value: "", label: "Select Vehicle (Optional)" },
    ...vehicles.map((vehicle) => ({
      value: vehicle._id,
      label: `${vehicle.registrationNo} - ${vehicle.vehicleType}`,
    })),
  ], [vehicles]);

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      nic: "",
      email: "",
      contactNo: "",
      userType: "",
      licenseId: "",
      branchId: "",
      vehicleId: "",
    });
    setVehicles([]);
    setErrors({});
    setValidFields({});
    setShowSuccess(false);
    
    if (formRef.current) {
      const firstInput = formRef.current.querySelector('input, select');
      if (firstInput) firstInput.focus();
    }
  }, []);

  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-2">
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      <div className="h-10 bg-gray-200 rounded-lg"></div>
    </div>
  );

  const FieldStatusIcon = ({ fieldName }) => {
    if (errors[fieldName]) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    if (validFields[fieldName]) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return null;
  };

  const ErrorMessage = ({ message }) => (
    message ? (
      <div className="flex items-center gap-1 mt-1">
        <AlertCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
        <p className="text-sm text-red-600">{message}</p>
      </div>
    ) : null
  );

  const UserTypeSelection = () => {
    const selectedConfig = userTypeConfigs[formData.userType];
    return (
      <div className="space-y-3">
        <FormField
          label="User Type"
          type="select"
          name="userType"
          value={formData.userType}
          onChange={handleChange}
          options={userTypeOptions}
          required
          disabled={isSubmitting}
        />
        {selectedConfig && (
          <div className={`p-3 rounded-lg border ${selectedConfig.bgColor} border-opacity-50`}>
            <div className="flex items-center gap-2 mb-1">
              <selectedConfig.icon className={`h-4 w-4 ${selectedConfig.color}`} />
              <span className={`text-sm font-medium ${selectedConfig.color}`}>
                {selectedConfig.label}
              </span>
            </div>
            <p className="text-xs text-gray-600">{selectedConfig.description}</p>
          </div>
        )}
      </div>
    );
  };

  const getRequiredFieldCount = useMemo(() => {
    const baseFields = 5; // name, nic, email, contactNo, userType
    if (formData.userType === 'driver') {
            return formData.branchId && vehicles.length > 0 ? 8 : 7;
    } else if (formData.userType === 'staff') {
      // Staff has: name, nic, email, contactNo, userType, branchId
      return 6;
    }
    return baseFields;
    }, [formData.userType, formData.branchId, vehicles.length]);

 const completedFieldCount = useMemo(() => {
    let count = 0;
    
    // Count valid base fields
    ['name', 'nic', 'email', 'contactNo', 'userType'].forEach(field => {
      if (validFields[field]) count++;
    });
    
    // Count role-specific fields
    if (formData.userType === 'driver') {
      if (validFields.licenseId) count++;
      if (validFields.branchId) count++;
      // Count vehicleId if branch is selected and vehicles are available
      if (formData.branchId && vehicles.length > 0 && formData.vehicleId) {
        count++;
      }
    } else if (formData.userType === 'staff') {
      if (validFields.branchId) count++;
    }
    
    return count;
  }, [validFields, formData.userType, formData.branchId, formData.vehicleId, vehicles.length]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <UserPlus className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">User Registration</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Create a new user account with appropriate permissions and access levels
        </p>
      </div>

      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">Registration Successful!</span>
          </div>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-8" noValidate>
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-600" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <FormField
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                placeholder="Enter full name"
              />
              <div className="absolute right-3 top-8">
                <FieldStatusIcon fieldName="name" />
              </div>
              <ErrorMessage message={errors.name} />
            </div>
            <div className="relative">
              <FormField
                label="NIC Number"
                type="text"
                name="nic"
                value={formData.nic}
                onChange={handleChange}
                pattern="^(?:\d{9}[vVxX]|\d{12})$"
                title="Old format: 123456789V or New format: 200203601188"
                placeholder="Ex: 200203601188 or 987654321V"
                required
                disabled={isSubmitting}
              />
              <div className="absolute right-3 top-8">
                <FieldStatusIcon fieldName="nic" />
              </div>
              <ErrorMessage message={errors.nic} />
            </div>
            <div className="relative">
              <FormField
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                required
                disabled={isSubmitting}
              />
              <div className="absolute right-3 top-8">
                <FieldStatusIcon fieldName="email" />
              </div>
              <ErrorMessage message={errors.email} />
            </div>
            <div className="relative">
              <FormField
                label="Contact Number"
                type="tel"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleChange}
                pattern="[0-9]{10}"
                placeholder="0771234567"
                required
                disabled={isSubmitting}
              />
              <div className="absolute right-3 top-8">
                <FieldStatusIcon fieldName="contactNo" />
              </div>
              <ErrorMessage message={errors.contactNo} />
            </div>
            <div className="md:col-span-2">
              {isLoading ? <SkeletonLoader /> : <UserTypeSelection />}
              <ErrorMessage message={errors.userType} />
            </div>
          </div>
        </div>

        {formData.userType && (
          <div className="space-y-6 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              {React.createElement(userTypeConfigs[formData.userType]?.icon || Users, {
                className: "h-5 w-5 text-gray-600"
              })}
              {userTypeConfigs[formData.userType]?.label} Information
            </h3>
            {formData.userType === "driver" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <FormField
                    label="Driver's License ID"
                    type="text"
                    name="licenseId"
                    value={formData.licenseId}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    placeholder="Enter license ID"
                  />
                  <div className="absolute right-3 top-8">
                    <FieldStatusIcon fieldName="licenseId" />
                  </div>
                  <ErrorMessage message={errors.licenseId} />
                </div>
                <div>
                  {isLoading ? (
                    <SkeletonLoader />
                  ) : (
                    <FormField
                      label="Assigned Branch"
                      type="select"
                      name="branchId"
                      value={formData.branchId}
                      onChange={handleChange}
                      options={branchOptions}
                      required
                      disabled={isSubmitting}
                    />
                  )}
                  <ErrorMessage message={errors.branchId} />
                </div>
                {formData.branchId && (
                  <div className="md:col-span-2">
                    {isLoadingVehicles ? (
                      <SkeletonLoader />
                    ) : vehicles.length > 0 ? (
                      <FormField
                        label="Assigned Vehicle (Optional)"
                        type="select"
                        name="vehicleId"
                        value={formData.vehicleId}
                        onChange={handleChange}
                        options={vehicleOptions}
                        disabled={isSubmitting}
                      />
                    ) : (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Assigned Vehicle
                        </label>
                        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                          <span className="text-sm text-amber-800">
                            No vehicles available for the selected branch
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {formData.userType === "staff" && (
              <div>
                {isLoading ? (
                  <SkeletonLoader />
                ) : (
                  <FormField
                    label="Assigned Branch"
                    type="select"
                    name="branchId"
                    value={formData.branchId}
                    onChange={handleChange}
                    options={branchOptions}
                    required
                    disabled={isSubmitting}
                  />
                )}
                <ErrorMessage message={errors.branchId} />
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={resetForm}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            <RefreshCw className="h-4 w-4" />
            Reset Form
          </button>
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isSubmitting || isLoading || !isFormValid}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Register User
              </>
            )}
          </button>
        </div>
      </form>

      {Object.keys(errors).length > 0 && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <h4 className="text-sm font-medium text-red-800">
              Please fix the following errors:
            </h4>
          </div>
          <ul className="text-sm text-red-700 space-y-1 ml-6">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field} className="flex items-center gap-1">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                <span className="capitalize">{field.replace(/([A-Z])/g, ' $1')}:</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Form Progress</span>
          <span>
            {completedFieldCount}/{getRequiredFieldCount} fields completed
          </span>
        </div>
        <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
          <div 
            className="bg-blue-600 h-1 rounded-full transition-all duration-300"
            style={{ width: `${(completedFieldCount / getRequiredFieldCount) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default UserRegistrationForm;