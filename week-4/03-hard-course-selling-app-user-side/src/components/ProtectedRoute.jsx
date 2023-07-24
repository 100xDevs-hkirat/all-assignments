import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('token');

  return isLoggedIn ? (
    children
  ) : (
    <Navigate to='/login' replace state={{ path: location.pathname }} />
  );
};

export default ProtectedRoute;
