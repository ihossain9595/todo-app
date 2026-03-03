"use client";

import { v4 as uuidv4 } from "uuid";
import { Task, taskSchema } from "@/utils/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { EmployeeType, TaskType } from "@/utils/types";
import { useCallback, useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function TaskManager() {
  const [employees] = useLocalStorage<EmployeeType[]>("employees", []);
  const [tasks, setTasks] = useLocalStorage<TaskType[]>("tasks", []);

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<Task>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      id: "",
      employeeId: "",
      task: "",
    },
  });

  const openCreateDialog = useCallback(() => {
    setEditingId(null);
    reset({ task: "", employeeId: employees[0]?.employeeId || "" });
    setOpenDialog(true);
  }, [employees, reset]);

  const openEditDialog = (task: TaskType) => {
    setEditingId(task.id);
    reset(task);
    setOpenDialog(true);
  };

  const clearParams = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("assign");
    const queryString = params.toString();
    router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const onSubmit = (data: Task) => {
    if (editingId) {
      setTasks(tasks.map((t) => (t.id === editingId ? { ...data, id: editingId } : t)));
      toast.success("Task updated successfully!");
    } else {
      setTasks([...tasks, { ...data, id: uuidv4() }]);
      toast.success("Task assigned successfully!", {
        description: `Task: ${data.task.substring(0, 30)}${data.task.length > 30 ? "..." : ""}`,
      });
    }

    setOpenDialog(false);
    reset({ id: "", task: "", employeeId: "" });
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmId) return;

    setTasks(tasks.filter((t) => t.id !== deleteConfirmId));
    toast.error("Task deleted successfully!");
    setDeleteConfirmId(null);
  };

  useEffect(() => {
    const shouldAssign = searchParams.get("assign");

    if (shouldAssign === "true") {
      const timeoutId = setTimeout(() => {
        openCreateDialog();
      }, 0);

      clearParams();

      return () => clearTimeout(timeoutId);
    }
  }, [searchParams, openCreateDialog, clearParams]);

  return (
    <div className="space-y-5">
      <div className="flex gap-4 items-center justify-between">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <Button size={"lg"} className="cursor-pointer" onClick={openCreateDialog}>
          Assign New Task
        </Button>
      </div>

      <Card className="p-4">
        {tasks.length === 0 ? (
          <p className="text-slate-500 text-center py-4">No tasks assigned yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task Description</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((t) => {
                const emp = employees.find((e) => e.employeeId === t.employeeId);
                return (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium whitespace-normal">{t.task}</TableCell>
                    <TableCell>{emp ? emp.name : "Unassigned"}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => openEditDialog(t)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" className="cursor-pointer" onClick={() => setDeleteConfirmId(t.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog
        open={openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open);
          if (!open) {
            clearParams();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Task" : "Assign New Task"}</DialogTitle>
              <DialogDescription>Select an employee and describe the task requirements.</DialogDescription>
            </DialogHeader>

            <FieldGroup>
              <Field>
                <Label>Assign To</Label>
                <Controller
                  control={control}
                  name="employeeId"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((emp) => (
                          <SelectItem key={emp.employeeId} value={emp.employeeId}>
                            {emp.name} — {emp.designation}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              <Field>
                <Label>Task</Label>
                <Input {...register("task", { required: true })} placeholder="Finish quarterly report" />
                {errors.task && <p className="text-xs text-red-600 mt-1">{errors.task.message}</p>}
              </Field>
            </FieldGroup>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {editingId ? "Update Task" : "Assign Task"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove this task assignment. You cannot undo this action.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive! text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
            >
              Delete Task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
