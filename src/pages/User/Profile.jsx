// import { useState, useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/auth/profile", { 
                    withCredentials: true 
                });
                setUser(response.data.data.user);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUser();
    }, []);

    if (!user) return <p>Loading...</p>;

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Account Details</h2>
                
                <div className="mb-4">
                    <label className="block text-gray-600">First Name</label>
                    <input 
                        type="text" 
                        value={user.fName} 
                        disabled
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-600">Last Name</label>
                    <input 
                        type="text" 
                        value={user.lName} 
                        disabled
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-600">Email</label>
                    <input 
                        type="email" 
                        value={user.email} 
                        disabled
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-600">Password</label>
                    <input 
                        type="password" 
                        value={user.password} 
                        disabled
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                <button className="bg-teal-500 text-white p-2 rounded w-full mt-4">Edit Profile</button>
            </div>
        </div>
    );
};

export default Profile;
