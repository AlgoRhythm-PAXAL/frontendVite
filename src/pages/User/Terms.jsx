import React from 'react';
import { FiCheckCircle, FiAlertTriangle, FiLock, FiShield, FiRefreshCw } from 'react-icons/fi';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Top Wave - Exactly matches your TrackParcelPage */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden rotate-180">
        <svg 
          className="w-full h-16 text-[#1f818c] opacity-8"
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            fill="currentColor" 
            opacity=".125"
          ></path>
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            fill="currentColor" 
            opacity=".15"
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-teal-100">
            Last updated: July 2025 • Effective immediately
          </p>
        </div>

        {/* Content container */}
        <div className="bg-white rounded-b-2xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-10 space-y-8">
            {/* Section 1 */}
            <div className="flex items-start">
              <div className="bg-[#1f818c] text-white p-2 rounded-lg mr-4">
                <FiCheckCircle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Use of Our Services</h2>
                <p className="text-gray-600">
                  You must provide accurate, current, and complete information during registration and parcel creation.
                  You are responsible for maintaining the confidentiality of your account and password.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="flex items-start">
              <div className="bg-amber-500 text-white p-2 rounded-lg mr-4">
                <FiAlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">2. Prohibited Activities</h2>
                <p className="text-gray-600">
                  Users must not use our platform to send prohibited items, fraudulent information, or attempt to gain
                  unauthorized access to other accounts or systems.
                </p>
                <div className="mt-3 bg-amber-50 p-3 rounded-lg border border-amber-100">
                  <p className="text-sm text-amber-700">
                    Prohibited items include weapons, illegal substances, and hazardous materials.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="flex items-start">
              <div className="bg-green-500 text-white p-2 rounded-lg mr-4">
                <FiShield className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">3. Limitation of Liability</h2>
                <p className="text-gray-600">
                  We do our best to ensure the accuracy and reliability of our service, but we are not liable for delays,
                  loss, or damages caused by events beyond our control.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="flex items-start">
              <div className="bg-red-500 text-white p-2 rounded-lg mr-4">
                <FiLock className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Termination</h2>
                <p className="text-gray-600">
                  We reserve the right to suspend or terminate your access if we suspect any misuse or violation of these terms.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div className="flex items-start">
              <div className="bg-purple-500 text-white p-2 rounded-lg mr-4">
                <FiRefreshCw className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">5. Changes to Terms</h2>
                <p className="text-gray-600">
                  We may update these terms occasionally. Continued use of the service after changes means you accept the new terms.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>

        {/* Support CTA */}
        <div className="bg-gradient-to-r from-[#1f818c] to-teal-400 rounded-2xl p-8 text-center text-white shadow-xl mt-12">
          <h3 className="text-2xl font-bold mb-4">
            Questions About Our Terms?
          </h3>
          <p className="mb-6 max-w-2xl mx-auto">
            Our legal team is happy to clarify any part of these terms and conditions.
          </p>
          <button className="bg-white text-[#1f818c] hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg">
            Contact Support
          </button>
        </div>
      </div>

      {/* Bottom Wave - Exactly matches your TrackParcelPage */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
        <svg 
          className="w-full h-16 text-[#1f818c] opacity-1"
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            fill="currentColor" 
            opacity=".05"
          ></path>
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            fill="currentColor" 
            opacity=".005"
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