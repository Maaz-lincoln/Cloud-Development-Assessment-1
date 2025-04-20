import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation } from "react-query";
import { useAuth } from "@/App";
import api from "@/lib/api";
import NotificationItem from "@/components/NotificationItem";
import { toast } from "sonner";

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
          err?.response?.data?.detail || "Failed to fetch notifications."
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
        toast.success("Notification marked as read.");
        notificationsQuery.refetch();
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.detail || "Failed to mark notification as read."
        );
      },
    }
  );

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4">Notifications</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {notificationsQuery.isLoading && (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          )}
          {!notificationsQuery.isLoading &&
            (!notificationsQuery.data ||
              notificationsQuery.data.length === 0) && (
              <p className="text-gray-500 text-center">No notifications yet.</p>
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
