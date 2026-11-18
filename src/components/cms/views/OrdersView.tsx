"use client";

import React, { useMemo, useState } from "react";
import {
  Order,
  OrderPaymentMethod,
  OrderStatus,
  Product,
  StoreSettings,
} from "@/types/database";
import {
  createManualOrderInSupabase,
  updateOrderStatusInSupabase,
} from "@/lib/queries/cms";

interface OrdersViewProps {
  orders: Order[];
  products: Product[];
  settings: StoreSettings;
  onUpdateOrders: (nextOrders: Order[]) => void;
  onShowToast: (msg: string) => void;
}

export function OrdersView({
  orders,
  products,
  settings,
  onUpdateOrders,
  onShowToast,
}: OrdersViewProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);

  // Manual Order Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("58412");
  const [customerCity, setCustomerCity] = useState("Caracas");
  const [shippingAgency, setShippingAgency] = useState(
    "MRW / Zoom / Delivery Caracas"
  );
  const [paymentMethod, setPaymentMethod] =
    useState<OrderPaymentMethod>("pago_movil");
  const [paymentReference, setPaymentReference] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(
    products[0]?.id || "prod-1"
  );
  const [selectedModel, setSelectedModel] = useState("iPhone 16 Pro");
  const [quantity, setQuantity] = useState(1);

  const bcvRate = settings.bcv_exchange_rate || 45.8;

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          o.customer_name.toLowerCase().includes(q) ||
          o.customer_phone.toLowerCase().includes(q) ||
          o.customer_city.toLowerCase().includes(q) ||
          String(o.order_number).includes(q) ||
          (o.payment_reference &&
            o.payment_reference.toLowerCase().includes(q)) ||
          o.items.some((it) => it.title.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [orders, statusFilter, search]);

  const handleStatusChange = async (orderId: string, nextStatus: OrderStatus) => {
    const nextList = orders.map((o) =>
      o.id === orderId ? { ...o, status: nextStatus } : o
    );
    onUpdateOrders(nextList);
    await updateOrderStatusInSupabase(orderId, nextStatus);
    onShowToast(`Estado de orden actualizado a: ${nextStatus.toUpperCase()}`);
  };

  const handleCreateManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;

    const chosenProduct =
      products.find((p) => p.id === selectedProductId) || products[0];
    const unitPrice = chosenProduct ? chosenProduct.price_usd : 28.0;
    const subtotal = Number((unitPrice * quantity).toFixed(2));
    const shipping =
      subtotal >= settings.free_shipping_threshold_usd
        ? 0
        : settings.shipping_flat_rate_usd;
    const total = Number((subtotal + shipping).toFixed(2));

    const firstVariant = chosenProduct?.color_variants?.[0];

    const created = await createManualOrderInSupabase({
      customer_name: customerName.trim(),
      customer_phone: customerPhone.replace(/[^0-9]/g, ""),
      customer_city: customerCity.trim() || "Caracas",
      shipping_agency: shippingAgency.trim() || "Delivery / MRW",
      payment_method: paymentMethod,
      payment_reference: paymentReference.trim() || "Verificado Manual",
      items: [
        {
          id: `${chosenProduct?.id || "prod-1"}-${selectedModel}`,
          productId: chosenProduct?.id || "prod-1",
          sku: chosenProduct?.sku || "PKT-01",
          title: chosenProduct?.title || "Pocket Case",
          priceUsd: unitPrice,
          imageUrl: chosenProduct?.primary_image_url || "",
          cardBgStyle: chosenProduct?.card_bg_style || "secondary-fixed",
          deviceModel: selectedModel,
          finish: chosenProduct?.default_finish || "Grip Mate",
          colorName: firstVariant?.name || "Original",
          colorHex: firstVariant?.hex_code || "#FDE047",
          quantity,
        },
      ],
      subtotal_usd: subtotal,
      shipping_usd: shipping,
      total_usd: total,
      exchange_rate_bcv: bcvRate,
      status: "confirmed",
    });

    onUpdateOrders([created, ...orders]);
    setShowNewOrderModal(false);
    setCustomerName("");
    setPaymentReference("");
    onShowToast(`Orden #PKT-${created.order_number} creada exitosamente`);
  };

  const buildWhatsAppLink = (order: Order) => {
    const cleanPhone = order.customer_phone.replace(/[^0-9]/g, "");
    const itemsText = order.items
      .map((i) => `• ${i.quantity}x ${i.title} (${i.deviceModel})`)
      .join("\n");
    const vesTotal = (
      order.total_usd * (order.exchange_rate_bcv || bcvRate)
    ).toFixed(2);
    const msg = `¡Hola ${order.customer_name}! ✨ Te escribimos de *Pocket Cases* sobre tu pedido *#PKT-${order.order_number}* (${order.status.toUpperCase()}):\n\n${itemsText}\n\n*Total:* $${order.total_usd.toFixed(
      2
    )} USD (Bs. ${vesTotal} BCV)\n*Envío:* ${
      order.shipping_agency || order.customer_city
    }\n\n¡Gracias por elegir estilo y máxima protección! 💛`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  const getPaymentBadge = (method: OrderPaymentMethod) => {
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
            <span className="text-primary font-bold">Orders &amp; Dispatch</span>
          </nav>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
            Venezuela Orders &amp; Payment Verification
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowNewOrderModal((prev) => !prev)}
          className="flex items-center gap-1.5 px-space-lg py-2 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md shadow-[2px_2px_0px_#2a3235] hover:opacity-95 transition-transform active:translate-x-0.5 active:translate-y-0.5"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>+ New Manual Order</span>
        </button>
      </div>

      {/* New Manual Order Form Panel */}
      {showNewOrderModal && (
        <form
          onSubmit={handleCreateManualOrder}
          className="bg-surface-container-lowest p-space-lg rounded-DEFAULT shadow-[3px_3px_0px_#2a3235] border-2 border-primary flex flex-col gap-space-md"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
              Registrar Orden Manual (WhatsApp / Instagram / Tienda)
            </h2>
            <button
              type="button"
              onClick={() => setShowNewOrderModal(false)}
              className="text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            <div>
              <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1">
                Nombre del Cliente *
              </label>
              <input
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ej. Daniela Silva"
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1">
                WhatsApp (con código 58) *
              </label>
              <input
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="584121234567"
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1">
                Ciudad (Venezuela)
              </label>
              <input
                value={customerCity}
                onChange={(e) => setCustomerCity(e.target.value)}
                placeholder="Caracas / Valencia / Maracaibo..."
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1">
                Agencia / Delivery
              </label>
              <input
                value={shippingAgency}
                onChange={(e) => setShippingAgency(e.target.value)}
                placeholder="MRW / Zoom / Delivery Express"
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1">
                Producto
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} (${p.price_usd.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1">
                Modelo de Teléfono
              </label>
              <input
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                placeholder="iPhone 16 Pro Max"
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1">
                Método de Pago
              </label>
              <select
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(e.target.value as OrderPaymentMethod)
                }
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none"
              >
                <option value="pago_movil">Pago Móvil (Bs. BCV)</option>
                <option value="zelle">Zelle ($ USD)</option>
                <option value="whatsapp">WhatsApp Directo</option>
                <option value="card">Tarjeta Internacional</option>
              </select>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1">
                  Referencia de Pago
                </label>
                <input
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="Ref: #9482"
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none"
                />
              </div>
              <div className="w-20">
                <label className="block font-label-badge text-label-badge text-on-surface-variant uppercase mb-1">
                  Cant.
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full px-2 py-2 text-center rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface shadow-[1px_1px_0px_#2a3235] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowNewOrderModal(false)}
              className="px-4 py-2 rounded-full bg-surface-container text-on-surface font-label-md text-label-md shadow-[1px_1px_0px_#2a3235]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-tertiary-fixed text-on-tertiary-container font-label-md text-label-md font-bold shadow-[2px_2px_0px_#2a3235]"
            >
              Guardar Orden en Supabase
            </button>
          </div>
        </form>
      )}

      {/* Filter Pills & Search */}
      <div className="bg-surface-container-lowest p-space-md rounded-DEFAULT shadow-[3px_3px_0px_#2a3235] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
        <div className="flex items-center flex-wrap gap-2">
          {[
            { id: "all", label: `All Orders (${orders.length})` },
            {
              id: "pending",
              label: `Pending (${orders.filter((o) => o.status === "pending").length})`,
            },
            {
              id: "confirmed",
              label: `Confirmed (${orders.filter((o) => o.status === "confirmed").length})`,
            },
            {
              id: "shipped",
              label: `Shipped (${orders.filter((o) => o.status === "shipped").length})`,
            },
            {
              id: "cancelled",
              label: `Cancelled (${orders.filter((o) => o.status === "cancelled").length})`,
            },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setStatusFilter(pill.id)}
              className={`px-3.5 py-1.5 rounded-full font-label-badge text-label-badge font-bold uppercase transition-all shadow-[1px_1px_0px_#2a3235] ${
                statusFilter === pill.id
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer, city, ref..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none shadow-[1px_1px_0px_#2a3235]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-surface-container-lowest rounded-DEFAULT shadow-[3px_3px_0px_#2a3235] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high text-on-surface font-label-badge text-label-badge uppercase tracking-wider">
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer &amp; City</th>
                <th className="py-3.5 px-4">Payment &amp; Reference</th>
                <th className="py-3.5 px-4">Items Summary</th>
                <th className="py-3.5 px-4">Total ($ USD / Bs.)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">WhatsApp Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/25 font-body-sm text-body-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-on-surface-variant"
                  >
                    No orders match the current filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const payBadge = getPaymentBadge(order.payment_method);
                  const totalVes =
                    order.total_usd * (order.exchange_rate_bcv || bcvRate);

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-surface-container-low transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <span className="font-headline-sm text-body-md text-on-surface font-extrabold">
                          #PKT-{order.order_number}
                        </span>
                        <p className="font-label-badge text-[10px] text-outline">
                          {new Date(order.created_at).toLocaleDateString("es-VE", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-headline-sm text-body-md text-on-surface font-bold">
                          {order.customer_name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="px-2 py-0.5 rounded-full bg-surface-container-high font-label-badge text-[10px] text-on-surface-variant font-bold">
                            {order.customer_city}
                          </span>
                          <span className="font-label-badge text-[10px] text-outline">
                            {order.shipping_agency}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-label-badge text-[10px] font-bold ${payBadge.className}`}
                        >
                          {payBadge.label}
                        </span>
                        <p className="font-label-badge text-[10px] text-on-surface font-bold mt-1">
                          {order.payment_reference || "Por confirmar"}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        {order.items.map((item, idx) => (
                          <div
                            key={`${order.id}-item-${idx}`}
                            className="flex items-center gap-1.5 text-xs text-on-surface"
                          >
                            <span className="font-bold">{item.quantity}x</span>
                            <span className="truncate font-medium">
                              {item.title}
                            </span>
                            <span className="text-outline text-[10px]">
                              ({item.deviceModel})
                            </span>
                          </div>
                        ))}
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-headline-sm text-body-md text-on-surface font-extrabold">
                          ${order.total_usd.toFixed(2)}
                        </p>
                        <p className="font-label-badge text-[10px] text-tertiary font-bold">
                          Bs. {totalVes.toFixed(2)} (Tasa{" "}
                          {(order.exchange_rate_bcv || bcvRate).toFixed(2)})
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(
                              order.id,
                              e.target.value as OrderStatus
                            )
                          }
                          className={`font-label-badge text-label-badge px-2.5 py-1 rounded-md font-bold uppercase cursor-pointer shadow-[1px_1px_0px_#2a3235] focus:outline-none ${
                            order.status === "confirmed"
                              ? "bg-tertiary-fixed text-on-tertiary-container"
                              : order.status === "shipped"
                              ? "bg-secondary-container text-on-secondary-container"
                              : order.status === "cancelled"
                              ? "bg-error-container text-on-error-container"
                              : "bg-primary-fixed text-on-primary-fixed"
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={buildWhatsAppLink(order)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-container font-label-badge text-label-badge font-bold shadow-[2px_2px_0px_#2a3235] hover:opacity-90 transition-transform active:translate-x-0.5 active:translate-y-0.5"
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            chat
                          </span>
                          <span>WhatsApp</span>
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
    </div>
  );
}
