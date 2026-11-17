"use client";

import React from "react";
import { Product } from "@/types/database";

interface MetricsStripProps {
  products: Product[];
}

export function MetricsStrip({ products }: MetricsStripProps) {
  const totalCount = products.length;
  const liveCount = products.filter((p) => p.is_live).length;
  const stockoutCount = products.filter(
    (p) => p.stock_status === "out_of_stock" || p.total_stock === 0
  ).length;
  const lowStockCount = products.filter(
    (p) =>
      p.stock_status === "low_stock" ||
      (p.total_stock > 0 && p.total_stock <= p.low_stock_threshold)
  ).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md">
      {/* Total Products */}
      <div className="bg-surface-container-lowest p-space-md rounded-DEFAULT shadow-[3px_3px_0px_#2a3235] flex items-center justify-between">
        <div>
          <span className="font-label-badge text-label-badge text-on-surface-variant uppercase">
            Total Products
          </span>
          <p className="font-headline-sm text-headline-sm text-on-surface font-extrabold mt-0.5">
            {totalCount} Active
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-[1px_1px_0px_#2a3235]">
          <span className="material-symbols-outlined text-[20px]">cases</span>
        </div>
      </div>

      {/* Live in Store */}
      <div className="bg-surface-container-lowest p-space-md rounded-DEFAULT shadow-[3px_3px_0px_#2a3235] flex items-center justify-between">
        <div>
          <span className="font-label-badge text-label-badge text-tertiary uppercase">
            Live in Store
          </span>
          <p className="font-headline-sm text-headline-sm text-tertiary font-extrabold mt-0.5">
            {liveCount} Visible
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-on-tertiary-container flex items-center justify-center shadow-[1px_1px_0px_#2a3235]">
          <span className="material-symbols-outlined text-[20px]">
            storefront
          </span>
        </div>
      </div>

      {/* Out of Stock */}
      <div className="bg-surface-container-lowest p-space-md rounded-DEFAULT shadow-[3px_3px_0px_#2a3235] flex items-center justify-between">
        <div>
          <span className="font-label-badge text-label-badge text-error uppercase">
            Stockout Alerts
          </span>
          <p className="font-headline-sm text-headline-sm text-error font-extrabold mt-0.5">
            {stockoutCount} Items
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center shadow-[1px_1px_0px_#2a3235]">
          <span className="material-symbols-outlined text-[20px]">
            inventory
          </span>
        </div>
      </div>

      {/* Low Inventory Alerts */}
      <div className="bg-surface-container-lowest p-space-md rounded-DEFAULT shadow-[3px_3px_0px_#2a3235] flex items-center justify-between">
        <div>
          <span className="font-label-badge text-label-badge text-primary font-bold uppercase">
            Low Stock Warning
          </span>
          <p className="font-headline-sm text-headline-sm text-primary font-extrabold mt-0.5">
            {lowStockCount} Cases
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center shadow-[1px_1px_0px_#2a3235]">
          <span className="material-symbols-outlined text-[20px]">
            notification_important
          </span>
        </div>
      </div>
    </div>
  );
}
