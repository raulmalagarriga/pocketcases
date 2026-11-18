"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface AdminSidebarProps {
  activeSection: string;
  onSelectSection: (section: string) => void;
  userEmail?: string;
  logoUrl?: string;
}

const SIDEBAR_ITEMS = [
  { id: "dashboard-overview", label: "Dashboard Overview", icon: "grid_view" },
  { id: "product-catalog", label: "Product Catalog", icon: "inventory_2" },
  { id: "inventory-stock", label: "Inventory & Stock", icon: "warehouse" },
  { id: "orders", label: "Orders", icon: "local_shipping" },
  { id: "customers", label: "Customers", icon: "group" },
  { id: "analytics", label: "Analytics", icon: "monitoring" },
  { id: "store-settings", label: "Store Settings", icon: "settings" },
];

export function AdminSidebar({
  activeSection,
  onSelectSection,
  userEmail,
  logoUrl,
}: AdminSidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/admin/login");
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low z-50 flex flex-col justify-between py-space-md shadow-[2px_0_12px_rgba(42,50,53,0.04)]">
      <div className="flex flex-col">
        <div className="px-space-md pb-space-lg flex items-center justify-between gap-2">
          <img
            src={logoUrl || "/logo.png"}
            onError={(e) => {
              e.currentTarget.src = "/logo.png";
            }}
            alt="Pocket Cases"
            className="h-11 w-[112px] shrink-0 object-contain rounded-lg shadow-[2px_2px_0px_#2a3235] bg-[#d8f3c8]"
          />
          <span className="font-label-badge text-label-badge text-on-tertiary-container bg-tertiary-fixed px-2 py-0.5 rounded-full font-bold shadow-[1px_1px_0px_#2a3235] shrink-0">
            ADMIN CMS
          </span>
        </div>

        <nav className="flex flex-col gap-1 px-space-sm font-label-md text-label-md">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectSection(item.id)}
                className={
                  isActive
                    ? "flex items-center gap-3 px-space-md py-2.5 rounded-lg transition-all bg-primary text-on-primary font-bold shadow-[2px_2px_0px_#2a3235] text-left"
                    : "flex items-center gap-3 px-space-md py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all text-left"
                }
              >
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="px-space-sm pt-space-md">
        <div className="bg-surface-container p-space-sm rounded-lg flex items-center gap-space-sm shadow-[2px_2px_0px_#2a3235]">
          <div className="w-9 h-9 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-xs">
            MS
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-label-md text-label-md text-on-surface truncate">
              {userEmail ? userEmail.split("@")[0] : "Maya Stone"}
            </p>
            <p className="font-label-badge text-label-badge text-on-surface-variant truncate">
              Store Manager
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="text-on-surface-variant hover:text-error transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">
              logout
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
