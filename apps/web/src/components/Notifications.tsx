import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Bell, Loader } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type Props = {};

function useNotifications() {
  const sb = createSupabaseBrowserClient();

  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => {
      return [];
    },
  });
}

const Notifications = (props: Props) => {
  const { data: notifications, isLoading } = useNotifications();

  if (isLoading) {
    return (
      <Button variant={"ghost"} size={"icon"} disabled>
        <Loader className="animate-spin" />
      </Button>
    );
  }
  if (!notifications) {
    return null;
  }
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"icon"} variant={"ghost"} className="relative">
            <Bell />
            {notifications.length > 0 && (
              <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-zinc-400">
              <div className="flex justify-center">
                <Bell size="17" className="animate-bounce text-orange-400" />
              </div>
              No notifications
            </div>
          ) : (
            notifications.map((notifications) => {
              return <DropdownMenuItem key={notifications}></DropdownMenuItem>;
            })
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Notifications;
