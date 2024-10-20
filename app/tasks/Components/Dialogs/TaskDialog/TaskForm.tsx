import { useTasksStore } from "@/app/stores/useTasksStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { FieldErrors, FieldValues, useFormContext } from "react-hook-form";
import { BiSolidError } from "react-icons/bi";
import { FaCircle } from "react-icons/fa6";

export function TaskForm() {
  return (
    <div className="flex flex-col gap-6 mt-8">
      <TaskName />
      <div className="grid grid-cols-2 gap-6">
        <TaskPriority />
        <TaskStatus />
      </div>
    </div>
  );
}

function TaskName() {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div>
      <Label htmlFor="taskName">Nombre de tarea</Label>
      <Input
        {...register("taskName")}
        id="taskName"
        type="text"
        placeholder="Ingrese un nombre de la tarea"
        className="mt-1"
      />

      {errors["taskName"] && <ShowError label="taskName" errors={errors} />}
    </div>
  );
}

function TaskPriority() {
  const {
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext();

  const { isTaskDialogOpened, taskSelected } = useTasksStore();

  const selectedPriority = watch("priority") || "low";

  useEffect(() => {
    if (isTaskDialogOpened && !taskSelected) {
      setValue("priority", "low");
      trigger("priority");
    }
  }, [isTaskDialogOpened, trigger]);

  const handlePriorityChange = (value: string) => {
    setValue("priority", value);
    trigger("priority");
  };

  return (
    <div>
      <Label className="mb-1">Prioridad</Label>

      <Select value={selectedPriority} onValueChange={handlePriorityChange}>
        <SelectTrigger className="w-full mt-1">
          <SelectValue placeholder="Select a priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="low" className="">
              <div className="flex items-center gap-1 ">
                <FaCircle className="text-[12px] text-green-600" />
                <span>Baja</span>
              </div>
            </SelectItem>
            <SelectItem value="medium">
              <div className="flex items-center gap-1 ">
                <FaCircle className="text-[12px] text-yellow-600" />
                <span>Media</span>
              </div>
            </SelectItem>
            <SelectItem value="high">
              <div className="flex items-center gap-1 ">
                <FaCircle className="text-[12px] text-red-600" />
                <span>Alta</span>
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {errors["priority"] && <ShowError label="priority" errors={errors} />}
    </div>
  );
}

function TaskStatus() {
  const {
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext();

  const { isTaskDialogOpened, taskSelected } = useTasksStore();

  const selectedStatus = watch("status") || "in progress";
  console.log(selectedStatus);
 
  useEffect(() => {
    if (isTaskDialogOpened && !taskSelected) {
      setValue("status", "in progress");
      trigger("status");
    }
  }, [isTaskDialogOpened, trigger]);

  function handleStatusChange(value: string) {
    console.log(value);
    setValue("status", value);
    trigger("status");
  }

  return (
    <div>
      <Label className="mb-1">Seleccionar estado</Label>
      <Select value={selectedStatus} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-full mt-1">
          <SelectValue placeholder="Select a status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="in progress">En progreso</SelectItem>
            <SelectItem value="completed">Completadas</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {errors["status"] && <ShowError label="status" errors={errors} />}
    </div>
  );
}

function ShowError({
  label,
  errors,
}: {
  errors: FieldErrors<FieldValues>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1 text-red-500 mt-2">
      <BiSolidError className="text-sm" />
      <p className="text-red-500 text-sm">
        <>{errors[label]?.message}</>
      </p>
    </div>
  );
}
