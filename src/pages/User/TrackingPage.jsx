// import React from "react";
// import Navbar from "../../components/User/Navbar";

// const TrackingPage = () => {
//   return (
//     <div className="bg-white text-gray-800">
//         <Navbar/>
//       {/* Header Section */}
//       <div className="bg-teal-700 relative pb-32">
//         <div className="max-w-4xl mx-auto pt-10 flex justify-center">
//           <div className="flex items-center bg-white p-2 rounded-full shadow-lg w-full max-w-xl">
//             <input
//               type="text"
//               placeholder="Enter Tracking Number"
//               className="flex-1 px-4 py-2 outline-none rounded-l-full text-gray-700"
//             />
//             <button className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold">
//               TRACK
//             </button>
//           </div>
//         </div>
//         {/* Curved SVG */}
//         <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320">
//           <path
//             fill="#ffffff"
//             fillOpacity="1"
//             d="M0,160L80,176C160,192,320,224,480,213.3C640,203,800,149,960,138.7C1120,128,1280,160,1360,176L1440,192V320H0Z"
//           ></path>
//         </svg>
//       </div>

//       {/* Hero Section */}
//       <div className="bg-white py-20 text-center max-w-6xl mx-auto px-6">
//         <div className="grid md:grid-cols-2 gap-10 items-center">
//           <div>
//             <img src="/dummy-truck.png" alt="Delivery Truck" className="w-full" />
//           </div>
//           <div className="text-left">
//             <h2 className="text-4xl font-bold text-teal-700 leading-snug">
//               Track Your Parcel in Seconds
//             </h2>
//             <p className="mt-4 text-gray-600">
//               Enter your tracking number to quickly see where your parcel is.
//             </p>
//             <a href="#" className="mt-4 text-teal-500 font-semibold inline-block">
//               Learn more →
//             </a>
//           </div>
//         </div>
//       </div>

//       {/* Footer Section */}
//       <footer className="bg-gray-900 text-gray-300 py-12">
//         <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-sm">
//           <div>
//             <h3 className="text-white font-semibold">Help & Support</h3>
//             <ul className="mt-2 space-y-2">
//               <li>Contact Us</li>
//               <li>Customer Support</li>
//               <li>Terms & Conditions</li>
//             </ul>
//           </div>
//           <div>
//             <h3 className="text-white font-semibold">User Account</h3>
//             <ul className="mt-2 space-y-2">
//               <li>About Us</li>
//               <li>Parcel Tracking</li>
//             </ul>
//           </div>
//           <div>
//             <h3 className="text-white font-semibold">Quick Parcel Tools</h3>
//             <ul className="mt-2 space-y-2">
//               <li>Track Parcel</li>
//               <li>Change Password</li>
//             </ul>
//           </div>
//           <div>
//             <h3 className="text-white font-semibold">Newsletter Subscription</h3>
//             <div className="mt-2">
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="p-2 w-full rounded text-gray-900"
//               />
//               <button className="bg-teal-600 text-white px-4 py-2 rounded mt-2 w-full">
//                 Subscribe
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="text-center mt-6 text-gray-500 text-sm">
//           &copy; 2025 Courier Delivery Management. All rights reserved.
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default TrackingPage;

import { FiSearch, FiMapPin, FiClock, FiCheckCircle, FiTruck } from 'react-icons/fi';
import { useState } from 'react';
import search from "../../assets/lottie/search.json";
import Lottie from "lottie-react";
import Navbar from '../../components/User/Navbar';
import Footer from '../../components/User/Footer';

