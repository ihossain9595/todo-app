import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import EmployeeList from "@/components/EmployeeList";

const EmployeesPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <Suspense
        fallback={
          <div className="p-10 text-center">
            <Spinner />
          </div>
        }
      >
        <EmployeeList />
      </Suspense>
    </div>
  );
};

export default EmployeesPage;
