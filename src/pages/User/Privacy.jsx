import React from 'react';
import { FiShield, FiLock, FiUser, FiCreditCard, FiMail, FiSettings } from 'react-icons/fi';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Top Wave - Matching your design system */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden rotate-180">
        <svg 
          className="w-full h-16 text-[#1f818c] opacity-8"
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            fill="currentColor" 
            opacity=".25"
          ></path>
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            fill="currentColor" 
            opacity=".5"
          ></path>
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            fill="currentColor"
          ></path>
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto pt-24 pb-32 px-4 sm:px-6 lg:px-8">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-[#1f818c] to-teal-400 rounded-t-2xl p-8 text-white shadow-lg">
          <div className="flex items-center">
            <FiShield className="text-3xl mr-4" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
              <p className="text-teal-100">
                Last updated: July 2025 • Your data security matters to us
              </p>
            </div>
          </div>
        </div>

        {/* Content container */}
        <div className="bg-white rounded-b-2xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-10 space-y-8">
            {/* Section 1 */}
            <div className="flex items-start">
              <div className="bg-[#1f818c] text-white p-2 rounded-lg mr-4">
                <FiUser className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Information We Collect</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Personal details like name, email, and contact number</li>
                  <li>NIC or identity information for verification</li>
                  <li>Parcel details including contents and dimensions</li>
                  <li>Payment and transaction information</li>
                  <li>Device and usage data for analytics</li>
                </ul>
              </div>
            </div>

            {/* Section 2 */}
            <div className="flex items-start">
              <div className="bg-teal-400 text-white p-2 rounded-lg mr-4">
                <FiSettings className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">2. How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>To provide and manage parcel shipping services</li>
                  <li>To process payments and send transaction notifications</li>
                  <li>To verify identity and prevent fraudulent activities</li>
                  <li>To improve our platform and user experience</li>
                  <li>To communicate important service updates</li>
                </ul>
              </div>
            </div>

            {/* Section 3 */}
            <div className="flex items-start">
              <div className="bg-green-500 text-white p-2 rounded-lg mr-4">
                <FiLock className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">3. Data Security</h2>
                <p className="text-gray-600 mb-3">
                  We implement industry-standard security measures to protect your information:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>End-to-end encryption for sensitive data</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Regular security audits and vulnerability testing</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Role-based access controls to personal data</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Secure communication channels (TLS/SSL)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="flex items-start">
              <div className="bg-purple-500 text-white p-2 rounded-lg mr-4">
                <FiCreditCard className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Sharing of Information</h2>
                <p className="text-gray-600 mb-3">
                  We respect your privacy and only share data when absolutely necessary:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      <span>Payment processors for transaction completion</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      <span>Delivery partners for shipment fulfillment</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      <span>Legal authorities when required by law</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      <span>With your explicit consent for specific purposes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="flex items-start">
              <div className="bg-blue-500 text-white p-2 rounded-lg mr-4">
                <FiUser className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">5. Your Rights</h2>
                <p className="text-gray-600 mb-3">
                  You have full control over your personal information:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <p className="font-medium text-blue-700">Access</p>
                    <p className="text-sm text-gray-600">Request a copy of your data</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <p className="font-medium text-blue-700">Correction</p>
                    <p className="text-sm text-gray-600">Update inaccurate information</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <p className="font-medium text-blue-700">Deletion</p>
                    <p className="text-sm text-gray-600">Request data erasure</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <p className="font-medium text-blue-700">Objection</p>
                    <p className="text-sm text-gray-600">Opt-out of processing</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 6 */}
            <div className="flex items-start">
              <div className="bg-amber-500 text-white p-2 rounded-lg mr-4">
                <FiMail className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">6. Changes to Policy</h2>
                <p className="text-gray-600">
                  We may update this policy to reflect changes in our practices. Significant changes will be:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-600">
                  <li>Communicated via email to registered users</li>
                  <li>Posted prominently in your account dashboard</li>
                  <li>Effective 30 days after notification</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                By using our services, you acknowledge you've read and understood this Privacy Policy.
                For questions, contact our Data Protection Officer at privacy@parcelsystem.com.
              </p>
            </div>
          </div>
        </div>

        {/* Support CTA */}
        <div className="bg-gradient-to-r from-[#1f818c] to-teal-400 rounded-2xl p-8 text-center text-white shadow-xl mt-12">
          <h3 className="text-2xl font-bold mb-4">
            Have Privacy Concerns?
          </h3>
          <p className="mb-6 max-w-2xl mx-auto">
            Our privacy team is available to address any questions about your data protection.
          </p>
          <button className="bg-white text-[#1f818c] hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg">
            Contact Us
          </button>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
        <svg 
          className="w-full h-16 text-[#1f818c] opacity-7"
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            fill="currentColor" 
            opacity=".25"
          ></path>
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            fill="currentColor" 
            opacity=".5"
          ></path>
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </div>
  );
}