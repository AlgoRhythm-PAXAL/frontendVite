import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';
import { useState, useEffect } from 'react';
import axios from 'axios';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useAdminTheme } from '../contexts/AdminThemeContext';
import PropTypes from 'prop-types';

const parcelStatusColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--chart-6))',
  'hsl(var(--chart-7))',
  'hsl(var(--chart-8))',
  'hsl(var(--chart-9))',
  'hsl(var(--chart-10))',
  'hsl(var(--chart-11))',
];

const chartConfig = {
  visitors: {
    label: 'Parcels',
  },
  chrome: {
    label: 'Chrome',
    color: 'hsl(var(--chart-1))',
  },
  safari: {
    label: 'Safari',
    color: 'hsl(var(--chart-2))',
  },
  firefox: {
    label: 'Firefox',
    color: 'hsl(var(--chart-3))',
  },
  edge: {
    label: 'Edge',
    color: 'hsl(var(--chart-4))',
  },
  other: {
    label: 'Other',
    color: 'hsl(var(--chart-5))',
  },
};

export default function PieChartShadcn({ title }) {
  const { isAuthenticated } = useAdminAuth();
  const { theme } = useAdminTheme();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  useEffect(() => {
    const fetchChartData = async () => {
      if (!isAuthenticated) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          'http://localhost:8000/admin/pieChart/data',
          { withCredentials: true }
        );

        const formattedData = response.data.map((item, index) => ({
          status: item.status,
          count: item.count,
          fill: parcelStatusColors[index % parcelStatusColors.length],
        }));
        console.log('Formatted Data:', formattedData);

        setChartData(formattedData);
        setError(null);
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setError('Failed to load chart data');
      } finally {
        setLoading(false);
      }
    };
    fetchChartData();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <Card 
        className={`flex flex-col w-1/4 my-5 ${
          theme === 'dark' 
            ? 'admin-dark bg-gray-800 border-gray-700' 
            : 'admin-light bg-white border-gray-200'
        }`}
        data-admin-theme={theme}
      >
        <CardHeader className="items-center pb-0">
          <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
            {title}
          </CardTitle>
          <CardDescription className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            Loading...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0 flex justify-center items-center min-h-[250px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card 
        className={`flex flex-col w-1/4 my-5 ${
          theme === 'dark' 
            ? 'admin-dark bg-gray-800 border-red-500/50' 
            : 'admin-light bg-white border-red-200'
        }`}
        data-admin-theme={theme}
      >
        <CardHeader className="items-center pb-0">
          <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
            {title}
          </CardTitle>
          <CardDescription className={theme === 'dark' ? 'text-red-400' : 'text-red-600'}>
            {error}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0 flex justify-center items-center min-h-[250px]">
          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
            Unable to load chart
          </span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`flex flex-col w-1/4 my-5 ${
        theme === 'dark' 
          ? 'admin-dark bg-gray-800 border-gray-700' 
          : 'admin-light bg-white border-gray-200'
      }`}
      data-admin-theme={theme}
    >
      <CardHeader className="items-center pb-0">
        <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
          {title}
        </CardTitle>
        <CardDescription className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
          January - June 2024
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent 
                  hideLabel 
                  className={
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-600 text-white' 
                      : 'bg-white border-gray-200 text-gray-900'
                  }
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className={`text-3xl font-bold ${
                            theme === 'dark' ? 'fill-white' : 'fill-foreground'
                          }`}
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className={
                            theme === 'dark' 
                              ? 'fill-gray-400' 
                              : 'fill-muted-foreground'
                          }
                        >
                          Parcels
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className={`flex items-center gap-2 font-medium leading-none ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className={`leading-none ${
          theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'
        }`}>
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}

PieChartShadcn.propTypes = {
  title: PropTypes.string,
};
