import { useTasksStore } from "@/app/stores/useTasksStore";
import { useUserStore } from "@/app/stores/useUserStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export function DeleteDialog() {
  const {
    openDeleteDialog,
    setOpenDeleteDialog,
    taskSelected,
    setTaskSelected,
    deleteTaskFunction,
    isLoading,
    tasks,
  } = useTasksStore();

  const [message, setMessage] = useState("");
  const { user } = useUserStore();

  function handleOpenChange(open: boolean) {
    if (open) {
      setOpenDeleteDialog(open);
    }
  }

  useEffect(() => {
    if (taskSelected) {
      setMessage(`Esta acción no se puede deshacer. Esto eliminará permanentemente la tarea. 
      [${taskSelected.name}] ¡Y elimínelo del servidor!`);
    } else {
      setMessage(`Esta acción no se puede deshacer. Esto eliminará permanentemente todas las tareas.
            ¡Y elimínelos del servidor!`);
    }
  }, [taskSelected]);

  async function deleteFunction() {
    if (taskSelected) {
      const result = await deleteTaskFunction("delete", user, taskSelected);

      if (result.success) {
        toast({
          title: "Tarea eliminada",
          description: `La tarea se ha eliminado correctamente.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Se produjo un error al eliminar la tarea.",
        });
      }
    } else {
      const result = await deleteTaskFunction("deleteAll", user);

      if (result.success) {
        toast({
          title: "Tareas eliminadas",
          description: `Todas las tareas se han eliminado correctamente.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Se produjo un error al eliminar tareas.",
        });
      }
    }
    setTaskSelected(null);
    setOpenDeleteDialog(false);
  }

  return (
    <AlertDialog open={openDeleteDialog} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger disabled={tasks.length === 0}>
        <Button variant="link" disabled={tasks.length === 0}>
          Limpiar todos
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-7">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            ¿Estás absolutamente seguro?
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-7">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-7">
          <AlertDialogCancel
            onClick={() => {
              setTaskSelected(null);
              setOpenDeleteDialog(false);
            }}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={deleteFunction}>
            {isLoading ? "Cargando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
