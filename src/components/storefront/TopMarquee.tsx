import React from "react";

export function TopMarquee() {
  return (
    <div className="w-full bg-secondary-container text-on-secondary-container py-space-xs overflow-hidden shadow-[inset_0_-2px_0_rgba(78,105,82,0.15)]">
      <div className="flex items-center gap-space-xl whitespace-nowrap animate-[marquee_24s_linear_infinite]">
        <span className="inline-flex items-center gap-1.5 font-label-badge text-label-badge uppercase tracking-widest font-bold">
          <span className="material-symbols-outlined text-[14px] text-tertiary">
            verified
          </span>{" "}
          Probado contra caídas de 3m • Grado Militar
        </span>
        <span className="text-tertiary">★</span>
        <span className="inline-flex items-center gap-1.5 font-label-badge text-label-badge uppercase tracking-widest font-bold">
          <span className="material-symbols-outlined text-[14px] text-primary">
            favorite
          </span>{" "}
          +12.000 Reseñas de 5 Estrellas en TikTok e IG
        </span>
        <span className="text-tertiary">★</span>
        <span className="inline-flex items-center gap-1.5 font-label-badge text-label-badge uppercase tracking-widest font-bold">
          <span className="material-symbols-outlined text-[14px] text-tertiary">
            bolt
          </span>{" "}
          Atención Rápida por WhatsApp y Asistencia con tu Pedido
        </span>
        <span className="text-tertiary">★</span>
        <span className="inline-flex items-center gap-1.5 font-label-badge text-label-badge uppercase tracking-widest font-bold">
          <span className="material-symbols-outlined text-[14px] text-primary">
            eco
          </span>{" "}
          Bio-Resina Reciclada que No se Pone Amarilla
        </span>
        <span className="text-tertiary">★</span>
        <span className="inline-flex items-center gap-1.5 font-label-badge text-label-badge uppercase tracking-widest font-bold">
          <span className="material-symbols-outlined text-[14px] text-tertiary">
            verified
          </span>{" "}
          Protección Anticaídas 3m
        </span>
        <span className="text-tertiary">★</span>
        <span className="inline-flex items-center gap-1.5 font-label-badge text-label-badge uppercase tracking-widest font-bold">
          <span className="material-symbols-outlined text-[14px] text-primary">
            favorite
          </span>{" "}
          +12.000 Clientes Felices
        </span>
      </div>
    </div>
  );
}
