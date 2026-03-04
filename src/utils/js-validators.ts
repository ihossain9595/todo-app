import { Resolver } from "react-hook-form";
import { EmployeeFormValues } from "@/utils/types";

export const employeeResolver: Resolver<EmployeeFormValues> = async (values) => {
  const errors: Record<string, { type: string; message: string }> = {};

  if (!values.employeeId.trim()) {
    errors.employeeId = { type: "required", message: "Employee ID is required" };
  }

  if (!values.fullName.trim() || values.fullName.length < 2) {
    errors.fullName = { type: "minLength", message: "Name must be at least 2 characters" };
  }

  if (!values.designation.trim()) {
    errors.designation = { type: "required", message: "Designation is required" };
  }

  if (!values.emailAddress.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.emailAddress)) {
    errors.emailAddress = { type: "pattern", message: "Invalid email address" };
  }

  if (!values.phoneNumber.trim() || values.phoneNumber.length < 11) {
    errors.phoneNumber = { type: "minLength", message: "Invalid phone number" };
  }

  return {
    values: Object.keys(errors).length === 0 ? values : {},
    errors,
  };
};
