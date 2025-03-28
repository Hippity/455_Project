import React, { createContext, useContext, useState, useEffect } from "react";
import { devResponse, userAPI } from "../services/api";

// Create context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user info on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        var response = {}
        
        if (process.env.NODE_ENV === "production") {
            response = await userAPI.userDetails();
        } else {
            response = devResponse
        }

        if (response.data[0] && response.data[0].user_id) {
          setUser(response.data[0].user_claims);
        } else {
            console.log("yo")
          setUser(null);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching user info:", err);
        setUser(null);
        setError("Failed to fetch authentication information");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // Login function - redirects to Azure AD login page
  const login = () => {
    // Get current URL to use as redirect after login
    const redirectUrl = encodeURIComponent(window.location.href);
    window.location.href = `/.auth/login/google?post_login_redirect_uri=${redirectUrl}`;
  };

  // Logout function
  const logout = () => {
    // Get current URL to use as redirect after logout
    const redirectUrl = encodeURIComponent(window.location.href);
    window.location.href = `/.auth/logout?post_logout_redirect_uri=${redirectUrl}`;
  };

  // Provide auth context to children components
  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
