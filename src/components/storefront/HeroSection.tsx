"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { StoreSettings } from "@/types/database";
import { DEFAULT_HERO_CONFIG } from "@/lib/seed-data";
import { getLocalCachedSettings } from "@/lib/queries/cms";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface HeroSectionProps {
  settings: StoreSettings;
}

export function HeroSection({ settings }: HeroSectionProps) {
  const router = useRouter();
  const { setActiveCategory, setSearchQuery } = useCartStore();
  const [liveSettings, setLiveSettings] = useState<StoreSettings>(settings);

  useEffect(() => {
    const cached = getLocalCachedSettings();
    if (cached) {
      setLiveSettings((prev) => ({
        ...prev,
        ...cached,
        logo_url: cached.logo_url || prev.logo_url || "/logo.png",
        hero_config: cached.hero_config || prev.hero_config || DEFAULT_HERO_CONFIG,
      }));
    } else {
      setLiveSettings(settings);
    }
  }, [settings]);

  const hero = liveSettings?.hero_config || DEFAULT_HERO_CONFIG;
  const card1 = hero.card_1 || DEFAULT_HERO_CONFIG.card_1;
  const card2 = hero.card_2 || DEFAULT_HERO_CONFIG.card_2;

  const navigateToCatalog = (category: string, keyword = "") => {
    setActiveCategory(category);
    setSearchQuery(keyword);
    router.push("/catalog");
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-margin md:px-margin-desktop pt-space-xl pb-space-2xl overflow-visible">
      {/* Ambient Pastel Halo Blobs */}
      <div className="absolute -top-12 -left-16 w-80 h-80 rounded-full bg-primary-fixed blur-3xl opacity-60 pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 -right-20 w-96 h-96 rounded-full bg-secondary-fixed blur-3xl opacity-70 pointer-events-none -z-10"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
        {/* Left Hero Editorial Column */}
        <ScrollReveal
          direction="left"
          durationMs={700}
          className="lg:col-span-6 flex flex-col items-start space-y-space-md"
        >
          {/* Brand Pill Chip with Logo */}
          <div className="inline-flex items-center gap-space-sm bg-surface-container-lowest px-space-md py-1.5 rounded-full shadow-[2px_2px_0px_#2a3235]">
            <img
              alt={liveSettings?.store_name || "Pocket Cases"}
              className="w-6 h-6 object-contain rounded-full bg-primary-fixed"
              src={liveSettings?.logo_url || "/logo-full.png"}
            />
            <span className="font-label-md text-label-md text-primary font-extrabold uppercase tracking-wide">
              {hero.badge_text}
            </span>
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
          </div>

          {/* Main Display Headline */}
          <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-on-surface">
            {hero.headline_prefix}{" "}
            <span className="relative inline-block text-primary">
              {hero.headline_highlight}
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
            {hero.headline_suffix}
          </h1>

          {/* Subheading */}
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
            {hero.subheadline}
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
              {hero.rating_score}
            </span>
            <span className="text-on-surface-variant font-body-sm text-body-sm">
              {hero.rating_text}
            </span>
          </div>

          {/* CTA Action Buttons */}
          <div className="pt-space-sm flex flex-wrap items-center gap-space-md w-full sm:w-auto">
            <a
              onClick={(e) => {
                e.preventDefault();
                navigateToCatalog("all", "");
              }}
              className="w-full sm:w-auto text-center px-space-xl py-3.5 bg-primary-container text-on-primary-container font-label-lg text-label-lg rounded-full shadow-[3px_3px_0px_#2a3235] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#2a3235] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center justify-center gap-2"
              href="/catalog"
            >
              <span>{hero.primary_cta_text}</span>
              <span className="material-symbols-outlined text-[20px]">
                arrow_forward
              </span>
            </a>
            <a
              onClick={(e) => {
                e.preventDefault();
                navigateToCatalog("magsafe", "");
              }}
              className="w-full sm:w-auto text-center px-space-lg py-3.5 bg-surface-container-lowest text-primary font-label-lg text-label-lg rounded-full shadow-[3px_3px_0px_#2a3235] hover:bg-secondary-container hover:text-on-secondary-container transition-all flex items-center justify-center gap-2"
              href="/catalog"
            >
              <span className="material-symbols-outlined text-[20px]">
                trip_origin
              </span>
              <span>{hero.secondary_cta_text}</span>
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
                Gratis ${settings?.free_shipping_threshold_usd ?? 35}+
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
        </ScrollReveal>

        {/* Right Visual Showcase / Dynamic Asymmetric Collage */}
        <ScrollReveal
          direction="right"
          delayMs={120}
          durationMs={750}
          className="lg:col-span-6 relative flex justify-center items-center"
        >
          {/* Giant Rotating Retro Stamp Badge */}
          <div className="absolute -top-4 -right-2 md:top-2 md:right-4 z-20 w-24 h-24 rounded-full bg-primary-container text-on-primary-container p-2 flex flex-col items-center justify-center text-center shadow-[3px_3px_0px_#2a3235] rotate-12 hover:rotate-0 transition-transform">
            <span className="material-symbols-outlined text-[20px]">
              auto_awesome
            </span>
            <span className="font-label-badge text-label-badge leading-tight uppercase font-extrabold">
              {hero.stamp_line_1}
              <br />
              {hero.stamp_line_2}
            </span>
          </div>

          {/* Main Phone Showcase Mosaic */}
          <div className="relative w-full max-w-lg grid grid-cols-2 gap-space-md p-space-md bg-surface-container-lowest rounded-xl shadow-[4px_4px_0px_#2a3235]">
            {/* Card Mockup 1 */}
            <a
              href="/catalog"
              onClick={(e) => {
                e.preventDefault();
                navigateToCatalog(
                  card1.category_filter || "all",
                  card1.search_keyword || ""
                );
              }}
              className="group relative rounded-lg overflow-hidden bg-primary-fixed p-space-md flex flex-col items-center text-center shadow-[2px_2px_0px_#2a3235]"
            >
              <span className="absolute top-2 left-2 bg-surface-container-lowest font-label-badge text-label-badge text-primary px-2 py-0.5 rounded-full shadow-[1px_1px_0px_#2a3235] z-10">
                {card1.badge}
              </span>
              <div className="w-full h-44 rounded-DEFAULT overflow-hidden bg-surface-container-lowest flex items-center justify-center p-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
                <img
                  alt={card1.title}
                  className="w-full h-full object-cover rounded-DEFAULT group-hover:scale-105 transition-transform duration-300"
                  src={card1.image_url}
                />
              </div>
              <p className="font-headline-sm text-headline-sm text-on-surface mt-space-sm font-bold">
                {card1.title}
              </p>
              <p className="font-label-md text-label-md text-primary">
                {card1.price_text}
              </p>
            </a>

            {/* Card Mockup 2 */}
            <a
              href="/catalog"
              onClick={(e) => {
                e.preventDefault();
                navigateToCatalog(
                  card2.category_filter || "magsafe",
                  card2.search_keyword || ""
                );
              }}
              className="group relative rounded-lg overflow-hidden bg-secondary-fixed p-space-md flex flex-col items-center text-center shadow-[2px_2px_0px_#2a3235] mt-6"
            >
              <span className="absolute top-2 left-2 bg-surface-container-lowest font-label-badge text-label-badge text-tertiary px-2 py-0.5 rounded-full shadow-[1px_1px_0px_#2a3235] z-10">
                {card2.badge}
              </span>
              <div className="w-full h-44 rounded-DEFAULT overflow-hidden bg-surface-container-lowest flex items-center justify-center p-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
                <img
                  alt={card2.title}
                  className="w-full h-full object-cover rounded-DEFAULT group-hover:scale-105 transition-transform duration-300"
                  src={card2.image_url}
                />
              </div>
              <p className="font-headline-sm text-headline-sm text-on-surface mt-space-sm font-bold">
                {card2.title}
              </p>
              <p className="font-label-md text-label-md text-tertiary">
                {card2.price_text}
              </p>
            </a>

            {/* Mini floating bubble detail */}
            <div className="col-span-2 bg-surface-container-high rounded-DEFAULT p-space-sm flex items-center justify-between shadow-[2px_2px_0px_#2a3235]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">
                  layers
                </span>
                <div>
                  <p className="font-label-md text-label-md text-on-surface">
                    {hero.feature_bubble_title}
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {hero.feature_bubble_subtitle}
                  </p>
                </div>
              </div>
              <span className="bg-primary text-on-primary font-label-badge text-label-badge px-2 py-1 rounded-full uppercase font-bold">
                {hero.feature_bubble_badge}
              </span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
