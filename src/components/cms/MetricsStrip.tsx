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
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {/* Total Products */}
      <div className="bg-white border border-slate-200/90 p-4 rounded-xl shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[11px] font-label-md font-bold text-slate-500 uppercase tracking-wider">
            Total Products
          </span>
          <p className="font-headline-sm text-xl text-on-surface font-extrabold mt-0.5">
            {totalCount} Active
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
          <span className="material-symbols-outlined text-[20px]">cases</span>
        </div>
      </div>

      {/* Live in Store */}
      <div className="bg-white border border-slate-200/90 p-4 rounded-xl shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[11px] font-label-md font-bold text-emerald-700 uppercase tracking-wider">
            Live in Store
          </span>
          <p className="font-headline-sm text-xl text-emerald-700 font-extrabold mt-0.5">
            {liveCount} Visible
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
          <span className="material-symbols-outlined text-[20px]">
            storefront
          </span>
        </div>
      </div>

      {/* Out of Stock */}
      <div className="bg-white border border-slate-200/90 p-4 rounded-xl shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[11px] font-label-md font-bold text-rose-700 uppercase tracking-wider">
            Stockout Alerts
          </span>
          <p className="font-headline-sm text-xl text-rose-700 font-extrabold mt-0.5">
            {stockoutCount} Items
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center">
          <span className="material-symbols-outlined text-[20px]">
            inventory
          </span>
        </div>
      </div>

      {/* Low Inventory Alerts */}
      <div className="bg-white border border-slate-200/90 p-4 rounded-xl shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[11px] font-label-md font-bold text-primary uppercase tracking-wider">
            Low Stock Warning
          </span>
          <p className="font-headline-sm text-xl text-primary font-extrabold mt-0.5">
            {lowStockCount} Cases
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-[20px]">
            notification_important
          </span>
        </div>
      </div>
    </div>
  );
}
