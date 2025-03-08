// import FormField from "../../components/admin/FormField"
// import { useState } from "react"
// import axios from 'axios'

// const UserRegistrationForm = () => {


//     const [formData, setFormData] = useState({
//         name: '',
//         nic: '',
//         password: '',
//         email: '',
//         contactNo: '',
//     });

//     // Handle input changes
//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });

//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post('http://localhost:8000/admin/register', formData, { withCredentials: true });
//             alert(response.data.message); // Show success message
//             window.location.reload();

//         } catch (error) {
//             console.error('Error registering admin:', error);
//             alert('Registration failed. Please try again.', error);
//         }
//     };
//     return (
//         <div className=" p-8 w-full  bg-white rounded-2xl border border-gray-300 shadow-lg">
//             <h1 className="text-xl font-semibold">User Registration</h1>
//             <form onSubmit={handleSubmit} className="m-8">
//                 <FormField label="Full Name :" type="text" name="name" value={formData.name} onChange={handleChange} />
//                 <FormField label="NIC :" type="text" name="nic" value={formData.nic} onChange={handleChange} />
//                 <FormField label="Password :" type="password" name="password" value={formData.password} onChange={handleChange} />
//                 <FormField label="Email :" type="email" name="email" value={formData.email} onChange={handleChange} />
//                 <FormField label="Contact No :" type="text" name="contactNo" value={formData.contactNo} onChange={handleChange} />
//                 <FormField label="User Type : "  type="select" name="userType" value={formData.userType} onChange={handleChange} placeholder="Select user" options={[ { value: "admin", label: "Admin" },  { value: "driver", label: "Driver" },  { value: "staff", label: "Staff" } ]}  />


//                 <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
//                     Register
//                 </button>
//             </form>
//         </div>
//     )
// }

// export default UserRegistrationForm
// import FormField from "../../components/admin/FormField";
// import { useState, useEffect } from "react";
// import axios from "axios";

// const AdminRegistrationForm = () => {
//     const [formData, setFormData] = useState({ name: "", nic: "", password: "", email: "", contactNo: "" });

//     const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post("http://localhost:8000/admin/register", formData, { withCredentials: true });
//             alert(response.data.message);
//             window.location.reload();
//         } catch (error) {
//             console.error("Error registering admin:", error);
//             alert("Registration failed. Please try again.");
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="p-8 w-full bg-white rounded-2xl border border-gray-300 shadow-lg">
//             <h1 className="text-xl font-semibold mb-8">Admin Registration</h1>
//             <FormField label="Full Name :" type="text" name="name" value={formData.name} onChange={handleChange} />
//             <FormField label="NIC :" type="text" name="nic" value={formData.nic} onChange={handleChange} />
//             <FormField label="Password :" type="password" name="password" value={formData.password} onChange={handleChange} />
//             <FormField label="Email :" type="email" name="email" value={formData.email} onChange={handleChange} />
//             <FormField label="Contact No :" type="text" name="contactNo" value={formData.contactNo} onChange={handleChange} />
//             <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Register</button>
//         </form>
//     );
// };

// const DriverRegistrationForm = () => {
//     const [formData, setFormData] = useState({ name: "", nic: "", password: "", email: "", contactNo: "", licenseId: "", branchId: "" });
//     const [branches, setBranches] = useState([]);

//     useEffect(() => {
//         const fetchBranches = async () => {
//             try {
//                 const response = await axios.get("http://localhost:8000/branches");
//                 setBranches(response.data.branches);
//             } catch (error) {
//                 console.error("Error fetching branches:", error);
//             }
//         };
//         fetchBranches();
//     }, []);

//     const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post("http://localhost:8000/admin/driver/register", formData, { withCredentials: true });
//             alert(response.data.message);
//             window.location.reload();
//         } catch (error) {
//             console.error("Error registering driver:", error);
//             alert("Registration failed. Please try again.");
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="p-8 w-full bg-white rounded-2xl border border-gray-300 shadow-lg">
//             <h1 className="text-xl font-semibold mb-8">Driver Registration</h1>
//             <FormField label="Full Name :" type="text" name="name" value={formData.name} onChange={handleChange} />
//             <FormField label="NIC :" type="text" name="nic" value={formData.nic} onChange={handleChange} />
//             <FormField label="Password :" type="password" name="password" value={formData.password} onChange={handleChange} />
//             <FormField label="Email :" type="email" name="email" value={formData.email} onChange={handleChange} />
//             <FormField label="Contact No :" type="text" name="contactNo" value={formData.contactNo} onChange={handleChange} />
//             <FormField label="License ID :" type="text" name="licenseId" value={formData.licenseId} onChange={handleChange} />
//             <FormField label="Branch :" type="select" name="branchId" value={formData.branchId} onChange={handleChange} options={branches.map((branch) => ({ value: branch._id, label: branch.location }))} />
//             <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Register</button>
//         </form>
//     );
// };

