import { useUser } from "@supabase/auth-helpers-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type Props = {};

const UserButton = (props: Props) => {
  const user = useUser();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 font-bold text-white">
            {user?.email?.slice(0, 1).toUpperCase()}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>{user?.email}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserButton;
