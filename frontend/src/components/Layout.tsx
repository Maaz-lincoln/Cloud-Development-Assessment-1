import { Button } from "@/components/ui/button";
import { useAuth } from "@/App";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex space-x-4">
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/jobs"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Jobs
            </Link>
            <Link
              to="/notifications"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Notifications
            </Link>
          </div>
          {user && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Credits: {user.credits}</span>
              <Button variant="outline" onClick={logout}>
                Log Out
              </Button>
            </div>
          )}
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
