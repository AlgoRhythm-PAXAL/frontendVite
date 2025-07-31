import FormField from "../FormField";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'sonner'
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const VehicleRegistrationForm = () => {
    const [formData, setFormData] = useState({
        registrationNo: "",
        vehicleType: "",
        assignedBranch: "",
        capableVolume: "",
        capableWeight: "",
    });

    const [branches, setBranches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchBranches = async () => {
            
            try {
                const response = await axios.get(`${backendUrl}/api/admin/branches`, { 
                    withCredentials: true, 
                    timeout: 10000 
                });
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
        const toastId = toast.loading('Registering vehicle...');
        setIsSubmitting(true);

        try {
            // Client-side validation
            if (!formData.vehicleType) {
                throw new Error('Please select a vehicle type');
            }
            const response = await axios.post(
                `${backendUrl}/api/admin/vehicles`,
                formData,
                { withCredentials: true, timeout: 15000 }
            );

            toast.success(response.data.message || 'Vehicle registration successful!', {
                id: toastId,
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
                'Vehicle registration failed';

            toast.error('Registration Error', {
                id: toastId,
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
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Vehicle Registration</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   

                    <FormField
                        label="Registration Number"
                        type="text"
                        name="registrationNo"
                        value={formData.registrationNo}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        placeholder="E.g.: ABC-1234"
                    />

                    <FormField
                        label="Vehicle Type"
                        type="select"
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        options={[
                            { value: "", label: "Select Vehicle Type" },
                            { value: "shipment", label: "Shipment Vehicle" },
                            { value: "pickupDelivery", label: "Pickup/Delivery Vehicle" }
                        ]}
                        required
                        disabled={isSubmitting}
                    />

                    {isLoading ? (
                        <SkeletonLoader />
                    ) : (
                        <FormField
                            label="Assigned Branch"
                            type="select"
                            name="assignedBranch"
                            value={formData.assignedBranch}
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
                    )}

                    

                    <FormField
                        label="Maximum Volume Capacity (m³)"
                        type="number"
                        name="capableVolume"
                        value={formData.capableVolume}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        min="1"
                        step="0.1"
                    />

                    <FormField
                        label="Maximum Weight Capacity (kg)"
                        type="number"
                        name="capableWeight"
                        value={formData.capableWeight}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        min="1"
                        step="0.1"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                        "Register Vehicle"
                    )}
                </button>
            </form>
        </div>
    );
};

export default VehicleRegistrationForm;