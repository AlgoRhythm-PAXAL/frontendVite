import { useState, useEffect } from "react";
import { 
  Download, 
  FileText, 
  TrendingUp, 
  BarChart3, 
  Users,
  Package, 
  Truck,
  DollarSign,
  Brain,
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown
} from "lucide-react";
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
  Legend 
} from "recharts";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Button 
} from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { toast } from "sonner";

// Import API functions
import { dashboardApi, reportApi, branchApi } from "@/api/reportApi";

// Import components
import AIReport from "@/components/admin/reports/AIReport";
import ExportPanel from "@/components/admin/reports/ExportPanel";

const Reports = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });
  const [reportType, setReportType] = useState("comprehensive");
  const [reportData, setReportData] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [branches, setBranches] = useState([]);

  const reportTypes = [
    { value: "comprehensive", label: "Comprehensive Report", icon: FileText },
    { value: "parcels", label: "Parcel Analytics", icon: Package },
    { value: "shipments", label: "Shipment Analytics", icon: Truck },
    { value: "users", label: "User Analytics", icon: Users },
    { value: "financial", label: "Financial Report", icon: DollarSign },
    { value: "operational", label: "Operational Report", icon: BarChart3 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    fetchBranches();
    fetchDashboardData();
  }, []);

  const fetchBranches = async () => {
    try {
      const data = await branchApi.getAllBranches();
      if (data.status === "success") {
        setBranches(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
      toast.error("Failed to fetch branches");
    }
  };

  const fetchDashboardData = async () => {
    try {
      const data = await dashboardApi.getDashboardData("30d");
      console.log("Dashboard data:", data.data);
      if (data.status === "success") {
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to fetch dashboard data");
    }
  };

  const generateReport = async (useAI = false) => {
    setLoading(true);
    try {
      const params = {
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
        reportType,
        branchId: selectedBranch !== "all" ? selectedBranch : "",
        format: "json"
      };

      const data = useAI 
        ? await reportApi.generateAIReport(params)
        : await reportApi.generateReport(params);
      
      if (data.status === "success") {
        setReportData(data.data);
        if (useAI && data.data.aiInsights) {
          setAiInsights(data.data.aiInsights);
        }
        toast.success(`${useAI ? "AI-powered r" : "R"}eport generated successfully`);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (format = "json") => {
    try {
      const params = {
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
        reportType,
        branchId: selectedBranch !== "all" ? selectedBranch : "",
        format
      };

      const data = await reportApi.generateReport(params);
      
      if (data.status === "success") {
        const blob = new Blob([JSON.stringify(data, null, 2)], { 
          type: format === "json" ? "application/json" : "text/csv" 
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        a.download = `report_${reportType}_${format.toUpperCase()}_${today}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("Report downloaded successfully");
      }
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report");
    }
  };

  const KPICard = ({ title, value, change, trend, icon: Icon, format = "number" }) => {
    const formatValue = (val) => {
      if (format === "currency") return `Rs. ${Number(val).toLocaleString()}`;
      if (format === "percentage") return `${val}%`;
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
                  {trend === "up" ? (
                    <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : trend === "down" ? (
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

  // Function to render different report content based on type
  const renderReportContent = () => {
    if (!reportData) return null;

    switch (reportType) {
      case "comprehensive":
        return renderComprehensiveReport();
      case "parcels":
        return renderParcelReport();
      case "shipments":
        return renderShipmentReport();
      case "users":
        return renderUserReport();
      case "financial":
        return renderFinancialReport();
      case "operational":
        return renderOperationalReport();
      default:
        return renderComprehensiveReport();
    }
  };

  const renderParcelReport = () => (
    <Card>
      <CardHeader>
        <CardTitle>Parcel Analytics Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reportData.analytics?.overview && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{reportData.analytics.overview.totalParcels || 0}</div>
                <div className="text-sm text-gray-600">Total Parcels</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{reportData.analytics.overview.totalWeight || 0}kg</div>
                <div className="text-sm text-gray-600">Total Weight</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{reportData.analytics.overview.totalVolume || 0}m³</div>
                <div className="text-sm text-gray-600">Total Volume</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">Rs. {reportData.analytics.overview.averagePrice || 0}</div>
                <div className="text-sm text-gray-600">Avg. Price</div>
              </div>
            </div>
          )}

          {reportData.analytics?.statusBreakdown && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={reportData.analytics.statusBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="_id"
                    label
                  >
                    {reportData.analytics.statusBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderShipmentReport = () => (
    <Card>
      <CardHeader>
        <CardTitle>Shipment Analytics Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reportData.analytics?.overview && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{reportData.analytics.overview.totalShipments || 0}</div>
                <div className="text-sm text-gray-600">Total Shipments</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{reportData.analytics.overview.completedShipments || 0}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{reportData.analytics.overview.pendingShipments || 0}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          )}

          {reportData.analytics?.routeAnalysis && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Route Performance</h3>
              <div className="space-y-2">
                {reportData.analytics.routeAnalysis.map((route, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>{route.route}</span>
                    <span className="font-semibold">{route.shipmentCount} shipments</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderUserReport = () => (
    <Card>
      <CardHeader>
        <CardTitle>User Analytics Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reportData.analytics?.overview && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{reportData.analytics.overview.totalUsers || 0}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{reportData.analytics.overview.activeUsers || 0}</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{reportData.analytics.overview.totalStaff || 0}</div>
                <div className="text-sm text-gray-600">Staff Members</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{reportData.analytics.overview.totalDrivers || 0}</div>
                <div className="text-sm text-gray-600">Drivers</div>
              </div>
            </div>
          )}

          {reportData.analytics?.userTypeBreakdown && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">User Type Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.analytics.userTypeBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderFinancialReport = () => (
    <Card>
      <CardHeader>
        <CardTitle>Financial Analytics Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reportData.analytics?.overview && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">Rs. {reportData.analytics.overview.totalRevenue?.toLocaleString() || 0}</div>
                <div className="text-sm text-gray-600">Total Revenue</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">Rs. {reportData.analytics.overview.completedPayments?.toLocaleString() || 0}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">Rs. {reportData.analytics.overview.pendingAmount?.toLocaleString() || 0}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">Rs. {reportData.analytics.overview.averageTransactionValue?.toLocaleString() || 0}</div>
                <div className="text-sm text-gray-600">Avg. Transaction</div>
              </div>
            </div>
          )}

          {reportData.analytics?.paymentMethodBreakdown && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={reportData.analytics.paymentMethodBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="totalAmount"
                    nameKey="_id"
                    label
                  >
                    {reportData.analytics.paymentMethodBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderOperationalReport = () => (
    <Card>
      <CardHeader>
        <CardTitle>Operational Analytics Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reportData.analytics?.overview && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{reportData.analytics.overview.totalVehicles || 0}</div>
                <div className="text-sm text-gray-600">Total Vehicles</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{reportData.analytics.overview.availableVehicles || 0}</div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{reportData.analytics.overview.busyVehicles || 0}</div>
                <div className="text-sm text-gray-600">In Use</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{reportData.analytics.overview.totalInquiries || 0}</div>
                <div className="text-sm text-gray-600">Inquiries</div>
              </div>
            </div>
          )}

          {reportData.analytics?.vehicleUtilization && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Vehicle Utilization</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.analytics.vehicleUtilization}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="vehicleType" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="utilizationRate" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderComprehensiveReport = () => (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="charts">Charts</TabsTrigger>
        <TabsTrigger value="trends">Trends</TabsTrigger>
        {aiInsights && <TabsTrigger value="insights">AI Insights</TabsTrigger>}
        <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        <TabsTrigger value="export">Export</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Overview */}
          {reportData.systemOverview && (
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Users:</span>
                  <span className="font-semibold">{reportData.systemOverview.totalUsers?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Parcels:</span>
                  <span className="font-semibold">{reportData.systemOverview.totalParcels?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Shipments:</span>
                  <span className="font-semibold">{reportData.systemOverview.totalShipments?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Branches:</span>
                  <span className="font-semibold">{reportData.systemOverview.activeBranches?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Available Vehicles:</span>
                  <span className="font-semibold">{reportData.systemOverview.totalVehicles?.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Financial Summary */}
          {reportData.financialAnalytics && (
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Revenue:</span>
                  <span className="font-semibold text-green-600">
                    Rs. {reportData.financialAnalytics.overview?.totalRevenue?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Pending Payments:</span>
                  <span className="font-semibold text-orange-600">
                    Rs. {reportData.financialAnalytics.overview?.pendingAmount?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Average Transaction:</span>
                  <span className="font-semibold">
                    Rs. {reportData.financialAnalytics.overview?.averageTransactionValue?.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="charts">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Parcel Status Distribution */}
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
                      {reportData.parcelAnalytics.statusBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Payment Method Distribution */}
          {reportData.financialAnalytics?.paymentMethodBreakdown && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Method Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.financialAnalytics.paymentMethodBreakdown}>
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
          {reportData.trends && (
            <Card>
              <CardHeader>
                <CardTitle>Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {reportData.trends.parcelTrend?.growth > 0 ? '+' : ''}{reportData.trends.parcelTrend?.growth}%
                    </div>
                    <div className="text-sm text-gray-600">Parcel Growth</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {reportData.trends.revenueTrend?.growth > 0 ? '+' : ''}{reportData.trends.revenueTrend?.growth}%
                    </div>
                    <div className="text-sm text-gray-600">Revenue Growth</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {reportData.trends.userTrend?.growth > 0 ? '+' : ''}{reportData.trends.userTrend?.growth}%
                    </div>
                    <div className="text-sm text-gray-600">User Growth</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      {aiInsights && (
        <TabsContent value="insights">
          <AIReport 
            reportData={reportData}
            reportType={reportType}
            filters={{
              dateRange: {
                startDate: dateRange?.from,
                endDate: dateRange?.to
              },
              branchId: selectedBranch
            }}
          />
        </TabsContent>
      )}

      <TabsContent value="recommendations">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900">Performance Optimization</h4>
                  <p className="text-blue-700 mt-1">Consider optimizing delivery routes during peak hours to improve efficiency.</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900">Resource Management</h4>
                  <p className="text-green-700 mt-1">Vehicle utilization is optimal. Consider expanding fleet for high-demand routes.</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-900">Customer Service</h4>
                  <p className="text-orange-700 mt-1">Response time for inquiries can be improved with automated chatbot integration.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="export">
        <ExportPanel 
          reportType={reportType}
          filters={{
            dateRange: dateRange ? {
              startDate: dateRange.from,
              endDate: dateRange.to
            } : null,
            branchId: selectedBranch
          }}
          onExportComplete={(exportRecord) => {
            console.log('Export completed:', exportRecord);
          }}
        />
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Generate comprehensive reports and insights for your parcel management system</p>
        </div>
      </div>

      {/* Dashboard KPIs */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Parcels"
            value={dashboardData.kpi?.totalParcels?.value || 0}
            change={dashboardData.kpi?.totalParcels?.change}
            trend={dashboardData.kpi?.totalParcels?.trend || "stable"}
            icon={Package}
          />
          <KPICard
            title="Total Revenue"
            value={dashboardData.kpi?.totalRevenue?.value || 0}
            change={dashboardData.kpi?.totalRevenue?.change}
            trend={dashboardData.kpi?.totalRevenue?.trend || "stable"}
            icon={DollarSign}
            format="currency"
          />
          <KPICard
            title="Active Vehicles"
            value={dashboardData.kpi?.activeVehicles?.value || 0}
            change={dashboardData.kpi?.activeVehicles?.change}
            trend={dashboardData.kpi?.activeVehicles?.trend || "stable"}
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

      {/* Report Generation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Report Generation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Report Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <DatePickerWithRange 
                date={dateRange}
                setDate={setDateRange}
              />
            </div>

            {/* Branch Filter */}
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

            {/* Actions */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <div className="flex gap-2">
                <Button 
                  onClick={() => generateReport(false)} 
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
                  Generate
                </Button>
                <Button 
                  onClick={() => generateReport(true)} 
                  disabled={loading}
                  variant="outline"
                  className="flex-1"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  AI Report
                </Button>
              </div>
            </div>
          </div>

          {/* Download Options */}
          {reportData && (
            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={() => downloadReport("json")} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download JSON
              </Button>
              <Button onClick={() => downloadReport("csv")} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Results */}
      {renderReportContent()}
    </div>
  );
};

export default Reports;
