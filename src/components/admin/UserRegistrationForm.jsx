

// import FormField from "./FormField";
// import { useState, useEffect } from "react";
// import axios from "axios";

// const UserRegistrationForm = () => {
//     const [formData, setFormData] = useState({
//         name: "",
//         nic: "",
//         password: "",
//         email: "",
//         contactNo: "",
//         userType: "",
//         licenseId: "",
//         branchId: "67c41df8c2ca1289195def43",
//     });

//     const [branches, setBranches] = useState([]);

//     useEffect(() => {
//         axios.get("http://localhost:8000/branches").then((response) => {
//             setBranches(response.data.branches);
//         }).catch((error) => {
//             console.error("Error fetching branches:", error);
//         });
//     }, []);

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         let apiURL = `http://localhost:8000/admin/${formData.userType}/register`;
//         // if(formData.userType==="driver" || formData.userType==="staff"){
//         //     apiURL = `http://localhost:8000/admin/${formData.userType}/register`;
//         // }
//         // else{
//         //     apiURL = `http://localhost:8000/admin/${formData.userType}/register`;
//         // }
//         try {
//             const response = await axios.post(apiURL, formData, { withCredentials: true });
//             alert(response.data.message);
//             window.location.reload();
//         } catch (error) {
//             alert("Registration failed. Please try again.",error);
//         }
//     };

//     return (
//         <div className="p-8 w-full bg-white rounded-2xl border border-gray-300 shadow-lg">
//             <h1 className="text-xl font-semibold">User Registration</h1>
//             <form id="myForm" onSubmit={handleSubmit} className="m-8">
//                 <FormField label="Full Name:" type="text" name="name" value={formData.name} onChange={handleChange} />
//                 <FormField label="NIC:" type="text" name="nic" value={formData.nic} onChange={handleChange} />
//                 <FormField label="Password:" type="password" name="password" value={formData.password} onChange={handleChange} />
//                 <FormField label="Email:" type="email" name="email" value={formData.email} onChange={handleChange} />
//                 <FormField label="Contact No:" type="text" name="contactNo" value={formData.contactNo} onChange={handleChange} />
//                 <FormField label="User Type:" type="select" name="userType" value={formData.userType} onChange={handleChange} options={[{ value: "admin", label: "Admin" }, { value: "driver", label: "Driver" }, { value: "staff", label: "Staff" }]} />

//                 {/* Use if statements to conditionally render the additional fields */}
//                 {formData.userType === "driver" ? (
//                     <>
//                         <FormField label="License ID:" type="text" name="licenseId" value={formData.licenseId} onChange={handleChange} />
//                         {branches.length > 0 && (
//                             <FormField label="Branch:" type="select" name="branchId" value={formData.branchId} onChange={handleChange} options={branches.map((branch) => ({value:"",label:"Select branch"},{ value: branch._id, label: branch.location }))} />
//                         )}
//                     </>
//                 ) : null}

//                 {formData.userType === "staff" ? (
//                     branches.length > 0 && (
//                         <FormField label="Branch:" type="select" name="branchId" value={formData.branchId} onChange={handleChange} options={branches.map((branch) => ({ value: branch._id, label: branch.location }))} />
//                     )
//                 ) : null}

//                 <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
//                     Register
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default UserRegistrationForm;


// import FormField from "./FormField";
// import { useState, useEffect } from "react";
// import axios from "axios";

// const UserRegistrationForm = () => {
//     const [formData, setFormData] = useState({
//         name: "",
//         nic: "",
//         password: "",
//         email: "",
//         contactNo: "",
//         userType: "",
//         licenseId: "",
//         branchId: "67c41df8c2ca1289195def43",
//     });

//     const [branches, setBranches] = useState([]);

//     useEffect(() => {
//         axios.get("http://localhost:8000/branches").then((response) => {
//             setBranches(response.data.branches);
//         }).catch((error) => {
//             console.error("Error fetching branches:", error);
//         });
//     }, []);

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         let apiURL = `http://localhost:8000/admin/${formData.userType}/register`;
//         // if(formData.userType==="driver" || formData.userType==="staff"){
//         //     apiURL = `http://localhost:8000/admin/${formData.userType}/register`;
//         // }
//         // else{
//         //     apiURL = `http://localhost:8000/admin/${formData.userType}/register`;
//         // }
//         try {
//             const response = await axios.post(apiURL, formData, { withCredentials: true });
//             alert(response.data.message);
//             window.location.reload();
//         } catch (error) {
//             alert("Registration failed. Please try again.",error);
//         }
//     };

