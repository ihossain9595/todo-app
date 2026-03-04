import { z } from "zod";

export const employeeSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  designation: z.string().min(1, "Designation required"),
  emailAddress: z.email("Invalid email"),
  phoneNumber: z.string().min(11, "Invalid phone number"),
});

export type Employee = z.infer<typeof employeeSchema>;

export const taskSchema = z.object({
  id: z.string().optional(),
  employeeId: z.string().min(1),
  task: z.string().min(1, "Task required"),
});

export type Task = z.infer<typeof taskSchema>;
