"use client";

import Link from "next/link";
import { EmployeeType, TaskType } from "@/utils/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Users, ClipboardList, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HomePage = () => {
  const [employees] = useLocalStorage<EmployeeType[]>("employees", []);
  const [tasks] = useLocalStorage<TaskType[]>("tasks", []);

  const stats = [
    {
      label: "Total Employees",
      value: employees.length,
      icon: <Users className="h-5 w-5 text-blue-600" />,
      color: "bg-blue-100",
    },
    {
      label: "Active Tasks",
      value: tasks.length,
      icon: <ClipboardList className="h-5 w-5 text-green-600" />,
      color: "bg-green-100",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-10">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Todo App</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Streamline your team&apos;s workflow. Manage employee profiles and track task assignments in one centralized dashboard.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center px-4 gap-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>{stat.icon}</div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/employees" className="group">
          <Card className="h-full transition-all cursor-pointer gap-1">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Employees
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">Add, edit, and preview your employees.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/tasks" className="group">
          <Card className="h-full transition-all cursor-pointer gap-1">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Task Board
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">View and manage all currently assigned tasks.</p>
            </CardContent>
          </Card>
        </Link>

        <div className="flex flex-col gap-4">
          <Button asChild size="lg" className="w-full">
            <Link href="/tasks?assign=true" className="flex items-center gap-2">
              Assign New Task
            </Link>
          </Button>
          <p className="text-xs text-center text-slate-400 italic">Data is stored locally in your browser.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
