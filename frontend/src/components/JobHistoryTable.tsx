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
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, FileOutput } from "lucide-react";

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
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const convertDate = (date: any) => {
    let updatedData = date.split("-");
    let [y, m, d] = updatedData;
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="mt-8">
      <h2 className="font-semibold text-xl text-primary1 mb-4 flex items-center gap-2">
        <FileText className="h-6 w-6" />
        Your Summarization History
      </h2>
      <ScrollArea className="border border-gray-200 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700">
                Status
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Submitted
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Input Preview
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Summary Output
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Details
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="w-14 h-4 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-24 h-4 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-36 h-4 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-36 h-4 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-20 h-8 rounded" />
                  </TableCell>
                </TableRow>
              ))}
            {!isLoading && jobs.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-gray-500"
                >
                  No summarization jobs submitted yet.
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              jobs.map((job) => (
                <TableRow
                  key={job.id}
                  className="hover:bg-gray-50 !bg-white transition-colors duration-200"
                >
                  <TableCell>
                    <span
                      className={`capitalize font-medium ${
                        job.status === "completed"
                          ? "text-green-600"
                          : job.status === "failed"
                            ? "text-red-600"
                            : "text-yellow-600"
                      }`}
                    >
                      {job.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {" "}
                    {convertDate(job.created_at.slice(0, 10))}
                  </TableCell>
                  <TableCell title={job.input_text}>
                    {job.input_text.slice(0, 50)}
                    {job.input_text.length > 50 ? "..." : ""}
                  </TableCell>
                  <TableCell>
                    {job.status === "completed" && job.output_text ? (
                      job.output_text.slice(0, 50) +
                      (job.output_text.length > 50 ? "..." : "")
                    ) : (
                      <span className="italic text-gray-400">{job.status}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-primary1 hover:text-primary2 border-primary1 hover:border-primary2 transition-colors duration-200"
                          onClick={() => setSelectedJob(job)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-scroll overflow-x-hidden rounded-lg shadow-lg">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-semibold text-primary1">
                            Job Details
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 p-4">
                          <div>
                            <p className="text-gray-700 font-medium flex items-center gap-2">
                              <FileText className="h-5 w-5 text-primary1" />
                              Input Text
                            </p>
                            <p className="mt-2 text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">
                              {selectedJob?.input_text}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-700 font-medium flex items-center gap-2">
                              <FileOutput className="h-5 w-5 text-primary1" />
                              Summary Output
                            </p>
                            <p className="mt-2 text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">
                              {selectedJob?.status === "completed" &&
                              selectedJob?.output_text ? (
                                selectedJob.output_text
                              ) : (
                                <span className="italic text-gray-400">
                                  Not available (Status: {selectedJob?.status})
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <span className="font-medium">Status:</span>
                            <span
                              className={`capitalize ${
                                selectedJob?.status === "completed"
                                  ? "text-green-600"
                                  : selectedJob?.status === "failed"
                                    ? "text-red-600"
                                    : "text-yellow-600"
                              }`}
                            >
                              {selectedJob?.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <span className="font-medium">Submitted:</span>
                            <span>
                              {selectedJob?.created_at
                                ? convertDate(
                                    selectedJob?.created_at.slice(0, 10)
                                  )
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
