import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import HomeGuest from './components/Guest/Home';
import  DashboardAdmin from './components/Admin/Dashboard';
import DashboardInvestigator from './components/Investigator/Dashboard';
import DashboardUser from './components/Victim/Dashboard';
import Profile from './components/Profile';
import Signup from './components/Signup';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Messaging from './Messaging';

// Component for role-based dashboard rendering
function RoleBasedDashboard() {
  const { user } = useAuth(); 
  const role = user?.role; 
  
  if (role === 'admin' || false ) {
    return <DashboardAdmin />; 
  }
  if(role==="investigator" || true)
    return <DashboardInvestigator />;
   else if (role === 'user') {
    return <DashboardUser />; 
  } else {
    return (<HomeGuest />);
  }
}

// Component for role-based profile rendering
function RoleBasedProfile() {
  const { user } = useAuth(); 
  const role = user?.role;
  
  if (role === 'admin') {
    return <Profile />; 
  } else if (role === 'user') {
    return <Profile />; 
  } else if(role==="investigator"){
    return <Profile />;
  }
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<RoleBasedDashboard />} />
          <Route path="/messages" element={
              <Messaging/>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <RoleBasedProfile />
            </ProtectedRoute>
          } />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;