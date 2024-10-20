import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { IoSearchSharp } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { useTasksStore } from "@/app/stores/useTasksStore";

export function SearchButton() {
  const [searchTerm, setSearchTerm] = useState("");
  const { allTasks, setTasks } = useTasksStore();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === "") {
      // Si el término de búsqueda está vacío, restauramos todas las tareas
      setTasks(allTasks);
    } else {
      // Filtramos las tareas basadas en el término de búsqueda
      const filteredTasks = allTasks.filter(task => 
        task.name.toLowerCase().includes(term)
      );
      setTasks(filteredTasks);
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="ghost" aria-label="buscar">
          <IoSearchSharp className="text-[20px]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Input
          id="search"
          placeholder="Buscar una tarea..."
          className="mt-2"
          value={searchTerm}
          onChange={handleSearch}
        />
      </PopoverContent>
    </Popover>
  );
}