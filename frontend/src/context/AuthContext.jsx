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
      try {
        const params =
          new URLSearchParams(
            window.location.search
          );

        const accessToken =
          params.get("access_token");

        const refreshToken =
          params.get("refresh_token");

        if (accessToken) {
          localStorage.setItem(
            "arxzen_access_token",
            accessToken
          );
        }

        if (refreshToken) {
          localStorage.setItem(
            "arxzen_refresh_token",
            refreshToken
          );
        }

        if (
          accessToken ||
          refreshToken
        ) {
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        }

        const token =
          localStorage.getItem(
            "arxzen_access_token"
          );

        if (!token) {
          if (mounted) {
            setUser(null);
            setLoading(false);
          }

          return;
        }

        const data =
          await getSession();

        if (mounted) {
          setUser(
            data?.user || null
          );
        }
      } catch (error) {
        console.error(
          "Session restore failed:",
          error
        );

        localStorage.removeItem(
          "arxzen_access_token"
        );

        localStorage.removeItem(
          "arxzen_refresh_token"
        );

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

  async function login(
    email,
    password
  ) {
    const data =
      await apiLogin(
        email,
        password
      );

    setUser(
      data?.user || null
    );

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
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuthContext must be used inside AuthProvider"
    );
  }

  return context;
}
