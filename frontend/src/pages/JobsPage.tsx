import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery, useMutation } from "react-query";
import { useAuth } from "@/App";
import JobSubmissionForm from "@/components/JobSubmissionForm";
import JobHistoryTable from "@/components/JobHistoryTable";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { useState } from "react";
import { FileText } from "lucide-react";

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
  const { login } = useAuth();

  const jobsQuery = useQuery<Job[], Error>(
    ["jobs", token],
    async () => {
      const { data } = await api.get("/jobs/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      let processing = data.some(
        (item: any) => item.status == "pending" || item.status == "processing"
      );
      if (!processing) {
        setError("");
      }
      login({ token: token });
      return data;
    },
    {
      refetchInterval: 5000,
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.detail ||
            "Failed to fetch your jobs. Please try again.",
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
          setError("Your job is processing. Please check back soon.");
        }
        toast.success(
          "Job submitted successfully. Credits will be deducted upon completion.",
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
      onError: (err: any) => {
        const msg =
          err?.response?.data?.detail ||
          "Failed to submit the job. Please try again.";
        setError(msg);
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
      onSettled: () => {
        jobsQuery.refetch();
      },
    }
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const inputText = (e.target as any).input_text.value;
    if (!inputText) {
      toast.error("Please enter text to summarize.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return;
    }
    mutation.mutate(inputText);
    e.target.reset();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-primary1 flex items-center gap-2">
        <FileText className="h-8 w-8" />
        AI Text Summarizer
      </h1>
      <Card className="mb-6 shadow-lg border-0 rounded-2xl transform transition-all hover:shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary1 to-primary2 p-6">
          <CardTitle className="text-2xl font-semibold text-white">
            Submit a New Summarization Job
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          <p className="text-gray-700 mb-4 flex items-center gap-2">
            Credits Available:{" "}
            <span className="font-medium">{user?.credits}</span>
          </p>
          <JobSubmissionForm
            onSubmit={handleSubmit}
            loading={mutation.isLoading}
            userCredits={user?.credits || 0}
          />
          {summary && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="font-semibold text-primary1 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generated Summary:
              </p>
              <p className="mt-2 text-gray-700">{summary}</p>
            </div>
          )}
          {error && (
            <Alert variant="destructive" className="mt-4 rounded-lg">
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
