// src/hooks/useAuth.ts
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { loginWithPhone, logout, clearError } from '../store/slices/authSlice';
import { LoginCredentials } from "@/types";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);

  const login = (credentials: LoginCredentials) => {
    return dispatch(loginWithPhone(credentials));
  };

  const signOut = () => {
    return dispatch(logout());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    ...authState,
    login,
    signOut,
    clearAuthError,
  };
};
