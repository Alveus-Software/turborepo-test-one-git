"use client";

import Link from "next/link";
import { LogoImg } from "@/components/logo";
import { Menu, X } from "lucide-react";
import React from "react";
import { createClient } from "@repo/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { AuthButton } from "./auth - supabse/auth-button";

const menuItems = [
  { name: "Servicios", href: "#servicios" },
  { name: "Galería", href: "#galeria" },
  { name: "Contacto", href: "#contacto" },
];

export const HeroHeader = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [session, setSession] = React.useState<any>(null);
  const [profile, setProfile] = React.useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    const getSessionAndProfile = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      if (data.session?.user) {
        const { data: userData } = await supabase
          .from("users")
          .select("profile_id")
          .eq("id", data.session.user.id)
          .single();
        setProfile(userData);
      } else {
        setProfile(null);
      }
    };

    // Llamada inicial
    getSessionAndProfile();

    // Escuchar cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);

        if (session?.user) {
          const { data: userData } = await supabase
            .from("users")
            .select("profile_id")
            .eq("id", session.user.id)
            .single();
          setProfile(userData);
        } else {
          setProfile(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    router.push("/auth/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        className={`bg-[#E3E2DD] text-[#987E71] w-full backdrop-blur-3xl transition-all duration-300 ${
          scrolled
            ? "border-b-2 border-[#d6c9c0] shadow-lg"
            : "border-b-0 shadow-none"
        }`}
      >
        <div className="mx-auto max-w-6xl px-6 transition-all duration-300">
          <div className="relative flex items-center justify-between py-3 lg:py-4">
            {/* Izquierda */}
            <div className="flex items-center gap-12">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <LogoImg />
              </Link>

              {/* Menú grande */}
              <div className="hidden lg:block">
                <ul className="flex gap-8 text-[#987E71] text-sm font-bold">
                  {menuItems
                    .filter((item) => item.name !== "Dashboard") // 🔹 Removemos Dashboard fijo
                    .map((item, index) => (
                      <li key={index}>
                        <Link
                          href={item.href}
                          className="hover:text-[#40222D] duration-150"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            {/* Derecha */}
            <div className="flex items-center gap-4">
              {/* Botones visibles solo en escritorio */}
              <div className="hidden lg:flex items-center gap-4">
                {session ? (
                  <div>
                    <AuthButton />
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    className="border border-[#987E71] text-[#987E71] px-4 py-2 rounded-full hover:bg-[#40222D] hover:text-white transition"
                  >
                    Iniciar sesión
                  </Link>
                )}
                <button
                  onClick={() => {
                    if (!session) {
                      window.location.href = "/auth/sign-up";
                      return;
                    }
                    window.open("/cliente-cita", "_blank");
                  }}
                  className="bg-[#987E71] text-white px-4 py-2 rounded-full hover:bg-[#40222D] transition"
                >
                  Reservar cita
                </button>
              </div>

              {/* Burguer */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                className="lg:hidden"
              >
                {menuOpen ? (
                  <X className="w-6 h-6 text-[#987E71]" />
                ) : (
                  <Menu className="w-6 h-6 text-[#987E71]" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        {menuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-[#E3E2DD] border-t border-[#d6c9c0] shadow-lg z-20">
            <ul className="flex flex-col items-center py-6 space-y-4 text-[#987E71] font-bold text-lg">
              {menuItems
                .filter((item) => item.name !== "Dashboard")
                .map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="hover:text-[#40222D] duration-150"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}

            {/* Menú móvil */}
            <div className={cn(
              "bg-background hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent",
              menuOpen && "!block fixed top-20 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md"
            )}>
              <div className="lg:hidden w-full">
                <ul className="space-y-6 text-base text-center">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150 py-2"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="w-full lg:hidden flex justify-center">
                <AuthButton mobileView={true} />
              </div>
            </div>
              <li>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    if (!session) {
                      window.location.href = "/auth/sign-up";
                      return;
                    }
                    window.open("/cliente-cita", "_blank");
                  }}
                  className="block bg-[#987E71] text-white px-6 py-2 rounded-full hover:bg-[#40222D] transition"
                >
                  Reservar cita
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};