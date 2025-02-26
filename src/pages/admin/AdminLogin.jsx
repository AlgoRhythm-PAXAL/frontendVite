import SectionTitle from '../../components/admin/SectionTitle'
import FormField from '../../components/admin/FormField'
import axios from 'axios';
import {useState} from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from "react-router-dom"

const AdminLogin = () => {

    const [formData,setFormData]=useState({email:'',password:''});
    const navigate=useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents form from reloading
    
        try {
            const response = await axios.post('http://localhost:8000/admin/login', formData,{withCredentials:true});
            Cookies.set("AdminToken", response.data.token, { expires: 1, secure: true });
            console.log("Token = "+Cookies.get('AdminToken'));

            console.log("Login successful, token stored in cookie.");
            alert(response.data.message); // Show success message
            
            navigate("/admin");
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed. Please check your credentials.");
        }
    };
    
    const handleChange=(e)=>{
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  return (
    <div className="flex flex-col items-center justify-center">
        <div className=" w-1/2">
        <SectionTitle title="Admin Login"/>
        <form onSubmit={handleSubmit}>
            <FormField label="Email :" type="text" name="email" value={formData.email} onChange={handleChange}/>
            <FormField label="Password: " type="password" name="password" value={formData.password} onChange={handleChange}/>
            <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                    Login
            </button>
        </form>
    </div>
    </div>
    
  )
}

export default AdminLogin