import React from 'react'
import Navbar from '../../components/User/Navbar';



const Parcel = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
        <Navbar/>
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-8 mr-4" /> {/* Replace with your logo */}
            <nav className="space-x-4">
              <a href="#" className="text-gray-700 hover:text-gray-900">Home</a>
              <a href="#" className="text-blue-600 font-semibold">Parcel</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Track</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Contact Us</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">About Us</a>
            </nav>
          </div>
          <div className="flex items-center">
            <img src="/profile.jpg" alt="Profile" className="h-10 w-10 rounded-full" /> {/* Replace with profile image */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="bg-blue-100 p-4 rounded-md">
            <h2 className="text-lg font-semibold text-blue-800">Total Parcels: 04</h2>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md">+ ADD Parcel</button>
        </div>

        {/* Your Parcels Table */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Parcels</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-md shadow-md">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border-b">Parcel No</th>
                  <th className="py-2 px-4 border-b">Tracking Number</th>
                  <th className="py-2 px-4 border-b">Bar Code</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Item Type</th>
                  <th className="py-2 px-4 border-b">Item Size</th>
                  <th className="py-2 px-4 border-b">Destination Branch</th>
                  <th className="py-2 px-4 border-b">Shipment Method</th>
                  <th className="py-2 px-4 border-b">Payment Type</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-4">P001</td>
                  <td className="py-2 px-4">LX123456789CN</td>
                  <td className="py-2 px-4">4006381333921</td>
                  <td className="py-2 px-4">Order Placed</td>
                  <td className="py-2 px-4">Document</td>
                  <td className="py-2 px-4">Small</td>
                  <td className="py-2 px-4">Colombo</td>
                  <td className="py-2 px-4">Express</td>
                  <td className="py-2 px-4">Cash</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">P002</td>
                  <td className="py-2 px-4">LX123456789CN</td>
                  <td className="py-2 px-4">4006381333931</td>
                  <td className="py-2 px-4">Picked Up</td>
                  <td className="py-2 px-4">Food</td>
                  <td className="py-2 px-4">Small</td>
                  <td className="py-2 px-4">Trinco</td>
                  <td className="py-2 px-4">Standard</td>
                  <td className="py-2 px-4">Online</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">P003</td>
                  <td className="py-2 px-4">LX123456789CN</td>
                  <td className="py-2 px-4">4008301333431</td>
                  <td className="py-2 px-4">Shipment Assigned</td>
                  <td className="py-2 px-4">Grocery</td>
                  <td className="py-2 px-4">Large</td>
                  <td className="py-2 px-4">Trinco</td>
                  <td className="py-2 px-4">Express</td>
                  <td className="py-2 px-4">Cash</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">P003</td>
                  <td className="py-2 px-4">LX123456789CN</td>
                  <td className="py-2 px-4">4006381333931</td>
                  <td className="py-2 px-4">Delivered</td>
                  <td className="py-2 px-4">Supplies</td>
                  <td className="py-2 px-4">Small</td>
                  <td className="py-2 px-4">Colombo</td>
                  <td className="py-2 px-4">Express</td>
                  <td className="py-2 px-4">Online</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">P004</td>
                  <td className="py-2 px-4">LX123456789CN</td>
                  <td className="py-2 px-4">4006381333831</td>
                  <td className="py-2 px-4">In Transit</td>
                  <td className="py-2 px-4">Clothes</td>
                  <td className="py-2 px-4">Large</td>
                  <td className="py-2 px-4">Trinco</td>
                  <td className="py-2 px-4">Standard</td>
                  <td className="py-2 px-4">Online</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Pagination (Replace with your logic) */}
          <div className="flex justify-center mt-4">
            <button className="mx-1 px-3 py-1 bg-gray-300 rounded-md">1</button>
            <button className="mx-1 px-3 py-1 bg-gray-300 rounded-md">2</button>
            <button className="mx-1 px-3 py-1 bg-gray-300 rounded-md">3</button>
            <button className="mx-1 px-3 py-1 bg-gray-300 rounded-md">4</button>
            <button className="mx-1 px-3 py-1 bg-gray-300 rounded-md">5</button>
            <button className="mx-1 px-3 py-1 bg-gray-300 rounded-md">6</button>
            <button className="mx-1 px-3 py-1 bg-gray-300 rounded-md">7</button>
            <button className="mx-1 px-3 py-1 bg-gray-300 rounded-md">...</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Parcel;