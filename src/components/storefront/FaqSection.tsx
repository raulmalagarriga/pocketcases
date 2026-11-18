"use client";

import React, { useEffect, useState } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { FaqConfig, StoreSettings } from "@/types/database";
import { DEFAULT_FAQ_CONFIG } from "@/lib/seed-data";
import { getLocalCachedSettings } from "@/lib/queries/cms";

interface FaqSectionProps {
  settings?: StoreSettings;
}

export function FaqSection({ settings }: FaqSectionProps) {
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [faqConfig, setFaqConfig] = useState<FaqConfig>(
    settings?.faq_config || DEFAULT_FAQ_CONFIG
  );

  useEffect(() => {
    const cached = getLocalCachedSettings();
    const resolved =
      cached?.faq_config || settings?.faq_config || DEFAULT_FAQ_CONFIG;
    setFaqConfig({
      ...DEFAULT_FAQ_CONFIG,
      ...resolved,
      items:
        Array.isArray(resolved.items) && resolved.items.length > 0
          ? resolved.items
          : DEFAULT_FAQ_CONFIG.items,
    });
  }, [settings]);

  if (faqConfig.enabled === false) {
    return null;
  }

  const toggleFaq = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section
      id="faq-section"
      className="w-full max-w-4xl mx-auto px-margin md:px-margin-desktop pb-space-2xl scroll-mt-24"
    >
      <ScrollReveal direction="up">
        <div className="text-center space-y-space-xs mb-space-lg">
          <span className="font-label-badge text-label-badge text-tertiary uppercase font-bold tracking-widest">
            {faqConfig.badge_text}
          </span>
          <h3 className="font-headline-lg text-headline-lg text-on-surface">
            {faqConfig.title}
          </h3>
        </div>
      </ScrollReveal>

      <div className="space-y-space-sm">
        {faqConfig.items.map((faq, idx) => {
          const faqId = String(faq.id || `faq-${idx}`);
          const isOpen = openIds.includes(faqId);
          const iconColor = idx % 2 === 0 ? "text-primary" : "text-tertiary";
          return (
            <ScrollReveal key={faqId} direction="up" delayMs={idx * 80}>
              <div
                onClick={() => toggleFaq(faqId)}
                className="bg-surface-container-lowest p-space-md rounded-lg shadow-[2px_2px_0px_#2a3235] cursor-pointer transition-shadow hover:shadow-[3px_3px_0px_#2a3235]"
              >
                <h4 className="font-headline-sm text-headline-sm text-on-surface flex items-center justify-between gap-2">
                  <span>{faq.question}</span>
                  <span
                    className={`material-symbols-outlined ${iconColor} text-[20px] transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    add
                  </span>
                </h4>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100 mt-2"
                      : "grid-rows-[0fr] opacity-0 mt-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
