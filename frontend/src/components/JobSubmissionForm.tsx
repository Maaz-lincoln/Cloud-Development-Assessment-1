import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
          className="block font-semibold text-gray-700"
        >
          Paste text to summarize:
        </Label>
        <Textarea
          id="input_text"
          name="input_text"
          className="w-full p-2 border rounded min-h-[120px] mt-1"
          placeholder="Enter text here..."
          required
          disabled={loading}
        />
      </div>
      <Button
        className="w-full"
        type="submit"
        disabled={loading || userCredits < 1}
      >
        {userCredits < 1
          ? "Not Enough Credits"
          : loading
            ? "Submitting..."
            : "Summarize"}
      </Button>
    </form>
  );
}
