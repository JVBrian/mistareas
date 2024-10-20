"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useUserStore } from "../stores/useUserStore";
import { TaskHeader } from "./Components/TaskHeader/TaskHeader";
import Stats from "./Components/Stats/Stats";
import { TasksArea } from "./Components/TasksArea/TasksArea";
import { TasksFooter } from "./Components/TaskFooter/TaskFooter";
import { TasksDialog } from "./Components/Dialogs/TaskDialog/TaskDialog";

export default function Dashboard() {
  const router = useRouter(); // Next.js router for redirection
  const { user, validateUser } = useUserStore();

  useEffect(() => {
    const checkUser = async () => {
      const isAuthenticated = await validateUser();

      if (!isAuthenticated) {
        router.push("/");
      }
    };

    checkUser();
  }, [router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen border flex items-center w-full justify-center poppins  ">
      <div
        className="sm:w-[55%] w-[90%] mt-2   border border-gray-400 flex flex-col md:gap-6 bg-inherit shadow-md 
      rounded-md md:p-8 p-6"
      >
        <TaskHeader />
        <Stats />
        <AllTasksHeader />
        <TasksArea />
        <TasksFooter />
      </div>
    </div>
  );
}

function AllTasksHeader() {
  return (
    <div className="flex justify-between items-center mt-4 mb-3">
      <div className="flex flex-col gap-1">
        <h2 className="md:text-xl font-semibold">{`Tareas de hoy`}</h2>
        <p className="text-sm text-gray-400">{formatDate()}</p>
      </div>

      <TasksDialog />
    </div>
  );
}

function formatDate(date: Date = new Date()): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return date.toLocaleDateString("es-ES", options);
}
