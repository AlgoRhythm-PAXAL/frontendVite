import React, { useState, useEffect } from 'react';

const StaffAuthTest = () => {
    const [staffInfo, setStaffInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStaffInfo = async () => {
            try {
                const response = await fetch('http://localhost:8000/staff/ui/get-staff-information', {
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch staff info: ${response.status}`);
                }
                
                const data = await response.json();
                setStaffInfo(data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching staff info:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStaffInfo();
    }, []);

    if (loading) {
        return <div className="p-4">Loading staff information...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-600">Error: {error}</div>;
    }

    return (
        <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Staff Authentication Test</h2>
            {staffInfo ? (
                <div className="space-y-2">
                    <p><strong>Name:</strong> {staffInfo.name}</p>
                    <p><strong>Staff ID:</strong> {staffInfo.staffId}</p>
                    <p><strong>Email:</strong> {staffInfo.email}</p>
                    <p><strong>Branch:</strong> {staffInfo.branchId?.location || 'N/A'}</p>
                    <p><strong>Branch ID:</strong> {staffInfo.branchId?._id || 'N/A'}</p>
                    <div className="mt-4 p-2 bg-green-100 text-green-800 rounded">
                        ✅ Authentication working - Staff branch: {staffInfo.branchId?.location}
                    </div>
                </div>
            ) : (
                <div className="text-gray-600">No staff information available</div>
            )}
        </div>
    );
};

export default StaffAuthTest;
