"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthLayout from '@/components/layouts/AuthLayout';
import AppointmentCalendar from '@/components/calendar/AppointmentCalendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  CalendarIcon, 
  CloudArrowDownIcon, 
  LinkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { api } from '@/lib/utils/apiClient';
import Link from 'next/link';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
}

interface CalendarAppointment {
  id: string;
  appointmentDate: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  patient: Patient;
  googleCalendarEventId?: string;
}

export default function CalendarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [appointments, setAppointments] = useState<CalendarAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [isConnectedToGoogle, setIsConnectedToGoogle] = useState(false);
  const [syncingAppointment, setSyncingAppointment] = useState<string | null>(null);

  // Check for setup status from URL params
  useEffect(() => {
    const setup = searchParams.get('setup');
    const setupError = searchParams.get('error');

    if (setup === 'success') {
      setIsConnectedToGoogle(true);
      // Show success message
    } else if (setupError === 'setup_failed') {
      setError('Failed to connect Google Calendar. Please try again.');
    }
  }, [searchParams]);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get<CalendarAppointment[]>('/api/appointments');
        
        if (response.error) {
          setError(response.error);
          setLoading(false);
          return;
        }
        
        if (response.data) {
          setAppointments(response.data);
          // Check if any appointments are synced with Google Calendar
          const hasSyncedAppointments = response.data.some(apt => apt.googleCalendarEventId);
          setIsConnectedToGoogle(hasSyncedAppointments);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Failed to load appointments');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Handle Google Calendar connection
  const handleConnectGoogleCalendar = async () => {
    try {
      const response = await api.get<{ authUrl: string }>('/api/auth/google/calendar');
      
      if (response.error) {
        setError('Failed to get Google Calendar authorization URL');
        return;
      }
      
      if (response.data?.authUrl) {
        // Redirect to Google OAuth
        window.location.href = response.data.authUrl;
      }
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
      setError('Failed to connect to Google Calendar');
    }
  };

  // Handle appointment sync with Google Calendar
  const handleSyncAppointment = async (appointmentId: string) => {
    setSyncingAppointment(appointmentId);
    
    try {
      const response = await api.post<{ eventId: string }>('/api/calendar/sync', { appointmentId });
      
      if (response.error) {
        setError(`Failed to sync appointment: ${response.error}`);
        return;
      }
      
      // Update appointment in local state
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, googleCalendarEventId: response.data?.eventId }
            : apt
        )
      );
      
    } catch (error) {
      console.error('Error syncing appointment:', error);
      setError('Failed to sync appointment with Google Calendar');
    } finally {
      setSyncingAppointment(null);
    }
  };

  // Handle ICS export
  const handleExportCalendar = async (filters?: { status?: string; startDate?: string; endDate?: string }) => {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.set('status', filters.status);
      if (filters?.startDate) params.set('startDate', filters.startDate);
      if (filters?.endDate) params.set('endDate', filters.endDate);

      const url = `/api/calendar/export?${params.toString()}`;
      
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = url;
      link.download = 'appointments.ics';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error exporting calendar:', error);
      setError('Failed to export calendar');
    }
  };

  // Handle slot selection for new appointment
  const handleSlotSelect = (slotInfo: { start: Date; end: Date }) => {
    const startDate = slotInfo.start.toISOString().split('T')[0];
    const startTime = slotInfo.start.toTimeString().split(' ')[0].slice(0, 5);
    
    router.push(`/appointments/new?date=${startDate}&time=${startTime}`);
  };

  // Handle appointment click
  const handleAppointmentClick = (appointment: CalendarAppointment) => {
    router.push(`/appointments/${appointment.id}`);
  };

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Calendar View</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleExportCalendar()}
            >
              <CloudArrowDownIcon className="h-4 w-4 mr-2" />
              Export ICS
            </Button>
            {!isConnectedToGoogle && (
              <Button onClick={handleConnectGoogleCalendar}>
                <LinkIcon className="h-4 w-4 mr-2" />
                Connect Google Calendar
              </Button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Google Calendar Integration Status */}
        {isConnectedToGoogle && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircleIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Connected to Google Calendar</span>
                <span className="text-xs text-gray-500">
                  • New appointments can be automatically synced
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <CalendarIcon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-medium mb-1">Total Appointments</h3>
                <p className="text-2xl font-bold">{appointments.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="h-8 w-8 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">S</span>
                </div>
                <h3 className="font-medium mb-1">Scheduled</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {appointments.filter(apt => apt.status === 'SCHEDULED').length}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="h-8 w-8 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">C</span>
                </div>
                <h3 className="font-medium mb-1">Completed</h3>
                <p className="text-2xl font-bold text-green-600">
                  {appointments.filter(apt => apt.status === 'COMPLETED').length}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <LinkIcon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-medium mb-1">Synced</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {appointments.filter(apt => apt.googleCalendarEventId).length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Component */}
        <AppointmentCalendar
          appointments={appointments}
          onAppointmentClick={handleAppointmentClick}
          onSlotSelect={handleSlotSelect}
          loading={loading}
        />

        {/* Export Options Dialog */}
        <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Export Calendar</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Export your appointments as an ICS file to import into other calendar applications.
              </p>
              
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    handleExportCalendar();
                    setShowSetupDialog(false);
                  }}
                >
                  Export All Appointments
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    handleExportCalendar({ status: 'SCHEDULED' });
                    setShowSetupDialog(false);
                  }}
                >
                  Export Scheduled Only
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const startDate = new Date().toISOString().split('T')[0];
                    handleExportCalendar({ startDate });
                    setShowSetupDialog(false);
                  }}
                >
                  Export From Today
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Sync Status */}
        {syncingAppointment && (
          <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span className="text-sm">Syncing with Google Calendar...</span>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
