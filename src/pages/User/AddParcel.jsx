
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { fetchBranches, submitParcel } from '../../api/parcelApi';
// import toast from 'react-hot-toast';
// import {
//   FiUser,
//   FiPackage,
//   FiMapPin,
//   FiCreditCard,
//   FiPhone,
//   FiMail,
//   FiCalendar,
//   FiClock,
//   FiHome,
//   FiTruck,
//   FiDollarSign,
//   FiSave,
// } from 'react-icons/fi';
// import Navbar from '../../components/User/Navbar';

// // Validation functions with different strictness levels
// const validateEmail = (email, isFinal = false) => {
//   if (!email) return isFinal ? '' : null;
//   const re = /^[^\s@]+@[^\s@]+\.(com|net|org|gov|edu|lk|io|info|me|co|biz|int|mil|name|pro|aero|asia|jobs|museum|tv|xyz|cloud|dev)$/;
//   return re.test(String(email).toLowerCase());
// };

// const validatePhone = (phone, isFinal = false) => {
//   if (!phone) return isFinal ? 'Contact number is required' : null;
//   const typingRegex = /^[0-9+\s]{0,12}$/;
//   const finalRegex = /^(?:0|94|\+94)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|912)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\d)\d{6}$/;
//   return isFinal ? finalRegex.test(phone) : typingRegex.test(phone);
// };

// // Constants
// const itemTypes = [
//   'Document',
//   'Clothing',
//   'Electronics',
//   'Food',
//   'Other',
//   'Glass',
//   'Flowers',
// ];

// const paymentMethods = ['Online', 'Cash on Delivery'];
// const shipmentMethods = ['Standard', 'Express'];

// const AddParcel = () => {
//   const validateField = (name, value, isFinal = false) => {
//     let error = '';
    
//     if (name === 'receiverEmail') {
//       if (!validateEmail(value, isFinal)) {
//         error = 'Please enter a valid email address';
//       }
//     } else if (name === 'receiverContactNumber') {
//       if (!validatePhone(value, isFinal)) {
//         error = value 
//           ? 'Please enter a valid Sri Lankan phone number' 
//           : 'Contact number is required';
//       }
//     }
    
//     setValidationErrors(prev => ({
//       ...prev,
//       [name]: {
//         error,
//         isTyping: !isFinal && value.length > 0
//       }
//     }));
    
//     return !error;
//   };


//     const validateCurrentSection = () => {
//     if (activeSection === 'receiver') {
//       const isEmailValid = validateField('receiverEmail', formData.receiverEmail, true);
//       const isPhoneValid = validateField('receiverContactNumber', formData.receiverContactNumber, true);
//       return isEmailValid && isPhoneValid;
//     }
//     return true; // For other sections, allow by default
//   };

//   const handleNextSection = () => {
//     if (!validateCurrentSection()) {
//       toast.error('Please check receiver email or contact is valid!');
//       return;
//     }
    
//     if (activeSection === 'receiver') setActiveSection('parcel');
//     else if (activeSection === 'parcel') setActiveSection('location');
//     else if (activeSection === 'location') setActiveSection('payment');
//   };

//   const [branches, setBranches] = useState([]);
//   const [isLoadingBranches, setIsLoadingBranches] = useState(false);
//   const [activeSection, setActiveSection] = useState('receiver');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitSuccess, setSubmitSuccess] = useState(false);
//   const [error, setError] = useState(null);
//   const [validationErrors, setValidationErrors] = useState({
//     receiverEmail: { error: '', isTyping: false },
//     receiverContactNumber: { error: '', isTyping: false },
//   });
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     receiverFullName: '',
//     receiverContactNumber: '',
//     receiverEmail: '',
//     itemType: '',
//     itemSize: '',
//     submittingType: '',
//     receivingType: '',
//     pickupDate: '',
//     pickupTime: '',
//     pickupAddress: '',
//     pickupCity: '',
//     pickupDistrict: '',
//     pickupProvince: '',
//     deliveryAddress: '',
//     deliveryCity: '',
//     deliveryDistrict: '',
//     deliveryProvince: '',
//     postalCode: '',
//     fromBranch: '',
//     toBranch: '',
//     paymentMethod: 'Online',
//     shipmentMethod: '',
//     specialInstructions: '',
//   });

