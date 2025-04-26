import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";

interface JobSubmissionFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  userCredits: number;
}

export default function JobSubmissionForm({
  onSubmit,
  loading,
  userCredits,
}: JobSubmissionFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label
          htmlFor="input_text"
          className="block font-semibold text-gray-700 flex items-center gap-2"
        >
          <FileText className="h-5 w-5 text-primary1" />
          Text to Summarize
        </Label>
        <Textarea
          id="input_text"
          name="input_text"
          className="w-full p-3 border border-gray-300 rounded-lg min-h-[120px] mt-2 focus:border-primary1 focus:ring-primary1 transition-all duration-300"
          placeholder="Paste the text you want to summarize here..."
          required
          disabled={loading || userCredits < 10}
        />
        {userCredits < 10 && (
          <p className="text-red-600 text-sm mt-2">
            Insufficient credits. You need at least 10 credits to submit a job.
          </p>
        )}
      </div>
      <Button
        className="w-full bg-primary1 hover:bg-primary2 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
        type="submit"
        disabled={loading || userCredits < 10}
      >
        {userCredits < 10 ? (
          "Insufficient Credits"
        ) : loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Submitting Job...
          </span>
        ) : (
          "Submit for Summarization"
        )}
      </Button>
    </form>
  );
}
