import React, { useState } from 'react';
import { Clock, Plus, Edit2, Trash2 } from 'lucide-react';
import { useShift } from '../../context/ShiftContext';
import Card, { CardHeader, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface ShiftFormData {
  name: string;
  startTime: string;
  endTime: string;
  color: string;
}

const ShiftManagement: React.FC = () => {
  const { shifts, addShift, deleteShift } = useShift();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ShiftFormData>({
    name: '',
    startTime: '',
    endTime: '',
    color: '#0D9488',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addShift(formData);
    setFormData({ name: '', startTime: '', endTime: '', color: '#0D9488' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Shift Management</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-5 w-5 mr-2" />
          Add Shift
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Add New Shift</h3>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Shift Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Morning Shift"
                required
                fullWidth
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Start Time"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                  fullWidth
                />
                <Input
                  label="End Time"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                  fullWidth
                />
              </div>
              <Input
                label="Color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                required
                fullWidth
              />
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Shift</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Current Shifts</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shifts.map((shift) => (
              <div
                key={shift.id}
                className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="h-8 w-8 rounded-full"
                    style={{ backgroundColor: shift.color }}
                  ></div>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => console.log('Edit shift:', shift.id)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteShift(shift.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <h4 className="font-medium text-lg">{shift.name}</h4>
                <div className="flex items-center text-gray-600 mt-2">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>
                    {shift.startTime} - {shift.endTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ShiftManagement;