//   useEffect(() => {
//     const loadBranches = async () => {
//       setIsLoadingBranches(true);
//       try {
//         const branchesData = await fetchBranches();
//         setBranches(branchesData);
//       } catch (err) {
//         setError('Failed to load branches. Please try again later.');
//         console.error('Failed to load branches', err);
//       } finally {
//         setIsLoadingBranches(false);
//       }
//     };
//     loadBranches();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     if (name === 'receiverEmail' || name === 'receiverContactNumber') {
//       validateField(name, value, false);
//     }
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     if (name === 'receiverEmail' || name === 'receiverContactNumber') {
//       validateField(name, value, true);
//     }
//   };

//   const showPickupFields = formData.submittingType === 'Pickup';
//   const showDeliveryFields = formData.receivingType === 'doorstep';
//   const showFromBranchField = formData.submittingType === 'Drop-off';
//   const showToBranchField = formData.receivingType === 'collection_center';

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError(null);

//     try {
//       const isEmailValid = validateField('receiverEmail', formData.receiverEmail, true);
//       const isPhoneValid = validateField('receiverContactNumber', formData.receiverContactNumber, true);
      
//       if (!isEmailValid || !isPhoneValid) {
//         return;
//       }

//       const payload = {
//         receiverFullName: formData.receiverFullName,
//         receiverContact: formData.receiverContactNumber,
//         receiverEmail: formData.receiverEmail,
//         itemSize: formData.itemSize.toLowerCase(),
//         itemType: formData.itemType,
//         shipmentMethod: formData.shipmentMethod.toLowerCase(),
//         submittingType: formData.submittingType.toLowerCase(),
//         paymentMethod: formData.paymentMethod === 'Online' ? 'Online' : 'COD',
//         specialInstructions: formData.specialInstructions,
//         receivingType: formData.receivingType,
//         ...(formData.submittingType === 'Pickup' && {
//           pickupDate: formData.pickupDate,
//           pickupTime: formData.pickupTime,
//           address: formData.pickupAddress,
//           city: formData.pickupCity,
//           district: formData.pickupDistrict,
//           province: formData.pickupProvince,
//         }),
//         ...(formData.receivingType === 'doorstep' && {
//           deliveryAddress: formData.deliveryAddress,
//           deliveryCity: formData.deliveryCity,
//           deliveryDistrict: formData.deliveryDistrict,
//           deliveryProvince: formData.deliveryProvince,
//           postalCode: formData.postalCode,
//         }),
//         from: formData.fromBranch || null,
//         to: formData.toBranch || null,
//       };

//       const response = await submitParcel(payload);

//       if (response.paymentUrl) {
//         window.location.href = response.paymentUrl;
//       } else {
//         setSubmitSuccess(true);
//         toast.success('Your parcel added Successful!', { duration: 3000 });
//         setTimeout(() => {
//           navigate('/parcel');
//         }, 3000);
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           'Failed to submit parcel. Please try again.'
//       );
//       console.error('Submission error:', err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const sriLankaDistricts = [
//     { district: "Colombo", province: "Western" },
//     { district: "Gampaha", province: "Western" },
//     { district: "Kalutara", province: "Western" },
//     { district: "Kandy", province: "Central" },
//     { district: "Matale", province: "Central" },
//     { district: "Nuwara Eliya", province: "Central" },
//     { district: "Galle", province: "Southern" },
//     { district: "Matara", province: "Southern" },
//     { district: "Hambantota", province: "Southern" },
//     { district: "Jaffna", province: "Northern" },
//     { district: "Kilinochchi", province: "Northern" },
//     { district: "Mannar", province: "Northern" },
//     { district: "Vavuniya", province: "Northern" },
//     { district: "Mullaitivu", province: "Northern" },
//     { district: "Trincomalee", province: "Eastern" },
//     { district: "Batticaloa", province: "Eastern" },
//     { district: "Ampara", province: "Eastern" },
//     { district: "Puttalam", province: "North Western" },
//     { district: "Kurunegala", province: "North Western" },
//     { district: "Anuradhapura", province: "North Central" },
//     { district: "Polonnaruwa", province: "North Central" },
//     { district: "Badulla", province: "Uva" },
//     { district: "Monaragala", province: "Uva" },
//     { district: "Ratnapura", province: "Sabaragamuwa" },
//     { district: "Kegalle", province: "Sabaragamuwa" },
//   ];

//   const renderBranchDropdown = (name, value, label, required) => {
//     const handleBranchChange = (e) => {
//       const selectedBranchId = e.target.value;
//       const selectedBranch = branches.find(branch => branch._id === selectedBranchId);
      
//       handleChange(e);
      
//       if (selectedBranch) {
//         const districtInfo = sriLankaDistricts.find(
//           d => d.district === selectedBranch.location
//         );
        
//         setFormData(prev => ({
//           ...prev,
//           pickupProvince: districtInfo?.province || '',
//           pickupDistrict: selectedBranch.location
//         }));
        
//         setFormData(prev => ({
//           ...prev,
//           deliveryProvince: districtInfo?.province || '',
//           deliveryDistrict: selectedBranch.location
//         }));
//       }
//     };

//     return (
//       <div className="mt-1">
//         <select
//           id={name}
//           name={name}
//           value={value}
//           onChange={handleBranchChange}
//           required={required}
//           className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border transition-all duration-200"
//           disabled={isLoadingBranches}
//         >
//           <option value="">Select {label.toLowerCase()}</option>
//           {branches.map((branch) => (
//             <option key={branch._id} value={branch._id}>
//               {branch.location} 
//             </option>
//           ))}
//         </select>
//         {isLoadingBranches && (
//           <p className="mt-1 text-sm text-gray-500">Loading branches...</p>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="min-h-screen relative bg-gradient-to-b from-teal-50 to-white">
//         <div className="absolute top-0 left-0 w-full rotate-180">
//           <svg
//             className="w-full h-auto"
//             viewBox="0 0 1440 320"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <defs>
//               <linearGradient
//                 id="topToBottomGradient"
//                 x1="0"
//                 y1="0"
//                 x2="0"
//                 y2="1"
//               >
//                 <stop offset="0%" stopColor="#1f818c" />
//                 <stop offset="100%" stopColor="white" />
//               </linearGradient>
//             </defs>
//             <path
//               fill="url(#topToBottomGradient)"
//               fillOpacity="1"
//               d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,106.7C672,117,768,171,864,181.3C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
//             />
//           </svg>
//         </div>

//         <div className="max-w-4xl mx-auto relative px-4 py-8 sm:px-6 lg:px-8">
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-extrabold text-gray-900">
//               Add New Parcel
//             </h1>
//             <p className="mt-2 text-lg text-gray-600">
//               Fill in the details below to register your parcel for delivery
//             </p>
//           </div>

//           <div className="mb-30">
//             <div className="flex justify-between items-center">
//               {['receiver', 'parcel', 'location', 'payment'].map((step) => (
//                 <button
//                   key={step}
//                   onClick={() => setActiveSection(step)}
//                   className={`flex flex-col items-center ${activeSection === step ? 'text-teal-600' : 'text-gray-500'}`}
//                 >
//                   <div
//                     className={`w-10 h-10 rounded-full flex items-center justify-center mb-8 
//                   ${activeSection === step ? 'bg-teal-100 border-2 border-teal-600' : 'bg-gray-100 border-2 border-gray-300'}`}
//                   >
//                     {step === 'receiver' && <FiUser className="text-lg" />}
//                     {step === 'parcel' && <FiPackage className="text-lg" />}
//                     {step === 'location' && <FiMapPin className="text-lg" />}
//                     {step === 'payment' && <FiCreditCard className="text-lg" />}
//                   </div>
//                   <span className="text-xs font-medium capitalize">{step}</span>
//                 </button>
//               ))}
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
//               <div
//                 className="bg-teal-600 h-2.5 rounded-full transition-all duration-500"
//                 style={{
//                   width:
//                     activeSection === 'receiver'
//                       ? '25%'
//                       : activeSection === 'parcel'
//                         ? '50%'
//                         : activeSection === 'location'
//                           ? '75%'
//                           : '100%',
//                 }}
//               ></div>
//             </div>
//           </div>

//           <form
//             onSubmit={handleSubmit}
//             className="bg-white shadow-xl rounded-xl overflow-hidden border border-teal-100"
//           >
//             <div className="p-6 space-y-8">
//               {/* Receiver Details Section */}
//               {activeSection === 'receiver' && (
//                 <div className="border-b border-gray-200 pb-6">
//                   <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//                     <FiUser className="mr-2 text-teal-600" />
//                     Receiver Details
//                   </h2>
//                   <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//                     <div className="sm:col-span-3">
//                       <label
//                         htmlFor="receiverFullName"
//                         className="block text-sm font-medium text-gray-700"
//                       >
//                         Full Name
//                       </label>
//                       <div className="mt-1 relative">
//                         <input
//                           type="text"
//                           id="receiverFullName"
//                           name="receiverFullName"
//                           value={formData.receiverFullName}
//                           onChange={handleChange}
//                           required
//                           className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border pl-10 transition-all duration-200"
//                         />
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                           <FiUser className="h-5 w-5 text-gray-400" />
//                         </div>
//                       </div>
//                     </div>

//                     <div className="sm:col-span-3">
//                       <label htmlFor="receiverContactNumber" className="block text-sm font-medium text-gray-700">
//                         Contact Number
//                       </label>
//                       <div className="mt-1 relative">
//                         <input
//                           type="tel"
//                           id="receiverContactNumber"
//                           name="receiverContactNumber"
//                           value={formData.receiverContactNumber}
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                           required
//                           className={`block w-full rounded-lg shadow-sm sm:text-sm py-2 px-3 border pl-10 transition-all duration-200 ${
//                             validationErrors.receiverContactNumber.error
//                               ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
//                               : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'
//                           }`}
//                           placeholder="07XXXXXXXX or 0XX XXXXXXX"
//                         />
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                           <FiPhone className="h-5 w-5 text-gray-400" />
//                         </div>
//                       </div>
//                       {validationErrors.receiverContactNumber.error && (
//                         <p className={`mt-1 text-sm ${
//                           validationErrors.receiverContactNumber.isTyping ? 'text-gray-500' : 'text-red-600'
//                         }`}>
//                           {validationErrors.receiverContactNumber.error}
//                         </p>
//                       )}
//                     </div>

//                     <div className="sm:col-span-6">
//                       <label htmlFor="receiverEmail" className="block text-sm font-medium text-gray-700">
//                         Email Address
//                       </label>
//                       <div className="mt-1 relative">
//                         <input
//                           type="email"
//                           id="receiverEmail"
//                           name="receiverEmail"
//                           value={formData.receiverEmail}
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                           className={`block w-full rounded-lg shadow-sm sm:text-sm py-2 px-3 border pl-10 transition-all duration-200 ${
//                             validationErrors.receiverEmail.error
//                               ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
//                               : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'
//                           }`}
//                         />
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                           <FiMail className="h-5 w-5 text-gray-400" />
//                         </div>
//                       </div>
//                       {validationErrors.receiverEmail.error && (
//                         <p className={`mt-1 text-sm ${
//                           validationErrors.receiverEmail.isTyping ? 'text-gray-500' : 'text-red-600'
//                         }`}>
//                           {validationErrors.receiverEmail.error}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                   <div className="mt-6 flex justify-end">
//                     <button
//                       type="button"
//                         onClick={handleNextSection}
//                       className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
//                     >
//                       Next: Parcel Details
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Parcel Details Section */}
//               {activeSection === 'parcel' && (
//                 <div className="border-b border-gray-200 pb-6">
//                   <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//                     <FiPackage className="mr-2 text-teal-600" />
//                     Parcel Details
//                   </h2>
//                   <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//                     <div className="sm:col-span-3">
//                       <label
//                         htmlFor="itemType"
//                         className="block text-sm font-medium text-gray-700"
//                       >
//                         Item Type
//                       </label>
//                       <div className="mt-1">
//                         <select
//                           id="itemType"
//                           name="itemType"
//                           value={formData.itemType}
//                           onChange={handleChange}
//                           required
//                           className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border transition-all duration-200"
//                         >
//                           <option value="">Select item type</option>
//                           {itemTypes.map((type) => (
//                             <option key={type} value={type}>
//                               {type}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>

