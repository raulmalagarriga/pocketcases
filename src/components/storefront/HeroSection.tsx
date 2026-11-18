"use client";

import React from "react";
import { useCartStore } from "@/store/useCartStore";

export function HeroSection() {
  const { setActiveCategory, setSearchQuery } = useCartStore();

  const scrollToCatalog = () => {
    const el = document.getElementById("product-catalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-margin md:px-margin-desktop pt-space-xl pb-space-2xl overflow-visible">
      {/* Ambient Pastel Halo Blobs */}
      <div className="absolute -top-12 -left-16 w-80 h-80 rounded-full bg-primary-fixed blur-3xl opacity-60 pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 -right-20 w-96 h-96 rounded-full bg-secondary-fixed blur-3xl opacity-70 pointer-events-none -z-10"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
        {/* Left Hero Editorial Column */}
        <div className="lg:col-span-6 flex flex-col items-start space-y-space-md">
          {/* Brand Pill Chip with Logo */}
          <div className="inline-flex items-center gap-space-sm bg-surface-container-lowest px-space-md py-1.5 rounded-full shadow-[2px_2px_0px_#2a3235]">
            <img
              alt="Pocket Cases Official Logo"
              className="w-6 h-6 object-contain rounded-full bg-primary-fixed"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDS-s4In6W_RTGsuOy7GiEv-SpyZIYDboLKJ6DRqio-SxWAep-2eJ7SRIGVljOR1gm6-i4dgbc7V1UfSICAQqCQK0mEq8gqXY5nJcOv6VDF58MZUBnyCc6gTE6vYvNSMCWCkrjzzYi6Iy6MWO355PBhcYLwRXTbCQ3qFKsdgR7SZ6ocYlkv0J3Qh1Pge3vC-GQjso4m3swRe-QPfsDy9kn2YZg3iGWQm75Hgi2GxK6Zed7Uibt2EO8"
            />
            <span className="font-label-md text-label-md text-primary font-extrabold uppercase tracking-wide">
              EDICIÓN 2025 • NUEVO LANZAMIENTO
            </span>
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
          </div>

          {/* Main Display Headline */}
          <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-on-surface">
            Viste tu cel con{" "}
            <span className="relative inline-block text-primary">
              puro estilo
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-primary-fixed -z-10"
                preserveAspectRatio="none"
                viewBox="0 0 100 12"
              >
                <path
                  d="M0,8 Q50,0 100,8 L100,12 L0,12 Z"
                  fill="currentColor"
                ></path>
              </svg>
            </span>{" "}
            brutal.
          </h1>

          {/* Subheading */}
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
            Fundas estéticas y resistentes contra caídas, con protección militar
            y ese brillo retro Y2K que convierte tus fotos de espejo en sesiones
            de fotos.
          </p>

          {/* Social Proof Pill Badge */}
          <div className="flex items-center gap-space-sm bg-surface-container-low px-space-md py-space-xs rounded-full shadow-[1px_1px_0px_#2a3235]">
            <div className="flex text-[#f59e0b] text-[16px]">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              ))}
            </div>
            <span className="font-label-lg text-label-lg text-on-surface font-extrabold">
              4.9 / 5
            </span>
            <span className="text-on-surface-variant font-body-sm text-body-sm">
              de más de 12.000 clientes felices
            </span>
          </div>

          {/* CTA Action Buttons */}
          <div className="pt-space-sm flex flex-wrap items-center gap-space-md w-full sm:w-auto">
            <a
              onClick={(e) => {
                e.preventDefault();
                setActiveCategory("all");
                setSearchQuery("");
                scrollToCatalog();
              }}
              className="w-full sm:w-auto text-center px-space-xl py-3.5 bg-primary-container text-on-primary-container font-label-lg text-label-lg rounded-full shadow-[3px_3px_0px_#2a3235] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#2a3235] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center justify-center gap-2"
              href="#product-catalog"
            >
              <span>Ver Más Vendidos</span>
              <span className="material-symbols-outlined text-[20px]">
                arrow_downward
              </span>
            </a>
            <a
              onClick={(e) => {
                e.preventDefault();
                setActiveCategory("magsafe");
                setSearchQuery("");
                scrollToCatalog();
              }}
              className="w-full sm:w-auto text-center px-space-lg py-3.5 bg-surface-container-lowest text-primary font-label-lg text-label-lg rounded-full shadow-[3px_3px_0px_#2a3235] hover:bg-secondary-container hover:text-on-secondary-container transition-all flex items-center justify-center gap-2"
              href="#product-catalog"
            >
              <span className="material-symbols-outlined text-[20px]">
                trip_origin
              </span>
              <span>Explorar MagSafe</span>
            </a>
          </div>

          {/* Fast Feature Touts */}
          <div className="pt-space-md grid grid-cols-3 gap-space-sm w-full max-w-lg">
            <div className="flex items-center gap-2 bg-surface-container-lowest p-2 rounded-DEFAULT shadow-[1px_1px_0px_#2a3235]">
              <span className="material-symbols-outlined text-primary text-[20px]">
                verified_user
              </span>
              <span className="font-label-md text-label-md text-on-surface">
                Protección 3m
              </span>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-lowest p-2 rounded-DEFAULT shadow-[1px_1px_0px_#2a3235]">
              <span className="material-symbols-outlined text-tertiary text-[20px]">
                local_shipping
              </span>
              <span className="font-label-md text-label-md text-on-surface">
                Gratis $35+
              </span>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-lowest p-2 rounded-DEFAULT shadow-[1px_1px_0px_#2a3235]">
              <span className="material-symbols-outlined text-primary text-[20px]">
                chat
              </span>
              <span className="font-label-md text-label-md text-on-surface">
                Atención WhatsApp
              </span>
            </div>
          </div>
        </div>

        {/* Right Visual Showcase / Dynamic Asymmetric Collage */}
        <div className="lg:col-span-6 relative flex justify-center items-center">
          {/* Giant Rotating Retro Stamp Badge */}
          <div className="absolute -top-4 -right-2 md:top-2 md:right-4 z-20 w-24 h-24 rounded-full bg-primary-container text-on-primary-container p-2 flex flex-col items-center justify-center text-center shadow-[3px_3px_0px_#2a3235] rotate-12 hover:rotate-0 transition-transform">
            <span className="material-symbols-outlined text-[20px]">
              auto_awesome
            </span>
            <span className="font-label-badge text-label-badge leading-tight uppercase font-extrabold">
              DROP Y2K
              <br />
              GEN-5 CORE
            </span>
          </div>

          {/* Main Phone Showcase Mosaic */}
          <div className="relative w-full max-w-lg grid grid-cols-2 gap-space-md p-space-md bg-surface-container-lowest rounded-xl shadow-[4px_4px_0px_#2a3235]">
            {/* Card Mockup 1: Strawberry Wave */}
            <a
              href="#product-catalog"
              onClick={(e) => {
                e.preventDefault();
                setActiveCategory("all");
                setSearchQuery("Strawberry");
                scrollToCatalog();
              }}
              className="group relative rounded-lg overflow-hidden bg-primary-fixed p-space-md flex flex-col items-center text-center shadow-[2px_2px_0px_#2a3235]"
            >
              <span className="absolute top-2 left-2 bg-surface-container-lowest font-label-badge text-label-badge text-primary px-2 py-0.5 rounded-full shadow-[1px_1px_0px_#2a3235]">
                MÁS VENDIDO
              </span>
              <div className="w-full h-44 rounded-DEFAULT overflow-hidden bg-surface-container-lowest flex items-center justify-center p-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
                <img
                  alt="Strawberry Wave Case"
                  className="w-full h-full object-cover rounded-DEFAULT group-hover:scale-105 transition-transform duration-300"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU-bAWiHhlC25-gUa_bsY4bZsc0C_TsocUBjFSU_tQgwJaIj3D0ewmAYzpZ4-aoIEgFqChwtA1B_ZzDmeWwqdmtyAlOCQuhNM0Hid7QrUvYuRU_0BGpFW7-O_vche5I4zV5tjKd-DNXXU7Gsaua_CU7NsbJwXJriM4QuMQho97gF2y15XZ592b-fu-JuioG4U9wJiXvWLwvWQjr2akKE6-86wb-eiMu7fwW_NHXw"
                />
              </div>
              <p className="font-headline-sm text-headline-sm text-on-surface mt-space-sm font-bold">
                Strawberry Wave
              </p>
              <p className="font-label-md text-label-md text-primary">$32.00</p>
            </a>

            {/* Card Mockup 2: Retro Floral Disco */}
            <a
              href="#product-catalog"
              onClick={(e) => {
                e.preventDefault();
                setActiveCategory("magsafe");
                setSearchQuery("");
                scrollToCatalog();
              }}
              className="group relative rounded-lg overflow-hidden bg-secondary-fixed p-space-md flex flex-col items-center text-center shadow-[2px_2px_0px_#2a3235] mt-6"
            >
              <span className="absolute top-2 left-2 bg-surface-container-lowest font-label-badge text-label-badge text-tertiary px-2 py-0.5 rounded-full shadow-[1px_1px_0px_#2a3235]">
                MAGSAFE
              </span>
              <div className="w-full h-44 rounded-DEFAULT overflow-hidden bg-surface-container-lowest flex items-center justify-center p-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
                <img
                  alt="Floral Groove Case"
                  className="w-full h-full object-cover rounded-DEFAULT group-hover:scale-105 transition-transform duration-300"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBASnbmHvN39wn7Eh9sH4dAalUgUKOtOuapRBZi5TU4aBAuPFcza2GG3Z5LiI_-Sli2FPhjDvmNKJSSS2qXyMetthjhbJM8skqM7c3LrnnjKqROqENmzDkItNO4TGqB22ef8-2ch6CcWAXOdWzAH371vnQBj9z_FHGMU6HjkOEsWUhlaINYAoqTtyPDnfeXnqEx0VdgS504P_fmvtnhyEb7gAhQ4iNTuty4dq9eRA"
                />
              </div>
              <p className="font-headline-sm text-headline-sm text-on-surface mt-space-sm font-bold">
                Floral Groove
              </p>
              <p className="font-label-md text-label-md text-tertiary">$28.00</p>
            </a>

            {/* Mini floating bubble detail */}
            <div className="col-span-2 bg-surface-container-high rounded-DEFAULT p-space-sm flex items-center justify-between shadow-[2px_2px_0px_#2a3235]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">
                  layers
                </span>
                <div>
                  <p className="font-label-md text-label-md text-on-surface">
                    Amortiguación Doble Capa
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Esquinas con bolsas de aire anticaída
                  </p>
                </div>
              </div>
              <span className="bg-primary text-on-primary font-label-badge text-label-badge px-2 py-1 rounded-full uppercase font-bold">
                Ultra Resistente
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
