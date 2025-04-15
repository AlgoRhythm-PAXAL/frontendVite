import { useState,useEffect } from 'react';
import { DataTable } from "./DataTable";
import { EntryDetails } from "../../Parcel/EntryDetails";
import axios from 'axios';
import Modal from '../../adminProfile/Modal';


const formatUser = (str) => {
    if (!str) return '';
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')+'s';
  };
  


export default function TableDistributor({title,entryData,columns,deleteEnabled,updateEnabled,disableDateFilter,enableRowClick}) {
    const [data, setData] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const user = title.toLowerCase();
    const formattedUser = formatUser(user)
//    if(!entryData){
//     let apiEndpoint="";
//     if(user==='admin'){
//         apiEndpoint=`${backendURL}/${user}/all`;
//     }
//     else if(user==='branche'){
//         apiEndpoint=`${backendURL}/admin/branch/all`;
//     }
//     else if(user ==='parcel status tracking and assignment detail'){
//         apiEndpoint=`${backendURL}/admin/track/statuses`;
//     }
//     else {
//         apiEndpoint=`${backendURL}/admin/${user}/all`;
//     }
    
// // // Fetching data when component mount
// //     useEffect(() => {
// //         const fetchData = async () => {
// //             try {
// //                 const response = await axios.get(apiEndpoint, { withCredentials: true });
// //                 console.log(response.data.userData);
// //                 const rawData = response.data.userData || response.data;
                
// //                 const updatedData = rawData.map(item => {
// //                     const itemId = item.parcelId || item.userId || item.driverId || item.staffId || item.branchId|| item.adminId || item.vehicleId||item.id;
// //                     let formattedCreatedAt;
// //                 if (user === 'parcel') {
// //                     formattedCreatedAt = new Date(item.createdAt).toLocaleString('en-US', {
// //                       year: 'numeric',
// //                       month: 'short',
// //                       day: 'numeric',
// //                       hour: '2-digit',
// //                       minute: '2-digit',
// //                       hour12: true
// //                     });
// //                   } else {
// //                     formattedCreatedAt = new Date(item.createdAt).toLocaleDateString('en-US', {
// //                       year: 'numeric',
// //                       month: 'short',
// //                       day: 'numeric'
// //                     });
// //                   }
// //                     return {
// //                         ...item,
// //                         itemId, // add the resolved itemId
// //                         createdAt: formattedCreatedAt,
// //                         updatedAt: new Date(item.updatedAt).toLocaleDateString('en-US', {
// //                             year: 'numeric',
// //                             month: 'short',
// //                             day: 'numeric'
// //                         })
// //                     };
// //                 });
    
// //                 console.log(updatedData);
// //                 setData(updatedData);
    
// //             } catch (error) {
// //                 console.error(`Error fetching `, error);
// //             }
// //         };
    
// //         fetchData();
// //     }, []);
    

//    }
   useEffect(() => {
    const fetchData = async () => {
        if(entryData) {
            console.log(entryData);
            setData(Array.isArray(entryData) ? entryData : [entryData]);
            return;
        }

        try {
            let apiEndpoint;
            if(user === 'admin') {
                apiEndpoint = `${backendURL}/${user}/all`;
            } else if(user === 'branche') {
                apiEndpoint = `${backendURL}/admin/branch/all`;
            } else if(user === 'parcel status tracking and assignment detail') {
                apiEndpoint = `${backendURL}/admin/track/statuses`;
            } else {
                apiEndpoint = `${backendURL}/admin/${user}/all`;
            }

            const response = await axios.get(apiEndpoint, { withCredentials: true });
            const rawData = response.data.userData || response.data;
            const updatedData = rawData.map(item => {
                const itemId = item.parcelId || item.userId || item.driverId || item.staffId || item.branchId|| item.adminId || item.vehicleId||item.id;
                let formattedCreatedAt;
            if (user === 'parcel') {
                formattedCreatedAt = new Date(item.createdAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                });
              } else {
                formattedCreatedAt = new Date(item.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                });
              }
                return {
                    ...item,
                    itemId, // add the resolved itemId
                    createdAt: formattedCreatedAt,
                    updatedAt: new Date(item.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })
                };
            });

            setData(updatedData);
        } catch (error) {
            console.error(`Error fetching data: `, error);
        }
    };

    fetchData();
}, [entryData, user, backendURL]);

    const handleRowClick = (collection, itemId) => {
        setSelectedEntry({ collection, itemId });
    };

    return (
        <div className="container mx-auto p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 w-full">
            <DataTable 
                collectionName={user}
                title={formattedUser}
                columns={columns} 
                data={data} 
                deleteEnabled={deleteEnabled} 
                updateEnabled={updateEnabled} 
                disableDateFilter={disableDateFilter}
                enableRowClick={enableRowClick}
                onRowClick={handleRowClick}
            />

            {/* Modal Opening */}
            <Modal open={!!selectedEntry} onClose={() => setSelectedEntry(null)} >
                {selectedEntry && (
                        <EntryDetails 
                            collectionName={selectedEntry.collection}
                            entryId={selectedEntry.itemId}
                            onClose={() => setSelectedEntry(null)}
                        />
                )}
            </Modal>
        </div>
    )
}

