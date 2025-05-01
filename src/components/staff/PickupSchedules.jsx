import React, { useEffect, useState } from 'react';
import DataTable from '../../components/staff/DataTable';
import axios from 'axios';

const PickupSchedules = ({ pickupDate, pickupTimeSlot }) => {
  const [pickupSchedules, setPickupSchedules] = useState([]);

  const getPickupSchedules = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8000/staff/lodging-management/get-all-pickup-schedules',
        {
          params: {
            pickupDate: pickupDate,
            pickupTime: pickupTimeSlot,
          },
        },
        { withCredentials: true }
      );

      setPickupSchedules(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPickupSchedules();
  }, []);

  const columns = [
    {
      label: 'Vehicle',
      key: 'vehicleId',
      render: (value, row) => row.vehicleId?.vehicleId || 'N/A',
    },
    { label: 'Current Parcel Count', key: 'parcelCount' },
    {
      label: 'Covered Areas',
      key: 'pickupCities',
      render: (value, row) =>
        row.pickupCities && row.pickupCities.length > 0
          ? row.pickupCities.join('  ,  ')
          : 'N/A',
    },
  ];

  const actions = [
    {
      label: 'Select',
      className:
        'bg-white font-semibold text-Primary border-2 border-Primary px-7 py-2 rounded-lg hover:shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-Primary-light',
    },
  ];

  return (
    <DataTable
      data={pickupSchedules}
      columns={columns}
      actions={actions}
      rowsPerPage={4}
    />
  );
};

export default PickupSchedules;
