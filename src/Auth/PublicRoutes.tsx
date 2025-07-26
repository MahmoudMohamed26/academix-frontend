import { useAuth } from '../Context/AuthContext';
import { Navigate, Outlet } from 'react-router';

const PublicRoute = () => {
  const { isAuthenticated, authChecked } = useAuth()!; // use ! or handle undefined

  if (!authChecked) return null;

  return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;