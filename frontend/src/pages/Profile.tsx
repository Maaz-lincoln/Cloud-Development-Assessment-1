import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/App";
import { useMutation } from "react-query";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { User, CreditCard } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  const mutation = useMutation(
    async () => {
      const { data } = await api.post(
        "/credits/add",
        { credits: 5 },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      return data;
    },
    {
      onSuccess: (data) => {
        user.credits = data.credits;
        toast.success("Successfully added 5 credits to your account.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      },
      onError: (err: any) => {
        const msg =
          err?.response?.data?.detail ||
          "Failed to add credits. Please try again.";
        toast.error(msg, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      },
    }
  );

  return (
    <div>
      <Card className="shadow-lg border-0 rounded-2xl transform transition-all hover:shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary1 to-primary2 p-6">
          <CardTitle className="text-2xl font-semibold text-white flex items-center gap-2">
            <User className="h-6 w-6" />
            Account Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-white space-y-4">
          <div className="flex items-center gap-2 text-gray-700">
            <User className="h-5 w-5 text-primary1" />
            <p>
              Username: <span className="font-medium">{user?.username}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="h-5 w-5 text-primary1">📧</span>
            <p>
              Email: <span className="font-medium">{user?.email}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <CreditCard className="h-5 w-5 text-primary1" />
            <p>
              Credits Available:{" "}
              <span className="font-medium">{user?.credits}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