//                     <div className="sm:col-span-3">
//                       <label
//                         htmlFor="itemSize"
//                         className="block text-sm font-medium text-gray-700"
//                       >
//                         Item Size
//                       </label>
//                       <div className="mt-1">
//                         <select
//                           id="itemSize"
//                           name="itemSize"
//                           value={formData.itemSize}
//                           onChange={handleChange}
//                           required
//                           className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border transition-all duration-200"
//                         >
//                           <option value="">Select item size</option>
//                           {/* {itemSizes.map((size) => (
//                             <option key={size} value={size}>
//                               {size}
//                             </option>
//                           ))} */}
//                           <option value="Small">Small (0-2kg)</option>
//                           <option value="Medium">Medium (2kg-5kg) </option>
//                           <option value="Large">Large (5kg-10kg)</option>
                          
//                         </select>
//                       </div>
                        
                        
                       
                    
//                     </div>

//                     <div className="sm:col-span-3">
//                       <label
//                         htmlFor="submittingType"
//                         className="block text-sm font-medium text-gray-700"
//                       >
//                         Submitting Type
//                       </label>
//                       <div className="mt-1">
//                         <select
//                           id="submittingType"
//                           name="submittingType"
//                           value={formData.submittingType}
//                           onChange={handleChange}
//                           required
//                           className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border transition-all duration-200"
//                         >
//                           <option value="">Select submitting type</option>
//                           <option value="Pickup">Pickup</option>
//                           <option value="Drop-off">Drop-off (Branch)</option>
//                         </select>
//                       </div>
//                     </div>

//                     <div className="sm:col-span-3">
//                       <label
//                         htmlFor="receivingType"
//                         className="block text-sm font-medium text-gray-700"
//                       >
//                         Receiving Type
//                       </label>
//                       <div className="mt-1">
//                         <select
//                           id="receivingType"
//                           name="receivingType"
//                           value={formData.receivingType}
//                           onChange={handleChange}
//                           required
//                           className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border transition-all duration-200"
//                         >
//                           <option value="">Select receiving type</option>
//                           <option value="doorstep">Doorstep Delivery</option>
//                           <option value="collection_center">
//                             Collection Center
//                           </option>
//                         </select>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="mt-6 flex justify-between">
//                     <button
//                       type="button"
//                       onClick={() => setActiveSection('receiver')}
//                       className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
//                     >
//                       Back
//                     </button>
//                     <button
//                       type="button"
//                         onClick={handleNextSection}
//                       className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
//                     >
//                       Next: Location Details
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Location Details Section */}
//               {activeSection === 'location' && (
//                 <>
//                   {/* Conditional Pickup Information */}
//                   {showPickupFields && (
//                     <div className="border-b border-gray-200 pb-6">
//                       <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//                         <FiMapPin className="mr-2 text-teal-600" />
//                         Pickup Information
//                       </h2>
//                       <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//                         <div className="sm:col-span-3">
//                           <label
//                             htmlFor="pickupDate"
//                             className="block text-sm font-medium text-gray-700"
//                           >
//                             Pickup Date
//                           </label>
//                           <div className="mt-1 relative rounded-md shadow-sm">
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                               <FiCalendar className="h-5 w-5 text-gray-400" />
//                             </div>
//                             <input
//                               type="date"
//                               id="pickupDate"
//                               name="pickupDate"
//                               value={formData.pickupDate}
//                               onChange={handleChange}
//                               required={showPickupFields}
//                               min={new Date().toISOString().split('T')[0]}
//                               className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 pl-10 border transition-all duration-200"
//                             />
//                           </div>
//                         </div>

//                         <div className="sm:col-span-3">
//                           <label
//                             htmlFor="pickupTime"
//                             className="block text-sm font-medium text-gray-700"
//                           >
//                             Pickup Time
//                           </label>
//                           <div className="mt-1 relative rounded-md shadow-sm">
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                               <FiClock className="h-5 w-5 text-gray-400" />
//                             </div>
//                             <select
//                               id="pickupTime"
//                               name="pickupTime"
//                               value={formData.pickupTime}
//                               onChange={handleChange}
//                               required={showPickupFields}
//                               className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 pl-10 border transition-all duration-200"
//                             >
//                               <option value="">Select time slot</option>
//                               <option value="08:00 - 12:00">Morning (08:00 - 12:00)</option>
//                               <option value="13:00 - 17:00">Afternoon (13:00 - 17:00)</option>
//                             </select>
//                           </div>
//                         </div>

