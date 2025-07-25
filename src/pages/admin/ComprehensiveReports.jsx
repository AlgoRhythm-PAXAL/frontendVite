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
import { toast } from 'sonner';

// Import API functions
import { dashboardApi, reportApi } from '@/api/reportApi';

// Import components
import LoadingAnimation from '../../utils/LoadingAnimation';

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingCSV, setDownloadingCSV] = useState(false);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#4ECDC4', '#45B7D1'];

  useEffect(() => {
    fetchDashboardData();
    generateReport();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await dashboardApi.getDashboardData('0d');
      if (data.status === 'success') {
        // Dashboard data fetched successfully but not used in this component
        console.log('Dashboard data available:', data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
    }
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      const params = {
        reportType: 'comprehensive',
        format: 'json',
      };

      const data = await reportApi.generateReport(params);

      if (data.status === 'success') {
        setReportData(data.data);
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

  const downloadComprehensiveCSV = async () => {
    try {
      setDownloadingCSV(true);
      
      const blob = await reportApi.exportComprehensiveCSV();

      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const today = new Date().toISOString().split('T')[0];
        a.download = `comprehensive_report_${today}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success('Comprehensive report downloaded successfully');
      } else {
        throw new Error('No data received for export');
      }
    } catch (error) {
      console.error('Error downloading CSV report:', error);
      toast.error('Failed to download CSV report: ' + (error.response?.data?.message || error.message || 'Unknown error'));
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
    format: PropTypes.oneOf(['number', 'currency', 'percentage'])
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comprehensive Reports</h1>
          <p className="text-gray-600 mt-1">Complete system analytics and insights</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={generateReport}
            disabled={loading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Report
          </Button>
          <Button
            onClick={downloadComprehensiveCSV}
            disabled={downloadingCSV}
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
      </div>

      {/* KPI Cards */}
      {reportData?.systemOverview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Parcels"
            value={reportData.systemOverview.totalParcels}
            icon={Package}
          />

          <KPICard
            title="Total Revenue"
            value={reportData.systemOverview.totalRevenue}
            format="currency"
            icon={DollarSign}
          />
          
          <KPICard
            title="Total Shipments"
            value={reportData.systemOverview.totalShipments}
            icon={Truck}
          />
          <KPICard
            title="Delivery Rate"
            value={(() => {
              const deliveredParcels = reportData.parcelAnalytics?.statusBreakdown?.find(s => s._id === 'Delivered')?.count || 0;
              const totalParcels = reportData.systemOverview.totalParcels || 0;
              return totalParcels > 0 ? ((deliveredParcels / totalParcels) * 100).toFixed(1) : 0;
            })()}
            format="percentage"
            icon={TrendingUp}
          />
          
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="parcels">Parcels</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
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
                        const deliveredParcels = reportData.parcelAnalytics?.statusBreakdown?.find(s => s._id === 'Delivered')?.count || 0;
                        const totalParcels = reportData.systemOverview.totalParcels || 0;
                        return totalParcels > 0 ? ((deliveredParcels / totalParcels) * 100).toFixed(2) + '%' : '0%';
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
                        const paidAmount = reportData.financialAnalytics.overview?.paidPayments || 0;
                        const totalAmount = reportData.financialAnalytics.overview?.totalRevenue || 0;
                        return totalAmount > 0 ? ((paidAmount / totalAmount) * 100).toFixed(2) + '%' : '0%';
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Transaction:</span>
                    <span className="font-semibold">
                      Rs.{' '}
                      {reportData.financialAnalytics.overview?.averageTransactionValue?.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="parcels">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="_id"
                      >
                        {reportData.parcelAnalytics.statusBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Parcel Analytics Summary */}
            {reportData?.parcelAnalytics?.overview && (
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
                      {reportData.parcelAnalytics.overview.totalWeight || 0} kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Volume:</span>
                    <span className="font-semibold">
                      {reportData.parcelAnalytics.overview.totalVolume || 0} m³
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Price:</span>
                    <span className="font-semibold">
                      Rs. {reportData.parcelAnalytics.overview.averagePrice?.toFixed(2) || 'N/A'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
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
                    <BarChart data={reportData.shipmentAnalytics.statusBreakdown}>
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
                      {reportData.shipmentAnalytics.overview.totalDistance || 0} km
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Time:</span>
                    <span className="font-semibold">
                      {reportData.shipmentAnalytics.overview.totalTime || 0} hours
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Parcel Count:</span>
                    <span className="font-semibold">
                      {reportData.shipmentAnalytics.overview.averageParcelCount || 0}
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
                        data={reportData.financialAnalytics.paymentMethodBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="totalAmount"
                        nameKey="_id"
                      >
                        {reportData.financialAnalytics.paymentMethodBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `Rs. ${value.toLocaleString()}`} />
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
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-medium">{branch.branchId}</td>
                            <td className="p-2">{branch.location}</td>
                            <td className="p-2 text-right font-semibold">
                              {branch.totalParcels}
                            </td>
                            <td className="p-2 text-right">{branch.originatingParcels}</td>
                            <td className="p-2 text-right">{branch.destinationParcels}</td>
                            <td className="p-2 text-right">{branch.staffCount}</td>
                            <td className="p-2 text-right">{branch.driverCount}</td>
                            <td className="p-2 text-right">{branch.vehicleCount}</td>
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
  );
};

export default Reports;
