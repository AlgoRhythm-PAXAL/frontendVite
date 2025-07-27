import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Download,
  TrendingUp,
  Package,
  Truck,
  DollarSign,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Loader,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { format, subDays, subMonths, subYears } from 'date-fns';

// Import API functions
import { dashboardApi, reportApi } from '@/api/reportApi';

// Import components
import LoadingAnimation from '../../utils/LoadingAnimation';

const Reports = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingCSV, setDownloadingCSV] = useState(false);
  
  // Date range state
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'), // Default to last 30 days
    endDate: format(new Date(), 'yyyy-MM-dd')
  });
  const [selectedPreset, setSelectedPreset] = useState('30d');

  // Preset date ranges
  const datePresets = [
    { label: 'Last 7 days', value: '7d', days: 7 },
    { label: 'Last 30 days', value: '30d', days: 30 },
    { label: 'Last 3 months', value: '3m', months: 3 },
    { label: 'Last 6 months', value: '6m', months: 6 },
    { label: 'Last year', value: '1y', years: 1 },
    { label: 'Custom range', value: 'custom' }
  ];

  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884D8',
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardApi.getDashboardData('0d');
      if (data.status === 'success') {
        // Dashboard data fetched successfully but not used in this component
        setDashboardData(data.data);
        console.log('Dashboard data available:', data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Handle preset date range selection
  const handlePresetChange = (preset) => {
    setSelectedPreset(preset);
    const today = new Date();
    
    if (preset === 'custom') {
      // Don't auto-update dates for custom range
      return;
    }
    
    const presetConfig = datePresets.find(p => p.value === preset);
    if (!presetConfig) return;
    
    let startDate;
    if (presetConfig.days) {
      startDate = subDays(today, presetConfig.days);
    } else if (presetConfig.months) {
      startDate = subMonths(today, presetConfig.months);
    } else if (presetConfig.years) {
      startDate = subYears(today, presetConfig.years);
    }
    
    setDateRange({
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(today, 'yyyy-MM-dd')
    });
  };

  // Handle custom date input
  const handleDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
    
    // If user manually changes dates, switch to custom preset
    if (selectedPreset !== 'custom') {
      setSelectedPreset('custom');
    }
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      const params = {
        reportType: 'comprehensive',
        format: 'json',
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      };

      const data = await reportApi.generateReport(params);

      if (data.status === 'success') {
        setReportData(data.data);
        console.log('Report data generated:', data.data);
        toast.success('Report generated successfully');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const downloadComprehensiveCSV = () => {
    if (!reportData) {
      toast.error('No report data available for export');
      return;
    }

    try {
      setDownloadingCSV(true);

      // Helper function to safely stringify values
      const safeStringify = (value) => {
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value).replace(/"/g, '""'); // Escape quotes
      };

      // Helper function to create CSV rows from array data
      const createCSVSection = (title, headers, data) => {
        if (!data || !Array.isArray(data) || data.length === 0) return '';
        
        let section = `${title}\n`;
        section += headers.map(h => `"${h}"`).join(',') + '\n';
        
        data.forEach(item => {
          const row = headers.map(header => {
            const value = item[header] || item[header.toLowerCase()] || '';
            return `"${safeStringify(value)}"`;
          });
          section += row.join(',') + '\n';
        });
        
        return section + '\n';
      };

      let csvContent = '';

      // 1. System Overview Section
      if (reportData.systemOverview) {
        csvContent += 'SYSTEM OVERVIEW\n';
        csvContent += '"Metric","Value"\n';
        Object.entries(reportData.systemOverview).forEach(([key, value]) => {
          csvContent += `"${key}","${safeStringify(value)}"\n`;
        });
        csvContent += '\n';
      }

      // 2. Parcel Analytics Status Breakdown
      if (reportData.parcelAnalytics?.statusBreakdown) {
        csvContent += createCSVSection(
          'PARCEL STATUS BREAKDOWN',
          ['_id', 'count'],
          reportData.parcelAnalytics.statusBreakdown
        );
      }

      // 3. Shipment Analytics Status Breakdown
      if (reportData.shipmentAnalytics?.statusBreakdown) {
        csvContent += createCSVSection(
          'SHIPMENT STATUS BREAKDOWN',
          ['_id', 'count'],
          reportData.shipmentAnalytics.statusBreakdown
        );
      }

      // 4. Financial Analytics Overview
      if (reportData.financialAnalytics?.overview) {
        csvContent += 'FINANCIAL OVERVIEW\n';
        csvContent += '"Metric","Value"\n';
        Object.entries(reportData.financialAnalytics.overview).forEach(([key, value]) => {
          if (key !== '_id') {
            csvContent += `"${key}","${safeStringify(value)}"\n`;
          }
        });
        csvContent += '\n';
      }

      // 5. Payment Method Breakdown
      if (reportData.financialAnalytics?.paymentMethodBreakdown) {
        csvContent += createCSVSection(
          'PAYMENT METHOD BREAKDOWN',
          ['_id', 'totalAmount', 'count'],
          reportData.financialAnalytics.paymentMethodBreakdown
        );
      }

      // 6. Branch Performance Section
      if (reportData.branchPerformance?.branchStats) {
        // Get all possible headers from the first item
        const firstBranch = reportData.branchPerformance.branchStats[0];
        if (firstBranch) {
          const headers = Object.keys(firstBranch).filter(key => key !== '_id');
          csvContent += createCSVSection(
            'BRANCH PERFORMANCE',
            headers,
            reportData.branchPerformance.branchStats
          );
        }
      }

      // 7. Vehicle Breakdown
      if (reportData.operationalAnalytics?.vehicleBreakdown) {
        csvContent += createCSVSection(
          'VEHICLE BREAKDOWN',
          ['_id', 'count', 'available'],
          reportData.operationalAnalytics.vehicleBreakdown
        );
      }

      // 8. User Analytics
      if (reportData.userAnalytics?.userOverview) {
        csvContent += 'USER ANALYTICS OVERVIEW\n';
        csvContent += '"Metric","Value"\n';
        Object.entries(reportData.userAnalytics.userOverview).forEach(([key, value]) => {
          if (key !== '_id') {
            csvContent += `"${key}","${safeStringify(value)}"\n`;
          }
        });
        csvContent += '\n';
      }

      // 9. Trends Data
      if (reportData.trends) {
        csvContent += 'TREND ANALYSIS\n';
        csvContent += '"Trend Type","Growth","Period"\n';
        Object.entries(reportData.trends).forEach(([trendType, trendData]) => {
          csvContent += `"${trendType}","${trendData.growth || 0}","${trendData.period || ''}"\n`;
        });
        csvContent += '\n';
      }

      // Debug: Log the CSV content to see if it's being generated
      console.log('CSV Content Length:', csvContent.length);
      console.log('CSV Content Preview:', csvContent.substring(0, 500));

      // Create and download the CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      console.log('Blob created:', blob.size, 'bytes');
      
      const url = URL.createObjectURL(blob);
      console.log('URL created:', url);
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `comprehensive_report_${new Date().toISOString().split('T')[0]}.csv`);
      
      // Add link to DOM and trigger click
      document.body.appendChild(link);
      console.log('Link added to DOM, triggering click...');
      link.click();
      
      // Cleanup with a slight delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
        console.log('Cleanup completed');
      }, 100);

      toast.success('Comprehensive report downloaded successfully');
    } catch (error) {
      console.error('Error downloading CSV report:', error);
      toast.error('Failed to download CSV report: ' + error.message);
    } finally {
      setDownloadingCSV(false);
    }
  };

  const KPICard = ({
    title,
    value,
    change,
    trend,
    icon: Icon,
    format = 'number',
  }) => {
    const formatValue = (val) => {
      if (format === 'currency') return `Rs. ${Number(val).toLocaleString()}`;
      if (format === 'percentage') return `${val}%`;
      return Number(val).toLocaleString();
    };

    return (
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-2">
            {Icon && <Icon className="h-8 w-8 text-blue-600" />}
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <div className="text-2xl font-bold">{formatValue(value)}</div>
              {change !== undefined && (
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  {trend === 'up' ? (
                    <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : trend === 'down' ? (
                    <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                  ) : null}
                  {Math.abs(change).toFixed(1)}% from last period
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // PropTypes for KPICard
  KPICard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    change: PropTypes.number,
    trend: PropTypes.oneOf(['up', 'down']),
    icon: PropTypes.elementType,
    format: PropTypes.oneOf(['number', 'currency', 'percentage']),
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Comprehensive Reports
          </h1>
          <p className="text-gray-600 mt-1">
            Complete system analytics and insights
          </p>
        </div>
        
        {/* Date Range Selection */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Date Range</Label>
            <Select value={selectedPreset} onValueChange={handlePresetChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                {datePresets.map((preset) => (
                  <SelectItem key={preset.value} value={preset.value}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedPreset === 'custom' && (
            <div className="flex gap-2 items-end">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Start Date</Label>
                <Input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  className="w-40"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">End Date</Label>
                <Input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  className="w-40"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center lg:justify-end gap-3">
        <Button
          onClick={generateReport}
          disabled={loading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Generate Report
        </Button>
        <Button
          onClick={downloadComprehensiveCSV}
          disabled={downloadingCSV || !reportData}
          className="flex items-center gap-2"
        >
          {downloadingCSV ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Download CSV
        </Button>
      </div>

      {/* KPI Cards */}
      {dashboardData?.kpi && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Parcels"
            value={dashboardData.kpi.totalParcels?.value || 0}
            icon={Package}
          />

          <KPICard
            title="Total Revenue"
            value={dashboardData.kpi.totalRevenue?.value || 0}
            format="currency"
            icon={DollarSign}
          />

          <KPICard
            title="Total Shipments"
            value={dashboardData.kpi.totalShipments?.value || 0}
            icon={Truck}
          />
          <KPICard
            title="Delivery Rate"
            value={dashboardData.kpi.deliverySuccessRate.value || 0}
            format="percentage"
            icon={TrendingUp}
          />
        </div>
      )}

      {/* Main Content */}
      {loading ? (
        <LoadingAnimation />
      ) : !reportData ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <Package className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Report Data Available
            </h3>
            <p className="text-gray-500 text-center mb-2">
              Click &quot;Generate Report&quot; to create comprehensive analytics and view detailed insights.
            </p>
            <p className="text-sm text-gray-400 text-center mb-6">
              Selected period: {format(new Date(dateRange.startDate), 'MMM dd, yyyy')} - {format(new Date(dateRange.endDate), 'MMM dd, yyyy')}
            </p>
            <Button onClick={generateReport} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="parcels">Parcels</TabsTrigger>
              <TabsTrigger value="shipments">Shipments</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="branches">Branches</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              {/* Date Range Info */}
              <Card className="mb-6">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Report Period:</span>
                    <span className="text-sm font-semibold">
                      {format(new Date(dateRange.startDate), 'MMM dd, yyyy')} - {format(new Date(dateRange.endDate), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Generated on {format(new Date(), 'MMM dd, yyyy HH:mm')}
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* System Overview */}
                {reportData?.systemOverview && (
                  <Card>
                    <CardHeader>
                      <CardTitle>System Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Parcels:</span>
                        <span className="font-semibold">
                          {reportData.systemOverview.totalParcels?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Shipments:</span>
                        <span className="font-semibold">
                          {reportData.systemOverview.totalShipments?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Branches:</span>
                        <span className="font-semibold">
                          {reportData.systemOverview.totalBranches?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Available Vehicles:</span>
                        <span className="font-semibold">
                          {reportData.systemOverview.totalVehicles?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Staff:</span>
                        <span className="font-semibold">
                          {reportData.systemOverview.totalStaff?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Drivers:</span>
                        <span className="font-semibold">
                          {reportData.systemOverview.totalDrivers?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Success Rate:</span>
                        <span className="font-semibold text-green-600">
                          {(() => {
                            const deliveredParcels =
                              reportData.parcelAnalytics?.statusBreakdown?.find(
                                (s) => s._id === 'Delivered'
                              )?.count || 0;
                            const totalParcels =
                              reportData.systemOverview.totalParcels || 0;
                            return totalParcels > 0
                              ? (
                                  (deliveredParcels / totalParcels) *
                                  100
                                ).toFixed(2) + '%'
                              : '0%';
                          })()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Financial Summary */}
                {reportData?.financialAnalytics && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Financial Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Revenue:</span>
                        <span className="font-semibold text-green-600">
                          Rs.{' '}
                          {reportData.financialAnalytics.overview?.totalRevenue?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending Payments:</span>
                        <span className="font-semibold text-orange-600">
                          Rs.{' '}
                          {reportData.financialAnalytics.overview?.pendingPayments?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Paid Payments:</span>
                        <span className="font-semibold text-green-600">
                          Rs.{' '}
                          {reportData.financialAnalytics.overview?.paidPayments?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment Success Rate:</span>
                        <span className="font-semibold text-blue-600">
                          {(() => {
                            const paidAmount =
                              reportData.financialAnalytics.overview
                                ?.paidPayments || 0;
                            const totalAmount =
                              reportData.financialAnalytics.overview
                                ?.totalRevenue || 0;
                            return totalAmount > 0
                              ? ((paidAmount / totalAmount) * 100).toFixed(2) +
                                  '%'
                              : '0%';
                          })()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Transaction:</span>
                        <span className="font-semibold">
                          Rs.{' '}
                          {reportData.financialAnalytics.overview?.averageTransactionValue?.toFixed(
                            2
                          )}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="parcels">
              <div className="grid grid-cols-1  gap-6">
                {/* Parcel Status Chart */}
                {reportData?.parcelAnalytics?.statusBreakdown && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Parcel Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                          <Pie
                            data={reportData.parcelAnalytics.statusBreakdown}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                            nameKey="_id"
                          >
                            {reportData.parcelAnalytics.statusBreakdown.map(
                              (entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              )
                            )}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                {/* Parcel Analytics Summary */}
                {/* {reportData?.parcelAnalytics?.overview && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Parcel Analytics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Parcels:</span>
                        <span className="font-semibold">
                          {reportData.parcelAnalytics.overview.totalParcels?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Weight:</span>
                        <span className="font-semibold">
                          {reportData.parcelAnalytics.overview.totalWeight || 0}{' '}
                          kg
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Volume:</span>
                        <span className="font-semibold">
                          {reportData.parcelAnalytics.overview.totalVolume || 0}{' '}
                          m³
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Price:</span>
                        <span className="font-semibold">
                          Rs.{' '}
                          {reportData.parcelAnalytics.overview.averagePrice?.toFixed(
                            2
                          ) || 'N/A'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )} */}
              </div>
            </TabsContent>

            <TabsContent value="shipments">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Shipment Status Chart */}
                {reportData?.shipmentAnalytics?.statusBreakdown && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Shipment Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={reportData.shipmentAnalytics.statusBreakdown}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="_id" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                {/* Shipment Analytics Summary */}
                {reportData?.shipmentAnalytics?.overview && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Shipment Analytics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Shipments:</span>
                        <span className="font-semibold">
                          {reportData.shipmentAnalytics.overview.totalShipments?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Distance:</span>
                        <span className="font-semibold">
                          {reportData.shipmentAnalytics.overview
                            .totalDistance || 0}{' '}
                          km
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Time:</span>
                        <span className="font-semibold">
                          {reportData.shipmentAnalytics.overview.totalTime || 0}{' '}
                          hours
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Parcel Count:</span>
                        <span className="font-semibold">
                          {reportData.shipmentAnalytics.overview
                            .averageParcelCount || 0}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="financial">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Method Chart */}
                {reportData?.financialAnalytics?.paymentMethodBreakdown && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Method Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                          <Pie
                            data={
                              reportData.financialAnalytics
                                .paymentMethodBreakdown
                            }
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="totalAmount"
                            nameKey="_id"
                          >
                            {reportData.financialAnalytics.paymentMethodBreakdown.map(
                              (entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              )
                            )}
                          </Pie>
                          <Tooltip
                            formatter={(value) =>
                              `Rs. ${value.toLocaleString()}`
                            }
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                {/* Financial Overview */}
                {reportData?.financialAnalytics?.overview && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Financial Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Transactions:</span>
                        <span className="font-semibold">
                          {reportData.financialAnalytics.overview.totalTransactions?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Paid Transactions:</span>
                        <span className="font-semibold text-green-600">
                          {reportData.financialAnalytics.overview.paidTransactions?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending Transactions:</span>
                        <span className="font-semibold text-orange-600">
                          {reportData.financialAnalytics.overview.pendingTransactions?.toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="branches">
              <Card>
                <CardHeader>
                  <CardTitle>Branch Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  {reportData?.branchPerformance?.branchStats && (
                    <div className="overflow-x-auto">
                      <table className="w-full table-auto">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Branch</th>
                            <th className="text-left p-2">Location</th>
                            <th className="text-right p-2">Total Parcels</th>
                            <th className="text-right p-2">Originating</th>
                            <th className="text-right p-2">Destination</th>
                            <th className="text-right p-2">Staff</th>
                            <th className="text-right p-2">Drivers</th>
                            <th className="text-right p-2">Vehicles</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.branchPerformance.branchStats
                            .slice(0, 10)
                            .map((branch, index) => (
                              <tr
                                key={index}
                                className="border-b hover:bg-gray-50"
                              >
                                <td className="p-2 font-medium">
                                  {branch.branchId}
                                </td>
                                <td className="p-2">{branch.location}</td>
                                <td className="p-2 text-right font-semibold">
                                  {branch.totalParcels}
                                </td>
                                <td className="p-2 text-right">
                                  {branch.originatingParcels}
                                </td>
                                <td className="p-2 text-right">
                                  {branch.destinationParcels}
                                </td>
                                <td className="p-2 text-right">
                                  {branch.staffCount}
                                </td>
                                <td className="p-2 text-right">
                                  {branch.driverCount}
                                </td>
                                <td className="p-2 text-right">
                                  {branch.vehicleCount}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Reports;
