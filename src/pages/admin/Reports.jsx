// import { useState, useEffect } from 'react';
// import {
//   Download,
//   FileText,
//   TrendingUp,
//   Package,
//   Truck,
//   DollarSign,
//   Filter,
//   RefreshCw,
//   ArrowUp,
//   ArrowDown,
//   Loader,
// } from 'lucide-react';
// import {
//   ResponsiveContainer,
//   PieChart as RechartsPieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from 'recharts';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { DatePickerWithRange } from '@/components/ui/date-picker';
// import { toast } from 'sonner';

// // Import API functions
// import { dashboardApi, reportApi, branchApi } from '@/api/reportApi';

// // Import components
// import LoadingAnimation from '../../utils/LoadingAnimation';

// const Reports = () => {
//   const [dateRange, setDateRange] = useState({
//     from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
//     to: new Date(),
//   });
//   const [reportData, setReportData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [dashboardData, setDashboardData] = useState(null);
//   const [selectedBranch, setSelectedBranch] = useState('all');
//   const [branches, setBranches] = useState([]);
//   const [reportPart, setReportPart] = useState('all');

//   // Only comprehensive report type
//   const reportType = 'comprehensive';

//   // Report parts options
//   const reportParts = [
//     { value: 'all', label: 'Complete Report' },
//     { value: 'parcels', label: 'Parcels Only' },
//     { value: 'shipments', label: 'Shipments Only' },
//     { value: 'users', label: 'Users Only' },
//     { value: 'financial', label: 'Financial Only' },
//     { value: 'operational', label: 'Operational Only' },
//     { value: 'branches', label: 'Branches Only' },
//   ];

//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

//   useEffect(() => {
//     fetchBranches();
//     fetchDashboardData();
//   }, []);

//   const fetchBranches = async () => {
//     try {
      
//       const data = await branchApi.getAllBranches();
//       if (data.status === 'success') {
//         setBranches(data.data || []);
//       }
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching branches:', error);
//       toast.error('Failed to fetch branches');
//     }
//   };

//   const fetchDashboardData = async () => {
//     try {
//       const data = await dashboardApi.getDashboardData('0d');
//       console.log('Dashboard data:', data.data);
//       if (data.status === 'success') {
//         setDashboardData(data.data);
//         console.log(data.data);
//       }
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       toast.error('Failed to fetch dashboard data');
//     }
//   };

//   const generateReport = async (useAI = false) => {
//     try {
//       setLoading(true);
//       const params = {
//         startDate: dateRange.from.toISOString(),
//         endDate: dateRange.to.toISOString(),
//         reportType,
//         branchId: selectedBranch !== 'all' ? selectedBranch : '',
//         reportPart: reportPart !== 'all' ? reportPart : '',
//         format: 'json',
//       };

//       const data = useAI
//         ? await reportApi.generateAIReport(params)
//         : await reportApi.generateReport(params);

//       if (data.status === 'success') {
//         setReportData(data.data);
//         console.log('Generated report data:', data.data);
//         setLoading(false);
//         toast.success('Report generated successfully');
//       } else {
//         throw new Error(data.message);
//       }
//     } catch (error) {
//       console.error('Error generating report:', error);
//       toast.error('Failed to generate report');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadReport = async () => {
//     try {
//       setLoading(true);
//       const params = {
//         reportType,
//         dateRange: {
//           startDate: dateRange.from.toISOString(),
//           endDate: dateRange.to.toISOString(),
//         },
//         branchId: selectedBranch !== 'all' ? selectedBranch : 'all',
//         reportPart: reportPart !== 'all' ? reportPart : '',
//         includeAI: 'false',
//       };

//       // Use the exportCSV function from reportApi
//       const blob = await reportApi.exportCSV(params);

