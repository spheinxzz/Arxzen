import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getSession
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      const token = localStorage.getItem("arxzen_access_token");

      if (!token) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const data = await getSession();

        if (mounted) {
          setUser(data.user || null);
        }
      } catch {
        localStorage.removeItem("arxzen_access_token");

        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  async function login(email, password) {
    const data = await apiLogin(email, password);
    setUser(data.user || null);
    return data;
  }

  async function register(account) {
    return apiRegister(account);
  }

  async function logout() {
    await apiLogout();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuthContext must be used inside AuthProvider"
    );
  }

  return context;
}
