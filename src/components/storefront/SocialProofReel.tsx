"use client";

import React, { useEffect, useState } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SocialProofConfig, StoreSettings } from "@/types/database";
import { DEFAULT_SOCIAL_PROOF_CONFIG } from "@/lib/seed-data";
import { getLocalCachedSettings } from "@/lib/queries/cms";

interface SocialProofReelProps {
  settings?: StoreSettings;
}

export function SocialProofReel({ settings }: SocialProofReelProps) {
  const [socialConfig, setSocialConfig] = useState<SocialProofConfig>(
    settings?.social_proof_config || DEFAULT_SOCIAL_PROOF_CONFIG
  );

  useEffect(() => {
    const cached = getLocalCachedSettings();
    const resolved =
      cached?.social_proof_config ||
      settings?.social_proof_config ||
      DEFAULT_SOCIAL_PROOF_CONFIG;
    setSocialConfig({
      ...DEFAULT_SOCIAL_PROOF_CONFIG,
      ...resolved,
      items:
        Array.isArray(resolved.items) && resolved.items.length > 0
          ? resolved.items
          : DEFAULT_SOCIAL_PROOF_CONFIG.items,
    });
  }, [settings]);

  if (socialConfig.enabled === false) {
    return null;
  }

  return (
    <section
      id="social-proof"
      className="w-full max-w-7xl mx-auto px-margin md:px-margin-desktop py-space-2xl scroll-mt-24"
    >
      <ScrollReveal direction="up">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
          <div>
            <span className="inline-flex items-center gap-1 font-label-badge text-label-badge text-primary uppercase font-bold tracking-wider">
              <span className="material-symbols-outlined text-[14px]">
                photo_camera
              </span>{" "}
              {socialConfig.hashtag}
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              {socialConfig.title}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {socialConfig.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-space-sm">
            <a
              className="px-space-md py-2 rounded-full bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-[2px_2px_0px_#2a3235] hover:bg-primary-fixed transition-all flex items-center gap-1.5"
              href={socialConfig.cta_url || "https://instagram.com"}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-[18px]">
                photo_camera
              </span>
              <span>{socialConfig.cta_text}</span>
            </a>
          </div>
        </div>
      </ScrollReveal>

      {/* 4-Card Photo Reel Carousel Preview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-md">
        {socialConfig.items.map((reel, idx) => {
          const badgeClass =
            idx % 2 === 0 ? "text-primary-fixed" : "text-tertiary-fixed";
          const starCount = Math.max(1, Math.min(5, Number(reel.rating || 5)));
          return (
            <ScrollReveal
              key={reel.id || `reel-${idx}`}
              direction="scale"
              delayMs={idx * 100}
              className="h-full"
            >
              <div className="group relative rounded-lg overflow-hidden bg-surface-container shadow-[3px_3px_0px_#2a3235] h-full">
                <div className="aspect-[4/5] w-full overflow-hidden">
                  <img
                    alt={reel.handle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={reel.image_url}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent flex flex-col justify-end p-space-md text-white">
                  <div className="flex items-center gap-1 text-[#f59e0b] text-[14px] mb-1">
                    {Array.from({ length: starCount }).map((_, starIdx) => (
                      <span
                        key={starIdx}
                        className="material-symbols-outlined text-[14px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="font-body-sm text-body-sm font-semibold text-white line-clamp-2">
                    {reel.quote}
                  </p>
                  <span
                    className={`font-label-badge text-label-badge ${badgeClass} mt-1`}
                  >
                    {reel.handle}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
