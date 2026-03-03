"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleCheckBig } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <div className="size-8 flex items-center justify-center bg-primary rounded-lg">
            <CircleCheckBig strokeWidth={2.8} className="size-4 text-primary-foreground" />
          </div>
          Todo App
        </Link>

        <nav className="flex gap-2.5">
          <Button size={"lg"} variant={pathname.startsWith("/employees") ? "default" : "secondary"} asChild>
            <Link href="/employees">Employees</Link>
          </Button>
          <Button size={"lg"} variant={pathname.startsWith("/tasks") ? "default" : "secondary"} asChild>
            <Link href="/tasks">Tasks</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
