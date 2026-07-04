import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardOrganizer from '../pages/Organizer/DashboardOrganizer';
import CreateEventPage from '../pages/Organizer/CreateEventPage';
import MyEventsPage from '../pages/Organizer/MyEventsPage';
import EditEventPage from '../pages/Organizer/EditEventPage';
import PublicLayout from '../layouts/PublicLayout';
import LandingPage from '../pages/Public/LandingPage';
import EventDetailPage from '../pages/Public/EventDetailPage';
import ParticipantDashboard from '../pages/Participant/ParticipantDashboard';
import ProfilePage from '../pages/ProfilePage';

// Simple placeholders as requested
const Dashboard = () => <div>Dashboard Page (Placeholder)</div>;

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* General Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Organizer Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['organizer']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/organizer" element={<DashboardOrganizer />} />
          <Route path="/dashboard/organizer/events" element={<MyEventsPage />} />
          <Route path="/dashboard/organizer/events/create" element={<CreateEventPage />} />
          <Route path="/dashboard/organizer/events/:id/edit" element={<EditEventPage />} />
        </Route>
      </Route>

      {/* Participant Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['participant']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/participant" element={<ParticipantDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
