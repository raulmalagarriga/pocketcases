"use client";

import React, { useMemo } from "react";
import { Product, StoreSettings } from "@/types/database";

interface AnalyticsViewProps {
  products: Product[];
  settings: StoreSettings;
  onEditProduct: (product: Product) => void;
}

interface CategoryStat {
  category: string;
  skuCount: number;
  totalUnits: number;
  avgPrice: number;
  avgMarginPercent: number;
  retailValueUsd: number;
}

export function AnalyticsView({
  products,
  settings,
  onEditProduct,
}: AnalyticsViewProps) {
  const bcvRate = settings.bcv_exchange_rate || 45.8;

  const totalUnits = products.reduce((sum, p) => sum + p.total_stock, 0);
  const totalCostUsd = products.reduce(
    (sum, p) => sum + p.cost_usd * p.total_stock,
    0
  );
  const totalRetailUsd = products.reduce(
    (sum, p) => sum + p.price_usd * p.total_stock,
    0
  );
  const totalRetailVes = totalRetailUsd * bcvRate;
  const potentialNetProfitUsd = totalRetailUsd - totalCostUsd;

  const avgGrossMargin = useMemo(() => {
    if (products.length === 0) return 0;
    const sumMargins = products.reduce((acc, p) => {
      const m =
        p.price_usd > 0 ? ((p.price_usd - p.cost_usd) / p.price_usd) * 100 : 0;
      return acc + m;
    }, 0);
    return Math.round(sumMargins / products.length);
  }, [products]);

  const categoryBreakdown = useMemo<CategoryStat[]>(() => {
    const map = new Map<
      string,
      {
        skuCount: number;
        totalUnits: number;
        priceSum: number;
        marginSum: number;
        retailValueUsd: number;
      }
    >();

    for (const p of products) {
      const cat = p.category_badge || "General";
      const margin =
        p.price_usd > 0 ? ((p.price_usd - p.cost_usd) / p.price_usd) * 100 : 0;
      const entry = map.get(cat) || {
        skuCount: 0,
        totalUnits: 0,
        priceSum: 0,
        marginSum: 0,
        retailValueUsd: 0,
      };
      entry.skuCount += 1;
      entry.totalUnits += p.total_stock;
      entry.priceSum += p.price_usd;
      entry.marginSum += margin;
      entry.retailValueUsd += p.price_usd * p.total_stock;
      map.set(cat, entry);
    }

    return Array.from(map.entries())
      .map(([category, v]) => ({
        category,
        skuCount: v.skuCount,
        totalUnits: v.totalUnits,
        avgPrice: v.priceSum / Math.max(1, v.skuCount),
        avgMarginPercent: Math.round(v.marginSum / Math.max(1, v.skuCount)),
        retailValueUsd: v.retailValueUsd,
      }))
      .sort((a, b) => b.retailValueUsd - a.retailValueUsd);
  }, [products]);

  const topProductsLeaderboard = useMemo(() => {
    return [...products].sort(
      (a, b) => b.price_usd * b.total_stock - a.price_usd * a.total_stock
    );
  }, [products]);

  return (
    <div className="flex flex-col gap-space-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div>
          <nav className="flex items-center gap-2 font-label-badge text-label-badge text-on-surface-variant uppercase tracking-wider mb-1">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-[12px] text-outline">
              chevron_right
            </span>
            <span className="text-primary font-bold">
              Financial &amp; Margin Analytics
            </span>
          </nav>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
            Inventory Valuation, Gross Margins &amp; Category Performance
          </h1>
        </div>
      </div>

      {/* 5 Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
        <div className="bg-surface-container-lowest p-space-md rounded-DEFAULT shadow-[3px_3px_0px_#2a3235]">
          <span className="font-label-badge text-label-badge text-on-surface-variant uppercase">
            Total Units in Warehouse
          </span>
          <p className="font-headline-md text-headline-md text-on-surface font-extrabold mt-1">
            {totalUnits} units
          </p>
          <p className="font-label-badge text-[10px] text-outline mt-0.5">
            Across {products.length} active designs
          </p>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-DEFAULT shadow-[3px_3px_0px_#2a3235]">
          <span className="font-label-badge text-label-badge text-on-surface-variant uppercase">
            Inventory Cost Value
          </span>
          <p className="font-headline-md text-headline-md text-on-surface font-extrabold mt-1">
            ${totalCostUsd.toFixed(2)}
          </p>
          <p className="font-label-badge text-[10px] text-outline mt-0.5">
            FOB Landed Cost ($ USD)
          </p>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-DEFAULT shadow-[3px_3px_0px_#2a3235]">
          <span className="font-label-badge text-label-badge text-primary uppercase">
            Total Retail Valuation
          </span>
          <p className="font-headline-md text-headline-md text-primary font-extrabold mt-1">
            ${totalRetailUsd.toFixed(2)}
          </p>
          <p className="font-label-badge text-[10px] text-on-surface-variant font-bold mt-0.5">
            Bs.{" "}
            {totalRetailVes.toLocaleString("es-VE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            BCV
          </p>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-DEFAULT shadow-[3px_3px_0px_#2a3235]">
          <span className="font-label-badge text-label-badge text-tertiary uppercase">
            Potential Net Profit
          </span>
          <p className="font-headline-md text-headline-md text-tertiary font-extrabold mt-1">
            +${potentialNetProfitUsd.toFixed(2)}
          </p>
          <p className="font-label-badge text-[10px] text-on-surface-variant mt-0.5">
            Retail minus Landed Cost
          </p>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-DEFAULT shadow-[3px_3px_0px_#2a3235]">
          <span className="font-label-badge text-label-badge text-on-surface-variant uppercase">
            Avg. Gross Margin %
          </span>
          <p className="font-headline-md text-headline-md text-on-surface font-extrabold mt-1">
            {avgGrossMargin}% GM
          </p>
          <p className="font-label-badge text-[10px] text-tertiary font-bold mt-0.5">
            Target D2C Benchmark: 70%+
          </p>
        </div>
      </div>

      {/* Category Performance Breakdown */}
      <div className="bg-surface-container-lowest rounded-DEFAULT shadow-[3px_3px_0px_#2a3235] overflow-hidden">
        <div className="p-space-md bg-surface-container-high flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              bar_chart
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
              Category Performance &amp; Margin Breakdown
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface font-label-badge text-label-badge uppercase tracking-wider">
                <th className="py-3 px-4">Category Line</th>
                <th className="py-3 px-4">SKU Count</th>
                <th className="py-3 px-4">Total Stock Units</th>
                <th className="py-3 px-4">Avg. Retail Price</th>
                <th className="py-3 px-4">Avg. Gross Margin %</th>
                <th className="py-3 px-4 text-right">Retail Valuation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/25 font-body-sm text-body-sm">
              {categoryBreakdown.map((cat) => {
                const maxUnits = Math.max(1, totalUnits);
                const sharePercent = Math.round(
                  (cat.totalUnits / maxUnits) * 100
                );

                return (
                  <tr
                    key={cat.category}
                    className="hover:bg-surface-container-low transition-colors"
                  >
                    <td className="py-3.5 px-4 font-headline-sm text-body-md text-on-surface font-bold">
                      {cat.category}
                    </td>
                    <td className="py-3.5 px-4 font-label-md text-label-md text-on-surface">
                      {cat.skuCount} {cat.skuCount === 1 ? "SKU" : "SKUs"}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-label-md text-label-md font-bold text-on-surface w-16">
                          {cat.totalUnits} uds
                        </span>
                        <div className="w-28 bg-surface-container rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${Math.max(6, sharePercent)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-label-md text-label-md text-on-surface font-bold">
                      ${cat.avgPrice.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-container font-label-badge text-label-badge font-bold">
                          {cat.avgMarginPercent}% GM
                        </span>
                        <div className="w-24 bg-surface-container rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-tertiary h-2 rounded-full"
                            style={{ width: `${cat.avgMarginPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-headline-sm text-body-md text-on-surface font-extrabold">
                      ${cat.retailValueUsd.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Margin & Top Stock Products Leaderboard */}
      <div className="bg-surface-container-lowest rounded-DEFAULT shadow-[3px_3px_0px_#2a3235] overflow-hidden">
        <div className="p-space-md bg-surface-container-high flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-[20px]">
              emoji_events
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
              Product Profitability &amp; Stock Leaderboard
            </h2>
          </div>
        </div>

        <div className="divide-y divide-outline-variant/25">
          {topProductsLeaderboard.map((product, index) => {
            const unitProfit = product.price_usd - product.cost_usd;
            const gm =
              product.price_usd > 0
                ? Math.round((unitProfit / product.price_usd) * 100)
                : 0;
            const totalProductRetail = product.price_usd * product.total_stock;

            return (
              <div
                key={product.id}
                className="p-space-md hover:bg-surface-container-low transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md font-extrabold flex items-center justify-center shadow-[1px_1px_0px_#2a3235]">
                    #{index + 1}
                  </span>
                  <img
                    src={product.primary_image_url}
                    alt={product.title}
                    className="w-11 h-11 rounded-lg object-cover shadow-[1px_1px_0px_#2a3235]"
                  />
                  <div>
                    <p className="font-headline-sm text-body-md text-on-surface font-bold">
                      {product.title}
                    </p>
                    <p className="font-label-badge text-[10px] text-outline">
                      SKU: {product.sku} • {product.category_badge} •{" "}
                      {product.total_stock} units
                    </p>
                  </div>
                </div>

                <div className="flex items-center flex-wrap gap-4">
                  <div className="text-right">
                    <span className="font-label-badge text-[10px] text-outline block uppercase">
                      Unit Profit
                    </span>
                    <span className="font-label-md text-label-md text-tertiary font-bold">
                      +${unitProfit.toFixed(2)} ({gm}% GM)
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-label-badge text-[10px] text-outline block uppercase">
                      Total Stock Value
                    </span>
                    <span className="font-headline-sm text-body-md text-on-surface font-extrabold">
                      ${totalProductRetail.toFixed(2)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onEditProduct(product)}
                    className="px-3 py-1.5 rounded-full bg-surface-container text-on-surface hover:bg-primary hover:text-on-primary font-label-badge text-label-badge font-bold shadow-[1px_1px_0px_#2a3235] transition-colors"
                  >
                    Quick Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