//       if (blob) {
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         const today = new Date().toISOString().split('T')[0];
//         const partName = reportPart !== 'all' ? `_${reportPart}` : '';
//         const branchName = selectedBranch !== 'all' ? `_${branches.find(b => b._id === selectedBranch)?.location || 'branch'}` : '';
//         a.download = `comprehensive_report${partName}${branchName}_${today}.csv`;
//         document.body.appendChild(a);
//         a.click();
//         window.URL.revokeObjectURL(url);
//         document.body.removeChild(a);
        
//         toast.success('Report downloaded successfully');
//       } else {
//         throw new Error('No data received for export');
//       }
//     } catch (error) {
//       console.error('Error downloading report:', error);
//       toast.error('Failed to download report: ' + (error.response?.data?.message || error.message || 'Unknown error'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const KPICard = ({
//     title,
//     value,
//     change,
//     trend,
//     icon: Icon,
//     format = 'number',
//   }) => {
//     const formatValue = (val) => {
//       if (format === 'currency') return `Rs. ${Number(val).toLocaleString()}`;
//       if (format === 'percentage') return `${val}%`;
//       return Number(val).toLocaleString();
//     };

//     return (
//       <Card>
//         <CardContent className="flex items-center justify-between p-6">
//           <div className="flex items-center space-x-2">
//             {Icon && <Icon className="h-8 w-8 text-blue-600" />}
//             <div>
//               <p className="text-sm font-medium text-gray-600">{title}</p>
//               <div className="text-2xl font-bold">{formatValue(value)}</div>
//               {change !== undefined && (
//                 <p className="text-xs text-muted-foreground flex items-center mt-1">
//                   {trend === 'up' ? (
//                     <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
//                   ) : trend === 'down' ? (
//                     <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
//                   ) : null}
//                   {Math.abs(change).toFixed(1)}% from last period
//                 </p>
//               )}
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   };

//   // Function to render comprehensive report content
//   const renderReportContent = () => {
//     if (!reportData) return null;
//     return renderComprehensiveReport();
//   };

//   const renderComprehensiveReport = () => (
//     <Tabs defaultValue="overview" className="space-y-4">
//       <TabsList className="grid w-full grid-cols-4">
//         <TabsTrigger value="overview">Overview</TabsTrigger>
//         <TabsTrigger value="charts">Charts</TabsTrigger>
//         <TabsTrigger value="trends">Trends</TabsTrigger>
//         <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
//       </TabsList>

//       <TabsContent value="overview">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* System Overview */}
//           {reportData.systemOverview && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>System Overview</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <div className="flex justify-between">
//                   <span>Total Users:</span>
//                   <span className="font-semibold">
//                     {reportData.systemOverview.totalUsers?.toLocaleString()}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Total Parcels:</span>
//                   <span className="font-semibold">
//                     {reportData.systemOverview.totalParcels?.toLocaleString()}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Total Shipments:</span>
//                   <span className="font-semibold">
//                     {reportData.systemOverview.totalShipments?.toLocaleString()}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Total Branches:</span>
//                   <span className="font-semibold">
//                     {reportData.systemOverview.totalBranches?.toLocaleString()}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Available Vehicles:</span>
//                   <span className="font-semibold">
//                     {reportData.systemOverview.totalVehicles?.toLocaleString()}
//                   </span>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* Financial Summary */}
//           {reportData.financialAnalytics && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Financial Summary</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <div className="flex justify-between">
//                   <span>Total Revenue:</span>
//                   <span className="font-semibold text-green-600">
//                     Rs.{' '}
//                     {reportData.financialAnalytics.overview?.totalRevenue?.toLocaleString()}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Pending Payments:</span>
//                   <span className="font-semibold text-orange-600">
//                     Rs.{' '}
//                     {reportData.financialAnalytics.overview?.pendingPayments?.toLocaleString()}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Paid Payments:</span>
//                   <span className="font-semibold text-green-600">
//                     Rs.{' '}
//                     {reportData.financialAnalytics.overview?.paidPayments?.toLocaleString()}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Average Transaction:</span>
//                   <span className="font-semibold">
//                     Rs.{' '}
//                     {reportData.financialAnalytics.overview?.averageTransactionValue?.toLocaleString()}
//                   </span>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </TabsContent>

