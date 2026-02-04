"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/react";
import { ThemeSwitch } from "@/components/theme-switch";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "Inicio", href: "/" },
    { label: "Explorar", href: "/explorar" },
    { label: "Comparar", href: "/comparar" },
    { label: "Nosotros", href: "/nosotros" },
  ];

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname.startsWith(href);

  return (
    <HeroUINavbar
      maxWidth="xl"
      position="sticky"
      className={clsx(
        "backdrop-blur supports-[backdrop-filter]:bg-content1/70 bg-content1/60",
        "border-b border-default-200/60"
      )}
    >
      {/* Brand + Desktop nav */}
      <NavbarContent className="basis-1/2" justify="start">
        <NavbarBrand as="li" className="gap-2 max-w-fit">
          <NextLink className="flex items-center gap-2" href="/">
            {/* Si tienes logo, colócalo aquí */}
            {/* <Logo /> */}
            <span className="text-lg font-bold">Flymingo Weddings</span>
          </NextLink>
        </NavbarBrand>

        <ul className="hidden lg:flex gap-2 ml-4">
          {navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                href={item.href}
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "px-2 py-1 rounded-medium transition-colors",
                  isActive(item.href) && "text-primary font-medium"
                )}
              >
                <span className="relative">
                  {item.label}
                  {isActive(item.href) && (
                    <span className="absolute -bottom-1 left-0 h-[2px] w-full bg-primary rounded-full" />
                  )}
                </span>
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      {/* Right actions */}
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <Button
            as={NextLink}
            href="/cotizar"
            color="primary"
            variant="shadow"
            className="font-semibold"
          >
            Cotizar mi boda
          </Button>
        </NavbarItem>

        <NavbarMenuToggle className="lg:hidden" />
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarMenu>
        <div className="mx-4 mt-4 flex flex-col gap-2">
          {navItems.map((item, i) => (
            <NavbarMenuItem key={item.href}>
              <Link
                color={isActive(item.href) ? "primary" : "foreground"}
                href={item.href}
                size="lg"
                className={clsx(isActive(item.href) && "font-semibold")}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}

          <div className="mt-2">
            <Button
              as={NextLink}
              href="/cotizar"
              color="primary"
              variant="shadow"
              fullWidth
            >
              Cotizar mi boda
            </Button>
          </div>

          <div className="mt-2">
            <ThemeSwitch />
          </div>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
