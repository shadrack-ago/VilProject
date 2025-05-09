import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useShift } from '../../context/ShiftContext';
import Card, { CardHeader, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import ShiftTemplateForm from './ShiftTemplateForm';

const ShiftTemplateList: React.FC = () => {
  const { shiftTemplates, deleteShiftTemplate } = useShift();
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  
  const handleEdit = (templateId: string) => {
    setEditingTemplate(templateId);
    setShowForm(true);
  };
  
  const handleDelete = (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      deleteShiftTemplate(templateId);
    }
  };
  
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTemplate(null);
  };
  
  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Shift Templates</h3>
        <Button
          size="sm"
          onClick={() => {
            setEditingTemplate(null);
            setShowForm(true);
          }}
        >
          <Plus size={16} className="mr-1" /> New Template
        </Button>
      </CardHeader>
      <CardBody>
        {showForm ? (
          <ShiftTemplateForm
            templateId={editingTemplate}
            onClose={handleCloseForm}
          />
        ) : (
          <>
            {shiftTemplates.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                No templates created yet. Create your first template to start scheduling shifts.
              </div>
            ) : (
              <div className="space-y-4">
                {shiftTemplates.map((template) => (
                  <div 
                    key={template.id}
                    className="border border-gray-200 rounded-md p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-lg">{template.name}</h4>
                        <p className="text-sm text-gray-500">
                          Requires {template.staffRequired} staff per shift
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(template.id)}
                        >
                          <Edit size={14} className="mr-1" /> Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(template.id)}
                        >
                          <Trash2 size={14} className="mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {template.shifts.map((shift) => (
                        <div 
                          key={shift.id}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: `${shift.color}20`,
                            color: shift.color,
                            borderLeft: `2px solid ${shift.color}`
                          }}
                        >
                          {shift.name}: {shift.startTime} - {shift.endTime}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // In a real app, this would open the generation dialog
                          alert('Generation feature would be triggered here');
                        }}
                      >
                        Generate Schedule
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default ShiftTemplateList;