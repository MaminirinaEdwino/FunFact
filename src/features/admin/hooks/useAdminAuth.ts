import { useEffect, useState } from 'react';
import { isAdmin as readIsAdmin, loginAdmin, logoutAdmin } from '../services/auth';

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    setIsAdmin(readIsAdmin());
  }, []);

  const login = () => {
    loginAdmin();
    setIsAdmin(true);
  };

  const logout = () => {
    logoutAdmin();
    setIsAdmin(false);
  };

  return { isAdmin, login, logout };
}
