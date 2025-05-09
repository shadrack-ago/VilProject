import React, { useState } from 'react';
import { useShift } from '../../context/ShiftContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Card, { CardHeader, CardBody, CardFooter } from '../ui/Card';

interface GenerateScheduleFormProps {
  onClose: () => void;
}

const GenerateScheduleForm: React.FC<GenerateScheduleFormProps> = ({ onClose }) => {
  const { shiftTemplates, generateShiftAssignments } = useShift();
  
  const [templateId, setTemplateId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [days, setDays] = useState('14');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    generateShiftAssignments(templateId, startDate, parseInt(days, 10));
    onClose();
  };
  
  // Today's date in YYYY-MM-DD format for the date input
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const templateOptions = shiftTemplates.map(template => ({
    value: template.id,
    label: template.name,
  }));
  
  const periodOptions = [
    { value: '7', label: '1 Week' },
    { value: '14', label: '2 Weeks' },
    { value: '28', label: '4 Weeks' },
  ];
  
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Generate Schedule</h3>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit}>
          <Select
            label="Shift Template"
            options={templateOptions}
            value={templateId}
            onChange={setTemplateId}
            required
            fullWidth
          />
          
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            min={getTodayString()}
            onChange={(e) => setStartDate(e.target.value)}
            required
            fullWidth
          />
          
          <Select
            label="Period"
            options={periodOptions}
            value={days}
            onChange={setDays}
            required
            fullWidth
          />
        </form>
      </CardBody>
      <CardFooter className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!templateId || !startDate}
        >
          Generate Schedule
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GenerateScheduleForm;