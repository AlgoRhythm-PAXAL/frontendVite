import React, { useState } from 'react';
import { FiUser, FiMail, FiPackage, FiSend, FiClock } from 'react-icons/fi';
import Lottie from 'lottie-react';
import contactus from '/../frontend_vite/src/assets/lottie/contactus.json';
import Navbar from '../../components/User/Navbar';
import Footer from '../../components/User/Footer';
import toast from 'react-hot-toast';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    parcelTrackingNo: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // In your React component
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        'http://localhost:8000/api/inquiries/postinquiry',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            parcelTrackingNo: formData.parcelTrackingNo,
            message: formData.message,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success('Your inquiry has been submitted successfully');
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          parcelTrackingNo: '',
          message: '',
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Top SVG Divider */}

      {/* Contact Section */}
      <div className="min-h-screen  relative bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
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

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center relative mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Contact Our <span className="text-[#1f818c]">Support Team</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions or need assistance? We're here to help you 24/7.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Send us a message
                </h2>

                {submitSuccess && (
                  <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                    Thank you! Your message has been sent successfully. We'll
                    contact you shortly.
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Your Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1f818c] focus:border-[#1f818c] transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1f818c] focus:border-[#1f818c] transition-all"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    {/* Parcel Tracking No */}
                    <div>
                      <label
                        htmlFor="parcelTrackingNo"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Parcel Tracking Number (Optional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiPackage className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="parcelTrackingNo"
                          name="parcelTrackingNo"
                          value={formData.parcelTrackingNo}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1f818c] focus:border-[#1f818c] transition-all"
                          placeholder="SL123456789"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1f818c] focus:border-[#1f818c] transition-all"
                        placeholder="How can we help you?"
                      ></textarea>
                    </div>

                    {/* Submit */}
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full flex items-center justify-center px-6 py-4 border border-transparent rounded-lg shadow-sm text-white font-medium ${
                          isSubmitting
                            ? 'bg-[#1f818c]/80'
                            : 'bg-[#1f818c] hover:bg-teal-600'
                        } transition-all`}
                      >
                        {isSubmitting ? (
                          'Sending...'
                        ) : (
                          <>
                            <FiSend className="mr-2" />
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Side: Lottie Animation + Office Hours */}
            <div className="flex  flex-col items-center lg:items-end mt-10 mb-5">
              {/* Lottie Animation */}
              <div className="w-full max-w-md">
                <Lottie
                  animationData={contactus}
                  loop={true}
                  className="w-full h-auto"
                />
              </div>

              {/* Office Hours Box */}
              <div className="w-full max-w-md bg-gradient-to-r from-[#1f818c] to-teal-400 rounded-2xl shadow-xl p-8 text-white">
                <div className="flex items-start">
                  <div className="bg-white/20 p-3 rounded-full mr-4">
                    <FiClock className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Office Hours</h3>
                    <p className="mb-1">Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p>Saturday: 9:00 AM - 3:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactUsPage;
