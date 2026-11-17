import React from "react";

export function TrustMetricsBar() {
  return (
    <section className="w-full max-w-7xl mx-auto px-margin md:px-margin-desktop py-space-lg">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-[3px_3px_0px_#2a3235] flex items-center gap-space-sm">
          <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary flex-shrink-0 shadow-[1px_1px_0px_#2a3235]">
            <span className="material-symbols-outlined text-[24px]">
              shield_with_heart
            </span>
          </div>
          <div>
            <h4 className="font-label-lg text-label-lg text-on-surface">
              Protección Anticaídas 3m
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Garantía contra pantallas rotas
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-[3px_3px_0px_#2a3235] flex items-center gap-space-sm">
          <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-tertiary flex-shrink-0 shadow-[1px_1px_0px_#2a3235]">
            <span className="material-symbols-outlined text-[24px]">
              recycling
            </span>
          </div>
          <div>
            <h4 className="font-label-lg text-label-lg text-on-surface">
              100% Eco-Resina
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Empaque biodegradable
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-[3px_3px_0px_#2a3235] flex items-center gap-space-sm">
          <div className="w-12 h-12 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary flex-shrink-0 shadow-[1px_1px_0px_#2a3235]">
            <span className="material-symbols-outlined text-[24px]">
              palette
            </span>
          </div>
          <div>
            <h4 className="font-label-lg text-label-lg text-on-surface">
              Estampado HD Indeleble
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              No se pela ni se decolora
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-[3px_3px_0px_#2a3235] flex items-center gap-space-sm">
          <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed-variant flex-shrink-0 shadow-[1px_1px_0px_#2a3235]">
            <span className="material-symbols-outlined text-[24px]">
              flight_takeoff
            </span>
          </div>
          <div>
            <h4 className="font-label-lg text-label-lg text-on-surface">
              Envíos Rápidos
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Entrega rastreada hasta tu puerta
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