//                         <div className="sm:col-span-6">
//                           <label
//                             htmlFor="pickupAddress"
//                             className="block text-sm font-medium text-gray-700"
//                           >
//                             Pickup Address
//                           </label>
//                           <div className="mt-1 relative">
//                             <input
//                               type="text"
//                               id="pickupAddress"
//                               name="pickupAddress"
//                               value={formData.pickupAddress}
//                               onChange={handleChange}
//                               required={showPickupFields}
//                               className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border pl-10 transition-all duration-200"
//                             />
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                               <FiHome className="h-5 w-5 text-gray-400" />
//                             </div>
//                           </div>
//                         </div>

//                         <div className="sm:col-span-2">
//                           <label
//                             htmlFor="pickupCity"
//                             className="block text-sm font-medium text-gray-700"
//                           >
//                             City
//                           </label>
//                           <div className="mt-1">
//                             <input
//                               type="text"
//                               id="pickupCity"
//                               name="pickupCity"
//                               value={formData.pickupCity}
//                               onChange={handleChange}
//                               required={showPickupFields}
//                               className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border transition-all duration-200"
//                             />
//                           </div>
//                         </div>

//                         <div className="sm:col-span-2">
//                           <label
//                             htmlFor="pickupDistrict"
//                             className="block text-sm font-medium text-gray-700"
//                           >
//                             District
//                           </label>
//                           <div className="mt-1">
//                             {renderBranchDropdown(
//                               'fromBranch',
//                               formData.fromBranch,
//                               'branch',
//                               true
//                             )}
//                           </div>
//                         </div>

//                         <div className="sm:col-span-2">
//                           <label
//                             htmlFor="pickupProvince"
//                             className="block text-sm font-medium text-gray-700"
//                           >
//                             Province
//                           </label>
//                           <div className="mt-1">
//                             <input
//                               type="text"
//                               id="pickupProvince"
//                               name="pickupProvince"
//                               value={formData.pickupProvince}
//                               onChange={handleChange}
//                               required={showPickupFields}
//                               readOnly
//                               className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border transition-all duration-200"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* Conditional Delivery Information */}
//                   {showDeliveryFields && (
//                     <div className="border-b border-gray-200 pb-6">
//                       <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//                         <FiHome className="mr-2 text-teal-600" />
//                         Delivery Information
//                       </h2>
//                       <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//                         <div className="sm:col-span-6">
//                           <label
//                             htmlFor="deliveryAddress"
//                             className="block text-sm font-medium text-gray-700"
//                           >
//                             Delivery Address
//                           </label>
//                           <div className="mt-1 relative">
//                             <input
//                               type="text"
//                               id="deliveryAddress"
//                               name="deliveryAddress"
//                               value={formData.deliveryAddress}
//                               onChange={handleChange}
//                               required={showDeliveryFields}
//                               className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border pl-10 transition-all duration-200"
//                             />
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                               <FiMapPin className="h-5 w-5 text-gray-400" />
//                             </div>
//                           </div>
//                         </div>

//                         <div className="sm:col-span-2">
//                           <label
//                             htmlFor="deliveryCity"
//                             className="block text-sm font-medium text-gray-700"
//                           >
//                             City
//                           </label>
//                           <div className="mt-1">
//                             <input
//                               type="text"
//                               id="deliveryCity"
//                               name="deliveryCity"
//                               value={formData.deliveryCity}
//                               onChange={handleChange}
//                               required={showDeliveryFields}
//                               className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border transition-all duration-200"
//                             />
//                           </div>
//                         </div>

//                         <div className="sm:col-span-2">
//                           <label
//                             htmlFor="deliveryDistrict"
//                             className="block text-sm font-medium text-gray-700"
//                           >
//                             District
//                           </label>
//                           <div className="mt-1">
//                             {renderBranchDropdown(
//                               'toBranch',
//                               formData.toBranch,
//                               'branch',
//                               true
//                             )}
//                           </div>
//                         </div>

//                         <div className="sm:col-span-2">
//                           <label
//                             htmlFor="deliveryProvince"
//                             className="block text-sm font-medium text-gray-700"
//                           >
//                             Province
//                           </label>
//                           <div className="mt-1">
//                             <input
//                               type="text"
//                               id="deliveryProvince"
//                               name="deliveryProvince"
//                               value={formData.deliveryProvince}
//                               onChange={handleChange}
//                               required={showDeliveryFields}
//                               readOnly
//                               className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border transition-all duration-200"
//                             />
//                           </div>
//                         </div>

//                         <div className="sm:col-span-2">
//                           <label
//                             htmlFor="postalCode"
//                             className="block text-sm font-medium text-gray-700"
//                           >
//                             Postal Code
//                           </label>
//                           <div className="mt-1">
//                             <input
//                               type="text"
//                               id="postalCode"
//                               name="postalCode"
//                               value={formData.postalCode}
//                               onChange={handleChange}
//                               required={showDeliveryFields}
//                               className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border transition-all duration-200"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* Conditional Branch Information */}
//                   {(showFromBranchField || showToBranchField) && (
//                     <div className="border-b border-gray-200 pb-6">
//                       <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//                         <FiTruck className="mr-2 text-teal-600" />
//                         Branch Information
//                       </h2>
//                       <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//                         {showFromBranchField && (
//                           <div className="sm:col-span-3">
//                             <label
//                               htmlFor="fromBranch"
//                               className="block text-sm font-medium text-gray-700"
//                             >
//                               From Branch
//                             </label>
//                             {renderBranchDropdown(
//                               'fromBranch',
//                               formData.fromBranch,
//                               'branch',
//                               true
//                             )}
//                           </div>
//                         )}

//                         {showToBranchField && (
//                           <div className="sm:col-span-3">
//                             <label
//                               htmlFor="toBranch"
//                               className="block text-sm font-medium text-gray-700"
//                             >
//                               To Branch
//                             </label>
//                             {renderBranchDropdown(
//                               'toBranch',
//                               formData.toBranch,
//                               'branch',
//                               true
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   <div className="mt-6 flex justify-between">
//                     <button
//                       type="button"
//                       onClick={() => setActiveSection('parcel')}
//                       className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
//                     >
//                       Back
//                     </button>
//                     <button
//                       type="button"
//                        onClick={handleNextSection}
//                       className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
//                     >
//                       Next: Payment & Shipment
//                     </button>
//                   </div>
//                 </>
//               )}

//               {/* Payment & Shipment Section */}
//               {activeSection === 'payment' && (
//                 <div>

//                   <div className="border-b border-gray-200 pb-6">
//                     <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//                       <FiTruck className="mr-2 text-teal-600" />
//                       Shipment Details
//                     </h2>
//                     <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//                       <div className="sm:col-span-3">
//                         <label
//                           htmlFor="shipmentMethod"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           Shipment Method
//                         </label>
//                         <div className="mt-1">
//                           <select
//                             id="shipmentMethod"
//                             name="shipmentMethod"
//                             value={formData.shipmentMethod}
//                             onChange={handleChange}
//                             required
//                             className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border transition-all duration-200"
//                           >
//                             <option value="">Select shipment method</option>
//                             {shipmentMethods.map((method) => (
//                               <option key={method} value={method}>
//                                 {method}
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                       </div>

