"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Product, StockStatus } from "@/types/database";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { MetricsStrip } from "./MetricsStrip";
import { ProductFormDrawer } from "./ProductFormDrawer";
import {
  fetchCmsProducts,
  setLocalCachedProducts,
} from "@/lib/queries/cms";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface CmsProductManagerProps {
  initialProducts: Product[];
  userEmail?: string;
}

export function CmsProductManager({
  initialProducts,
  userEmail,
}: CmsProductManagerProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [activeSection, setActiveSection] = useState("product-catalog");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Types");
  const [stockFilter, setStockFilter] = useState("All Status");
  const [visibilityFilter, setVisibilityFilter] = useState("All Items");
  const [selectedIds, setSelectedIds] = useState<string[]>([
    initialProducts[0]?.id || "prod-1",
    initialProducts[1]?.id || "prod-2",
  ]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const load = async () => {
      const latest = await fetchCmsProducts();
      if (latest && latest.length > 0) {
        setProducts(latest);
      }
    };
    load();
  }, []);

  const persistProductsList = (nextList: Product[]) => {
    setProducts(nextList);
    setLocalCachedProducts(nextList);
  };

  const handleInventorySync = async () => {
    setSyncing(true);
    const fresh = await fetchCmsProducts();
    setProducts(fresh);
    setTimeout(() => setSyncing(false), 500);
  };

  const handleExportCsv = () => {
    const headers = [
      "SKU",
      "Title",
      "Category",
      "Price USD",
      "Cost USD",
      "Gross Margin %",
      "Stock Units",
      "Status",
      "Live on Storefront",
    ];
    const rows = products.map((p) => {
      const margin =
        p.price_usd > 0
          ? Math.round(((p.price_usd - p.cost_usd) / p.price_usd) * 100)
          : 0;
      return [
        p.sku,
        `"${p.title.replace(/"/g, '""')}"`,
        p.category_badge,
        p.price_usd.toFixed(2),
        p.cost_usd.toFixed(2),
        `${margin}%`,
        p.total_stock,
        p.stock_status,
        p.is_live ? "Yes" : "No",
      ].join(",");
    });

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pocket-cases-inventory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matches =
          p.title.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category_badge.toLowerCase().includes(q) ||
          p.supported_models?.some((m) => m.toLowerCase().includes(q));
        if (!matches) return false;
      }

      if (categoryFilter !== "All Types") {
        const catNorm = categoryFilter.toLowerCase();
        if (
          !p.category_badge.toLowerCase().includes(catNorm) &&
          !(catNorm === "bio-resin" && p.category_badge.toLowerCase().includes("resina"))
        ) {
          return false;
        }
      }

      if (stockFilter !== "All Status") {
        if (stockFilter === "In Stock" && p.stock_status !== "in_stock")
          return false;
        if (stockFilter === "Low Stock" && p.stock_status !== "low_stock")
          return false;
        if (stockFilter === "Out of Stock" && p.stock_status !== "out_of_stock")
          return false;
      }

      if (visibilityFilter !== "All Items") {
        if (visibilityFilter === "Active on Web" && !p.is_live) return false;
        if (visibilityFilter === "Draft / Hidden" && p.is_live) return false;
      }

      return true;
    });
  }, [
    products,
    searchQuery,
    categoryFilter,
    stockFilter,
    visibilityFilter,
  ]);

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p.id));
    }
  };

  const updateProductField = async (
    productId: string,
    patch: Partial<Product>
  ) => {
    const next = products.map((p) =>
      p.id === productId ? { ...p, ...patch } : p
    );
    persistProductsList(next);

    if (isSupabaseConfigured() && !productId.startsWith("prod-")) {
      try {
        const supabase = createClient();
        await supabase.from("products").update(patch).eq("id", productId);
      } catch {
        // Fallback to local state
      }
    }
  };

  const handleDuplicateProduct = (product: Product) => {
    const copy: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      sku: `${product.sku}-COPY`,
      title: `${product.title} (Copy)`,
      slug: `${product.slug}-copy-${Math.floor(10 + Math.random() * 89)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    persistProductsList([copy, ...products]);
  };

  // Batch Actions
  const handleBatchChangeStatus = () => {
    if (selectedIds.length === 0) return;
    const next = products.map((p) =>
      selectedIds.includes(p.id)
        ? {
            ...p,
            is_live: !p.is_live,
            stock_status: (!p.is_live ? "in_stock" : "draft") as StockStatus,
          }
        : p
    );
    persistProductsList(next);
  };

  const handleBatchDiscount = () => {
    if (selectedIds.length === 0) return;
    const next = products.map((p) =>
      selectedIds.includes(p.id)
        ? {
            ...p,
            compare_at_price_usd: p.price_usd,
            price_usd: Number((p.price_usd * 0.85).toFixed(2)),
          }
        : p
    );
    persistProductsList(next);
  };

  const handleBatchOutOfStock = () => {
    if (selectedIds.length === 0) return;
    const next = products.map((p) =>
      selectedIds.includes(p.id)
        ? {
            ...p,
            total_stock: 0,
            stock_status: "out_of_stock" as StockStatus,
          }
        : p
    );
    persistProductsList(next);
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    const next = products.filter((p) => !selectedIds.includes(p.id));
    persistProductsList(next);

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        await supabase.from("products").delete().in("id", selectedIds);
      } catch {
        // Ignore
      }
    }
    setSelectedIds([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        userEmail={userEmail}
      />

      <div className="pl-64">
        <AdminHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="relative pt-20 bg-background w-full px-space-lg">
          <div className="flex flex-col w-full pb-space-2xl">
            {/* Page Header & Key Operational Metrics Bar */}
            <div className="flex flex-col gap-space-lg mb-space-xl">
              {/* Breadcrumb & Top Title Flex Row */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
                <div>
                  <nav className="flex items-center gap-2 font-label-badge text-label-badge text-on-surface-variant uppercase tracking-wider mb-1">
                    <span>Dashboard</span>
                    <span className="material-symbols-outlined text-[12px] text-outline">
                      chevron_right
                    </span>
                    <span>Products</span>
                    <span className="material-symbols-outlined text-[12px] text-outline">
                      chevron_right
                    </span>
                    <span className="text-primary font-bold">All Catalog</span>
                  </nav>
                  <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
                    Product Catalog &amp; Inventory Management
                  </h1>
                </div>

                {/* Action Button Group */}
                <div className="flex items-center flex-wrap gap-space-sm">
                  <button
                    onClick={handleInventorySync}
                    className="flex items-center gap-1.5 px-space-md py-2 rounded-full bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-[2px_2px_0px_#2a3235] hover:bg-surface-container-high transition-transform active:translate-x-0.5 active:translate-y-0.5"
                    type="button"
                  >
                    <span
                      className={`material-symbols-outlined text-[18px] ${
                        syncing ? "animate-spin text-primary" : ""
                      }`}
                    >
                      sync
                    </span>
                    <span>{syncing ? "Syncing..." : "Inventory Sync"}</span>
                  </button>

                  <button
                    onClick={handleExportCsv}
                    className="flex items-center gap-1.5 px-space-md py-2 rounded-full bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-[2px_2px_0px_#2a3235] hover:bg-surface-container-high transition-transform active:translate-x-0.5 active:translate-y-0.5"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      file_download
                    </span>
                    <span>Bulk Export CSV</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setDrawerOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-space-lg py-2 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md shadow-[2px_2px_0px_#2a3235] hover:opacity-95 transition-transform active:translate-x-0.5 active:translate-y-0.5"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      add
                    </span>
                    <span>Add New Product</span>
                  </button>
                </div>
              </div>

              {/* Operational Metrics Chips Strip */}
              <MetricsStrip products={products} />
            </div>

            {/* Search, Filter & Bulk Action Controls Strip */}
            <div className="bg-surface-container-lowest p-space-md rounded-DEFAULT shadow-[3px_3px_0px_#2a3235] mb-space-lg flex flex-col gap-space-md">
              {/* Top Filter Controls */}
              <div className="flex flex-col lg:flex-row gap-space-md items-stretch lg:items-center justify-between">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[260px]">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                    search
                  </span>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest shadow-[1px_1px_0px_#2a3235]"
                    placeholder="Search by product title, SKU, or phone model..."
                    type="text"
                  />
                </div>

                {/* Filter Dropdowns Group */}
                <div className="flex items-center flex-wrap gap-space-sm">
                  {/* Category Filter */}
                  <div className="flex items-center bg-surface-container-low rounded-lg px-3 py-1.5 shadow-[1px_1px_0px_#2a3235]">
                    <span className="font-label-badge text-label-badge text-on-surface-variant uppercase mr-2">
                      Category:
                    </span>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="bg-transparent font-label-md text-label-md text-on-surface focus:outline-none cursor-pointer"
                    >
                      <option>All Types</option>
                      <option>MagSafe Tough</option>
                      <option>Dual Shock</option>
                      <option>Bio-Resin</option>
                      <option>Heavy Duty Armor</option>
                      <option>Crystal Clear</option>
                      <option>Mirror MagSafe</option>
                      <option>Ultra Slim</option>
                      <option>Vegan Leather</option>
                    </select>
                  </div>

                  {/* Stock Status Filter */}
                  <div className="flex items-center bg-surface-container-low rounded-lg px-3 py-1.5 shadow-[1px_1px_0px_#2a3235]">
                    <span className="font-label-badge text-label-badge text-on-surface-variant uppercase mr-2">
                      Stock:
                    </span>
                    <select
                      value={stockFilter}
                      onChange={(e) => setStockFilter(e.target.value)}
                      className="bg-transparent font-label-md text-label-md text-on-surface focus:outline-none cursor-pointer"
                    >
                      <option>All Status</option>
                      <option>In Stock</option>
                      <option>Low Stock</option>
                      <option>Out of Stock</option>
                    </select>
                  </div>

                  {/* Visibility Filter */}
                  <div className="flex items-center bg-surface-container-low rounded-lg px-3 py-1.5 shadow-[1px_1px_0px_#2a3235]">
                    <span className="font-label-badge text-label-badge text-on-surface-variant uppercase mr-2">
                      Visibility:
                    </span>
                    <select
                      value={visibilityFilter}
                      onChange={(e) => setVisibilityFilter(e.target.value)}
                      className="bg-transparent font-label-md text-label-md text-on-surface focus:outline-none cursor-pointer"
                    >
                      <option>All Items</option>
                      <option>Active on Web</option>
                      <option>Draft / Hidden</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bulk Action Strip (Selected items banner) */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm bg-secondary-container/40 p-2.5 rounded-lg">
                <div className="flex items-center gap-space-sm">
                  <div className="w-6 h-6 rounded bg-primary text-on-primary flex items-center justify-center font-label-md text-label-md">
                    {selectedIds.length}
                  </div>
                  <span className="font-label-md text-label-md text-on-surface">
                    Products selected for batch operations
                  </span>
                </div>
                <div className="flex items-center flex-wrap gap-space-xs">
                  <button
                    onClick={handleBatchChangeStatus}
                    className="px-3 py-1 bg-surface-container-lowest text-on-surface rounded-full font-label-badge text-label-badge shadow-[1px_1px_0px_#2a3235] hover:bg-surface-container-high transition-transform active:translate-x-0.5 active:translate-y-0.5"
                    type="button"
                  >
                    Change Status
                  </button>
                  <button
                    onClick={handleBatchDiscount}
                    className="px-3 py-1 bg-surface-container-lowest text-on-surface rounded-full font-label-badge text-label-badge shadow-[1px_1px_0px_#2a3235] hover:bg-surface-container-high transition-transform active:translate-x-0.5 active:translate-y-0.5"
                    type="button"
                  >
                    Apply Discount (-15%)
                  </button>
                  <button
                    onClick={handleBatchOutOfStock}
                    className="px-3 py-1 bg-surface-container-lowest text-on-surface rounded-full font-label-badge text-label-badge shadow-[1px_1px_0px_#2a3235] hover:bg-surface-container-high transition-transform active:translate-x-0.5 active:translate-y-0.5"
                    type="button"
                  >
                    Set Out of Stock
                  </button>
                  <button
                    onClick={handleBatchDelete}
                    className="px-3 py-1 bg-error-container text-on-error-container rounded-full font-label-badge text-label-badge shadow-[1px_1px_0px_#2a3235] hover:opacity-90 transition-transform active:translate-x-0.5 active:translate-y-0.5"
                    type="button"
                  >
                    Delete Selected
                  </button>
                </div>
              </div>
            </div>

            {/* Rich Product Management Table */}
            <div className="bg-surface-container-lowest rounded-DEFAULT shadow-[3px_3px_0px_#2a3235] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-high text-on-surface font-label-badge text-label-badge uppercase tracking-wider">
                      <th className="py-3.5 px-4 w-12 text-center">
                        <input
                          checked={
                            filteredProducts.length > 0 &&
                            selectedIds.length === filteredProducts.length
                          }
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                          type="checkbox"
                        />
                      </th>
                      <th className="py-3.5 px-4">Product &amp; SKU</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price / Margin</th>
                      <th className="py-3.5 px-4">Inventory Level</th>
                      <th className="py-3.5 px-4 text-center">
                        Storefront Live
                      </th>
                      <th className="py-3.5 px-4">Stock Status</th>
                      <th className="py-3.5 px-4 text-right">Quick Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y-0 font-body-sm text-body-sm">
                    {filteredProducts.map((product) => {
                      const isSelected = selectedIds.includes(product.id);
                      const gmPercent =
                        product.price_usd > 0
                          ? Math.round(
                              ((product.price_usd - product.cost_usd) /
                                product.price_usd) *
                                100
                            )
                          : 0;
                      const stockBarWidth = Math.min(
                        100,
                        Math.round((product.total_stock / 100) * 100)
                      );

                      const isDraft =
                        product.stock_status === "draft" || !product.is_live;
                      const isOut =
                        product.stock_status === "out_of_stock" ||
                        product.total_stock === 0;
                      const isLow =
                        !isOut &&
                        (product.stock_status === "low_stock" ||
                          product.total_stock <= product.low_stock_threshold);

                      return (
                        <tr
                          key={product.id}
                          className={`hover:bg-surface-container-low transition-colors group ${
                            isDraft
                              ? "bg-surface-container/30"
                              : product.promo_tag === "HOT DROP"
                              ? "bg-primary-fixed/10"
                              : ""
                          }`}
                        >
                          <td className="py-3 px-4 text-center">
                            <input
                              checked={isSelected}
                              onChange={() => toggleSelectRow(product.id)}
                              className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                              type="checkbox"
                            />
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-12 h-12 rounded-lg bg-secondary-container/40 p-1 flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#2a3235] ${
                                  isOut ? "opacity-60" : ""
                                }`}
                              >
                                <img
                                  alt={product.title}
                                  className="w-full h-full object-cover rounded"
                                  src={product.primary_image_url}
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <p className="font-headline-sm text-body-md text-on-surface font-bold truncate">
                                    {product.title}
                                  </p>
                                  {product.promo_tag && (
                                    <span
                                      className={`px-1.5 py-0.2 rounded font-label-badge text-[9px] font-bold ${
                                        product.promo_tag === "BESTSELLER"
                                          ? "bg-secondary-fixed text-on-secondary-fixed"
                                          : product.promo_tag === "HOT DROP"
                                          ? "bg-primary-container text-on-primary-container"
                                          : "bg-surface-container-highest text-on-surface-variant"
                                      }`}
                                    >
                                      {product.promo_tag}
                                    </span>
                                  )}
                                </div>
                                <p className="font-label-badge text-label-badge text-outline">
                                  SKU: {product.sku}
                                </p>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className="px-1.5 py-0.2 rounded font-label-badge text-[9px] bg-surface-container-high text-on-surface-variant font-bold">
                                    iPhone 13 - 16 Pro Max (
                                    {product.supported_models?.length || 12}{" "}
                                    models)
                                  </span>
                                  {product.color_variants?.length > 0 && (
                                    <div className="flex items-center gap-1 ml-0.5">
                                      {product.color_variants
                                        .slice(0, 4)
                                        .map((cv) => (
                                          <span
                                            key={cv.id}
                                            className="w-3 h-3 rounded-full border shadow-[1px_1px_0px_#2a3235]"
                                            style={{
                                              backgroundColor: cv.hex_code,
                                            }}
                                            title={cv.name}
                                          ></span>
                                        ))}
                                      <span className="font-label-badge text-[9px] text-outline font-bold">
                                        +{product.color_variants.length} colors
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 font-label-md text-label-md text-on-surface-variant">
                            {product.category_badge}
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-label-md text-label-md text-on-surface font-bold">
                              ${product.price_usd.toFixed(2)}
                            </div>
                            <span className="font-label-badge text-label-badge text-tertiary">
                              Cost ${product.cost_usd.toFixed(2)} ({gmPercent}%
                              GM)
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2.5 h-2.5 rounded-full ${
                                  isOut
                                    ? "bg-error"
                                    : isLow
                                    ? "bg-primary animate-pulse"
                                    : isDraft
                                    ? "bg-outline"
                                    : "bg-tertiary"
                                }`}
                              ></span>
                              <span
                                className={`font-label-md text-label-md font-bold ${
                                  isOut
                                    ? "text-error"
                                    : isLow
                                    ? "text-primary"
                                    : isDraft
                                    ? "text-on-surface-variant"
                                    : "text-on-surface"
                                }`}
                              >
                                {product.total_stock} units
                              </span>
                            </div>
                            <div className="w-24 bg-surface-container rounded-full h-1.5 mt-1 overflow-hidden">
                              <div
                                className={`h-1.5 rounded-full ${
                                  isOut
                                    ? "bg-error"
                                    : isLow
                                    ? "bg-primary"
                                    : isDraft
                                    ? "bg-outline"
                                    : "bg-tertiary"
                                }`}
                                style={{ width: `${stockBarWidth}%` }}
                              ></div>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                checked={product.is_live}
                                onChange={(e) =>
                                  updateProductField(product.id, {
                                    is_live: e.target.checked,
                                    stock_status: e.target.checked
                                      ? product.total_stock === 0
                                        ? "out_of_stock"
                                        : "in_stock"
                                      : "draft",
                                  })
                                }
                                className="sr-only peer"
                                type="checkbox"
                              />
                              <div className="w-9 h-5 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-tertiary"></div>
                            </label>
                          </td>

                          <td className="py-3 px-4">
                            <select
                              value={product.stock_status}
                              onChange={(e) => {
                                const nextStatus = e.target
                                  .value as StockStatus;
                                updateProductField(product.id, {
                                  stock_status: nextStatus,
                                  is_live: nextStatus !== "draft",
                                  total_stock:
                                    nextStatus === "out_of_stock"
                                      ? 0
                                      : nextStatus === "in_stock" &&
                                        product.total_stock === 0
                                      ? 25
                                      : product.total_stock,
                                });
                              }}
                              className={`font-label-badge text-label-badge px-2 py-1 rounded-md font-bold focus:outline-none cursor-pointer ${
                                product.stock_status === "in_stock"
                                  ? "bg-tertiary-fixed text-on-tertiary-container"
                                  : product.stock_status === "low_stock"
                                  ? "bg-primary-fixed text-on-primary-fixed"
                                  : product.stock_status === "out_of_stock"
                                  ? "bg-error-container text-on-error-container"
                                  : "bg-surface-container-highest text-on-surface-variant"
                              }`}
                            >
                              <option value="in_stock">In Stock</option>
                              <option value="low_stock">Low Stock</option>
                              <option value="out_of_stock">Out of Stock</option>
                              <option value="draft">Draft</option>
                            </select>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isLow && (
                                <button
                                  onClick={() =>
                                    updateProductField(product.id, {
                                      total_stock: product.total_stock + 25,
                                      stock_status: "in_stock",
                                    })
                                  }
                                  className="px-2 py-1 rounded bg-primary text-on-primary font-label-badge text-[10px] uppercase font-bold shadow-[1px_1px_0px_#2a3235] hover:opacity-90"
                                  type="button"
                                >
                                  Restock
                                </button>
                              )}

                              {isOut && (
                                <button
                                  onClick={() =>
                                    updateProductField(product.id, {
                                      total_stock: 30,
                                      stock_status: "in_stock",
                                    })
                                  }
                                  className="px-2 py-1 rounded bg-error text-on-error font-label-badge text-[10px] uppercase font-bold shadow-[1px_1px_0px_#2a3235] hover:opacity-90"
                                  type="button"
                                >
                                  Restock PO
                                </button>
                              )}

                              {isDraft && (
                                <button
                                  onClick={() =>
                                    updateProductField(product.id, {
                                      is_live: true,
                                      stock_status: "in_stock",
                                      promo_tag: null,
                                    })
                                  }
                                  className="px-2 py-1 rounded bg-secondary-container text-on-secondary-container font-label-badge text-[10px] uppercase font-bold shadow-[1px_1px_0px_#2a3235] hover:opacity-90"
                                  type="button"
                                >
                                  Publish
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  setEditingProduct(product);
                                  setDrawerOpen(true);
                                }}
                                className="p-1.5 rounded bg-surface-container text-on-surface hover:bg-primary hover:text-on-primary transition-colors"
                                title="Edit Product"
                                type="button"
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  edit
                                </span>
                              </button>

                              <button
                                onClick={() => handleDuplicateProduct(product)}
                                className="p-1.5 rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
                                title="Duplicate SKU"
                                type="button"
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  content_copy
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between px-space-md py-3 bg-surface-container-low border-t-0 gap-space-sm font-label-md text-label-md text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span>
                    Showing 1 to {filteredProducts.length} of {products.length}{" "}
                    items
                  </span>
                  <select className="bg-surface-container-lowest text-on-surface rounded px-2 py-0.5 text-xs shadow-[1px_1px_0px_#2a3235] focus:outline-none">
                    <option>10 per page</option>
                    <option>25 per page</option>
                    <option>50 per page</option>
                  </select>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    className="w-8 h-8 rounded bg-surface-container-lowest text-on-surface flex items-center justify-center shadow-[1px_1px_0px_#2a3235] hover:bg-surface-container-high disabled:opacity-40"
                    disabled
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      chevron_left
                    </span>
                  </button>
                  <button
                    className="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center font-bold shadow-[1px_1px_0px_#2a3235]"
                    type="button"
                  >
                    1
                  </button>
                  <button
                    className="w-8 h-8 rounded bg-surface-container-lowest text-on-surface flex items-center justify-center shadow-[1px_1px_0px_#2a3235] hover:bg-surface-container-high"
                    type="button"
                  >
                    2
                  </button>
                  <button
                    className="w-8 h-8 rounded bg-surface-container-lowest text-on-surface flex items-center justify-center shadow-[1px_1px_0px_#2a3235] hover:bg-surface-container-high"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Slide-out Quick Edit Drawer */}
            <ProductFormDrawer
              isOpen={drawerOpen}
              product={editingProduct}
              onClose={() => setDrawerOpen(false)}
              onSaved={(savedProduct, isNew) => {
                if (isNew) {
                  persistProductsList([savedProduct, ...products]);
                } else {
                  persistProductsList(
                    products.map((p) =>
                      p.id === savedProduct.id ? savedProduct : p
                    )
                  );
                }
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
