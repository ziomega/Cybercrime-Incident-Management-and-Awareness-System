import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Signup from './components/Signup';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import FeatureCards from './components/FeatureCards';
import CybersecurityParallax from './components/CybersecurityParallax';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={
            <>
              {/* This is the top section, it should just be rendered */}
              <Hero />
              
              {/* This component handles its own internal parallax based on scroll.
                  No need for an external Framer Motion wrapper. */}
              <CybersecurityParallax />

              {/* This is the bottom section, it should just be rendered */}
              <FeatureCards />
            </>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
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