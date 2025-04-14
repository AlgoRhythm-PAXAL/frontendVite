import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LOGO from '../../../assets/Velox-Logo.png';
import FormField from '../FormField';
import { useLocation } from 'react-router-dom';


const VerifyOTP = () => {

    const location = useLocation();
    const { email } = location.state || {};
    const [formData, setFormData] = useState({email:email,  otp: '' });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/admin/verifyOTP', formData, );

            if (response.data.success) {
                navigate('/admin/reset-password',{ state: { email: email,otp:formData.otp }});
            } else {
                setError('Invalid or expired verification code.');
            }
        } catch (error) {
            setError('Failed to verify OTP. Please try again.',error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };




    return (
        <div className="flex flex-col items-center justify-center w-1/3 bg-white pb-8 px-16 rounded-3xl relative z-10">
            <img src={LOGO} alt="LOGO" width={120} height={120} className="mt-8" />

            <div className="text-center w-full">
                <h1 className="font-semibold text-3xl my-10">Enter Verification Code</h1>
            </div>



            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5 w-full">
                <FormField type="text" name="otp" value={formData.otp} onChange={handleChange} placeholder="Enter verification code" required="true" />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" className="w-2/3 mt-4 px-4 py-3 bg-Primary text-white rounded-xl hover:bg-primary">
                    Verify Code
                </button>
            </form>
        </div>
    )
}

export default VerifyOTP