//                       <div className="sm:col-span-6">
//                         <label
//                           htmlFor="specialInstructions"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           Special Instructions (Optional)
//                         </label>
//                         <div className="mt-1">
//                           <textarea
//                             id="specialInstructions"
//                             name="specialInstructions"
//                             rows="3"
//                             value={formData.specialInstructions}
//                             onChange={handleChange}
//                             className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border transition-all duration-200"
//                             placeholder="Any special handling instructions..."
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="border-b border-gray-200 pb-6">
//                     <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//                       <FiCreditCard className="mr-2 text-teal-600" />
//                       Payment Method
//                     </h2>
//                     <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//                       <div className="sm:col-span-6">
//                         <div className="grid grid-cols-2 gap-4">
//                           {paymentMethods.map((method) => (
//                             <div key={method} className="relative">
//                               <input
//                                 type="radio"
//                                 id={`payment-${method}`}
//                                 name="paymentMethod"
//                                 value={method}
//                                 checked={formData.paymentMethod === method}
//                                 onChange={handleChange}
//                                 required
//                                 className="sr-only"
//                               />
//                               <label
//                                 htmlFor={`payment-${method}`}
//                                 className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
//                                   formData.paymentMethod === method
//                                     ? 'border-teal-500 bg-teal-50 shadow-md'
//                                     : 'border-gray-300 hover:border-teal-300'
//                                 }`}
//                               >
//                                 <div className="flex items-center">
//                                   {method === 'Online' ? (
//                                     <FiCreditCard className="h-5 w-5 text-teal-600 mr-2" />
//                                   ) : (
//                                     <FiDollarSign className="h-5 w-5 text-teal-600 mr-2" />
//                                   )}
//                                   <span className="text-sm font-medium text-gray-700">
//                                     {method}
//                                   </span>
//                                 </div>
//                               </label>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

                  

//                   <div className="mt-6 flex justify-between">
//                     <button
//                       type="button"
//                       onClick={() => setActiveSection('location')}
//                       className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
//                     >
//                       Back
//                     </button>
//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200 ${
//                         isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
//                       }`}
//                     >
//                       {isSubmitting ? (
//                         <>
//                           <svg
//                             className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <circle
//                               className="opacity-25"
//                               cx="12"
//                               cy="12"
//                               r="10"
//                               stroke="currentColor"
//                               strokeWidth="4"
//                             ></circle>
//                             <path
//                               className="opacity-75"
//                               fill="currentColor"
//                               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                             ></path>
//                           </svg>
//                           Processing...
//                         </>
//                       ) : (
//                         <>
//                           <FiSave className="mr-2" />
//                           Submit Parcel
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </form>

//           {error && (
//             <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
//               {error}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddParcel;









import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBranches, submitParcel, calculatePayment as calculatePaymentApi } from '../../api/parcelApi';
import toast from 'react-hot-toast';
import {
  FiUser,
  FiPackage,
  FiMapPin,
  FiCreditCard,
  FiPhone,
  FiMail,
  FiCalendar,
  FiClock,
  FiHome,
  FiTruck,
  FiDollarSign,
  FiSave,
  FiCheck,
  FiArrowLeft
} from 'react-icons/fi';
import Navbar from '../../components/User/Navbar';

// Validation functions with different strictness levels
const validateEmail = (email, isFinal = false) => {
  if (!email) return isFinal ? '' : null;
  const re = /^[^\s@]+@[^\s@]+\.(com|net|org|gov|edu|lk|io|info|me|co|biz|int|mil|name|pro|aero|asia|jobs|museum|tv|xyz|cloud|dev)$/;
  return re.test(String(email).toLowerCase());
};

const validatePhone = (phone, isFinal = false) => {
  if (!phone) return isFinal ? 'Contact number is required' : null;
  const typingRegex = /^[0-9+\s]{0,12}$/;
  const finalRegex = /^(?:0|94|\+94)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|912)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\d)\d{6}$/;
  return isFinal ? finalRegex.test(phone) : typingRegex.test(phone);
};

// Constants
const itemTypes = [
  'Document',
  'Clothing',
  'Electronics',
  'Food',
  'Other',
  'Glass',
  'Flowers',
];

const paymentMethods = ['Online', 'Cash on Delivery'];
const shipmentMethods = ['Standard', 'Express'];

