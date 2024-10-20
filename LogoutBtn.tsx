"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "./app/stores/useUserStore";
import { IoMdLogOut } from "react-icons/io";

export function LogoutButton() {
  const router = useRouter();
  const { handleLogout, isLoading } = useUserStore();

  const handleLogoutWithRedirect = async () => {
    await handleLogout();
    router.push("/");
  };

  return (
    <div
      onClick={handleLogoutWithRedirect}
      className="font-semibold text-primary flex items-center gap-1 "
    >
      <IoMdLogOut className="text-lg" />
      <span> {isLoading ? "cargando..." : "Cerrar sesión"}</span>
    </div>
  );
}
