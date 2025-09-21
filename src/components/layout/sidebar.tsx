"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  PenTool,
  Calendar,
  BarChart3,
  Settings,
  Camera,
  Image,
  FileText,
  Users,
  Zap,
  Images,
  ShoppingCart,
  Store,
  Package,
  UserCheck,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    name: "Marketplace",
    href: "/marketplace",
    icon: Store,
  },
  {
    name: "Create Content",
    href: "/create",
    icon: PenTool,
  },
  {
    name: "Content Studio",
    href: "/content-studio",
    icon: Camera,
  },
  {
    name: "Schedule Posts",
    href: "/schedule",
    icon: Calendar,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "3D Gallery",
    href: "/create-gallery",
    icon: Images,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

const marketplaceNavigation = [
  // {
  //   name: "Browse Products",
  //   href: "/marketplace",
  //   icon: Store,
  // },
  {
    name: "Shopping Cart",
    href: "/cart",
    icon: ShoppingCart,
  },
  {
    name: "My Orders",
    href: "/orders",
    icon: Package,
  },
  {
    name: "Admin Dashboard",
    href: "/admin",
    icon: UserCheck,
  },
];

const tools = [
  {
    name: "AI Image Generator",
    href: "/tools/image-generator",
    icon: Camera,
  },
  {
    name: "Image to Content",
    href: "/tools/image-to-content",
    icon: Image,
  },
  {
    name: "Content Templates",
    href: "/tools/templates",
    icon: FileText,
  },
  {
    name: "Audience Insights",
    href: "/tools/audience",
    icon: Users,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">
            SocialFlow
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.name}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-accent text-accent-foreground"
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            );
          })}
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Marketplace
          </h3>
          {marketplaceNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.name}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-accent text-accent-foreground"
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            );
          })}
        </div>

        <Separator className="my-4" />

        {/* <div className="space-y-1">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            AI Tools
          </h3>
          {tools.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.name}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-accent text-accent-foreground"
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            );
          })}
        </div> */}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border space-y-3">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-sm font-medium text-primary-foreground">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.name || "User Name"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email || "user@example.com"}
            </p>
            <p className="text-xs text-primary capitalize">
              {user?.role || "customer"}
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="w-full justify-start"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
