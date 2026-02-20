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
  Settings,
  Bell,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Home",
    path: "/",
    icon: LayoutDashboard,
    color: "var(--brand-600)",
    bgColor: "var(--brand-100)",
  },
  {
    label: "Campaigns",
    path: "/campaigns",
    icon: Megaphone,
    color: "var(--orange-500)",
    bgColor: "var(--orange-100)",
    children: [
      { label: "Create Campaign", path: "/campaigns/create", icon: Plus },
      { label: "Active Campaigns", path: "/campaigns", icon: ListChecks },
    ],
  },
  {
    label: "Brand Settings",
    path: "/settings",
    icon: Settings,
    color: "var(--neutral-500)",
    bgColor: "var(--neutral-100)",
  },
  {
    label: "Browse All Creators",
    path: "/creators",
    icon: Users,
    color: "var(--pink-500)",
    bgColor: "var(--pink-100)",
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
      <Sidebar collapsible="none" className="border-r border-[var(--neutral-200)] bg-gradient-sidebar">
        <SidebarHeader className="px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-700)]">
              <span className="text-base font-bold text-white tracking-tight">b</span>
            </div>
            <div>
              <p className="text-base font-bold text-[var(--neutral-800)]">Benable</p>
              <p className="text-xs text-[var(--brand-500)]">Brand Portal</p>
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
                          <NavLink
                            to={item.path}
                            className="relative"
                            style={({ isActive: active }) =>
                              active
                                ? {
                                    backgroundColor: item.bgColor,
                                    color: item.color,
                                    fontWeight: 600,
                                  }
                                : {}
                            }
                          >
                            {isActive(item.path) && (
                              <div
                                className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full"
                                style={{ backgroundColor: item.color }}
                              />
                            )}
                            <div
                              className="flex h-7 w-7 items-center justify-center rounded-lg"
                              style={{
                                backgroundColor: isActive(item.path)
                                  ? `${item.color}18`
                                  : "transparent",
                              }}
                            >
                              <item.icon
                                className="size-4"
                                style={{
                                  color: isActive(item.path)
                                    ? item.color
                                    : "var(--neutral-500)",
                                }}
                              />
                            </div>
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
                        <NavLink
                          to={item.path}
                          className="relative"
                          style={() =>
                            isActive(item.path)
                              ? {
                                  backgroundColor: item.bgColor,
                                  color: item.color,
                                  fontWeight: 600,
                                }
                              : {}
                          }
                        >
                          {isActive(item.path) && (
                            <div
                              className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full"
                              style={{ backgroundColor: item.color }}
                            />
                          )}
                          <div
                            className="flex h-7 w-7 items-center justify-center rounded-lg"
                            style={{
                              backgroundColor: isActive(item.path)
                                ? `${item.color}18`
                                : "transparent",
                            }}
                          >
                            <item.icon
                              className="size-4"
                              style={{
                                color: isActive(item.path)
                                  ? item.color
                                  : "var(--neutral-500)",
                              }}
                            />
                          </div>
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

        {/* Upgrade Plan Card — inspired by Benable business dashboard */}
        <NavLink to="/upgrade" className="block px-4 pb-3">
          <div className="rounded-xl bg-gradient-brand p-4 text-white transition-opacity hover:opacity-90">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
              <TrendingUp className="size-4" />
            </div>
            <p className="text-sm font-bold">Upgrade plan</p>
            <p className="mt-0.5 text-xs text-white/80">
              Get more features for your brand
            </p>
          </div>
        </NavLink>

        <SidebarFooter className="px-5 py-4 border-t border-[var(--neutral-200)]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-warm text-white">
              <span className="text-xs font-bold">28</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--neutral-800)]">28 Litsea</p>
              <div className="flex items-center gap-1">
                <Sparkles className="size-3 text-[var(--brand-500)]" />
                <p className="text-xs text-[var(--brand-500)] font-medium">Free Plan</p>
              </div>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        {/* Top bar with notification bell and View Page button */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--neutral-200)] bg-white/80 backdrop-blur-md px-8 py-3">
          <div />
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg border border-[var(--neutral-200)] bg-white px-3 py-1.5 text-sm font-medium text-[var(--neutral-700)] shadow-sm transition-all hover:border-[var(--brand-400)] hover:text-[var(--brand-700)]">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--green-500)]">
                <span className="text-[8px] text-white">&#9679;</span>
              </span>
              View page
            </button>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-[var(--neutral-600)] transition-all hover:bg-[var(--brand-100)] hover:text-[var(--brand-700)]">
              <Bell className="size-5" />
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--red-500)] text-[9px] font-bold text-white shadow-sm">
                3
              </span>
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-brand text-white text-xs font-bold shadow-sm">
              J
            </div>
          </div>
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
