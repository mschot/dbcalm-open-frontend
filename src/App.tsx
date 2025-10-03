import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Processes from './pages/Processes';
import { checkAuth } from './utils/auth';
import AddClient from './pages/AddClient';
import { ProcessMonitorProvider } from './contexts/ProcessMonitorContext';
import { Toast } from './components/Toast';
import { useProcessMonitor } from './hooks/useProcessMonitor';
import './App.css'

const ToastContainer = () => {
  const { toastMessages, dismissToast } = useProcessMonitor();
  return <Toast messages={toastMessages} onDismiss={dismissToast} />;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = checkAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ProcessMonitorProvider>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clients"
            element={
              <ProtectedRoute>
                <Clients />
              </ProtectedRoute>
            }
          />
          <Route
           path="/add-client"
           element={
            <ProtectedRoute>
              <AddClient />
            </ProtectedRoute>
            }
          />
          <Route
            path="/processes"
            element={
              <ProtectedRoute>
                <Processes />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ProcessMonitorProvider>
  );
}

export default App;