//       <TabsContent value="charts">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Parcel Status Distribution */}
//           {reportData.parcelAnalytics?.statusBreakdown && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Parcel Status Distribution</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <RechartsPieChart>
//                     <Pie
//                       data={reportData.parcelAnalytics.statusBreakdown}
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={80}
//                       fill="#8884d8"
//                       dataKey="count"
//                       nameKey="_id"
//                       label
//                     >
//                       {reportData.parcelAnalytics.statusBreakdown.map(
//                         (entry, index) => (
//                           <Cell
//                             key={`cell-${index}`}
//                             fill={COLORS[index % COLORS.length]}
//                           />
//                         )
//                       )}
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                   </RechartsPieChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>
//           )}

//           {/* Payment Method Distribution */}
//           {reportData.financialAnalytics?.paymentMethodBreakdown && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Payment Method Distribution</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart
//                     data={reportData.financialAnalytics.paymentMethodBreakdown}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="_id" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="totalAmount" fill="#8884d8" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </TabsContent>

//       <TabsContent value="trends">
//         <div className="space-y-6">
//           {reportData?.trends ? (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Trend Analysis</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//                   <div className="text-center p-4 bg-blue-50 rounded-lg">
//                     <div className="text-2xl font-bold text-blue-600">
//                       {reportData.trends.parcelTrend?.growth !== undefined 
//                         ? `${reportData.trends.parcelTrend.growth > 0 ? '+' : ''}${reportData.trends.parcelTrend.growth}%`
//                         : 'N/A'}
//                     </div>
//                     <div className="text-sm text-gray-600">Parcel Growth</div>
//                     <div className="text-xs text-gray-500 mt-1">
//                       {reportData.trends.parcelTrend?.period || 'Last period'}
//                     </div>
//                   </div>
//                   <div className="text-center p-4 bg-green-50 rounded-lg">
//                     <div className="text-2xl font-bold text-green-600">
//                       {reportData.trends.revenueTrend?.growth !== undefined 
//                         ? `${reportData.trends.revenueTrend.growth > 0 ? '+' : ''}${reportData.trends.revenueTrend.growth}%`
//                         : 'N/A'}
//                     </div>
//                     <div className="text-sm text-gray-600">Revenue Growth</div>
//                     <div className="text-xs text-gray-500 mt-1">
//                       {reportData.trends.revenueTrend?.period || 'Last period'}
//                     </div>
//                   </div>
//                   <div className="text-center p-4 bg-purple-50 rounded-lg">
//                     <div className="text-2xl font-bold text-purple-600">
//                       {reportData.trends.userTrend?.growth !== undefined 
//                         ? `${reportData.trends.userTrend.growth > 0 ? '+' : ''}${reportData.trends.userTrend.growth}%`
//                         : 'N/A'}
//                     </div>
//                     <div className="text-sm text-gray-600">User Growth</div>
//                     <div className="text-xs text-gray-500 mt-1">
//                       {reportData.trends.userTrend?.period || 'Last period'}
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Additional trend metrics if available */}
//                 {(reportData.trends.shipmentTrend || reportData.trends.vehicleTrend) && (
//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
//                     {reportData.trends.shipmentTrend && (
//                       <div className="text-center p-4 bg-orange-50 rounded-lg">
//                         <div className="text-2xl font-bold text-orange-600">
//                           {reportData.trends.shipmentTrend.growth !== undefined 
//                             ? `${reportData.trends.shipmentTrend.growth > 0 ? '+' : ''}${reportData.trends.shipmentTrend.growth}%`
//                             : 'N/A'}
//                         </div>
//                         <div className="text-sm text-gray-600">Shipment Growth</div>
//                         <div className="text-xs text-gray-500 mt-1">
//                           {reportData.trends.shipmentTrend?.period || 'Last period'}
//                         </div>
//                       </div>
//                     )}
//                     {reportData.trends.vehicleTrend && (
//                       <div className="text-center p-4 bg-indigo-50 rounded-lg">
//                         <div className="text-2xl font-bold text-indigo-600">
//                           {reportData.trends.vehicleTrend.growth !== undefined 
//                             ? `${reportData.trends.vehicleTrend.growth > 0 ? '+' : ''}${reportData.trends.vehicleTrend.growth}%`
//                             : 'N/A'}
//                         </div>
//                         <div className="text-sm text-gray-600">Vehicle Utilization</div>
//                         <div className="text-xs text-gray-500 mt-1">
//                           {reportData.trends.vehicleTrend?.period || 'Last period'}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           ) : (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Trend Analysis</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-center py-8 text-gray-500">
//                   <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
//                   <p>No trend data available for the selected period.</p>
//                   <p className="text-sm mt-2">Try selecting a different date range or generate a new report.</p>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </TabsContent>

