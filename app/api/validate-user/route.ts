import { NextResponse } from "next/server";
import { validateRequest } from "@/app/auth";

export async function GET() {
  try {
    const user = await validateRequest();

    if (!user || !user.user) {
      return NextResponse.json({ isAuthenticated: false }, { status: 401 });
    }
    return NextResponse.json({
      isAuthenticated: true,
      user: {
        id: user.user.id,
        email: user.user.email,
      },
    });
  } catch (error) {
    console.error("Error al validar:", error);
    return NextResponse.json(
      { isAuthenticated: false, error: "La validación ha fallado" },
      { status: 500 }
    );
  }
}
