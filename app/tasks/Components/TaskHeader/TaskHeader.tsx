import { UserProfile } from "./UserProfile";

import { SearchButton } from "./SearchButton";
import { FaTasks } from "react-icons/fa";

export function TaskHeader() {
  return (
    <div className="flex justify-between  items-center mb-6">
      <AppLogo />
      <div className="flex items-center gap-1 ">
        <SearchButton />
        <UserProfile />
      </div>
    </div>
  );
}

function AppLogo() {
  return (
    <div className="flex gap-2 items-center justify-center    ">
      <div className="bg-primary p-2 text-white rounded-sm text-xl ">
        <FaTasks />
      </div>

      <div className="font-bold  md:text-3xl flex gap-1 justify-center items-center">
        <span className="text-primary">Mis</span>
        <span>Tareas</span>
      </div>
    </div>
  );
}
