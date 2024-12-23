import React, { createContext, useState, useEffect } from "react";
import msalInstance, { initializeMsalInstance } from "../../msalConfig";
import { AuthorizationState } from "@/store/AuthorizationStore";


export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [msResponse, setMsResponse] = useState({});

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await initializeMsalInstance();
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("MSAL initialization error", error);
      }
    };

    initializeAuth();
  }, []);

  const login = async () => {
    try {
      await initializeMsalInstance();
      const response = await msalInstance.loginPopup({
        scopes: ["user.read"],
      });
      setIsAuthenticated(true);
      setMsResponse(response);
      sessionStorage.setItem("microsoft-access_token", response.accessToken);
      AuthorizationState.next({ ...response, isAuth: true });
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = () => {
    msalInstance.logoutPopup();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, msResponse }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthContext = React.createContext();