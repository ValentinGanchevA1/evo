// src/components/AppInitializer.tsx
import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from '../hooks/useLocation';

interface AppInitializerProps {
  children: React.ReactNode;
}

export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { startTracking } = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      startTracking();
    }
  }, [isAuthenticated, startTracking]);

  return <>{children}</>;
};
