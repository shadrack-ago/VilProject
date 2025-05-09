import React from 'react';
import { Users, Calendar, Clock, Bell } from 'lucide-react';
import { useShift } from '../../context/ShiftContext';
import { mockUsers } from '../../data/mockData';
import StatsCard from './StatsCard';
import ShiftCalendar from '../shifts/ShiftCalendar';
import ShiftTemplateList from '../shifts/ShiftTemplateList';

const AdminDashboard: React.FC = () => {
  const { shifts, shiftAssignments, shiftTemplates } = useShift();
  
  // Calculate users with shifts today
  const getTodayAssignments = () => {
    const today = new Date().toISOString().split('T')[0];
    return shiftAssignments.filter(a => a.date === today);
  };
  
  // Calculate total staff
  const totalStaff = mockUsers.filter(user => user.role === 'staff').length;
  
  // Calculate assignments for the current week
  const getCurrentWeekAssignments = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return shiftAssignments.filter(a => {
      const assignmentDate = new Date(a.date);
      return assignmentDate >= startOfWeek && assignmentDate <= endOfWeek;
    });
  };
  
  const todayAssignments = getTodayAssignments();
  const weeklyAssignments = getCurrentWeekAssignments();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Manage your SOC team's shift rotation</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Staff"
          value={totalStaff}
          icon={<Users className="h-6 w-6 text-blue-600" />}
          description="Active security analysts"
        />
        <StatsCard
          title="Shifts Today"
          value={todayAssignments.length}
          icon={<Clock className="h-6 w-6 text-blue-600" />}
          description="Scheduled for today"
        />
        <StatsCard
          title="Total Shifts"
          value={shifts.length}
          icon={<Calendar className="h-6 w-6 text-blue-600" />}
          description="Active shift definitions"
        />
        <StatsCard
          title="Weekly Coverage"
          value={`${weeklyAssignments.length} shifts`}
          icon={<Bell className="h-6 w-6 text-blue-600" />}
          change={{ value: "3%", isPositive: true }}
          description="From last week"
        />
      </div>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Shifts</h2>
          <ShiftCalendar viewMode="week" />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Shift Templates</h2>
          <ShiftTemplateList />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;