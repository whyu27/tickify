import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardOrganizer from '../pages/Organizer/DashboardOrganizer';
import OrganizerHome from '../pages/Organizer/OrganizerHome';
import CreateEventPage from '../pages/Organizer/CreateEventPage';
import EditEventPage from '../pages/Organizer/EditEventPage';
import ValidatorPage from '../pages/Organizer/ValidatorPage';
import ReportPage from '../pages/Organizer/ReportPage';
import PublicLayout from '../layouts/PublicLayout';
import LandingPage from '../pages/Public/LandingPage';
import PublicEventDetailPage from '../pages/Public/PublicEventDetailPage';
import ParticipantHome from '../pages/Participant/ParticipantHome';
import MyTickets from '../pages/Participant/MyTickets';
import TicketDetailPage from '../pages/Participant/TicketDetailPage';
import ProfilePage from '../pages/ProfilePage';
import ParticipantEventDetailPage from '../pages/Participant/ParticipantEventDetailPage';

// Simple placeholders as requested
const Dashboard = () => <div>Dashboard Page (Placeholder)</div>;

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/events/:id" element={<PublicEventDetailPage />} />
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
        <Route path="/dashboard/organizer/reports/:eventId" element={<ReportPage />} />
        <Route path="/dashboard/organizer/validator" element={<ValidatorPage />} />
        <Route path="/organizer/validator" element={<ValidatorPage />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/organizer" element={<Navigate to="/dashboard/organizer/home" replace />} />
        </Route>
      </Route>

      {/* Participant Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['participant']} />}>
        <Route path="/participant/home" element={<ParticipantHome />} />
        <Route path="/participant/tickets" element={<MyTickets />} />
        <Route path="/participant/tickets/:ticketId" element={<TicketDetailPage />} />
        <Route path="/participant/profile" element={<ProfilePage />} />
        <Route path="/participant/events/:id" element={<ParticipantEventDetailPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
