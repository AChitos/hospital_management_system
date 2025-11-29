"use client";

import { useState, useEffect } from "react";
import { 
  UserGroupIcon, 
  CalendarIcon, 
  ClipboardDocumentListIcon, 
  ClipboardDocumentCheckIcon 
} from "@heroicons/react/24/outline";
import AuthLayout from "@/components/layouts/AuthLayout";
import StatCard from "@/components/dashboard/StatCard";
import ActivityChart from "@/components/dashboard/ActivityChart";
import RecentPatients from "@/components/dashboard/RecentPatients";
import UpcomingAppointments from "@/components/dashboard/UpcomingAppointments";
import { api } from "@/lib/utils/apiClient";

// Define interfaces for dashboard data
interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  updatedAt: string;
}

interface Appointment {
  id: string;
  appointmentDate: string;
  status: string;
  notes?: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface TrendData {
  value: number;
  isPositive: boolean;
}

interface DashboardStats {
  totalPatients: number;
  scheduledAppointments: number;
  activePrescriptions: number;
  medicalRecords: number;
  trends?: {
    patients?: TrendData;
    appointments?: TrendData;
  };
}

interface ActivityItem {
  name: string;
  value: number;
}

interface DashboardResponse {
  stats: DashboardStats;
  recentPatients: Patient[];
  upcomingAppointments: Appointment[];
  activityData: ActivityItem[];
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    scheduledAppointments: 0,
    activePrescriptions: 0,
    medicalRecords: 0,
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activityData, setActivityData] = useState<ActivityItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch real data from our API
        const response = await api.get<DashboardResponse>('/api/dashboard');
        
        if (response.error) {
          setError(response.error);
          setIsLoading(false);
          return;
        }
        
        if (response.data) {
          setStats(response.data.stats);
          setPatients(response.data.recentPatients);
          setAppointments(response.data.upcomingAppointments);
          setActivityData(response.data.activityData);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data");
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fallback data in case API call fails
  const useFallbackData = () => {
    if (activityData.length === 0) {
      return [
        { name: "Mon", value: 3 },
        { name: "Tue", value: 4 },
        { name: "Wed", value: 2 },
        { name: "Thu", value: 5 },
        { name: "Fri", value: 7 },
        { name: "Sat", value: 2 },
        { name: "Sun", value: 1 },
      ];
    }
    return activityData;
  };

  return (
    <AuthLayout>
      <div className="bg-gray-50 min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome to your healthcare management system</p>
          </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-5 mb-8 rounded-lg shadow-sm flex items-center">
            <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
            </svg>
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={UserGroupIcon}
            trend={stats.trends?.patients}
            isLoading={isLoading}
          />
          <StatCard
            title="Scheduled Appointments"
            value={stats.scheduledAppointments}
            icon={CalendarIcon}
            trend={stats.trends?.appointments}
            isLoading={isLoading}
          />
          <StatCard
            title="Active Prescriptions"
            value={stats.activePrescriptions}
            icon={ClipboardDocumentListIcon}
            isLoading={isLoading}
          />
          <StatCard
            title="Medical Records"
            value={stats.medicalRecords}
            icon={ClipboardDocumentCheckIcon}
            isLoading={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <ActivityChart 
              title="Weekly Appointment Activity"
              data={useFallbackData()} 
              color="#3b82f6"
              isLoading={isLoading}
            />
          </div>
          
          <div className="lg:col-span-1">
            <RecentPatients 
              patients={patients} 
              isLoading={isLoading} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 mb-8">
          <UpcomingAppointments 
            appointments={appointments} 
            isLoading={isLoading} 
          />
        </div>
        </div>
      </div>
    </AuthLayout>
  );
}
