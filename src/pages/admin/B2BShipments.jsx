import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { format, isValid } from 'date-fns';
import { 
  Clock, 
  Filter, 
  RefreshCw, 
  Package, 
  Truck, 
  User, 
  MapPin, 
  Eye, 
  Weight,
  Ruler,
  Navigation,
  Phone,
  Mail,
  Building,
  XCircle,
  BarChart3,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp,
  Route,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Alert, AlertDescription } from '../../components/ui/alert';
import SectionTitle from '../../components/admin/SectionTitle';
import LoadingAnimation from '../../utils/LoadingAnimation';

// Summary Stats Component with Date Filters for B2B Shipments
/* eslint-disable react/prop-types */
const SummaryStatsB2B = ({ summary, shipmentsForSelectedDate, onDateFilterChange, selectedDateFilter }) => {
  if (!summary) return null;

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gray-100 rounded-full">
                <Package className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {summary.totalShipments || 0}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Total Shipments
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {shipmentsForSelectedDate?.length || 0} on selected date
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gray-100 rounded-full">
                <FileText className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {summary.totalParcels || 0}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Total Parcels
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Across all shipments
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gray-100 rounded-full">
                <Weight className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {(summary.totalWeight || 0).toFixed(1)} kg
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Total Weight
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Combined weight
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
                  {summary.shipmentsWithVehicles || 0}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  With Vehicles
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Assigned vehicles
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const B2BShipments = () => {
  // State Management
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [summary, setSummary] = useState({});
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedShipment, setExpandedShipment] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateFilter, setSelectedDateFilter] = useState('today'); // New state for date filter presets
  const backendURL = import.meta.env.VITE_BACKEND_URL ;

  // Filter States
  const [filters, setFilters] = useState(() => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    return {
      status: 'all',
      deliveryType: 'all',
      sourceCenter: 'all',
      assignedVehicle: 'all',
      assignedDriver: 'all',
      startDate: today,
      endDate: today,
      page: 1,
      limit: 20
    };
  });

  // Options for dropdowns
  const [branches, setBranches] = useState([]);
  const [vehicles, setVehicles] = useState([]);





  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Verified', label: 'Verified' },
    { value: 'In Transit', label: 'In Transit' },
    { value: 'Dispatched', label: 'Dispatched' },
    { value: 'Completed', label: 'Completed' }
  ];

  // Delivery type options
  const deliveryTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'Standard', label: 'Standard' },
    { value: 'Express', label: 'Express' },
    { value: 'Priority', label: 'Priority' },
    { value: 'Overnight', label: 'Overnight' }
  ];








    // Fetch B2B shipments
  const fetchB2BShipments = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '' && value !== 'all') {
          queryParams.append(key, value);
        }
      });

      const response = await axios.get(`${backendURL}/api/admin/b2b-shipments?${queryParams}`,{withCredentials: true,timeout: 10000});
      console.log('B2B Shipments Response:', response.data);
      if (response.data.success) {
        setShipments(response.data.data.shipments);
        setFilteredShipments(response.data.data.shipments);
        setSummary(response.data.data.summary);
        setPagination(response.data.data.pagination);
      }
    } catch (err) {
      setError('Failed to fetch B2B shipments');
      console.error('Error fetching B2B shipments:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, backendURL]);

  // Fetch dropdown options
  const fetchDropdownOptions = useCallback(async () => {
    try {
      const [branchesRes, vehiclesRes] = await Promise.all([
        axios.get('/api/admin/branches'),
        axios.get('/api/admin/vehicles')
      ]);

      if (branchesRes.data.success) setBranches(branchesRes.data.data);
      if (vehiclesRes.data.success) setVehicles(vehiclesRes.data.data);
    } catch (err) {
      console.error('Error fetching dropdown options:', err);
    }
  }, []);
  // Fetch initial data
  useEffect(() => {
    fetchB2BShipments();
    fetchDropdownOptions();
  }, [fetchB2BShipments, fetchDropdownOptions]);



  // Filter shipments by selected date
  const filterShipmentsByDate = useCallback((date) => {
    if (!date || !isValid(date)) {
      setFilteredShipments(shipments);
      return;
    }

    const targetDate = format(date, 'yyyy-MM-dd');
    const filtered = shipments.filter(shipment => {
      const shipmentDate = format(new Date(shipment.createdAt), 'yyyy-MM-dd');
      return shipmentDate === targetDate;
    });

    setFilteredShipments(filtered);
  }, [shipments]);

  // Handle date filter changes from presets
  const handleDateFilterChange = useCallback((filterType, dateValue) => {
    setSelectedDateFilter(filterType);
    
    if (filterType === 'all') {
      // Clear date filters for "All Time"
      setFilters(prev => ({
        ...prev,
        startDate: '',
        endDate: '',
        page: 1
      }));
      setSelectedDate(new Date());
    } else if (dateValue) {
      const selectedDate = new Date(dateValue);
      setSelectedDate(selectedDate);
      
      // Set date range filters based on the selection
      if (filterType === 'today' || filterType === 'yesterday') {
        // For single day selections
        const dateStr = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD format
        setFilters(prev => ({
          ...prev,
          startDate: dateStr,
          endDate: dateStr,
          page: 1
        }));
      } else {
        // For range selections (7days, 30days)
        const endDate = new Date(); // Today
        const startDate = selectedDate;
        
        setFilters(prev => ({
          ...prev,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          page: 1
        }));
      }
      
      filterShipmentsByDate(selectedDate);
    } else {
      setSelectedDate(new Date());
      filterShipmentsByDate(new Date());
    }
  }, [filterShipmentsByDate]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: 'all',
      deliveryType: 'all',
      sourceCenter: 'all',
      assignedVehicle: 'all',
      assignedDriver: 'all',
      startDate: '',
      endDate: '',
      page: 1,
      limit: 20
    });
    setSelectedDate(new Date());
    setSelectedDateFilter('today'); // Reset to today
    setFilteredShipments(shipments);
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'in transit': return 'default';
      case 'dispatched': return 'secondary';
      case 'verified': return 'outline';
      case 'pending': return 'destructive';
      default: return 'outline';
    }
  };

  // Get delivery type badge variant
  const getDeliveryTypeBadgeVariant = (type) => {
    switch (type?.toLowerCase()) {
      case 'express': return 'destructive';
      case 'priority': return 'default';
      case 'overnight': return 'secondary';
      default: return 'outline';
    }
  };

  // Format date helper
  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'MMM dd, yyyy HH:mm');
    } catch {
      return 'Invalid Date';
    }
  };

  // Calculate shipments for selected date
  const shipmentsForSelectedDate = useMemo(() => {
    if (!selectedDate || !isValid(selectedDate)) return [];
    
    const targetDate = format(selectedDate, 'yyyy-MM-dd');
    return shipments.filter(shipment => {
      const shipmentDate = format(new Date(shipment.createdAt), 'yyyy-MM-dd');
      return shipmentDate === targetDate;
    });
  }, [shipments, selectedDate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingAnimation message="Loading B2B shipments..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 pt-0 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className=" ">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="mb-8">
            {/* <h1 className="text-3xl font-bold text-gray-900">B2B Shipment Management</h1> */}
            <SectionTitle title="B2B Shipment Management" />
            <p className="text-gray-600 mt-1">Comprehensive shipment tracking and management</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={fetchB2BShipments}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Summary with Date Filters */}
      <SummaryStatsB2B 
        summary={summary}
        shipmentsForSelectedDate={shipmentsForSelectedDate}
        onDateFilterChange={handleDateFilterChange}
        selectedDateFilter={selectedDateFilter}
      />

      {/* Filters Section */}
      <Card className="bg-white shadow-sm border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            <Button onClick={clearFilters} variant="outline" size="sm">
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Delivery Type</label>
              <Select value={filters.deliveryType} onValueChange={(value) => handleFilterChange('deliveryType', value)}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  {deliveryTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Source Center</label>
              <Select value={filters.sourceCenter} onValueChange={(value) => handleFilterChange('sourceCenter', value)}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="All Centers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Centers</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch._id} value={branch._id}>
                      {branch.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Vehicle</label>
              <Select value={filters.assignedVehicle} onValueChange={(value) => handleFilterChange('assignedVehicle', value)}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="All Vehicles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vehicles</SelectItem>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle._id} value={vehicle._id}>
                      {vehicle.registrationNo} - {vehicle.vehicleType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Start Date</label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">End Date</label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="h-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Shipments List */}
      <div className="space-y-4">
        {filteredShipments.length === 0 ? (
          <Card className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No shipments found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later.</p>
          </Card>
        ) : (
          filteredShipments.map((shipment) => (
            <Card key={shipment._id} className="bg-white shadow-sm border hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Left Section - Main Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
                        {shipment.shipmentId}
                      </div>
                      <Badge variant={getStatusBadgeVariant(shipment.status)}>
                        {shipment.status}
                      </Badge>
                      <Badge variant={getDeliveryTypeBadgeVariant(shipment.normalizedDeliveryType)}>
                        {shipment.normalizedDeliveryType}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        {formatDate(shipment.createdAt)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Source Center</p>
                          <p className="text-sm font-medium">
                            {shipment.sourceCenter?.location || 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Parcels</p>
                          <p className="text-sm font-medium">{shipment.parcelCount}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Weight className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Weight</p>
                          <p className="text-sm font-medium">{shipment.totalWeight} kg</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Ruler className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Volume</p>
                          <p className="text-sm font-medium">{shipment.totalVolume} m³</p>
                        </div>
                      </div>
                    </div>

                    {/* Assignment Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {shipment.assignedVehicle && (
                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                          <Truck className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-xs text-blue-600">Assigned Vehicle</p>
                            <p className="text-sm font-medium text-blue-800">
                              {shipment.assignedVehicle.registrationNo} - {shipment.assignedVehicle.vehicleType}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* {shipment.assignedDriver && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                          <User className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="text-xs text-green-600">Assigned Driver</p>
                            <p className="text-sm font-medium text-green-800">
                              {shipment.assignedDriver.name}
                            </p>
                          </div>
                        </div>
                      )} */}

                    </div>
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                    <Button
                      onClick={() => setExpandedShipment(
                        expandedShipment === shipment._id ? null : shipment._id
                      )}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      {expandedShipment === shipment._id ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          Hide Details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          View Details
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedShipment === shipment._id && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="parcels">Parcels</TabsTrigger>
                        <TabsTrigger value="route">Route</TabsTrigger>
                        <TabsTrigger value="assignments">Assignments</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="mt-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Shipment Details */}
                          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Shipment Details
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Shipment ID:</span>
                                <span className="font-medium">{shipment.shipmentId}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <Badge variant={getStatusBadgeVariant(shipment.status)}>
                                  {shipment.status}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Delivery Type:</span>
                                <span className="font-medium">{shipment.normalizedDeliveryType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Created:</span>
                                <span className="font-medium">{formatDate(shipment.createdAt)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Updated:</span>
                                <span className="font-medium">{formatDate(shipment.updatedAt)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Capacity Info */}
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                              <BarChart3 className="h-4 w-4" />
                              Capacity Information
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-blue-700">Total Parcels:</span>
                                <span className="font-medium text-blue-900">{shipment.parcelCount}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-700">Total Weight:</span>
                                <span className="font-medium text-blue-900">{shipment.totalWeight} kg</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-700">Total Volume:</span>
                                <span className="font-medium text-blue-900">{shipment.totalVolume} m³</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-700">Total Distance:</span>
                                <span className="font-medium text-blue-900">{shipment.totalDistance} km</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="parcels" className="mt-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Parcels ({shipment.parcels?.length || 0})
                          </h4>
                          {shipment.parcels && shipment.parcels.length > 0 ? (
                            <div className="grid gap-3">
                              {shipment.parcels.map((parcel, index) => (
                                <div key={parcel._id || index} className="bg-gray-50 p-3 rounded-lg">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-medium">{parcel.trackingNo || parcel.parcelId}</p>
                                      <p className="text-sm text-gray-600">{parcel.itemType}</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="text-xs">
                                          {parcel.itemSize || 'N/A'}
                                        </Badge>
                                        {parcel.parcelWeight && (
                                          <span className="text-xs text-gray-500">
                                            {parcel.parcelWeight}kg
                                          </span>
                                        )}
                                        {parcel.parcelVolume && (
                                          <span className="text-xs text-gray-500">
                                            {parcel.parcelVolume}m³
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <Badge variant={getStatusBadgeVariant(parcel.status)}>
                                      {parcel.status}
                                    </Badge>
                                  </div>
                                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div>From: {parcel.from?.location || 'N/A'}</div>
                                    <div>To: {parcel.to?.location || 'N/A'}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-600 text-center py-4">No parcels information available</p>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="route" className="mt-4">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Route className="h-4 w-4" />
                            Route Information
                          </h4>
                          <div className="grid gap-3">
                            {shipment.sourceCenter && (
                              <div className="bg-green-50 p-3 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <MapPin className="h-4 w-4 text-green-600" />
                                  <span className="font-medium text-green-800">Source Center</span>
                                </div>
                                <p className="text-sm text-green-700">{shipment.sourceCenter.location}</p>
                                {shipment.sourceCenter.contact && (
                                  <p className="text-xs text-green-600">{shipment.sourceCenter.contact}</p>
                                )}
                              </div>
                            )}

                            {shipment.currentLocation && (
                              <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <Navigation className="h-4 w-4 text-blue-600" />
                                  <span className="font-medium text-blue-800">Current Location</span>
                                </div>
                                <p className="text-sm text-blue-700">{shipment.currentLocation.location}</p>
                                {shipment.currentLocation.contact && (
                                  <p className="text-xs text-blue-600">{shipment.currentLocation.contact}</p>
                                )}
                              </div>
                            )}

                            {shipment.route && shipment.route.length > 0 && (
                              <div className="bg-purple-50 p-3 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <Route className="h-4 w-4 text-purple-600" />
                                  <span className="font-medium text-purple-800">Route Points</span>
                                </div>
                                <div className="space-y-1">
                                  {shipment.route.map((point, index) => (
                                    <p key={index} className="text-sm text-purple-700">
                                      {index + 1}. {point.location}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="assignments" className="mt-4">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900">Assignment Details</h4>
                          <div className="grid gap-4">
                            {/* Vehicle Assignment */}
                            {shipment.assignedVehicle ? (
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                  <Truck className="h-5 w-5 text-blue-600" />
                                  <span className="font-medium text-blue-800">Assigned Vehicle</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className="text-blue-600">Registration:</span>
                                    <span className="ml-2 font-medium">{shipment.assignedVehicle.registrationNo}</span>
                                  </div>
                                  <div>
                                    <span className="text-blue-600">Type:</span>
                                    <span className="ml-2 font-medium">{shipment.assignedVehicle.vehicleType}</span>
                                  </div>
                                  <div>
                                    <span className="text-blue-600">Capacity:</span>
                                    <span className="ml-2 font-medium">
                                      {shipment.assignedVehicle.capableWeight}kg / {shipment.assignedVehicle.capableVolume}m³
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-blue-600">Status:</span>
                                    <Badge variant={shipment.assignedVehicle.available ? 'destructive' : 'success'}>
                                      {shipment.assignedVehicle.available ? 'Available' : 'In Use'}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <Truck className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600">No vehicle assigned</p>
                              </div>
                            )}

                            {/* Vehicle Driver Assignment - Display driver assigned to the vehicle */}
                            {/* {shipment.vehicleDriver ? (
                              <div className="bg-amber-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                  <User className="h-5 w-5 text-amber-600" />
                                  <span className="font-medium text-amber-800">Vehicle Driver</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className="text-amber-600">Name:</span>
                                    <span className="ml-2 font-medium">{shipment.vehicleDriver.name}</span>
                                  </div>
                                  <div>
                                    <span className="text-amber-600">Driver ID:</span>
                                    <span className="ml-2 font-medium">{shipment.vehicleDriver.driverId}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Phone className="h-3 w-3 text-amber-600" />
                                    <span className="text-amber-600">Phone:</span>
                                    <span className="ml-1 font-medium">{shipment.vehicleDriver.contactNo}</span>
                                  </div>
                                  <div>
                                    <span className="text-amber-600">License:</span>
                                    <span className="ml-2 font-medium">{shipment.vehicleDriver.licenseId}</span>
                                  </div>
                                  <div className="col-span-2">
                                    <span className="text-amber-600">Branch:</span>
                                    <span className="ml-2 font-medium">
                                      {shipment.vehicleDriver.branchId?.location || 'N/A'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ) : shipment.assignedVehicle ? (
                              <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600">No driver assigned to this vehicle</p>
                              </div>
                            ) : null} */}

                            {/* Driver Assignment */}
                            {/* {shipment.assignedDriver ? (
                              <div className="bg-green-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                  <User className="h-5 w-5 text-green-600" />
                                  <span className="font-medium text-green-800">Assigned Driver</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className="text-green-600">Name:</span>
                                    <span className="ml-2 font-medium">{shipment.assignedDriver.name}</span>
                                  </div>
                                  <div>
                                    <span className="text-green-600">Driver ID:</span>
                                    <span className="ml-2 font-medium">{shipment.assignedDriver.driverId}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Phone className="h-3 w-3 text-green-600" />
                                    <span className="text-green-600">Phone:</span>
                                    <span className="ml-1 font-medium">{shipment.assignedDriver.contactNo}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Mail className="h-3 w-3 text-green-600" />
                                    <span className="text-green-600">Email:</span>
                                    <span className="ml-1 font-medium">{shipment.assignedDriver.email}</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600">No driver assigned</p>
                              </div>
                            )} */}

                            {/* Created By Info */}
                            {shipment.createdByStaff && (
                              <div className="bg-purple-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                  <User className="h-5 w-5 text-purple-600" />
                                  <span className="font-medium text-purple-800">Created By</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className="text-purple-600">Staff:</span>
                                    <span className="ml-2 font-medium">{shipment.createdByStaff.name}</span>
                                  </div>
                                  <div>
                                    <span className="text-purple-600">Staff ID:</span>
                                    <span className="ml-2 font-medium">{shipment.createdByStaff.staffId}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Phone className="h-3 w-3 text-purple-600" />
                                    <span className="text-purple-600">Contact:</span>
                                    <span className="ml-1 font-medium">{shipment.createdByStaff.contactNo}</span>
                                  </div>
                                  <div>
                                    <span className="text-purple-600">Center:</span>
                                    <span className="ml-2 font-medium">
                                      {shipment.createdByCenter?.location || 'N/A'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
              {pagination.totalItems} results
            </p>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              <span className="text-sm font-medium">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button
                onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default B2BShipments;
