// // import React from 'react'
// import Navbar from '../../components/User/Navbar'
// import { useState } from "react";
// import { motion } from "framer-motion";

//       {/* Footer */}
//       import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

// const Home = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const slides = [
//     "Parcel Tracker has been a game-changer!",
//     "Delivery updates are always on time!",
//     "The best parcel service I've ever used!",
//   ];

//   const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

//   return (
//     <div className="font-sans">
//       {/* Navbar */}
//       <Navbar />

//       {/* Hero Section */}
//       <section className="text-center py-16 bg-gray-50">
//         <h1 className="text-4xl font-bold text-gray-800">
//           Seamless Parcel Delivery Simplified!
//         </h1>
//         <p className="mt-4 text-gray-600">
//           Trusted by millions for smooth, stress-free deliveries worldwide.
//         </p>
//         <button className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg">
//           Get Started
//         </button>
//       </section>

      

//       {/* Features */}
//       <div className="space-y-12 py-12 px-6">
//         {[
//           "Track Your Parcel in Seconds",
//           "Add Your Pickup Point, Simplify Deliveries",
//           "Smart, Unique Status Notifications",
//         ].map((feature, index) => (
//           <div key={index} className="flex flex-col items-center text-center">
//             <h2 className="text-2xl font-semibold text-gray-700">{feature}</h2>
//             <p className="text-gray-500 max-w-md mt-2">
//               Experience seamless tracking and updates in real-time.
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Testimonial Slider */}
//       <div className="relative bg-red-500 text-white py-12 text-center">
//         <motion.div
//           key={currentSlide}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <p className="text-xl font-semibold">{slides[currentSlide]}</p>
//         </motion.div>
//         <button
//           onClick={nextSlide}
//           className="mt-6 px-4 py-2 bg-white text-red-500 rounded"
//         >
//           Next
//         </button>
//       </div>

//       {/* FAQ */}
//       <div className="py-12 px-6">
//         <h2 className="text-2xl font-semibold text-gray-700 text-center">
//           Frequently Asked Questions
//         </h2>
//         <div className="space-y-4 mt-6">
//           {[
//             "How do I track my parcel?",
//             "Can I change my delivery address?",
//             "What if my parcel is lost?",
//           ].map((faq, index) => (
//             <details key={index} className="border p-4 rounded">
//               <summary className="cursor-pointer font-medium">{faq}</summary>
//               <p className="mt-2 text-gray-600">
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//               </p>
//             </details>
//           ))}
//         </div>
//       </div>



//     <footer className="bg-gray-100 text-gray-800 py-12 px-6 md:px-16">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
//         {/* Help & Support */}
//         <div>
//           <h3 className="text-lg font-semibold text-blue-600">Help & Support</h3>
//           <ul className="mt-2 space-y-2 text-sm">
//             <li><a href="#" className="hover:underline">Customer Service</a></li>
//             <li><a href="#" className="hover:underline">Delivery Information</a></li>
//             <li><a href="#" className="hover:underline">Returns & Orders</a></li>
//             <li><a href="#" className="hover:underline">Claims & Complaints</a></li>
//             <li><a href="#" className="hover:underline">Privacy Policy</a></li>
//             <li><a href="#" className="hover:underline">Cookie Policy</a></li>
//           </ul>
//         </div>

//         {/* User Account & Parcel Tools */}
//         <div>
//           <h3 className="text-lg font-semibold text-blue-600">User Account</h3>
//           <ul className="mt-2 space-y-2 text-sm">
//             <li><a href="#" className="hover:underline">My Orders</a></li>
//             <li><a href="#" className="hover:underline">Account Settings</a></li>
//             <li><a href="#" className="hover:underline">Change Password</a></li>
//           </ul>
//           <h3 className="text-lg font-semibold text-blue-600 mt-6">Quick Parcel Tools</h3>
//           <ul className="mt-2 space-y-2 text-sm">
//             <li><a href="#" className="hover:underline">Track My Parcel</a></li>
//             <li><a href="#" className="hover:underline">Change Address</a></li>
//           </ul>
//         </div>