// DemoPage.propTypes = {
//     title: PropTypes.string.isRequired,
//     deleteEnabled: PropTypes.bool,
//     updateEnabled: PropTypes.bool,
//     disableDateFilter: PropTypes.bool
// };

// DemoPage.defaultProps = {
//     deleteEnabled: false,
//     updateEnabled: false,
//     disableDateFilter: false
// };



// import { DataTable } from "./DataTable"
// import { useState, useEffect } from "react"
// import axios from 'axios'
// import PropTypes from 'prop-types';

// const driverColumns=[
//     {
//         accessorKey: "name",
//         header: "Name"
//     },
//     {
//         accessorKey: "nic",
//         header: "NIC"
//     },
//     {
//         accessorKey: "email",
//         header: "Email",
//     },
//     {
//         accessorKey:"contactNo",
//         header:"Contact"
//     },
//     {
//         accessorKey:"createdAt",
//         header:"Joined date"
//     },
//     {
//         accessorKey:"licenseId",
//         header:"License Id"
//     },
//     {
//         accessorKey:"branchLocation",
//         header:"Branch"
//     },
//     {
//         accessorKey:"branchContactNo",
//         header:"Branch Contact"
//     },
//     {
//         accessorKey:"adminName",
//         header:"Added Admin"
//     },
//     // {
//     //     accessorKey:"",
//     //     header:""
//     // },
// ];
// const adminColumns=[
//     {
//         accessorKey: "name",
//         header: "Name"
//     },
//     {
//         accessorKey: "nic",
//         header: "NIC"
//     },
//     {
//         accessorKey: "email",
//         header: "Email",
//     },
//     {
//         accessorKey:"contactNo",
//         header:"Contact"
//     },
//     {
//         accessorKey:"createdAt",
//         header:"Joined date"
//     },
// ]
// const staffColumns=[
//     {
//         accessorKey: "name",
//         header: "Name"
//     },
//     {
//         accessorKey: "nic",
//         header: "NIC"
//     },
//     {
//         accessorKey: "email",
//         header: "Email",
//     },
//     {
//         accessorKey:"contactNo",
//         header:"Contact"
//     },
//     {
//         accessorKey:"createdAt",
//         header:"Joined date"
//     },
//     {
//         accessorKey:"status",
//         header:"Status"
//     },
//     {
//         accessorKey:"branchLocation",
//         header:"Branch"
//     },
//     {
//         accessorKey:"adminName",
//         header:"Added admin"
//     },
    