// const StaffRegistrationForm = () => {
//     const [formData, setFormData] = useState({ name: "", nic: "", password: "", email: "", contactNo: "", branchId: "" });
//     const [branches, setBranches] = useState([]);

//     useEffect(() => {
//         const fetchBranches = async () => {
//             try {
//                 const response = await axios.get("http://localhost:8000/branches");
//                 setBranches(response.data.branches);
//             } catch (error) {
//                 console.error("Error fetching branches:", error);
//             }
//         };
//         fetchBranches();
//     }, []);

//     const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post("http://localhost:8000/admin/staff/register", formData, { withCredentials: true });
//             alert(response.data.message);
//             window.location.reload();
//         } catch (error) {
//             console.error("Error registering staff:", error);
//             alert("Registration failed. Please try again.");
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="p-8 w-full bg-white rounded-2xl border border-gray-300 shadow-lg">
//             <h1 className="text-xl font-semibold mb-8">Staff Registration</h1>
//             <FormField label="Full Name :" type="text" name="name" value={formData.name} onChange={handleChange} />
//             <FormField label="NIC :" type="text" name="nic" value={formData.nic} onChange={handleChange} />
//             <FormField label="Password :" type="password" name="password" value={formData.password} onChange={handleChange} />
//             <FormField label="Email :" type="email" name="email" value={formData.email} onChange={handleChange} />
//             <FormField label="Contact No :" type="text" name="contactNo" value={formData.contactNo} onChange={handleChange} />
//             <FormField label="Branch :" type="select" name="branchId" value={formData.branchId} onChange={handleChange} options={branches.map((branch) => ({ value: branch._id, label: branch.location }))} />
//             <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Register</button>
//         </form>
//     );
// };

// export { AdminRegistrationForm, DriverRegistrationForm, StaffRegistrationForm };

import FormField from "../../components/admin/FormField";
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
        branchId: "67c41df8c2ca1289195def43",
    });

    const [branches, setBranches] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/branches").then((response) => {
            setBranches(response.data.branches);
        }).catch((error) => {
            console.error("Error fetching branches:", error);
        });
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let apiURL = '';
        if(formData.userType==="driver" || formData.userType==="staff"){
            apiURL = `http://localhost:8000/admin/${formData.userType}/register`;
        }
        else{
            apiURL = `http://localhost:8000/${formData.userType}/register`;
        }
        try {
            const response = await axios.post(apiURL, formData, { withCredentials: true });
            alert(response.data.message);
            window.location.reload();
        } catch (error) {
            alert("Registration failed. Please try again.",error);
        }
    };

    return (
        <div className="p-8 w-full bg-white rounded-2xl border border-gray-300 shadow-lg">
            <h1 className="text-xl font-semibold">User Registration</h1>
            <form id="myForm" onSubmit={handleSubmit} className="m-8">
                <FormField label="Full Name:" type="text" name="name" value={formData.name} onChange={handleChange} />
                <FormField label="NIC:" type="text" name="nic" value={formData.nic} onChange={handleChange} />
                <FormField label="Password:" type="password" name="password" value={formData.password} onChange={handleChange} />
                <FormField label="Email:" type="email" name="email" value={formData.email} onChange={handleChange} />
                <FormField label="Contact No:" type="text" name="contactNo" value={formData.contactNo} onChange={handleChange} />
                <FormField label="User Type:" type="select" name="userType" value={formData.userType} onChange={handleChange} options={[{ value: "admin", label: "Admin" }, { value: "driver", label: "Driver" }, { value: "staff", label: "Staff" }]} />

                {/* Use if statements to conditionally render the additional fields */}
                {formData.userType === "driver" ? (
                    <>
                        <FormField label="License ID:" type="text" name="licenseId" value={formData.licenseId} onChange={handleChange} />
                        {branches.length > 0 && (
                            <FormField label="Branch:" type="select" name="branchId" value={formData.branchId} onChange={handleChange} options={branches.map((branch) => ({value:"",label:"Select branch"},{ value: branch._id, label: branch.location }))} />
                        )}
                    </>
                ) : null}

                {formData.userType === "staff" ? (
                    branches.length > 0 && (
                        <FormField label="Branch:" type="select" name="branchId" value={formData.branchId} onChange={handleChange} options={branches.map((branch) => ({ value: branch._id, label: branch.location }))} />
                    )
                ) : null}

                <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                    Register
                </button>
            </form>
        </div>
    );
};

export default UserRegistrationForm;
