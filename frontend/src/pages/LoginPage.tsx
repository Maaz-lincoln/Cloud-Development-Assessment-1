import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useMutation } from "react-query";
import { useAuth } from "@/App";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import api, { setAuthToken } from "@/lib/api";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const mutation = useMutation(
    async (form: { username: string; password: string }) => {
      setLoading(true);
      const { data } = await api.post("/auth/token", form);
      return data;
    },
    {
      onSuccess: (data) => {
        setAuthToken(data.access_token, data.refresh_token);
        login({ token: data.access_token });
        toast.success("Signed in! Welcome back.");
        navigate("/dashboard");
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.detail || "Login failed.";
        toast.error(msg);
        setLoading(false);
      },
    }
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.target)) as {
      username: string;
      password: string;
    };
    mutation.mutate(form);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login to AI Service Lab</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-gray-700">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                placeholder="Your username"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Password"
                required
              />
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
