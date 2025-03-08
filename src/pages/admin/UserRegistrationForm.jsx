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
        licenseId: "", // Only for driver
        branchId: "", // For driver and staff
    });

    const [branches, setBranches] = useState([]); // Store branch options

    // Fetch branches from the database
    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await axios.get("http://localhost:8000/branches");
                const branches = response.data.branches;
                console.log("Branches fetched successfully",branches);
                setBranches(branches); // Assuming response.data is an array of branches

            } catch (error) {
                console.error("Error fetching branches:", error);
            }
        };
        fetchBranches();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        console.log("Changed field:", e.target.name, "Value:", e.target.value);
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        let apiURL='';
        console.log("Hello",formData);
        if(formData.userType==="admin"){
            apiURL="http://localhost:8000/admin/register";
            
        }
        try {
            const response = await axios.post("http://localhost:8000/admin/register", formData, { withCredentials: true } );
            alert(response.data.message); // Show success message
            window.location.reload();
        } catch (error) {
            console.error("Error registering user:", error);
            alert("Registration failed. Please try again.");
        }
    };

    return (
        <div className="p-8 w-full bg-white rounded-2xl border border-gray-300 shadow-lg">
            <h1 className="text-xl font-semibold">User Registration</h1>
            <form onSubmit={handleSubmit} className="m-8">
                <FormField label="Full Name :" type="text" name="name" value={formData.name} onChange={handleChange} />
                <FormField label="NIC :" type="text" name="nic" value={formData.nic} onChange={handleChange} />
                <FormField label="Password :" type="password" name="password" value={formData.password} onChange={handleChange} />
                <FormField label="Email :" type="email" name="email" value={formData.email} onChange={handleChange} />
                <FormField label="Contact No :" type="text" name="contactNo" value={formData.contactNo} onChange={handleChange} />
                <FormField label="User Type :" type="select" name="userType" value={formData.userType} onChange={handleChange}  options={[{ value: "admin", label: "Admin" }, { value: "driver", label: "Driver" }, { value: "staff", label: "Staff" },]} />

                



                {/* Conditionally render extra fields for drivers */}
                {formData.userType === "driver" && (
                    <>
                        <FormField
                            label="License ID :"
                            type="text"
                            name="licenseId"
                            value={formData.licenseId}
                            onChange={handleChange}
                        />
                        {Array.isArray(branches) && branches.length > 0 ? (
                            <FormField label="Branch :" type="select" name="branchId" value={formData.branchId} onChange={handleChange} placeholder="Select branch" options={branches.map((branch) => ({ value: branch._id, label: branch.location, }))} />
                        ) : (
                            <p>Loading branches...</p>
                        )}
                    </>
                )}

                {/* Conditionally render extra field for staff */}
                {formData.userType === "staff" && (
                  <>
                  {Array.isArray(branches) && branches.length > 0 ? (
                    <FormField label="Branch :" type="select" name="branchId" value={formData.branchId} onChange={handleChange} placeholder="Select branch" options={branches.map((branch) => ({ value: branch._id, label: branch.location, }))} />
                ) : (
                    <p>Loading branches...</p>
                )}</>

                )}

                <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">  Register </button>
            </form>
        </div>
    );
};

export default UserRegistrationForm;
