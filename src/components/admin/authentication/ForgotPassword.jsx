import FormField from '../FormField'
import axios from 'axios';
import { useState } from 'react'
import LOGO from '../../../assets/Velox-Logo.png'
import { useNavigate } from "react-router-dom"
import { Link } from 'react-router-dom'
const backendURL = import.meta.env.VITE_BACKEND_URL;

const ForgotPassword = () => {

    const [formData, setFormData] = useState({ email: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents form from reloading

        try {
            const response = await axios.post(`${backendURL}/api/admin/auth/forgot-password`, formData);
            console.log("OTP sent to email:", response.data);
            // alert("Verification code sent to your email."); // Show success message
            navigate("/admin/verify-OTP", { state: { email: formData.email } });



        } catch (error) {
            console.error(error);

        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }





    return (
        
        <div className="flex flex-col items-center justify-center w-[500px] bg-white pb-8 px-16 rounded-3xl relative z-10 mx-auto">

            <img src={LOGO} alt="LOGO" width={120} height={120} className="mt-8" />

            <div className="text-center w-full">
                <h1 className="font-semibold text-3xl my-10 font-mulish">Forgot Password</h1>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center gap-5 w-full">
                <div className="flex flex-col items-center justify-center w-full  gap-3">
                    <FormField placeholder="Email " type="text" name="email" value={formData.email} onChange={handleChange} required="true" />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
                <button type="submit" className="w-2/3 mt-4 px-4 py-3 bg-Primary text-white rounded-xl hover:bg-primary">Get Verification Code</button>
                <Link to="/admin/login" className="text-sm text-Primary text-left">Log in?</Link>
            </form>
        </div>
       

    )
}

export default ForgotPassword