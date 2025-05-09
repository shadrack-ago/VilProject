export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  department: string;
  avatar?: string;
}

export interface Shift {
  id: string;
  name: string;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  color: string;
}

export interface ShiftTemplate {
  id: string;
  name: string;
  shifts: Shift[];
  staffRequired: number;
}

export interface ShiftAssignment {
  id: string;
  userId: string;
  shiftId: string;
  date: string; // YYYY-MM-DD format
  status: 'scheduled' | 'completed' | 'missed';
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
}