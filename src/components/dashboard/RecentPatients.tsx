import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate, calculateAge } from "@/lib/utils/helpers";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  updatedAt: string;
}

interface RecentPatientsProps {
  patients: Patient[];
}

export default function RecentPatients({ patients }: RecentPatientsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Recent Patients</CardTitle>
        <Link href="/patients">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {patients.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No patients yet</p>
        ) : (
          <div className="space-y-4">
            {patients.map((patient) => (
              <Link
                key={patient.id}
                href={`/patients/${patient.id}`}
                className="block"
              >
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {patient.firstName[0]}
                          {patient.lastName[0]}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {calculateAge(patient.dateOfBirth)} years • {patient.gender}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    Updated {formatDate(patient.updatedAt)}
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
