"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Order,
  Product,
  StockStatus,
  StoreSettings,
  WaitlistSubscription,
} from "@/types/database";
import { INITIAL_STORE_SETTINGS } from "@/lib/seed-data";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { MetricsStrip } from "./MetricsStrip";
import { ProductFormDrawer } from "./ProductFormDrawer";
import { OverviewView } from "./views/OverviewView";
import { InventoryMatrixView } from "./views/InventoryMatrixView";
import { OrdersView } from "./views/OrdersView";
import { CustomersView } from "./views/CustomersView";
import { AnalyticsView } from "./views/AnalyticsView";
import { StoreSettingsView } from "./views/StoreSettingsView";
import {
  batchUpdateProductsInSupabase,
  deleteProductInSupabase,
  fetchCmsOrders,
  fetchCmsProducts,
  fetchStoreSettingsCms,
  fetchWaitlistSubscriptions,
  INITIAL_DEMO_ORDERS,
  INITIAL_DEMO_WAITLIST,
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
  const [orders, setOrders] = useState<Order[]>(INITIAL_DEMO_ORDERS);
  const [waitlist, setWaitlist] =
    useState<WaitlistSubscription[]>(INITIAL_DEMO_WAITLIST);
  const [settings, setSettings] = useState<StoreSettings>(
    INITIAL_STORE_SETTINGS
  );
  const [activeSection, setActiveSection] = useState("product-catalog");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Types");
  const [stockFilter, setStockFilter] = useState("All Status");
  const [visibilityFilter, setVisibilityFilter] = useState("All Items");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, stockFilter, visibilityFilter, pageSize]);

  useEffect(() => {
    const load = async () => {
      const [latestProducts, latestOrders, latestWaitlist, latestSettings] =
        await Promise.all([
          fetchCmsProducts(),
          fetchCmsOrders(),
          fetchWaitlistSubscriptions(),
          fetchStoreSettingsCms(),
        ]);
      if (latestProducts && latestProducts.length > 0) {
        setProducts(latestProducts);
      }
      if (latestOrders) {
        setOrders(latestOrders);
      }
      if (latestWaitlist) {
        setWaitlist(latestWaitlist);
      }
      if (latestSettings) {
        setSettings(latestSettings);
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

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, safeCurrentPage, pageSize]);

  const showingFrom =
    filteredProducts.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const showingTo = Math.min(
    safeCurrentPage * pageSize,
    filteredProducts.length
  );

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
    showToast(`Producto duplicado: ${copy.sku}`);
  };

  const handleDeleteProduct = async (product: Product) => {
    const next = products.filter((p) => p.id !== product.id);
    persistProductsList(next);
    setSelectedIds((prev) => prev.filter((id) => id !== product.id));
    await deleteProductInSupabase(product.id);
    showToast(`Producto eliminado del catálogo: ${product.sku}`);
  };

  // Batch Actions
  const handleBatchChangeStatus = async () => {
    if (selectedIds.length === 0) return;
    const toLiveIds: string[] = [];
    const toDraftIds: string[] = [];

    const next = products.map((p) => {
      if (!selectedIds.includes(p.id)) return p;
      const nextLive = !p.is_live;
      if (nextLive) {
        toLiveIds.push(p.id);
      } else {
        toDraftIds.push(p.id);
      }
      return {
        ...p,
        is_live: nextLive,
        stock_status: (nextLive ? "in_stock" : "draft") as StockStatus,
      };
    });

    persistProductsList(next);
    await Promise.all([
      toLiveIds.length > 0
        ? batchUpdateProductsInSupabase(toLiveIds, {
            is_live: true,
            stock_status: "in_stock",
          })
        : Promise.resolve(true),
      toDraftIds.length > 0
        ? batchUpdateProductsInSupabase(toDraftIds, {
            is_live: false,
            stock_status: "draft",
          })
        : Promise.resolve(true),
    ]);
    showToast(
      `Actualizados ${selectedIds.length} productos en el catálogo (Estado)`
    );
  };

  const handleBatchDiscount = async () => {
    if (selectedIds.length === 0) return;
    const discountedItems: {
      id: string;
      price_usd: number;
      compare_at_price_usd: number;
    }[] = [];

    const next = products.map((p) => {
      if (!selectedIds.includes(p.id)) return p;
      const newPrice = Number((p.price_usd * 0.85).toFixed(2));
      discountedItems.push({
        id: p.id,
        price_usd: newPrice,
        compare_at_price_usd: p.price_usd,
      });
      return {
        ...p,
        compare_at_price_usd: p.price_usd,
        price_usd: newPrice,
      };
    });

    persistProductsList(next);
    await Promise.all(
      discountedItems.map((item) =>
        batchUpdateProductsInSupabase([item.id], {
          price_usd: item.price_usd,
          compare_at_price_usd: item.compare_at_price_usd,
        })
      )
    );
    showToast(
      `Descuento (-15%) aplicado a ${selectedIds.length} productos en el catálogo`
    );
  };

  const handleBatchOutOfStock = async () => {
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
    await batchUpdateProductsInSupabase(selectedIds, {
      total_stock: 0,
      stock_status: "out_of_stock",
    });
    showToast(
      `Marcados ${selectedIds.length} productos como Agotados (Out of Stock)`
    );
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    const idsToDelete = [...selectedIds];
    const next = products.filter((p) => !idsToDelete.includes(p.id));
    persistProductsList(next);
    setSelectedIds([]);

    await Promise.all(idsToDelete.map((id) => deleteProductInSupabase(id)));
    showToast(`Eliminados ${count} productos del catálogo`);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        userEmail={userEmail}
        logoUrl={settings.logo_url}
      />

      <div className="pl-64">
        <AdminHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          products={products}
          onSelectAlertProduct={(p) => {
            setEditingProduct(p);
            setDrawerOpen(true);
          }}
        />

        <main className="relative pt-20 bg-background w-full px-space-lg">
          <div className="flex flex-col w-full pb-space-2xl">
            {activeSection === "dashboard-overview" && (
              <OverviewView
                products={products}
                orders={orders}
                waitlist={waitlist}
                settings={settings}
                onNavigate={setActiveSection}
                onQuickRestock={(productId, addUnits) => {
                  const target = products.find((p) => p.id === productId);
                  if (!target) return;
                  const nextTotal = target.total_stock + addUnits;
                  updateProductField(productId, {
                    total_stock: nextTotal,
                    stock_status: "in_stock",
                    is_live: true,
                  });
                  showToast(
                    `Restock aplicado: +${addUnits} unidades a ${target.title}`
                  );
                }}
                onEditProduct={(p) => {
                  setEditingProduct(p);
                  setDrawerOpen(true);
                }}
              />
            )}

            {activeSection === "inventory-stock" && (
              <InventoryMatrixView
                products={products}
                onUpdateProducts={persistProductsList}
                onEditProduct={(p) => {
                  setEditingProduct(p);
                  setDrawerOpen(true);
                }}
                onShowToast={showToast}
              />
            )}

            {activeSection === "orders" && (
              <OrdersView
                orders={orders}
                products={products}
                settings={settings}
                onUpdateOrders={setOrders}
                onShowToast={showToast}
              />
            )}

            {activeSection === "customers" && (
              <CustomersView
                orders={orders}
                waitlist={waitlist}
                products={products}
                onUpdateWaitlist={setWaitlist}
                onShowToast={showToast}
              />
            )}

            {activeSection === "analytics" && (
              <AnalyticsView
                products={products}
                settings={settings}
                onEditProduct={(p) => {
                  setEditingProduct(p);
                  setDrawerOpen(true);
                }}
              />
            )}

            {activeSection === "store-settings" && (
              <StoreSettingsView
                settings={settings}
                products={products}
                onUpdateSettings={setSettings}
                onShowToast={showToast}
              />
            )}

            {activeSection === "product-catalog" && (
              <>
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
                        <span className="text-primary font-bold">
                          All Catalog
                        </span>
                      </nav>
                      <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
                        Product Catalog &amp; Inventory Management
                      </h1>
                    </div>


                {/* Action Button Group */}
                <div className="flex items-center flex-wrap gap-2.5">
                  <button
                    onClick={handleInventorySync}
                    className="h-10 flex items-center gap-1.5 px-3.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
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
                    className="h-10 flex items-center gap-1.5 px-3.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
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
                    className="h-10 flex items-center gap-1.5 px-4 rounded-lg bg-primary text-white text-xs font-bold shadow-sm hover:opacity-95 transition-opacity"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[19px]">
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
            <div className="bg-white border border-slate-200/90 p-4 rounded-xl shadow-sm mb-6 flex flex-col gap-3">
              {/* Top Filter Controls */}
              <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[260px]">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[19px]">
                    search
                  </span>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-lg bg-white border border-slate-300 text-sm text-on-surface placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all"
                    placeholder="Search by product title, SKU, or phone model..."
                    type="text"
                  />
                </div>

                {/* Filter Dropdowns Group */}
                <div className="flex items-center flex-wrap gap-2.5">
                  {/* Category Filter */}
                  <div className="h-10 flex items-center bg-white border border-slate-300 rounded-lg px-3">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-2">
                      Category:
                    </span>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
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
                  <div className="h-10 flex items-center bg-white border border-slate-300 rounded-lg px-3">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-2">
                      Stock:
                    </span>
                    <select
                      value={stockFilter}
                      onChange={(e) => setStockFilter(e.target.value)}
                      className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option>All Status</option>
                      <option>In Stock</option>
                      <option>Low Stock</option>
                      <option>Out of Stock</option>
                    </select>
                  </div>

                  {/* Visibility Filter */}
                  <div className="h-10 flex items-center bg-white border border-slate-300 rounded-lg px-3">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-2">
                      Visibility:
                    </span>
                    <select
                      value={visibilityFilter}
                      onChange={(e) => setVisibilityFilter(e.target.value)}
                      className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option>All Items</option>
                      <option>Active on Web</option>
                      <option>Draft / Hidden</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bulk Action Strip (Only shown when selectedIds.length > 0) */}
              {selectedIds.length > 0 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-lg">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-primary text-white flex items-center justify-center text-xs font-bold">
                      {selectedIds.length}
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                      Products selected for batch operations
                    </span>
                  </div>
                  <div className="flex items-center flex-wrap gap-2">
                    <button
                      onClick={handleBatchChangeStatus}
                      className="h-8 px-3 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors"
                      type="button"
                    >
                      Change Status
                    </button>
                    <button
                      onClick={handleBatchDiscount}
                      className="h-8 px-3 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors"
                      type="button"
                    >
                      Apply Discount (-15%)
                    </button>
                    <button
                      onClick={handleBatchOutOfStock}
                      className="h-8 px-3 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors"
                      type="button"
                    >
                      Set Out of Stock
                    </button>
                    <button
                      onClick={handleBatchDelete}
                      className="h-8 px-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-bold hover:bg-rose-100 transition-colors"
                      type="button"
                    >
                      Delete Selected
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Rich Product Management Table */}
            <div className="bg-white border border-slate-200/90 rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
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

                  <tbody className="divide-y divide-slate-100 font-body-sm text-body-sm">
                    {paginatedProducts.map((product) => {
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
                          className={`hover:bg-slate-50/80 transition-colors group ${
                            isDraft
                              ? "bg-slate-50/40"
                              : product.promo_tag === "HOT DROP"
                              ? "bg-primary-fixed/5"
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
                                onClick={() => setActiveSection("analytics")}
                                className="p-1.5 rounded bg-surface-container text-on-surface hover:bg-tertiary hover:text-on-tertiary transition-colors"
                                title="Quick Analytics"
                                type="button"
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  trending_up
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

                              <button
                                onClick={() => handleDeleteProduct(product)}
                                className="p-1.5 rounded bg-surface-container text-on-surface hover:bg-error-container hover:text-on-error-container transition-colors"
                                title="Delete Product"
                                type="button"
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  delete
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
              <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200 gap-3 text-xs font-bold text-slate-600">
                <div className="flex items-center gap-2">
                  <span>
                    Showing {showingFrom} to {showingTo} of{" "}
                    {filteredProducts.length} items
                  </span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="h-8 bg-white border border-slate-300 text-slate-800 rounded-lg px-2 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={safeCurrentPage <= 1}
                    className="w-8 h-8 rounded-lg border border-slate-300 bg-white text-slate-700 flex items-center justify-center hover:bg-slate-100 disabled:opacity-40"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      chevron_left
                    </span>
                  </button>
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                          pageNum === safeCurrentPage
                            ? "bg-primary text-white"
                            : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                        }`}
                        type="button"
                      >
                        {pageNum}
                      </button>
                    )
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={safeCurrentPage >= totalPages}
                    className="w-8 h-8 rounded-lg border border-slate-300 bg-white text-slate-700 flex items-center justify-center hover:bg-slate-100 disabled:opacity-40"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            </div>
              </>
            )}

            {/* Interactive Slide-out Quick Edit Drawer */}
            <ProductFormDrawer
              isOpen={drawerOpen}
              product={editingProduct}
              onClose={() => setDrawerOpen(false)}
              onSaved={(savedProduct, isNew) => {
                if (isNew) {
                  persistProductsList([savedProduct, ...products]);
                  showToast(`Producto creado: ${savedProduct.title}`);
                } else {
                  persistProductsList(
                    products.map((p) =>
                      p.id === savedProduct.id ? savedProduct : p
                    )
                  );
                  showToast(`Cambios guardados: ${savedProduct.title}`);
                }
              }}
            />

            {/* Toast Notification Banner */}
            {toastMessage && (
              <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-[3px_3px_0px_#2a3235] border border-outline-variant/40">
                <span className="material-symbols-outlined text-tertiary-fixed text-[20px]">
                  check_circle
                </span>
                <span className="font-label-md text-label-md font-bold">
                  {toastMessage}
                </span>
                <button
                  type="button"
                  onClick={() => setToastMessage(null)}
                  className="ml-2 text-inverse-on-surface/70 hover:text-inverse-on-surface"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    close
                  </span>
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