//         {/* Newsletter Subscription */}
//         <div>
//           <h3 className="text-lg font-semibold text-blue-600">Newsletter Subscription</h3>
//           <p className="text-sm mt-2">Want updates on your parcel? Subscribe for instant notifications!</p>
//           <div className="mt-3">
//             <input
//               type="email"
//               placeholder="example@mail.com"
//               className="w-full p-2 border border-gray-300 rounded-md"
//             />
//             <button className="mt-2 w-full bg-black text-white py-2 rounded-md">Send</button>
//           </div>
//           <p className="text-sm mt-4">Stay connected with us on social media!</p>
//           <div className="flex space-x-4 mt-2 text-2xl">
//             <FaFacebook className="cursor-pointer hover:text-blue-600" />
//             <FaTwitter className="cursor-pointer hover:text-blue-400" />
//             <FaInstagram className="cursor-pointer hover:text-pink-500" />
//             <FaYoutube className="cursor-pointer hover:text-red-500" />
//           </div>
//         </div>

//         {/* Contact Information */}
//         <div>
//           <h3 className="text-lg font-semibold text-blue-600">Contact Information</h3>
//           <p className="text-sm mt-2">Address:</p>
//           <p className="text-sm">Parcel HQ Lane, Colombo, Sri Lanka</p>
//           <p className="text-sm mt-2">Email: <a href="mailto:support@parcel.com" className="text-blue-600 hover:underline">support@parcel.com</a></p>
//           <p className="text-sm mt-2">Support Hotline: +94 123 4567</p>
//         </div>
//       </div>
      
//       {/* Copyright */}
//       <div className="text-center text-gray-600 text-sm mt-8 border-t border-gray-300 pt-4">
//         &copy; {new Date().getFullYear()} Parcel Management System. All rights reserved.
//       </div>
//     </footer>
  



//     </div>
//   );
// };

// export default Home;







// import React from 'react';
// import { FaPlay, FaShippingFast, FaMapMarkerAlt, FaHeadset, FaShieldAlt } from 'react-icons/fa';

// const HomePage = () => {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Section */}
//       <section className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-20">
//         <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
//           <div className="md:w-1/2 mb-10 md:mb-0">
//             <h1 className="text-4xl md:text-5xl font-bold mb-4">Seamless Parcel Delivery Simplified!</h1>
//             <p className="text-xl mb-8">Reliable parcel delivery made easy. We care about your deliveries as much as you do.</p>
//             <div className="flex flex-col sm:flex-row gap-4">
//               <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105">
//                 Get Started
//               </button>
//               <button className="flex items-center justify-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
//                 <FaPlay /> Watch Video
//               </button>
//             </div>
//           </div>
//           <div className="md:w-1/2 flex justify-center">
//             <img 
//               src="https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
//               alt="Delivery Service" 
//               className="rounded-lg shadow-2xl max-w-full h-auto"
//             />
//           </div>
//         </div>
//       </section>

