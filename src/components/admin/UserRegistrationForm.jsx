import FormField from "./FormField";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'sonner'

const UserRegistrationForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        nic: "",
        password: "paxal123",
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

            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            try {
                const response = await axios.get(`${backendUrl}/admin/branch/all`, { withCredentials: true, timeout: 10000 });
                setBranches(response.data.branches);

            } catch (error) {
                const errorMessage = error.response?.data?.message || error.message;
                console.error("Error fetching branches:", error);
                toast.error('Failed to load branches', {
                    description: errorMessage
                })
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
        const toast1=toast.loading('Processing registration...');
        setIsSubmitting(true);

        try {

            if (!formData.userType) {
                throw new Error('Please select a user type');
            }

            if (formData.userType === 'driver' && !formData.licenseId) {
                throw new Error('License ID is required for drivers');
            }

            let apiURL = "";
            if (formData.userType === "driver" || formData.userType === "staff") {
                apiURL = `http://localhost:8000/admin/${formData.userType}/register`;
            }
            else {
                apiURL = `http://localhost:8000/${formData.userType}/register`;
            }
            const response = await axios.post(
                apiURL,
                formData,
                { withCredentials: true, timeout: 15000 }
            );
            toast.success(response.data.message || 'Registration successful!', {
                id:toast1,
                action: {
                    label: 'Reload',
                    onClick: () => window.location.reload()
                }
            });
            setTimeout(() => window.location.reload(), 1000);

            
        } catch (error) {
            const errorData = error.response?.data;
            const errorMessage = errorData?.message ||
                errorData?.error ||
                error.message ||
                'Registration failed';
            toast.error('Registration Error', {
                id:toast1,
                description: errorMessage,
                ...(error.response?.status === 401 && {
                    action: {
                        label: 'Login',
                        onClick: () => window.location.href = '/admin/login'
                    }
                })
            });
            console.error("Registration error:", error);
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