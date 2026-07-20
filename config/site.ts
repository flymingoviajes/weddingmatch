export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Flymingo Weddings",
  description:
    "Encuentra, compara y cotiza paquetes de boda en los mejores destinos de playa de México: Cancún, Riviera Maya, Los Cabos y Puerto Vallarta.",
  navItems: [
    { label: "Inicio", href: "/" },
    { label: "Explorar", href: "/explorar" },
    { label: "Comparar", href: "/comparar" },
    { label: "Nosotros", href: "/nosotros" },
  ],
  links: {
    instagram: "https://instagram.com/flymingoviajes",
    facebook: "https://facebook.com/flymingoviajes",
    whatsapp: "https://wa.me/5218715816903",
  },
};
