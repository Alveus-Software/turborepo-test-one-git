"use client";

import Link from "next/link";
import { Facebook } from "lucide-react";
import  Image from "next/image";

const footerLinks = [
  {
    group: "Servicios:",
    items: [
      { name: "¿Qué hacemos?", href: "/#services" },
      { name: "Agendar cita", href: "/cliente-cita" },
    ],
  },
  {
    group: "Somos:",
    items: [
      { name: "Sobre nosotros", href: "/about-us" },
      { name: "Aviso de privacidad", href: "/legal/privacy" },
      // { name: "Términos", href: "/legal/terms" },
    ],
  },
  {
    group: "Contacto:",
    items: [
      {
        name: "contacto@parleyconsultoria.com",
        href: "mailto:contacto@parleyconsultoria.com",
      },
      {
        name: "33 1241 7413",
        href: "tel:+5213312417413",
      },
      {
        name: "Querétaro Sur 71-sur, Centro, 63000 Tepic, Nay.",
        href: "https://maps.app.goo.gl/6qbERgTMtkVkY6XL9",
      },
    ],
  },
];

export default function FooterSection() {
  return (
    <footer className="relative bg-[#6f6f6f] pt-16 text-white">
      {/* Línea superior */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#b2914a]" />

      <div className="container mx-auto px-5">
        <div className="grid gap-10 grid-cols-2 md:grid-cols-4">

           {/* Logo con imagen */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="relative h-20 md:h-24 w-52">
              <Image
                src="/assets/landing/logo-narvbarparley.png"
                alt="Parley Consultoría Integral"
                fill
                priority
                className="object-contain scale-200" 
                sizes="(max-width: 768px) 208px, 256px"
              />
            </div>

            <p className="mt-4 max-w-sm text-sm text-gray-200 leading-relaxed text-center md:text-left">
              <span className="block font-semibold text-white">
                Parley
              </span>
              <span className="block text-gray-300">
                “Soluciones legales para todas tus necesidades”.
              </span>
            </p>

            {/* Redes */}
            <div className="mt-6 flex gap-5 justify-center md:justify-start">
              <Link
                href="https://facebook.com/parleyconsultoria"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  p-2 rounded-lg
                  text-gray-300
                  hover:text-[#b2914a]
                  hover:bg-white/5
                  transition-all duration-300
                "
              >
                <Facebook className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div
              key={section.group}
              className={
                section.group === "Contacto"
                  ? "col-span-2 md:col-span-1 text-center md:text-left"
                  : "text-center md:text-left"
              }
            >
              <span className="block font-semibold tracking-wide text-[#b2914a] uppercase text-xs mb-4">
                {section.group}
              </span>

              <ul className="space-y-3 text-sm">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        item.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="
                        block text-gray-300
                        hover:text-white
                        transition-colors duration-200
                        break-words leading-snug
                      "
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 py-6 text-center sm:text-left">
          <p className="text-xs text-gray-300">
            © {new Date().getFullYear()} Parley Consultoría Integral. Todos los
            derechos reservados.
          </p>

          <span className="text-xs text-gray-400">
            Powered by{" "}
            <a
              href="https://www.alveussoft.com"
              className="font-semibold hover:text-white transition-colors"
            >
              Alveus Soft
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
