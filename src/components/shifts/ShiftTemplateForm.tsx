import React, { useState, useEffect } from 'react';
import { useShift } from '../../context/ShiftContext';
import { ShiftTemplate } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

interface ShiftTemplateFormProps {
  templateId: string | null; // If provided, we're editing an existing template
  onClose: () => void;
}

const ShiftTemplateForm: React.FC<ShiftTemplateFormProps> = ({ templateId, onClose }) => {
  const { shifts, shiftTemplates, addShiftTemplate, updateShiftTemplate } = useShift();
  
  const [name, setName] = useState('');
  const [staffRequired, setStaffRequired] = useState('1');
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);
  
  // Load existing template data if editing
  useEffect(() => {
    if (templateId) {
      const template = shiftTemplates.find(t => t.id === templateId);
      if (template) {
        setName(template.name);
        setStaffRequired(template.staffRequired.toString());
        setSelectedShifts(template.shifts.map(s => s.id));
      }
    }
  }, [templateId, shiftTemplates]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const shiftObjects = shifts.filter(shift => selectedShifts.includes(shift.id));
    
    const templateData: Omit<ShiftTemplate, 'id'> = {
      name,
      staffRequired: parseInt(staffRequired, 10),
      shifts: shiftObjects,
    };
    
    if (templateId) {
      updateShiftTemplate({
        ...templateData,
        id: templateId,
      });
    } else {
      addShiftTemplate(templateData);
    }
    
    onClose();
  };
  
  const handleShiftToggle = (shiftId: string) => {
    setSelectedShifts(prev => {
      if (prev.includes(shiftId)) {
        return prev.filter(id => id !== shiftId);
      } else {
        return [...prev, shiftId];
      }
    });
  };
  
  const staffOptions = Array.from({ length: 5 }, (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString(),
  }));
  
  return (
    <div className="border border-gray-200 rounded-md p-4">
      <h3 className="font-medium text-lg mb-4">
        {templateId ? 'Edit Template' : 'Create Template'}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <Input
          label="Template Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Standard Rotation"
          required
          fullWidth
        />
        
        <Select
          label="Staff Required per Shift"
          options={staffOptions}
          value={staffRequired}
          onChange={setStaffRequired}
          required
          fullWidth
        />
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Include Shifts
          </label>
          <div className="space-y-2">
            {shifts.map((shift) => (
              <div key={shift.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`shift-${shift.id}`}
                  checked={selectedShifts.includes(shift.id)}
                  onChange={() => handleShiftToggle(shift.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label 
                  htmlFor={`shift-${shift.id}`} 
                  className="ml-2 flex items-center"
                >
                  <div 
                    className="h-3 w-3 rounded-full mr-2"
                    style={{ backgroundColor: shift.color }}
                  ></div>
                  <span className="text-sm">
                    {shift.name} ({shift.startTime} - {shift.endTime})
                  </span>
                </label>
              </div>
            ))}
          </div>
          {selectedShifts.length === 0 && (
            <p className="text-red-500 text-xs mt-1">
              Please select at least one shift
            </p>
          )}
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={name === '' || selectedShifts.length === 0}
          >
            {templateId ? 'Update Template' : 'Create Template'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ShiftTemplateForm;