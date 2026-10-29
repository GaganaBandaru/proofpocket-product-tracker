import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <div className="loading-center">
            <div className="spinner" role="status" aria-label="Checking session" />
            <p>Checking authentication…</p>
          </div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    // Preserve intended destination so user can be redirected back after logging in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
