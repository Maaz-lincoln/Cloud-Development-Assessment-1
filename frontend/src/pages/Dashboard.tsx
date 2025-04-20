import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/App";
import { Button } from "@/components/ui/button";
import { useMutation } from "react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export default function Dashboard() {
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
        toast.success("Added 5 credits to your account!");
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.detail || "Failed to add credits.";
        toast.error(msg);
      },
    }
  );

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4">
        Welcome, {user?.username}!
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Account Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            Username: <span className="font-medium">{user?.username}</span>
          </p>
          <p className="text-gray-700 mt-2">
            Email: <span className="font-medium">{user?.email}</span>
          </p>
          <p className="text-gray-700 mt-2">
            Credits: <span className="font-medium">{user?.credits}</span>
          </p>
          <Button
            className="mt-4"
            variant="secondary"
            onClick={() => mutation.mutate()}
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Adding..." : "Add 5 Credits (Demo)"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
