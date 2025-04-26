import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation } from "react-query";
import { useAuth } from "@/App";
import api from "@/lib/api";
import NotificationItem from "@/components/NotificationItem";
import { toast } from "react-toastify";
import { Bell } from "lucide-react";

interface Notification {
  id: number;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const { token } = useAuth();

  const notificationsQuery = useQuery<Notification[], Error>(
    ["notifications", token],
    async () => {
      const { data } = await api.get("/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    {
      refetchInterval: 5000,
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.detail ||
            "Failed to fetch notifications. Please try again.",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          }
        );
      },
    }
  );

  const markAsReadMutation = useMutation(
    async (notificationId: number) => {
      const { data } = await api.post(
        `/notifications/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
    },
    {
      onSuccess: () => {
        toast.success("Notification marked as read successfully.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        notificationsQuery.refetch();
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.detail ||
            "Failed to mark notification as read. Please try again.",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          }
        );
      },
    }
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-primary1 flex items-center gap-2">
        <Bell className="h-8 w-8" />
        Your Notifications
      </h1>
      <Card className="shadow-lg border-0 rounded-2xl transform transition-all hover:shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary1 to-primary2 p-6">
          <CardTitle className="text-2xl font-semibold text-white">
            Notification Center
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          {notificationsQuery.isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          )}
          {!notificationsQuery.isLoading &&
            (!notificationsQuery.data ||
              notificationsQuery.data.length === 0) && (
              <p className="text-gray-500 text-center py-4">
                No notifications available yet.
              </p>
            )}
          {notificationsQuery.data &&
            notificationsQuery.data.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={(id) => markAsReadMutation.mutate(id)}
              />
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