//     return (
//         // <div className="p-8 w-full bg-white rounded-2xl border border-gray-300 shadow-lg">
//         //     <h1 className="text-xl font-semibold">User Registration</h1>
//         //     <form id="myForm" onSubmit={handleSubmit} className="m-8">
//         //         <FormField label="Full Name:" type="text" name="name" value={formData.name} onChange={handleChange} />
//         //         <FormField label="NIC:" type="text" name="nic" value={formData.nic} onChange={handleChange} />
//         //         <FormField label="Password:" type="password" name="password" value={formData.password} onChange={handleChange} />
//         //         <FormField label="Email:" type="email" name="email" value={formData.email} onChange={handleChange} />
//         //         <FormField label="Contact No:" type="text" name="contactNo" value={formData.contactNo} onChange={handleChange} />
//         //         <FormField label="User Type:" type="select" name="userType" value={formData.userType} onChange={handleChange} options={[{ value: "admin", label: "Admin" }, { value: "driver", label: "Driver" }, { value: "staff", label: "Staff" }]} />

//         //         {/* Use if statements to conditionally render the additional fields */}
//         //         {formData.userType === "driver" ? (
//         //             <>
//         //                 <FormField label="License ID:" type="text" name="licenseId" value={formData.licenseId} onChange={handleChange} />
//         //                 {branches.length > 0 && (
//         //                     <FormField label="Branch:" type="select" name="branchId" value={formData.branchId} onChange={handleChange} options={branches.map((branch) => ({value:"",label:"Select branch"},{ value: branch._id, label: branch.location }))} />
//         //                 )}
//         //             </>
//         //         ) : null}

//         //         {formData.userType === "staff" ? (
//         //             branches.length > 0 && (
//         //                 <FormField label="Branch:" type="select" name="branchId" value={formData.branchId} onChange={handleChange} options={branches.map((branch) => ({ value: branch._id, label: branch.location }))} />
//         //             )
//         //         ) : null}

//         //         <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
//         //             Register
//         //         </button>
//         //     </form>
//         // </div>

//         <div className="p-8 w-full bg-white rounded-xl border border-gray-200 shadow-sm">
//             <h1 className="text-2xl font-semibold text-gray-900 mb-6">User Registration</h1>
//             <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <FormField 
//                         label="Full Name" 
//                         type="text" 
//                         name="name" 
//                         value={formData.name}
//                         onChange={handleChange}
//                         required
//                     />

//                     <FormField 
//   label="NIC Number" 
//   type="text" 
//   name="nic" 
//   value={formData.nic}
//   onChange={handleChange}
//   pattern="^(?:\d{9}[vVxX]|\d{12})$"
//   title="Please enter a valid NIC number (Old format: 123456789V or New format: 200203601188)"
//   placeholder="Ex: 200203601188 or 987654321V"
//   required
// />

//                     <FormField 
//                         label="Email Address" 
//                         type="email" 
//                         name="email" 
//                         value={formData.email}
//                         onChange={handleChange}
//                         placeholder="name@company.com"
//                         required
//                     />

//                     <FormField 
//                         label="Contact Number" 
//                         type="tel" 
//                         name="contactNo" 
//                         value={formData.contactNo}
//                         onChange={handleChange}
//                         pattern="[0-9]{10}"
//                         placeholder="077 123 4567"
//                     />

//                     <FormField 
//                         label="Password" 
//                         type="password" 
//                         name="password" 
//                         value={formData.password}
//                         onChange={handleChange}
//                         required
//                     />

//                     <FormField 
//                         label="User Type" 
//                         type="select" 
//                         name="userType" 
//                         value={formData.userType}
//                         onChange={handleChange}
//                         options={[
//                             { value: "", label: "Select User Type" },
//                             { value: "admin", label: "Administrator" },
//                             { value: "driver", label: "Driver" },
//                             { value: "staff", label: "Staff Member" }
//                         ]}
//                         required
//                     />
//                 </div>

//                 {/* Conditional Fields */}
//                 <div className="space-y-6">
//                     {formData.userType === "driver" && (
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <FormField 
//                                 label="Driver's License ID" 
//                                 type="text" 
//                                 name="licenseId" 
//                                 value={formData.licenseId}
//                                 onChange={handleChange}
//                                 required
//                             />

//                             {branches.length > 0 && (
//                                 <FormField 
//                                     label="Assigned Branch" 
//                                     type="select" 
//                                     name="branchId" 
//                                     value={formData.branchId}
//                                     onChange={handleChange}
//                                     options={[
//                                         { value: "", label: "Select Branch" },
//                                         ...branches.map(branch => ({
//                                             value: branch._id,
//                                             label: branch.location
//                                         }))
//                                     ]}
//                                     required
//                                 />
//                             )}
//                         </div>
//                     )}

