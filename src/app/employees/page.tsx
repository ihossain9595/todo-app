import { Suspense } from "react";
import EmployeeList from "@/components/EmployeeList";

const EmployeesPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <Suspense fallback={<div className="p-10 text-center">Loading Tasks...</div>}>
        <EmployeeList />
      </Suspense>
    </div>
  );
};

export default EmployeesPage;
