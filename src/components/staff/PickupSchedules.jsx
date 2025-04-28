import React, { useEffect, useState } from "react";
import DataTable from "../../components/staff/DataTable";
import axios from "axios";
import { useParams } from "react-router-dom";

const PickupSchedules = ({ pickupDate, pickupTimeSlot, onAssignmentChange, parcelId  }) => {
  const [pickupSchedules, setPickupSchedules] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  

  useEffect(() => {
    getPickupSchedules();
    if (onAssignmentChange) {
      onAssignmentChange(selectedScheduleId !== null);
    }
  }, [selectedScheduleId, onAssignmentChange]);
  
  /* get all the availble pickup schdeuls for the date and time */
  const getPickupSchedules = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/staff/vehicle-schedules/get-all-pickup-schedules",
        {
          params: {
            pickupDate: pickupDate,
            pickupTime: pickupTimeSlot,
          },
        },
        { withCredentials: true }
      );

      setPickupSchedules(response.data);
    } catch (error) {
      console.error("Error in getting pickup schedules", error);
    }
  };

  {
    /* Staff select the pickup schedule for the parcel */
  }
  const handlePickupScheduleSelection = async (parcelId, scheduleId) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/staff/vehicle-schedules/select-pickup-schedule",
        { parcelId, scheduleId },
        { withCredentials: true }
      );
      console.log(response);
      setSelectedScheduleId(scheduleId);
      await getPickupSchedules();
    } catch (error) {
      console.log("Error in assigning parcel to a schedule", error);
    }
  };

  {
    /* Staff cancel the assigned pickup schedule for the parcel */
  }
  const handleCancelSelection = async (parcelId) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/staff/vehicle-schedules/cancel-pickup-schdeule",
        { parcelId, scheduleId: selectedScheduleId },
        { withCredentials: true }
      );
      console.log(response);
      setSelectedScheduleId(null);
      await getPickupSchedules();
    } catch (error) {
      console.log("Error in cancelling the assigned schedule", error);
    }
  };

  {
    /* When there are no availble pickup schedule for the parcel */
  }
  const addNewPickupSchedule = async (parcelId) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/staff/vehicle-schedules/new-pickup-schedule",
        { parcelId },
        { withCredentials: true }
      );
      console.log(response);
      if (response.data.success) {
        const newSchedule = response.data.newSchedule;
        setSelectedScheduleId( newSchedule._id);

        await getPickupSchedules();
        alert('New schedule created successfully!');
    }
  } catch (error) {
      console.log("Error in creating a new schedule", error);
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
      key: "pickupCities",
      render: (value, row) =>
        row.pickupCities && row.pickupCities.length > 0
          ? row.pickupCities.join("  ,  ")
          : "N/A",
    },
  ];

  const actions = [
    {
      label: "",
      className: "",
      onClick: (row) => handlePickupScheduleSelection(parcelId, row.scheduleId),
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
                : handlePickupScheduleSelection(parcelId, row.scheduleId)
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
      <button
        className="bg-white text-Primary font-semibold border-2 border-Primary mt-14 px-4 py-2 rounded-xl"
        onClick={() => addNewPickupSchedule(parcelId)}
        disabled={selectedScheduleId !== null}
      >
        + New Schedule
      </button>
      <DataTable
        data={pickupSchedules}
        columns={columns}
        actions={actions}
        rowsPerPage={4}
        getRowClassName={getRowClassName}
      />
      ;
    </>
  );
};

export default PickupSchedules;
