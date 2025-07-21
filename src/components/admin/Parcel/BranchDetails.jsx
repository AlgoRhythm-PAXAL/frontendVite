import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Users,
  Truck,
  Package,
  MapPin,
  Phone,
  Calendar,
  TrendingUp,
  User,
  Mail,
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  Car,
  RefreshCw
} from "lucide-react";
import LoadingAnimation from '../../../utils/LoadingAnimation';

const backendURL = import.meta.env.VITE_BACKEND_URL;

const BranchDetails = ({ entryId }) => {
  const [branchData, setBranchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchBranchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        `${backendURL}/api/branches/${entryId}/complete`,
        { withCredentials: true }
      );
      console.log("Branch data fetched successfully:", response.data);
      if (response.data.success) {
        setBranchData(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch branch data');
      }
    } catch (err) {
      console.error('Error fetching branch data:', err);
      setError(err.response?.data?.message || 'Failed to load branch data');
      toast.error('Failed to load branch data');
    } finally {
      setLoading(false);
    }
  }, [entryId]);

  useEffect(() => {
    if (entryId) {
      fetchBranchData();
    }
  }, [entryId, fetchBranchData]);

  const getStatusColor = (status) => {
    const statusColors = {
      'OrderPlaced': 'bg-blue-100 text-blue-800',
      'PendingPickup': 'bg-yellow-100 text-yellow-800',
      'PickedUp': 'bg-purple-100 text-purple-800',
      'ArrivedAtDistributionCenter': 'bg-indigo-100 text-indigo-800',
      'ShipmentAssigned': 'bg-orange-100 text-orange-800',
      'InTransit': 'bg-cyan-100 text-cyan-800',
      'ArrivedAtCollectionCenter': 'bg-teal-100 text-teal-800',
      'DeliveryDispatched': 'bg-pink-100 text-pink-800',
      'Delivered': 'bg-green-100 text-green-800',
      'NotAccepted': 'bg-red-100 text-red-800',
      'WrongAddress': 'bg-red-100 text-red-800',
      'Return': 'bg-gray-100 text-gray-800',
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (<LoadingAnimation/>
    //   <div className="space-y-6 p-6">
    //     <Skeleton className="h-8 w-64" />
    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    //       {[...Array(4)].map((_, i) => (
    //         <Skeleton key={i} className="h-32 w-full" />
    //       ))}
    //     </div>
    //     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    //       <Skeleton className="h-96 w-full" />
    //       <Skeleton className="h-96 w-full" />
    //     </div>
    //   </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Branch Data</h3>
        <p className="text-red-600 text-center mb-4">{error}</p>
        <Button onClick={fetchBranchData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (!branchData) {
    return <div className="text-center py-12">No branch data available</div>;
  }

  const { branch, summary, drivers, staff, parcels, vehicles, shipments, performanceMetrics } = branchData;

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {branch.location} Branch
          </h1>
          <p className="text-gray-600 mt-1">Branch ID: {branch.branchId}</p>
        </div>
        <Button onClick={fetchBranchData} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Branch Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Branch Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Location:</span>
              <span className="font-medium">{branch.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Contact:</span>
              <span className="font-medium">{branch.contact}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Created:</span>
              <span className="font-medium">{formatDate(branch.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Drivers</p>
                <p className="text-2xl font-bold text-gray-900">{summary.totalDrivers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-gray-900">{summary.totalStaff}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
                <p className="text-2xl font-bold text-gray-900">{summary.totalVehicles}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recent Parcels</p>
                <p className="text-2xl font-bold text-gray-900">{summary.recentParcels}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today&apos;s Schedules</p>
                <p className="text-2xl font-bold text-gray-900">{summary.todaySchedules}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-teal-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Shipments</p>
                <p className="text-2xl font-bold text-gray-900">{summary.totalShipments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Parcels Today</p>
                  <p className="text-2xl font-bold text-blue-900">{performanceMetrics.totalParcelsToday}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Delivered Today</p>
                  <p className="text-2xl font-bold text-green-900">{performanceMetrics.deliveredToday}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600">Pending Pickups</p>
                  <p className="text-2xl font-bold text-yellow-900">{performanceMetrics.pendingPickups}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            
            <div className="bg-cyan-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cyan-600">In Transit</p>
                  <p className="text-2xl font-bold text-cyan-900">{performanceMetrics.inTransit}</p>
                </div>
                <Truck className="w-8 h-8 text-cyan-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'drivers', label: 'Drivers', icon: Users },
            { id: 'staff', label: 'Staff', icon: User },
            { id: 'parcels', label: 'Recent Parcels', icon: Package },
            { id: 'vehicles', label: 'Vehicles', icon: Truck },
            { id: 'shipments', label: 'Shipments', icon: Car }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Driver Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Drivers:</span>
                    <span className="font-semibold">{drivers.statistics.totalDrivers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available Vehicles:</span>
                    <span className="font-semibold">{drivers.statistics.driversWithAvailableVehicles}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Staff Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Staff:</span>
                    <span className="font-semibold">{staff.statistics.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Staff:</span>
                    <span className="font-semibold text-green-600">
                      {staff.statistics.byStatus?.active || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inactive Staff:</span>
                    <span className="font-semibold text-red-600">
                      {staff.statistics.byStatus?.inactive || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'drivers' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {drivers.list.map((driver) => (
              <Card key={driver._id}>
                <CardHeader>
                  <CardTitle className="text-lg">{driver.name}</CardTitle>
                  <CardDescription>ID: {driver.driverId}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{driver.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{driver.contactNo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-500" />
                      <span>NIC: {driver.nic}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-gray-500" />
                      <span>License: {driver.licenseId}</span>
                    </div>
                    {driver.vehicleId && (
                      <div className="mt-3 p-2 bg-gray-50 rounded">
                        <p className="font-medium text-xs text-gray-600">Assigned Vehicle:</p>
                        <p className="text-sm">{driver.vehicleId.vehicleId}</p>
                        <p className="text-xs text-gray-500">
                          {driver.vehicleId.registrationNo} • {driver.vehicleId.vehicleType}
                        </p>
                        <Badge className={`mt-1 ${driver.vehicleId.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {driver.vehicleId.available ? 'Available' : 'In Use'}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {staff.list.map((member) => (
              <Card key={member._id}>
                <CardHeader>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription>ID: {member.staffId}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{member.contactNo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-500" />
                      <span>NIC: {member.nic}</span>
                    </div>
                    <div className="mt-3">
                      <Badge className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'parcels' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {parcels.recent.map((parcel) => (
              <Card key={parcel._id}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    {parcel.parcelId}
                    <Badge className={getStatusColor(parcel.status)}>
                      {parcel.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {parcel.trackingNo && `Tracking: ${parcel.trackingNo}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600">Item Type:</p>
                        <p className="font-medium">{parcel.itemType}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Size:</p>
                        <p className="font-medium">{parcel.itemSize}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600">Shipping:</p>
                        <p className="font-medium">{parcel.shippingMethod}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Receiving:</p>
                        <p className="font-medium">{parcel.receivingType}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600">Sender:</p>
                      <p className="font-medium">{parcel.senderId?.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Created:</p>
                      <p className="font-medium">{formatDate(parcel.createdAt)}</p>
                    </div>
                    {parcel.specialInstructions && (
                      <div>
                        <p className="text-gray-600">Special Instructions:</p>
                        <p className="font-medium text-orange-600">{parcel.specialInstructions}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            {/* Vehicle Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Vehicle Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{vehicles.statistics.total}</p>
                    <p className="text-sm text-gray-600">Total Vehicles</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{vehicles.statistics.available}</p>
                    <p className="text-sm text-gray-600">Available</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{vehicles.statistics.inUse}</p>
                    <p className="text-sm text-gray-600">In Use</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {vehicles.statistics.totalCapacity.volume.toFixed(1)} m³
                    </p>
                    <p className="text-sm text-gray-600">Total Volume</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle List */}
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Fleet</CardTitle>
                <CardDescription>
                  All vehicles assigned to this branch
                </CardDescription>
              </CardHeader>
              <CardContent>
                {vehicles.list.length === 0 ? (
                  <div className="text-center py-8">
                    <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No vehicles assigned to this branch</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {vehicles.list.map((vehicle) => (
                      <Card key={vehicle._id}>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center justify-between">
                            {vehicle.vehicleId}
                            <Badge className={vehicle.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {vehicle.available ? 'Available' : 'In Use'}
                            </Badge>
                          </CardTitle>
                          <CardDescription>{vehicle.registrationNo}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Type:</span>
                              <span className="font-medium">{vehicle.vehicleType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Volume Capacity:</span>
                              <span className="font-medium">{vehicle.capableVolume} m³</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Weight Capacity:</span>
                              <span className="font-medium">{vehicle.capableWeight} kg</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Today's Schedule Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Today&apos;s Schedule Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{vehicles.todayScheduleSummary.totalSchedules}</p>
                    <p className="text-sm text-gray-600">Total Schedules</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{vehicles.todayScheduleSummary.pickupSchedules}</p>
                    <p className="text-sm text-gray-600">Pickup Schedules</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{vehicles.todayScheduleSummary.deliverySchedules}</p>
                    <p className="text-sm text-gray-600">Delivery Schedules</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{vehicles.todayScheduleSummary.totalParcelsScheduled}</p>
                    <p className="text-sm text-gray-600">Scheduled Parcels</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Shipments Tab */}
        {activeTab === 'shipments' && (
          <div className="space-y-6">
            {/* Shipments Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Shipments Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{shipments.statistics.total}</p>
                    <p className="text-sm text-gray-600">Total Shipments</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{shipments.statistics.byStatus['Delivered'] || 0}</p>
                    <p className="text-sm text-gray-600">Delivered</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{shipments.statistics.byStatus['In Transit'] || 0}</p>
                    <p className="text-sm text-gray-600">In Transit</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{shipments.statistics.totalParcelsInShipments}</p>
                    <p className="text-sm text-gray-600">Parcels in Shipments</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipments List */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Shipments</CardTitle>
                <CardDescription>
                  Latest shipments associated with this branch
                </CardDescription>
              </CardHeader>
              <CardContent>
                {shipments.list.length === 0 ? (
                  <div className="text-center py-8">
                    <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No shipments found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {shipments.list.slice(0, 10).map((shipment) => (
                      <div key={shipment._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <p className="font-medium">Shipment #{shipment.shipmentId}</p>
                              <p className="text-sm text-gray-600">
                                From: {shipment.sourceCenter?.location || 'N/A'} → To: {shipment.currentLocation?.location || 'N/A'}
                              </p>
                              <p className="text-xs text-gray-500">
                                Created: {formatDate(shipment.createdAt)}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(shipment.status)}>
                                {shipment.status}
                              </Badge>
                              <p className="text-sm text-gray-600 mt-1">
                                {shipment.parcels?.length || 0} parcels
                              </p>
                            </div>
                          </div>
                          {shipment.assignedVehicle && (
                            <div className="mt-2 text-sm text-gray-600">
                              Vehicle: {shipment.assignedVehicle.vehicleId} ({shipment.assignedVehicle.registrationNo})
                            </div>
                          )}
                          {shipment.assignedDriver && (
                            <div className="text-sm text-gray-600">
                              Driver: {shipment.assignedDriver.name}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 pt-6 border-t">
        Last updated: {formatDate(branchData.lastUpdated)}
      </div>
    </div>
  );
};

BranchDetails.propTypes = {
  entryId: PropTypes.string.isRequired
};

export default BranchDetails;