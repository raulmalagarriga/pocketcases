"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Product } from "@/types/database";

interface AdminHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  products?: Product[];
  onSelectAlertProduct?: (product: Product) => void;
}

interface AlertItem {
  id: string;
  type: "out_of_stock" | "low_stock" | "draft";
  badgeLabel: string;
  badgeStyle: string;
  icon: string;
  product: Product;
  detail: string;
}

export function AdminHeader({
  searchQuery,
  onSearchChange,
  products = [],
  onSelectAlertProduct,
}: AdminHeaderProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const alerts = useMemo<AlertItem[]>(() => {
    const items: AlertItem[] = [];

    for (const p of products) {
      const isOut = p.stock_status === "out_of_stock" || p.total_stock === 0;
      const isDraft = p.stock_status === "draft" || !p.is_live;
      const isLow =
        !isOut &&
        !isDraft &&
        (p.stock_status === "low_stock" ||
          p.total_stock <= p.low_stock_threshold);

      if (isOut) {
        items.push({
          id: `alert-out-${p.id}`,
          type: "out_of_stock",
          badgeLabel: "Stockout Alert",
          badgeStyle: "bg-error-container text-on-error-container",
          icon: "error",
          product: p,
          detail: `SKU ${p.sku} • 0 units remaining`,
        });
      } else if (isLow) {
        items.push({
          id: `alert-low-${p.id}`,
          type: "low_stock",
          badgeLabel: "Low Stock Warning",
          badgeStyle: "bg-primary-fixed text-on-primary-fixed",
          icon: "warning",
          product: p,
          detail: `SKU ${p.sku} • Only ${p.total_stock} units left`,
        });
      } else if (isDraft) {
        items.push({
          id: `alert-draft-${p.id}`,
          type: "draft",
          badgeLabel: "Unpublished Draft",
          badgeStyle: "bg-surface-container-highest text-on-surface-variant",
          icon: "visibility_off",
          product: p,
          detail: `SKU ${p.sku} • Hidden from storefront`,
        });
      }
    }

    return items;
  }, [products]);

  useEffect(() => {
    if (!popoverOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setPopoverOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPopoverOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [popoverOpen]);

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_2px_10px_rgba(42,50,53,0.04)] z-40 flex items-center justify-between px-space-lg">
      <div className="flex items-center gap-space-md">
        <div className="relative flex items-center">
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-72 pl-9 pr-space-md py-1.5 rounded-lg bg-surface-container-lowest font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-[1px_1px_0px_#2a3235]"
            placeholder="Search orders, SKUs, customers..."
            type="text"
          />
          <span className="material-symbols-outlined absolute left-2.5 text-outline text-[18px]">
            search
          </span>
        </div>
      </div>

      <div className="flex items-center gap-space-md">
        <Link
          className="flex items-center gap-1.5 bg-secondary-container text-on-secondary-container font-label-md text-label-md px-space-md py-1.5 rounded-full shadow-[2px_2px_0px_#4e6952] hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-all"
          href="/"
        >
          <span className="material-symbols-outlined text-[16px]">
            visibility
          </span>
          <span>Live Store View</span>
        </Link>

        {/* Notifications Bell + Popover */}
        <div className="relative" ref={popoverRef}>
          <button
            onClick={() => setPopoverOpen((prev) => !prev)}
            className="relative p-2 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-all shadow-[1px_1px_0px_#2a3235]"
            type="button"
            title="Alertas de inventario"
            aria-expanded={popoverOpen}
          >
            <span className="material-symbols-outlined text-[20px]">
              notifications
            </span>
            {alerts.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-error text-on-error font-label-badge text-[10px] font-bold flex items-center justify-center shadow-[1px_1px_0px_#2a3235]">
                {alerts.length}
              </span>
            )}
          </button>

          {popoverOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-DEFAULT shadow-[4px_4px_0px_#2a3235] border border-outline-variant/50 overflow-hidden z-50">
              <div className="px-3.5 py-2.5 bg-surface-container-high flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    notifications_active
                  </span>
                  <span className="font-label-md text-label-md font-bold text-on-surface">
                    Inventory &amp; Catalog Alerts
                  </span>
                </div>
                <span className="font-label-badge text-[10px] px-2 py-0.5 rounded-full bg-surface-container-lowest text-on-surface font-bold shadow-[1px_1px_0px_#2a3235]">
                  {alerts.length} active
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-outline-variant/30">
                {alerts.length === 0 ? (
                  <div className="p-6 text-center font-body-sm text-body-sm text-on-surface-variant">
                    All products are in stock and live on the storefront.
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <button
                      key={alert.id}
                      type="button"
                      onClick={() => {
                        onSelectAlertProduct?.(alert.product);
                        setPopoverOpen(false);
                      }}
                      className="w-full text-left p-3 hover:bg-surface-container-low transition-colors flex items-start gap-2.5"
                    >
                      <img
                        src={alert.product.primary_image_url}
                        alt={alert.product.title}
                        className="w-10 h-10 rounded-lg object-cover shrink-0 shadow-[1px_1px_0px_#2a3235]"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span
                            className={`font-label-badge text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${alert.badgeStyle}`}
                          >
                            {alert.badgeLabel}
                          </span>
                          <span className="material-symbols-outlined text-[14px] text-outline">
                            open_in_new
                          </span>
                        </div>
                        <p className="font-label-md text-label-md text-on-surface font-bold truncate">
                          {alert.product.title}
                        </p>
                        <p className="font-label-badge text-[10px] text-outline">
                          {alert.detail}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-[2px_2px_0px_#2a3235]">
          <span className="material-symbols-outlined text-on-primary text-[18px]">
            person
          </span>
        </div>
      </div>
    </header>
  );
}
