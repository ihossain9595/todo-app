import { Suspense } from "react";
import TaskList from "@/components/TaskList";
import { Spinner } from "@/components/ui/spinner";

const TasksPage = () => {
  return (
    <section className="max-w-7xl mx-auto">
      <Suspense
        fallback={
          <div className="p-10 text-center">
            <Spinner />
          </div>
        }
      >
        <TaskList />
      </Suspense>
    </section>
  );
};

export default TasksPage;