//       <TabsContent value="recommendations">
//         <div className="space-y-6">
//           {/* Standard System Recommendations */}
//           <Card>
//             <CardHeader>
//               <CardTitle>System Recommendations</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div className="p-4 bg-blue-50 rounded-lg">
//                   <h4 className="font-semibold text-blue-900">
//                     Performance Optimization
//                   </h4>
//                   <p className="text-blue-700 mt-1">
//                     Consider optimizing delivery routes during peak hours to
//                     improve efficiency.
//                   </p>
//                 </div>
//                 <div className="p-4 bg-green-50 rounded-lg">
//                   <h4 className="font-semibold text-green-900">
//                     Resource Management
//                   </h4>
//                   <p className="text-green-700 mt-1">
//                     Vehicle utilization is optimal. Consider expanding fleet for
//                     high-demand routes.
//                   </p>
//                 </div>
//                 <div className="p-4 bg-orange-50 rounded-lg">
//                   <h4 className="font-semibold text-orange-900">
//                     Customer Service
//                   </h4>
//                   <p className="text-orange-700 mt-1">
//                     Response time for inquiries can be improved with automated
//                     chatbot integration.
//                   </p>
//                 </div>
                
//                 {/* Data-driven recommendations based on report data */}
//                 {reportData && (
//                   <>
//                     {reportData.systemOverview?.totalParcels > 1000 && (
//                       <div className="p-4 bg-indigo-50 rounded-lg">
//                         <h4 className="font-semibold text-indigo-900">
//                           Scale Optimization
//                         </h4>
//                         <p className="text-indigo-700 mt-1">
//                           With {reportData.systemOverview.totalParcels.toLocaleString()} parcels processed, 
//                           consider implementing automated sorting systems to handle the high volume efficiently.
//                         </p>
//                       </div>
//                     )}
                    
//                     {reportData.financialAnalytics?.overview?.pendingAmount > 50000 && (
//                       <div className="p-4 bg-red-50 rounded-lg">
//                         <h4 className="font-semibold text-red-900">
//                           Payment Collection
//                         </h4>
//                         <p className="text-red-700 mt-1">
//                           Rs. {reportData.financialAnalytics.overview.pendingAmount.toLocaleString()} 
//                           in pending payments detected. Implement automated payment reminders and 
//                           incentivize early payments.
//                         </p>
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </TabsContent>
//     </Tabs>
//   );

//   return (
//     <div className="space-y-6 p-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">
//             Reports & Analytics
//           </h1>
//           <p className="text-gray-600 mt-1">Monthly Insights</p>
//         </div>
//       </div>

//       {/* Dashboard KPIs */}
//       {loading && (
//         <div className="flex items-center justify-center h-64">
//           <LoadingAnimation/>
//         </div>
//         )}