const TrackParcelPage = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [parcelData, setParcelData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = () => {
    if (!trackingNumber) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setParcelData({
        id: trackingNumber,
        status: 'In Transit',
        origin: 'Colombo Warehouse',
        destination: 'Kandy Customer',
        estimatedDelivery: '2023-06-15',
        progress: 65,
        history: [
          { status: 'Order Received', time: '2023-06-10 09:30', location: 'Colombo' },
          { status: 'Processing', time: '2023-06-10 14:15', location: 'Colombo' },
          { status: 'Dispatched', time: '2023-06-11 10:00', location: 'Colombo' },
          { status: 'In Transit', time: '2023-06-12 16:45', location: 'Kegalle' }
        ]
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
     <div className="min-h-screen bg-gray-50">
        <Navbar/>
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div className="absolute top-0 left-0 w-full rotate-180">
  <svg className="w-full h-auto" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="topToBottomGradient" x1="0" y1="0" x2="0" y2="1">
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


      
      <div className=" relative max-w-4xl mx-auto">
        
        {/* Hero Tracking Section */}
        <div className="text-center mb-14">
       
          <h1 className="text-4xl relative md:text-5xl font-bold text-gray-800 mb-2">
            Track Your Parcel
          </h1>
          <p className="text-xl relative text-[#1f818c] max-w-2xl mb-3 mx-auto">
            Enter your tracking number to get updates on your delivery
          </p>
        </div>

        {/* Tracking Input */}
        <div className="bg-white relative rounded-2xl shadow-xl overflow-hidden mb-12  transition-all duration-300 hover:shadow-2xl">
          <div className="p-1 bg-gradient-to-r from-[#1f818c] to-teal-400">
            <div className="flex items-center bg-white p-4">
              <FiSearch className="text-gray-400 text-2xl mr-4" />
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter your tracking number (e.g. SL123456789)"
                className="flex-grow text-lg  outline-none placeholder-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
              />
              <button
                onClick={handleTrack}
                disabled={isLoading}
                className={`ml-4 px-8 py-3 rounded-lg font-semibold text-white transition-all ${isLoading ? 'bg-gray-400' : 'bg-[#1f818c] hover:bg-teal-600'} flex items-center`}
              >
                {isLoading ? 'Tracking...' : 'Track Parcel'}
                {!isLoading && <FiMapPin className="ml-2" />}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {parcelData ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-16 animate-fadeIn">
            {/* Status Header */}
            <div className="bg-gradient-to-r from-[#1f818c] to-teal-400 p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Parcel #{parcelData.id}</h2>
                  <p className="text-teal-100">{parcelData.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-teal-100">Estimated Delivery</p>
                  <p className="text-xl font-semibold">{parcelData.estimatedDelivery}</p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="px-6 pt-6">
              <div className="relative pt-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold inline-block text-[#1f818c]">
                      Progress
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-[#1f818c]">
                      {parcelData.progress}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-200">
                  <div
                    style={{ width: `${parcelData.progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-[#1f818c] to-teal-400"
                  ></div>
                </div>
              </div>
            </div>

            {/* Route Information */}
            <div className="px-6 pb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="text-center">
                  <div className="bg-[#1f818c] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FiMapPin />
                  </div>
                  <p className="font-medium text-gray-800">{parcelData.origin}</p>
                  <p className="text-sm text-gray-500">Origin</p>
                </div>
                <div className="flex-1 px-4">
                  <div className="h-1 bg-gradient-to-r from-[#1f818c] to-teal-400 relative">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <FiTruck className="text-[#1f818c] text-2xl animate-bounce" />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-teal-400 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FiMapPin />
                  </div>
                  <p className="font-medium text-gray-800">{parcelData.destination}</p>
                  <p className="text-sm text-gray-500">Destination</p>
                </div>
              </div>
            </div>

            {/* Tracking History */}
            <div className="border-t border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Tracking History</h3>
              <div className="space-y-4">
                {parcelData.history.map((item, index) => (
                  <div key={index} className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-[#1f818c] text-white' : 'bg-gray-200 text-gray-600'}`}>
                        <FiCheckCircle />
                      </div>
                      {index < parcelData.history.length - 1 && (
                        <div className="w-1 h-12 bg-gray-200"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-gray-800">{item.status}</p>
                      <p className="text-sm text-gray-500">{item.time}</p>
                      <p className="text-sm text-gray-500">{item.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center pt-0 pb-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <FiSearch className="text-gray-300 text-5xl mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                {trackingNumber ? 'No parcel found' : 'Enter tracking number'}
              </h3>
              <p className="text-gray-500">
                {trackingNumber
                  ? 'Please check your tracking number and try again'
                  : 'Track your parcel by entering the tracking number above'}
              </p>
            </div>
          </div>
        )}

        {/* Support CTA */}
        <div className="bg-gradient-to-r from-[#1f818c] to-teal-400 rounded-2xl p-10 text-center text-white shadow-xl">
          <h3 className="text-2xl font-bold mb-4">Need Help With Your Parcel?</h3>
          <p className="mb-6 max-w-2xl mx-auto">
            Our customer support team is available 24/7 to assist you with any delivery questions.
          </p>
          <button className="bg-white text-[#1f818c] hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg">
            Contact Support
          </button>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default TrackParcelPage;