"use client";

import {
  BarChart3,
  BookOpen,
  FileText,
  MessageSquare,
  Users,
  Settings,
  PlusCircle,
  Edit,
  LayoutDashboard,
} from "lucide-react";
import { Session, useSession } from "@supabase/auth-helpers-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export function LeftSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const session = useSession();
  const user = session?.user;

  const isActive = (path: string) => pathname === path;
  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: BarChart3,
        isActive: true,
      },
      {
        title: "Articles",
        url: "#",
        icon: FileText,
        items: [
          {
            title: "All Articles",
            url: "/dashboard/articles",
            icon: BookOpen,
          },
          {
            title: "Create New",
            url: "/dashboard/articles/create",
            icon: PlusCircle,
          },
        ],
      },
      {
        title: "Comments",
        url: "/dashboard/comments",
        icon: MessageSquare,
      },
      {
        title: "Users",
        url: "/dashboard/users",
        icon: Users,
      },
      {
        title: "Settings",
        url: "/dashboard",
        icon: Settings,
      },
    ],
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2 px-2">
          <Link href="/" className="flex items-center space-x-2">
             <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-3xl font-semibold">
                    Echo
                  </span>
            </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <div className="space-y-1">
                      <SidebarMenuButton
                        isActive={isActive(item.url ?? "")}
                        onClick={() => item.url && router.push(item.url)}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      <div className="ml-6 space-y-1">
                        {item.items.map((subItem) => (
                          <SidebarMenuButton
                            key={`${item.title}-${subItem.title}`}
                            size="sm"
                            isActive={isActive(subItem.url)}
                            onClick={() => router.push(subItem.url)}
                          >
                            <subItem.icon />
                            <span>{subItem.title}</span>
                          </SidebarMenuButton>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <SidebarMenuButton
                      isActive={isActive(item.url ?? "")}
                      onClick={() => item.url && router.push(item.url)}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
                    <AvatarFallback>
                      {user?.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{user?.user_metadata?.full_name || "Admin User"}</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
