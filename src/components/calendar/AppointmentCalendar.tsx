"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { Calendar, momentLocalizer, Views, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, ClockIcon, UserIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

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

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: CalendarAppointment;
}

interface AppointmentCalendarProps {
  appointments: CalendarAppointment[];
  onAppointmentClick?: (appointment: CalendarAppointment) => void;
  onSlotSelect?: (slotInfo: { start: Date; end: Date }) => void;
  loading?: boolean;
}

export default function AppointmentCalendar({
  appointments,
  onAppointmentClick,
  onSlotSelect,
  loading = false
}: AppointmentCalendarProps) {
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarAppointment | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);

  // Convert appointments to calendar events
  const events: CalendarEvent[] = useMemo(() => {
    return appointments.map(appointment => {
      const start = new Date(appointment.appointmentDate);
      const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration

      return {
        id: appointment.id,
        title: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
        start,
        end,
        resource: appointment,
      };
    });
  }, [appointments]);

  // Event style getter for different appointment statuses
  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const status = event.resource.status;
    let backgroundColor = '#3174ad';
    let borderColor = '#3174ad';

    switch (status) {
      case 'SCHEDULED':
        backgroundColor = '#2563eb';
        borderColor = '#1d4ed8';
        break;
      case 'COMPLETED':
        backgroundColor = '#16a34a';
        borderColor = '#15803d';
        break;
      case 'CANCELLED':
        backgroundColor = '#dc2626';
        borderColor = '#b91c1c';
        break;
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        color: 'white',
        border: `1px solid ${borderColor}`,
        borderRadius: '4px',
        fontSize: '12px',
      },
    };
  }, []);

  // Handle event selection
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event.resource);
    setShowEventDialog(true);
    onAppointmentClick?.(event.resource);
  }, [onAppointmentClick]);

  // Handle slot selection for creating new appointments
  const handleSelectSlot = useCallback((slotInfo: { start: Date; end: Date }) => {
    onSlotSelect?.(slotInfo);
  }, [onSlotSelect]);

  // Custom toolbar component
  const CustomToolbar = ({ label, onNavigate, onView }: any) => (
    <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('PREV')}
        >
          ←
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('TODAY')}
        >
          Today
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('NEXT')}
        >
          →
        </Button>
      </div>
      
      <h3 className="text-lg font-semibold">{label}</h3>
      
      <div className="flex items-center gap-2">
        <Button
          variant={view === Views.MONTH ? "default" : "outline"}
          size="sm"
          onClick={() => onView(Views.MONTH)}
        >
          Month
        </Button>
        <Button
          variant={view === Views.WEEK ? "default" : "outline"}
          size="sm"
          onClick={() => onView(Views.WEEK)}
        >
          Week
        </Button>
        <Button
          variant={view === Views.DAY ? "default" : "outline"}
          size="sm"
          onClick={() => onView(Views.DAY)}
        >
          Day
        </Button>
      </div>
    </div>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading calendar...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Appointment Calendar
            </CardTitle>
            <Link href="/appointments/new">
              <Button size="sm">
                <PlusIcon className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ height: '600px' }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              eventPropGetter={eventStyleGetter}
              components={{
                toolbar: CustomToolbar,
              }}
              formats={{
                eventTimeRangeFormat: ({ start, end }) => 
                  `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
                dayHeaderFormat: (date) => moment(date).format('ddd DD/MM'),
                monthHeaderFormat: (date) => moment(date).format('MMMM YYYY'),
              }}
              step={30}
              timeslots={2}
              defaultView={Views.MONTH}
              views={[Views.MONTH, Views.WEEK, Views.DAY]}
            />
          </div>
          
          {/* Legend */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Legend:</h4>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span className="text-sm">Scheduled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-600 rounded"></div>
                <span className="text-sm">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-600 rounded"></div>
                <span className="text-sm">Cancelled</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Details Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-gray-500" />
                <span className="font-medium">
                  {selectedEvent.patient.firstName} {selectedEvent.patient.lastName}
                </span>
                <Badge className={getStatusColor(selectedEvent.status)}>
                  {selectedEvent.status}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-gray-500" />
                <span>
                  {moment(selectedEvent.appointmentDate).format('MMMM Do YYYY, h:mm A')}
                </span>
              </div>
              
              {selectedEvent.notes && (
                <div>
                  <h4 className="font-medium mb-1">Notes:</h4>
                  <p className="text-sm text-gray-600">{selectedEvent.notes}</p>
                </div>
              )}
              
              {selectedEvent.googleCalendarEventId && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Synced with Google Calendar</span>
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                <Link href={`/appointments/${selectedEvent.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
                <Link href={`/patients/${selectedEvent.patient.id}`}>
                  <Button variant="outline" size="sm">
                    View Patient
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
