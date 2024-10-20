import { create } from "zustand";
import { Result } from "../api/signin/route";

type User = {
  id: string;
  email: string;
};
interface UserStoreInterface {
  user: User | null;
  setUser: (newUser: User | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  handleLogout: () => Promise<void>;
  validateUser: () => Promise<boolean>;

  // Iniciar sesión
  loginFunction: (data: {
    email: string;
    password: string;
  }) => Promise<{ result?: Result; error?: string; isLoggedIn: boolean }>;
  // Registrarse
  signUpFunction: (data: {
    email: string;
    password: string;
  }) => Promise<{ result?: Result; error?: string }>;
}

export const useUserStore = create<UserStoreInterface>((set) => {
  return {
    user: null,
    isLoading: false,
    setUser: (newUser: User | null) => {
      set({ user: newUser });
    },

    setIsLoading: (isLoading: boolean) => {
      set({ isLoading: isLoading });
    },

    validateUser: async () => {
      try {
        set({ isLoading: true });
        const response = await fetch("/api/validate-user");
        const data = await response.json();

        if (data.isAuthenticated) {
          set({ user: data.user });
          return true;
        } else {
          set({ user: null });
          return false;
        }
      } catch (error) {
        console.error("Error en la validación:", error);
        set({ user: null });
        return false;
      } finally {
        set({ isLoading: false });
      }
    },

    handleLogout: async () => {
      try {
        set({ isLoading: true });
        const response = await fetch("/api/logout", { method: "GET" });
        const data = await response.json();
        if (data.success) {
          set({ user: null });
        } else {
          throw new Error(data.error || "Error al cerrar sesión");
        }
      } catch (error) {
        console.error("Error al desloguearse:", error);
      } finally {
        set({ isLoading: false });
      }
    },

    loginFunction: async (data: { email: string; password: string }) => {
      set({ isLoading: true });

      try {
        const response = await fetch("/api/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email, password: data.password }),
        });

        const result: Result = await response.json();

        if ("success" in result && result.success === true) {
          return { result, isLoggedIn: true };
        } else if ("error" in result) {
          return { error: result.error || "Error al iniciar sesión", isLoggedIn: false };
        }
      } catch (error) {
        console.log("Error al iniciar sesión", error);
        return { error: "Ha ocurrido un error", isLoggedIn: false };
      } finally {
        set({ isLoading: false });
      }

      return { error: "El error no está definido", isLoggedIn: false };
    },

    signUpFunction: async (data: { email: string; password: string }) => {
      set({ isLoading: true });

      try {
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email, password: data.password }),
        });

        const result: Result = await response.json();

        if ("success" in result && result.success) {
          return { result };
        } else if ("error" in result && result.error) {
          return { error: result.error };
        }
      } catch (error) {
        console.log("Error al iniciar sesión", error);
        return { error: "Ha ocurrido un error desconocido" };
      } finally {
        set({ isLoading: false });
      }

      return { error: "Error desconocido" };
    },
  };
});
