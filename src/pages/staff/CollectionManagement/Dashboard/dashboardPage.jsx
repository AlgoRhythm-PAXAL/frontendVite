import { useState, useEffect } from 'react';
import { Package, TrendingUp, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const navigate = useNavigate();
    
    // // Debug localStorage on component mount
    // console.log("=== FRONTEND: COMPONENT MOUNTED ===");
    // console.log("LocalStorage contents:");
    // console.log("- token:", localStorage.getItem('token') ? "EXISTS" : "MISSING");
    // console.log("- userCenter:", localStorage.getItem('userCenter'));
    // console.log("- All localStorage keys:", Object.keys(localStorage));
    
    // Set default date to current date
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [parcelStats, setParcelStats] = useState({
        total: 0,
        arrived: 0,
        delivered: 0,
        nonDelivered: 0
    });
    const [driverStats, setDriverStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);

    // Show notification function
    const showNotificationMessage = (message, type = 'success') => {
        if (type === 'success') {
            setSuccessMessage(message);
            setErrorMessage('');
        } else {
            setErrorMessage(message);
            setSuccessMessage('');
        }
        setShowNotification(true);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            setShowNotification(false);
            setSuccessMessage('');
            setErrorMessage('');
        }, 5000);
    };

    // Get current month and year
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();

    // Get first day of month and number of days
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();

    // Month names
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Day names
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Fetch parcel statistics for selected date
    useEffect(() => {
        const fetchParcelStats = async () => {
            try {
                setLoading(true);
                // Get user's center from localStorage
                const userCenter = localStorage.getItem('userCenter') || '682e1059ce33c2a891c9b168';
                // Format date as YYYY-MM-DD in local timezone
                const formattedDate = selectedDate.getFullYear() + '-' + 
                    String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(selectedDate.getDate()).padStart(2, '0');
                
                // console.log("=== FRONTEND: FETCHING PARCEL STATS ===");
                // console.log("User center:", userCenter);
                // console.log("Selected date:", selectedDate);
                // console.log("Formatted date:", formattedDate);
                // console.log("Auth token exists:", !!localStorage.getItem('token'));
                
                const url = `${import.meta.env.VITE_BACKEND_URL}/parcels/dashboard/stats/${userCenter}/${formattedDate}`;
                // console.log("API URL:", url);
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                // console.log("Response status:", response.status);
                // console.log("Response ok:", response.ok);

                if (response.ok) {
                    const data = await response.json();
                    // console.log("Response data:", data);
                    setParcelStats(data.stats);
                    // console.log("Parcel stats set:", data.stats);
                    showNotificationMessage('Dashboard data loaded successfully', 'success');
                } else {
                    const errorText = await response.text();
                    console.error("Response error:", errorText);
                    showNotificationMessage('Failed to load parcel statistics', 'error');
                }
            } catch (error) {
                console.error('=== FRONTEND: PARCEL STATS ERROR ===');
                console.error('Error fetching parcel stats:', error);
                showNotificationMessage('Error fetching parcel statistics', 'error');
            } finally {
                setLoading(false);
            }
        };

        const fetchDriverStats = async () => {
            try {
                const userCenter = localStorage.getItem('userCenter') || '682e1059ce33c2a891c9b168';
                // Format date as YYYY-MM-DD in local timezone
                const formattedDate = selectedDate.getFullYear() + '-' + 
                    String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(selectedDate.getDate()).padStart(2, '0');
                
                const url = `${import.meta.env.VITE_BACKEND_URL}/drivers/stats/${userCenter}/${formattedDate}`;
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setDriverStats(data.drivers);
                } else {
                    const errorText = await response.text();
                    console.error("Driver response error:", errorText);
                    showNotificationMessage('Failed to load driver statistics', 'error');
                }
            } catch (error) {
                console.error('Error fetching driver stats:', error);
                showNotificationMessage('Error fetching driver statistics', 'error');
            }
        };

        const fetchData = async () => {
            await fetchParcelStats();
            await fetchDriverStats();
        };
        fetchData();
    }, [selectedDate]);

    // Handle card clicks for navigation
    const handleCardClick = (type) => {
        // Format date as YYYY-MM-DD in local timezone
        const formattedDate = selectedDate.getFullYear() + '-' + 
            String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' + 
            String(selectedDate.getDate()).padStart(2, '0');
        navigate(`/staff/collection-management/dashboard/parcels/${type}/${formattedDate}`);
    };

    // Navigate months
    const goToPreviousMonth = () => {
        setSelectedDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const goToNextMonth = () => {
        setSelectedDate(new Date(currentYear, currentMonth + 1, 1));
    };

    // Handle date click
    const handleDateClick = (day) => {
        const clickedDate = new Date(currentYear, currentMonth, day);
        setSelectedDate(clickedDate); // Update selected date to refresh stats
    };

    // Render calendar days
    const renderCalendarDays = () => {
        const days = [];
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(
                <div key={`empty-${i}`} className="h-12 w-12 p-2"></div>
            );
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString();
            const isSelected = day === selectedDate.getDate() && currentMonth === selectedDate.getMonth() && currentYear === selectedDate.getFullYear();
            
            days.push(
                <div
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`h-12 w-12 p-2 text-center text-sm font-medium rounded cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-cyan-600
                        ${isToday ? 'bg-blue-100 text-blue-800' : ''}
                        ${isSelected ? 'bg-[#1F818C] text-white' : ''}
                        ${!isToday && !isSelected ? 'hover:bg-gray-100' : ''}
                    `}
                >
                    {day}
                </div>
            );
        }
        
        return days;
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Beautiful Notification */}
            {showNotification && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 transform transition-all duration-300 ease-in-out ${
                    successMessage 
                        ? 'bg-green-50 border-green-400 text-green-800' 
                        : 'bg-red-50 border-red-400 text-red-800'
                }`}>
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            {successMessage ? (
                                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium">
                                {successMessage || errorMessage}
                            </p>
                        </div>
                        <div className="ml-auto pl-3">
                            <button
                                onClick={() => {
                                    setShowNotification(false);
                                    setSuccessMessage('');
                                    setErrorMessage('');
                                }}
                                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                    successMessage 
                                        ? 'text-green-500 hover:bg-green-100 focus:ring-green-600' 
                                        : 'text-red-500 hover:bg-red-100 focus:ring-red-600'
                                }`}
                            >
                                <span className="sr-only">Dismiss</span>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-none mx-auto">
                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-8">
                        <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1F818C]"></div>
                            <span className="text-gray-600">Loading dashboard data...</span>
                        </div>
                    </div>
                )}

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div 
                        className="bg-[#1F818C] text-white rounded-lg p-6 text-center shadow-md cursor-pointer hover:bg-[#176872] transition-colors"
                        onClick={() => handleCardClick('total')}
                    >
                        <div className="flex items-center justify-center mb-2">
                            <Package className="w-8 h-8" />
                        </div>
                        <div className="text-sm font-medium mb-1">Total Parcels</div>
                        <div className="text-3xl font-bold">{parcelStats.total}</div>
                        <div className="text-xs mt-1 opacity-75">Click to view details</div>
                    </div>
                    
                    <div 
                        className="bg-blue-600 text-white rounded-lg p-6 text-center shadow-md cursor-pointer hover:bg-blue-700 transition-colors"
                        onClick={() => handleCardClick('arrived')}
                    >
                        <div className="flex items-center justify-center mb-2">
                            <TrendingUp className="w-8 h-8" />
                        </div>
                        <div className="text-sm font-medium mb-1">Arrived Parcels</div>
                        <div className="text-3xl font-bold">{parcelStats.arrived}</div>
                        <div className="text-xs mt-1 opacity-75">Click to view details</div>
                    </div>
                    
                    <div 
                        className="bg-green-600 text-white rounded-lg p-6 text-center shadow-md cursor-pointer hover:bg-green-700 transition-colors"
                        onClick={() => handleCardClick('delivered')}
                    >
                        <div className="flex items-center justify-center mb-2">
                            <Package className="w-8 h-8" />
                        </div>
                        <div className="text-sm font-medium mb-1">Delivered Parcels</div>
                        <div className="text-3xl font-bold">{parcelStats.delivered}</div>
                        <div className="text-xs mt-1 opacity-75">Click to view details</div>
                    </div>

                    <div 
                        className="bg-red-600 text-white rounded-lg p-6 text-center shadow-md cursor-pointer hover:bg-red-700 transition-colors"
                        onClick={() => handleCardClick('nonDelivered')}
                    >
                        <div className="flex items-center justify-center mb-2">
                            <Package className="w-8 h-8" />
                        </div>
                        <div className="text-sm font-medium mb-1">Non-Delivered Parcels</div>
                        <div className="text-3xl font-bold">{parcelStats.nonDelivered}</div>
                        <div className="text-xs mt-1 opacity-75">Click to view details</div>
                    </div>
                </div>

                {/* Calendar Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Calendar */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={goToPreviousMonth}
                                className="p-2 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-cyan-600"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h2 className="text-xl font-bold text-gray-800">
                                {monthNames[currentMonth]} {currentYear}
                            </h2>
                            <button
                                onClick={goToNextMonth}
                                className="p-2 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-cyan-600"
                            >
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Day headers */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {dayNames.map(day => (
                                <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {renderCalendarDays()}
                        </div>
                    </div>

                    {/* Shipment Details */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">
                            Dispatched Parcels for {monthNames[currentMonth]} {selectedDate.getDate()}th, {currentYear}
                        </h2>
                        
                        <div className="bg-[#1F818C] text-white rounded-lg overflow-hidden">
                            <div className="grid grid-cols-3 gap-4 p-4">
                                <div className="text-center">
                                    <div className="text-sm font-medium">Driver ID</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm font-medium">Driver Name</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm font-medium">Dispatched Parcels</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="divide-y divide-gray-200 mt-4">
                            {driverStats.map((driver, index) => (
                                <div key={driver.driverId} className={`grid grid-cols-3 gap-4 p-4 ${index % 2 === 0 ? 'hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}`}>
                                    <div className="text-center text-sm">{driver.driverId}</div>
                                    <div className="text-center text-sm">{driver.driverName}</div>
                                    <div className="text-center text-sm font-medium">{driver.parcels}</div>
                                </div>
                            ))}
                            
                            {driverStats.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                    <p>No dispatched parcels for this date.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
