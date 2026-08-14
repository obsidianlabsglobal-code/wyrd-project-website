import { useEffect, useState } from "react";
import logo from "@/assets/wyrd-logo.png.asset.json";

const links = [
  { href: "#domains", label: "What we do" },
  { href: "#system", label: "The system" },
  { href: "#studio", label: "Studio" },
  { href: "#contact", label: "Contact" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-[var(--ease-wyrd)] ${
        scrolled ? "bg-background/80 backdrop-blur-md" : ""
      }`}
    >
      <div className="container-wyrd flex items-center justify-between py-5">
        <a href="#top" aria-label="WYRD Designs — home" className="shrink-0">
          <img src={logo.url} alt="WYRD Designs" className="h-6 w-auto md:h-7" />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="micro relative text-foreground/70 transition-colors duration-300 hover:text-foreground after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-foreground after:transition-all after:duration-500 after:ease-[var(--ease-wyrd)] hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="micro md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="container-wyrd rule-line border-border/70 bg-background/95 pb-8 pt-6 backdrop-blur-md md:hidden"
      >
        <ul className="flex flex-col gap-5">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="display-md block"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
