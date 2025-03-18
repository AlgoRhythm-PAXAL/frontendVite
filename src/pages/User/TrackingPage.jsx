import React from "react";
import Navbar from "../../components/User/Navbar";

const TrackingPage = () => {
  return (
    <div className="bg-white text-gray-800">
        <Navbar/>
      {/* Header Section */}
      <div className="bg-teal-700 relative pb-32">
        <div className="max-w-4xl mx-auto pt-10 flex justify-center">
          <div className="flex items-center bg-white p-2 rounded-full shadow-lg w-full max-w-xl">
            <input
              type="text"
              placeholder="Enter Tracking Number"
              className="flex-1 px-4 py-2 outline-none rounded-l-full text-gray-700"
            />
            <button className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold">
              TRACK
            </button>
          </div>
        </div>
        {/* Curved SVG */}
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,160L80,176C160,192,320,224,480,213.3C640,203,800,149,960,138.7C1120,128,1280,160,1360,176L1440,192V320H0Z"
          ></path>
        </svg>
      </div>

      {/* Hero Section */}
      <div className="bg-white py-20 text-center max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <img src="/dummy-truck.png" alt="Delivery Truck" className="w-full" />
          </div>
          <div className="text-left">
            <h2 className="text-4xl font-bold text-teal-700 leading-snug">
              Track Your Parcel in Seconds
            </h2>
            <p className="mt-4 text-gray-600">
              Enter your tracking number to quickly see where your parcel is.
            </p>
            <a href="#" className="mt-4 text-teal-500 font-semibold inline-block">
              Learn more →
            </a>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-sm">
          <div>
            <h3 className="text-white font-semibold">Help & Support</h3>
            <ul className="mt-2 space-y-2">
              <li>Contact Us</li>
              <li>Customer Support</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold">User Account</h3>
            <ul className="mt-2 space-y-2">
              <li>About Us</li>
              <li>Parcel Tracking</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold">Quick Parcel Tools</h3>
            <ul className="mt-2 space-y-2">
              <li>Track Parcel</li>
              <li>Change Password</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold">Newsletter Subscription</h3>
            <div className="mt-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="p-2 w-full rounded text-gray-900"
              />
              <button className="bg-teal-600 text-white px-4 py-2 rounded mt-2 w-full">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="text-center mt-6 text-gray-500 text-sm">
          &copy; 2025 Courier Delivery Management. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default TrackingPage;