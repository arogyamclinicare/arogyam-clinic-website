import { useAuth } from './context/AuthContext';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminDashboard } from './AdminDashboard';

export function AdminPanel() {
  const { isAuthenticated, loading } = useAuth();

  // AdminPanel render

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Checking authentication...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few seconds...</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // If not authenticated, show separate login page
  if (!isAuthenticated) {
    return <AdminLoginPage />;
  }

  // If authenticated, show separate dashboard
  return <AdminDashboard />;
}
