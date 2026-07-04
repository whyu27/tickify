import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../pages/Auth/LoginPage';

// Simple placeholders as requested
const Home = () => <div>Home Page (Placeholder)</div>;
const Register = () => <div>Register Page (Placeholder)</div>;
const Dashboard = () => <div>Dashboard Page (Placeholder)</div>;

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/organizer" element={<div>Organizer Dashboard (Placeholder)</div>} />
        <Route path="/dashboard/participant" element={<div>Participant Dashboard (Placeholder)</div>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
