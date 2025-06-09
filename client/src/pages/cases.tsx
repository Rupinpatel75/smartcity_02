import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, FileDown } from "lucide-react";
import { type Case } from "@shared/schema";
import * as XLSX from "xlsx"; // Import SheetJS

const fetchCases = async () => {
  const response = await axios.get("/api/v1/cases"); // Fetch data from API
  return response.data;
};

export default function Cases() {
  const { data: cases = [], error, isLoading } = useQuery({
    queryKey: ["/api/v1/cases"],
    queryFn: fetchCases,
  });

  if (isLoading) return <p>Loading cases...</p>;
  if (error) return <p>Error loading cases.</p>;

  // Function to Export Data to Excel
  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(cases); // Convert data to sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cases"); // Add sheet to workbook
    XLSX.writeFile(workbook, "cases.xlsx"); // Download the file
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Cases</h2>
          <p className="text-sm text-muted-foreground">
            Manage and track all reported cases
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search issues..." className="pl-8" />
          </div>
          <Button variant="outline" onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            Export to Excel
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Case ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.map((case_: Case) => (
              <TableRow key={case_.id}>
                <TableCell>{cases.indexOf(case_) + 1}</TableCell>
                <TableCell>{case_.title}</TableCell>
                <TableCell>
                  {new Date(case_.createdAt || "").toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={case_.status === "completed" ? "default" : "secondary"}
                  >
                    {case_.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      case_.priority === "high"
                        ? "destructive"
                        : case_.priority === "medium"
                        ? "secondary"
                        : "default"
                    }
                  >
                    {case_.priority}
                  </Badge>
                </TableCell>
                <TableCell>{case_.category}</TableCell>
                <TableCell>{case_.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
