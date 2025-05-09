import React from 'react';
import ShiftCalendar from '../shifts/ShiftCalendar';
import Card, { CardHeader, CardBody } from '../ui/Card';

const Schedule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
        <p className="text-gray-500">View and manage shift schedules</p>
      </div>
      
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Shift Calendar</h2>
        </CardHeader>
        <CardBody>
          <ShiftCalendar viewMode="month" />
        </CardBody>
      </Card>
    </div>
  );
};

export default Schedule;