import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Shift, ShiftTemplate, ShiftAssignment } from '../types';
import { mockShifts, mockShiftTemplates, mockShiftAssignments } from '../data/mockData';

interface ShiftContextType {
  shifts: Shift[];
  shiftTemplates: ShiftTemplate[];
  shiftAssignments: ShiftAssignment[];
  addShift: (shift: Omit<Shift, 'id'>) => void;
  updateShift: (shift: Shift) => void;
  deleteShift: (id: string) => void;
  addShiftTemplate: (template: Omit<ShiftTemplate, 'id'>) => void;
  updateShiftTemplate: (template: ShiftTemplate) => void;
  deleteShiftTemplate: (id: string) => void;
  generateShiftAssignments: (templateId: string, startDate: string, days: number) => void;
  getShiftById: (id: string) => Shift | undefined;
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export const ShiftProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [shifts, setShifts] = useState<Shift[]>(mockShifts);
  const [shiftTemplates, setShiftTemplates] = useState<ShiftTemplate[]>(mockShiftTemplates);
  const [shiftAssignments, setShiftAssignments] = useState<ShiftAssignment[]>(mockShiftAssignments);

  const addShift = (shift: Omit<Shift, 'id'>) => {
    const newShift = {
      ...shift,
      id: Math.random().toString(36).substring(2, 9),
    };
    setShifts([...shifts, newShift]);
  };

  const updateShift = (shift: Shift) => {
    setShifts(shifts.map((s) => (s.id === shift.id ? shift : s)));
  };

  const deleteShift = (id: string) => {
    setShifts(shifts.filter((s) => s.id !== id));
  };

  const addShiftTemplate = (template: Omit<ShiftTemplate, 'id'>) => {
    const newTemplate = {
      ...template,
      id: Math.random().toString(36).substring(2, 9),
    };
    setShiftTemplates([...shiftTemplates, newTemplate]);
  };

  const updateShiftTemplate = (template: ShiftTemplate) => {
    setShiftTemplates(shiftTemplates.map((t) => (t.id === template.id ? template : t)));
  };

  const deleteShiftTemplate = (id: string) => {
    setShiftTemplates(shiftTemplates.filter((t) => t.id !== id));
  };

  const getShiftById = (id: string): Shift | undefined => {
    return shifts.find(s => s.id === id);
  };

  // Generate shift assignments based on a template, starting date, and number of days
  const generateShiftAssignments = (templateId: string, startDate: string, days: number) => {
    const template = shiftTemplates.find((t) => t.id === templateId);
    if (!template) return;

    const newAssignments: ShiftAssignment[] = [];
    const staffIds = ['2', '3', '4']; // In a real app, this would be fetched from the API
    
    const startDateObj = new Date(startDate);
    
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDateObj);
      currentDate.setDate(startDateObj.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];
      
      template.shifts.forEach((shift, shiftIndex) => {
        // Simple rotation algorithm - in a real app this would be more sophisticated
        // based on availability, fairness, compliance rules, etc.
        for (let j = 0; j < template.staffRequired; j++) {
          const staffIndex = (i + shiftIndex + j) % staffIds.length;
          
          newAssignments.push({
            id: `${dateString}-${shift.id}-${staffIds[staffIndex]}`,
            userId: staffIds[staffIndex],
            shiftId: shift.id,
            date: dateString,
            status: 'scheduled',
          });
        }
      });
    }
    
    // In a real app, we would make an API call to save these assignments
    // For demo purposes, we'll just update our state
    setShiftAssignments([...shiftAssignments, ...newAssignments]);
  };

  return (
    <ShiftContext.Provider
      value={{
        shifts,
        shiftTemplates,
        shiftAssignments,
        addShift,
        updateShift,
        deleteShift,
        addShiftTemplate,
        updateShiftTemplate,
        deleteShiftTemplate,
        generateShiftAssignments,
        getShiftById,
      }}
    >
      {children}
    </ShiftContext.Provider>
  );
};

export const useShift = (): ShiftContextType => {
  const context = useContext(ShiftContext);
  if (context === undefined) {
    throw new Error('useShift must be used within a ShiftProvider');
  }
  return context;
};