import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Menu, X, Calendar, Users, UserCircle, Bell, LogOut, Home } from 'lucide-react';

interface NavItem {
  name: string;
  icon: React.ReactNode;
  path: string;
}

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      icon: <Home className="h-5 w-5" />,
      path: '/',
    },
    {
      name: 'Schedule',
      icon: <Calendar className="h-5 w-5" />,
      path: '/schedule',
    },
  ];

  if (currentUser?.role === 'admin') {
    navItems.push(
      {
        name: 'Staff',
        icon: <Users className="h-5 w-5" />,
        path: '/staff',
      }
    );
  }

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-blue-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <ShieldCheck className="h-8 w-8 text-teal-400" />
            <span className="ml-2 text-xl font-bold">Vilcom SOC</span>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className="flex items-center px-3 py-2 text-sm font-medium text-white hover:bg-blue-800 rounded-md transition duration-150 ease-in-out"
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </button>
            ))}
            <div className="ml-4 flex items-center">
              <button
                className="ml-4 relative rounded-full bg-blue-800 p-1 hover:bg-blue-700 transition"
                onClick={() => console.log('Show notifications')}
              >
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-blue-800"></span>
              </button>
              <div className="ml-4 flex items-center">
                <button
                  className="flex items-center text-sm font-medium text-white hover:text-gray-200"
                  onClick={() => console.log('Show profile')}
                >
                  <span className="mr-2">{currentUser?.name}</span>
                  <img
                    className="h-8 w-8 rounded-full"
                    src={currentUser?.avatar || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                    alt={currentUser?.name}
                  />
                </button>
              </div>
              <button
                className="ml-4 flex items-center text-sm font-medium text-white hover:text-gray-200"
                onClick={logout}
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-800 focus:outline-none transition duration-150 ease-in-out"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className="flex items-center px-3 py-2 w-full text-left text-sm font-medium text-white hover:bg-blue-800"
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </button>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-blue-800">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src={currentUser?.avatar || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                  alt={currentUser?.name}
                />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">{currentUser?.name}</div>
                <div className="text-sm font-medium text-gray-300">{currentUser?.email}</div>
              </div>
              <button
                className="ml-auto flex-shrink-0 p-1 rounded-full text-white hover:bg-blue-800 focus:outline-none transition duration-150 ease-in-out"
                onClick={() => console.log('Show notifications')}
              >
                <Bell className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-3 space-y-1 px-2">
              <button
                onClick={() => console.log('View profile')}
                className="flex items-center px-3 py-2 w-full text-left rounded-md text-sm font-medium text-white hover:bg-blue-800"
              >
                <UserCircle className="h-5 w-5 mr-2" />
                Your Profile
              </button>
              <button
                onClick={logout}
                className="flex items-center px-3 py-2 w-full text-left rounded-md text-sm font-medium text-white hover:bg-blue-800"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;