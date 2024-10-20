import { create } from "zustand";
import { Task } from "../data/Tasks";

interface useTasksStoreInterface {
  isTaskDialogOpened: boolean;
  setIsTaskDialogOpened: (isTaskDialogOpened: boolean) => void;
  taskSelected: Task | null;
  setTaskSelected: (task: Task | null) => void;
  tasks: Task[];
  allTasks: Task[];
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  openDeleteDialog: boolean;
  setOpenDeleteDialog: (isOpenDeleteDialog: boolean) => void;
  setTasks: (tasks: Task[]) => void;
  setAllTasks: (tasks: Task[]) => void;

  fetchTasks: (
    userId: { id: string; email: string } | null
  ) => Promise<{ success: boolean; message: string }>;

  updateTaskFunction: (
    task: Task
  ) => Promise<{ success: boolean; message: string }>;

  deleteTaskFunction: (
    option: "delete" | "deleteAll",
    user: { id: string; email: string } | null,
    task?: Task
  ) => Promise<{ success: boolean; message: string }>;

  addNewTask: (
    task: Task
  ) => Promise<{ success: boolean; message: string; task: Task }>;
}

export const useTasksStore = create<useTasksStoreInterface>((set, get) => ({
  isTaskDialogOpened: false,
  setIsTaskDialogOpened: (isTaskDialogOpened: boolean) => set({ isTaskDialogOpened }),
  tasks: [],
  allTasks: [],
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  openDeleteDialog: false,
  setOpenDeleteDialog: (openDeleteDialog: boolean) => set({ openDeleteDialog }),
  taskSelected: null,
  setTaskSelected: (task: Task | null) => set({ taskSelected: task }),
  setTasks: (tasks: Task[]) => set({ tasks }),
  setAllTasks: (tasks: Task[]) => set({ allTasks: tasks, tasks }),

  fetchTasks: async (user) => {
    try {
      set({ isLoading: true });

      if (!user) {
        return { success: false, message: "ID de usuario indefinido" };
      }

      const response = await fetch(`/api/tasks?userId=${user.id}`, {
        method: "GET",
      });

      const results: { tasks?: Task[]; success: boolean; message: string } =
        await response.json();

      if (!results.success || !results.tasks) {
        return { success: false, message: "error al obtener la data" };
      }

      const sortedTasks = sortTasksByCompleted(results.tasks);
      set({ tasks: sortedTasks, allTasks: sortedTasks });

      return { success: true, message: "Tareas recuperadas exitosamente" };
    } catch (error) {
      console.error("Error al recuperar tareas:", error);
      return { success: false, message: "Error al obtener datos" };
    } finally {
      set({ isLoading: false });
    }
  },

  updateTaskFunction: async (task: Task) => {
    try {
      set({ isLoading: true });

      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      const results: { success: boolean; message: string } =
        await response.json();

      if (!results.success) {
        return { success: false, message: "La tarea no se ha actualizado" };
      }

      const currentTasks = get().tasks;
      const currentAllTasks = get().allTasks;

      const updateTasks = (taskList: Task[]) =>
        taskList.map((t) => (t.id === task.id ? { ...t, ...task } : t));

      set({
        tasks: sortTasksByCompleted(updateTasks(currentTasks)),
        allTasks: sortTasksByCompleted(updateTasks(currentAllTasks)),
      });

      return { success: true, message: "Tarea actualizada satisfactoriamente" };
    } catch (error) {
      return { success: false, message: `La tarea no se pudo actualizar, ${error}` };
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTaskFunction: async (option, user, task) => {
    try {
      set({ isLoading: true });

      if (!user) {
        return { success: false, message: "El usuario no está definido" };
      }

      const response = await fetch(`/api/tasks?userId=${user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ option: option, task: task }),
      });

      const results: { success: boolean; message: string } =
        await response.json();

      if (!results.success) {
        return { success: false, message: results.message };
      }

      const currentTasks = get().tasks;
      const currentAllTasks = get().allTasks;

      if (option === "delete" && task) {
        const updateTasks = (taskList: Task[]) =>
          taskList.filter((t) => t.id !== task.id);
        set({
          tasks: sortTasksByCompleted(updateTasks(currentTasks)),
          allTasks: sortTasksByCompleted(updateTasks(currentAllTasks)),
        });
      }

      if (option === "deleteAll") {
        set({ tasks: [], allTasks: [] });
      }

      return { success: true, message: results.message };
    } catch (error) {
      return { success: false, message: `Error al eliminar la tarea: ${error}` };
    } finally {
      set({ isLoading: false });
    }
  },

  addNewTask: async (task: Task) => {
    try {
      set({ isLoading: true });
      const currentTasks = get().tasks;
      const currentAllTasks = get().allTasks;

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      const results: { success: boolean; message: string } =
        await response.json();

      if (!results.success) {
        throw new Error(results.message);
      }

      const updatedTasks = [...currentTasks, task];
      const updatedAllTasks = [...currentAllTasks, task];

      set({
        tasks: sortTasksByCompleted(updatedTasks),
        allTasks: sortTasksByCompleted(updatedAllTasks),
      });

      return { success: true, message: "Tarea agregada satisfactoriamente", task };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Error al agregar tarea", task };
    } finally {
      set({ isLoading: false });
    }
  },
}));

function sortTasksByCompleted(tasks: Task[]): Task[] {
  return tasks.sort((a, b) => {
    if (a.status === "in progress" && b.status !== "in progress") {
      return -1;
    }
    if (a.status !== "in progress" && b.status === "in progress") {
      return 1;
    }
    return 0;
  });
}