import {
  BarChart,
  LogOut,
  Settings,
  UserIcon,
} from "lucide-react";
import Link from "next/link";

import { cn } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "~/ui/primitives/avatar";
import { Button } from "~/ui/primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/ui/primitives/dropdown-menu";

import { CurrentUserAvatar } from "../current-user-avatar";

interface HeaderUserDropdownProps {
  isDashboard: boolean;
  userEmail: string;
  userImage?: null | string;
  userName: string;
}

export function HeaderUserDropdown({
  isDashboard = false,
  userEmail,
  userImage,
  userName,
}: HeaderUserDropdownProps) {
  return (
    <Link href="/dashboard/profile" legacyBehavior>
      <Button
        className="relative overflow-hidden rounded-full"
        size="icon"
        variant="ghost"
      >
        <CurrentUserAvatar />
      </Button>
    </Link>
  );
}
