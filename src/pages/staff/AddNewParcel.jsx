import { useForm } from "react-hook-form";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BranchSelector from "../../components/staff/BranchSelector";
import { toast } from "sonner";
import ProvinceSelector from "../../components/staff/ProvinceSelector";
import DistrictSelector from "../../components/staff/DistrictSelector";

const backendURL = import.meta.env.VITE_BACKEND_URL;


const AddNewParcel = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm();

  const selectedDeliveryMethod = watch("receivingType");
  const navigate = useNavigate();

  const [itemSize, from, to, shippingMethod] = watch([
    "itemSize",
    "from",
    "to",
    "shippingMethod",
  ]);

  const [registering, setRegistering] = useState(false);
  const [provinceOne, setSelectedProvinceOne] = useState("");
  const [provinceTwo, setSelectedProvinceTwo] = useState("");

  // Fetch payment amount
  const fetchPaymentAmount = async () => {
    try {
      if (itemSize && from && to && shippingMethod) {
        const response = await axios.get(
          `${backendURL}/staff/lodging-management/calculate-payment`,
          {
            params: {
              itemSize,
              from,
              to,
              shippingMethod,
            },
            withCredentials: true,
          }
        );
        const formattedAmount = response.data.paymentAmount.toFixed(2);
        setValue("amount", formattedAmount);
      }
    } catch (error) {
      console.error("Error fetching payment amount", error);
    }
  };

  // Update payment amount dynamically
  useEffect(() => {
    fetchPaymentAmount();
  }, [itemSize, from, to, shippingMethod]); // re-run on any change

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
      };

      setRegistering(true);
      console.log("Data being sent to the server: ", formData);

      const response = await axios.post(
        `${backendURL}/staff/lodging-management/register-parcel`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response.data);
      toast.success("Parcel registration Successful", {
        description: `Parcel ID: ${response.data.parcelId}`,
        duration: 4000,
      });
      navigate(
        `/staff/lodging-management/view-parcels/invoice/${response.data.parcelId}`
      );
    } catch (error) {
      setRegistering(false);
      console.error("Error submitting parcel data: ", error);
      const errorMessage =
        error.response?.message ||
        "Failed to register a new parcel. Please try again.";

      toast.error("Parcel Registration Error", {
        description: errorMessage,
        duration: 4000,
        
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Register New Parcel
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* SENDER INFORMATION */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Sender Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name*
                </label>
                <input
                  {...register("fName", { required: true })}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-Primary focus:border-Primary"
                />
                {errors.fName && (
                  <p className="mt-1 text-sm text-red-600">
                    This field is required
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name*
                </label>
                <input
                  {...register("lName", { required: true })}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-Primary focus:border-Primary"
                />
                {errors.lName && (
                  <p className="mt-1 text-sm text-red-600">
                    This field is required
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIC*
                </label>
                <input
                  {...register("nic", {
                    required: "This field is required",
                    pattern: {
                      value: /^([0-9]{9}[vV]|[0-9]{12})$/,
                      message: "Invalid NIC",
                    },
                  })}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-Primary focus:border-Primary"
                />
                {errors.nic && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.nic.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile*
                </label>
                <input
                  {...register("contact", {
                    required: "this field is required",
                    pattern: {
                      value: /^0[1-9][0-9]{8}$/,
                      message: "Invalid mobile number",
                    },
                  })}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-Primary focus:border-Primary"
                />
                { errors.contact  && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.contact.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email*
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: true,
                  })}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-Primary focus:border-Primary"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    This field is required
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  {...register("address")}
                  rows={2}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-Primary focus:border-Primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  {...register("city")}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-Primary focus:border-Primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    District
                  </label>
                  <DistrictSelector
                    register={register}
                    name="district"
                    selectedProvince={provinceOne}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Province
                  </label>
                  <ProvinceSelector
                    register={register}
                    name="province"
                    onChange={(e) => setSelectedProvinceOne(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RECEIVER INFORMATION */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Receiver Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name*
                </label>
                <input
                  {...register("receiverFullName", { required: true })}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-Primary focus:border-Primary"
                />
                {errors.receiverFullName && (
                  <p className="mt-1 text-sm text-red-600">
                    This field is required
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile*
                </label>
                <input
                  {...register("receiverContact", {
                    required: "This field is required",
                    pattern: {
                      value: /^0[1-9][0-9]{8}$/,
                      message: "Invalid mobile number",
                    },
                  })}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-Primary focus:border-Primary"
                />
                { errors.receiverContact && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.receiverContact.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email*
                </label>
                <input
                  type="email"
                  {...register("receiverEmail", { required: true })}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-Primary focus:border-Primary"
                />
                {errors.receiverEmail && (
                  <p className="mt-1 text-sm text-red-600">
                    This field is required
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* PARCEL INFORMATION */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Parcel Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parcel Size*
                </label>
                <select
                  {...register("itemSize", { required: true })}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-Primary focus:border-Primary"
                >
                  <option value="">Select Size</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
                {errors.itemSize && (
                  <p className="mt-1 text-sm text-red-600">
                    This field is required
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parcel Type*
                </label>
                <select
                  {...register("itemType", { required: true })}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-Primary focus:border-Primary"
                >
                  <option value="">Select Type</option>
                  <option value="Glass">Glass</option>
                  <option value="Flowers">Flowers</option>
                  <option value="Document">Document</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Food">Food</option>
                  <option value="Other">Other</option>
                </select>
                {errors.itemType && (
                  <p className="mt-1 text-sm text-red-600">
                    This field is required
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Instructions
                </label>
                <textarea
                  {...register("specialInstructions")}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-Primary focus:border-Primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From*
                </label>
                <div className="w-60">
                  <BranchSelector
                    register={register}
                    name="from"
                    required
                    errors={errors}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To*
                </label>
                <div className="w-60">
                  <BranchSelector
                    register={register}
                    name="to"
                    required
                    errors={errors}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shipping Service*
                </label>
                <div className="flex space-x-6">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register("shippingMethod", { required: true })}
                      value="express"
                      className="h-4 w-4 text-blue-600 focus:ring-Primary"
                    />
                    <span className="ml-2 text-gray-700">Express</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register("shippingMethod", { required: true })}
                      value="standard"
                      className="h-4 w-4 text-blue-600 focus:ring-Primary"
                    />
                    <span className="ml-2 text-gray-700">Standard</span>
                  </label>
                </div>
                {errors.shippingMethod && (
                  <p className="mt-1 text-sm text-red-600">
                    Please select a shipping method
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Method*
                </label>
                <div className="flex space-x-6">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register("receivingType", { required: true })}
                      value="collection_center"
                      className="h-4 w-4 text-blue-600 focus:ring-Primary"
                    />
                    <span className="ml-2 text-gray-700">Pickup at Center</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register("receivingType", { required: true })}
                      value="doorstep"
                      className="h-4 w-4 text-blue-600 focus:ring-Primary"
                    />
                    <span className="ml-2 text-gray-700">Home Delivery</span>
                  </label>
                </div>
                {errors.receivingType && (
                  <p className="mt-1 text-sm text-red-600">
                    Please select a delivery method
                  </p>
                )}
              </div>

              {selectedDeliveryMethod === "doorstep" && (
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Address*
                    </label>
                    <textarea
                      {...register("deliveryInformation.deliveryAddress", {
                        required: selectedDeliveryMethod === "doorstep",
                      })}
                      rows={2}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-Primary focus:border-Primary"
                    />
                    {errors.deliveryInformation?.deliveryAddress && (
                      <p className="mt-1 text-sm text-red-600">
                        Delivery address is required
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Province*
                      </label>

                      <ProvinceSelector
                        register={register}
                        name="deliveryInformation.deliveryProvince"
                        required={selectedDeliveryMethod === "doorstep"}
                        errors={errors}
                        onChange={(e) => setSelectedProvinceTwo(e.target.value)}
                      />

                      {errors.deliveryInformation?.deliveryProvince && (
                        <p className="mt-1 text-sm text-red-600">
                          This field is required
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        District*
                      </label>
                      <DistrictSelector
                        register={register}
                        name="deliveryInformation.deliveryDistrict"
                        required={selectedDeliveryMethod === "doorstep"}
                        selectedProvince={provinceTwo}
                      />

                      {errors.deliveryInformation?.deliveryDistrict && (
                        <p className="mt-1 text-sm text-red-600">
                          This field is required
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City*
                      </label>
                      <input
                        {...register("deliveryInformation.deliveryCity", {
                          required: selectedDeliveryMethod === "doorstep",
                        })}
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-Primary focus:border-Primary"
                      />
                      {errors.deliveryInformation?.deliveryCity && (
                        <p className="mt-1 text-sm text-red-600">
                          This field is required
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code*
                      </label>
                      <input
                        {...register("deliveryInformation.postalCode", {
                          required: selectedDeliveryMethod === "doorstep",
                        })}
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-Primary focus:border-Primary"
                      />
                      {errors.deliveryInformation?.postalCode && (
                        <p className="mt-1 text-sm text-red-600">
                          This field is required
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PAYMENT INFORMATION */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Payment Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Amount (Rs.)*
                </label>
                <input
                  {...register("amount", { required: true })}
                  readOnly
                  className="w-full px-4 py-2 border rounded-md bg-gray-100"
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">
                    This field is required
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method*
                </label>
                <select
                  {...register("paymentMethod", { required: true })}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Method</option>
                  <option value="physicalPayment">Cash</option>
                  <option value="COD">Cash on Delivery (COD)</option>
                </select>
                {errors.paymentMethod && (
                  <p className="mt-1 text-sm text-red-600">
                    This field is required
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FORM ACTIONS */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            disabled={registering}
            onClick={() => reset()}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-Primary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={registering}
            className="px-6 py-2 bg-Primary text-white rounded-md hover:bg-PrimaryHover focus:outline-none focus:ring-2 focus:ring-Primary focus:ring-offset-2"
          >
             {registering ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                  Registering..
                </div>
              ) : (
                "Register Parcel"
              )}
            
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewParcel;
