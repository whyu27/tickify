import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardOrganizer from '../pages/Organizer/DashboardOrganizer';
import CreateEventPage from '../pages/Organizer/CreateEventPage';
import MyEventsPage from '../pages/Organizer/MyEventsPage';
import EditEventPage from '../pages/Organizer/EditEventPage';

// Simple placeholders as requested
const Home = () => <div>Home Page (Placeholder)</div>;
const Dashboard = () => <div>Dashboard Page (Placeholder)</div>;

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* General Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
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
        <Route path="/dashboard/participant" element={<div>Participant Dashboard (Placeholder)</div>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
