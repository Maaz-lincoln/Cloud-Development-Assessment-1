import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

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
  const convertDate = (date: any) => {
    let updatedData = date.split("-");
    let [y, m, d] = updatedData;
    return `${d}/${m}/${y}`;
  };

  return (
    <Card
      className={`mb-3 shadow-sm border-0 rounded-lg transform transition-all hover:shadow-md ${
        notification.is_read ? "bg-gray-50" : "bg-white"
      }`}
    >
      <CardContent className="p-4 flex justify-between items-center">
        <div className="flex items-start gap-3">
          <Bell
            className={`h-5 w-5 mt-1 ${
              notification.is_read ? "text-gray-400" : "text-primary1"
            }`}
          />
          <div>
            <p
              className={`text-sm font-medium ${
                notification.is_read ? "text-gray-600" : "text-gray-800"
              }`}
            >
              {notification.message}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {convertDate(notification.created_at.slice(0, 10))}
            </p>
          </div>
        </div>
        {!notification.is_read && (
          <Button
            variant="outline"
            size="sm"
            className="text-primary1 border-primary1 hover:text-primary2 hover:border-primary2 transition-colors duration-200"
            onClick={() => onMarkAsRead(notification.id)}
          >
            Mark as Read
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
