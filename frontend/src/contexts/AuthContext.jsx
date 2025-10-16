import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { refreshToken as refreshTokenApi } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkTokenExpiration = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  };

  const refreshAccessToken = async () => {
    try {
      setIsRefreshing(true);
      const refreshToken = localStorage.getItem('refreshToken');
      
      // Check if refresh token exists and is not expired
      if (refreshToken && checkTokenExpiration(refreshToken)) {
        const data = await refreshTokenApi();
        const { access } = data;
        
        localStorage.setItem('accessToken', access);
        const decodedToken = jwtDecode(access);
        setUser(decodedToken);
        setIsAuthenticated(true);
        return access;
      } else {
        throw new Error('Refresh token is expired');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
      return null;
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Check for JWT tokens when the app loads
    const accessToken = localStorage.getItem('accessToken');
    
    if (accessToken) {
      try {
        // Check if access token is expired
        if (checkTokenExpiration(accessToken)) {
          const decodedToken = jwtDecode(accessToken);
          setIsAuthenticated(true);
          setUser(decodedToken);
        } else {
          // Try to refresh the token
          refreshAccessToken();
        }
      } catch (error) {
        console.error('Invalid token:', error);
        logout();
      }
    }
  }, []);

  const login = (tokens) => {
    console.log("Logging in with tokens:", tokens);
    
    // Handle different response structures
    let access, refresh;
    if (tokens.tokens) {
      // If tokens are nested in a 'tokens' property
      access = tokens.tokens.access;
      refresh = tokens.tokens.refresh;
    } else {
      // If tokens are at the root level
      access = tokens.access;
      refresh = tokens.refresh;
    }
    
    console.log("Access Token:", access);
    console.log("Refresh Token:", refresh);
    
    // Store tokens
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    
    // Decode and store user info
    const decodedToken = jwtDecode(access);
    console.log("Decoded Token:", decodedToken);
    setUser(decodedToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};