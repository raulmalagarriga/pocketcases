"use client";

import React, { useMemo, useState } from "react";
import { Order, Product, WaitlistSubscription } from "@/types/database";
import { deleteWaitlistSubscriptionInSupabase } from "@/lib/queries/cms";

interface CustomersViewProps {
  orders: Order[];
  waitlist: WaitlistSubscription[];
  products: Product[];
  onUpdateWaitlist: (nextWaitlist: WaitlistSubscription[]) => void;
  onShowToast: (msg: string) => void;
}

interface AggregatedCustomer {
  phone: string;
  name: string;
  city: string;
  orderCount: number;
  totalSpentUsd: number;
  lastOrderDate: string;
}

export function CustomersView({
  orders,
  waitlist,
  products,
  onUpdateWaitlist,
  onShowToast,
}: CustomersViewProps) {
  const [activeTab, setActiveTab] = useState<"directory" | "waitlist">(
    "directory"
  );
  const [search, setSearch] = useState("");

  const customers = useMemo<AggregatedCustomer[]>(() => {
    const map = new Map<string, AggregatedCustomer>();
    for (const order of orders) {
      const key = order.customer_phone.replace(/[^0-9]/g, "") || order.customer_name;
      const existing = map.get(key);
      if (existing) {
        existing.orderCount += 1;
        if (order.status !== "cancelled") {
          existing.totalSpentUsd += order.total_usd;
        }
        if (new Date(order.created_at) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = order.created_at;
        }
      } else {
        map.set(key, {
          phone: order.customer_phone,
          name: order.customer_name,
          city: order.customer_city,
          orderCount: 1,
          totalSpentUsd: order.status !== "cancelled" ? order.total_usd : 0,
          lastOrderDate: order.created_at,
        });
      }
    }
    return Array.from(map.values()).filter((c) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
      );
    });
  }, [orders, search]);

  const filteredWaitlist = useMemo(() => {
    return waitlist.filter((w) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const prod = products.find((p) => p.id === w.product_id);
      return (
        w.whatsapp_phone.toLowerCase().includes(q) ||
        (w.phone_model && w.phone_model.toLowerCase().includes(q)) ||
        (prod && prod.title.toLowerCase().includes(q))
      );
    });
  }, [waitlist, products, search]);

  const handleRemoveWaitlist = async (id: string) => {
    const next = waitlist.filter((w) => w.id !== id);
    onUpdateWaitlist(next);
    await deleteWaitlistSubscriptionInSupabase(id);
    onShowToast("Suscripción de lista de espera archivada");
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
            <span className="text-primary font-bold">
              Customers &amp; VIP Waitlist
            </span>
          </nav>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
            Pocket Club Directory &amp; Restock Waitlist
          </h1>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center gap-2 bg-surface-container-lowest p-1.5 rounded-full shadow-[2px_2px_0px_#2a3235]">
          <button
            type="button"
            onClick={() => setActiveTab("directory")}
            className={`px-4 py-1.5 rounded-full font-label-md text-label-md font-bold transition-all ${
              activeTab === "directory"
                ? "bg-primary text-on-primary shadow-[1px_1px_0px_#2a3235]"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Customers Directory ({customers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("waitlist")}
            className={`px-4 py-1.5 rounded-full font-label-md text-label-md font-bold transition-all ${
              activeTab === "waitlist"
                ? "bg-primary text-on-primary shadow-[1px_1px_0px_#2a3235]"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            VIP Waitlist Subscriptions ({waitlist.length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-surface-container-lowest p-space-md rounded-DEFAULT shadow-[3px_3px_0px_#2a3235] flex items-center justify-between gap-space-md">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              activeTab === "directory"
                ? "Search customers by name, WhatsApp phone, or city..."
                : "Search waitlist leads by WhatsApp phone, case design, or iPhone/Galaxy model..."
            }
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none shadow-[1px_1px_0px_#2a3235]"
          />
        </div>
      </div>

      {activeTab === "directory" ? (
        /* Sub-Tab 1: Customers Directory */
        <div className="bg-surface-container-lowest rounded-DEFAULT shadow-[3px_3px_0px_#2a3235] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high text-on-surface font-label-badge text-label-badge uppercase tracking-wider">
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">WhatsApp Phone</th>
                  <th className="py-3.5 px-4">City (VE)</th>
                  <th className="py-3.5 px-4">Total Orders</th>
                  <th className="py-3.5 px-4">Lifetime Value ($ USD)</th>
                  <th className="py-3.5 px-4 text-right">Direct Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/25 font-body-sm text-body-sm">
                {customers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-center text-on-surface-variant"
                    >
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => {
                    const cleanPhone = c.phone.replace(/[^0-9]/g, "");
                    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                      `¡Hola ${c.name}! ✨ Te saludamos del equipo VIP de *Pocket Cases* 💛`
                    )}`;

                    return (
                      <tr
                        key={c.phone}
                        className="hover:bg-surface-container-low transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md font-extrabold flex items-center justify-center shadow-[1px_1px_0px_#2a3235]">
                              {c.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                            <span className="font-headline-sm text-body-md text-on-surface font-bold">
                              {c.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-label-md text-label-md text-on-surface">
                          +{cleanPhone}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high font-label-badge text-[10px] text-on-surface-variant font-bold">
                            {c.city}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-label-md text-label-md text-on-surface font-bold">
                          {c.orderCount}{" "}
                          {c.orderCount === 1 ? "pedido" : "pedidos"}
                        </td>
                        <td className="py-3.5 px-4 font-headline-sm text-body-md text-tertiary font-extrabold">
                          ${c.totalSpentUsd.toFixed(2)} USD
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-container font-label-badge text-label-badge font-bold shadow-[2px_2px_0px_#2a3235] hover:opacity-90"
                          >
                            <span className="material-symbols-outlined text-[15px]">
                              chat
                            </span>
                            <span>Contactar WhatsApp</span>
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Sub-Tab 2: VIP Waitlist Subscriptions */
        <div className="bg-surface-container-lowest rounded-DEFAULT shadow-[3px_3px_0px_#2a3235] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high text-on-surface font-label-badge text-label-badge uppercase tracking-wider">
                  <th className="py-3.5 px-4">Requested Case Design</th>
                  <th className="py-3.5 px-4">Desired Phone Model</th>
                  <th className="py-3.5 px-4">Customer WhatsApp</th>
                  <th className="py-3.5 px-4">Subscribed Date</th>
                  <th className="py-3.5 px-4 text-right">
                    Restock Notification Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/25 font-body-sm text-body-sm">
                {filteredWaitlist.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-on-surface-variant"
                    >
                      No active waitlist subscriptions.
                    </td>
                  </tr>
                ) : (
                  filteredWaitlist.map((item) => {
                    const product =
                      products.find((p) => p.id === item.product_id) ||
                      products.find((p) =>
                        p.title.toLowerCase().includes("matcha")
                      ) ||
                      products[0];

                    const cleanPhone = item.whatsapp_phone.replace(
                      /[^0-9]/g,
                      ""
                    );
                    const modelLabel = item.phone_model || "iPhone 16 Pro";
                    const notifyMsg = `¡Hola! 🎉 Buenas noticias de *Pocket Cases*: el case *${
                      product?.title || "Edición Limitada"
                    }* para tu *${modelLabel}* que anotaste en la lista de espera ya está disponible nuevamente en stock. ¿Te lo reservamos con envío inmediato? ✨`;
                    const waNotifyUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                      notifyMsg
                    )}`;

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-surface-container-low transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            {product && (
                              <img
                                src={product.primary_image_url}
                                alt={product.title}
                                className="w-10 h-10 rounded-lg object-cover shadow-[1px_1px_0px_#2a3235]"
                              />
                            )}
                            <div>
                              <p className="font-headline-sm text-body-md text-on-surface font-bold">
                                {product?.title || "Matcha Latte Swirl"}
                              </p>
                              <p className="font-label-badge text-[10px] text-outline">
                                SKU: {product?.sku || "PKT-MCH-04"} •{" "}
                                {product?.total_stock || 0} units now in stock
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-badge text-label-badge font-bold">
                            {modelLabel}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-label-md text-label-md text-on-surface font-bold">
                          +{cleanPhone}
                        </td>
                        <td className="py-3.5 px-4 font-label-badge text-label-badge text-on-surface-variant">
                          {new Date(item.created_at).toLocaleDateString(
                            "es-VE",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={waNotifyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-container font-label-badge text-label-badge font-bold shadow-[2px_2px_0px_#2a3235] hover:opacity-90 transition-transform active:translate-x-0.5 active:translate-y-0.5"
                            >
                              <span className="material-symbols-outlined text-[15px]">
                                notifications_active
                              </span>
                              <span>Notificar Stock por WhatsApp</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => handleRemoveWaitlist(item.id)}
                              title="Archivar / Eliminar"
                              className="p-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-error-container hover:text-on-error-container transition-colors shadow-[1px_1px_0px_#2a3235]"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                delete
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
