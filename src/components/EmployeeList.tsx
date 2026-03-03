"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Phone, User } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployeeType, TaskType } from "@/utils/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Employee, employeeSchema } from "@/utils/validators";

import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
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

export default function EmployeeList() {
  const [employees, setEmployees] = useLocalStorage<EmployeeType[]>("employees", []);

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<EmployeeType | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EmployeeType>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      employeeId: "",
      designation: "",
      email: "",
      phone: "",
    },
  });

  const openCreateDialog = () => {
    setEditingId(null);
    reset({ name: "", employeeId: "", designation: "", email: "", phone: "" });
    setOpenDialog(true);
  };

  const openEditDialog = (emp: EmployeeType) => {
    setEditingId(emp.employeeId);
    reset(emp);
    setOpenDialog(true);
  };

  const onSubmit = (data: Employee) => {
    if (editingId) {
      setEmployees(employees.map((e) => (e.employeeId === editingId ? data : e)));
      toast.success("Employee updated successfully!");
    } else {
      const exists = employees.some((e) => e.employeeId === data.employeeId);
      if (exists) {
        toast.error("Duplicate ID", {
          description: "An employee with this ID already exists.",
        });
        return;
      }
      setEmployees([...employees, data]);
      toast.success("Employee created successfully!");
    }

    setOpenDialog(false);
    reset();
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmId) return;

    const id = deleteConfirmId;
    setEmployees((prev) => prev.filter((e) => e.employeeId !== id));

    const raw = window.localStorage.getItem("tasks");
    if (raw) {
      try {
        const tasks = JSON.parse(raw) as TaskType[];
        const filtered = tasks.filter((t) => t.employeeId !== id);
        window.localStorage.setItem("tasks", JSON.stringify(filtered));
      } catch (e) {
        console.error("Failed to sync task deletion", e);
      }
    }

    toast.error("Employee deleted successfully!");
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-4 items-center justify-between">
        <h2 className="text-xl font-semibold">Employees</h2>
        <Button size={"lg"} className="cursor-pointer" onClick={openCreateDialog}>
          Create New Employee
        </Button>
      </div>

      <Card className="p-4">
        {employees.length === 0 ? (
          <p className="text-slate-500 text-center py-4">No employees created yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((e) => (
                <TableRow key={e.employeeId}>
                  <TableCell className="font-medium">{e.name}</TableCell>
                  <TableCell>{e.employeeId}</TableCell>
                  <TableCell>{e.designation}</TableCell>
                  <TableCell>{e.email}</TableCell>
                  <TableCell className="text-right">
                    <div className="text-right space-x-2">
                      <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => setShowPreview(e)}>
                        Preview
                      </Button>
                      <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => openEditDialog(e)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" className="cursor-pointer" onClick={() => setDeleteConfirmId(e.employeeId)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={!!showPreview} onOpenChange={(open) => !open && setShowPreview(null)}>
        <DialogContent className="sm:max-w-md border-none bg-slate-50 p-0 overflow-hidden">
          <div className="h-20 bg-primary" />
          <div className="px-4 pb-4">
            <div className="relative -mt-12 mb-4 flex flex-col items-center">
              <div className="h-16 w-16 rounded-full border-4 border-white bg-white flex items-center justify-center text-slate-500 shadow-sm overflow-hidden mb-2">
                <span className="text-xl font-bold uppercase">{showPreview?.name.substring(0, 2)}</span>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-1">{showPreview?.name}</h3>
                <p className="text-sm font-medium text-primary">{showPreview?.designation}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="bg-white border rounded-lg flex items-center gap-2 p-2">
                <div className="h-10 w-10 bg-slate-100 rounded-md flex items-center justify-center">
                  <User className="size-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Employee ID</p>
                  <p className="text-sm font-semibold">{showPreview?.employeeId}</p>
                </div>
              </div>

              <div className="bg-white border rounded-lg flex items-center gap-2 p-2">
                <div className="h-10 w-10 bg-slate-100 rounded-md flex items-center justify-center">
                  <Mail className="size-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Email Address</p>
                  <p className="text-sm font-semibold">{showPreview?.email}</p>
                </div>
              </div>

              <div className="bg-white border rounded-lg flex items-center gap-2 p-2">
                <div className="h-10 w-10 bg-slate-100 rounded-md flex items-center justify-center">
                  <Phone className="size-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Phone Number</p>
                  <p className="text-sm font-semibold">{showPreview?.phone}</p>
                </div>
              </div>
            </div>
            <Button className="w-full mt-4" onClick={() => setShowPreview(null)}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Employee" : "Create Employee"}</DialogTitle>
              <DialogDescription>Fill in the details below. Click save when you&apos;re done.</DialogDescription>
            </DialogHeader>

            <FieldGroup>
              <Field>
                <Label>Name</Label>
                <Input {...register("name")} placeholder="Employee name" />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
              </Field>
              <Field>
                <Label>Employee ID</Label>
                <Input {...register("employeeId")} placeholder="ID (Unique)" disabled={!!editingId} />
                {errors.employeeId && <p className="text-xs text-red-600 mt-1">{errors.employeeId.message}</p>}
              </Field>
              <Field>
                <Label>Designation</Label>
                <Input {...register("designation")} placeholder="Designation" />
                {errors.designation && <p className="text-xs text-red-600 mt-1">{errors.designation.message}</p>}
              </Field>
              <Field>
                <Label>Email</Label>
                <Input {...register("email")} placeholder="email@example.com" />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
              </Field>
              <Field>
                <Label>Phone</Label>
                <Input {...register("phone")} placeholder="+8801XXXXXXXXX" />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>}
              </Field>
            </FieldGroup>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {editingId ? "Update Employee" : "Create Employee"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the employee profile and <strong>remove all tasks</strong> assigned to them.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive! text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
            >
              Delete Employee
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
