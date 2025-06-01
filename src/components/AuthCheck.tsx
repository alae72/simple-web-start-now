
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthCheckProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'staff' | 'user' | 'owner';
}

const AuthCheck = ({ children, requiredRole }: AuthCheckProps) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    
    if (!isLoggedIn) {
      navigate('/login');
    } else if (requiredRole === 'admin' && userRole !== 'admin') {
      navigate('/');
    } else if (requiredRole === 'staff' && userRole !== 'staff' && userRole !== 'admin') {
      navigate('/');
    } else if (requiredRole === 'owner' && userRole !== 'owner' && userRole !== 'admin') {
      navigate('/');
    }
  }, [navigate, requiredRole]);
  
  return <>{children}</>;
};

export default AuthCheck;
