import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

interface Job {
  id: number;
  status: string;
  created_at: string;
  input_text: string;
  output_text?: string;
}

interface JobHistoryTableProps {
  jobs: Job[];
  isLoading: boolean;
}

export default function JobHistoryTable({
  jobs,
  isLoading,
}: JobHistoryTableProps) {
  return (
    <div className="mt-8">
      <h2 className="font-semibold text-lg text-gray-800 mb-2">
        Your Job History
      </h2>
      <ScrollArea className="max-h-80 border rounded">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Input</TableHead>
              <TableHead>Summary Output</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="w-14 h-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-24 h-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-36 h-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-36 h-4" />
                  </TableCell>
                </TableRow>
              ))}
            {!isLoading && jobs.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-gray-500"
                >
                  No jobs submitted yet.
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <span
                      className={`capitalize ${job.status === "completed" ? "text-green-600" : job.status === "failed" ? "text-red-600" : "text-yellow-600"}`}
                    >
                      {job.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(job.created_at), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell title={job.input_text}>
                    {job.input_text.slice(0, 50)}
                    {job.input_text.length > 50 ? "..." : ""}
                  </TableCell>
                  <TableCell>
                    {job.status === "completed" && job.output_text ? (
                      job.output_text
                    ) : (
                      <span className="italic text-gray-400">{job.status}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
