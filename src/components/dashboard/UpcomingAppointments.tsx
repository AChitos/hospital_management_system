import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils/helpers";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
}

interface Appointment {
  id: string;
  appointmentDate: string;
  status: string;
  patient: Patient;
  notes?: string;
}

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  isLoading?: boolean;
}

export default function UpcomingAppointments({ appointments, isLoading = false }: UpcomingAppointmentsProps) {
  // Status badge styling
  const statusStyles: Record<string, string> = {
    SCHEDULED: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-white border-b pb-4">
        <CardTitle className="text-lg font-semibold text-gray-800">Upcoming Appointments</CardTitle>
        <Link href="/appointments">
          <Button variant="outline" size="sm" className="hover:bg-blue-50 transition-colors">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border-b last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-6 bg-gray-100 rounded-full w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No upcoming appointments</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Link
                key={appointment.id}
                href={`/appointments/${appointment.id}`}
                className="block"
              >
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex flex-col space-y-1">
                    <p className="font-medium">
                      {appointment.patient.firstName} {appointment.patient.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDateTime(appointment.appointmentDate)}
                    </p>
                    {appointment.notes && (
                      <p className="text-xs text-gray-500 max-w-xs truncate">
                        {appointment.notes}
                      </p>
                    )}
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusStyles[appointment.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
