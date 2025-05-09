import { User, Shift, ShiftTemplate, ShiftAssignment, Notification } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@vilcom.com',
    role: 'admin',
    department: 'SOC',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '2',
    name: 'Alice Analyst',
    email: 'alice@vilcom.com',
    role: 'staff',
    department: 'SOC',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '3',
    name: 'Bob Security',
    email: 'bob@vilcom.com',
    role: 'staff',
    department: 'SOC',
    avatar: 'https://images.pexels.com/photos/2379006/pexels-photo-2379006.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '4',
    name: 'Carol Engineer',
    email: 'carol@vilcom.com',
    role: 'staff',
    department: 'SOC',
    avatar: 'https://images.pexels.com/photos/2379007/pexels-photo-2379007.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
];

export const mockShifts: Shift[] = [
  {
    id: '1',
    name: 'Morning',
    startTime: '06:00',
    endTime: '14:00',
    color: '#0D9488',
  },
  {
    id: '2',
    name: 'Afternoon',
    startTime: '14:00',
    endTime: '22:00',
    color: '#4F46E5',
  },
  {
    id: '3',
    name: 'Night',
    startTime: '22:00',
    endTime: '06:00',
    color: '#7E22CE',
  },
];

export const mockShiftTemplates: ShiftTemplate[] = [
  {
    id: '1',
    name: 'Standard Rotation',
    shifts: mockShifts,
    staffRequired: 2,
  },
];

// Generate mock shift assignments for the next 14 days
export const mockShiftAssignments: ShiftAssignment[] = [];

// Helper function to get a date string in YYYY-MM-DD format
const getDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Populate mock shift assignments
const today = new Date();
const userIds = mockUsers.filter(user => user.role === 'staff').map(user => user.id);

for (let i = 0; i < 14; i++) {
  const date = new Date();
  date.setDate(today.getDate() + i);
  const dateString = getDateString(date);
  
  // Assign morning shift
  mockShiftAssignments.push({
    id: `m-${i}`,
    userId: userIds[i % userIds.length],
    shiftId: '1', // Morning shift
    date: dateString,
    status: 'scheduled',
  });
  
  // Assign afternoon shift
  mockShiftAssignments.push({
    id: `a-${i}`,
    userId: userIds[(i + 1) % userIds.length],
    shiftId: '2', // Afternoon shift
    date: dateString,
    status: 'scheduled',
  });
  
  // Assign night shift
  mockShiftAssignments.push({
    id: `n-${i}`,
    userId: userIds[(i + 2) % userIds.length],
    shiftId: '3', // Night shift
    date: dateString,
    status: 'scheduled',
  });
}

export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '2',
    message: 'You have been assigned to Morning shift on May 15, 2025',
    read: false,
    createdAt: '2025-05-10T08:00:00Z',
  },
  {
    id: '2',
    userId: '3',
    message: 'Shift swap request from Alice for Night shift on May 16, 2025',
    read: true,
    createdAt: '2025-05-09T14:30:00Z',
  },
  {
    id: '3',
    userId: '4',
    message: 'New shift template has been created',
    read: false,
    createdAt: '2025-05-08T11:45:00Z',
  },
];