import { FaCheckDouble } from "react-icons/fa6";

export const description =
  "Un formulario de inicio de sesión sencillo con correo electrónico y contraseña. El botón de enviar dice Iniciar sesión";

export function AppLogo() {
  return (
    <div className="flex gap-2 items-center mb-11 justify-center   ">
      <div className="bg-primary p-2 text-white rounded-sm text-lg ">
        <FaCheckDouble />
      </div>

      <div className="font-bold  text-2xl flex gap-1 justify-center items-center">
        <span className="text-primary">Mis</span>
        <span>Tareas</span>
      </div>
    </div>
  );
}
