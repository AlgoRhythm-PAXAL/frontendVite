import Navbar from '../../components/User/Navbar';
import {
  FiPackage,
  FiTruck,
  FiMapPin,
  FiClock,
  FiShield,
  FiGlobe,
  
} from 'react-icons/fi';

import { useState } from 'react';
import lottie_animation_1 from '@/assets/lottie/lottie_animation_1.json';
import Lottie from 'lottie-react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useEffect } from 'react';
import lottie_animation_2 from '@/assets/lottie/lottie_animation_2.json';
import lottie_animation_3 from '@/assets/lottie/lottie_animation_3.json';
import { FiDollarSign, FiHeadphones } from 'react-icons/fi';
import Footer from '../../components/User/Footer';
import { useNavigate } from 'react-router-dom';


const HomePage = () => {
  const [currentService, setCurrentService] = useState(0);
  const navigate = useNavigate();


  const services = [
    {
      bgFrom: 'from-blue-50',
      bgTo: 'to-blue-100',
      borderColor: 'border-blue-100',
      iconBg: 'bg-blue-600',
      icon: <FiPackage className="text-4xl" />,
      title: <h3 className="text-blue-600">Parcel Delivery</h3>,
      description:
        'Fast and secure parcel delivery services with Parcel tracking.',
    },
    {
      bgFrom: 'from-teal-50',
      bgTo: 'to-teal-100',
      borderColor: 'border-teal-100',
      iconBg: 'bg-teal-600',
      icon: <FiTruck className="text-4xl" />,
      title: <h3 className="text-teal-600">Express Shipping</h3>,
      description:
        'Need it fast? Our express service delivers your parcels in record time.',
    },
    {
      bgFrom: 'from-purple-50',
      bgTo: 'to-purple-100',
      borderColor: 'border-purple-100',
      iconBg: 'bg-purple-600',
      icon: <FiMapPin className="text-4xl" />,
      title: <h3 className="text-purple-600">Nationwide Coverage</h3>,
      description:
        'We deliver to every corner of Sri Lanka, including remote areas.',
    },
  ];

  // Auto-rotate every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentService((prev) =>
        prev === services.length - 1 ? 0 : prev + 1
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [services.length]);

  const nextService = () => {
    setCurrentService((prev) => (prev === services.length - 1 ? 0 : prev + 1));
  };

  const prevService = () => {
    setCurrentService((prev) => (prev === 0 ? services.length - 1 : prev - 1));
  };

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonials = [
    {
      quote: 'The best delivery service in Sri Lanka! Fast and reliable.',
      name: 'Ravi Perera',
      role: 'Small Business Owner',
    },
    {
      quote: 'I use them for all my e-commerce deliveries. Never had an issue.',
      name: 'Samantha Silva',
      role: 'Online Seller',
    },
    {
      quote:
        'Their tracking system is amazing. Always know where my parcel is.',
      name: 'Dinesh Fernando',
      role: 'Frequent Customer',
    },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) =>
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
      <Navbar />

      {/* New Hero Header Section */}
      <section className="relative bg-white overflow-hidden">
        {/* Background curve SVG */}
        <div className="absolute top-0 left-0 w-full  rotate-180">
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
                <stop offset="0%" stopColor="#D9D9D9" />
                <stop offset="100%" stopColor="white" />
              </linearGradient>
            </defs>
            <path
              fill="url(#topToBottomGradient)"
              fillOpacity="1"
              d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,106.7C672,117,768,171,864,181.3C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
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
              Log incoming and outgoing packages, send notifications and collect
              proof-of-collections in seconds with the Parcel Tracker
              application.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
            
              <button
                   onClick={() => navigate('/signup')}
                    className="bg-[#1f818c] hover:bg-[#16626b] text-white font-medium px-6 py-3 rounded shadow transition duration-200 text-center"
              >
              Sign up for Free
              </button>

               <button
                   onClick={() => navigate('/aboutus')}
                className="border border-[#1f818c] text-[#1f818c] font-medium px-6 py-3 rounded hover:bg-[#f0f9fa] transition duration-200 text-center"
              >
                About Us
              </button>
            </div>
            <p className="text-gray-700">
              Talk to sales team{' '}
               <button
                   onClick={() => navigate('/contactus')} className="text-[#1f818c] font-medium">
                Contact us →
              </button>
            </p>
          </div>

          {/* Image Content */}
          <div className="lg:w-1/2 flex justify-center">
            <Lottie animationData={lottie_animation_1} loop={true} />
          </div>
        </div>
      </section>
      {/* Bottom Highlight Section */}
      <div className="text-center text-xl font-medium text-gray-800 pb-16">
        Simplified parcel management for more than{' '}
        <span className="text-[#1f818c] font-bold">1,000,000</span> deliveries
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
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.bgFrom} ${service.bgTo} rounded-3xl overflow-hidden`}
                  >
                    {/* Content */}
                    <div className="h-full flex flex-col justify-center items-center  text-center">
                      <div
                        className={`${service.iconBg} text-white w-28 h-28 rounded-2xl flex items-center justify-center mx-auto mb-15 transform transition-all duration-500 group-hover:scale-110`}
                      >
                        {service.icon}
                      </div>
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
          <h2 className="text-3xl md:text-5xl font-bold text-center text-[#1f818c] mb-16">
            How It Works
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-between relative">
            {/* Timeline bar */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-1 bg-green-200"></div>

            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className="mb-12 md:mb-0 text-center md:w-1/4 px-4 relative group"
              >
                <div className="bg-[#1f818c] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 transform group-hover:scale-110 transition-transform">
                  <span className="font-bold text-xl">{step}</span>
                </div>
                <h2 className="text-xl font-semibold mb-3 text-black">
                  {step === 1 && 'Book a Pickup'}
                  {step === 2 && 'We Process'}
                  {step === 3 && 'On the Way'}
                  {step === 4 && 'Delivered'}
                </h2>
                <p className="text-gray-600">
                  {step === 1 && 'Schedule a pickup or drop off your parcel'}
                  {step === 2 && 'Our team processes your parcel for delivery'}
                  {step === 3 && 'Track your parcel'}
                  {step === 4 && 'Your parcel arrives safely'}
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
            
            <div className="lg:w-1/3">
              <Lottie animationData={lottie_animation_2} loop={true} />
            </div>

            {/* Text Content */}
            <div className="lg:w-1/3">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1f818c] mb-6">
                Quickly Scan Labels
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Use the Parcel Tracker app to scan the name or barcode on a
                parcel's label. Parcel Tracker will automatically recognize the
                recipient, snap a photo of the parcel and send them a
                notification in seconds!
              </p>
              <p className="text-lg text-gray-700 mb-8">
                You can even scan multiple parcels in one go and send out batch
                notifications. Our users save an average of{' '}
                <span className="font-bold text-[#1f818c]">
                  1,250 hours a year
                </span>
                . What would you do with this extra time?
              </p>
               <button
                   onClick={() => navigate('/moreabout')}
                className="inline-flex items-center text-[#1f818c] font-semibold text-lg border-b-2 border-[#1f818c] pb-1 hover:text-[#16626b] transition-colors"
              >
                Learn more about Scanning
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </button>
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
              Add Your Pickup Point,  <br />
              Simplify Deliveries
              </h2>
              <p className="text-lg text-gray-700 mb-6">
              Join our network by adding your pickup point to our system. Collect parcels conveniently and ensure smooth delivery to their destinations.

              </p>
              <p className="text-lg text-gray-700 mb-8">
              It's easy, efficient, and a great way to be part of a trusted delivery ecosystem!
              </p>
               <button
                   onClick={() => navigate('/moreabout')}
                className="inline-flex items-center text-[#1f818c] font-semibold text-lg border-b-2 border-[#1f818c] pb-1 hover:text-[#16626b] transition-colors"
              >
                Learn more about Notifications
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </button>
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
                        Our optimized network ensures 98% of parcels reach their
                        destination within 24 hours.
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
                        Every parcel is insured and handled with care, with
                        99.9% safe delivery rate.
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
                        Serving all 25 districts in Sri Lanka, including remote
                        areas with our special delivery network.
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
                        Save up to 40% compared to competitors with our
                        optimized logistics network.
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
                        Real-time tracking and dedicated support team available
                        anytime you need help.
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
                style={{
                  transform: `translateX(-${currentTestimonial * 100}%)`,
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
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
                          <div className="font-semibold text-gray-800">
                            {testimonial.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {testimonial.role}
                          </div>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Send a Parcel?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us with their
            deliveries
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <button
                   onClick={() => navigate('/addparcel')} className="bg-white text-[#1f818c] hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg text-lg">
              Book a Pickup Now
            </button>
             <button
                   onClick={() => navigate('/contactus')} className="border-2 border-white text-white hover:bg-white hover:text-[#1f818c] px-8 py-4 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg text-lg">
              Contact Our Team
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
     <Footer/>
    </div>
  );
};

export default HomePage;