//       {dashboardData && !loading && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
//           <KPICard
//             title="Total Parcels"
//             value={dashboardData.kpi?.totalParcels?.value || 0}
//             change={dashboardData.kpi?.totalParcels?.change}
//             trend={dashboardData.kpi?.totalParcels?.trend || 'stable'}
//             icon={Package}
//           />
//           <KPICard
//             title="Total Revenue"
//             value={dashboardData.kpi?.totalRevenue?.value || 0}
//             change={dashboardData.kpi?.totalRevenue?.change}
//             trend={dashboardData.kpi?.totalRevenue?.trend || 'stable'}
//             icon={DollarSign}
//             format="currency"
//           />
//           <KPICard
//             title="Pending Payments"
//             value={dashboardData.kpi?.pendingPayments?.value || 0}
//             change={dashboardData.kpi?.pendingPayments?.change}
//             trend={dashboardData.kpi?.pendingPayments?.trend || 'stable'}
//             icon={Loader}
//             format="currency"
//           />
//           <KPICard
//             title="Active Vehicles"
//             value={dashboardData.kpi?.activeVehicles?.value || 0}
//             change={dashboardData.kpi?.activeVehicles?.change}
//             trend={dashboardData.kpi?.activeVehicles?.trend || 'stable'}
//             icon={Truck}
//           />
//           <KPICard
//             title="Delivery Rate"
//             value={dashboardData.kpi?.deliverySuccessRate?.value || 0}
//             change={dashboardData.kpi?.deliverySuccessRate?.improvement}
//             trend="up"
//             icon={TrendingUp}
//             format="percentage"
//           />
//         </div>
//       )}

//       {/* Report Generation Controls */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Filter className="h-5 w-5" />
//             Comprehensive Report Generation
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//             {/* Date Range */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Date Range</label>
//               <DatePickerWithRange date={dateRange} setDate={setDateRange} />
//             </div>

