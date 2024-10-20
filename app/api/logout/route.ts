import { NextResponse } from "next/server";
import { logout } from "@/app/logout";

export async function GET() {
  try {
    const result = await logout();
    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    return NextResponse.json(
      { success: false, error: "Error al cerrar la sesión" },
      { status: 500 }
    );
  }
}
