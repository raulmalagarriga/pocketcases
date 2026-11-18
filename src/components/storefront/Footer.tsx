"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { StoreSettings } from "@/types/database";
import { getLocalCachedSettings } from "@/lib/queries/cms";
import { ScrollReveal, smoothScrollTo } from "@/components/ui/ScrollReveal";

interface FooterProps {
  settings?: StoreSettings;
}

export function Footer({ settings }: FooterProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [liveLogoUrl, setLiveLogoUrl] = useState<string>(
    settings?.logo_url || "/logo.png"
  );
  const { setActiveCategory, setSearchQuery } = useCartStore();

  useEffect(() => {
    const cached = getLocalCachedSettings();
    if (cached?.logo_url) {
      setLiveLogoUrl(cached.logo_url);
    } else if (settings?.logo_url) {
      setLiveLogoUrl(settings.logo_url);
    }
  }, [settings]);

  const handleJoin = () => {
    if (!email.trim()) return;
    setJoined(true);
    setEmail("");
  };

  const handleCategoryClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    category: string
  ) => {
    e.preventDefault();
    setActiveCategory(category);
    setSearchQuery("");
    if (pathname !== "/catalog") {
      router.push("/catalog");
      return;
    }
    smoothScrollTo("#product-catalog");
  };

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    selector: string
  ) => {
    e.preventDefault();
    if (pathname !== "/") {
      router.push(`/${selector}`);
      return;
    }
    smoothScrollTo(selector);
  };

  return (
    <footer className="w-full bg-surface-container-lowest mt-space-2xl pt-space-2xl pb-space-xl shadow-[0_-4px_20px_rgba(42,50,53,0.03)]">
      <div className="max-w-7xl mx-auto px-margin md:px-margin-desktop">
        <ScrollReveal direction="up">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl pb-space-2xl">
            <div className="lg:col-span-2 space-y-space-md">
              <div className="flex items-center shrink-0">
                <img
                  alt={settings?.store_name || "Pocket Cases"}
                  className="h-12 w-[124px] shrink-0 object-contain rounded-lg shadow-[2px_2px_0px_#2a3235] bg-[#d8f3c8]"
                  src={liveLogoUrl || "/logo.png"}
                  onError={(e) => {
                    e.currentTarget.src = "/logo.png";
                  }}
                />
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                Accesorios para tu teléfono con vibra Y2K y protección MagSafe
                diseñados para darle chispa a tu día a día.
              </p>
              <div className="pt-space-xs">
                <p className="font-label-lg text-label-lg text-on-surface mb-space-xs">
                  Únete al Pocket Club y llévate 15% de descuento
                </p>
                <div className="flex max-w-sm rounded-full bg-surface-container p-1 shadow-[2px_2px_0px_#2a3235]">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-transparent px-space-md py-2 font-body-sm text-body-sm text-on-surface focus:outline-none"
                    placeholder={
                      joined
                        ? "¡Código POCKET15 activado!"
                        : "Tu correo electrónico..."
                    }
                    type="email"
                  />
                  <button
                    onClick={handleJoin}
                    className="bg-primary text-on-primary font-label-md text-label-md px-space-md py-2 rounded-full shadow-[2px_2px_0px_#2a3235] hover:bg-primary-container hover:text-on-primary-container transition-all"
                    type="button"
                  >
                    {joined ? "¡Listo!" : "Unirme"}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-space-sm">
              <h3 className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider">
                Tienda
              </h3>
              <ul className="space-y-space-xs font-body-md text-body-md text-on-surface-variant">
                <li className="hover:text-primary transition-colors">
                  <a
                    href="/catalog"
                    onClick={(e) => handleCategoryClick(e, "iphone")}
                  >
                    Serie iPhone 16
                  </a>
                </li>
                <li className="hover:text-primary transition-colors">
                  <a
                    href="/catalog"
                    onClick={(e) => handleCategoryClick(e, "magsafe")}
                  >
                    Grips MagSafe
                  </a>
                </li>
                <li className="hover:text-primary transition-colors">
                  <a
                    href="/catalog"
                    onClick={(e) => handleCategoryClick(e, "collabs")}
                  >
                    Charms y Accesorios
                  </a>
                </li>
                <li className="hover:text-primary transition-colors">
                  <a
                    href="/catalog"
                    onClick={(e) => handleCategoryClick(e, "slim")}
                  >
                    Fundas AirPods
                  </a>
                </li>
                <li className="hover:text-primary transition-colors">
                  <a
                    href="/catalog"
                    onClick={(e) => handleCategoryClick(e, "all")}
                  >
                    Tarjetas de Regalo
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-space-sm">
              <h3 className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider">
                Atención al Cliente
              </h3>
              <ul className="space-y-space-xs font-body-md text-body-md text-on-surface-variant">
                <li className="hover:text-primary transition-colors">
                  <a
                    href="#faq-section"
                    onClick={(e) => handleAnchorClick(e, "#faq-section")}
                  >
                    Rastreo de Pedidos
                  </a>
                </li>
                <li className="hover:text-primary transition-colors">
                  <a
                    href="#faq-section"
                    onClick={(e) => handleAnchorClick(e, "#faq-section")}
                  >
                    Cambios y Devoluciones
                  </a>
                </li>
                <li className="hover:text-primary transition-colors">
                  <a
                    href="#faq-section"
                    onClick={(e) => handleAnchorClick(e, "#faq-section")}
                  >
                    Preguntas Frecuentes
                  </a>
                </li>
                <li className="hover:text-primary transition-colors">
                  <a
                    href="#faq-section"
                    onClick={(e) => handleAnchorClick(e, "#faq-section")}
                  >
                    Políticas de Envío
                  </a>
                </li>
                <li className="hover:text-primary transition-colors">
                  <a
                    href="https://wa.me/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contacto por WhatsApp
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-space-sm">
              <h3 className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider">
                Conéctate
              </h3>
              <ul className="space-y-space-xs font-body-md text-body-md text-on-surface-variant">
                <li className="hover:text-primary transition-colors">
                  <a
                    href="https://tiktok.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    TikTok @pocketcases
                  </a>
                </li>
                <li className="hover:text-primary transition-colors">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram @pocketcases
                  </a>
                </li>
                <li className="hover:text-primary transition-colors">
                  <a
                    href="#social-proof"
                    onClick={(e) => handleAnchorClick(e, "#social-proof")}
                  >
                    Pinterest Lookbook
                  </a>
                </li>
                <li className="hover:text-primary transition-colors">
                  <a
                    href="#social-proof"
                    onClick={(e) => handleAnchorClick(e, "#social-proof")}
                  >
                    Club de Creadores
                  </a>
                </li>
              </ul>
              <div className="pt-space-sm">
                <div className="inline-flex items-center gap-1.5 px-space-sm py-1 bg-secondary-container text-on-secondary-container rounded-full font-label-badge text-label-badge">
                  <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                  <span>Atención WhatsApp en Vivo</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delayMs={100}>
          <div className="pt-space-xl pb-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md bg-surface-container-low rounded-lg px-space-lg">
            <div className="flex items-center gap-space-sm text-on-surface-variant font-label-md text-label-md">
              <span className="material-symbols-outlined text-tertiary text-[20px]">
                verified_user
              </span>
              <span>Garantía de compra 100% segura</span>
            </div>
            <div className="flex items-center flex-wrap gap-space-sm font-label-badge text-label-badge text-on-surface">
              <span className="bg-surface-container-lowest px-space-sm py-1 rounded-full shadow-[1px_1px_0px_#2a3235]">
                Apple Pay
              </span>
              <span className="bg-surface-container-lowest px-space-sm py-1 rounded-full shadow-[1px_1px_0px_#2a3235]">
                Pago Móvil
              </span>
              <span className="bg-surface-container-lowest px-space-sm py-1 rounded-full shadow-[1px_1px_0px_#2a3235]">
                Zelle
              </span>
              <span className="bg-surface-container-lowest px-space-sm py-1 rounded-full shadow-[1px_1px_0px_#2a3235]">
                Visa / Master
              </span>
              <span className="bg-surface-container-lowest px-space-sm py-1 rounded-full shadow-[1px_1px_0px_#2a3235]">
                PayPal
              </span>
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-space-lg text-center font-body-sm text-body-sm text-outline">
          <p>
            © 2025 Pocket Cases Inc. Estética Y2K y Armadura Moderna. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
