import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation } from "react-query";
import { useAuth } from "@/App";
import JobSubmissionForm from "@/components/JobSubmissionForm";
import JobHistoryTable from "@/components/JobHistoryTable";
import api from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

interface Job {
  id: number;
  status: string;
  created_at: string;
  input_text: string;
  output_text?: string;
}

export default function JobsPage() {
  const { user, token } = useAuth();
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const jobsQuery = useQuery<Job[], Error>(
    ["jobs", token],
    async () => {
      const { data } = await api.get("/jobs/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    {
      refetchInterval: 5000,
      onError: (err: any) => {
        toast.error(err?.response?.data?.detail || "Failed to fetch jobs.");
      },
    }
  );

  const mutation = useMutation(
    async (inputText: string) => {
      setError("");
      const { data } = await api.post(
        "/jobs/submit",
        { input_text: inputText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    },
    {
      onSuccess: (data) => {
        setSummary(data.output_text || null);
        setError("");
        if (!data.output_text) {
          setError("Your job is processing. Check again soon.");
        }
        toast.success("Job submitted successfully!");
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.detail || "Failed to submit job.";
        setError(msg);
        toast.error(msg);
      },
      onSettled: () => {
        jobsQuery.refetch();
      },
    }
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const inputText = (e.target as any).input_text.value;
    if (!inputText) return;
    mutation.mutate(inputText);
    e.target.reset();
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4">AI Text Summarizer</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Submit a New Job</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            Your credits: <span className="font-medium">{user?.credits}</span>
          </p>
          <JobSubmissionForm
            onSubmit={handleSubmit}
            loading={mutation.isLoading}
            userCredits={user?.credits || 0}
          />
          {mutation.isLoading && <Skeleton className="mt-6 h-24 w-full" />}
          {summary && (
            <div className="mt-6 p-4 bg-gray-100 rounded">
              <p className="font-semibold">Summary:</p>
              <p className="mt-2">{summary}</p>
            </div>
          )}
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      <JobHistoryTable
        jobs={jobsQuery.data || []}
        isLoading={jobsQuery.isLoading}
      />
    </div>
  );
}
