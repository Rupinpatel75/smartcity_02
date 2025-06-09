
import { AdminLayout } from "@/components/layouts/admin-layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AssignTask() {
  const [employeeName, setEmployeeName] = useState("");
  const [taskType, setTaskType] = useState("");
  const [description, setDescription] = useState("");
  const [complaint, setComplaint] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to assign task
    const task = {
      employeeName,
      taskType,
      description,
      complaint,
    };
    console.log("Assigning task:", task);
  };

  // Mock data - replace with API call
  const employees = [
    { id: "1", name: "Patel rupin" },
    { id: "2", name: "shivm" },
  ];

  const tasks = [
    "Investigation",
    "Field Visit",
    "Report Generation",
    "Follow-up",
    "Documentation",
  ];

  return (
   
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Assign Task To Employee</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Employee Name</Label>
            <Select onValueChange={setEmployeeName} required>
              <SelectTrigger>
                <SelectValue placeholder="Select Employee Name" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Assign Task</Label>
            <Select onValueChange={setTaskType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select Task To Assign" />
              </SelectTrigger>
              <SelectContent>
                {tasks.map((task) => (
                  <SelectItem key={task} value={task}>
                    {task}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="min-h-[100px]"
            />
          </div>

          <div>
            <Label>Complaint (Optional)</Label>
            <Textarea
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Button type="submit" className="w-full bg-gray-600">
            Assign Task
          </Button>
        </form>
      </div>
 
  );
}
