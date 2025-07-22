// src/components/Footer.jsx
import React from 'react';
import {
  FiUser,
  FiAlertTriangle,
  FiHelpCircle,
  FiMail,
  FiMap,
  FiPhone,
} from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#f3f3f3] text-black pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* User Account */}
          <div>
            <h3 className="text-[#1f818c] text-2xl font-semibold mb-4 flex items-center">
              <FiUser className="mr-2" /> User Account
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  My Orders
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Account Settings
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Change Password
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-[#1f818c] text-2xl font-semibold mb-4 flex items-center">
              <FiAlertTriangle className="mr-2" /> Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h3 className="text-[#1f818c] text-2xl font-semibold mb-4 flex items-center">
              <FiHelpCircle className="mr-2" /> Help & Support
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Customer Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Delivery Information
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Payment Options
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Claims & Corrections
                </a>
              </li>
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
              <a
                href="#"
                className="text-[#1f818c] hover:text-white transition-colors"
              >
                <FaFacebook size={40} />
              </a>
              <a
                href="#"
                className="text-[#1f818c] hover:text-white transition-colors"
              >
                <FaTwitter size={40} />
              </a>
              <a
                href="#"
                className="text-[#1f818c] hover:text-white transition-colors"
              >
                <FaInstagram size={40} />
              </a>
              <a
                href="#"
                className="text-[#1f818c] hover:text-white transition-colors"
              >
                <FaLinkedin size={40} />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="flex items-start">
            <FiMap className="text-[#1f818c] text-2xl mt-1 mr-3" />
            <div>
              <h4 className="text-[#1f818c] text-2xl font-medium mb-2">
                Address
              </h4>
              <p>
                Parcel HQ
                <br />
                123 Contact Lane, Colombo, Sri Lanka
              </p>
            </div>
          </div>
          <div className="flex ml-1 items-start">
            {/* Left blank intentionally */}
          </div>
          <div className="flex ml-28 items-start">
            <FiPhone className="text-[#1f818c] text-2xl mt-1 mr-3" />
            <div>
              <h4 className="text-[#1f818c] text-2xl  font-medium mb-2">
                Support Hotline
              </h4>
              <p>+94 123 4567</p>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="border-t border-black pt-5">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="text-[#1f818c] text-0.5xl font-medium mb-2">
                Company Information
              </h4>
              <div className="flex flex-wrap gap-4">
                <a href="#" className="hover:text-white transition-colors">
                  About Us
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Careers
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Sustainability
                </a>
              </div>
            </div>
            <div className="text-sm">
              © {new Date().getFullYear()} Parcel Tracker. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
