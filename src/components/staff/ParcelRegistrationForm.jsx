import { useForm } from 'react-hook-form';
import axios from 'axios';
import BranchSelector from './BranchSelector';
import { useEffect, useState } from 'react';

const ParcelRegistrationForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [paymentAmount, setPaymentAmount] = useState('');

  const [itemSize, itemType, from, to, shippingMethod] = watch([
    'itemSize',
    'itemType',
    'from',
    'to',
    'shippingMethod',
  ]);

  // Fetch payment amount
  const fetchPaymentAmount = async () => {
    try {
      if (itemSize && itemType && from && to && shippingMethod) {
        const response = await axios.get(
          'http://localhost:8000/staff/parcel/calculate-payment',
          {
            params: {
              itemSize,
              itemType,
              from,
              to,
              shippingMethod,
            },
          }
        );
        const amount = response.data.paymentAmount;
        console.log(amount);
        setPaymentAmount(amount);
      }
    } catch (error) {
      console.error('Error fetching payment amount', error);
    }
  };

  // Update payment amount dynamically
  useEffect(() => {
    fetchPaymentAmount();
  }, [itemSize, itemType, from, to, shippingMethod]); // re-run on any change

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        latestLocation: data.from,
        username: data.customerEmail,
        orderPlacedStaffId: 'STAFF001',
      };
      console.log('Data being sent to the server: ', formData);

      const response = await axios.post(
        'http://localhost:8000/staff/parcel/register-parcel',
        formData
        // {
        //   headers: { "Content-Type": "application/json" },
        //   // withCredentials: true,
        // }
      );
      alert('Parcel Registered successfully!');
    } catch (error) {
      console.error('Error submitting parcel data: ', error);
      alert('Parcel registration failed');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border border-gray-300  p-6  m-10"
    >
      {/* SENDER INFORMATION */}
      <fieldset className="border flex py-8 mb-11">
        <legend className="ml-10">Sender Information</legend>

        <div className="w-1/2">
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="w-1/3 text-left pl-10">First Name:</label>
              <input
                {...register('fName', { required: true })}
                className="border p-2 w-60"
              />
            </div>
            {errors.fName && (
              <p className="text-red-500 text-sm ml-[33%]">
                This field is required.
              </p>
            )}

            <div className="flex items-center">
              <label className="w-1/3 text-left pl-10">Full Name:</label>
              <input
                {...register('customerFullName', { required: true })}
                className="border p-2 w-60"
              />
            </div>
            {errors.customerFullName && (
              <p className="text-red-500 text-sm ml-[33%]">
                This field is required.
              </p>
            )}

            <div className="flex items-center">
              <label className="w-1/3 text-left pl-10">Mobile:</label>
              <input
                {...register('customerContact', { required: true })}
                className="border p-2 w-60"
              />
            </div>
            {errors.customerContact && (
              <p className="text-red-500 text-sm ml-[33%]">
                This field is required.
              </p>
            )}

            <div className="flex items-center">
              <label className="w-1/3 text-left pl-10">Address:</label>
              <input
                {...register('customerAddress', { required: true })}
                className="border p-2 w-60 h-32"
              />
            </div>
            {errors.customerAddress && (
              <p className="text-red-500 text-sm ml-[33%]">
                This field is required.
              </p>
            )}
          </div>
        </div>

        <div className="w-1/2">
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="w-1/3 text-left pl-10">Last Name:</label>
              <input
                {...register('lName', { required: true })}
                className="border p-2 w-60"
              />
            </div>
            {errors.lName && (
              <p className="text-red-500 text-sm ml-[33%]">
                This field is required.
              </p>
            )}

            <div className="flex items-center">
              <label className="w-1/3 text-left pl-10">NIC:</label>
              <input
                {...register('nic', { required: true })}
                className="border p-2 w-60"
              />
            </div>
            {errors.nic && (
              <p className="text-red-500 text-sm ml-[33%]">
                This field is required.
              </p>
            )}

            <div className="flex items-center">
              <label className="w-1/3 text-left pl-10">Email:</label>
              <input
                type="email"
                {...register('customerEmail', { required: true })}
                className="border p-2 w-60"
              />
            </div>
            {errors.customerEmail && (
              <p className="text-red-500 text-sm ml-[33%]">
                This field is required.
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* RECEIVER INFORMATION */}
      <fieldset className="border flex py-8 mb-11">
        <legend className="ml-10">Receiver Information</legend>

        <div className="w-1/2">
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="w-1/3 text-left pl-10">Full Name:</label>
              <input
                {...register('receiverFullName', { required: true })}
                className="border p-2 w-60"
              />
            </div>
            {errors.receiverFullName && (
              <p className="text-red-500 text-sm ml-[33%]">
                This field is required.
              </p>
            )}

            <div className="flex items-center">
              <label className="w-1/3 text-left pl-10">Address:</label>
              <input
                {...register('receiverAddress', { required: true })}
                className="border p-2 w-60 h-32"
              />
            </div>
            {errors.receiverAddress && (
              <p className="text-red-500 text-sm ml-[33%]">
                This field is required.
              </p>
            )}
          </div>
        </div>

        <div className="w-1/2">
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="w-1/3 text-left pl-10">Mobile:</label>
              <input
                {...register('receiverContact', { required: true })}
                className="border p-2 w-60"
              />
            </div>
            {errors.receiverContact && (
              <p className="text-red-500 text-sm ml-[33%]">
                This field is required.
              </p>
            )}

            <div className="flex items-center">
              <label className="w-1/3 text-left pl-10">Email:</label>
              <input
                type="email"
                {...register('receiverEmail', { required: true })}
                className="border p-2 w-60"
              />
            </div>
            {errors.receiverEmail && (
              <p className="text-red-500 text-sm ml-[33%]">
                This field is required.
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* PARCEL INFORMATION */}
      <fieldset className="border flex py-8 mb-11">
        <legend className="ml-10">Parcel Information</legend>

        <div className="w-1/2">
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="w-1/3 text-left pl-10">Parcel Size:</label>

              <select
                {...register('itemSize', { required: true })}
                className="border w-40  py-1 px-5"
              >
                <option value="">Select</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            {errors.itemSize && (
              <p className="text-red-500 text-sm ml-[33%]">
                This field is required.
              </p>
            )}

            <div className="flex items-center">
              <label className="w-1/3 text-left pl-10">Parcel Type:</label>
              <select
                {...register('itemType', { required: true })}
                className="border w-40  py-1 px-5"
              >
                <option value="">Select</option>
                <option value="paper">Paper</option>
                <option value="glass">Glass</option>
                <option value="wood">Wood</option>
                <option value="fabrics">Fabrics</option>
                <option value="plastic">Plastic</option>
                <option value="chemicals">Chemicals</option>
                <option value="clay">Clay</option>
              </select>
            </div>
            {errors.itemType && (
              <p className="text-red-500 text-sm ml-[33%]">
                This field is required.
              </p>
            )}

            <div className="flex items-center">
              <label className="w-1/3 text-left pl-10">Instructions:</label>
              <input
                {...register('specialInstruction')}
                className="border p-2 w-60 h-32"
              />
            </div>
          </div>
        </div>

        <div className="w-1/2">
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="w-1/3 text-left pl-10">From:</label>
              <BranchSelector register={register} name="from" />
            </div>
            {errors.from && (
              <p className="text-red-500 text-sm ml-[33%]">
                This field is required.
              </p>
            )}
            <div className="flex items-center">
              <label className="w-1/3 text-left pl-10">To:</label>
              <BranchSelector register={register} name="to" />
            </div>
            {errors.to && (
              <p className="text-red-500 text-sm ml-[33%]">
                This field is required.
              </p>
            )}
            <div className="flex items-center">
              <label className="w-1/3 text-left pl-10">Shipping Service:</label>
              <label className="inline-flex items-center mt-2">
                <input
                  type="radio"
                  {...register('shippingMethod', { required: true })}
                  value="express"
                  className="border p-2 w-30 m-3"
                />
                Express
              </label>
              <label className="inline-flex items-center mt-2">
                <input
                  type="radio"
                  {...register('shippingMethod', { required: true })}
                  value="standard"
                  className="border p-2 w-30 m-3"
                />
                Standard
              </label>
            </div>
            {errors.shippingMethod && (
              <p className="text-red-500 text-sm ml-[33%]">
                This field is required.
              </p>
            )}

            <div className="flex items-center">
              <label className="w-1/3 text-left pl-10">Delivery Method:</label>
              <label className="inline-flex items-center mt-2">
                <input
                  type="radio"
                  {...register('receivingType', { required: true })}
                  value="collection_center"
                  className="border p-2 w-30 m-3"
                />
                Pickup at Center
              </label>
              <label className="inline-flex items-center mt-2">
                <input
                  type="radio"
                  {...register('receivingType', { required: true })}
                  value="doorstep"
                  className="border p-2 w-30 m-3"
                />
                Home Delivery
              </label>
            </div>
            {errors.receivingType && (
              <p className="text-red-500 text-sm ml-[33%]">
                This field is required.
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* PAYEMENT INFORMATION */}
      <fieldset className="border flex py-8 mb-11">
        <legend className="ml-10">Payement Information</legend>

        <div className="w-1/2">
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="w-1/3 text-left pl-10">
                Payment Amount (Rs.):
              </label>
              <input
                {...register('paymentAmount', { required: true })}
                value={paymentAmount ?? ''}
                className="border p-2 w-60"
                readOnly
              />
            </div>
            {errors.paymentAmount && (
              <p className="text-red-500 text-sm ml-[33%]">
                This field is required.
              </p>
            )}
            <div className="flex items-center">
              <label className="w-1/3 text-left pl-10">Paid By:</label>
              <label className="inline-flex items-center mt-2">
                <input
                  type="radio"
                  {...register('paidBy', { required: true })}
                  value="sender"
                  className="border p-2 w-30 m-3"
                />
                Sender
              </label>
              <label className="inline-flex items-center mt-2">
                <input
                  type="radio"
                  {...register('paidBy', { required: true })}
                  value="receiver"
                  className="border p-2 w-30 m-3"
                />
                Receiver
              </label>
            </div>
            {errors.paidBy && (
              <p className="text-red-500 text-sm ml-[33%]">
                This field is required.
              </p>
            )}

            <div className="flex items-center">
              <label className="w-1/3 text-left pl-10">Paid:</label>
              <label className="inline-flex items-center mt-2">
                <input
                  type="radio"
                  {...register('paymentStatus', { required: true })}
                  value="paid"
                  className="border p-2 w-30 m-3"
                />
                Yes
              </label>
              <label className="inline-flex items-center mt-2">
                <input
                  type="radio"
                  {...register('paymentStatus', { required: true })}
                  value="pending"
                  className="border p-2 w-30 m-3"
                />
                No
              </label>
            </div>
            {errors.paymentStatus && (
              <p className="text-red-500 text-sm ml-[33%]">
                This field is required.
              </p>
            )}
          </div>
        </div>
      </fieldset>
      <div className="flex justify-end space-x-4 mr-3 mt-8">
        <input
          type="reset"
          value="Cancel"
          className="bg-white text-Primary border border-Primary px-6 py-2 rounded-xl "
          onClick={() => reset({ paymentAmount: '' })}
        />

        <input
          type="submit"
          value="Register"
          className="bg-Primary text-white px-6 py-2 rounded-xl"
        />
      </div>
    </form>
  );
};

export default ParcelRegistrationForm;
