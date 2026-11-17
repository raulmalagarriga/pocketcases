"use client";

import React, { useState } from "react";
import { Product } from "@/types/database";
import { DEFAULT_CARD_MODELS } from "@/lib/seed-data";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface WaitlistModalProps {
  product: Product;
  onClose: () => void;
}

export function WaitlistModal({ product, onClose }: WaitlistModalProps) {
  const [phone, setPhone] = useState("");
  const [phoneModel, setPhoneModel] = useState(DEFAULT_CARD_MODELS[0]);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        await supabase.from("waitlist_subscriptions").insert({
          product_id: product.id,
          whatsapp_phone: phone.trim(),
          phone_model: phoneModel,
        });
      } catch {
        // Ignore if table not yet migrated
      }
    }

    setSaved(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/50 backdrop-blur-sm">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-lg p-space-lg shadow-[4px_4px_0px_#2a3235]">
        <div className="flex items-center justify-between pb-space-sm">
          <span className="inline-flex items-center gap-1 bg-primary-fixed text-primary font-label-badge text-label-badge px-2.5 py-1 rounded-full font-bold uppercase">
            <span className="material-symbols-outlined text-[14px]">
              notifications_active
            </span>
            Lista de Espera VIP
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container text-on-surface flex items-center justify-center shadow-[1px_1px_0px_#2a3235]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {saved ? (
          <div className="py-space-lg text-center space-y-space-sm">
            <div className="w-12 h-12 rounded-full bg-tertiary-fixed text-on-tertiary-container mx-auto flex items-center justify-center shadow-[2px_2px_0px_#2a3235]">
              <span className="material-symbols-outlined text-[24px]">
                check_circle
              </span>
            </div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              ¡Listo! Te avisaremos por WhatsApp
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Apenas <strong>{product.title}</strong> ({phoneModel}) vuelva a
              estar disponible, recibirás un mensaje prioritario.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-space-sm px-space-lg py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-[2px_2px_0px_#2a3235]"
            >
              Entendido
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-space-md pt-space-xs">
            <div>
              <h4 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                {product.title}
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Déjanos tu WhatsApp y te avisaremos apenas llegue el próximo
                lote.
              </p>
            </div>

            <div>
              <label className="font-label-badge text-label-badge uppercase text-on-surface-variant block mb-1">
                Tu modelo de teléfono
              </label>
              <select
                value={phoneModel}
                onChange={(e) => setPhoneModel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface shadow-[1px_1px_0px_#2a3235]"
              >
                {DEFAULT_CARD_MODELS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-label-badge text-label-badge uppercase text-on-surface-variant block mb-1">
                Tu número de WhatsApp
              </label>
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej. 0412-0000000"
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md shadow-[2px_2px_0px_#2a3235] hover:bg-primary hover:text-on-primary transition-all"
            >
              Notificarme por WhatsApp
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
