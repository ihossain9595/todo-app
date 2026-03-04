export type EmployeeType = {
  employeeId: string;
  fullName: string;
  designation: string;
  emailAddress: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
};

export type EmployeeFormValues = Omit<EmployeeType, "createdAt" | "updatedAt">;

export type TaskType = {
  id: string;
  employeeId: string;
  task: string;
  createdAt: string;
  updatedAt: string;
};

export type TaskFormValues = Omit<TaskType, "id" | "createdAt" | "updatedAt">;
