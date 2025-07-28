import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ParcelInformation from '../../../components/staff/ParcelInformation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { toast } from 'sonner';

const backendURL = import.meta.env.VITE_BACKEND_URL;

const ViewOneCollectionCenterDeliveryparcel = () => {
  const { parcelId } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [delivering, setDelivering] = useState(false);
  const [paid, setPaid] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleParcelLoad = () => {
    setIsLoaded(true);
  };

  // Start the parcel delivery process.
  const handleDelivery = async (parcelId) => {
    // First check for payment status.
    if (!paid) {
      setPaymentDialogOpen(true);
      return;
    }

    // If payment is collected, proceed with delivery.
    await processDelivery(parcelId, paid);
  };

  // Updating the parcel as delivered.
  const processDelivery = async (parcelId, paid) => {
    try {
      setDelivering(true);
      const response = await axios.post(
        `${backendURL}/staff/collection-management/update-parcel-as-delivered`,
        { parcelId , paid},
        { withCredentials: true }
      );

      console.log(response);
      if (response.data.success) {
        toast.success('Parcel Delivery Successful', {
          description: response.data.message,
          duration: 4000,
        });

        navigate(-1);
      }
    } catch (error) {
      console.log('Error in delivery update', error);
      const errorMessage =
        error.response?.message || 'Parcel Delivery failed. Please try again.';
      toast.error('Parcel not Delivered', {
        description: errorMessage,
        duration: 4000,
      });
    } finally {
      setDelivering(false);
    }
  };

  // Check if the parcel has been paid for.
  const checkPaymentStatus = async () => {
    try {
      const response = await axios.get(
        `${backendURL}/staff/collection-management/check-payment`,

        { params: { parcelId }, withCredentials: true }
      );

      console.log(response.data);
      if (response.data.paid === true) {
        setPaid(true);
      } else {
        setPaid(false);
      }
    } catch (error) {
      console.log('Error checking payment status', error);
      toast.error('Error checking payment status', { duration: 4000 });
    }
  };

  // Staff collect the payment from the receiver.
  const handlePaymentCollection = async () => {
    setPaid(true);
    setPaymentDialogOpen(false);
    await processDelivery(parcelId, true);
  };

  const cancelDelivery = () => {
    setPaymentDialogOpen(false);
    setDelivering(false);
  };

  useEffect(() => {
    if (parcelId) {
      checkPaymentStatus();
    }
  }, [parcelId]);
  return (
    <>
      <div className="min-h-screen  py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Parcel ID:{' '}
                <span className="font-mono text-Primary">{parcelId}</span>
              </h1>
            </div>
          </div>
          <ParcelInformation
            parcelId={parcelId}
            onParcelLoad={handleParcelLoad}
          />

          {isLoaded && (
            <div className="flex justify-between items-center mt-10 mx-8">
              <button
                disabled={delivering}
                onClick={() => navigate(-1)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md 
                    text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 
                    focus:ring-Primary focus:ring-offset-2 transition-all duration-200
                    hover:bg-gray hover:shadow-md hover:shadow-slate-300 hover:border-1 hover:border-gray-400"
              >
                Back to List
              </button>
              <button
                disabled={delivering}
                className="bg-Primary text-white px-6 py-2 rounded-xl hover:shadow-green-600 hover:shadow-sm hover:border-2 hover:border-Primary"
                onClick={() => handleDelivery(parcelId)}
              >
                {delivering ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                    Updating..
                  </div>
                ) : (
                  'Delivered'
                )}
              </button>

              {/* Payment Confirmation Dialog */}
              {paymentDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg max-w-md w-full">
                    <h3 className="text-lg font-semibold mb-4">
                      Payment Not Collected
                    </h3>
                    <p className="mb-4">
                      This parcel hasn't been paid for. Has the staff collected
                      payment?
                    </p>

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={cancelDelivery}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handlePaymentCollection}
                        className="px-4 py-2 bg-Primary text-white rounded-md hover:bg-PrimaryHover"
                      >
                        Payment Collected
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewOneCollectionCenterDeliveryparcel;
