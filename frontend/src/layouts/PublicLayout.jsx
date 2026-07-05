import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Outlet />
    </div>
  );
};

export default PublicLayout;
