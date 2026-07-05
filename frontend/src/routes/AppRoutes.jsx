import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardOrganizer from '../pages/Organizer/DashboardOrganizer';
import OrganizerHome from '../pages/Organizer/OrganizerHome';
import CreateEventPage from '../pages/Organizer/CreateEventPage';
import MyEventsPage from '../pages/Organizer/MyEventsPage';
import EditEventPage from '../pages/Organizer/EditEventPage';
import ValidatorPage from '../pages/Organizer/ValidatorPage';
import PublicLayout from '../layouts/PublicLayout';
import LandingPage from '../pages/Public/LandingPage';
import EventDetailPage from '../pages/Public/EventDetailPage';
import ParticipantHome from '../pages/Participant/ParticipantHome';
import MyTickets from '../pages/Participant/MyTickets';
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
        <Route path="/dashboard/organizer/home" element={<OrganizerHome />} />
        <Route path="/dashboard/organizer/events/create" element={<CreateEventPage />} />
        <Route path="/dashboard/organizer/events/edit/:id" element={<EditEventPage />} />
        <Route path="/dashboard/organizer/validator" element={<ValidatorPage />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/organizer" element={<Navigate to="/dashboard/organizer/home" replace />} />
          <Route path="/dashboard/organizer/events" element={<MyEventsPage />} />
        </Route>
      </Route>

      {/* Participant Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['participant']} />}>
        <Route path="/participant/home" element={<ParticipantHome />} />
        <Route path="/participant/tickets" element={<MyTickets />} />
        <Route path="/participant/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
