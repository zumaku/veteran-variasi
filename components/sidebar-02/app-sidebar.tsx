"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Home,
  Settings,
  ShoppingBag,
  User,
  Car,
  ClipboardList,
  Package,
  Blocks,
  LogOutIcon,
  ShoppingCartIcon,
} from "lucide-react";
import type { Route } from "./nav-main";
import DashboardNavigation from "@/components/sidebar-02/nav-main";
import { NotificationsPopover } from "@/components/sidebar-02/nav-notifications";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { logout } from "@/app/auth/actions";
import Logo from "../Logo";

const sampleNotifications = [
  {
    id: "1",
    avatar: "/avatars/01.png",
    fallback: "OM",
    text: "New order received.",
    time: "10m ago",
  },
  {
    id: "2",
    avatar: "/avatars/02.png",
    fallback: "JL",
    text: "Server upgrade completed.",
    time: "1h ago",
  },
  {
    id: "3",
    avatar: "/avatars/03.png",
    fallback: "HH",
    text: "New user signed up.",
    time: "2h ago",
  },
];

const customerRoutes: Route[] = [
  {
    id: "overview",
    title: "Overview",
    icon: <Home className="size-4" />,
    link: "/dashboard",
  },
  {
    id: "cart",
    title: "Keranjang Saya",
    icon: <ShoppingCartIcon className="size-4" />,
    link: "/dashboard/user/cart",
  },
  {
    id: "orders",
    title: "Pesananku",
    icon: <ShoppingBag className="size-4" />,
    link: "/dashboard/user/orders",
  },
  {
    id: "catalog",
    title: "Katalog",
    icon: <Car className="size-4" />,
    link: "/catalog",
  },
  {
    id: "profile",
    title: "Profil Saya",
    icon: <User className="size-4" />,
    link: "/dashboard/user/profile",
  },
];

const adminRoutes: Route[] = [
  {
    id: "overview",
    title: "Overview",
    icon: <Home className="size-4" />,
    link: "/dashboard",
  },
  {
    id: "manage-orders",
    title: "Kelola Pesanan",
    icon: <ClipboardList className="size-4" />,
    link: "/dashboard/admin/orders",
  },
  {
    id: "manage-products",
    title: "Kelola Produk",
    icon: <Package className="size-4" />,
    link: "/dashboard/admin/products",
  },
  {
    id: "manage-categories",
    title: "Kelola Kategori",
    icon: <Blocks className="size-4" />,
    link: "/dashboard/admin/categories",
  },
];

export function DashboardSidebar({
  user,
}: {
  user?: { name: string; role: string } | null;
}) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const routesToRender = user?.role === "ADMIN" ? adminRoutes : customerRoutes;

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r">
      <SidebarHeader
        className={cn(
          "flex md:pt-3.5",
          isCollapsed
            ? "flex-row items-center justify-between gap-y-4 md:flex-col md:items-center md:justify-start"
            : "flex-row items-center justify-between",
        )}
      >
        <Link href="/" className="flex items-center gap-2">
          <Logo className="text-primary" size={24} />
          <p
            className={cn(
              "font-bold font-montserrat leading-none text-xs md:text-sm",
              isCollapsed ? "hidden" : "hidden sm:block",
            )}
          >
            Veteran Variasi
          </p>
        </Link>

        <motion.div
          key={isCollapsed ? "header-collapsed" : "header-expanded"}
          className={cn(
            "flex items-center gap-2",
            isCollapsed ? "flex-row md:flex-col-reverse" : "flex-row",
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <NotificationsPopover notifications={sampleNotifications} />
          <SidebarTrigger />
        </motion.div>
      </SidebarHeader>
      <SidebarContent className="gap-4 px-2 py-4 flex flex-col justify-between">
        <DashboardNavigation routes={routesToRender} />
        <form action={logout}>
          <Button
            variant="outline"
            size="sm"
            className="border-destructive text-destructive hover:text-destructive cursor-pointer hover:bg-destructive/10 w-full"
          >
            <LogOutIcon />
            {!isCollapsed && "Logout"}
          </Button>
        </form>
      </SidebarContent>
    </Sidebar>
  );
}
