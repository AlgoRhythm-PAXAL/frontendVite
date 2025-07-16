import SectionTitle from "../../components/admin/SectionTitle";
import TableDistributor from "../../components/admin/UserTables/DataTable/TableDistributor";
import LoadingAnimation from "../../utils/LoadingAnimation";
import { useEffect, useState } from "react";
const backendURL = import.meta.env.VITE_BACKEND_URL;
import axios from 'axios'

const parcelColumns = [
  {
    accessorKey: "itemId",
    header: "Parcel No",
  },
  {
    accessorKey: "trackingNo",
    header: "Tracking No",
  },
  {
    accessorKey: "itemType",
    header: "Type",
  },
  {
    accessorKey: "itemSize",
    header: "Size",
  },
  {
    accessorKey: "receivingType",
    header: "Rcv. Type",
  },
  {
    accessorKey: "senderName",
    header: "Sender",
  },
  {
    accessorKey: "shipmentMethod",
    header: "Shp. Mtd",
  },

  {
    accessorKey: "status",
    header: "Current status",
  },
  {
    accessorKey: "createdAt",
    header: "Order placed date",
  },
];

const Parcels = () => {
  const [parcelData, setParcelData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let apiEndpoint = `${backendURL}/api/admin/parcels`;

        const response = await axios.get(apiEndpoint, {
          withCredentials: true,
        });
        const rawData = response.data.userData || response.data;
        const updatedData = rawData.map((item) => {
          const itemId =item.parcelId;
          let formattedCreatedAt = new Date(item.createdAt).toLocaleString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }
          );

          return {
            ...item,
            itemId, // add the resolved itemId
            createdAt: formattedCreatedAt,
            updatedAt: new Date(item.updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
          };
        });

        setParcelData(updatedData);
        setLoading(false);
      } catch (error) {
        console.error(`Error fetching data: `, error);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    <div className="flex flex-col mx-8">
      <SectionTitle title="Parcels" />
      <div className="flex flex-col ">
        <div className="my-8">
          <LoadingAnimation />
        </div>
      </div>
    </div>;
  }

  return (
    <div className="flex flex-col mx-8">
      <SectionTitle title="Parcels" />
      <div className="flex flex-col ">
        <div className="my-8">
          <TableDistributor
            title="parcel"
            entryData={parcelData}
            columns={parcelColumns}
            enableRowClick={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Parcels;
