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
import { useState, useEffect } from 'react'
import axios from 'axios'
import {toast} from 'sonner'


const chartData = [
  
];

const chartConfig = {
  parcels: {
    label: "Daily Parcels",
    color: "hsl(var(--chart-1))",
  },
}



export function Component() {
  const [data, setData] = useState(null);
  const backendUrl=import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/admin/bar/data`,{withCredentials:true});
        setData(response.data.chartData); // Ensure state is properly updated
        
      } catch (error) {
        console.log("Error", error);
        toast.error('Fetching data went fishing 🎣. No luck yet.',{description:error.response?.data?.message || 'Please try again later'})
      }
    };
    fetchBarChartData();
  }, []); // Dependency array to run only once

  const totalParcels = React.useMemo(
    () => (data ? data.reduce((acc, curr) => acc + curr.parcelCount, 0) : 0),
    [data]
  );

  return (

    <div className="w-full">
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
    </div>
  );
}
