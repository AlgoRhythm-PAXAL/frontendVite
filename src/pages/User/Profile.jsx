import { useState, useEffect } from 'react';
import {
  FiEdit,
  FiSave,
  FiX,
  FiUser,
  FiMail,
  FiMapPin,
  FiHome,
} from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import Footer from '../../components/User/Footer';
import Navbar from '../../components/User/Navbar';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // Form state
  const [formData, setFormData] = useState({
    fName: '',
    lName: '',
    email: '',
    address: '',
    nic: '',
    contact: '',
    province: '',
    district: '',
    city: '',
  });

  // Province and district data
  const provinces = [
    'Western Province',
    'Central Province',
    'Southern Province',
    'Northern Province',
    'Eastern Province',
    'North Western Province',
    'North Central Province',
    'Uva Province',
    'Sabaragamuwa Province',
  ];

  const districts = {
    'Western Province': ['Colombo', 'Gampaha', 'Kalutara'],
    'Central Province': ['Kandy', 'Matale', 'Nuwara Eliya'],
    'Southern Province': ['Galle', 'Matara', 'Hambantota'],
    'Northern Province': [
      'Jaffna',
      'Kilinochchi',
      'Mannar',
      'Mullaitivu',
      'Vavuniya',
    ],
    'Eastern Province': ['Batticaloa', 'Ampara', 'Trincomalee'],
    'North Western Province': ['Kurunegala', 'Puttalam'],
    'North Central Province': ['Anuradhapura', 'Polonnaruwa'],
    'Uva Province': ['Badulla', 'Monaragala'],
    'Sabaragamuwa Province': ['Ratnapura', 'Kegalle'],
  };

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${backendURL}/api/auth/profile`,
          {
            withCredentials: true,
          }
        );
        setUser(response.data.data.user);
        setFormData({
          fName: response.data.data.user.fName || '',
          lName: response.data.data.user.lName || '',
          email: response.data.data.user.email || '',
          address: response.data.data.user.address || '',
          nic: response.data.data.user.nic || '',
          contact: response.data.data.user.contact || '',
          province: response.data.data.user.province || '',
          district: response.data.data.user.district || '',
          city: response.data.data.user.city || '',
        });

        if (response.data.data.user.profilePic) {
          setPreviewImage(
            `${backendURL}/api/auth/profile/${response.data.data.user.profilePic}`
          );
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load profile data');
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProvinceChange = (e) => {
    const province = e.target.value;
    setFormData((prev) => ({
      ...prev,
      province,
      district: '',
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, or GIF images are allowed');
      return;
    }

    // Validate file size (e.g., 2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    // Convert to Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setProfilePic(reader.result); // This will be the Base64 string
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create a plain object with all form data
      const dataToSend = {
        fName: formData.fName,
        lName: formData.lName,
        email: formData.email,
        address: formData.address,
        nic: formData.nic,
        contact: formData.contact,
        province: formData.province,
        district: formData.district,
        city: formData.city,
        // Only include profilePic if it exists
        ...(profilePic && { profilePicBase64: profilePic }),
      };

      // Clean up undefined/null values (optional)
      Object.keys(dataToSend).forEach((key) => {
        if (dataToSend[key] === null || dataToSend[key] === undefined) {
          delete dataToSend[key];
        }
      });

      // Send as JSON (no multipart/form-data needed)
      const response = await axios.put(
        `${backendURL}/api/auth/profile`,
        dataToSend,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json', // Change to JSON
          },
        }
      );

      setUser(response.data.data.user);
      setIsEditing(false);
      setProfilePic(null);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="min-h-screen relative bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 w-full rotate-180">
          <svg
            className="w-full h-auto"
            viewBox="0 0 1440 320"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="topToBottomGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#1f818c" />
                <stop offset="100%" stopColor="white" />
              </linearGradient>
            </defs>
            <path
              fill="url(#topToBottomGradient)"
              fillOpacity="1"
              d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,106.7C672,117,768,171,864,181.3C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>
        <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto ">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border  border-teal-100">
              {/* Profile Header */}
              <div className="relative bg-[#16646f]  to-teal-800 px-8 py-10 text-center">
                <div className="absolute top-4 right-4">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all"
                      disabled={isLoading}
                    >
                      <FiEdit className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all"
                      disabled={isLoading}
                    >
                      <FiX className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>

                <div className="relative mx-auto w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-teal-400 flex items-center justify-center">
                      <span className="text-white text-5xl font-bold">
                        {user.fName.charAt(0)}
                        {user.lName.charAt(0)}
                      </span>
                    </div>
                  )}

                  {isEditing && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                      <div className="text-center">
                        <FiUser className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-sm">Change Photo</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </div>
                    </label>
                  )}
                </div>

                <h1 className="mt-6 text-3xl font-bold text-white">
                  {user.fName} {user.lName}
                </h1>
                <p className="text-teal-100 mt-2">
                  <FiMail className="inline mr-2" />
                  {user.email}
                </p>
              </div>

              {/* Profile Content */}
              <div className="px-8 py-8">
                {!isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Personal Information */}
                    <div className="bg-teal-50 rounded-lg p-6 border border-teal-100">
                      <h3 className="text-xl font-semibold text-teal-800 mb-6 pb-2 border-b border-teal-200 flex items-center">
                        <FiUser className="mr-2 text-teal-600" />
                        Personal Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-teal-600">
                            First Name
                          </p>
                          <p className="mt-1 text-gray-800">{user.fName}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-teal-600">
                            Last Name
                          </p>
                          <p className="mt-1 text-gray-800">{user.lName}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-teal-600">
                            Email
                          </p>
                          <p className="mt-1 text-gray-800">{user.email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-teal-600">
                            NIC
                          </p>
                          <p className="mt-1 text-gray-800">
                            {user.nic || 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-teal-600">
                            Contact Number
                          </p>
                          <p className="mt-1 text-gray-800">
                            {user.contact || 'Not provided'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="bg-teal-50 rounded-lg p-6 border border-teal-100">
                      <h3 className="text-xl font-semibold text-teal-800 mb-6 pb-2 border-b border-teal-200 flex items-center">
                        <FiMapPin className="mr-2 text-teal-600" />
                        Address Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-teal-600">
                            Address
                          </p>
                          <p className="mt-1 text-gray-800">
                            {user.address || 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-teal-600">
                            Province
                          </p>
                          <p className="mt-1 text-gray-800">
                            {user.province || 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-teal-600">
                            District
                          </p>
                          <p className="mt-1 text-gray-800">
                            {user.district || 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-teal-600">
                            City
                          </p>
                          <p className="mt-1 text-gray-800">
                            {user.city || 'Not provided'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Personal Information Form */}
                      <div className="bg-teal-50 rounded-lg p-6 border border-teal-100">
                        <h3 className="text-xl font-semibold text-teal-800 mb-6 pb-2 border-b border-teal-200 flex items-center">
                          <FiUser className="mr-2 text-teal-600" />
                          Personal Information
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="fName"
                              className="block text-sm font-medium text-teal-600 mb-1"
                            >
                              First Name
                            </label>
                            <input
                              type="text"
                              id="fName"
                              name="fName"
                              value={formData.fName}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                              required
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="lName"
                              className="block text-sm font-medium text-teal-600 mb-1"
                            >
                              Last Name
                            </label>
                            <input
                              type="text"
                              id="lName"
                              name="lName"
                              value={formData.lName}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                              required
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-teal-600 mb-1"
                            >
                              Email
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              className="w-full px-4 py-2 border border-teal-200 rounded-lg bg-gray-100 cursor-not-allowed"
                              disabled
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="nic"
                              className="block text-sm font-medium text-teal-600 mb-1"
                            >
                              NIC
                            </label>
                            <input
                              type="text"
                              id="nic"
                              name="nic"
                              value={formData.nic}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="contact"
                              className="block text-sm font-medium text-teal-600 mb-1"
                            >
                              Contact Number
                            </label>
                            <input
                              type="tel"
                              id="contact"
                              name="contact"
                              value={formData.contact}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Address Information Form */}
                      <div className="bg-teal-50 rounded-lg p-6 border border-teal-100">
                        <h3 className="text-xl font-semibold text-teal-800 mb-6 pb-2 border-b border-teal-200 flex items-center">
                          <FiHome className="mr-2 text-teal-600" />
                          Address Information
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="address"
                              className="block text-sm font-medium text-teal-600 mb-1"
                            >
                              Address
                            </label>
                            <textarea
                              id="address"
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              rows={3}
                              className="w-full px-4 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="province"
                              className="block text-sm font-medium text-teal-600 mb-1"
                            >
                              Province
                            </label>
                            <select
                              id="province"
                              name="province"
                              value={formData.province}
                              onChange={handleProvinceChange}
                              className="w-full px-4 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            >
                              <option value="">Select Province</option>
                              {provinces.map((province) => (
                                <option key={province} value={province}>
                                  {province}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="district"
                              className="block text-sm font-medium text-teal-600 mb-1"
                            >
                              District
                            </label>
                            <select
                              id="district"
                              name="district"
                              value={formData.district}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                              disabled={!formData.province}
                            >
                              <option value="">Select District</option>
                              {formData.province &&
                                districts[formData.province]?.map(
                                  (district) => (
                                    <option key={district} value={district}>
                                      {district}
                                    </option>
                                  )
                                )}
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="city"
                              className="block text-sm font-medium text-teal-600 mb-1"
                            >
                              City
                            </label>
                            <input
                              type="text"
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-md transition-all disabled:opacity-70"
                      >
                        {isLoading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <FiSave className="w-5 h-5" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
