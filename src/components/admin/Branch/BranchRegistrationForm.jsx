import FormField from "../FormField";
import { useState } from "react";
import axios from "axios";
import { toast } from 'sonner'

const BranchRegistrationForm = () => {
    const [formData, setFormData] = useState({
        location: "",
        contact: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Registering branch...');
        setIsSubmitting(true);

        try {
            // Basic client-side validation
            if (!formData.location.trim()) {
                throw new Error('Location is required');
            }

            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await axios.post(
                `${backendUrl}/admin/save/branch`,
                formData,
                { withCredentials: true, timeout: 15000 }
            );

            toast.success(response.data.message || 'Branch registration successful!', {
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
                'Branch registration failed';

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

    return (
        <div className="p-8 w-full bg-white rounded-xl border border-gray-200 shadow-sm">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Branch Registration</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    

                    <FormField
                        label="Location"
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        placeholder="E.g.: Colombo"
                    />

                    <FormField
                        label="Contact Number"
                        type="tel"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        placeholder="E.g.: +94 77 xxx xxxx"
                        pattern="[+0-9\s\-()]+"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
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
                        "Register Branch"
                    )}
                </button>
            </form>
        </div>
    );
};

export default BranchRegistrationForm;