// ]
// const customerColumns=[
//     {
//         accessorKey: "name",
//         header: "Name"
//     },
//     {
//         accessorKey: "nic",
//         header: "NIC"
//     },
//     {
//         accessorKey: "email",
//         header: "Email",
//     },
//     {
//         accessorKey:"contact",
//         header:"Contact"
//     },
//     {
//         accessorKey:"address",
//         header:"Address"
//     },
//     {
//         accessorKey:"createdAt",
//         header:"Joined date"
//     },
// ]
// const parcelColumns=[
//     {
//         accessorKey:"parcelId  ",
//         header:"Parcel No"
//     },
//     {
//         accessorKey:"trackingNo",
//         header:"Tracking No"
//     },
//     {
//         accessorKey:"itemType",
//         header:"Item type"
//     },
//     {
//         accessorKey:"itemSize",
//         header:"Item size"
//     },
//     {
//         accessorKey:"receivingType",
//         header:"Receiving type"
//     },
//     {
//         accessorKey:"senderName",
//         header:"Sender"
//     },
//     {
//         accessorKey:"shipmentMethod",
//         header:"Shipping Method"
//     },
//     {
//         accessorKey:"specialInstructions",
//         header:"Special Instructions"
//     },
//     {
//         accessorKey:"status",
//         header:"Current status"
//     },
//     {
//         accessorKey:"createdAt",
//         header:"Order placed date"
//     },
// ]
// const vehicleColumns=[
//     {
//         accessorKey: "registrationNo",
//         header: "Registration No"
//     },
//     {
//         accessorKey: "vehicleType",
//         header: "Vehicle Type"
//     },
//     {
//         accessorKey: "capableVolume",
//         header: "Capable Volume"
//     },
//     {
//         accessorKey: "capableWeight",
//         header: "Capable Weight"
//     },
//     {
//         accessorKey: "assignedBranch",
//         header: "Assigned Branch"
//     },
//     {
//         accessorKey: "currentBranch",
//         header: "Current Branch"
//     },
// ]

// const branchColumns=[
//     {
//         accessorKey: "branchId",
//         header: "Branch No"
//     },
//     {
//         accessorKey: "location",
//         header: "Branch location"
//     },
//     {
//         accessorKey: "contact",
//         header: "Contact"
//     },
//     {
//         accessorKey: "updatedAt",
//         header: "Last update"
//     },
//     {
//         accessorKey: "createdAt",
//         header: "Since"
//     },
// ]

// export default function DemoPage(props) {
//     const [data, setData] = useState([]);
//     const backendURL = import.meta.env.VITE_BACKEND_URL;
//     const user=props.title.toLowerCase();
//     const formattedUser = user.charAt(0).toUpperCase() + user.slice(1) + 's';

    // let apiEndpoint="";
    // let columns = adminColumns;
    // if(user==='admin'){
    //     apiEndpoint=`${backendURL}/${user}/all`;
    // }
    // else if(user==='branche'){
    //     apiEndpoint=`${backendURL}/admin/branch/all`;
    // }
    // else {
    //     apiEndpoint=`${backendURL}/admin/${user}/all`;
    // }
    

    // if(user==='admin'){
    //     columns=adminColumns
    // }
    // else if(user==='driver'){
    //     columns=driverColumns
    // }
    // else if(user==='staff'){
    //     columns=staffColumns
    // }else if(user==='customer'){
    //     columns=customerColumns
    // }
    // else if(user==='parcel'){
    //     columns=parcelColumns
    // }
    // else if(user==='vehicle'){
    //     columns=vehicleColumns
    // }
    // else if(user==='branch'){
    //     columns=branchColumns
    // }

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get(apiEndpoint, { withCredentials: true });
    //             console.log(response.data)
    //             const rawData = response.data.userData ||response.data;
    //             const updatedData = rawData.map(item => ({
    //                 ...item,
    //                 createdAt: new Date(item.createdAt).toLocaleDateString('en-US', {
    //                     year: 'numeric',
    //                     month: 'short',
    //                     day: 'numeric'
    //                 }),
    //                 updatedAt: new Date(item.createdAt).toLocaleDateString('en-US', {
    //                     year: 'numeric',
    //                     month: 'short',
    //                     day: 'numeric'
    //                 })
    //             }));
    //             console.log(updatedData);
    //             setData(updatedData);


    //         } catch (error) {
    //             console.error(`Error fetching `, error);
    //         }
    //     };

    //     fetchData();
    // }, []);


//     return (
//         <div className="container mx-auto p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 w-full">
//             <DataTable title={formattedUser}columns={columns} data={data} deleteEnabled={props.deleteEnabled} updateEnabled={props.updateEnabled} disableDateFilter={props.disableDateFilter} />
//             {/* <DataTable title="User Management" columns={columns} data={data} deleteEnabled={true} updateEnabled={true} deleteText="Remove User" updateText="update" onDelete={(user) => handleDelete(user.id)}/> */}
//         </div>
//     )
// }


// // Validate props with PropTypes
// DemoPage.propTypes = {
//     title: PropTypes.string.isRequired, // title must be a string and is required
//   };