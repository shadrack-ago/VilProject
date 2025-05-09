import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useShift } from '../../context/ShiftContext';
import { useAuth } from '../../context/AuthContext';
import { Shift, ShiftAssignment, User } from '../../types';
import { mockUsers } from '../../data/mockData';
import Card, { CardHeader, CardBody } from '../ui/Card';
import Button from '../ui/Button';

interface ShiftCalendarProps {
  viewMode?: 'month' | 'week';
}

const ShiftCalendar: React.FC<ShiftCalendarProps> = ({ viewMode = 'week' }) => {
  const { shiftAssignments, shifts, getShiftById } = useShift();
  const { currentUser } = useAuth();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Calculate the start and end dates for the current view (week or month)
  const getDateRange = () => {
    const rangeStart = new Date(currentDate);
    const rangeEnd = new Date(currentDate);
    
    if (viewMode === 'week') {
      // Set to the start of the week (Sunday)
      const day = currentDate.getDay();
      rangeStart.setDate(currentDate.getDate() - day);
      
      // Set to the end of the week (Saturday)
      rangeEnd.setDate(rangeStart.getDate() + 6);
    } else {
      // Set to the first day of the month
      rangeStart.setDate(1);
      
      // Set to the last day of the month
      rangeEnd.setMonth(rangeEnd.getMonth() + 1);
      rangeEnd.setDate(0);
    }
    
    return { rangeStart, rangeEnd };
  };
  
  const { rangeStart, rangeEnd } = getDateRange();
  
  // Generate an array of dates for the current view
  const getDatesInRange = () => {
    const dates = [];
    const currentDate = new Date(rangeStart);
    
    while (currentDate <= rangeEnd) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };
  
  const datesInRange = getDatesInRange();
  
  // Navigate to the previous/next period
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };
  
  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };
  
  // Get assignments for a specific date and shift
  const getAssignmentsForDateAndShift = (date: Date, shiftId: string) => {
    const dateString = date.toISOString().split('T')[0];
    return shiftAssignments.filter(
      (assignment) => assignment.date === dateString && assignment.shiftId === shiftId
    );
  };
  
  // Format the header based on the view mode
  const formatHeaderText = () => {
    if (viewMode === 'week') {
      const startMonth = rangeStart.toLocaleDateString('en-US', { month: 'short' });
      const endMonth = rangeEnd.toLocaleDateString('en-US', { month: 'short' });
      
      if (startMonth === endMonth) {
        return `${startMonth} ${rangeStart.getDate()} - ${rangeEnd.getDate()}, ${rangeStart.getFullYear()}`;
      } else {
        return `${startMonth} ${rangeStart.getDate()} - ${endMonth} ${rangeEnd.getDate()}, ${rangeStart.getFullYear()}`;
      }
    } else {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  };
  
  // Find user by ID (in a real app, this would be more efficient)
  const findUserById = (userId: string): User | undefined => {
    return mockUsers.find(user => user.id === userId);
  };
  
  // Get the classes for a date cell based on whether it's today, etc.
  const getDateCellClasses = (date: Date) => {
    const today = new Date();
    const isToday = date.getDate() === today.getDate() && 
                   date.getMonth() === today.getMonth() &&
                   date.getFullYear() === today.getFullYear();
    
    return `text-center py-2 ${
      isToday ? 'bg-blue-100 font-semibold' : 
      date.getMonth() !== currentDate.getMonth() ? 'text-gray-400' : ''
    }`;
  };
  
  // Show only assignments for the current user if they're not an admin
  const filterAssignmentsByUser = (assignments: ShiftAssignment[]) => {
    if (currentUser?.role === 'admin') {
      return assignments;
    }
    return assignments.filter(a => a.userId === currentUser?.id);
  };
  
  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={navigatePrevious}
          >
            <ChevronLeft size={16} />
          </Button>
          <h2 className="text-lg font-semibold mx-4">
            {formatHeaderText()}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={navigateNext}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardBody className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="w-24 px-4 py-2 text-left text-sm font-medium text-gray-500">
                Shift
              </th>
              {datesInRange.map((date, index) => (
                <th key={index} className={getDateCellClasses(date)}>
                  <div className="text-xs text-gray-500">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="font-medium">
                    {date.getDate()}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {shifts.map((shift) => (
              <tr key={shift.id}>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <div className="flex items-center">
                    <div
                      className="h-4 w-4 rounded-full mr-2"
                      style={{ backgroundColor: shift.color }}
                    ></div>
                    <div>
                      <div className="font-medium">{shift.name}</div>
                      <div className="text-xs text-gray-500">
                        {shift.startTime} - {shift.endTime}
                      </div>
                    </div>
                  </div>
                </td>
                {datesInRange.map((date, index) => {
                  const assignments = getAssignmentsForDateAndShift(date, shift.id);
                  const filteredAssignments = filterAssignmentsByUser(assignments);
                  
                  return (
                    <td key={index} className="px-1 py-2 text-sm">
                      <div className="space-y-1">
                        {filteredAssignments.map((assignment) => {
                          const user = findUserById(assignment.userId);
                          return (
                            <div 
                              key={assignment.id}
                              className="p-1 rounded text-xs"
                              style={{ 
                                backgroundColor: `${shift.color}30`,
                                borderLeft: `3px solid ${shift.color}`
                              }}
                            >
                              <div className="font-medium truncate max-w-[100px]">
                                {user?.name || 'Unknown'}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
};

export default ShiftCalendar;