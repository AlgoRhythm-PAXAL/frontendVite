import React, { useState } from 'react';
import NavigationBar from '../../components/staff/NavigationBar';

const StaffProfile = () => {
  // Sample initial staff data
  const initialStaffData = {
    id: 1,
    name: 'John Doe',
    position: 'Senior Developer',
    department: 'Engineering',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Experienced software developer with 8+ years in web technologies. Specialized in React and Node.js.',
    imageUrl: 'https://via.placeholder.com/150'
  };

  // State management
  const [staffData, setStaffData] = useState(initialStaffData);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState({});
  const [errors, setErrors] = useState({});

  // Toggle edit mode
  const handleEditClick = () => {
    setTempData(staffData);
    setErrors({});
    setEditMode(true);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({ ...prev, [name]: value }));
    
    // Simple validation
    if (value.trim() === '') {
      setErrors(prev => ({ ...prev, [name]: 'This field is required' }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Save changes
  const handleSave = () => {
    // Check for errors
    const newErrors = {};
    Object.entries(tempData).forEach(([key, value]) => {
      if (typeof value === 'string' && value.trim() === '') {
        newErrors[key] = 'This field is required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStaffData(tempData);
    setEditMode(false);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditMode(false);
    setErrors({});
  };

  return (
    <>
    <NavigationBar/>
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <img 
            src={staffData.imageUrl} 
            alt={staffData.name} 
            className="w-48 h-48 rounded-full object-cover border-4 border-gray-200"
          />
        </div>

        {/* Profile Information */}
        <div className="flex-grow">
          {editMode ? (
            // EDIT MODE
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={tempData.name}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <input
                    type="text"
                    name="position"
                    value={tempData.position}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${errors.position ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={tempData.department}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${errors.department ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={tempData.email}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={tempData.phone}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={tempData.bio}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full p-2 border rounded-md ${errors.bio ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // VIEW MODE
            <>
              <h1 className="text-3xl font-bold text-gray-800">{staffData.name}</h1>
              <div className="mt-2 space-y-1">
                <p className="text-xl text-blue-600">{staffData.position}</p>
                <p className="text-gray-600"><strong>Department:</strong> {staffData.department}</p>
                <p className="text-gray-600"><strong>Email:</strong> {staffData.email}</p>
                <p className="text-gray-600"><strong>Phone:</strong> {staffData.phone}</p>
              </div>
              
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-800">About</h2>
                <p className="mt-2 text-gray-700 whitespace-pre-line">{staffData.bio}</p>
              </div>
              
              <button
                onClick={handleEditClick}
                className="mt-8 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default StaffProfile;