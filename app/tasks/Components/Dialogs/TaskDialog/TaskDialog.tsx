"use client";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { TaskForm } from "./TaskForm";
import { FaPlus } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useTasksStore } from "@/app/stores/useTasksStore";
import { nanoid } from "nanoid";
import { Task } from "@/app/data/Tasks";
import { toast } from "@/hooks/use-toast";
import { useUserStore } from "@/app/stores/useUserStore";

const taskFormSchema = z.object({
  taskName: z
    .string()
    .min(3, { message: "El nombre de la tarea debe tener al menos 3 caracteres." }),
  priority: z.enum(["low", "medium", "high"], {
    errorMap: () => ({ message: "Por favor seleccione una prioridad" }),
  }),
  status: z.enum(["in progress", "completed"], {
    errorMap: () => ({ message: "Por favor seleccione un estado" }),
  }),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export function TasksDialog() {
  const methods = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
  });

  const {
    addNewTask,
    updateTaskFunction,
    isLoading,
    isTaskDialogOpened,
    setIsTaskDialogOpened,
    tasks,
    taskSelected,
    setTaskSelected,
  } = useTasksStore();

  const { user } = useUserStore();

  async function onSubmit(data: TaskFormValues) {
    const findTask = tasks.find(
      (task) => task.name.toLowerCase() === data.taskName.toLowerCase()
    );

    if (findTask && !taskSelected) {
      methods.setError("taskName", {
        type: "manual",
        message: `Una tarea con el nombre "${data.taskName}" ya existe.`,
      });

      toast({
        variant: "destructive",
        title: "La tarea ya existe",
        description: `Una tarea con el nombre "${data.taskName}" ya existe.`,
      });

      methods.setFocus("taskName");

      return;
    }

    if (!taskSelected) {
      const newTask: Task = {
        id: nanoid(),
        name: data.taskName,
        priority: data.priority,
        status: data.status,
        userId: user?.id || "",
      };

      const result = await addNewTask(newTask);

      if (result.success) {
        toast({
          title: "Tarea agregada",
          description: `La tarea "${newTask.name}" se ha agregado correctamente.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Se produjo un error al agregar la tarea.",
        });
      }
    } else {
      const updatedTask: Task = {
        ...taskSelected,
        name: data.taskName,
        status: data.status,
        priority: data.priority,
      };

      const result = await updateTaskFunction(updatedTask);

      if (result.success) {
        toast({
          title: "Tarea actualizada",
          description: `La tarea se ha actualizado correctamente.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Hubo un error al actualizar la tarea.",
        });
      }
    }
    setTaskSelected(null);
    setIsTaskDialogOpened(false);
  }

  function handleDialogStateChange(isOpen: boolean) {
    setIsTaskDialogOpened(isOpen);
    if (!isOpen) {
      methods.reset();
      setTaskSelected(null);
    }
  }

  useEffect(() => {
    if (isTaskDialogOpened) {
      if (taskSelected) {
        methods.setValue("taskName", taskSelected.name);
        methods.setValue("priority", taskSelected.priority);
        methods.trigger("priority");
        methods.setValue("status", taskSelected.status);
        methods.trigger("status");
      } else {
        methods.reset();
      }
    }
  }, [isTaskDialogOpened]);

  return (
    <Dialog open={isTaskDialogOpened} onOpenChange={handleDialogStateChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1">
          <FaPlus />
          <span>Nueva tarea</span>
        </Button>
      </DialogTrigger>
      <FormProvider {...methods}>
        <DialogContent className="p-7 poppins">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {taskSelected ? "Editar tarea" : "Agregar tarea"}
            </DialogTitle>
            <DialogDescription>
              {`Agregue una nueva tarea aquí. Haga clic en guardar cuando haya terminado.`}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <TaskForm />
            <DialogFooter className="mt-11">
              <Button type="submit" className="flex items-center gap-1">
                {isLoading ? (
                  <div>cargando...</div>
                ) : (
                  <div className="flex items-center gap-1">
                    <span>Guardar tarea</span>
                  </div>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
