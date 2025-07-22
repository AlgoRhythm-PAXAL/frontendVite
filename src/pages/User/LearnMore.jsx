import React, { useState } from 'react';
import Navbar from '../../components/User/Navbar';
import Footer from '../../components/User/Footer';
import { 
  FiSearch, 
  FiPackage, 
  FiBell, 
  FiCamera, 
  FiArrowRight,
  FiChevronRight,
  FiCheck,
  FiClock,
  FiUsers,
  FiBarChart2,
  FiSmartphone,
  FiMail,
  FiMessageSquare,
  FiPhone,
  FiShield,
  FiGlobe,
  FiTruck,
  FiHome
} from 'react-icons/fi';
import Lottie from 'lottie-react';
import scanningAnimation from '@/assets/lottie/QRScan.json';
import notificationAnimation from '@/assets/lottie/Notification.json';

const FeaturesDetailsPage = () => {
  // Features data
  const scanningFeatures = [
    {
      icon: <FiCamera className="text-2xl" />,
      title: "Barcode Scanning",
      description: "Quickly scan any barcode or QR code on parcels for instant recognition."
    },
    {
      icon: <FiUsers className="text-2xl" />,
      title: "Recipient Auto-Detection",
      description: "Our system automatically identifies the recipient from the scanned data."
    },
    {
      icon: <FiCheck className="text-2xl" />,
      title: "Batch Processing",
      description: "Scan multiple parcels at once for efficient bulk processing."
    },
    {
      icon: <FiSmartphone className="text-2xl" />,
      title: "Mobile Friendly",
      description: "Works seamlessly on all mobile devices with camera capabilities."
    }
  ];

  const notificationFeatures = [
    {
      icon: <FiMail className="text-2xl" />,
      title: "Multi-Channel Alerts",
      description: "Send notifications via Email, SMS, WhatsApp, and more."
    },
    {
      icon: <FiClock className="text-2xl" />,
      title: "Real-Time Updates",
      description: "Recipients get instant alerts when their parcel arrives."
    },
    {
      icon: <FiBarChart2 className="text-2xl" />,
      title: "Delivery Analytics",
      description: "Track notification open rates and response times."
    },
    {
      icon: <FiMessageSquare className="text-2xl" />,
      title: "Custom Messages",
      description: "Personalize notifications with your brand voice."
    }
  ];

  const [activeBenefit, setActiveBenefit] = useState(0);

  const benefits = [
    {
      title: "90% Faster Processing",
      description: "Reduce manual data entry time dramatically with instant scanning",
      icon: <FiClock className="text-3xl" />,
      color: "from-white to-gray"
    },
    {
      title: "99.9% Accuracy",
      description: "Eliminate human errors in parcel processing with automated systems",
      icon: <FiCheck className="text-3xl" />,
      color: "from-white to-gray"
    },
    {
      title: "Secure Chain of Custody",
      description: "Digital documentation ensures complete parcel tracking",
      icon: <FiShield className="text-3xl" />,
      color: "from-white to-gray"
    },
    {
      title: "Enhanced Communication",
      description: "Keep customers informed at every delivery stage automatically",
      icon: <FiMessageSquare className="text-3xl" />,
      color: "from-white to-gray"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section with Curved SVG */}
      <section className="relative bg-white overflow-hidden">
        {/* Background curve SVG */}
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-[#1f818c]">Smart Scanning</span> & 
              <span className="text-[#1f818c]"> Instant Notifications</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Revolutionize your parcel management with our advanced scanning technology and automated notification system.
            </p>
          </div>
        </div>
      </section>

      {/* Scanning Section */}
      <section className="py-20 bg-gradient-to-r from-[#f0f9fa] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Animation */}
            <div className="lg:w-1/2">
              <div className="bg-white p-8 rounded-2xl shadow-xl hover:scale-[1.02] transition duration-300">
                <Lottie animationData={scanningAnimation} loop={true} />
              </div>
            </div>

            {/* Content */}
            <div className="lg:w-1/2">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#1f818c] bg-opacity-10 text-[#1f818c] font-medium mb-6">
                <FiSearch className="mr-2" />
                Scanning Features
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Effortless Parcel Scanning
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our advanced scanning technology simplifies parcel management by automatically identifying recipients and capturing essential details in seconds. Say goodbye to manual data entry and hello to efficiency.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {scanningFeatures.map((feature, index) => (
                  <div 
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300 hover:border-[#1f818c] hover:border"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-[#1f818c] bg-opacity-10 p-3 rounded-lg text-[#1f818c] hover:bg-[#1f818c] hover:text-white transition-colors">
                        {feature.icon}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                        <p className="mt-1 text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-[#1f818c] to-[#16626b] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Our Solution?
            </h2>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              Discover the transformative benefits of our scanning and notification system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <button
                key={index}
                onClick={() => setActiveBenefit(index)}
                className={`p-1 rounded-xl ${activeBenefit === index ? 'bg-white/20' : 'bg-transparent'}`}
              >
                <div className={`bg-gradient-to-br ${benefit.color} p-6 rounded-lg h-full flex flex-col items-center text-center transition-all ${activeBenefit === index ? 'shadow-lg' : 'shadow-md opacity-90 hover:opacity-100'}`}>
                  <div className="bg-white/20 p-4 rounded-full mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-white/90">{benefit.description}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/3 flex justify-center">
                <div className="bg-white/20 p-6 rounded-full">
                  {benefits[activeBenefit].icon}
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold mb-4">{benefits[activeBenefit].title}</h3>
                <p className="text-lg opacity-90 mb-4">{benefits[activeBenefit].description}</p>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${benefits[activeBenefit].color}`}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notification Section */}
      <section className="py-20 bg-gradient-to-l from-[#f0f9fa] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            {/* Animation */}
            <div className="lg:w-1/2">
              <div className="bg-white p-8 rounded-2xl shadow-xl hover:scale-[1.02] transition duration-300">
                <Lottie animationData={notificationAnimation} loop={true} />
              </div>
            </div>

            {/* Content */}
            <div className="lg:w-1/2">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#1f818c] bg-opacity-10 text-[#1f818c] font-medium mb-6">
                <FiBell className="mr-2" />
                Notification System
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Automated Notifications
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Keep your customers informed every step of the way with our multi-channel notification system. Reduce missed pickups and improve customer satisfaction.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {notificationFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300 hover:border-[#1f818c] hover:border"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-[#1f818c] bg-opacity-10 p-3 rounded-lg text-[#1f818c] hover:bg-[#1f818c] hover:text-white transition-colors">
                        {feature.icon}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                        <p className="mt-1 text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About PAXAL Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Animation */}
            <div className="lg:w-1/2">
              <div className="bg-white p-8 rounded-2xl shadow-xl hover:scale-[1.02] transition duration-300">
                <img
                  src="/paxallogo.png"
                  alt="PAXAL Logo"
                  className="mx-auto w-30 h-40"
                />
              </div>
            </div>

            {/* Content */}
            <div className="lg:w-1/2">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#1f818c] bg-opacity-10 text-[#1f818c] font-medium mb-6">
                <FiGlobe className="mr-2" />
                About PAXAL
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                The Future of Parcel Management
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                PAXAL was developed by innovative IT undergraduates to revolutionize parcel delivery across residential and commercial settings. Our system streamlines tracking, shipment management, and customer communication.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-[#1f818c] bg-opacity-10 p-3 rounded-lg text-[#1f818c]">
                    <FiTruck className="text-2xl" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Nationwide Coverage</h3>
                    <p className="mt-1 text-gray-600">We deliver to every corner of Sri Lanka, including remote areas.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-[#1f818c] bg-opacity-10 p-3 rounded-lg text-[#1f818c]">
                    <FiHome className="text-2xl" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Residential & Commercial</h3>
                    <p className="mt-1 text-gray-600">Solutions tailored for both home deliveries and business logistics.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-[#1f818c] bg-opacity-10 p-3 rounded-lg text-[#1f818c]">
                    <FiShield className="text-2xl" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Secure & Reliable</h3>
                    <p className="mt-1 text-gray-600">Bank-grade security and 99.7% on-time delivery rate.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#1f818c] to-[#16626b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Parcel Management?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
            Join thousands of businesses already using our scanning and notification system to streamline their operations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-4 bg-white text-[#1f818c] font-bold rounded-lg hover:bg-gray-100 transition duration-300 shadow-lg hover:shadow-xl">
              Get Started Free
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:bg-opacity-10 transition duration-300 flex items-center justify-center gap-2">
              <FiPhone /> Contact Sales
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeaturesDetailsPage;