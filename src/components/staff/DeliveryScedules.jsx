import React, { useEffect, useState } from "react";
import DataTable from "../../components/staff/DataTable";
import axios from "axios";


const DeliverySchedules = ({onAssignmentChange, parcelId  }) => {
  const [deliverySchedules, setDeliverySchedules] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  

  useEffect(() => {
    getDeliverySchedules();
    if (onAssignmentChange) {
      onAssignmentChange(selectedScheduleId !== null);
    }
  }, [selectedScheduleId, onAssignmentChange]);
  
  /* get all the availble delivery schdeuls for the date and time */
  const getDeliverySchedules = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/staff/vehicle-schedules/get-all-delivery-schedules",
        { withCredentials: true }
      );

      setDeliverySchedules(response.data);
    } catch (error) {
      console.error("Error in getting delivery schedules", error);
    }
  };

  {
    /* Staff select the pickup schedule for the parcel */
  }
  const handleDeliveryScheduleSelection = async (parcelId, scheduleId) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/staff/vehicle-schedules/select-delivery-schedule",
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

  {
    /* Staff cancel the assigned delivery schedule for the parcel */
  }
  const handleCancelSelection = async (parcelId) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/staff/vehicle-schedules/cancel-delivery-schdeule",
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

  {
    /* When there are no availble delivery schedule for the parcel */
  }
  const addNewDeliverySchedule = async (parcelId) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/staff/vehicle-schedules/new-delivery-schedule",
        { parcelId },
        { withCredentials: true }
      );
      console.log(response);
      if (response.success) {
        const newSchedule = response.data.newDeliverySchedule;
        console.log("new schedule info",newSchedule)
        setSelectedScheduleId( newSchedule._id);

        await getDeliverySchedules();
        alert('New schedule created successfully!');
    }
  } catch (error) {
      console.log("Error in creating a new schedule", error);
    }
  };

  {/* Create a express delivery schedule for express parcels */}
  const addNewExpressDeliverySchedule = async(req, res) => {
    try {
        const response = await axios.post(
            "http://localhost:8000/staff/vehicle-schedules/new-express-delivery-schedule",
            {parcelId},
            {withCredentials: true}
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
    }
  }

  

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
    { label: "Delivery Date", 
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
      onClick: (row) => handleDeliveryScheduleSelection(parcelId, row.scheduleId),
      render: (row) => {
        const isSelected = selectedScheduleId === (row._id || row.scheduleId);
        return (
          <button
          className={`
            ${isSelected
              ? "bg-white font-semibold text-Primary border-2 border-Primary"
              : "bg-Primary font-semibold text-white border-2 border-Primary"
            }
            px-7 py-2 rounded-lg transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-Primary-light
            ${selectedScheduleId !== null && !isSelected
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
        onClick={() => addNewDeliverySchedule(parcelId)}
        disabled={selectedScheduleId !== null}
      >
        + New Schedule
      </button>
      <button
        className="bg-white text-Primary font-semibold border-2 border-Primary  px-4 py-2 rounded-xl hover:bg-green-50 hover:shadow-lg hover:shadow-slate-200"
        onClick={() => addNewExpressDeliverySchedule(parcelId)}
        disabled={selectedScheduleId !== null}
      >
        + New Express Delivery
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