//       {/* Trust Badges */}
//       <section className="py-12 bg-white">
//         <div className="container mx-auto px-4">
//           <p className="text-center text-gray-500 mb-8">TRUSTED BY MILLIONS WORLDWIDE</p>
//           <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
//             {[1, 2, 3, 4, 5].map((item) => (
//               <div key={item} className="h-12 grayscale hover:grayscale-0 transition duration-300">
//                 <img 
//                   src={`https://logo.clearbit.com/company${item}.com`} 
//                   alt="Trusted Company" 
//                   className="h-full object-contain opacity-70 hover:opacity-100"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-20 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-4">Hassle-Free Deliveries Worldwide</h2>
//           <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
//             We provide seamless parcel delivery services with real-time tracking and exceptional customer support.
//           </p>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[
//               {
//                 icon: <FaShippingFast className="text-4xl mb-4 text-blue-600" />,
//                 title: "Fast Delivery",
//                 desc: "Get your parcels delivered in record time with our optimized logistics network."
//               },
//               {
//                 icon: <FaMapMarkerAlt className="text-4xl mb-4 text-red-500" />,
//                 title: "Real-Time Tracking",
//                 desc: "Track your shipments in seconds with our advanced tracking system."
//               },
//               {
//                 icon: <FaHeadset className="text-4xl mb-4 text-green-500" />,
//                 title: "24/7 Support",
//                 desc: "Our customer service team is always ready to assist you with any queries."
//               }
//             ].map((feature, index) => (
//               <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
//                 {feature.icon}
//                 <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
//                 <p className="text-gray-600">{feature.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Tracking Section */}
//       <section className="py-20 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
//         <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
//           <div className="md:w-1/2 mb-10 md:mb-0">
//             <h2 className="text-3xl font-bold mb-4">Track Your Parcel in Seconds</h2>
//             <p className="text-xl mb-8 opacity-90">
//               Stay informed with real-time updates about your shipment's journey from pickup to delivery.
//             </p>
//             <div className="flex">
//               <input 
//                 type="text" 
//                 placeholder="Enter tracking ID" 
//                 className="flex-grow py-3 px-4 rounded-l-lg focus:outline-none text-gray-800"
//               />
//               <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-r-lg transition duration-300">
//                 Track
//               </button>
//             </div>
//           </div>
//           <div className="md:w-1/2 flex justify-center">
//             <img 
//               src="https://images.unsplash.com/photo-1581093450021-4a7360e9a3c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
//               alt="Tracking" 
//               className="rounded-lg shadow-2xl max-w-full h-auto"
//             />
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-16 bg-white">
//         <div className="container mx-auto px-4 text-center">
//           <h2 className="text-3xl font-bold mb-4">Wanna Know More?</h2>
//           <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
//             Contact us today to learn how we can simplify your parcel delivery needs.
//           </p>
//           <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105">
//             Contact Us 😊
//           </button>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-12">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//             <div>
//               <h3 className="text-xl font-bold mb-4">SwiftParcel</h3>
//               <p className="text-gray-400">Making parcel delivery seamless and reliable worldwide.</p>
//             </div>
//             <div>
//               <h4 className="font-bold mb-4">Services</h4>
//               <ul className="space-y-2">
//                 <li><a href="#" className="text-gray-400 hover:text-white transition">Domestic Delivery</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-white transition">International Shipping</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-white transition">Express Delivery</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-white transition">Warehousing</a></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-bold mb-4">Company</h4>
//               <ul className="space-y-2">
//                 <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-white transition">Careers</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-white transition">Contact</a></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-bold mb-4">Connect With Us</h4>
//               <div className="flex space-x-4 mb-4">
//                 <a href="#" className="text-gray-400 hover:text-white transition text-xl"><i className="fab fa-facebook"></i></a>
//                 <a href="#" className="text-gray-400 hover:text-white transition text-xl"><i className="fab fa-twitter"></i></a>
//                 <a href="#" className="text-gray-400 hover:text-white transition text-xl"><i className="fab fa-instagram"></i></a>
//                 <a href="#" className="text-gray-400 hover:text-white transition text-xl"><i className="fab fa-linkedin"></i></a>
//               </div>
//               <p className="text-gray-400">support@swiftparcel.com</p>
//               <p className="text-gray-400">+1 (800) 123-4567</p>
//             </div>
//           </div>
//           <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
//             <p>© {new Date().getFullYear()} SwiftParcel. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default HomePage;


