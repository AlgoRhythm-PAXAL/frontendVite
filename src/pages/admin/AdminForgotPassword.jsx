import FormField from '../../components/admin/FormField'
import axios from 'axios';
import { useState } from 'react'
import LOGO from '../../assets/Velox-Logo.png'
import { useNavigate } from "react-router-dom"
import { Link } from 'react-router-dom'

const AdminForgotPassword = () => {

    const [formData, setFormData] = useState({ email: ''});
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents form from reloading

        try {
            const response = await axios.post('http://localhost:8000/admin/forgotPassword', formData);
            console.log("OTP sent to email:", response.data);
            // alert("Verification code sent to your email."); // Show success message
            navigate("/admin/verify-OTP",{ state: { email: formData.email }});
          

            
        } catch (error) {
            console.error( error);
            
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    return (
        <div className="flex flex-col h-screen bg-Background items-center justify-center relative">
            <div className="flex flex-col items-center justify-center w-1/3 bg-white pb-8 px-16 rounded-3xl relative z-10">

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

            {/* Overlapping SVGs */}
            <div className="absolute bottom-0 w-full ">
                <div className="relative w-full h-[200px]">
                    {/* First SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 390" className="absolute bottom-0 w-full">
                        <path fill="#1f818c" fillOpacity="1" d="M0,192L60,197.3C120,203,240,213,360,229.3C480,245,600,267,720,250.7C840,235,960,181,1080,165.3C1200,149,1320,171,1380,181.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
                    </svg>
                    {/* Second SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 280" className="absolute bottom-0 w-full">
                        <path fill="#000000" fillOpacity="1" d="M0,192L60,197.3C120,203,240,213,360,197.3C480,181,600,139,720,122.7C840,107,960,117,1080,133.3C1200,149,1320,171,1380,181.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
                    </svg>
                </div>
            </div>

        </div>
    );
}

export default AdminForgotPassword;
