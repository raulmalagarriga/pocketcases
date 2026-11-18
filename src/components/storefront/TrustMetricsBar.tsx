import React from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const TRUST_CARDS = [
  {
    icon: "shield_with_heart",
    title: "Protección Anticaídas 3m",
    subtitle: "Garantía contra pantallas rotas",
    badgeClass: "bg-primary-fixed text-primary",
  },
  {
    icon: "recycling",
    title: "100% Eco-Resina",
    subtitle: "Empaque biodegradable",
    badgeClass: "bg-secondary-fixed text-tertiary",
  },
  {
    icon: "palette",
    title: "Estampado HD Indeleble",
    subtitle: "No se pela ni se decolora",
    badgeClass: "bg-primary-fixed-dim text-primary",
  },
  {
    icon: "flight_takeoff",
    title: "Envíos Rápidos",
    subtitle: "Entrega rastreada hasta tu puerta",
    badgeClass: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  },
];

export function TrustMetricsBar() {
  return (
    <section className="w-full max-w-7xl mx-auto px-margin md:px-margin-desktop py-space-lg">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
        {TRUST_CARDS.map((card, idx) => (
          <ScrollReveal
            key={card.title}
            direction="up"
            delayMs={idx * 90}
            className="h-full"
          >
            <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-[3px_3px_0px_#2a3235] flex items-center gap-space-sm h-full">
              <div
                className={`w-12 h-12 rounded-full ${card.badgeClass} flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_#2a3235]`}
              >
                <span className="material-symbols-outlined text-[24px]">
                  {card.icon}
                </span>
              </div>
              <div>
                <h4 className="font-label-lg text-label-lg text-on-surface">
                  {card.title}
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {card.subtitle}
                </p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