//             {/* Branch Filter */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Branch</label>
//               <Select value={selectedBranch} onValueChange={setSelectedBranch}>
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Branches</SelectItem>
//                   {branches.map((branch) => (
//                     <SelectItem key={branch._id} value={branch._id}>
//                       {branch.location}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Report Parts Filter */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Report Section</label>
//               <Select value={reportPart} onValueChange={setReportPart}>
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {reportParts.map((part) => (
//                     <SelectItem key={part.value} value={part.value}>
//                       {part.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Actions */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Actions</label>
//               <div className="flex gap-2">
//                 <Button
//                   onClick={() => generateReport(false)}
//                   disabled={loading}
//                   className="w-full"
//                 >
//                   {loading ? (
//                     <RefreshCw className="h-4 w-4 animate-spin mr-2" />
//                   ) : (
//                     <FileText className="h-4 w-4 mr-2" />
//                   )}
//                   Generate Report
//                 </Button>
//               </div>
//             </div>
//           </div>

//           {/* Download Options */}
//           {reportData && (
//             <div className="flex gap-2 pt-4 border-t">
//               <Button
//                 onClick={downloadReport}
//                 variant="outline"
//                 size="sm"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <RefreshCw className="h-4 w-4 animate-spin mr-2" />
//                 ) : (
//                   <Download className="h-4 w-4 mr-2" />
//                 )}
//                 Download CSV
//               </Button>
//               <div className="text-xs text-gray-500 flex items-center ml-2">
//                 {reportPart !== 'all' && (
//                   <span>Downloading: {reportParts.find(p => p.value === reportPart)?.label}</span>
//                 )}
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Report Results */}
//       {renderReportContent()}
//     </div>
//   );
// };

// export default Reports;





import { useState, useEffect } from 'react';
import {
  Download,
  FileText,
  TrendingUp,
  Package,
  Truck,
  DollarSign,
  Filter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { toast } from 'sonner';

// Import API functions
import { dashboardApi, reportApi, branchApi } from '@/api/reportApi';

// Import components
import LoadingAnimation from '../../utils/LoadingAnimation';

const Reports = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [branches, setBranches] = useState([]);
  const [reportPart, setReportPart] = useState('all');

  // Only comprehensive report type
  const reportType = 'comprehensive';

  // Report parts options
  const reportParts = [
    { value: 'all', label: 'Complete Report' },
    { value: 'parcels', label: 'Parcels Only' },
    { value: 'shipments', label: 'Shipments Only' },
    { value: 'users', label: 'Users Only' },
    { value: 'financial', label: 'Financial Only' },
    { value: 'operational', label: 'Operational Only' },
    { value: 'branches', label: 'Branches Only' },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    fetchBranches();
    fetchDashboardData();
  }, []);

  const fetchBranches = async () => {
    try {
      const data = await branchApi.getAllBranches();
      if (data.status === 'success') {
        setBranches(data.data || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching branches:', error);
      toast.error('Failed to fetch branches: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    }
  };

  const fetchDashboardData = async () => {
    try {
      const data = await dashboardApi.getDashboardData('0d');
      if (data.status === 'success') {
        setDashboardData(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    }
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      const params = {
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
        reportType,
        branchId: selectedBranch || 'all',
        reportPart: reportPart || 'all',
        format: 'json',
      };

      const data = await reportApi.generateReport(params);

      if (data.status === 'success') {
        setReportData(data.data);
        toast.success('Report generated successfully');
      } else {
        throw new Error(data.message || 'Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    try {
      setLoading(true);
      const params = {
        reportType,
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
        branchId: selectedBranch || 'all',
        reportPart: reportPart || 'all',
        format: 'csv',
      };

      const blob = await reportApi.generateReport(params);

      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const today = new Date().toISOString().split('T')[0];
        const partName = reportPart !== 'all' ? `_${reportPart}` : '';
        const branchName = selectedBranch !== 'all' ? `_${branches.find(b => b._id === selectedBranch)?.location || 'branch'}` : '';
        a.download = `comprehensive_report${partName}${branchName}_${today}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success('Report downloaded successfully');
      } else {
        throw new Error('No data received for export');
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    } finally {
      setLoading(false);
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
            {Icon && <Icon className="h-8 w-8 text-gray-600" />}
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

  const renderReportContent = () => {
    if (!reportData) return null;
    return renderComprehensiveReport();
  };

  const renderComprehensiveReport = () => (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="charts">Charts</TabsTrigger>
        <TabsTrigger value="trends">Trends</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reportData.systemOverview && (
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Users:</span>
                  <span className="font-semibold">
                    {reportData.systemOverview.totalUsers?.toLocaleString()}
                  </span>
                </div>
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
              </CardContent>
            </Card>
          )}

          {reportData.financialAnalytics && (
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
                  <span>Average Transaction:</span>
                  <span className="font-semibold">
                    Rs.{' '}
                    {reportData.financialAnalytics.overview?.averageTransactionValue?.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {reportData.branchPerformance && (
            <Card>
              <CardHeader>
                <CardTitle>Branch Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {reportData.branchPerformance.branchStats?.map((branch, index) => (
                  <div key={index} className="border-b pb-2">
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-semibold">{branch.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Parcels:</span>
                      <span className="font-semibold">{branch.totalParcels?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Staff Count:</span>
                      <span className="font-semibold">{branch.staffCount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Driver Count:</span>
                      <span className="font-semibold">{branch.driverCount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vehicle Count:</span>
                      <span className="font-semibold">{branch.vehicleCount?.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                {reportData.branchPerformance.message && (
                  <p className="text-gray-500">{reportData.branchPerformance.message}</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="charts">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reportData.parcelAnalytics?.statusBreakdown && (
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
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="_id"
                      label
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
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {reportData.financialAnalytics?.paymentMethodBreakdown && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Method Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={reportData.financialAnalytics.paymentMethodBreakdown}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="totalAmount" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="trends">
        <div className="space-y-6">
          {reportData?.trends ? (
            <Card>
              <CardHeader>
                <CardTitle>Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {reportData.trends.parcelTrend?.growth !== undefined 
                        ? `${reportData.trends.parcelTrend.growth > 0 ? '+' : ''}${reportData.trends.parcelTrend.growth}%`
                        : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Parcel Growth</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {reportData.trends.parcelTrend?.period || 'Last period'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {reportData.trends.revenueTrend?.growth !== undefined 
                        ? `${reportData.trends.revenueTrend.growth > 0 ? '+' : ''}${reportData.trends.revenueTrend.growth}%`
                        : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Revenue Growth</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {reportData.trends.revenueTrend?.period || 'Last period'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {reportData.trends.userTrend?.growth !== undefined 
                        ? `${reportData.trends.userTrend.growth > 0 ? '+' : ''}${reportData.trends.userTrend.growth}%`
                        : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">User Growth</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {reportData.trends.userTrend?.period || 'Last period'}
                    </div>
                  </div>
                </div>
                
                {(reportData.trends.shipmentTrend || reportData.trends.vehicleTrend) && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
                    {reportData.trends.shipmentTrend && (
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {reportData.trends.shipmentTrend.growth !== undefined 
                            ? `${reportData.trends.shipmentTrend.growth > 0 ? '+' : ''}${reportData.trends.shipmentTrend.growth}%`
                            : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">Shipment Growth</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {reportData.trends.shipmentTrend?.period || 'Last period'}
                        </div>
                      </div>
                    )}
                    {reportData.trends.vehicleTrend && (
                      <div className="text-center p-4 bg-indigo-50 rounded-lg">
                        <div className="text-2xl font-bold text-indigo-600">
                          {reportData.trends.vehicleTrend.growth !== undefined 
                            ? `${reportData.trends.vehicleTrend.growth > 0 ? '+' : ''}${reportData.trends.vehicleTrend.growth}%`
                            : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">Vehicle Utilization</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {reportData.trends.vehicleTrend?.period || 'Last period'}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No trend data available for the selected period.</p>
                  <p className="text-sm mt-2">Try selecting a different date range or generate a new report.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 mt-1">Monthly Insights</p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-64">
          <LoadingAnimation />
        </div>
      )}

      {dashboardData && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <KPICard
            title="Total Parcels"
            value={dashboardData.kpi?.totalParcels?.value || 0}
            change={dashboardData.kpi?.totalParcels?.change}
            trend={dashboardData.kpi?.totalParcels?.trend || 'stable'}
            icon={Package}
          />
          <KPICard
            title="Total Revenue"
            value={dashboardData.kpi?.totalRevenue?.value || 0}
            change={dashboardData.kpi?.totalRevenue?.change}
            trend={dashboardData.kpi?.totalRevenue?.trend || 'stable'}
            icon={DollarSign}
            format="currency"
          />
          <KPICard
            title="Pending Payments"
            value={dashboardData.kpi?.pendingPayments?.value || 0}
            change={dashboardData.kpi?.pendingPayments?.change}
            trend={dashboardData.kpi?.pendingPayments?.trend || 'stable'}
            icon={Loader}
            format="currency"
          />
          <KPICard
            title="Active Vehicles"
            value={dashboardData.kpi?.activeVehicles?.value || 0}
            change={dashboardData.kpi?.activeVehicles?.change}
            trend={dashboardData.kpi?.activeVehicles?.trend || 'stable'}
            icon={Truck}
          />
          <KPICard
            title="Delivery Rate"
            value={dashboardData.kpi?.deliverySuccessRate?.value || 0}
            change={dashboardData.kpi?.deliverySuccessRate?.improvement}
            trend="up"
            icon={TrendingUp}
            format="percentage"
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Comprehensive Report Generation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Branch</label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch._id} value={branch._id}>
                      {branch.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Report Section</label>
              <Select value={reportPart} onValueChange={setReportPart}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportParts.map((part) => (
                    <SelectItem key={part.value} value={part.value}>
                      {part.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <div className="flex gap-2">
                <Button
                  onClick={generateReport}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  Generate Report
                </Button>
              </div>
            </div>
          </div>

          {reportData && (
            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={downloadReport}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Download CSV
              </Button>
              <div className="text-xs text-gray-500 flex items-center ml-2">
                {reportPart !== 'all' && (
                  <span>Downloading: {reportParts.find(p => p.value === reportPart)?.label}</span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {renderReportContent()}
    </div>
  );
};

export default Reports;