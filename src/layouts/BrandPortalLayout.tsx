import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Megaphone,
  Plus,
  ListChecks,
  Users,
  MessageSquare,
  Settings,
  Bell,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Home",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Campaigns",
    path: "/campaigns",
    icon: Megaphone,
    children: [
      { label: "Create Campaign", path: "/campaigns/create", icon: Plus },
      { label: "Active Campaigns", path: "/campaigns", icon: ListChecks },
    ],
  },
  {
    label: "Creators",
    path: "/creators",
    icon: Users,
  },
  {
    label: "Messages",
    path: "/messages",
    icon: MessageSquare,
  },
  {
    label: "Brand Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function BrandPortalLayout() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="none" className="border-r border-[var(--neutral-200)]">
        <SidebarHeader className="px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand-700)]">
              <span className="text-sm font-bold text-white">B</span>
            </div>
            <div>
              <p className="text-base font-bold text-[var(--neutral-800)]">Benable</p>
              <p className="text-xs text-[var(--neutral-500)]">Brand Portal</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_ITEMS.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    {item.children ? (
                      <>
                        <SidebarMenuButton
                          isActive={isActive(item.path) && location.pathname === item.path}
                          asChild
                        >
                          <NavLink to={item.path}>
                            <item.icon className="size-4" />
                            <span>{item.label}</span>
                          </NavLink>
                        </SidebarMenuButton>
                        <SidebarMenuSub>
                          {item.children.map((child) => (
                            <SidebarMenuSubItem key={child.path}>
                              <SidebarMenuSubButton
                                isActive={
                                  child.path === "/campaigns"
                                    ? location.pathname === "/campaigns"
                                    : isActive(child.path)
                                }
                                asChild
                              >
                                <NavLink to={child.path}>
                                  <child.icon className="size-3.5" />
                                  <span>{child.label}</span>
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </>
                    ) : (
                      <SidebarMenuButton isActive={isActive(item.path)} asChild>
                        <NavLink to={item.path}>
                          <item.icon className="size-4" />
                          <span>{item.label}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="px-5 py-4 border-t border-[var(--neutral-200)]">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--neutral-200)]">
              <span className="text-xs font-medium text-[var(--neutral-600)]">28</span>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--neutral-800)]">28 Litsea</p>
              <p className="text-xs text-[var(--neutral-500)]">Free Plan</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        {/* Top bar with notification bell */}
        <div className="sticky top-0 z-10 flex items-center justify-end border-b border-[var(--neutral-200)] bg-white/95 backdrop-blur-sm px-8 py-3">
          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[var(--neutral-600)] transition-colors hover:bg-[var(--neutral-100)] hover:text-[var(--neutral-800)]">
            <Bell className="size-5" />
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--red-500)] text-[9px] font-bold text-white">
              3
            </span>
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="mx-auto w-full max-w-[1100px] px-8 py-8">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
