import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Mail } from 'lucide-react';
import Card, { CardHeader, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { supabase } from '../../lib/supabase';
import { User } from '../../types';

const StaffManagement: React.FC = () => {
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [staffList, setStaffList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'staff');

      if (error) throw error;
      setStaffList(data || []);
    } catch (err) {
      console.error('Error fetching staff:', err);
      setError('Failed to load staff members');
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Generate a random password
      const tempPassword = Math.random().toString(36).slice(-8);

      // First, insert into users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            name: newStaff.name,
            email: newStaff.email,
            role: 'staff',
            department: 'NOC',
          }
        ])
        .select()
        .single();

      if (userError) throw userError;

      // Then create auth user
      const { error: authError } = await supabase.auth.admin.createUser({
        email: newStaff.email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          name: newStaff.name,
          role: 'staff',
        }
      });

      if (authError) {
        // Rollback user creation if auth fails
        await supabase
          .from('users')
          .delete()
          .eq('id', userData.id);
        throw authError;
      }

      setNewStaff({ name: '', email: '' });
      setShowAddStaff(false);
      fetchStaff();
    } catch (err) {
      console.error('Error adding staff:', err);
      setError('Failed to add staff member. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) {
      return;
    }

    try {
      // Delete from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(id);
      if (authError) throw authError;

      // Delete from users table
      const { error: userError } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      if (userError) throw userError;

      fetchStaff();
    } catch (err) {
      console.error('Error deleting staff:', err);
      setError('Failed to delete staff member');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
        <Button onClick={() => setShowAddStaff(true)}>
          <UserPlus className="h-5 w-5 mr-2" />
          Add Staff
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showAddStaff && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Add New Staff</h3>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <Input
                label="Name"
                value={newStaff.name}
                onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                required
                fullWidth
              />
              <Input
                label="Email"
                type="email"
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                required
                fullWidth
              />
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddStaff(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Adding...' : 'Add Staff'}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">NOC Staff List</h3>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staffList.map((staff) => (
                  <tr key={staff.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-8 w-8 rounded-full"
                          src={staff.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg'}
                          alt={staff.name}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {staff.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-4 w-4 mr-2" />
                        {staff.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteStaff(staff.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default StaffManagement;