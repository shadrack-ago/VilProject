import React from 'react';
import { useShift } from '../../context/ShiftContext';
import { ShiftAssignment } from '../../types';

interface UpcomingShiftsProps {
  shifts: ShiftAssignment[];
}

const UpcomingShifts: React.FC<UpcomingShiftsProps> = ({ shifts }) => {
  const { getShiftById } = useShift();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  if (shifts.length === 0) {
    return (
      <div className="py-4 text-center text-gray-500">
        No upcoming shifts scheduled
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {shifts.map((assignment) => {
        const shift = getShiftById(assignment.shiftId);
        
        if (!shift) return null;
        
        return (
          <div 
            key={assignment.id} 
            className="p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <div 
                className="h-10 w-10 rounded-md flex items-center justify-center mr-3"
                style={{ backgroundColor: `${shift.color}20` }}
              >
                <div 
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: shift.color }}
                ></div>
              </div>
              <div>
                <div className="font-medium">{shift.name} Shift</div>
                <div className="text-sm text-gray-500">
                  {formatDate(assignment.date)} • {shift.startTime} - {shift.endTime}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UpcomingShifts;