import PrintButton from '../../components/ui/PrintButton';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ParcelInvoice = () => {
  const { parcelId } = useParams();
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(true);

  const getParcel = async () => {
    try {
      console.log(parcelId);
      const res = await axios.get(
        `http://localhost:8000/staff/lodging-management/get-one-parcel/${parcelId}`,
        { withCredentials: true }
      );
      console.log(res.data);
      setParcel(res.data);
      setLoading(false);
    } catch (error) {
      console.log('Failed to fetch parcel details: ', error);
    }
  };

  useEffect(() => {
    if (parcelId) {
      getParcel();
    }
  }, [parcelId]);

  if (loading) return <div className="m-20">Loading Parcel Invoice...</div>;
  if (!parcel) return <div>No parcel invoice found</div>;

  return (
    <>
      <div className="flex justify-between m-8">
        <h1 className="text-left font-semibold text-xl">Parcel Invoice</h1>
        <h2 className="text-right font-semibold text-lg">
          Tracking Number: {parcel?.trackingNo}
        </h2>
      </div>
      <div className="border-2 border-black m-8">
        <div className="flex px-5 py-7">
          <div className="w-1/2">
            <p>
              <strong>Sender Name:</strong>{' '}
              {`${parcel?.senderId?.fName} ${parcel?.senderId?.lName}`}{' '}
            </p>
            <p>
              <strong>Sender Mobile:</strong> {parcel?.senderId?.contact}{' '}
            </p>
            <p>
              <strong>Receiver Name:</strong>{' '}
              {parcel?.receiverId?.receiverFullName}{' '}
            </p>
            <p>
              <strong>Receiver Mobile:</strong>{' '}
              {parcel?.receiverId?.receiverContact}{' '}
            </p>
          </div>
          <div className="w-1/2">
            <p>
              <strong>Receiving Type:</strong> {parcel.receivingType}
            </p>
            <p>
              <strong>Receiving Branch:</strong> {parcel?.to?.location}
            </p>
            {parcel.receivingType === 'doorstep' && (
              <div className="w-1/2">
                <p>
                  <strong>Delivery Address:</strong>
                  {parcel?.deliveryInformation?.deliveryAddress},<br />
                  {parcel?.deliveryInformation?.deliveryCity},<br />
                  {parcel?.deliveryInformation?.deliveryDistrict},<br />
                  {parcel?.deliveryInformation?.deliveryProvince} Province.
                </p>
                <p>
                  <strong>Postal Code:</strong>{' '}
                  {parcel?.deliveryInformation?.postalCode}
                </p>
              </div>
            )}
            <p>
              <strong>Instructions:</strong> {parcel?.specialInstructions}
            </p>
          </div>
        </div>
        <hr className="border-black" />
        <div className="px-5 py-7">
          <p>
            <strong>Payment Amount (Rs.):</strong>{' '}
            {parcel?.paymentId?.amount}{' '}
          </p>
          <p>
            <strong>Paid by:</strong> {parcel?.paymentId?.paidBy}
          </p>
          <p>
            <strong>Payment Status:</strong> {parcel?.paymentId?.paymentStatus}
          </p>
        </div>
        <hr className="border-black" />
        <img
          src={parcel?.qrCodeNo}
          className="w-[30px] h-[30px] m-5"
          alt="QR Code"
        />
      </div>
      <div className="flex justify-end mr-12">
        <PrintButton />
      </div>
    </>
  );
};

export default ParcelInvoice;
