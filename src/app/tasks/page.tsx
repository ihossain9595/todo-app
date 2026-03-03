import { Suspense } from "react";
import TaskList from "@/components/TaskList";

const TasksPage = () => {
  return (
    <section className="max-w-7xl mx-auto">
      <Suspense fallback={<div className="p-10 text-center">Loading Tasks...</div>}>
        <TaskList />
      </Suspense>
    </section>
  );
};

export default TasksPage;
