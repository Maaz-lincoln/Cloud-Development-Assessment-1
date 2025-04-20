import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect, createContext, useContext } from "react";
import { Toaster } from "@/components/ui/toaster";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import JobsPage from "./pages/JobsPage";
import NotificationsPage from "./pages/NotificationsPage";
import Layout from "./components/Layout";
import api, { setAuthToken } from "./lib/api";

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
  const [loading, setLoading] = useState(false);

  const fetchUser = async (jwt: string) => {
    console.log("JWT Token:", jwt); // Debug the token
    console.log("Headers:", api.defaults.headers); // Debug headers
    console.log(
      "Fetch User - Authorization Header:",
      api.defaults.headers.common["Authorization"]
    );
    try {
      setAuthToken(jwt);
      const { data } = await api.get("/auth/me");
      setUser({ ...data, token: jwt });
    } catch (error) {
      console.error("Fetch User Error:", error?.response?.data); // Log server error details
      setUser(null);
      setAuthToken(null, null);
    }
  };
  const login = ({ token }: { token: string }) => {
    setToken(token);
    fetchUser(token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null, null);
  };

  useEffect(() => {
    if (token) {
      fetchUser(token);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Layout>
                  <Dashboard />
                </Layout>
              </RequireAuth>
            }
          />
          <Route
            path="/jobs"
            element={
              <RequireAuth>
                <Layout>
                  <JobsPage />
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
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}
