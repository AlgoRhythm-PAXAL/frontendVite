import { useState } from 'react';
import axios from 'axios';
import SectionTitle from '../../components/admin/SectionTitle';
import FormField from '../../components/admin/FormField';
import NumberShowingCard from "../../components/admin/NUmberShowingCard";

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
      const response = await axios.post('http://localhost:8000/admin/register', formData, { withCredentials: true });
      alert(response.data.message); // Show success message
      window.location.reload();

    } catch (error) {
      console.error('Error registering admin:', error);
      alert('Registration failed. Please try again.', error);
    }
  };


  return (
    <div className="flex flex-col  mx-8  ">
      <SectionTitle title="User Accounts" />
      <div className="flex gap-5 w-full justify-center">
        <div className=" p-8 w-full  bg-white rounded-2xl border border-gray-300 shadow-lg">
          <h1 className="text-xl font-semibold">User Registration</h1>
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
        <div className="flex flex-wrap justify-center items-stretch gap-2 w-5/12">
          <NumberShowingCard title="Total Customers" number="1000" since="last year" type="Customer" />
          <NumberShowingCard title="Total Drivers" number="1000" since="last year" type="Driver" />
          <NumberShowingCard title="Total Admins" number="1000" since="last year" type="Admin" />
          <NumberShowingCard title="Total Staffs" number="1000" since="last year" type="Staff" />
        </div>
      </div>
    </div>
  );
};

export default UserAccounts;
