import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: number;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  return (
    <Card
      className={`mb-2 ${notification.is_read ? "bg-gray-100" : "bg-white"}`}
    >
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <p
            className={`text-sm ${notification.is_read ? "text-gray-600" : "text-gray-800"}`}
          >
            {notification.message}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatDistanceToNow(new Date(notification.created_at), {
              addSuffix: true,
            })}
          </p>
        </div>
        {!notification.is_read && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMarkAsRead(notification.id)}
          >
            Mark as Read
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
