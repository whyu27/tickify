import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { LayoutDashboard, Calendar, CheckSquare, User, LogOut, Ticket } from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
    logout();
  };

  const organizerMenu = [
    { name: 'Dashboard', path: '/dashboard/organizer/home', icon: LayoutDashboard, disabled: false },
    { name: 'Verify Ticket', path: '/dashboard/organizer/verify', icon: CheckSquare, disabled: true },
    { name: 'Profile', path: '/dashboard/profile', icon: User, disabled: false },
  ];

  const participantMenu = [
    { name: 'Home', path: '/participant/home', icon: LayoutDashboard, disabled: false },
    { name: 'Browse Events', path: '/', icon: Calendar, disabled: false },
    { name: 'My Tickets', path: '/participant/tickets', icon: Ticket, disabled: false },
    { name: 'Profile', path: '/participant/profile', icon: User, disabled: false },
  ];

  const menuItems = user?.role === 'participant' ? participantMenu : organizerMenu;

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-700 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-zinc-700 gap-2">
            <span className="text-xl font-extrabold tracking-tight text-purple-600 dark:text-purple-400">
              🎟️ Tickify
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path === '/dashboard/organizer/home' && location.pathname === '/dashboard/organizer');

              if (item.disabled) {
                return (
                  <button
                    key={item.name}
                    disabled
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-gray-400 dark:text-gray-500 cursor-not-allowed text-left bg-transparent"
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </button>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 shadow-sm font-bold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-700/50 hover:text-gray-950 dark:hover:text-zinc-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer / Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-zinc-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-700 dark:hover:text-red-300 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 px-6 sm:px-8 flex items-center justify-between shadow-sm">
          {/* Dashboard Context / Title */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs font-semibold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-full uppercase tracking-wider">
              {user?.role || 'Organizer'} Mode
            </span>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-6">
            <div className="flex flex-col text-right">
              <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                {user?.name || 'Loading...'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user?.role || 'Organizer'}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 border border-gray-200 dark:border-zinc-700 px-3.5 py-1.5 rounded-xl hover:border-red-600 dark:hover:border-red-400 transition-colors bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Main Content Pane */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
