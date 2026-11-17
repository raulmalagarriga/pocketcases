"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("maya@pocketcases.co");
  const [password, setPassword] = useState("pocket2025");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isSupabaseConfigured()) {
      router.push("/admin/products");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch {
      setErrorMsg("Error al conectar con Supabase Auth.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-space-md relative overflow-hidden">
      {/* Ambient Pastel Halo Blobs */}
      <div className="absolute -top-12 -left-16 w-80 h-80 rounded-full bg-primary-fixed blur-3xl opacity-60 pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 -right-20 w-96 h-96 rounded-full bg-secondary-fixed blur-3xl opacity-70 pointer-events-none -z-10"></div>

      <div className="w-full max-w-md bg-surface-container-lowest rounded-lg p-space-xl shadow-[4px_4px_0px_#2a3235]">
        <div className="flex flex-col items-center text-center mb-space-lg">
          <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-[2px_2px_0px_#2a3235] mb-space-sm">
            <span className="material-symbols-outlined text-[24px]">cases</span>
          </div>
          <span className="font-label-badge text-label-badge text-on-tertiary-container bg-tertiary-fixed px-2.5 py-0.5 rounded-full font-bold uppercase mb-1">
            ADMIN CMS PORTAL
          </span>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold">
            Pocket Cases
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Ingresa con tu cuenta administrativa de Supabase para gestionar el
            catálogo e inventario.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-space-md">
          <div>
            <label className="font-label-md text-label-md text-on-surface font-bold block mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-[1px_1px_0px_#2a3235]"
              placeholder="admin@pocketcases.co"
            />
          </div>

          <div>
            <label className="font-label-md text-label-md text-on-surface font-bold block mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required={isSupabaseConfigured()}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-[1px_1px_0px_#2a3235]"
              placeholder="••••••••"
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-primary-container text-on-primary-container font-label-lg text-label-lg shadow-[3px_3px_0px_#2a3235] hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">login</span>
            <span>{loading ? "Verificando..." : "Entrar al Panel CMS"}</span>
          </button>
        </form>

        <div className="mt-space-lg pt-space-md border-t border-outline-variant/40 flex items-center justify-between font-label-md text-label-md">
          <Link
            href="/"
            className="text-on-surface-variant hover:text-primary flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">
              arrow_back
            </span>
            <span>Volver al Storefront</span>
          </Link>
          {!isSupabaseConfigured() && (
            <span className="font-label-badge text-label-badge text-tertiary bg-secondary-fixed px-2 py-0.5 rounded-full">
              Modo Demo Local Activo
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
