import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import SectionTitle from '../../components/admin/SectionTitle';
import {
  Calendar as CalendarIcon,
  MapPin,
  Truck,
  User,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Filter,
  ChevronDown,
  ChevronUp,
  Phone,
  Gauge,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import LoadingAnimation from '../../utils/LoadingAnimation';

const backendURL = import.meta.env.VITE_BACKEND_URL;

// Helper function to format date for API (YYYY-MM-DD format)
const formatDateForAPI = (date) => {
  if (!date) return null;
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.warn('Error formatting date for API:', date, error);
    return null;
  }
};

// Helper function to format date for display
const formatDateForDisplay = (dateInput) => {
  if (!dateInput) return '';
  try {
    return new Date(dateInput).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Invalid Date';
  }
};

// Utility functions
const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Invalid Date';
  }
};

const formatTime = (dateString) => {
  try {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return 'Invalid Time';
  }
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'in_progress':
    case 'active':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'upcoming':
    case 'scheduled':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return <CheckCircle className="w-4 h-4" />;
    case 'in_progress':
    case 'active':
      return <Clock className="w-4 h-4" />;
    case 'upcoming':
    case 'scheduled':
      return <AlertCircle className="w-4 h-4" />;
    case 'cancelled':
      return <XCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

// Schedule Card Component
/* eslint-disable react/prop-types */
const ScheduleCard = ({ schedule, type }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`p-3 rounded-xl ${
                type === 'pickup'
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-green-50 border border-green-200'
              }`}
            >
              {type === 'pickup' ? (
                <Package
                  className={`w-6 h-6 ${
                    type === 'pickup' ? 'text-blue-600' : 'text-green-600'
                  }`}
                />
              ) : (
                <Truck
                  className={`w-6 h-6 ${
                    type === 'pickup' ? 'text-blue-600' : 'text-green-600'
                  }`}
                />
              )}
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                {schedule.scheduleId}
              </CardTitle>
              <p className="text-sm text-gray-600 font-medium">
                {formatDate(schedule.scheduleDate)} • {schedule.timeSlot}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge
              className={`${getStatusColor(
                schedule.status
              )} border font-medium`}
            >
              <div className="flex items-center space-x-1">
                {getStatusIcon(schedule.status)}
                <span className="capitalize">{schedule.status}</span>
              </div>
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="hover:bg-gray-100"
            >
              {expanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Summary Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Vehicle Info */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 text-sm">
              <Truck className="w-4 h-4 text-gray-600" />
              <span className="font-semibold text-gray-900">
                {schedule.vehicle?.registrationNo || 'N/A'}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{schedule.vehicle?.assignedBranch?.location || 'N/A'}</span>
            </div>
          </div>

          {/* Driver Info */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 text-sm">
              <User className="w-4 h-4 text-gray-600" />
              <span className="font-semibold text-gray-900">
                {schedule.driver?.name || 'N/A'}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{schedule.driver?.contactNo || 'N/A'}</span>
            </div>
          </div>

          {/* Capacity Info */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 text-sm">
              <Package className="w-4 h-4 text-gray-600" />
              <span className="font-semibold text-gray-900">
                {schedule.capacity?.parcelCount || 0} Parcels
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Gauge className="w-4 h-4" />
              <span>{schedule.capacity?.volumeUtilization || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="border-t pt-6 space-y-6">
            {/* Detailed Vehicle Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <h4 className="font-bold text-lg mb-4 flex items-center text-gray-800">
                <Truck className="w-5 h-5 mr-3 text-blue-600" />
                Vehicle Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">
                      Vehicle ID:
                    </span>
                    <span className="font-semibold text-gray-900">
                      {schedule.vehicle?.vehicleId || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Type:</span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {schedule.vehicle?.vehicleType || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Max Volume:</span>
                    <span className="font-semibold text-gray-900">
                      {schedule.vehicle?.capacity?.maxVolume || 0} {schedule.vehicle?.capacity?.volumeUnit || 'm³'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Max Weight:</span>
                    <span className="font-semibold text-gray-900">
                      {schedule.vehicle?.capacity?.maxWeight || 0} {schedule.vehicle?.capacity?.weightUnit || 'kg'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Status:</span>
                    <Badge
                      variant={
                        schedule.vehicle?.available ? 'default' : 'destructive'
                      }
                      className="text-xs"
                    >
                      {schedule.vehicle?.available
                        ? 'Available'
                        : 'Unavailable'}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">
                      Current Location:
                    </span>
                    <span className="font-semibold text-gray-900">
                      {schedule.vehicle?.currentBranch?.location || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">
                      Assigned Branch:
                    </span>
                    <span className="font-semibold text-gray-900">
                      {schedule.vehicle?.assignedBranch?.location || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">
                      Registration:
                    </span>
                    <span className="font-semibold text-gray-900">
                      {schedule.vehicle?.registrationNo || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Driver Info */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
              <h4 className="font-bold text-lg mb-4 flex items-center text-gray-800">
                <User className="w-5 h-5 mr-3 text-green-600" />
                Driver Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">
                      Driver ID:
                    </span>
                    <span className="font-semibold text-gray-900">
                      {schedule.driver?.driverId || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Name:</span>
                    <span className="font-semibold text-gray-900">
                      {schedule.driver?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Email:</span>
                    <span className="font-semibold text-gray-900">
                      {schedule.driver?.email || 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Contact:</span>
                    <span className="font-semibold text-gray-900">
                      {schedule.driver?.contactNo || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">
                      License ID:
                    </span>
                    <span className="font-semibold text-gray-900">
                      {schedule.driver?.licenseId || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Branch:</span>
                    <span className="font-semibold text-gray-900">
                      {schedule.driver?.driverBranch?.location || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Capacity Details */}
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-100">
              <h4 className="font-bold text-lg mb-4 flex items-center text-gray-800">
                <Gauge className="w-5 h-5 mr-3 text-purple-600" />
                Capacity Utilization
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-600">
                    {schedule.capacity?.totalVolume || '0'}
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Volume
                  </div>
                  <div className="text-xs text-gray-500">
                    ({schedule.capacity?.volumeUtilization || 'N/A'})
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-600">
                    {schedule.capacity?.totalWeight || '0'}
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Weight
                  </div>
                  <div className="text-xs text-gray-500">
                    ({schedule.capacity?.weightUtilization || 'N/A'})
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-600">
                    {schedule.capacity?.parcelCount || 0}
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Parcels
                  </div>
                </div>
                <div className="space-y-2">
                  <div
                    className={`text-2xl font-bold ${
                      schedule.capacity?.hasCapacity
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {schedule.capacity?.hasCapacity !== undefined
                      ? schedule.capacity.hasCapacity
                        ? 'Yes'
                        : 'No'
                      : 'N/A'}
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Has Capacity
                  </div>
                </div>
              </div>
            </div>

            {/* Parcels List */}
            {schedule.parcels && schedule.parcels.length > 0 && (
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-100">
                <h4 className="font-bold text-lg mb-4 flex items-center text-gray-800">
                  <Package className="w-5 h-5 mr-3 text-orange-600" />
                  Parcels ({schedule.parcels.length})
                </h4>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {schedule.parcels.map((parcel, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg border border-orange-200 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Package className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold text-gray-900">
                            {parcel.trackingNo || 'N/A'}
                          </span>
                        </div>
                        <Badge
                          className={getStatusColor(parcel.status)}
                          variant="outline"
                        >
                          {parcel.status || 'Unknown'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="font-medium text-gray-600">
                            Type:
                          </span>
                          <div className="text-gray-900">
                            {parcel.itemType || 'N/A'}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            Size:
                          </span>
                          <div className="text-gray-900">
                            {parcel.itemSize || 'N/A'}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            From:
                          </span>
                          <div className="text-gray-900">
                            {parcel.route?.from?.location || 'N/A'}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">To:</span>
                          <div className="text-gray-900">
                            {parcel.route?.to?.location || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-600">Created:</span>
                  <span className="text-gray-900">
                    {formatDate(schedule.createdAt)} at{' '}
                    {formatTime(schedule.createdAt)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-600">Updated:</span>
                  <span className="text-gray-900">
                    {formatDate(schedule.updatedAt)} at{' '}
                    {formatTime(schedule.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Summary Stats Component with Date Filters
/* eslint-disable react/prop-types */
const SummaryStats = ({ pickupData, deliveryData, onDateFilterChange, selectedDateFilter }) => {
  if (!pickupData && !deliveryData) return null;

  // Calculate combined statistics
  const totalPickupSchedules = pickupData?.summary?.totalSchedules || 0;
  const totalDeliverySchedules = deliveryData?.summary?.totalSchedules || 0;
  const totalSchedules = totalPickupSchedules + totalDeliverySchedules;

  const totalPickupParcels = pickupData?.summary?.totalParcels || 0;
  const totalDeliveryParcels = deliveryData?.summary?.totalParcels || 0;
  const totalParcels = totalPickupParcels + totalDeliveryParcels;

  // Date filter presets
  const datePresets = [
    {
      label: 'Today',
      value: 'today',
      getDate: () => new Date().toISOString()
    },
    {
      label: 'Yesterday',
      value: 'yesterday',
      getDate: () => {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        return date.toISOString();
      }
    },
    {
      label: 'Last 7 Days',
      value: '7days',
      getDate: () => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date.toISOString();
      }
    },
    {
      label: 'Last 30 Days',
      value: '30days',
      getDate: () => {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return date.toISOString();
      }
    },
    {
      label: 'All Time',
      value: 'all',
      getDate: () => null
    }
  ];

  return (
    <div className="space-y-4">
      {/* Date Filter Presets */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-gray-600" />
              <span className="text-lg font-semibold text-gray-900">Quick Date Filters</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {datePresets.map((preset) => (
              <Button
                key={preset.value}
                variant={selectedDateFilter === preset.value ? "default" : "outline"}
                size="sm"
                onClick={() => onDateFilterChange(preset.value, preset.getDate())}
                className={`h-8 text-xs ${
                  selectedDateFilter === preset.value
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards - Less Colorful */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gray-100 rounded-full">
                <CalendarIcon className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {totalSchedules}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Total Schedules
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {totalPickupSchedules} Pickups • {totalDeliverySchedules} Deliveries
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gray-100 rounded-full">
                <Package className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {totalParcels}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Total Parcels
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {totalPickupParcels} Pickups • {totalDeliveryParcels} Deliveries
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gray-100 rounded-full">
                <Truck className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {totalPickupSchedules}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Pickup Schedules
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {totalPickupParcels} Parcels
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gray-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {totalDeliverySchedules}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Delivery Schedules
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {totalDeliveryParcels} Parcels
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const VehicleSchedules = () => {
  const [pickupData, setPickupData] = useState(null);
  const [deliveryData, setDeliveryData] = useState(null);
  const [allBranches, setAllBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString()); // Default to today
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('pickup');
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState('today'); // New state for date filter presets

  // Handle date filter changes from presets
  const handleDateFilterChange = useCallback((filterType, dateValue) => {
    setSelectedDateFilter(filterType);
    setSelectedDate(dateValue);
  }, []);

  // Fetch schedules data
  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters for both pickup and delivery
      const buildURL = (type) => {
        const queryParams = new URLSearchParams();

        if (selectedDate) {
          const apiDate = formatDateForAPI(selectedDate);
          if (apiDate) {
            queryParams.append('date', apiDate);
          }
        }

        if (selectedBranch !== 'all') {
          queryParams.append('branchId', selectedBranch);
        }

        if (selectedTimeSlot !== 'all') {
          queryParams.append('timeSlot', selectedTimeSlot);
        }

        if (selectedStatus !== 'all') {
          queryParams.append('status', selectedStatus);
        }

        const queryString = queryParams.toString();
        const baseURL = `${backendURL}/api/admin/vehicle-schedules/${type}`;
        return queryString ? `${baseURL}?${queryString}` : baseURL;
      };

      const pickupURL = buildURL('pickup');
      const deliveryURL = buildURL('delivery');

      const [pickupResponse, deliveryResponse, branchesResponse] =
        await Promise.all([
          axios.get(pickupURL, {
            withCredentials: true,
            timeout: 15000,
          }),
          axios.get(deliveryURL, {
            withCredentials: true,
            timeout: 15000,
          }),
          axios
            .get(`${backendURL}/api/admin/branches`, {
              withCredentials: true,
              timeout: 15000,
            })
            .catch((err) => {
              console.warn('Failed to fetch branches:', err);
              return { data: { branches: [] } };
            }),
        ]);

      setPickupData(pickupResponse.data.data);
      setDeliveryData(deliveryResponse.data.data);

      // Set branches if available
      if (branchesResponse.data?.data?.branches) {
        setAllBranches(branchesResponse.data.data.branches);
      } else if (branchesResponse.data?.branches) {
        setAllBranches(branchesResponse.data.branches);
      }

      toast.success('Vehicle schedules loaded successfully');
    } catch (error) {
      console.error('Error fetching schedules:', error);

      let errorMessage = 'Failed to load vehicle schedules';
      if (error.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage =
          "Access denied. You don't have permission to view schedules.";
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedBranch, selectedTimeSlot, selectedStatus]);

  // Get unique branches for filter
  const availableBranches = useMemo(() => {
    const branchesMap = new Map();

    // Add branches from API first
    allBranches?.forEach((branch) => {
      if (branch && branch._id) {
        branchesMap.set(String(branch._id), {
          id: String(branch._id),
          name:
            branch.location || branch.branchName || `Branch ${branch.branchId}`,
          branchId: branch.branchId, // Keep custom ID for display
        });
      }
    });

    // Add branches from schedule data
    const addBranchesFromSchedules = (schedules) => {
      schedules?.forEach((schedule) => {
        const branchSources = [
          schedule.scheduleBranch,
          schedule.vehicle?.assignedBranch,
          schedule.vehicle?.currentBranch,
        ];

        branchSources.forEach((branchSource) => {
          if (branchSource && branchSource._id) {
            branchesMap.set(String(branchSource._id), {
              id: String(branchSource.branchId),
              name:
                branchSource.location ||
                branchSource.branchName ||
                `Branch ${branchSource.branchId}`,
              branchId: branchSource.branchId, // Keep custom ID for display
            });
          }
        });
      });
    };

    addBranchesFromSchedules(pickupData?.schedules);
    addBranchesFromSchedules(deliveryData?.schedules);

    return Array.from(branchesMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [pickupData, deliveryData, allBranches]);

  useEffect(() => {
    fetchSchedules();
  }, [
    selectedDate,
    selectedBranch,
    selectedTimeSlot,
    selectedStatus,
    fetchSchedules,
  ]);

  if (loading) {
    return (
      <div className="mx-8">
        <SectionTitle title="Vehicle Schedules" />
        <div className="min-h-screen flex items-center justify-center">
          <LoadingAnimation message="Loading vehicle schedules..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-8">
        <SectionTitle title="Vehicle Schedules" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button
              variant="outline"
              size="sm"
              className="ml-4"
              onClick={fetchSchedules}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mx-8 space-y-6">
      <SectionTitle title="Vehicle Schedules" />
      <SummaryStats 
        pickupData={pickupData} 
        deliveryData={deliveryData} 
        onDateFilterChange={handleDateFilterChange}
        selectedDateFilter={selectedDateFilter}
      />
      {/* Professional Filters Card */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-lg font-semibold text-gray-900">Filters</span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-6">
            {/* Filter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {/* Professional Date Picker */}
              <div className="space-y-2 sm:col-span-1 lg:col-span-1">
                <label className="text-sm font-medium text-gray-700">
                  Date
                </label>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full h-10 justify-start text-left font-normal',
                        !selectedDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        {selectedDate
                          ? formatDateForDisplay(selectedDate)
                          : 'Select date'}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        selectedDate ? new Date(selectedDate) : undefined
                      }
                      onSelect={(newDate) => {
                        const isoDate = newDate ? newDate.toISOString() : null;
                        setSelectedDate(isoDate);
                        setDatePickerOpen(false);
                      }}
                      initialFocus
                    />
                    {selectedDate && (
                      <div className="p-3 border-t">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedDate(null);
                            setDatePickerOpen(false);
                          }}
                          className="w-full text-xs"
                        >
                          Clear selection
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>

              {/* Professional Branch Filter */}
              <div className="space-y-2 sm:col-span-1 lg:col-span-1">
                <label className="text-sm font-medium text-gray-700">
                  Branch
                </label>
                <Select
                  value={selectedBranch}
                  onValueChange={setSelectedBranch}
                >
                  <SelectTrigger className="w-full h-10">
                    <MapPin className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500" />
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                        All Branches ({availableBranches.length})
                      </div>
                    </SelectItem>
                    {availableBranches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          {branch.branchId}-{branch.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Professional Time Slot Filter */}
              <div className="space-y-2 sm:col-span-1 lg:col-span-1">
                <label className="text-sm font-medium text-gray-700">
                  Time Slot
                </label>
                <Select
                  value={selectedTimeSlot}
                  onValueChange={setSelectedTimeSlot}
                >
                  <SelectTrigger className="w-full h-10">
                    <Clock className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500" />
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                        All Time Slots
                      </div>
                    </SelectItem>
                    <SelectItem value="morning">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-amber-500" />
                        Morning (8AM-12PM)
                      </div>
                    </SelectItem>
                    <SelectItem value="afternoon">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-orange-500" />
                        Afternoon (1PM-5PM)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Professional Status Filter */}
              <div className="space-y-2 sm:col-span-1 lg:col-span-1">
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full h-10">
                    <CheckCircle className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500" />
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center">
                        <Filter className="w-4 h-4 mr-2 text-gray-500" />
                        All Status
                      </div>
                    </SelectItem>
                    <SelectItem value="active">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-blue-500" />
                        Active
                      </div>
                    </SelectItem>

                    <SelectItem value="today">
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-2 text-green-500" />
                        Today
                      </div>
                    </SelectItem>
                    <SelectItem value="completed">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Completed
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
              {(selectedDate ||
                selectedBranch !== 'all' ||
                selectedTimeSlot !== 'all' ||
                selectedStatus !== 'all') && (
                <Button
                  onClick={() => {
                    setSelectedDate(new Date().toISOString());
                    setSelectedDateFilter('today');
                    setSelectedBranch('all');
                    setSelectedTimeSlot('all');
                    setSelectedStatus('all');
                  }}
                  variant="outline"
                  size="sm"
                  className="h-9 hover:bg-gray-50"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reset to Today
                </Button>
              )}
              <Button
                onClick={fetchSchedules}
                variant="outline"
                size="sm"
                className="h-9 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters Badge */}
      {(selectedDateFilter !== 'today' ||
        selectedBranch !== 'all' ||
        selectedTimeSlot !== 'all' ||
        selectedStatus !== 'all') && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-blue-800">
                <span className="font-medium">Active filters:</span>
                {selectedDateFilter !== 'today' && selectedDate && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    {selectedDateFilter === 'all' ? 'All Time' : 
                     selectedDateFilter === 'yesterday' ? 'Yesterday' :
                     selectedDateFilter === '7days' ? 'Last 7 Days' :
                     selectedDateFilter === '30days' ? 'Last 30 Days' :
                     formatDateForDisplay(selectedDate)}
                  </Badge>
                )}
                {selectedBranch !== 'all' && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    <MapPin className="w-3 h-3 mr-1" />
                    {availableBranches.find((b) => b.id === selectedBranch)
                      ?.name || 'Selected Branch'}
                  </Badge>
                )}
                {selectedTimeSlot !== 'all' && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {selectedTimeSlot}
                  </Badge>
                )}
                {selectedStatus !== 'all' && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {selectedStatus}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs for Pickup and Delivery */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pickup" className="flex items-center space-x-2">
            <Package className="w-4 h-4" />
            <span>Pickup Schedules ({pickupData?.schedules?.length || 0})</span>
          </TabsTrigger>
          <TabsTrigger value="delivery" className="flex items-center space-x-2">
            <Truck className="w-4 h-4" />
            <span>
              Delivery Schedules ({deliveryData?.schedules?.length || 0})
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pickup" className="space-y-6">
          <div className="space-y-4">
            {pickupData?.schedules?.length > 0 ? (
              pickupData.schedules.map((schedule, index) => (
                <ScheduleCard
                  key={schedule.scheduleId || index}
                  schedule={schedule}
                  type="pickup"
                />
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Pickup Schedules Available
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {selectedDate ||
                    selectedBranch !== 'all' ||
                    selectedTimeSlot !== 'all' ||
                    selectedStatus !== 'all'
                      ? 'No pickup schedules match your current filters. Try adjusting your search criteria.'
                      : 'No pickup schedules have been created yet.'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="delivery" className="space-y-6">
          <div className="space-y-4">
            {deliveryData?.schedules?.length > 0 ? (
              deliveryData.schedules.map((schedule, index) => (
                <ScheduleCard
                  key={schedule.scheduleId || index}
                  schedule={schedule}
                  type="delivery"
                />
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Delivery Schedules Available
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {selectedDate ||
                    selectedBranch !== 'all' ||
                    selectedTimeSlot !== 'all' ||
                    selectedStatus !== 'all'
                      ? 'No delivery schedules match your current filters. Try adjusting your search criteria.'
                      : 'No delivery schedules have been created yet.'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VehicleSchedules;
