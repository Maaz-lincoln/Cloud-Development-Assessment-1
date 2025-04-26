import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect, createContext, useContext } from "react";
import { useQuery } from "react-query";
import { ToastContainer } from "react-toastify";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import JobsPage from "./pages/JobsPage";
import NotificationsPage from "./pages/NotificationsPage";
import ApiDocumentation from "./pages/ApiDocumentation";
import Layout from "./components/Layout";
import api, { setAuthToken } from "./lib/api";
import Profile from "./pages/Profile";

interface User {
  id: number;
  username: string;
  email: string;
  credits: number;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: { token: string }) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => useContext(AuthContext)!;

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const fetchUser = async (jwt: string) => {
    console.log("JWT Token:", jwt);
    console.log("Headers:", api.defaults.headers);
    console.log(
      "Fetch User - Authorization Header:",
      api.defaults.headers.common["Authorization"]
    );
    try {
      setAuthToken(jwt);
      const { data } = await api.get("/auth/me");
      setUser({ ...data, token: jwt });
      const protectedRoutes = [
        "/dashboard",
        "/profile",
        "/notifications",
        "/docs",
      ];
      if (!protectedRoutes.includes(location.pathname)) {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Fetch User Error:", error?.response?.data);
      setUser(null);
      setToken(null);
      setAuthToken(null, null);
    } finally {
      setLoading(false);
    }
  };

  const login = ({ token }: { token: string }) => {
    setToken(token);
    localStorage.setItem("access_token", token);
    fetchUser(token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null, null);
    localStorage.removeItem("access_token");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  useQuery(
    ["user", token],
    async () => {
      if (!token) return null;
      const { data } = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    {
      enabled: !!token,
      refetchInterval: 60000,
      onSuccess: (data) => {
        if (data) {
          setUser({ ...data, token });
        }
      },
      onError: (err: any) => {
        console.error("Periodic Fetch User Error:", err?.response?.data);
        setUser(null);
        setToken(null);
        setAuthToken(null, null);
        localStorage.removeItem("access_token");
      },
      onSettled: () => {
        setLoading(false);
      },
    }
  );

  // useEffect(() => {
  //   if (token) {
  //     fetchUser(token);
  //   }
  // }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center min-w-screen min-h-screen items-center">
        <span className="loader"></span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Layout>
                  <JobsPage />
                </Layout>
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Layout>
                  <Profile />
                </Layout>
              </RequireAuth>
            }
          />
          <Route
            path="/notifications"
            element={
              <RequireAuth>
                <Layout>
                  <NotificationsPage />
                </Layout>
              </RequireAuth>
            }
          />
          <Route
            path="/docs"
            element={
              <RequireAuth>
                <Layout>
                  <ApiDocumentation />
                </Layout>
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
        <ToastContainer />
      </AuthProvider>
    </Router>
  );
}
