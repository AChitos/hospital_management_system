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
  isLoading?: boolean;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  isLoading = false,
}: StatCardProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="flex items-center justify-between">
              <div className="w-2/3">
                <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                <div className="h-7 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-32 mt-3"></div>
              </div>
              <div className="bg-gray-200 p-4 rounded-xl h-14 w-14"></div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <h3 className="text-2xl font-bold mt-2 text-gray-800">{value}</h3>
              {description && (
                <p className="text-xs text-gray-500 mt-1">{description}</p>
              )}
              {trend && (
                <div className="flex items-center mt-3">
                  <span
                    className={`text-xs font-medium py-1 px-2 rounded-full ${
                      trend.isPositive 
                        ? "text-green-600 bg-green-50" 
                        : "text-red-600 bg-red-50"
                    }`}
                  >
                    {trend.isPositive ? "↑" : "↓"} {trend.value}%
                  </span>
                  <span className="text-xs text-gray-500 ml-2">from last month</span>
                </div>
              )}
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm">
              <Icon className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
