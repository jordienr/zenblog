import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { useUser } from "@/utils/supabase/browser";
import { useIsSubscribed, useSubscriptionQuery } from "@/queries/subscription";
import { cn } from "@/lib/utils";
import { DoorClosed, DoorOpen, UserIcon } from "lucide-react";

type Props = {};

const UserButton = (props: Props) => {
  const user = useUser();
  const isSubbed = useIsSubscribed();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-full">
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 font-bold text-white"
            )}
          >
            {user?.email?.slice(0, 1).toUpperCase()}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="hover:bg-transparent">
            <div className="flex flex-col">
              <span className="text-xs text-zinc-400">Signed in as</span>
              <span className="font-medium text-zinc-800">{user?.email}</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/account">
              <UserIcon className="mr-2 h-4 w-4" />
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/sign-out" className="group flex hover:text-red-500">
              <div className="relative h-4 w-4 *:absolute *:mr-2 *:h-4 *:w-4">
                <DoorClosed className="opacity-100 group-hover:opacity-0" />
                <DoorOpen className="opacity-0 group-hover:opacity-100" />
              </div>
              <div className="ml-2">Sign out</div>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserButton;
