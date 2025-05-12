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
}

export default function ActivityChart({
  title,
  data,
  color = "#3b82f6",
}: ActivityChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
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
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                fill={color}
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
