// import * as React from "react";
// import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "sonner";
// import LoadingAnimation from "../../utils/LoadingAnimation";

// const chartConfig = {
//   parcels: {
//     label: "Daily Parcels",
//     color: "hsl(var(--chart-1))",
//   },
// };

// export function ParcelBarChart() {
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState(null);
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   const fetchBarChartData = async () => {
//     try {
//       const response = await axios.get(
//         `${backendUrl}/api/admin/dashboard/bar-chart`,
//         { withCredentials: true }
//       );
//       setData(response.data.chartData); // Ensure state is properly updated
//       setLoading(false);
//     } catch (error) {
//       console.log("Error", error);
//       toast.error("Data fetching error", {
//         description: error.response?.data?.message || "Please try again later",
//       });
//     }
//   };

//   useEffect(() => {
//     fetchBarChartData();
//   }, []);

//   const totalParcels = React.useMemo(
//     () => (data ? data.reduce((acc, curr) => acc + curr.parcelCount, 0) : 0),
//     [data]
//   );
//   if (loading) {
//     return <LoadingAnimation />;
//   }

//   return (
//     <div className="w-full">
//       <Card>
//         <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
//           <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
//             <CardTitle>Parcel Volume Overview</CardTitle>
//             <CardDescription>
//               Daily parcel processing statistics for last 3 months
//             </CardDescription>
//           </div>
//           <div className="flex">
//             <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left sm:px-8 sm:py-6">
//               <span className="text-xs text-muted-foreground">
//                 Total Processed
//               </span>
//               <span className="text-lg font-bold leading-none sm:text-3xl">
//                 {totalParcels.toLocaleString()}
//               </span>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent className="px-2 sm:p-6">
//           <ChartContainer
//             config={chartConfig}
//             className="aspect-auto h-[250px] w-full"
//           >
//             <BarChart data={data} margin={{ left: 12, right: 12 }}>
//               <CartesianGrid vertical={false} />
//               <XAxis
//                 dataKey="date"
//                 tickLine={false}
//                 axisLine={false}
//                 tickMargin={8}
//                 minTickGap={32}
//                 tickFormatter={(value) =>
//                   new Date(value).toLocaleDateString("en-US", {
//                     month: "short",
//                     day: "numeric",
//                   })
//                 }
//               />
//               <ChartTooltip
//                 content={
//                   <ChartTooltipContent
//                     className="w-[150px]"
//                     nameKey="parcels"
//                     labelFormatter={(value) =>
//                       new Date(value).toLocaleDateString("en-US", {
//                         month: "short",
//                         day: "numeric",
//                         year: "numeric",
//                       })
//                     }
//                   />
//                 }
//               />
//               <Bar dataKey="parcelCount" fill={chartConfig.parcels.color} />
//             </BarChart>
//           </ChartContainer>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }





import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { toast } from "sonner";
import LoadingAnimation from "../../utils/LoadingAnimation";

const chartConfig = {
  parcels: {
    label: "Daily Parcels",
    color: "hsl(var(--chart-1))",
  },
};

export function ParcelBarChart() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchBarChartData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${backendUrl}/api/admin/dashboard/bar-chart`,
        { 
          withCredentials: true,
          timeout: 15000, // 15 second timeout for chart data
        }
      );

      // Validate response data
      if (!response.data?.chartData || !Array.isArray(response.data.chartData)) {
        throw new Error("Invalid chart data format received from server");
      }

      const chartData = response.data.chartData;
      
      // Validate each data point
      const validatedData = chartData.filter(item => 
        item && 
        typeof item.parcelCount === 'number' && 
        item.date &&
        !isNaN(new Date(item.date).getTime())
      );

      if (validatedData.length === 0) {
        throw new Error("No valid chart data available");
      }

      setData(validatedData);
      setLoading(false);
      setLastUpdated(new Date());
      setRetryCount(0);

    } catch (error) {
      console.error("Bar chart data fetch error:", error);
      
      let errorMessage = "Failed to load chart data";
      let shouldShowToast = true;

      if (error.code === 'ECONNABORTED') {
        errorMessage = "Request timed out. Please check your connection.";
      } else if (error.response?.status === 401) {
        errorMessage = "Authentication required. Please log in again.";
      } else if (error.response?.status === 403) {
        errorMessage = "Access denied. You don't have permission to view this data.";
        shouldShowToast = false; // Don't spam toast for permission errors
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError({
        message: errorMessage,
        status: error.response?.status,
        canRetry: error.response?.status !== 403,
      });

      if (shouldShowToast) {
        toast.error("Chart Data Error", {
          description: errorMessage,
          action: error.response?.status !== 403 ? {
            label: "Retry",
            onClick: () => handleRetry(),
          } : undefined,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [backendUrl, retryCount]);

  useEffect(() => {
    fetchBarChartData();
  }, [fetchBarChartData]);

  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    fetchBarChartData();
  }, [fetchBarChartData]);

  const chartStats = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        totalParcels: 0,
        averageDaily: 0,
        peakDay: null,
        trend: null,
      };
    }

    const totalParcels = data.reduce((acc, curr) => acc + curr.parcelCount, 0);
    const averageDaily = Math.round(totalParcels / data.length);
    const peakDay = data.reduce((max, curr) => 
      curr.parcelCount > max.parcelCount ? curr : max
    );

    // Simple trend calculation (comparing first half vs second half)
    const midPoint = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, midPoint);
    const secondHalf = data.slice(midPoint);
    
    const firstHalfAvg = firstHalf.reduce((acc, curr) => acc + curr.parcelCount, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((acc, curr) => acc + curr.parcelCount, 0) / secondHalf.length;
    
    const trend = secondHalfAvg > firstHalfAvg ? 'up' : secondHalfAvg < firstHalfAvg ? 'down' : 'stable';

    return {
      totalParcels,
      averageDaily,
      peakDay,
      trend,
    };
  }, [data]);

  if (loading) {
    return (
      <div className="w-full">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Parcel Volume Overview</CardTitle>
                <CardDescription>Loading chart data...</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[300px]">
            <LoadingAnimation />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <Card className="border-red-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-red-600">Chart Unavailable</CardTitle>
                <CardDescription>{error.message}</CardDescription>
              </div>
              {error.canRetry && (
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center px-3 py-2 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors duration-200"
                  disabled={loading}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retry
                </button>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[300px] text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-gray-600 max-w-md">
              We're having trouble loading the parcel volume data. Please check your connection and try again.
            </p>
            {error.status && (
              <p className="text-sm text-gray-500 mt-2">Error Code: {error.status}</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full">
        <Card>
          <CardHeader>
            <CardTitle>Parcel Volume Overview</CardTitle>
            <CardDescription>No data available for the selected period</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[300px] text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-gray-600">
              No parcel data is available for this time period.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Card className="shadow-lg border border-gray-200 ">
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <div className="flex items-center gap-2">
              <CardTitle>Parcel Volume Overview</CardTitle>
              {chartStats.trend && (
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  chartStats.trend === 'up' ? 'bg-green-100 text-green-800' :
                  chartStats.trend === 'down' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {chartStats.trend === 'up' && '↗ Trending Up'}
                  {chartStats.trend === 'down' && '↘ Trending Down'}
                  {chartStats.trend === 'stable' && '→ Stable'}
                </div>
              )}
            </div>
            <CardDescription>
              Daily parcel processing statistics • {data.length} days of data
            </CardDescription>
          </div>
          <div className="flex">
            <div className="grid grid-cols-2 gap-4 px-6 py-4 sm:px-8 sm:py-6">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Total Processed</span>
                <span className="text-lg font-bold leading-none sm:text-2xl">
                  {chartStats.totalParcels.toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Daily Average</span>
                <span className="text-lg font-bold leading-none sm:text-2xl">
                  {chartStats.averageDaily.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[280px] w-full"
          >
            <BarChart 
              data={data} 
              margin={{ left: 12, right: 12, top: 20, bottom: 20 }}
            >
              <CartesianGrid 
                vertical={false} 
                strokeDasharray="3 3" 
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[180px] bg-white border border-gray-200 shadow-lg"
                    nameKey="parcels"
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }
                    formatter={(value) => [
                      `${value.toLocaleString()} parcels`,
                      "Processed"
                    ]}
                  />
                }
              />
              <Bar 
                dataKey="parcelCount" 
                fill={chartConfig.parcels.color}
                radius={[2, 2, 0, 0]}
                className="hover:opacity-80 transition-opacity duration-200"
              />
            </BarChart>
          </ChartContainer>
          
          {/* Footer with additional info */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
            <div>
              {chartStats.peakDay && (
                <span>
                  Peak: {chartStats.peakDay.parcelCount.toLocaleString()} on{' '}
                  {new Date(chartStats.peakDay.date).toLocaleDateString()}
                </span>
              )}
            </div>
            <div>
              {lastUpdated && (
                <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
