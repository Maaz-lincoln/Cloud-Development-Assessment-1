import { Button } from "@/components/ui/button";
import { useAuth } from "@/App";
import { Link } from "react-router-dom";
import { CreditCard, LogOut, Home, Bell, User, FileCode2 } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex space-x-6">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-gray-700 hover:text-primary1 font-medium transition-colors duration-200"
            >
              <Home className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              to="/notifications"
              className="flex items-center gap-2 text-gray-700 hover:text-primary1 font-medium transition-colors duration-200"
            >
              <Bell className="h-5 w-5" />
              Notifications
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-2 text-gray-700 hover:text-primary1 font-medium transition-colors duration-200"
            >
              <User className="h-5 w-5" />
              Profile
            </Link>
            <Link
              to="/docs"
              className="flex items-center gap-2 text-gray-700 hover:text-primary1 font-medium transition-colors duration-200"
            >
              <FileCode2 className="h-5 w-5" />
              Api Documentation
            </Link>
          </div>
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-2 text-gray-700">
                <CreditCard className="h-5 w-5 text-primary1" />
                <span className="font-medium">Credits: {user.credits}</span>
              </div>
              <Button
                variant="outline"
                className="text-primary1 border-primary1 hover:text-primary2 hover:border-primary2 transition-colors duration-200"
                onClick={logout}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Log Out
              </Button>
            </div>
          )}
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
