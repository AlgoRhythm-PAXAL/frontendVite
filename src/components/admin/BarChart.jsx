import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useState,useEffect} from 'react'
import axios from 'axios'


const chartData = [
    // January
    { date: "2024-01-02", parcelCount: 1285 }, // Post-holiday surge
    { date: "2024-01-15", parcelCount: 2341 }, // Mid-month peak
    { date: "2024-01-31", parcelCount: 1987 },
    
    // February
    { date: "2024-02-14", parcelCount: 3542 }, // Valentine's Day
    { date: "2024-02-28", parcelCount: 2876 },
    
    // March
    { date: "2024-03-08", parcelCount: 4123 }, // International Women's Day
    { date: "2024-03-21", parcelCount: 3987 },
    
    // April
    { date: "2024-04-12", parcelCount: 2876 }, 
    { date: "2024-04-25", parcelCount: 3254 }, // Pre-holiday rush
    
    // May
    { date: "2024-05-01", parcelCount: 1543 }, // Labor Day
    { date: "2024-05-15", parcelCount: 4321 },
    { date: "2024-05-28", parcelCount: 4765 }, // End-of-month business
    
    // June
    { date: "2024-06-18", parcelCount: 4987 }, // Mid-year sales
    { date: "2024-06-30", parcelCount: 5234 },
    
    // July
    { date: "2024-07-04", parcelCount: 1876 }, // US Independence Day
    { date: "2024-07-19", parcelCount: 3456 },
    
    // August
    { date: "2024-08-12", parcelCount: 4321 }, // Back-to-school
    { date: "2024-08-29", parcelCount: 3987 },
    
    // September
    { date: "2024-09-05", parcelCount: 4123 },
    { date: "2024-09-20", parcelCount: 4567 }, // Pre-festive
    
    // October
    { date: "2024-10-10", parcelCount: 5432 }, // Prime Day
    { date: "2024-10-31", parcelCount: 6123 }, // Halloween
    
    // November
    { date: "2024-11-11", parcelCount: 8456 }, // Singles' Day
    { date: "2024-11-29", parcelCount: 9214 }, // Black Friday
    
    // December
    { date: "2024-12-15", parcelCount: 10234 }, // Holiday peak
    { date: "2024-12-24", parcelCount: 8921 },  // Last shipping day
    { date: "2024-12-31", parcelCount: 4567 }
  ];

const chartConfig = {
  parcels: {
    label: "Daily Parcels",
    color: "hsl(var(--chart-1))",
  },
}

// export function Component() {
//     const [data,setData]=useState(null);

//     useEffect(()=>{
//         const fetchBarChartData=async()=>{
//             try{
//                 const barChartData=await axios.get("http://localhost:8000/admin/bar/data");
//                 console.log(barChartData.data);
//                 setData()
                
//             }
//             catch(error){
//                 console.log("Error",error)
//             }
//         }
//         fetchBarChartData();
//     })

//   const totalParcels = React.useMemo(
//     () => chartData.reduce((acc, curr) => acc + curr.parcelCount, 0),
//     []
//   )

//   return (
//     <Card>
//       <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
//         <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
//           <CardTitle>Parcel Volume Overview</CardTitle>
//           <CardDescription>
//             Daily parcel processing statistics for last 3 months
//           </CardDescription>
//         </div>
//         <div className="flex">
//           <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left sm:px-8 sm:py-6">
//             <span className="text-xs text-muted-foreground">
//               Total Processed
//             </span>
//             <span className="text-lg font-bold leading-none sm:text-3xl">
//               {totalParcels.toLocaleString()}
//             </span>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent className="px-2 sm:p-6">
//         <ChartContainer
//           config={chartConfig}
//           className="aspect-auto h-[250px] w-full"
//         >
//           <BarChart
//             data={chartData}
//             margin={{ left: 12, right: 12 }}
//           >
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="date"
//               tickLine={false}
//               axisLine={false}
//               tickMargin={8}
//               minTickGap={32}
//               tickFormatter={(value) => new Date(value)
//                 .toLocaleDateString("en-US", { month: "short", day: "numeric" })}
//             />
//             <ChartTooltip
//               content={
//                 <ChartTooltipContent
//                   className="w-[150px]"
//                   nameKey="parcels"
//                   labelFormatter={(value) => new Date(value)
//                     .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
//                 />
//               }
//             />
//             <Bar 
//               dataKey="parcelCount" 
//               fill={chartConfig.parcels.color} 
//             />
//           </BarChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   )
// }

export function Component() {
    const [data, setData] = useState(null);
  
    useEffect(() => {
      const fetchBarChartData = async () => {
        try {
          const response = await axios.get("http://localhost:8000/admin/bar/data");
          console.log(response.data);
          setData(response.data); // Ensure state is properly updated
        } catch (error) {
          console.log("Error", error);
        }
      };
      fetchBarChartData();
    }, []); // Dependency array to run only once
  
    const totalParcels = React.useMemo(
      () => (data ? data.reduce((acc, curr) => acc + curr.parcelCount, 0) : 0),
      [data]
    );
  
    return (
      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>Parcel Volume Overview</CardTitle>
            <CardDescription>
              Daily parcel processing statistics for last 3 months
            </CardDescription>
          </div>
          <div className="flex">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left sm:px-8 sm:py-6">
              <span className="text-xs text-muted-foreground">
                Total Processed
              </span>
              <span className="text-lg font-bold leading-none sm:text-3xl">
                {totalParcels.toLocaleString()}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <BarChart data={data || chartData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="parcels"
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }
                  />
                }
              />
              <Bar dataKey="parcelCount" fill={chartConfig.parcels.color} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    );
  }
  