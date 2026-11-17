import { CartItem, StoreSettings } from "@/types/database";

export function buildWhatsAppCheckoutUrl(
  items: CartItem[],
  settings: StoreSettings,
  orderRef?: string
): string {
  const subtotal = items.reduce(
    (sum, item) => sum + item.priceUsd * item.quantity,
    0
  );
  const isFreeShipping = subtotal >= settings.free_shipping_threshold_usd;
  const shippingUsd =
    items.length === 0
      ? 0
      : isFreeShipping
      ? 0
      : settings.shipping_flat_rate_usd;
  const totalUsd = subtotal + shippingUsd;
  const totalVes = (totalUsd * settings.bcv_exchange_rate).toFixed(2);

  const lines: string[] = ["Hola Pocket Cases! Quiero pedir:"];

  if (orderRef) {
    lines.push(`Pedido: #${orderRef}`);
  }

  for (const item of items) {
    const qtyPrefix = item.quantity > 1 ? `${item.quantity}x ` : "";
    const lineTotal = (item.priceUsd * item.quantity).toFixed(2);
    lines.push(
      `- ${qtyPrefix}${item.title} (${item.deviceModel} - ${item.finish} - ${item.colorName}) $${lineTotal}`
    );
  }

  const shippingLabel = isFreeShipping
    ? "Envío Gratis"
    : `Envío $${shippingUsd.toFixed(2)}`;

  lines.push(
    `Total: $${totalUsd.toFixed(2)} (${shippingLabel} • Ref. Bs. ${totalVes} BCV)`
  );

  const phone = (settings.whatsapp_number || "").replace(/[^0-9]/g, "");
  const encodedText = encodeURIComponent(lines.join("\n"));

  return phone
    ? `https://wa.me/${phone}?text=${encodedText}`
    : `https://wa.me/?text=${encodedText}`;
}
