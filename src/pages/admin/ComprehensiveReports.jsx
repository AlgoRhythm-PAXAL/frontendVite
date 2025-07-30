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
  Brain,
  Lightbulb,
  Target,
  AlertTriangle,
  Clock,
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
import { dashboardApi, reportApi, aiApi } from '@/api/reportApi';

// Import components
import LoadingAnimation from '../../utils/LoadingAnimation';

const Reports = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingCSV, setDownloadingCSV] = useState(false);
  
  // AI Insights state
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [businessMetrics, setBusinessMetrics] = useState(null);
  
  // Date range state - Default to 1 week
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });
  const [selectedPreset, setSelectedPreset] = useState('1w');

  // Preset date ranges for dashboard
  const datePresets = [
    { label: 'Last week', value: '1w', days: 7 },
    { label: 'Last month', value: '1m', days: 30 },
    { label: 'Last 2 months', value: '2m', days: 60 },
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
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Determine if we're using custom dates
        const isCustom = selectedPreset === 'custom';
        const startDate = isCustom ? dateRange.startDate : null;
        const endDate = isCustom ? dateRange.endDate : null;
        
        const data = await dashboardApi.getDashboardData(selectedPreset, startDate, endDate);
        if (data.status === 'success') {
          setDashboardData(data.data);
          console.log('Dashboard data available:', data.data);
        } else {
          toast.error('Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedPreset, dateRange]);

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

  // AI Insights Functions
  const fetchBusinessMetrics = async () => {
    try {
      setLoadingAI(true);
      const params = {
        dateRange: JSON.stringify({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        }),
        branchId: 'all'
      };

      const data = await aiApi.getBusinessMetrics(params);
      
      if (data.success) {
        setBusinessMetrics(data.data.metrics);
        return data.data.metrics;
      } else {
        throw new Error(data.message || 'Failed to fetch business metrics');
      }
    } catch (error) {
      console.error('Error fetching business metrics:', error);
      toast.error('Failed to fetch business metrics');
      return null;
    }
  };

  const generateAIInsights = async () => {
    try {
      setLoadingAI(true);
      
      // First, get business metrics if not already available
      let metrics = businessMetrics;
      if (!metrics) {
        metrics = await fetchBusinessMetrics();
        if (!metrics) return;
      }

      // Generate AI insights using the metrics
      const params = {
        reportType: 'comprehensive',
        dateRange: JSON.stringify({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        }),
        branchId: 'all'
      };

      const data = await aiApi.generateAIReport(params);
      
      if (data.success) {
        setAiInsights(data.data);
        toast.success('AI insights generated successfully');
        // Auto-switch to AI insights tab
        document.querySelector('[value="ai-insights"]')?.click();
      } else {
        throw new Error(data.message || 'Failed to generate AI insights');
      }
    } catch (error) {
      console.error('Error generating AI insights:', error);
      toast.error('Failed to generate AI insights. Please try again.');
    } finally {
      setLoadingAI(false);
    }
  };

  const getPerformanceAnalysis = async () => {
    try {
      const params = {
        analysisType: 'comprehensive',
        dateRange: JSON.stringify({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        }),
        branchId: 'all'
      };

      const data = await aiApi.getPerformanceAnalysis(params);
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to get performance analysis');
      }
    } catch (error) {
      console.error('Error getting performance analysis:', error);
      toast.error('Failed to get performance analysis');
      return null;
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

      // Add Title and Metadata Section
      const currentDate = new Date();
      const reportTitle = 'Comprehensive Business Analytics Report';
      const dateRange = dashboardData?.dateRange ? 
        `${format(new Date(dashboardData.dateRange.startDate), 'MMM dd, yyyy')} - ${format(new Date(dashboardData.dateRange.endDate), 'MMM dd, yyyy')}` :
        'N/A';
      
      csvContent += `"${reportTitle}"\n`;
      csvContent += `"Generated on ${currentDate.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })}"\n`;
      csvContent += `"Date Range: ${dateRange}"\n`;
      csvContent += `"Branch Scope: All Branches"\n`;
      csvContent += '\n';

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

      // Debug: Log the CSV content to see if it's being generated
      console.log('CSV Content Length:', csvContent.length);
      console.log('CSV Content Preview:', csvContent.substring(0, 500));

      // Create and download the CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      console.log('Blob created:', blob.size, 'bytes');
      
      const url = URL.createObjectURL(blob);
      console.log('URL created:', url);
      
      // Create filename with date range
      const formatDateForFilename = (date) => {
        return format(new Date(date), 'MMM-dd-yyyy');
      };
      
      const startDateFormatted = dashboardData?.dateRange ? 
        formatDateForFilename(dashboardData.dateRange.startDate) : 
        format(new Date(), 'MMM-dd-yyyy');
      const endDateFormatted = dashboardData?.dateRange ? 
        formatDateForFilename(dashboardData.dateRange.endDate) : 
        format(new Date(), 'MMM-dd-yyyy');
      
      const filename = `Comprehensive_Business_Analytics_Report_${startDateFormatted}_to_${endDateFormatted}.csv`;
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      
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
      if (format === 'text' || isNaN(val)) return val; // For text values like delivery time
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
              {change !== undefined && !isNaN(change) && (
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
    format: PropTypes.oneOf(['number', 'currency', 'percentage', 'text']),
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Comprehensive Business Analytics Report
          </h1>
          <div className="space-y-1">
            <p className="text-gray-600">
              Complete system analytics and insights
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Generated: {new Date().toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}</span>
              </div>
              {dashboardData?.dateRange && (
                <div className="flex items-center gap-1">
                  <span>•</span>
                  <span>Period: {format(new Date(dashboardData.dateRange.startDate), 'MMM dd, yyyy')} - {format(new Date(dashboardData.dateRange.endDate), 'MMM dd, yyyy')}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <span>•</span>
                <span>All Branches</span>
              </div>
            </div>
          </div>
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
          onClick={generateAIInsights}
          disabled={loadingAI}
          variant="outline"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:from-blue-100 hover:to-purple-100"
        >
          {loadingAI ? (
            <Loader className="h-4 w-4 animate-spin text-blue-600" />
          ) : (
            <Brain className="h-4 w-4 text-blue-600" />
          )}
          <span className="text-blue-700">AI Insights</span>
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

      {/* Dashboard Period Info */}
      {dashboardData && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-900">
                    Dashboard Period: {dashboardData.periodLabel}
                  </span>
                </div>
                <div className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">
                  {dashboardData.dateRange.startDate && (
                    <>
                      {format(new Date(dashboardData.dateRange.startDate), 'MMM dd, yyyy')} - {' '}
                      {format(new Date(dashboardData.dateRange.endDate), 'MMM dd, yyyy')}
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-600">
                <RefreshCw className="h-3 w-3" />
                Last updated: {format(new Date(dashboardData.lastUpdated), 'HH:mm:ss')}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      {dashboardData?.kpi && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <KPICard
            title="Total Parcels"
            value={dashboardData.kpi.totalParcels?.value || 0}
            change={dashboardData.kpi.totalParcels?.change}
            trend={dashboardData.kpi.totalParcels?.trend}
            icon={Package}
          />

          <KPICard
            title="Total Revenue"
            value={dashboardData.kpi.totalRevenue?.value || 0}
            change={dashboardData.kpi.totalRevenue?.change}
            trend={dashboardData.kpi.totalRevenue?.trend}
            format="currency"
            icon={DollarSign}
          />

          <KPICard
            title="Total Shipments"
            value={dashboardData.kpi.totalShipments?.value || 0}
            change={dashboardData.kpi.totalShipments?.change}
            trend={dashboardData.kpi.totalShipments?.trend}
            icon={Truck}
          />

          <KPICard
            title="Delivery Rate"
            value={dashboardData.kpi.deliverySuccessRate?.value || 0}
            format="percentage"
            icon={TrendingUp}
          />

          <KPICard
            title="Avg Delivery Time"
            value={dashboardData.kpi.avgDeliveryTime?.value || "No data"}
            icon={Clock}
          />
        </div>
      )}

      {/* Main Content */}
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingAnimation message="Loading report data..." />
        </div>
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
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="parcels">Parcels</TabsTrigger>
              <TabsTrigger value="shipments">Shipments</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="branches">Branches</TabsTrigger>
              <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
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

            <TabsContent value="ai-insights">
              <div className="space-y-6">
                {/* AI Insights Header */}
                <Card>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <Brain className="h-6 w-6 text-blue-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">AI Business Intelligence</h3>
                        <p className="text-sm text-gray-600">
                          Get AI-powered insights and recommendations for your business
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {/* <Button
                        onClick={fetchBusinessMetrics}
                        disabled={loadingAI}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className={`h-4 w-4 ${loadingAI ? 'animate-spin' : ''}`} />
                        Fetch Metrics
                      </Button> */}
                      <Button
                        onClick={generateAIInsights}
                        disabled={loadingAI}
                        className="flex items-center gap-2"
                      >
                        {loadingAI ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <Brain className="h-4 w-4" />
                        )}
                        Generate AI Insights
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Loading State */}
                {loadingAI && (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-12">
                      <Brain className="h-16 w-16 text-blue-400 mb-4 animate-pulse" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        AI is Analyzing Your Business Data
                      </h3>
                      <p className="text-gray-500 text-center mb-4">
                        Please wait while our AI generates comprehensive insights and recommendations...
                      </p>
                      <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Business Metrics Summary */}
                {businessMetrics && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-green-600" />
                        Business Metrics Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {businessMetrics.overview && (
                          <>
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">
                                {businessMetrics.overview.totalUsers?.toLocaleString() || 0}
                              </div>
                              <div className="text-sm text-gray-600">Total Users</div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <div className="text-2xl font-bold text-green-600">
                                {businessMetrics.overview.totalParcels?.toLocaleString() || 0}
                              </div>
                              <div className="text-sm text-gray-600">Total Parcels</div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                              <div className="text-2xl font-bold text-purple-600">
                                Rs. {businessMetrics.overview.totalRevenue?.toLocaleString() || 0}
                              </div>
                              <div className="text-sm text-gray-600">Total Revenue</div>
                            </div>
                            <div className="text-center p-3 bg-orange-50 rounded-lg">
                              <div className="text-2xl font-bold text-orange-600">
                                {businessMetrics.overview.totalBranches?.toLocaleString() || 0}
                              </div>
                              <div className="text-sm text-gray-600">Branches</div>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* AI Insights Display */}
                {aiInsights ? (
                  <div className="grid grid-cols-1 gap-6">
                    {/* Executive Summary */}
                    {aiInsights.aiInsights?.executiveSummary && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-yellow-600" />
                            Executive Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 leading-relaxed">
                            {aiInsights.aiInsights.executiveSummary}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Performance Score */}
                    {aiInsights.aiInsights?.performanceScore && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                            Performance Score
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-blue-600 mb-1">
                                {aiInsights.aiInsights.performanceScore.overall}
                              </div>
                              <div className="text-sm text-gray-600">Overall</div>
                            </div>
                            {Object.entries(aiInsights.aiInsights.performanceScore.breakdown || {}).map(([key, value]) => (
                              <div key={key} className="text-center">
                                <div className="text-2xl font-bold text-gray-700 mb-1">
                                  {value}
                                </div>
                                <div className="text-sm text-gray-600 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Key Findings */}
                    {aiInsights.aiInsights?.keyFindings && aiInsights.aiInsights.keyFindings.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-green-600" />
                            Key Findings
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            {aiInsights.aiInsights.keyFindings.map((finding, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-gray-700">{finding}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {/* Recommendations */}
                    {aiInsights.aiInsights?.recommendations && aiInsights.aiInsights.recommendations.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-yellow-600" />
                            AI Recommendations
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {aiInsights.aiInsights.recommendations.map((rec, index) => (
                              <div key={index} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    rec.priority === 'High' ? 'bg-red-100 text-red-700' :
                                    rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                  }`}>
                                    {rec.priority} Priority
                                  </span>
                                </div>
                                <p className="text-gray-600 mb-3">{rec.description}</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                  <div>
                                    <span className="font-medium text-gray-700">Category: </span>
                                    <span className="text-gray-600">{rec.category}</span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-700">Impact: </span>
                                    <span className="text-gray-600">{rec.expectedImpact}</span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-700">Timeframe: </span>
                                    <span className="text-gray-600">{rec.timeframe}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Risk Assessment */}
                    {aiInsights.aiInsights?.riskAssessment && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            Risk Assessment
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {aiInsights.aiInsights.riskAssessment.highRisks && aiInsights.aiInsights.riskAssessment.highRisks.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-red-700 mb-3">High Risks</h4>
                                <ul className="space-y-2">
                                  {aiInsights.aiInsights.riskAssessment.highRisks.map((risk, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                      <span className="text-gray-700 text-sm">{risk}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {aiInsights.aiInsights.riskAssessment.mediumRisks && aiInsights.aiInsights.riskAssessment.mediumRisks.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-yellow-700 mb-3">Medium Risks</h4>
                                <ul className="space-y-2">
                                  {aiInsights.aiInsights.riskAssessment.mediumRisks.map((risk, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                      <span className="text-gray-700 text-sm">{risk}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : !loadingAI && (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-12">
                      <Brain className="h-16 w-16 text-gray-400 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        No AI Insights Available
                      </h3>
                      <p className="text-gray-500 text-center mb-6">
                        Click &quot;Generate AI Insights&quot; to get comprehensive business intelligence analysis and recommendations.
                      </p>
                      <p className="text-sm text-gray-400 text-center mb-6">
                        Analysis period: {format(new Date(dateRange.startDate), 'MMM dd, yyyy')} - {format(new Date(dateRange.endDate), 'MMM dd, yyyy')}
                      </p>
                      <Button onClick={generateAIInsights} className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Generate AI Insights
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Reports;
