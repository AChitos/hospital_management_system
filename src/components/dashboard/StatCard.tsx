import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
            {trend && (
              <div className="flex items-center mt-2">
                <span
                  className={`text-xs font-medium ${
                    trend.isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {trend.isPositive ? "+" : "-"}
                  {trend.value}%
                </span>
                <span className="text-xs text-gray-500 ml-1">from last month</span>
              </div>
            )}
          </div>
          <div className="p-3 bg-blue-50 rounded-full">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
