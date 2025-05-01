import React, { useEffect, useState } from "react";
import DataTable from "../../components/staff/DataTable";
import axios from "axios";
import toast from "react-hot-toast";

const DeliverySchedules = ({ onAssignmentChange, parcelId }) => {
  const [deliverySchedules, setDeliverySchedules] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [isProcessingNormal, setIsProcessingNormal] = useState(false);
  const [isProcessingExpress, setIsProcessingExpress] = useState(false);

  useEffect(() => {
    getDeliverySchedules();
    if (onAssignmentChange) {
      onAssignmentChange(selectedScheduleId !== null);
    }
    
  }, [selectedScheduleId, onAssignmentChange]);
  

  // get all the availble delivery schdeuls for the date and time
  const getDeliverySchedules = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/staff/delivery-schedules/get-all-delivery-schedules",
        { withCredentials: true }
      );

      setDeliverySchedules(response.data);
    } catch (error) {
      console.error("Error in getting delivery schedules", error);
    }
  };

  // Staff select the pickup schedule for the parcel
  const handleDeliveryScheduleSelection = async (parcelId, scheduleId) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/staff/delivery-schedules/select-delivery-schedule",
        { parcelId, scheduleId },
        { withCredentials: true }
      );
      console.log(response);
      setSelectedScheduleId(scheduleId);
      await getDeliverySchedules();
    } catch (error) {
      console.log("Error in assigning parcel to a schedule", error);
    }
  };

  // Staff cancel the assigned delivery schedule for the parcel
  const handleCancelSelection = async (parcelId) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/staff/delivery-schedules/cancel-delivery-schdeule",
        { parcelId, scheduleId: selectedScheduleId },
        { withCredentials: true }
      );
      console.log(response);
      setSelectedScheduleId(null);
      await getDeliverySchedules();
    } catch (error) {
      console.log("Error in cancelling the assigned schedule", error);
    }
  };

  // When there are no availble delivery schedule for the parcel
  const addNewDeliverySchedule = async (parcelId) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/staff/delivery-schedules/new-delivery-schedule",
        { parcelId },
        { withCredentials: true }
      );
      console.log(response);
      if (response.data.success) {
        const newSchedule = response.data.newDeliverySchedule;
        console.log("new schedule info", newSchedule);
        setSelectedScheduleId(newSchedule._id);
        await getDeliverySchedules();
        toast.success("New Schedule created", {
          description: response.data.message,
          duration: 3000,
        });
        
      }
    } catch (error) {
      console.log("Error in creating a new schedule", error);
      const errorMessage =
        error.response?.data.message ||
        "Failed to submit reply. Please try again.";

      toast.error("Failed to Reply", {
        description: errorMessage,
        duration: 4000,
      });
    } finally {
      setIsProcessingNormal(false);
    }
  };

  // Create a express delivery schedule for express parcels
  const addNewExpressDeliverySchedule = async (req, res) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/staff/delivery-schedules/new-express-delivery-schedule",
        { parcelId },
        { withCredentials: true }
      );
      console.log(response);
      if (response.data.success) {
        const newSchedule = response.data.newSchedule;
        setSelectedScheduleId(newSchedule._id);

        await getDeliverySchedules();
        alert("New express delivery schedule created successfully!");
      }
    } catch (error) {
      console.log("Error in creating a new express delivery schedule", error);
    } finally {
      setIsProcessingExpress(false);
    }
  };

  const columns = [
    {
      label: "Vehicle",
      key: "vehicleId",
      render: (value, row) => row.vehicleId?.vehicleId || "N/A",
    },
    { label: "Current Parcel Count", key: "parcelCount" },
    {
      label: "Covered Areas",
      key: "deliveryCities",
      render: (value, row) =>
        row.deliveryCities && row.deliveryCities.length > 0
          ? row.deliveryCities.join("  ,  ")
          : "N/A",
    },
    {
      label: "Delivery Date",
      key: "scheduleDate",
      render: (value, row) =>
        new Date(row.scheduleDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    { label: "Delivery Time", key: "timeSlot" },
  ];

  const actions = [
    {
      label: "",
      className: "",
      onClick: (row) =>
        handleDeliveryScheduleSelection(parcelId, row.scheduleId),
      render: (row) => {
        const isSelected = selectedScheduleId === (row._id || row.scheduleId);
        return (
          <button
            className={`
            ${
              isSelected
                ? "bg-white font-semibold text-Primary border-2 border-Primary"
                : "bg-Primary font-semibold text-white border-2 border-Primary"
            }
            px-7 py-2 rounded-lg transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-Primary-light
            ${
              selectedScheduleId !== null && !isSelected
                ? " cursor-not-allowed bg-gray-400 text-white border-gray-300 font-semibold"
                : "hover:shadow-md"
            }
          `}
            onClick={() =>
              isSelected
                ? handleCancelSelection(parcelId)
                : handleDeliveryScheduleSelection(parcelId, row.scheduleId)
            }
            disabled={
              selectedScheduleId !== null && !isSelected // Disable all other buttons
            }
          >
            {isSelected ? "Cancel" : "Select"}
          </button>
        );
      },
    },
  ];

  const getRowClassName = (row) => {
    return selectedScheduleId === (row._id || row.scheduleId)
      ? "bg-green-100"
      : "";
  };

  return (
    <>
      <div className="flex gap-4 mb-4">
        <button
          className="bg-white text-Primary font-semibold border-2 border-Primary  px-4 py-2 rounded-xl hover:bg-green-50 hover:shadow-lg hover:shadow-slate-200 "
          onClick={() => {
            setIsProcessingNormal(true);
            addNewDeliverySchedule(parcelId);
          }}
          disabled={
            isProcessingNormal ||
            isProcessingExpress ||
            selectedScheduleId !== null
          }
        >
          {isProcessingNormal ? (
            <div className="flex items-center justify-center gap-2">
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-Primary"></span>
              Creating...
            </div>
          ) : (
            "+ New Delivery Schedule"
          )}
        </button>
        <button
          className="bg-white text-Primary font-semibold border-2 border-Primary  px-4 py-2 rounded-xl hover:bg-green-50 hover:shadow-lg hover:shadow-slate-200"
          onClick={() => {
            setIsProcessingExpress(true);
            addNewExpressDeliverySchedule(parcelId);
          }}
          disabled={
            isProcessingNormal ||
            isProcessingExpress ||
            selectedScheduleId !== null
          }
        >
          {isProcessingExpress ? (
            <div className="flex items-center justify-center gap-2">
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-Primary"></span>
              Creating...
            </div>
          ) : (
            "+ New Express Schedule"
          )}
        </button>
      </div>
      <DataTable
        data={deliverySchedules}
        columns={columns}
        actions={actions}
        rowsPerPage={4}
        getRowClassName={getRowClassName}
      />
    </>
  );
};

export default DeliverySchedules;
