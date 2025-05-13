"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  name: string;
  value: number;
}

interface ActivityChartProps {
  title: string;
  data: ChartData[];
  color?: string;
  isLoading?: boolean;
}

export default function ActivityChart({
  title,
  data,
  color = "#3b82f6",
  isLoading = false,
}: ActivityChartProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b pb-4">
        <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="h-72 animate-pulse">
            <div className="bg-gray-100 h-full w-full rounded-lg flex flex-col justify-center items-center">
              <div className="w-full px-6">
                <div className="h-36 w-full bg-gray-200 rounded-lg mb-4"></div>
                <div className="flex justify-between">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="h-3 bg-gray-200 w-8 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 20,
                }}
              >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tickMargin={10}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tickMargin={10}
              />
              <Tooltip />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2.5}
                fill="url(#colorGradient)"
                activeDot={{ r: 6, strokeWidth: 1, stroke: 'white' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        )}
      </CardContent>
    </Card>
  );
}