const AddParcel = () => {
  const validateField = (name, value, isFinal = false) => {
    let error = '';
    
    if (name === 'receiverEmail') {
      if (!validateEmail(value, isFinal)) {
        error = 'Please enter a valid email address';
      }
    } else if (name === 'receiverContactNumber') {
      if (!validatePhone(value, isFinal)) {
        error = value 
          ? 'Please enter a valid Sri Lankan phone number' 
          : 'Contact number is required';
      }
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [name]: {
        error,
        isTyping: !isFinal && value.length > 0
      }
    }));
    
    return !error;
  };

  const validateCurrentSection = () => {
    if (activeSection === 'receiver') {
      const isEmailValid = validateField('receiverEmail', formData.receiverEmail, true);
      const isPhoneValid = validateField('receiverContactNumber', formData.receiverContactNumber, true);
      return isEmailValid && isPhoneValid;
    }
    return true; // For other sections, allow by default
  };

  const handleNextSection = () => {
    if (!validateCurrentSection()) {
      toast.error('Please check receiver email or contact is valid!');
      return;
    }
    
    if (activeSection === 'receiver') setActiveSection('parcel');
    else if (activeSection === 'parcel') setActiveSection('location');
    else if (activeSection === 'location') setActiveSection('payment');
  };

  const [branches, setBranches] = useState([]);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);
  const [activeSection, setActiveSection] = useState('receiver');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    receiverEmail: { error: '', isTyping: false },
    receiverContactNumber: { error: '', isTyping: false },
  });
  const [paymentAmount, setPaymentAmount] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    receiverFullName: '',
    receiverContactNumber: '',
    receiverEmail: '',
    itemType: '',
    itemSize: '',
    submittingType: '',
    receivingType: '',
    pickupDate: '',
    pickupTime: '',
    pickupAddress: '',
    pickupCity: '',
    pickupDistrict: '',
    pickupProvince: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryDistrict: '',
    deliveryProvince: '',
    postalCode: '',
    fromBranch: '',
    toBranch: '',
    paymentMethod: 'Online',
    shipmentMethod: '',
    specialInstructions: '',
  });

  useEffect(() => {
    const loadBranches = async () => {
      setIsLoadingBranches(true);
      try {
        const branchesData = await fetchBranches();
        setBranches(branchesData);
      } catch (err) {
        setError('Failed to load branches. Please try again later.');
        console.error('Failed to load branches', err);
      } finally {
        setIsLoadingBranches(false);
      }
    };
    loadBranches();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === 'receiverEmail' || name === 'receiverContactNumber') {
      validateField(name, value, false);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'receiverEmail' || name === 'receiverContactNumber') {
      validateField(name, value, true);
    }
  };

  const showPickupFields = formData.submittingType === 'Pickup';
  const showDeliveryFields = formData.receivingType === 'doorstep';
  const showFromBranchField = formData.submittingType === 'Drop-off';
  const showToBranchField = formData.receivingType === 'collection_center';

  const calculatePayment = async () => {
    try {
      const { itemSize, fromBranch, toBranch, shipmentMethod } = formData;
      if (!itemSize || !shipmentMethod) {
        throw new Error('Item size and shipment method are required');
      }
      // Always use selected fromBranch and toBranch if set
      const from = fromBranch || null;
      const to = toBranch || null;
      console.log('Sending to API:', {
        itemSize,
        from,
        to,
        shippingMethod: shipmentMethod.toLowerCase()
      });
      const response = await calculatePaymentApi({
        itemSize,
        fromBranchId: from,
        toBranchId: to,
        shippingMethod: shipmentMethod.toLowerCase()
      });
      setPaymentAmount(response.paymentAmount);
      return response.paymentAmount;
    } catch (error) {
      console.error('Payment calculation failed:', error);
      toast.error('Failed to calculate payment amount');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!showPreview) {
      const amount = await calculatePayment();
      if (amount !== null) {
        setShowPreview(true);
      }
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        receiverFullName: formData.receiverFullName,
        receiverContact: formData.receiverContactNumber,
        receiverEmail: formData.receiverEmail,
        itemSize: formData.itemSize.toLowerCase(),
        itemType: formData.itemType,
        shipmentMethod: formData.shipmentMethod.toLowerCase(),
        submittingType: formData.submittingType.toLowerCase(),
        paymentMethod: formData.paymentMethod === 'Online' ? 'Online' : 'COD',
        specialInstructions: formData.specialInstructions,
        receivingType: formData.receivingType,
        amount: paymentAmount,
        ...(formData.submittingType === 'Pickup' && {
          pickupDate: formData.pickupDate,
          pickupTime: formData.pickupTime,
          address: formData.pickupAddress,
          city: formData.pickupCity,
          district: formData.pickupDistrict,
          province: formData.pickupProvince,
        }),
        ...(formData.receivingType === 'doorstep' && {
          deliveryAddress: formData.deliveryAddress,
          deliveryCity: formData.deliveryCity,
          deliveryDistrict: formData.deliveryDistrict,
          deliveryProvince: formData.deliveryProvince,
          postalCode: formData.postalCode,
        }),
        from: formData.fromBranch || null,
        to: formData.toBranch || null,
      };

      const response = await submitParcel(payload);

      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        setSubmitSuccess(true);
        toast.success('Your parcel was added successfully!', { duration: 3000 });
        setTimeout(() => {
          navigate('/parcel');
        }, 3000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to submit parcel. Please try again.'
      );
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sriLankaDistricts = [
    { district: "Colombo", province: "Western" },
    { district: "Gampaha", province: "Western" },
    { district: "Kalutara", province: "Western" },
    { district: "Kandy", province: "Central" },
    { district: "Matale", province: "Central" },
    { district: "Nuwara Eliya", province: "Central" },
    { district: "Galle", province: "Southern" },
    { district: "Matara", province: "Southern" },
    { district: "Hambantota", province: "Southern" },
    { district: "Jaffna", province: "Northern" },
    { district: "Kilinochchi", province: "Northern" },
    { district: "Mannar", province: "Northern" },
    { district: "Vavuniya", province: "Northern" },
    { district: "Mullaitivu", province: "Northern" },
    { district: "Trincomalee", province: "Eastern" },
    { district: "Batticaloa", province: "Eastern" },
    { district: "Ampara", province: "Eastern" },
    { district: "Puttalam", province: "North Western" },
    { district: "Kurunegala", province: "North Western" },
    { district: "Anuradhapura", province: "North Central" },
    { district: "Polonnaruwa", province: "North Central" },
    { district: "Badulla", province: "Uva" },
    { district: "Monaragala", province: "Uva" },
    { district: "Ratnapura", province: "Sabaragamuwa" },
    { district: "Kegalle", province: "Sabaragamuwa" },
  ];

  const renderBranchDropdown = (name, value, label, required) => {
    const handleBranchChange = (e) => {
      const selectedBranchId = e.target.value;
      const selectedBranch = branches.find(branch => branch._id === selectedBranchId);
      handleChange(e);
      if (selectedBranch) {
        const districtInfo = sriLankaDistricts.find(
          d => d.district === selectedBranch.location
        );
        if (name === 'fromBranch') {
          setFormData(prev => ({
            ...prev,
            fromBranch: selectedBranchId,
            pickupDistrict: selectedBranch.location,
            pickupProvince: districtInfo?.province || '',
          }));
        } else if (name === 'toBranch') {
          setFormData(prev => ({
            ...prev,
            toBranch: selectedBranchId,
            deliveryDistrict: selectedBranch.location,
            deliveryProvince: districtInfo?.province || '',
          }));
        }
      }
    };

    return (
      <div className="mt-1">
        <select
          id={name}
          name={name}
          value={value}
          onChange={handleBranchChange}
          required={required}
          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border transition-all duration-200"
          disabled={isLoadingBranches}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {branches.map((branch) => (
            <option key={branch._id} value={branch._id}>
              {branch.location} 
            </option>
          ))}
        </select>
        {isLoadingBranches && (
          <p className="mt-1 text-sm text-gray-500">Loading branches...</p>
        )}
      </div>
    );
  };

  const renderPreview = () => (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center">
        <FiCheck className="mr-2 text-teal-600" />
        Review & Confirm
      </h2>
      
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Parcel Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-700 mb-2">Receiver Information</h4>
            <p><span className="font-semibold">Name:</span> {formData.receiverFullName}</p>
            <p><span className="font-semibold">Contact:</span> {formData.receiverContactNumber}</p>
            <p><span className="font-semibold">Email:</span> {formData.receiverEmail}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-700 mb-2">Parcel Details</h4>
            <p><span className="font-semibold">Type:</span> {formData.itemType}</p>
            <p><span className="font-semibold">Size:</span> {formData.itemSize}</p>
            <p><span className="font-semibold">Shipment Method:</span> {formData.shipmentMethod}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-700 mb-2">Location Details</h4>
            <p><span className="font-semibold">Submitting:</span> {formData.submittingType}</p>
            <p><span className="font-semibold">Receiving:</span> {formData.receivingType}</p>
            {formData.submittingType === 'Pickup' && (
              <p><span className="font-semibold">Pickup Address:</span> {formData.pickupAddress}</p>
            )}
            {formData.receivingType === 'doorstep' && (
              <p><span className="font-semibold">Delivery Address:</span> {formData.deliveryAddress}</p>
            )}
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-700 mb-2">Payment Details</h4>
            <p><span className="font-semibold">Method:</span> {formData.paymentMethod}</p>
            <p className="text-lg font-bold text-teal-600">
              <span className="font-semibold text-gray-700">Amount:</span> LKR {paymentAmount?.toFixed(2) || 'Calculating...'}
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium text-gray-700 mb-2">Special Instructions</h4>
          <p className="bg-white p-4 rounded-lg shadow-sm">
            {formData.specialInstructions || 'None'}
          </p>
        </div>
      </div>
      
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={() => setShowPreview(false)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
        >
          <FiArrowLeft className="mr-2" />
          Back to Edit
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200 ${
            isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              {formData.paymentMethod === 'Online' ? 'Proceed to Payment' : 'Confirm & Submit'}
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="min-h-screen relative bg-gradient-to-b from-teal-50 to-white">
        <div className="absolute top-0 left-0 w-full rotate-180">
          <svg
            className="w-full h-auto"
            viewBox="0 0 1440 320"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="topToBottomGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#1f818c" />
                <stop offset="100%" stopColor="white" />
              </linearGradient>
            </defs>
            <path
              fill="url(#topToBottomGradient)"
              fillOpacity="1"
              d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,106.7C672,117,768,171,864,181.3C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto relative px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Add New Parcel
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Fill in the details below to register your parcel for delivery
            </p>
          </div>

          <div className="mb-30">
            <div className="flex justify-between items-center">
              {['receiver', 'parcel', 'location', 'payment'].map((step) => (
                <button
                  key={step}
                  onClick={() => setActiveSection(step)}
                  className={`flex flex-col items-center ${activeSection === step ? 'text-teal-600' : 'text-gray-500'}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-8 
                  ${activeSection === step ? 'bg-teal-100 border-2 border-teal-600' : 'bg-gray-100 border-2 border-gray-300'}`}
                  >
                    {step === 'receiver' && <FiUser className="text-lg" />}
                    {step === 'parcel' && <FiPackage className="text-lg" />}
                    {step === 'location' && <FiMapPin className="text-lg" />}
                    {step === 'payment' && <FiCreditCard className="text-lg" />}
                  </div>
                  <span className="text-xs font-medium capitalize">{step}</span>
                </button>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
              <div
                className="bg-teal-600 h-2.5 rounded-full transition-all duration-500"
                style={{
                  width:
                    activeSection === 'receiver'
                      ? '25%'
                      : activeSection === 'parcel'
                        ? '50%'
                        : activeSection === 'location'
                          ? '75%'
                          : '100%',
                }}
              ></div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-xl rounded-xl overflow-hidden border border-teal-100"
          >
            <div className="p-6 space-y-8">
              {/* Receiver Details Section */}
              {activeSection === 'receiver' && (
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <FiUser className="mr-2 text-teal-600" />
                    Receiver Details
                  </h2>
                  <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="receiverFullName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Full Name
                      </label>
                      <div className="mt-1 relative">
                        <input
                          type="text"
                          id="receiverFullName"
                          name="receiverFullName"
                          value={formData.receiverFullName}
                          onChange={handleChange}
                          required
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border pl-10 transition-all duration-200"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="receiverContactNumber" className="block text-sm font-medium text-gray-700">
                        Contact Number
                      </label>
                      <div className="mt-1 relative">
                        <input
                          type="tel"
                          id="receiverContactNumber"
                          name="receiverContactNumber"
                          value={formData.receiverContactNumber}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                          className={`block w-full rounded-lg shadow-sm sm:text-sm py-2 px-3 border pl-10 transition-all duration-200 ${
                            validationErrors.receiverContactNumber.error
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'
                          }`}
                          placeholder="07XXXXXXXX or 0XX XXXXXXX"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiPhone className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      {validationErrors.receiverContactNumber.error && (
                        <p className={`mt-1 text-sm ${
                          validationErrors.receiverContactNumber.isTyping ? 'text-gray-500' : 'text-red-600'
                        }`}>
                          {validationErrors.receiverContactNumber.error}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="receiverEmail" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <div className="mt-1 relative">
                        <input
                          type="email"
                          id="receiverEmail"
                          name="receiverEmail"
                          value={formData.receiverEmail}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`block w-full rounded-lg shadow-sm sm:text-sm py-2 px-3 border pl-10 transition-all duration-200 ${
                            validationErrors.receiverEmail.error
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'
                          }`}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      {validationErrors.receiverEmail.error && (
                        <p className={`mt-1 text-sm ${
                          validationErrors.receiverEmail.isTyping ? 'text-gray-500' : 'text-red-600'
                        }`}>
                          {validationErrors.receiverEmail.error}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextSection}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                    >
                      Next: Parcel Details
                    </button>
                  </div>
                </div>
              )}

              {/* Parcel Details Section */}
              {activeSection === 'parcel' && (
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <FiPackage className="mr-2 text-teal-600" />
                    Parcel Details
                  </h2>
                  <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="itemType"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Item Type
                      </label>
                      <div className="mt-1">
                        <select
                          id="itemType"
                          name="itemType"
                          value={formData.itemType}
                          onChange={handleChange}
                          required
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border transition-all duration-200"
                        >
                          <option value="">Select item type</option>
                          {itemTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="itemSize"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Item Size
                      </label>
                      <div className="mt-1">
                        <select
                          id="itemSize"
                          name="itemSize"
                          value={formData.itemSize}
                          onChange={handleChange}
                          required
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border transition-all duration-200"
                        >
                          <option value="">Select item size</option>
                          <option value="Small">Small (0-2kg)</option>
                          <option value="Medium">Medium (2kg-5kg)</option>
                          <option value="Large">Large (5kg-10kg)</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="submittingType"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Submitting Type
                      </label>
                      <div className="mt-1">
                        <select
                          id="submittingType"
                          name="submittingType"
                          value={formData.submittingType}
                          onChange={handleChange}
                          required
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border transition-all duration-200"
                        >
                          <option value="">Select submitting type</option>
                          <option value="Pickup">Pickup</option>
                          <option value="Drop-off">Drop-off (Branch)</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="receivingType"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Receiving Type
                      </label>
                      <div className="mt-1">
                        <select
                          id="receivingType"
                          name="receivingType"
                          value={formData.receivingType}
                          onChange={handleChange}
                          required
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border transition-all duration-200"
                        >
                          <option value="">Select receiving type</option>
                          <option value="doorstep">Doorstep Delivery</option>
                          <option value="collection_center">
                            Collection Center
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveSection('receiver')}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNextSection}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                    >
                      Next: Location Details
                    </button>
                  </div>
                </div>
              )}

              {/* Location Details Section */}
              {activeSection === 'location' && (
                <>
                  {/* Conditional Pickup Information */}
                  {showPickupFields && (
                    <div className="border-b border-gray-200 pb-6">
                      <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        <FiMapPin className="mr-2 text-teal-600" />
                        Pickup Information
                      </h2>
                      <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label
                            htmlFor="pickupDate"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Pickup Date
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiCalendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="date"
                              id="pickupDate"
                              name="pickupDate"
                              value={formData.pickupDate}
                              onChange={handleChange}
                              required={showPickupFields}
                              min={new Date().toISOString().split('T')[0]}
                              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 pl-10 border transition-all duration-200"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label
                            htmlFor="pickupTime"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Pickup Time
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiClock className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                              id="pickupTime"
                              name="pickupTime"
                              value={formData.pickupTime}
                              onChange={handleChange}
                              required={showPickupFields}
                              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 pl-10 border transition-all duration-200"
                            >
                              <option value="">Select time slot</option>
                              <option value="08:00 - 12:00">Morning (08:00 - 12:00)</option>
                              <option value="13:00 - 17:00">Afternoon (13:00 - 17:00)</option>
                            </select>
                          </div>
                        </div>

                        <div className="sm:col-span-6">
                          <label
                            htmlFor="pickupAddress"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Pickup Address
                          </label>
                          <div className="mt-1 relative">
                            <input
                              type="text"
                              id="pickupAddress"
                              name="pickupAddress"
                              value={formData.pickupAddress}
                              onChange={handleChange}
                              required={showPickupFields}
                              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border pl-10 transition-all duration-200"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiHome className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label
                            htmlFor="pickupCity"
                            className="block text-sm font-medium text-gray-700"
                          >
                            City
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="pickupCity"
                              name="pickupCity"
                              value={formData.pickupCity}
                              onChange={handleChange}
                              required={showPickupFields}
                              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border transition-all duration-200"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label
                            htmlFor="pickupDistrict"
                            className="block text-sm font-medium text-gray-700"
                          >
                            District
                          </label>
                          <div className="mt-1">
                            {renderBranchDropdown(
                              'fromBranch',
                              formData.fromBranch,
                              'branch',
                              true
                            )}
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label
                            htmlFor="pickupProvince"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Province
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="pickupProvince"
                              name="pickupProvince"
                              value={formData.pickupProvince}
                              onChange={handleChange}
                              required={showPickupFields}
                              readOnly
                              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border transition-all duration-200"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Conditional Delivery Information */}
                  {showDeliveryFields && (
                    <div className="border-b border-gray-200 pb-6">
                      <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        <FiHome className="mr-2 text-teal-600" />
                        Delivery Information
                      </h2>
                      <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                          <label
                            htmlFor="deliveryAddress"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Delivery Address
                          </label>
                          <div className="mt-1 relative">
                            <input
                              type="text"
                              id="deliveryAddress"
                              name="deliveryAddress"
                              value={formData.deliveryAddress}
                              onChange={handleChange}
                              required={showDeliveryFields}
                              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border pl-10 transition-all duration-200"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiMapPin className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label
                            htmlFor="deliveryCity"
                            className="block text-sm font-medium text-gray-700"
                          >
                            City
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="deliveryCity"
                              name="deliveryCity"
                              value={formData.deliveryCity}
                              onChange={handleChange}
                              required={showDeliveryFields}
                              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border transition-all duration-200"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label
                            htmlFor="deliveryDistrict"
                            className="block text-sm font-medium text-gray-700"
                          >
                            District
                          </label>
                          <div className="mt-1">
                            {renderBranchDropdown(
                              'toBranch',
                              formData.toBranch,
                              'branch',
                              true
                            )}
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label
                            htmlFor="deliveryProvince"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Province
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="deliveryProvince"
                              name="deliveryProvince"
                              value={formData.deliveryProvince}
                              onChange={handleChange}
                              required={showDeliveryFields}
                              readOnly
                              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border transition-all duration-200"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label
                            htmlFor="postalCode"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Postal Code
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="postalCode"
                              name="postalCode"
                              value={formData.postalCode}
                              onChange={handleChange}
                              required={showDeliveryFields}
                              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border transition-all duration-200"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Conditional Branch Information */}
                  {(showFromBranchField || showToBranchField) && (
                    <div className="border-b border-gray-200 pb-6">
                      <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        <FiTruck className="mr-2 text-teal-600" />
                        Branch Information
                      </h2>
                      <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        {showFromBranchField && (
                          <div className="sm:col-span-3">
                            <label
                              htmlFor="fromBranch"
                              className="block text-sm font-medium text-gray-700"
                            >
                              From Branch
                            </label>
                            {renderBranchDropdown(
                              'fromBranch',
                              formData.fromBranch,
                              'branch',
                              true
                            )}
                          </div>
                        )}

                        {showToBranchField && (
                          <div className="sm:col-span-3">
                            <label
                              htmlFor="toBranch"
                              className="block text-sm font-medium text-gray-700"
                            >
                              To Branch
                            </label>
                            {renderBranchDropdown(
                              'toBranch',
                              formData.toBranch,
                              'branch',
                              true
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveSection('parcel')}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNextSection}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                    >
                      Next: Payment & Shipment
                    </button>
                  </div>
                </>
              )}

              {/* Payment & Shipment Section */}
              {activeSection === 'payment' && (
                <>
                  {!showPreview ? (
                    <div>
                      <div className="border-b border-gray-200 pb-6">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                          <FiTruck className="mr-2 text-teal-600" />
                          Shipment Details
                        </h2>
                        <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-3">
                            <label
                              htmlFor="shipmentMethod"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Shipment Method
                            </label>
                            <div className="mt-1">
                              <select
                                id="shipmentMethod"
                                name="shipmentMethod"
                                value={formData.shipmentMethod}
                                onChange={handleChange}
                                required
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border transition-all duration-200"
                              >
                                <option value="">Select shipment method</option>
                                {shipmentMethods.map((method) => (
                                  <option key={method} value={method}>
                                    {method}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="sm:col-span-6">
                            <label
                              htmlFor="specialInstructions"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Special Instructions (Optional)
                            </label>
                            <div className="mt-1">
                              <textarea
                                id="specialInstructions"
                                name="specialInstructions"
                                rows="3"
                                value={formData.specialInstructions}
                                onChange={handleChange}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border transition-all duration-200"
                                placeholder="Any special handling instructions..."
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="border-b border-gray-200 pb-6">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                          <FiCreditCard className="mr-2 text-teal-600" />
                          Payment Method
                        </h2>
                        <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-6">
                            <div className="grid grid-cols-2 gap-4">
                              {paymentMethods.map((method) => (
                                <div key={method} className="relative">
                                  <input
                                    type="radio"
                                    id={`payment-${method}`}
                                    name="paymentMethod"
                                    value={method}
                                    checked={formData.paymentMethod === method}
                                    onChange={handleChange}
                                    required
                                    className="sr-only"
                                  />
                                  <label
                                    htmlFor={`payment-${method}`}
                                    className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                                      formData.paymentMethod === method
                                        ? 'border-teal-500 bg-teal-50 shadow-md'
                                        : 'border-gray-300 hover:border-teal-300'
                                    }`}
                                  >
                                    <div className="flex items-center">
                                      {method === 'Online' ? (
                                        <FiCreditCard className="h-5 w-5 text-teal-600 mr-2" />
                                      ) : (
                                        <FiDollarSign className="h-5 w-5 text-teal-600 mr-2" />
                                      )}
                                      <span className="text-sm font-medium text-gray-700">
                                        {method}
                                      </span>
                                    </div>
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-between">
                        <button
                          type="button"
                          onClick={() => setActiveSection('location')}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                        >
                          <FiSave className="mr-2" />
                          Review & Calculate Payment
                        </button>
                      </div>
                    </div>
                  ) : (
                    renderPreview()
                  )}
                </>
              )}
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddParcel;