// import React from 'react';
// import { FaPlay, FaSearch, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import Navbar from '../../components/User/Navbar';
import { FiSearch, FiPackage, FiTruck, FiMapPin, FiClock, FiShield, FiGlobe, FiMail, FiPhone, FiMap, FiUser, FiLock, FiShoppingBag, FiHelpCircle, FiCreditCard, FiGift, FiAlertTriangle } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useState } from 'react';
import lottie_animation_1 from "../../assets/lottie/lottie_animation_1.json";
import Lottie from "lottie-react";
import { FiBell, FiCamera, FiArrowRight } from 'react-icons/fi';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useEffect } from 'react';
import lottie_animation_2 from "../../assets/lottie/lottie_animation_2.json";
import lottie_animation_3 from "../../assets/lottie/lottie_animation_3.json";
import {  FiDollarSign, FiHeadphones, FiPlay } from 'react-icons/fi';






const HomePage = () => {

  
  const [currentService, setCurrentService] = useState(0);

  const services = [
    {
      bgFrom: 'from-blue-50',
      bgTo: 'to-blue-100',
      borderColor: 'border-blue-100',
      iconBg: 'bg-blue-600',
      icon: <FiPackage className="text-4xl" />,
      title:  <h3 className="text-blue-600">Parcel Delivery</h3>,
      description: 'Fast and secure parcel delivery services with real-time tracking.'
    },
    {
      bgFrom: 'from-teal-50',
      bgTo: 'to-teal-100',
      borderColor: 'border-teal-100',
      iconBg: 'bg-teal-600',
      icon: <FiTruck className="text-4xl" />,
      title: <h3 className="text-teal-600">Express Shipping</h3>,
      description: 'Need it fast? Our express service delivers your parcels in record time.'
    },
    {
      bgFrom: 'from-purple-50',
      bgTo: 'to-purple-100',
      borderColor: 'border-purple-100',
      iconBg: 'bg-purple-600',
      icon: <FiMapPin className="text-4xl" />,
      title:  <h3 className="text-purple-600">Nationwide Coverage</h3>  ,
      description: 'We deliver to every corner of Sri Lanka, including remote areas.'
    }
  ];

  // Auto-rotate every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentService(prev => (prev === services.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, [services.length]);

  const nextService = () => {
    setCurrentService(prev => (prev === services.length - 1 ? 0 : prev + 1));
  };

  const prevService = () => {
    setCurrentService(prev => (prev === 0 ? services.length - 1 : prev - 1));
  };




  const [currentTestimonial, setCurrentTestimonial] = useState(0);
const testimonials = [
  {
    quote: "The best delivery service in Sri Lanka! Fast and reliable.",
    name: "Ravi Perera",
    role: "Small Business Owner"
  },
  {
    quote: "I use them for all my e-commerce deliveries. Never had an issue.",
    name: "Samantha Silva",
    role: "Online Seller"
  },
  {
    quote: "Their tracking system is amazing. Always know where my parcel is.",
    name: "Dinesh Fernando",
    role: "Frequent Customer"
  }
];

const nextTestimonial = () => {
  setCurrentTestimonial(prev => 
    prev === testimonials.length - 1 ? 0 : prev + 1
  );
};

const prevTestimonial = () => {
  setCurrentTestimonial(prev => 
    prev === 0 ? testimonials.length - 1 : prev - 1
  );
};

// Auto-rotation (optional)
useEffect(() => {
  const interval = setInterval(nextTestimonial, 5000);
  return () => clearInterval(interval);
}, []);



  return (
    <div className="min-h-screen bg-gray-50">
    <Navbar/>
    
    {/* New Hero Header Section */}
    <section className="relative bg-white overflow-hidden">
      {/* Background curve SVG */}
      <div className="absolute top-0 left-0 w-full  rotate-180">
        <svg className="w-full h-auto" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
        <defs>
      <linearGradient id="topToBottomGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#D9D9D9" />
        <stop offset="100%" stopColor="white" />
      </linearGradient>
    </defs>
          <path fill="url(#topToBottomGradient)" fillOpacity="1" d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,106.7C672,117,768,171,864,181.3C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>


      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col lg:flex-row items-center justify-between">
        {/* Text Content */}
        <div className="lg:w-1/2 mb-10 lg:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Parcel Management <br />
            <span className="text-[#1f818c]">Made Easy</span>
          </h1>
          <p className="text-gray-700 text-lg mb-6 max-w-md">
            Log incoming and outgoing packages, send notifications and collect proof-of-collections in seconds with the Parcel Tracker application.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <a href="#" className="bg-[#1f818c] hover:bg-[#16626b] text-white font-medium px-6 py-3 rounded shadow transition duration-200 text-center">
              Sign up for Free
            </a>
            <a href="#" className="border border-[#1f818c] text-[#1f818c] font-medium px-6 py-3 rounded hover:bg-[#f0f9fa] transition duration-200 text-center">
              Watch Video
            </a>
          </div>
          <p className="text-gray-700">
            Talk to sales team <a href="#" className="text-[#1f818c] font-medium">Contact us →</a>
          </p>
        </div>

        {/* Image Content - Replace with your actual image path */}
        <div className="lg:w-1/2 flex justify-center">
        <Lottie animationData={lottie_animation_1} loop={true} />
        </div>
      </div>

     
    </section>
     {/* Bottom Highlight Section */}
     <div className="text-center text-xl font-medium text-gray-800 pb-16">
        Simplified parcel management for more than <span className="text-[#1f818c] font-bold">1,000,000</span> deliveries
      </div>
  
    
    

     {/* Services Carousel Section */}
     <div className="py-10 bg-gradient-to-br from-[#FE5E6A] to-[#FF8E53]">
  <div className="container mx-auto px-4 sm:px-6">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Our Premium Services
      </h2>
      <p className="text-xl text-white/90 max-w-2xl mx-auto">
        Trusted by over 1,000,000 satisfied customers worldwide
      </p>
    </div>

    {/* Enhanced Carousel */}
    <div className="relative group">
      {/* Slides Container */}
      <div className="relative h-[400px]  justify-center ml-[150px] mr-[150px] overflow-hidden rounded-3xl">
        {services.map((service, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700  ${currentService === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${service.bgFrom} ${service.bgTo} rounded-3xl overflow-hidden`}>
             
              {/* Content */}
              <div className="h-full flex flex-col justify-center items-center  text-center">
                <div className={`${service.iconBg} text-white w-28 h-28 rounded-2xl flex items-center justify-center mx-auto mb-15 transform transition-all duration-500 group-hover:scale-110`}>
                  {service.icon}
                </div >
                <h3 className="text-4xl md:text-5xl font-bold  mt-5 mb-13">
                  {service.title}
                 
                </h3>
                <p className="text-xl text-[#FE5E6A] max-w-2xl mx-auto mb-12 leading-relaxed">
                  {service.description}
                </p>
               
              
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevService}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-4 rounded-full shadow-2xl hover:bg-white/30 transition-all duration-300 z-20 group-hover:opacity-100 opacity-0 md:opacity-100 hover:scale-110"
      >
        <FiChevronLeft className="text-white text-3xl" />
      </button>
      <button 
        onClick={nextService}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-4 rounded-full shadow-2xl hover:bg-white/30 transition-all duration-300 z-20 group-hover:opacity-100 opacity-0 md:opacity-100 hover:scale-110"
      >
        <FiChevronRight className="text-white text-3xl" />
      </button>

      {/* Enhanced Indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3 z-20">
        {services.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentService(index)}
            className={`w-5 h-2 rounded-full transition-all duration-300 ${currentService === index ? 'bg-white w-8' : 'bg-white/40 w-4 hover:w-6'}`}
            aria-label={`Go to service ${index + 1}`}
          />
        ))}
      </div>

  
    </div>
  </div>
</div>

      {/* How It Works */}
      <div className="py-20 bg-gradient-to-r from-green-50 to-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-[#1f818c] mb-16">How It Works</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-between relative">
            {/* Timeline bar */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-1 bg-green-200"></div>
            
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="mb-12 md:mb-0 text-center md:w-1/4 px-4 relative group">
                <div className="bg-[#1f818c] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 transform group-hover:scale-110 transition-transform">
                  <span className="font-bold text-xl">{step}</span>
                </div>
                <h2 className="text-xl font-semibold mb-3 text-black">
                  {step === 1 && "Book a Pickup"}
                  {step === 2 && "We Process"}
                  {step === 3 && "On the Way"}
                  {step === 4 && "Delivered"}
                </h2>
                <p className="text-gray-600">
                  {step === 1 && "Schedule a pickup or drop off your parcel"}
                  {step === 2 && "Our team processes your parcel for delivery"}
                  {step === 3 && "Track your parcel"}
                  {step === 4 && "Your parcel arrives safely"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>



{/* Scan Labels Section */}
<section className="py-24 bg-[#f6f6f9]">
  <div className="container mx-auto px-6">
    <div className="flex flex-col lg:flex-row items-center gap-12">
      {/* Image/Illustration - Replace with your actual image */}
      <div className="lg:w-1/3">
        <Lottie animationData={lottie_animation_2} loop={true} />
      </div>
      
      {/* Text Content */}
      <div className="lg:w-1/3">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1f818c] mb-6">
          Quickly Scan Labels
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Use the Parcel Tracker app to scan the name or barcode on a parcel's label. 
          Parcel Tracker will automatically recognize the recipient, snap a photo of 
          the parcel and send them a notification in seconds!
        </p>
        <p className="text-lg text-gray-700 mb-8">
          You can even scan multiple parcels in one go and send out batch notifications. 
          Our users save an average of <span className="font-bold text-[#1f818c]">1,250 hours a year</span>. 
          What would you do with this extra time?
        </p>
        <a 
          href="#" 
          className="inline-flex items-center text-[#1f818c] font-semibold text-lg border-b-2 border-[#1f818c] pb-1 hover:text-[#16626b] transition-colors"
        >
          Learn more about Scanning
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </a>
      </div>
    </div>
  </div>
</section>

{/* Notifications Section */}
<section className="py-24 bg-white">
  <div className="container mx-auto px-6">
    <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
      {/* Image/Illustration - Replace with your actual image */}
      <div className="lg:w-1/3">
      <Lottie animationData={lottie_animation_3} loop={true} />
      </div>
      
      {/* Text Content */}
      <div className="lg:w-1/2">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1f818c] mb-6">
          Automate Notifications <br />
          and Speed Up Collections
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Once all the parcels are scanned they will be grouped by recipient and 
          notifications sent for collection. These can be Email, SMS, WhatsApp, 
          Slack and Teams notifications.
        </p>
        <p className="text-lg text-gray-700 mb-8">
          You can even link it to your own app via our API and Webhooks for 
          complete integration with your existing systems.
        </p>
        <a 
          href="#" 
          className="inline-flex items-center text-[#1f818c] font-semibold text-lg border-b-2 border-[#1f818c] pb-1 hover:text-[#16626b] transition-colors"
        >
          Learn more about Notifications
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </a>
      </div>
    </div>
  </div>
</section>

    
      

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-br from-gray-100 to-gray-50">
  <div className="container mx-auto px-6">
    <div className="flex justify-center">
      {/* Reasons Section */}
      <div className="w-full max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
          Why <span className="text-[#1f818c]">Choose Us?</span>
        </h2>

        <div className="space-y-6 text-left">
          {/* Reason 1 */}
          <div className="p-6 rounded-xl bg-gray-50 border border-gray-200 hover:border-[#1f818c]/30 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-start">
              <div className="bg-[#1f818c] p-3 rounded-full mr-4 text-white group-hover:bg-[#1f818c] group-hover:text-white transition-colors">
                <FiClock className="text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#1f818c] group-hover:text-gray-800 transition-colors">
                  Fast Delivery
                </h3>
                <p className="text-gray-600">
                  Our optimized network ensures 98% of parcels reach their destination within 24 hours.
                </p>
              </div>
            </div>
          </div>

          {/* Reason 2 */}
          <div className="p-6 rounded-xl  bg-[#D9D9D9] border border-gray-200 hover:border-[#1f818c]/30 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-start">
              <div className="bg-[#1f818c]/10 p-3 rounded-full mr-4 text-[#1f818c] group-hover:bg-[#1f818c] group-hover:text-white transition-colors">
                <FiShield className="text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-[#1f818c] transition-colors">
                  Secure Handling
                </h3>
                <p className="text-gray-600">
                  Every parcel is insured and handled with care, with 99.9% safe delivery rate.
                </p>
              </div>
            </div>
          </div>

          {/* Reason 3 */}
          <div className="p-6 rounded-xl bg-[#D9D9D9]  border border-gray-200 hover:border-[#1f818c]/30 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-start">
              <div className="bg-[#1f818c]/10 p-3 rounded-full mr-4 text-[#1f818c] group-hover:bg-[#1f818c] group-hover:text-white transition-colors">
                <FiGlobe className="text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-[#1f818c] transition-colors">
                  Nationwide Coverage
                </h3>
                <p className="text-gray-600">
                  Serving all 25 districts in Sri Lanka, including remote areas with our special delivery network.
                </p>
              </div>
            </div>
          </div>

          {/* Reason 4 */}
          <div className="p-6 rounded-xl bg-[#D9D9D9]  border border-gray-200 hover:border-[#1f818c]/30 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-start">
              <div className="bg-[#1f818c]/10 p-3 rounded-full mr-4 text-[#1f818c] group-hover:bg-[#1f818c] group-hover:text-white transition-colors">
                <FiDollarSign className="text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-[#1f818c] transition-colors">
                  Competitive Pricing
                </h3>
                <p className="text-gray-600">
                  Save up to 40% compared to competitors with our optimized logistics network.
                </p>
              </div>
            </div>
          </div>

          {/* Reason 5 */}
          <div className="p-6 rounded-xl bg-[#D9D9D9]  border border-gray-200 hover:border-[#1f818c]/30 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-start">
              <div className="bg-[#1f818c]/10 p-3 rounded-full mr-4 text-[#1f818c] group-hover:bg-[#1f818c] group-hover:text-white transition-colors">
                <FiHeadphones className="text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-[#1f818c] transition-colors">
                  24/7 Customer Support
                </h3>
                <p className="text-gray-600">
                  Real-time tracking and dedicated support team available anytime you need help.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>



      {/* Testimonials */}
      <div className="py-20 bg-gradient-to-br from-gray-100 to-gray-50">
  <div className="container mx-auto px-6">
    <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16">
      What Our Customers Say
    </h2>
    
    {/* Carousel Container */}
    <div className="relative">
      {/* Touch-Slidable Area */}
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="w-full flex-shrink-0 px-4"
            >
              <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
                <div className="text-yellow-400 mb-4 text-2xl">★★★★★</div>
                <p className="text-gray-600 italic text-lg mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <div className="bg-[#1f818c] text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevTestimonial}
        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg z-10 transition-all"
      >
        <FiChevronLeft className="text-[#1f818c] text-2xl" />
      </button>
      <button 
        onClick={nextTestimonial}
        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg z-10 transition-all"
      >
        <FiChevronRight className="text-[#1f818c] text-2xl" />
      </button>

      {/* Indicators */}
      <div className="flex justify-center mt-10 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentTestimonial(index)}
            className={`w-3 h-3 rounded-full transition-all ${currentTestimonial === index ? 'bg-[#1f818c] w-6' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  </div>
</div>

{/* Enhanced CTA Section */}
<div className="py-20 bg-gradient-to-r from-[#131528] to-[#1f818c] text-white">
  <div className="container mx-auto px-6 text-center">
    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Send a Parcel?</h2>
    <p className="text-xl mb-8 max-w-2xl mx-auto">
      Join thousands of satisfied customers who trust us with their deliveries
    </p>
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <button className="bg-white text-[#1f818c] hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg text-lg">
        Book a Pickup Now
      </button>
      <button className="border-2 border-white text-white hover:bg-white hover:text-[#1f818c] px-8 py-4 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg text-lg">
        Contact Our Team
      </button>
    </div>
  </div>
</div>

      {/* Footer */}
      <footer className="bg-[#f3f3f3] text-black pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           {/* User Account */}
           <div>
              <h3 className="text-[#1f818c] text-2xl font-semibold mb-4 flex items-center">
                <FiUser className="mr-2" /> User Account
              </h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition-colors">My Orders</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Account Settings</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Change Password</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-[#1f818c] text-2xl font-semibold mb-4 flex items-center">
                <FiAlertTriangle className="mr-2" /> Legal
              </h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>

               {/* Help & Support */}
               <div>
              <h3 className="text-[#1f818c] text-2xl font-semibold mb-4 flex items-center">
                <FiHelpCircle className="mr-2" /> Help & Support
              </h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition-colors">Customer Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Delivery Information</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Payment Options</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Claims & Corrections</a></li>
              </ul>
            </div>

           

            {/* Newsletter */}
            <div>
              <h3 className="text-[#1f818c] text-2xl font-semibold mb-4 flex items-center">
                <FiMail className="mr-2" /> Newsletter
              </h3>
              <p className="mb-4">Subscribe for instant notifications!</p>
              <div className="flex mb-6">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="bg-gray-25 text-white px-4 py-2 rounded-l-lg outline-none flex-grow"
                />
                <button className="bg-[#1f818c] hover:bg-[#1f818c] text-white px-4 py-2 rounded-r-lg transition-colors">
                  Subscribe
                </button>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-[#1f818c] hover:text-white transition-colors"><FaFacebook size={40} /></a>
                <a href="#" className="text-[#1f818c] hover:text-white transition-colors"><FaTwitter size={40} /></a>
                <a href="#" className="text-[#1f818c] hover:text-white transition-colors"><FaInstagram size={40} /></a>
                <a href="#" className="text-[#1f818c] hover:text-white transition-colors"><FaLinkedin size={40} /></a>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="flex items-start">
              <FiMap className="text-[#1f818c] text-2xl mt-1 mr-3" />
              <div>
                <h4 className="text-[#1f818c] text-2xl font-medium mb-2">Address</h4>
                <p>Parcel HQ<br />123 Contact Lane, Colombo, Sri Lanka</p>
              </div>
            </div>
            <div className="flex  ml-1 items-start">
              {/* <FiMail className="text-[#1f818c] text-2xl mt-1 mr-3" />
              <div>
                <h4 className="text-[#1f818c] text-2xl font-medium mb-2">Support Email</h4>
                <p>support@parcelmanage.com</p>
              </div> */}
            </div>
            <div className="flex ml-28 items-start">
              <FiPhone className="text-[#1f818c] text-2xl mt-1 mr-3" />
              <div>
                <h4 className="text-[#1f818c] text-2xl  font-medium mb-2">Support Hotline</h4>
                <p>+94 123 4567</p>
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="border-t border-black pt-5">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h4 className="text-[#1f818c] text-0.5xl font-medium mb-2">Company Information</h4>
                <div className="flex flex-wrap gap-4">
                  <a href="#" className="hover:text-white transition-colors">About Us</a>
                  <a href="#" className="hover:text-white transition-colors">Careers</a>
                  <a href="#" className="hover:text-white transition-colors">Sustainability</a>
                  
                </div>
              </div>
              <div className="text-sm">
                © {new Date().getFullYear()} Parcel Tracker. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;