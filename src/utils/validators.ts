import { z } from "zod";

export const employeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  employeeId: z.string().min(1, "Employee ID is required"),
  designation: z.string().min(1, "Designation required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(7, "Invalid phone number"),
});

export type Employee = z.infer<typeof employeeSchema>;

export const taskSchema = z.object({
  id: z.string().optional(),
  employeeId: z.string().min(1),
  task: z.string().min(1, "Task required"),
});

export type Task = z.infer<typeof taskSchema>;
