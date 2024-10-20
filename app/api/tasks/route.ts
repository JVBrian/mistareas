import { Task } from "@/app/data/Tasks";
import { NextResponse } from "next/server";
import { db } from "@/app/db/drizzle";
import { tasksTable } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request
): Promise<
  NextResponse<{ tasks?: Task[]; success: boolean; message: string }>
> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, message: "El id de usuario es obligatorio" });
    }

    const tasks = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.userId, userId));

    return NextResponse.json({
      tasks,
      success: true,
      message: "Tareas recuperadas con éxito",
    });
  } catch (error) {
    console.error("Error al recuperar tareas:", error);
    return NextResponse.json({
      success: false,
      message: "Ha fallado la recuperación de tareas desde el servidor.",
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Usuario indefinido",
      });
    }

    const body: { option: "delete" | "deleteAll"; task?: Task } =
      await request.json();

    const { option, task } = body;

    if (!option) {
      return NextResponse.json({
        success: false,
        message: "La opción no está definida",
      });
    }

    if (option === "delete") {
      if (task) {
        const deletedTask = await db
          .delete(tasksTable)
          .where(eq(tasksTable.id, task.id));

        if (!deletedTask) {
          return NextResponse.json({
            success: false,
            message: "Tarea no encontrada o eliminación fallida",
          });
        }

        return NextResponse.json({
          success: true,
          message: "¡Tarea eliminada exitosamente!",
        });
      }
    }

    if (option === "deleteAll") {
      const deletedAllTasks = await db
        .delete(tasksTable)
        .where(eq(tasksTable.userId, userId));

      if (!deletedAllTasks) {
        return NextResponse.json({
          success: false,
          message: "No se pudieron eliminar todas las tareas",
        });
      }

      return NextResponse.json({
        success: true,
        message: "eliminando todas las tareas",
      });
    }

    return NextResponse.json({
      success: false,
      message: "Opción no válida proporcionada",
    });
  } catch (error) {
    console.log(error);
  }
}

export async function PUT(request: Request) {
  try {
    const body: Task = await request.json();

    const { id, name, priority, status } = body;

    const updatedTask = await db
      .update(tasksTable)
      .set({ name, priority, status })
      .where(eq(tasksTable.id, id))
      .returning();

    if (!updatedTask) {
      return NextResponse.json({
        success: false,
        message: "Tarea no encontrada o actualización fallida",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Tarea actualizada exitosamente",
    });
  } catch (error) {
    console.log(error);
  }
}

export async function POST(
  request: Request
): Promise<NextResponse<{ success: boolean; message: string }>> {
  try {
    const body: Task = await request.json();

    const { id, name, priority, status, userId } = body;

    if (!id || !name || !priority || !status || !userId) {
      return NextResponse.json({
        success: false,
        message: "Todos los campos son obligatorios",
      });
    }

    const result = await db.insert(tasksTable).values({
      id,
      name,
      priority,
      status,
      userId,
    });

    if (result) {
      return NextResponse.json({
        success: true,
        message: "¡La tarea se ha agregado exitosamente!",
      });
    }

    return NextResponse.json({
      success: false,
      message: "¡Error al insertar la tarea!",
    });
  } catch (error) {
    console.error("Error al insertar tarea:", error);
    return NextResponse.json({
      success: false,
      message: `No se pudo crear una tarea en el servidor`,
    });
  }
}