//                     {formData.userType === "staff" && branches.length > 0 && (
//                         <FormField 
//                             label="Assigned Branch" 
//                             type="select" 
//                             name="branchId" 
//                             value={formData.branchId}
//                             onChange={handleChange}
//                             options={[
//                                 { value: "", label: "Select Branch" },
//                                 ...branches.map(branch => ({
//                                     value: branch._id,
//                                     label: branch.location
//                                 }))
//                             ]}
//                             required
//                         />
//                     )}
//                 </div>

//                 <button 
//                     type="submit" 
//                     className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
//                 >
//                     Register User
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default UserRegistrationForm;


import FormField from "./FormField";
import { useState, useEffect } from "react";
import axios from "axios";

const UserRegistrationForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        nic: "",
        password: "",
        email: "",
        contactNo: "",
        userType: "",
        licenseId: "",
        branchId: "",
    });

    const [branches, setBranches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await axios.get("http://localhost:8000/branches");
                setBranches(response.data.branches);
            } catch (error) {
                console.error("Error fetching branches:", error);
                alert("Failed to load branch data. Please refresh the page.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBranches();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let apiURL="";
            if (formData.userType === "driver" || formData.userType === "staff") {
                apiURL = `http://localhost:8000/admin/${formData.userType}/register`;
            }
            else {
                apiURL = `http://localhost:8000/${formData.userType}/register`;
            }
            const response = await axios.post(
                apiURL,
                formData,
                { withCredentials: true }
            );

            alert(response.data.message);
            window.location.reload();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const SkeletonLoader = () => (
        <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-10 bg-gray-200 rounded-lg"></div>
        </div>
    );

    return (
        <div className="p-8 w-full bg-white rounded-xl border border-gray-200 shadow-sm">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">User Registration</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        label="Full Name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                    />

                    <FormField
                        label="NIC Number"
                        type="text"
                        name="nic"
                        value={formData.nic}
                        onChange={handleChange}
                        pattern="^(?:\d{9}[vVxX]|\d{12})$"
                        title="Please enter a valid NIC number (Old format: 123456789V or New format: 200203601188)"
                        placeholder="Ex: 200203601188 or 987654321V"
                        required
                        disabled={isSubmitting}
                    />

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

                    <FormField
                        label="Contact Number"
                        type="tel"
                        name="contactNo"
                        value={formData.contactNo}
                        onChange={handleChange}
                        pattern="[0-9]{10}"
                        placeholder="077 123 4567"
                        disabled={isSubmitting}
                    />

                    <FormField
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                    />

                    {isLoading ? (
                        <SkeletonLoader />
                    ) : (
                        <FormField
                            label="User Type"
                            type="select"
                            name="userType"
                            value={formData.userType}
                            onChange={handleChange}
                            options={[
                                { value: "", label: "Select User Type" },
                                { value: "admin", label: "Administrator" },
                                { value: "driver", label: "Driver" },
                                { value: "staff", label: "Staff Member" }
                            ]}
                            required
                            disabled={isSubmitting}
                        />
                    )}
                </div>

                {/* Conditional Fields */}
                <div className="space-y-6">
                    {formData.userType === "driver" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                label="Driver's License ID"
                                type="text"
                                name="licenseId"
                                value={formData.licenseId}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                            />

                            {isLoading ? (
                                <SkeletonLoader />
                            ) : branches.length > 0 ? (
                                <FormField
                                    label="Assigned Branch"
                                    type="select"
                                    name="branchId"
                                    value={formData.branchId}
                                    onChange={handleChange}
                                    options={[
                                        { value: "", label: "Select Branch" },
                                        ...branches.map(branch => ({
                                            value: branch._id,
                                            label: branch.location
                                        }))
                                    ]}
                                    required
                                    disabled={isSubmitting}
                                />
                            ) : null}
                        </div>
                    )}

                    {formData.userType === "staff" && (
                        isLoading ? (
                            <SkeletonLoader />
                        ) : branches.length > 0 ? (
                            <FormField
                                label="Assigned Branch"
                                type="select"
                                name="branchId"
                                value={formData.branchId}
                                onChange={handleChange}
                                options={[
                                    { value: "", label: "Select Branch" },
                                    ...branches.map(branch => ({
                                        value: branch._id,
                                        label: branch.location
                                    }))
                                ]}
                                required
                                disabled={isSubmitting}
                            />
                        ) : null
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting || isLoading}
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Registering...
                        </div>
                    ) : (
                        "Register User"
                    )}
                </button>
            </form>
        </div>
    );
};

export default UserRegistrationForm;