// src/components/shared/navbar/nav-menu.tsx
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavigationMenuProps } from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { menuItems } from "@/data/menuItems";

export const NavMenu = (props: NavigationMenuProps) => (
  <NavigationMenu {...props}>
    <NavigationMenuList className="gap-2 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start">
      {menuItems.map((item) => (
        <NavigationMenuItem key={item.title}>
          <NavigationMenuLink asChild>
            <Link href={item.href}>{item.title}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  </NavigationMenu>
);
