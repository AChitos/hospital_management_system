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
    <div className="card">
      {isLoading ? (
        <div className="animate-pulse">
          <div className="flex items-start justify-between">
            <div className="w-2/3">
              <div className="h-3 bg-gray-200 rounded w-20 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
          <div className="mt-4 h-8 bg-gray-100 rounded"></div>
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{title}</p>
              <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            </div>
          </div>
          
          {trend && (
            <div className="flex items-center text-sm">
              <span className="text-gray-500 mr-2">Monthly</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-12 h-6 bg-blue-100 rounded" style={{ height: '20px' }}></div>
                  <div className="w-12 h-8 bg-blue-200 rounded" style={{ height: '28px' }}></div>
                  <div className="w-12 h-10 bg-blue-400 rounded" style={{ height: '36px' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
