"use client";

import React, { useMemo, useState } from "react";
import { Product, StockStatus } from "@/types/database";
import { updateColorVariantStockInSupabase } from "@/lib/queries/cms";

interface InventoryMatrixViewProps {
  products: Product[];
  onUpdateProducts: (nextProducts: Product[]) => void;
  onEditProduct: (product: Product) => void;
  onShowToast: (msg: string) => void;
}

export function InventoryMatrixView({
  products,
  onUpdateProducts,
  onEditProduct,
  onShowToast,
}: InventoryMatrixViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          p.title.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category_badge.toLowerCase().includes(q) ||
          p.color_variants?.some(
            (cv) =>
              cv.name.toLowerCase().includes(q) ||
              (cv.name_en && cv.name_en.toLowerCase().includes(q))
          );
        if (!matches) return false;
      }
      if (statusFilter !== "all" && p.stock_status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [products, search, statusFilter]);

  const handleVariantStockChange = async (
    product: Product,
    variantId: string,
    nextUnitsRaw: number
  ) => {
    const clampedUnits = Math.max(0, Math.round(nextUnitsRaw));

    const updatedVariants = (product.color_variants || []).map((cv) =>
      cv.id === variantId ? { ...cv, stock_units: clampedUnits } : cv
    );

    const nextTotalStock = updatedVariants.reduce(
      (sum, cv) => sum + (Number(cv.stock_units) || 0),
      0
    );

    const nextStatus: StockStatus = !product.is_live
      ? "draft"
      : nextTotalStock === 0
      ? "out_of_stock"
      : nextTotalStock <= product.low_stock_threshold
      ? "low_stock"
      : "in_stock";

    const updatedProduct: Product = {
      ...product,
      color_variants: updatedVariants,
      total_stock: nextTotalStock,
      stock_status: nextStatus,
      updated_at: new Date().toISOString(),
    };

    const nextList = products.map((p) =>
      p.id === product.id ? updatedProduct : p
    );
    onUpdateProducts(nextList);

    await updateColorVariantStockInSupabase(
      variantId,
      product.id,
      clampedUnits,
      nextTotalStock
    );
  };

  const handleBulkRestockProduct = async (
    product: Product,
    addPerVariant: number
  ) => {
    const updatedVariants = (product.color_variants || []).map((cv) => ({
      ...cv,
      stock_units: Math.max(0, (Number(cv.stock_units) || 0) + addPerVariant),
    }));

    const nextTotalStock = updatedVariants.reduce(
      (sum, cv) => sum + cv.stock_units,
      0
    );

    const nextStatus: StockStatus =
      nextTotalStock === 0
        ? "out_of_stock"
        : nextTotalStock <= product.low_stock_threshold
        ? "low_stock"
        : "in_stock";

    const updatedProduct: Product = {
      ...product,
      color_variants: updatedVariants,
      total_stock: nextTotalStock,
      stock_status: nextStatus,
      is_live: true,
    };

    onUpdateProducts(
      products.map((p) => (p.id === product.id ? updatedProduct : p))
    );

    await Promise.all(
      updatedVariants.map((cv) =>
        updateColorVariantStockInSupabase(
          cv.id,
          product.id,
          cv.stock_units,
          nextTotalStock
        )
      )
    );

    onShowToast(
      `Restock aplicado a ${product.title} (+${addPerVariant} por color • Total: ${nextTotalStock} uds)`
    );
  };

  const totalUnitsAll = products.reduce((acc, p) => acc + p.total_stock, 0);
  const totalVariantsCount = products.reduce(
    (acc, p) => acc + (p.color_variants?.length || 0),
    0
  );

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
              Inventory &amp; Color Matrix
            </span>
          </nav>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
            Warehouse Stock &amp; Color Variant Matrix
          </h1>
        </div>

        <div className="flex items-center gap-space-sm">
          <div className="px-4 py-2 rounded-full bg-surface-container-lowest shadow-[2px_2px_0px_#2a3235] font-label-md text-label-md text-on-surface font-bold">
            {totalUnitsAll} Total Units Across {totalVariantsCount} Color SKUs
          </div>
        </div>
      </div>

      {/* Search & Status Filter Strip */}
      <div className="bg-surface-container-lowest p-space-md rounded-DEFAULT shadow-[3px_3px_0px_#2a3235] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product title, SKU, or color swatch name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none shadow-[1px_1px_0px_#2a3235]"
          />
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {[
            { id: "all", label: "All Products" },
            { id: "in_stock", label: "In Stock" },
            { id: "low_stock", label: "Low Stock" },
            { id: "out_of_stock", label: "Out of Stock" },
            { id: "draft", label: "Draft" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full font-label-badge text-label-badge font-bold uppercase transition-all shadow-[1px_1px_0px_#2a3235] ${
                statusFilter === tab.id
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Variant Cards Grid */}
      <div className="flex flex-col gap-space-lg">
        {filteredProducts.map((product) => {
          const isOut =
            product.stock_status === "out_of_stock" ||
            product.total_stock === 0;
          const isLow =
            !isOut &&
            (product.stock_status === "low_stock" ||
              product.total_stock <= product.low_stock_threshold);

          return (
            <div
              key={product.id}
              className="bg-surface-container-lowest rounded-DEFAULT shadow-[3px_3px_0px_#2a3235] overflow-hidden"
            >
              {/* Product Top Summary Bar */}
              <div className="p-space-md bg-surface-container-high flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                <div className="flex items-center gap-3">
                  <img
                    src={product.primary_image_url}
                    alt={product.title}
                    className="w-12 h-12 rounded-lg object-cover shadow-[1px_1px_0px_#2a3235] bg-surface-container-lowest shrink-0"
                  />
                  <div>
                    <div className="flex items-center flex-wrap gap-2">
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                        {product.title}
                      </h2>
                      <span className="px-2 py-0.5 rounded font-label-badge text-[10px] bg-surface-container-lowest text-on-surface font-bold shadow-[1px_1px_0px_#2a3235]">
                        {product.sku}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-label-badge text-[10px] font-bold uppercase ${
                          isOut
                            ? "bg-error-container text-on-error-container"
                            : isLow
                            ? "bg-primary-fixed text-on-primary-fixed"
                            : "bg-tertiary-fixed text-on-tertiary-container"
                        }`}
                      >
                        {product.total_stock} Total Units ({product.stock_status.replace("_", " ")})
                      </span>
                    </div>
                    <p className="font-label-badge text-label-badge text-on-surface-variant mt-0.5">
                      {product.category_badge} • Compatible with{" "}
                      {product.supported_models?.length || 14} phone models (iPhone 13–16 Pro Max &amp; Galaxy)
                    </p>
                  </div>
                </div>

                <div className="flex items-center flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleBulkRestockProduct(product, 10)}
                    className="px-3 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-container font-label-badge text-label-badge font-bold shadow-[1px_1px_0px_#2a3235] hover:opacity-90 transition-transform active:translate-x-0.5 active:translate-y-0.5"
                  >
                    +10 All Colors
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditProduct(product)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container-lowest text-on-surface font-label-badge text-label-badge font-bold shadow-[1px_1px_0px_#2a3235] hover:bg-primary hover:text-on-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      edit
                    </span>
                    <span>Edit Models &amp; Details</span>
                  </button>
                </div>
              </div>

              {/* Color Variants Matrix Table */}
              <div className="divide-y divide-outline-variant/25">
                {(product.color_variants || []).map((variant) => {
                  const fullVariantSku = `${product.sku}${variant.sku_suffix}`;
                  const vOut = variant.stock_units === 0;
                  const vLow = !vOut && variant.stock_units <= 5;

                  return (
                    <div
                      key={variant.id}
                      className="px-space-md py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-container-low transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-7 h-7 rounded-full border border-on-surface/30 shadow-[2px_2px_0px_#2a3235] shrink-0"
                          style={{ backgroundColor: variant.hex_code }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-label-md text-label-md text-on-surface font-bold">
                              {variant.name}
                            </span>
                            {variant.name_en && (
                              <span className="font-label-badge text-[10px] text-on-surface-variant">
                                ({variant.name_en})
                              </span>
                            )}
                            <span className="font-label-badge text-[10px] px-1.5 py-0.5 rounded bg-surface-container text-outline font-bold">
                              {fullVariantSku}
                            </span>
                          </div>
                          <span
                            className={`font-label-badge text-[10px] font-bold ${
                              vOut
                                ? "text-error"
                                : vLow
                                ? "text-primary"
                                : "text-tertiary"
                            }`}
                          >
                            {vOut
                              ? "Agotado (0 uds)"
                              : vLow
                              ? `Stock Bajo (${variant.stock_units} uds)`
                              : `Disponible (${variant.stock_units} uds)`}
                          </span>
                        </div>
                      </div>

                      {/* Live Stock Adjustment Controls */}
                      <div className="flex items-center flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            handleVariantStockChange(
                              product,
                              variant.id,
                              variant.stock_units - 5
                            )
                          }
                          className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface font-label-badge text-label-badge font-bold shadow-[1px_1px_0px_#2a3235] hover:bg-error-container hover:text-on-error-container transition-colors"
                        >
                          -5
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleVariantStockChange(
                              product,
                              variant.id,
                              variant.stock_units - 1
                            )
                          }
                          className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface font-label-badge text-label-badge font-bold shadow-[1px_1px_0px_#2a3235] hover:bg-surface-container-high transition-colors"
                        >
                          -1
                        </button>

                        <input
                          type="number"
                          min={0}
                          value={variant.stock_units}
                          onChange={(e) =>
                            handleVariantStockChange(
                              product,
                              variant.id,
                              Number(e.target.value)
                            )
                          }
                          className="w-20 text-center py-1 px-2 rounded-lg bg-surface-container-low font-headline-sm text-body-md text-on-surface font-extrabold shadow-[1px_1px_0px_#2a3235] focus:outline-none focus:ring-2 focus:ring-primary"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            handleVariantStockChange(
                              product,
                              variant.id,
                              variant.stock_units + 1
                            )
                          }
                          className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface font-label-badge text-label-badge font-bold shadow-[1px_1px_0px_#2a3235] hover:bg-surface-container-high transition-colors"
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleVariantStockChange(
                              product,
                              variant.id,
                              variant.stock_units + 10
                            )
                          }
                          className="px-2.5 py-1 rounded-lg bg-secondary-fixed text-on-secondary-fixed font-label-badge text-label-badge font-bold shadow-[1px_1px_0px_#2a3235] hover:opacity-90 transition-opacity"
                        >
                          +10
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleVariantStockChange(
                              product,
                              variant.id,
                              variant.stock_units + 25
                            )
                          }
                          className="px-2.5 py-1 rounded-lg bg-primary-container text-on-primary-container font-label-badge text-label-badge font-bold shadow-[1px_1px_0px_#2a3235] hover:opacity-90 transition-opacity"
                        >
                          +25
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
