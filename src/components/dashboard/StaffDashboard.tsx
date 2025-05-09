import React from 'react';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';
import { useShift } from '../../context/ShiftContext';
import { useAuth } from '../../context/AuthContext';
import StatsCard from './StatsCard';
import ShiftCalendar from '../shifts/ShiftCalendar';
import UpcomingShifts from '../shifts/UpcomingShifts';
import Card, { CardHeader, CardBody } from '../ui/Card';

const StaffDashboard: React.FC = () => {
  const { shiftAssignments } = useShift();
  const { currentUser } = useAuth();
  
  // Calculate upcoming shifts for the current user
  const getUserShifts = () => {
    if (!currentUser) return [];
    return shiftAssignments.filter(a => a.userId === currentUser.id);
  };
  
  const getUpcomingShifts = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    return getUserShifts().filter(a => a.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date));
  };
  
  const getNextShift = () => {
    const upcoming = getUpcomingShifts();
    return upcoming.length > 0 ? upcoming[0] : null;
  };
  
  const getTotalShiftsThisMonth = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    return getUserShifts().filter(a => {
      const date = new Date(a.date);
      return date >= startOfMonth && date <= endOfMonth;
    }).length;
  };
  
  const userShifts = getUserShifts();
  const upcomingShifts = getUpcomingShifts();
  const nextShift = getNextShift();
  const totalShiftsThisMonth = getTotalShiftsThisMonth();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-500">View your upcoming shifts and schedule</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Next Shift"
          value={nextShift ? new Date(nextShift.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'None'}
          icon={<Clock className="h-6 w-6 text-blue-600" />}
          description={nextShift ? "Coming up soon" : "No upcoming shifts"}
        />
        <StatsCard
          title="Monthly Shifts"
          value={totalShiftsThisMonth}
          icon={<Calendar className="h-6 w-6 text-blue-600" />}
          description="Scheduled this month"
        />
        <StatsCard
          title="Pending Swaps"
          value="0"
          icon={<AlertTriangle className="h-6 w-6 text-yellow-500" />}
          description="No pending requests"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Schedule</h2>
          <ShiftCalendar viewMode="week" />
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Upcoming Shifts</h2>
            </CardHeader>
            <CardBody>
              <UpcomingShifts shifts={upcomingShifts.slice(0, 5)} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;