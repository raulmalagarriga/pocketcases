"use client";

import React, { useState } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const FAQS = [
  {
    id: 1,
    question:
      "¿Las fundas Pocket Cases son compatibles con cargadores MagSafe de Apple?",
    answer:
      '¡Sí, totalmente! Todos los modelos marcados como "MagSafe Tough" y "Mirror MagSafe" integran un anillo magnético de neodimio de 36 imanes flush de alto poder, alineado a la perfección entre nuestras capas protectoras para asegurar un agarre súper firme con cargadores inalámbricos, soportes y cargadores rápidos Qi2.',
    iconColor: "text-primary",
  },
  {
    id: 2,
    question: "¿Cómo funciona el pedido rápido por WhatsApp?",
    answer:
      'Al tocar "Pagar directo por WhatsApp", se genera automáticamente el detalle de tu compra con los modelos y acabados seleccionados. Una asesora de Pocket Cases te atiende al instante para confirmar el modelo exacto de tu cel, coordinar el pago (vía Zelle, Pago Móvil, tarjeta o efectivo) y despachar tu pedido de una vez.',
    iconColor: "text-tertiary",
  },
  {
    id: 3,
    question: "¿Las fundas transparentes se ponen amarillas con el tiempo?",
    answer:
      "¡Para nada! Nuestra serie Crystal Clear está fabricada con policarbonato alifático premium resistente a los rayos UV con filtro de onda azul. Cero efecto amarillo, respaldado por nuestra Garantía de 1 Año Anti-Amarilleo.",
    iconColor: "text-primary",
  },
];

export function FaqSection() {
  const [openIds, setOpenIds] = useState<number[]>([1, 2, 3]);

  const toggleFaq = (id: number) => {
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
            Ayuda y Compatibilidad
          </span>
          <h3 className="font-headline-lg text-headline-lg text-on-surface">
            Preguntas Frecuentes
          </h3>
        </div>
      </ScrollReveal>

      <div className="space-y-space-sm">
        {FAQS.map((faq, idx) => {
          const isOpen = openIds.includes(faq.id);
          return (
            <ScrollReveal key={faq.id} direction="up" delayMs={idx * 80}>
              <div
                onClick={() => toggleFaq(faq.id)}
                className="bg-surface-container-lowest p-space-md rounded-lg shadow-[2px_2px_0px_#2a3235] cursor-pointer transition-shadow hover:shadow-[3px_3px_0px_#2a3235]"
              >
                <h4 className="font-headline-sm text-headline-sm text-on-surface flex items-center justify-between gap-2">
                  <span>{faq.question}</span>
                  <span
                    className={`material-symbols-outlined ${faq.iconColor} text-[20px] transition-transform duration-300 flex-shrink-0 ${
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
