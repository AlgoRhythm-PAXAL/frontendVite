import { useState } from 'react';
import axios from 'axios';
import SectionTitle from '../../components/admin/SectionTitle';
import FormField from '../../components/admin/FormField';

const UserAccounts = () => {
  const [formData, setFormData] = useState({
    name: '',
    nic: '',
    password: '',
    email: '',
    contactNo: '',
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/admin/register', formData,{withCredentials:true});
      alert(response.data.message); // Show success message
    } catch (error) {
      console.error('Error registering admin:', error);
      alert('Registration failed. Please try again.',error);
    }
  };

  return (
    <div className="flex flex-col">
      <SectionTitle title="User Accounts" />
      <div>
        <h1 className="text-xl font-medium">Admin Registration</h1>
        <form onSubmit={handleSubmit} className="m-8">
          <FormField label="Full Name :" type="text" name="name" value={formData.name} onChange={handleChange} />
          <FormField label="NIC :" type="text" name="nic" value={formData.nic} onChange={handleChange} />
          <FormField label="Password :" type="password" name="password" value={formData.password} onChange={handleChange} />
          <FormField label="Email :" type="email" name="email" value={formData.email} onChange={handleChange} />
          <FormField label="Contact No :" type="text" name="contactNo" value={formData.contactNo} onChange={handleChange} />
          
          <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserAccounts;
