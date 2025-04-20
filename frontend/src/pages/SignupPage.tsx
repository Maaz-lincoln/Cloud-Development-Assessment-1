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

export default function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const mutation = useMutation(
    async (form: { username: string; email: string; password: string }) => {
      setLoading(true);
      await api.post("/auth/signup", form);
      const { data } = await api.post("/auth/token", {
        username: form.username,
        password: form.password,
      });
      return data;
    },
    {
      onSuccess: (data) => {
        setAuthToken(data.access_token, data.refresh_token);
        login({ token: data.access_token });
        toast.success("Account created! Welcome.");
        navigate("/dashboard");
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.detail || "Signup failed.";
        toast.error(msg);
        setLoading(false);
      },
    }
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.target)) as {
      username: string;
      email: string;
      password: string;
    };
    mutation.mutate(form);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create Your Account</CardTitle>
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
                placeholder="Pick a username"
                required
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
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
              {loading ? "Creating..." : "Sign Up"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
