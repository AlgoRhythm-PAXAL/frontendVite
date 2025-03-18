// import React from 'react'
import Navbar from '../../components/User/Navbar'
import { useState } from "react";
import { motion } from "framer-motion";

      {/* Footer */}
      import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "Parcel Tracker has been a game-changer!",
    "Delivery updates are always on time!",
    "The best parcel service I've ever used!",
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <div className="font-sans">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="text-center py-16 bg-gray-50">
        <h1 className="text-4xl font-bold text-gray-800">
          Seamless Parcel Delivery Simplified!
        </h1>
        <p className="mt-4 text-gray-600">
          Trusted by millions for smooth, stress-free deliveries worldwide.
        </p>
        <button className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg">
          Get Started
        </button>
      </section>

      {/* Features */}
      <div className="space-y-12 py-12 px-6">
        {[
          "Track Your Parcel in Seconds",
          "Add Your Pickup Point, Simplify Deliveries",
          "Smart, Unique Status Notifications",
        ].map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-semibold text-gray-700">{feature}</h2>
            <p className="text-gray-500 max-w-md mt-2">
              Experience seamless tracking and updates in real-time.
            </p>
          </div>
        ))}
      </div>

      {/* Testimonial Slider */}
      <div className="relative bg-red-500 text-white py-12 text-center">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xl font-semibold">{slides[currentSlide]}</p>
        </motion.div>
        <button
          onClick={nextSlide}
          className="mt-6 px-4 py-2 bg-white text-red-500 rounded"
        >
          Next
        </button>
      </div>

      {/* FAQ */}
      <div className="py-12 px-6">
        <h2 className="text-2xl font-semibold text-gray-700 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4 mt-6">
          {[
            "How do I track my parcel?",
            "Can I change my delivery address?",
            "What if my parcel is lost?",
          ].map((faq, index) => (
            <details key={index} className="border p-4 rounded">
              <summary className="cursor-pointer font-medium">{faq}</summary>
              <p className="mt-2 text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </details>
          ))}
        </div>
      </div>



    <footer className="bg-gray-100 text-gray-800 py-12 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Help & Support */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600">Help & Support</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Customer Service</a></li>
            <li><a href="#" className="hover:underline">Delivery Information</a></li>
            <li><a href="#" className="hover:underline">Returns & Orders</a></li>
            <li><a href="#" className="hover:underline">Claims & Complaints</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Cookie Policy</a></li>
          </ul>
        </div>

        {/* User Account & Parcel Tools */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600">User Account</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li><a href="#" className="hover:underline">My Orders</a></li>
            <li><a href="#" className="hover:underline">Account Settings</a></li>
            <li><a href="#" className="hover:underline">Change Password</a></li>
          </ul>
          <h3 className="text-lg font-semibold text-blue-600 mt-6">Quick Parcel Tools</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Track My Parcel</a></li>
            <li><a href="#" className="hover:underline">Change Address</a></li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600">Newsletter Subscription</h3>
          <p className="text-sm mt-2">Want updates on your parcel? Subscribe for instant notifications!</p>
          <div className="mt-3">
            <input
              type="email"
              placeholder="example@mail.com"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <button className="mt-2 w-full bg-black text-white py-2 rounded-md">Send</button>
          </div>
          <p className="text-sm mt-4">Stay connected with us on social media!</p>
          <div className="flex space-x-4 mt-2 text-2xl">
            <FaFacebook className="cursor-pointer hover:text-blue-600" />
            <FaTwitter className="cursor-pointer hover:text-blue-400" />
            <FaInstagram className="cursor-pointer hover:text-pink-500" />
            <FaYoutube className="cursor-pointer hover:text-red-500" />
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600">Contact Information</h3>
          <p className="text-sm mt-2">Address:</p>
          <p className="text-sm">Parcel HQ Lane, Colombo, Sri Lanka</p>
          <p className="text-sm mt-2">Email: <a href="mailto:support@parcel.com" className="text-blue-600 hover:underline">support@parcel.com</a></p>
          <p className="text-sm mt-2">Support Hotline: +94 123 4567</p>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="text-center text-gray-600 text-sm mt-8 border-t border-gray-300 pt-4">
        &copy; {new Date().getFullYear()} Parcel Management System. All rights reserved.
      </div>
    </footer>
  



    </div>
  );
};

export default Home;
