"use client";

import { v4 as uuidv4 } from "uuid";
import { taskSchema } from "@/utils/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { EmployeeType, TaskFormValues, TaskType } from "@/utils/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/SectionHeader";
import DeleteDialog from "@/components/dialogs/DeleteDialog";
import FormDialog, { FormFieldConfig } from "@/components/dialogs/FormDialog";
import DataTable from "@/components/DataTable";
import { TableColumn } from "react-data-table-component";
import { Pencil, Trash2 } from "lucide-react";

const DEFAULT_TASK_VALUES = {
  employeeId: "",
  task: "",
};

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
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: DEFAULT_TASK_VALUES,
  });

  const employeeOptions = useMemo(() => employees.map((e) => ({ value: e.employeeId, label: `${e.fullName} — ${e.designation}` })), [employees]);

  const TASK_FIELDS: FormFieldConfig<TaskFormValues>[] = useMemo(
    () => [
      {
        fieldType: "select",
        name: "employeeId",
        label: "Assign To",
        placeholder: "Select an employee",
        options: employeeOptions,
      },
      {
        fieldType: "input",
        name: "task",
        label: "Task",
        placeholder: "Finish quarterly report",
      },
    ],
    [employeeOptions],
  );

  const clearParams = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("assign");
    const queryString = params.toString();
    router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const openCreateDialog = useCallback(() => {
    setEditingId(null);
    reset(DEFAULT_TASK_VALUES);
    setOpenDialog(true);
  }, [reset]);

  const openEditDialog = (task: TaskType) => {
    setEditingId(task.id);
    reset({ employeeId: task.employeeId ?? "", task: task.task });
    setOpenDialog(true);
  };

  const onSubmit = (data: TaskFormValues) => {
    const now = new Date().toISOString();

    if (editingId) {
      setTasks(tasks.map((t) => (t.id === editingId ? { ...data, createdAt: t.createdAt, updatedAt: now, id: editingId } : t)));
      toast.success("Task updated successfully!");
    } else {
      setTasks([...tasks, { ...data, id: uuidv4(), createdAt: now, updatedAt: now }]);
      toast.success("Task assigned successfully!", {
        description: `Task: ${data.task.substring(0, 30)}${data.task.length > 30 ? "..." : ""}`,
      });
    }

    setOpenDialog(false);
    reset(DEFAULT_TASK_VALUES);
  };

  const handleDelete = () => {
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

  const columns: TableColumn<TaskType>[] = [
    {
      name: "Task",
      selector: (row) => row.task,
      cell: (row) => <span className="whitespace-normal">{row.task}</span>,
      sortable: true,
      grow: 2,
    },
    {
      name: "Assigned To",
      selector: (row) => row.employeeId ?? "",
      cell: (row) => {
        const emp = employees.find((e) => e.employeeId === row.employeeId);
        return emp ? emp.fullName : <span className="text-slate-400">Unassigned</span>;
      },
      sortable: true,
    },
    {
      name: <div className="w-full text-right">Actions</div>,
      cell: (row) => (
        <div className="w-full flex justify-end gap-2">
          <Button variant="outline" size="icon-sm" className="cursor-pointer" onClick={() => openEditDialog(row)}>
            <Pencil className="size-3.5" />
          </Button>
          <Button variant="destructive" size="icon-sm" className="cursor-pointer" onClick={() => setDeleteConfirmId(row.id)}>
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <SectionHeader title="Tasks" buttonLabel="Create New Task" onButtonClick={openCreateDialog} />

      <DataTable
        columns={columns}
        data={[...tasks].sort((a, b) => new Date(b?.updatedAt).getTime() - new Date(a?.updatedAt).getTime())}
        emptyMessage="No tasks assigned yet."
      />

      <FormDialog<TaskFormValues>
        open={openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open);
          if (!open) clearParams();
        }}
        title={editingId ? "Update Task" : "Assign New Task"}
        description="Select an employee and describe the task requirements."
        fields={TASK_FIELDS}
        control={control}
        onSubmit={handleSubmit(onSubmit)}
        onCancel={() => setOpenDialog(false)}
        submitLabel={editingId ? "Update Task" : "Assign Task"}
        isSubmitting={isSubmitting}
      />

      <DeleteDialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
        description="This action cannot be undone. This will permanently delete the task."
        onDelete={handleDelete}
      />
    </div>
  );
}
