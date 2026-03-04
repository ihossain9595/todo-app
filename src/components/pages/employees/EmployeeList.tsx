"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { employeeSchema } from "@/utils/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { TableColumn } from "react-data-table-component";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { EmployeeFormValues, EmployeeType, TaskType } from "@/utils/types";

import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/SectionHeader";
import FormDialog, { FormFieldConfig } from "@/components/dialogs/FormDialog";
import DeleteDialog from "@/components/dialogs/DeleteDialog";
import PreviewDialog from "@/components/dialogs/PreviewDialog";

const DEFAULT_EMPLOYEE_VALUES = {
  employeeId: "",
  fullName: "",
  designation: "",
  emailAddress: "",
  phoneNumber: "",
};

const EMPLOYEE_FIELDS = [
  { name: "employeeId", label: "Employee ID", placeholder: "ID (Unique)", fieldType: "input" },
  { name: "fullName", label: "Full Name", placeholder: "John Doe", fieldType: "input" },
  { name: "designation", label: "Designation", placeholder: "Developer", fieldType: "input" },
  { name: "emailAddress", label: "Email", type: "email", placeholder: "email@example.com", fieldType: "input" },
  { name: "phoneNumber", label: "Phone", placeholder: "01XXXXXXXXX", fieldType: "input" },
] as FormFieldConfig<EmployeeFormValues>[];

export default function EmployeeList() {
  const [employees, setEmployees] = useLocalStorage<EmployeeType[]>("employees", []);

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<EmployeeFormValues | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: DEFAULT_EMPLOYEE_VALUES,
  });

  const openCreateDialog = () => {
    setEditingId(null);
    reset(DEFAULT_EMPLOYEE_VALUES);
    setOpenDialog(true);
  };

  const openEditDialog = (emp: EmployeeFormValues) => {
    setEditingId(emp.employeeId);
    reset(emp);
    setOpenDialog(true);
  };

  const onSubmit = (data: EmployeeFormValues) => {
    const now = new Date().toISOString();

    if (editingId) {
      setEmployees(employees.map((e) => (e.employeeId === editingId ? { ...data, createdAt: e.createdAt, updatedAt: now } : e)));
      toast.success("Employee updated successfully!");
    } else {
      const exists = employees.some((e) => e.employeeId === data.employeeId);
      if (exists) {
        toast.error("Duplicate ID", {
          description: "An employee with this ID already exists.",
        });
        return;
      }
      setEmployees([...employees, { ...data, createdAt: now, updatedAt: now }]);
      toast.success("Employee created successfully!");
    }

    setOpenDialog(false);
    reset();
  };

  const handleDelete = () => {
    if (!deleteConfirmId) return;

    const id = deleteConfirmId;
    setEmployees((prev) => prev.filter((e) => e.employeeId !== id));

    const raw = window.localStorage.getItem("tasks");
    if (raw) {
      try {
        const tasks = JSON.parse(raw) as TaskType[];
        const filtered = tasks.map((t) => {
          if (t.employeeId === id) {
            return { ...t, employeeId: null };
          } else {
            return t;
          }
        });
        window.localStorage.setItem("tasks", JSON.stringify(filtered));
      } catch (e) {
        console.error("Failed to sync task deletion", e);
      }
    }

    toast.error("Employee deleted successfully!");
    setDeleteConfirmId(null);
  };

  const columns: TableColumn<EmployeeFormValues>[] = [
    {
      name: "ID",
      selector: (row) => row.employeeId,
      sortable: true,
    },
    {
      name: "Full Name",
      selector: (row) => row.fullName,
      cell: (row) => row.fullName,
      sortable: true,
    },
    {
      name: "Designation",
      selector: (row) => row.designation,
      sortable: true,
    },
    {
      name: "Email Address",
      selector: (row) => row.emailAddress,
    },
    {
      name: "Phone Number",
      selector: (row) => row.phoneNumber,
    },
    {
      name: <div className="w-full text-right">Actions</div>,
      cell: (row) => (
        <div className="w-full flex justify-end gap-2">
          <Button variant="outline" size="icon-sm" className="cursor-pointer" onClick={() => setShowPreview(row)}>
            <Eye className="size-3.5" />
          </Button>
          <Button variant="outline" size="icon-sm" className="cursor-pointer" onClick={() => openEditDialog(row)}>
            <Pencil className="size-3.5" />
          </Button>
          <Button variant="destructive" size="icon-sm" className="cursor-pointer" onClick={() => setDeleteConfirmId(row.employeeId)}>
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <SectionHeader title="Employees" buttonLabel="Create New Employee" onButtonClick={openCreateDialog} />

      <DataTable
        columns={columns}
        data={[...employees].sort((a, b) => new Date(b?.updatedAt).getTime() - new Date(a?.updatedAt).getTime())}
        emptyMessage="No employees created yet."
      />

      <FormDialog<EmployeeFormValues>
        open={openDialog}
        onOpenChange={setOpenDialog}
        title={editingId ? "Update Employee" : "Create Employee"}
        description={`Fill in the details below. Click ${editingId ? "update" : "create"} when you're done.`}
        fields={EMPLOYEE_FIELDS.map((f) => ({
          ...f,
          disabled: f.name === "employeeId" ? !!editingId : false,
        }))}
        control={control}
        onSubmit={handleSubmit(onSubmit)}
        onCancel={() => setOpenDialog(false)}
        submitLabel={editingId ? "Update Employee" : "Create Employee"}
        isSubmitting={isSubmitting}
      />

      <DeleteDialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
        description="This action cannot be undone. This will permanently delete the employee."
        onDelete={handleDelete}
      />

      <PreviewDialog
        open={!!showPreview}
        onOpenChange={(open) => !open && setShowPreview(null)}
        previewData={showPreview}
        onClose={() => setShowPreview(null)}
      />
    </div>
  );
}
