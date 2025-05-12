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

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    scheduledAppointments: 0,
    activePrescriptions: 0,
    medicalRecords: 0,
  });
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, we would fetch from actual API endpoints
        // For now, setting mock data after a delay
        setTimeout(() => {
          setStats({
            totalPatients: 48,
            scheduledAppointments: 12,
            activePrescriptions: 35,
            medicalRecords: 94,
          });

          setPatients([
            {
              id: "1",
              firstName: "John",
              lastName: "Doe",
              dateOfBirth: "1980-05-15",
              gender: "Male",
              updatedAt: "2025-05-10T09:30:00Z",
            },
            {
              id: "2",
              firstName: "Jane",
              lastName: "Smith",
              dateOfBirth: "1992-08-22",
              gender: "Female",
              updatedAt: "2025-05-09T14:20:00Z",
            },
            {
              id: "3",
              firstName: "Michael",
              lastName: "Johnson",
              dateOfBirth: "1975-11-03",
              gender: "Male",
              updatedAt: "2025-05-08T11:15:00Z",
            },
          ]);

          setAppointments([
            {
              id: "1",
              appointmentDate: "2025-05-13T10:30:00Z",
              status: "SCHEDULED",
              patient: {
                id: "1",
                firstName: "John",
                lastName: "Doe",
              },
              notes: "Pre-surgery consultation",
            },
            {
              id: "2",
              appointmentDate: "2025-05-14T14:00:00Z",
              status: "SCHEDULED",
              patient: {
                id: "2",
                firstName: "Jane",
                lastName: "Smith",
              },
              notes: "Follow-up appointment",
            },
          ]);

          setActivityData([
            { name: "Mon", value: 10 },
            { name: "Tue", value: 15 },
            { name: "Wed", value: 8 },
            { name: "Thu", value: 12 },
            { name: "Fri", value: 20 },
            { name: "Sat", value: 5 },
            { name: "Sun", value: 3 },
          ]);

          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="h-8 w-8 mx-auto border-4 border-t-blue-600 border-b-gray-200 border-l-gray-200 border-r-gray-200 rounded-full animate-spin"></div>
            <p className="mt-2 text-sm text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Welcome to your medical management system.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={UserGroupIcon}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Scheduled Appointments"
            value={stats.scheduledAppointments}
            icon={CalendarIcon}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Active Prescriptions"
            value={stats.activePrescriptions}
            icon={ClipboardDocumentListIcon}
            trend={{ value: 3, isPositive: false }}
          />
          <StatCard
            title="Medical Records"
            value={stats.medicalRecords}
            icon={ClipboardDocumentCheckIcon}
            trend={{ value: 8, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ActivityChart
            title="Weekly Patient Activity"
            data={activityData}
          />
          <RecentPatients patients={patients} />
        </div>

        <div>
          <UpcomingAppointments appointments={appointments} />
        </div>
      </div>
    </AuthLayout>
  );
}
