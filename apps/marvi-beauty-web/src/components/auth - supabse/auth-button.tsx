"use client";

import Link from "next/link";
import { Button } from "@repo/ui/button";
import { useState, useEffect } from "react";
import { createClient } from "@repo/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@repo/ui/dropdown-menu";
import {
  ChevronDown,
  UserCircle2,
  LayoutDashboard,
  LogOut,
  UserIcon,
  ShoppingBag,
  UserCircleIcon as UserProfileIcon,
} from "lucide-react";

export function AuthButton({ mobileView = false }: { mobileView?: boolean }) {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchUserAndRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userData = session?.user ?? null;
      setUser(userData);

      if (userData) {
        const { data: userRecord, error } = await supabase
          .from("users")
          .select(`
            id,
            profile_id,
            profiles:profile_id (code)
          `)
          .eq("id", userData.id)
          .single();

        if (error) {
          console.error("Error al obtener el rol:", error);
        } else {
          const profile = Array.isArray(userRecord.profiles)
            ? userRecord.profiles[0]
            : userRecord.profiles;
          setRole(profile?.code || null);
        }
      }
      setLoading(false);
    };

    fetchUserAndRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserAndRole();
      } else {
        setUser(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

    const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) return null;

  if (user) {
    if (mobileView) {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-2 py-3 border-[#987E71] text-[#987E71] bg-[#987E71]">
            <UserIcon className="h-5 w-5 text-white" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">
                Mi cuenta
              </span>
              <span className="text-xs text-gray-300 truncate">
                {user.email}
              </span>
            </div>
          </div>

          <Link
            href="/profile"
            className="block py-3 rounded-lg font-medium text-gray-200 hover:bg-amber-500/20 hover:text-amber-400 transition-colors"
          >
            Mi Perfil
          </Link>

          {/* <Link
            href="/historial"
            className="block py-3 rounded-lg font-medium text-gray-200 hover:bg-amber-500/20 hover:text-amber-400 transition-colors"
          >
            Historial de compras
          </Link> */}

          {role !== "customer" && (
            <Link
              href="/dashboard"
              className="block py-3 rounded-lg font-medium text-gray-200 hover:bg-amber-500/20 hover:text-amber-400 transition-colors"
            >
              Dashboard
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="w-full text-left py-3 rounded-lg font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      );
    }


    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center cursor-pointer gap-2 bg-gradient-to-r from-[#987E71] to-[#8C7062] border-2 border-amber-500 text-white font-semibold rounded-xl hover:bg-amber-500 hover:border-amber-400 hover:text-white hover:shadow-lg hover:shadow-amber-500/25 hover:scale-105 transition-all duration-300 group"
          >
            <div className="relative">
              <UserCircle2 className="h-5 w-5 sm:h-5 sm:w-5 transition-transform group-hover:scale-110 text-amber-400 group-hover:text-white" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-800 group-hover:border-amber-500" />
            </div>
            <span className="hidden sm:inline">Mi cuenta</span>
            <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180 duration-300 text-amber-400 group-hover:text-white" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-[calc(100vw-1rem)] sm:w-72 border-[#987E71] text-[#987E71] shadow-2xl border-2 border-gray-700 rounded-2xl p-3 animate-in fade-in-0 zoom-in-95
          sm:translate-x-0 translate-x-2 transition-transform duration-300 ease-out"
        >
          <DropdownMenuLabel className="flex items-start gap-3 px-3 py-3 bg-gradient-to-r from-[#987E71] to-[#8C7062] rounded-xl mb-2 border border-amber-500/20">
            <div className="flex items-center justify-center w-10 h-10 bg-[#987E71] rounded-full flex-shrink-0">
              <UserIcon className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-base font-bold text-white">
                Mi Cuenta
              </span>
              <span className="text-sm text-[#40222D] truncate">
                {user.email}
              </span>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="my-2 border-[#987E71] text-[#987E71]" />

          <DropdownMenuItem asChild>
            <Link
              href="/profile"
              className="flex items-center gap-4 px-4 py-3.5 cursor-pointer rounded-xl hover:bg-amber-500/20 transition-colors duration-200 group"
            >
              <div className="flex items-center justify-center w-9 h-9 bg-[#987E71] rounded-lg group-hover:bg-amber-500/30 transition-colors border border-amber-500/30">
                <UserProfileIcon className="h-5 w-5 text-white group-hover:text-[#40222D] group-hover:scale-110 transition-transform" />
              </div>
              <span className="font-semibold text-[#987E71] group-hover:text-[#40222D] text-base">
                Mi Perfil
              </span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/appointments/history"
              className="flex items-center gap-4 px-4 py-3.5 cursor-pointer rounded-xl hover:bg-amber-500/20 transition-colors duration-200 group"
            >
              <div className="flex items-center justify-center w-9 h-9 bg-[#987E71] rounded-lg group-hover:bg-amber-500/30 transition-colors border border-amber-500/30">
                <ShoppingBag className="h-5 w-5 text-white group-hover:text-[#40222D] group-hover:scale-110 transition-transform" />
              </div>
              <span className="font-semibold text-[#987E71] group-hover:text-[#40222D] text-base">
                Historial de Citas
              </span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/cliente-cita"
              className="flex items-center gap-4 px-4 py-3.5 cursor-pointer rounded-xl hover:bg-amber-500/20 transition-colors duration-200 group"
            >
              <div className="flex items-center justify-center w-9 h-9 bg-[#987E71] rounded-lg group-hover:bg-amber-500/30 transition-colors border border-amber-500/30">
                <ShoppingBag className="h-5 w-5 text-white group-hover:text-[#40222D] group-hover:scale-110 transition-transform" />
              </div>
              <span className="font-semibold text-[#987E71] group-hover:text-[#40222D] text-base">
                Reservar Citas
              </span>
            </Link>
          </DropdownMenuItem>

          {role !== "customer" && (
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard"
                className="flex items-center gap-4 px-4 py-3.5 cursor-pointer rounded-xl hover:bg-amber-500/20 transition-colors duration-200 group"
              >
                <div className="flex items-center justify-center w-9 h-9 bg-[#987E71] rounded-lg group-hover:bg-amber-500/30 transition-colors border border-amber-500/30">
                  <LayoutDashboard className="h-5 w-5 text-white group-hover:text-[#40222D] group-hover:scale-110 transition-transform" />
                </div>
                <span className="font-semibold text-[#987E71] group-hover:text-[#40222D] text-base">
                  Dashboard
                </span>
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator className="my-2 border-[#987E71] text-[#987E71]" />

          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3.5 cursor-pointer rounded-xl hover:bg-red-500/20 transition-colors duration-200 group"
          >
            <div className="flex items-center justify-center w-9 h-9 bg-[#987E71] rounded-lg group-hover:bg-red-500/30 transition-colors border border-red-500/30">
              <LogOut className="h-5 w-5 text-white group-hover:text-[#40222D] group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-bold text-red-400 group-hover:text-red-300 text-base">
              Cerrar sesión
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex flex-col gap-2 md:flex-row md:gap-2">
      <Button
        asChild
        size="default"
        variant="outline"
        className="w-full md:w-auto border-[#987E71] text-[#987E71] border  font-semibold rounded-lg px-4 py-2 hover:bg-amber-500/10 hover:scale-105 transition-all duration-300 shadow-xs"
      >
        <Link href="/auth/login">Iniciar sesión</Link>
      </Button>

      <Link href="/auth/sign-up">
        <Button
          size="default"
          className="w-full md:w-auto rounded-md bg-[#987E71] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-amber-600 hover:scale-105"
        >
          Registrarse
        </Button>
      </Link>
    </div>
  );
}
