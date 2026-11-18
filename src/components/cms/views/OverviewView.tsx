"use client";

import React from "react";
import {
  Order,
  Product,
  StoreSettings,
  WaitlistSubscription,
} from "@/types/database";

interface OverviewViewProps {
  products: Product[];
  orders: Order[];
  waitlist: WaitlistSubscription[];
  settings: StoreSettings;
  onNavigate: (section: string) => void;
  onQuickRestock: (productId: string, addUnits: number) => void;
  onEditProduct: (product: Product) => void;
}

export function OverviewView({
  products,
  orders,
  waitlist,
  settings,
  onNavigate,
  onQuickRestock,
  onEditProduct,
}: OverviewViewProps) {
  const bcvRate = settings.bcv_exchange_rate || 45.8;

  const totalRetailUsd = products.reduce(
    (acc, p) => acc + p.price_usd * p.total_stock,
    0
  );
  const totalRetailVes = totalRetailUsd * bcvRate;

  const activeOrders = orders.filter((o) => o.status !== "cancelled");
  const totalRevenueUsd = activeOrders.reduce((acc, o) => acc + o.total_usd, 0);
  const totalRevenueVes = totalRevenueUsd * bcvRate;

  const criticalProducts = products.filter(
    (p) =>
      p.stock_status === "out_of_stock" ||
      p.total_stock === 0 ||
      p.stock_status === "low_stock" ||
      p.total_stock <= p.low_stock_threshold
  );

  const recentOrders = orders.slice(0, 5);

  const getPaymentBadge = (method: Order["payment_method"]) => {
    switch (method) {
      case "pago_movil":
        return {
          label: "Pago Móvil",
          className: "bg-secondary-fixed text-on-secondary-fixed",
        };
      case "zelle":
        return {
          label: "Zelle USD",
          className: "bg-primary-fixed text-on-primary-fixed",
        };
      case "whatsapp":
        return {
          label: "WhatsApp",
          className: "bg-tertiary-fixed text-on-tertiary-container",
        };
      default:
        return {
          label: "Card / Int.",
          className: "bg-surface-container-highest text-on-surface-variant",
        };
    }
  };

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "confirmed":
        return {
          label: "Confirmed",
          className: "bg-tertiary-fixed text-on-tertiary-container",
        };
      case "shipped":
        return {
          label: "Shipped",
          className: "bg-secondary-container text-on-secondary-container",
        };
      case "cancelled":
        return {
          label: "Cancelled",
          className: "bg-error-container text-on-error-container",
        };
      default:
        return {
          label: "Pending",
          className: "bg-primary-fixed text-on-primary-fixed",
        };
    }
  };

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
            <span className="text-primary font-bold">Executive Overview</span>
          </nav>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
            Pocket Cases — Operations &amp; Sales Command Center
          </h1>
        </div>

        <div className="flex items-center flex-wrap gap-space-sm">
          <button
            type="button"
            onClick={() => onNavigate("orders")}
            className="flex items-center gap-1.5 px-space-md py-2 rounded-full bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-[2px_2px_0px_#2a3235] hover:bg-surface-container-high transition-transform active:translate-x-0.5 active:translate-y-0.5"
          >
            <span className="material-symbols-outlined text-[18px]">
              local_shipping
            </span>
            <span>Manage Orders ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate("product-catalog")}
            className="flex items-center gap-1.5 px-space-lg py-2 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md shadow-[2px_2px_0px_#2a3235] hover:opacity-95 transition-transform active:translate-x-0.5 active:translate-y-0.5"
          >
            <span className="material-symbols-outlined text-[18px]">
              inventory_2
            </span>
            <span>Go to Product Catalog</span>
          </button>
        </div>
      </div>

      {/* Executive KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {/* Card 1: Total Inventory Retail Value */}
        <div className="bg-surface-container-lowest p-space-md rounded-DEFAULT shadow-[3px_3px_0px_#2a3235] flex flex-col justify-between gap-2">
          <div className="flex items-start justify-between">
            <span className="font-label-badge text-label-badge text-on-surface-variant uppercase">
              Inventory Retail Value
            </span>
            <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-[1px_1px_0px_#2a3235]">
              <span className="material-symbols-outlined text-[18px]">
                warehouse
              </span>
            </div>
          </div>
          <div>
            <p className="font-headline-md text-headline-md text-on-surface font-extrabold">
              ${totalRetailUsd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="font-label-badge text-label-badge text-tertiary font-bold mt-0.5">
              Bs.{" "}
              {totalRetailVes.toLocaleString("es-VE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              (BCV)
            </p>
          </div>
        </div>

        {/* Card 2: Active Orders & Revenue */}
        <div className="bg-surface-container-lowest p-space-md rounded-DEFAULT shadow-[3px_3px_0px_#2a3235] flex flex-col justify-between gap-2">
          <div className="flex items-start justify-between">
            <span className="font-label-badge text-label-badge text-tertiary uppercase">
              Active Orders &amp; Revenue
            </span>
            <div className="w-9 h-9 rounded-full bg-tertiary-fixed text-on-tertiary-container flex items-center justify-center shadow-[1px_1px_0px_#2a3235]">
              <span className="material-symbols-outlined text-[18px]">
                payments
              </span>
            </div>
          </div>
          <div>
            <p className="font-headline-md text-headline-md text-tertiary font-extrabold">
              ${totalRevenueUsd.toFixed(2)}{" "}
              <span className="font-label-md text-label-md text-on-surface-variant font-bold">
                ({activeOrders.length} orders)
              </span>
            </p>
            <p className="font-label-badge text-label-badge text-on-surface-variant mt-0.5">
              Bs.{" "}
              {totalRevenueVes.toLocaleString("es-VE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              • Pago Móvil / Zelle
            </p>
          </div>
        </div>

        {/* Card 3: Active Waitlist Leads */}
        <div className="bg-surface-container-lowest p-space-md rounded-DEFAULT shadow-[3px_3px_0px_#2a3235] flex flex-col justify-between gap-2">
          <div className="flex items-start justify-between">
            <span className="font-label-badge text-label-badge text-primary uppercase">
              VIP Waitlist Leads
            </span>
            <div className="w-9 h-9 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center shadow-[1px_1px_0px_#2a3235]">
              <span className="material-symbols-outlined text-[18px]">
                group_add
              </span>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="font-headline-md text-headline-md text-on-surface font-extrabold">
                {waitlist.length} Clientes
              </p>
              <p className="font-label-badge text-label-badge text-on-surface-variant mt-0.5">
                Esperando restock por WhatsApp
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("customers")}
              className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-label-badge text-[10px] font-bold shadow-[1px_1px_0px_#2a3235] hover:bg-primary hover:text-on-primary transition-colors"
            >
              Ver Lista
            </button>
          </div>
        </div>

        {/* Card 4: Current BCV Exchange Rate */}
        <div className="bg-surface-container-lowest p-space-md rounded-DEFAULT shadow-[3px_3px_0px_#2a3235] flex flex-col justify-between gap-2">
          <div className="flex items-start justify-between">
            <span className="font-label-badge text-label-badge text-on-surface-variant uppercase">
              Tasa Oficial BCV Activa
            </span>
            <div className="w-9 h-9 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shadow-[1px_1px_0px_#2a3235]">
              <span className="material-symbols-outlined text-[18px]">
                currency_exchange
              </span>
            </div>
          </div>
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="font-headline-md text-headline-md text-on-surface font-extrabold">
                Bs. {bcvRate.toFixed(2)} / $1
              </p>
              <p className="font-label-badge text-label-badge text-tertiary font-bold mt-0.5">
                {settings.show_ves_reference
                  ? "Visible en Storefront"
                  : "Oculta en Storefront"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("store-settings")}
              className="px-2.5 py-1 rounded-full bg-primary-container text-on-primary-container font-label-badge text-[10px] font-bold shadow-[1px_1px_0px_#2a3235] hover:opacity-90 transition-opacity shrink-0"
            >
              Quick Edit Rate
            </button>
          </div>
        </div>
      </div>

      {/* Two-Column Operational Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Left Column: Recent Orders Feed */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-DEFAULT shadow-[3px_3px_0px_#2a3235] overflow-hidden flex flex-col">
          <div className="p-space-md bg-surface-container-high flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">
                receipt_long
              </span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                Recent Orders Feed (Venezuela)
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("orders")}
              className="px-3 py-1 rounded-full bg-surface-container-lowest text-on-surface font-label-badge text-label-badge font-bold shadow-[1px_1px_0px_#2a3235] hover:bg-primary hover:text-on-primary transition-colors"
            >
              View All Orders →
            </button>
          </div>

          <div className="divide-y divide-outline-variant/25 flex-1">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center font-body-md text-body-md text-on-surface-variant">
                No orders recorded yet.
              </div>
            ) : (
              recentOrders.map((order) => {
                const payBadge = getPaymentBadge(order.payment_method);
                const statusBadge = getStatusBadge(order.status);
                const totalVes = order.total_usd * (order.exchange_rate_bcv || bcvRate);

                return (
                  <div
                    key={order.id}
                    className="p-space-md hover:bg-surface-container-low transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary-container/50 text-on-secondary-container flex items-center justify-center font-label-md text-label-md font-extrabold shadow-[1px_1px_0px_#2a3235] shrink-0">
                        #{order.order_number}
                      </div>
                      <div>
                        <div className="flex items-center flex-wrap gap-1.5">
                          <span className="font-headline-sm text-body-md text-on-surface font-bold">
                            {order.customer_name}
                          </span>
                          <span className="font-label-badge text-[10px] px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-bold">
                            {order.customer_city}
                          </span>
                          <span
                            className={`font-label-badge text-[10px] px-2 py-0.5 rounded-full font-bold ${payBadge.className}`}
                          >
                            {payBadge.label}
                          </span>
                          <span
                            className={`font-label-badge text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusBadge.className}`}
                          >
                            {statusBadge.label}
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                          {order.items
                            .map(
                              (it) =>
                                `${it.quantity}x ${it.title} (${it.deviceModel})`
                            )
                            .join(", ")}
                        </p>
                        {order.payment_reference && (
                          <p className="font-label-badge text-[10px] text-outline mt-0.5">
                            {order.payment_reference} • {order.shipping_agency}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <p className="font-headline-sm text-body-md text-on-surface font-extrabold">
                        ${order.total_usd.toFixed(2)} USD
                      </p>
                      <p className="font-label-badge text-[10px] text-tertiary font-bold">
                        Bs. {totalVes.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Critical Stock & Restock Action Center */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-DEFAULT shadow-[3px_3px_0px_#2a3235] overflow-hidden flex flex-col">
          <div className="p-space-md bg-surface-container-high flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-[20px]">
                notification_important
              </span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                Critical Stock &amp; Restock Center
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("inventory-stock")}
              className="px-3 py-1 rounded-full bg-surface-container-lowest text-on-surface font-label-badge text-label-badge font-bold shadow-[1px_1px_0px_#2a3235] hover:bg-primary hover:text-on-primary transition-colors"
            >
              Inventory Matrix →
            </button>
          </div>

          <div className="divide-y divide-outline-variant/25 flex-1">
            {criticalProducts.length === 0 ? (
              <div className="p-8 text-center font-body-md text-body-md text-tertiary font-bold">
                All products have healthy inventory levels!
              </div>
            ) : (
              criticalProducts.map((product) => {
                const isOut =
                  product.stock_status === "out_of_stock" ||
                  product.total_stock === 0;
                return (
                  <div
                    key={product.id}
                    className="p-space-md hover:bg-surface-container-low transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={product.primary_image_url}
                        alt={product.title}
                        className="w-11 h-11 rounded-lg object-cover shrink-0 shadow-[1px_1px_0px_#2a3235]"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-headline-sm text-body-md text-on-surface font-bold truncate">
                            {product.title}
                          </p>
                          <span
                            className={`px-1.5 py-0.5 rounded font-label-badge text-[9px] font-bold uppercase ${
                              isOut
                                ? "bg-error-container text-on-error-container"
                                : "bg-primary-fixed text-on-primary-fixed"
                            }`}
                          >
                            {isOut
                              ? "Out of Stock"
                              : `Low (${product.total_stock} left)`}
                          </span>
                        </div>
                        <p className="font-label-badge text-[10px] text-outline">
                          SKU: {product.sku} • {product.category_badge}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onQuickRestock(product.id, 25)}
                        className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-container font-label-badge text-[10px] font-bold shadow-[1px_1px_0px_#2a3235] hover:opacity-90 transition-transform active:translate-x-0.5 active:translate-y-0.5"
                      >
                        +25 Units Restock
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditProduct(product)}
                        className="p-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-primary hover:text-on-primary transition-colors shadow-[1px_1px_0px_#2a3235]"
                        title="Edit in Drawer"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          edit
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
