"use client";

import React from "react";
import Link from "next/link";

interface AdminHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function AdminHeader({ searchQuery, onSearchChange }: AdminHeaderProps) {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_2px_10px_rgba(42,50,53,0.04)] z-40 flex items-center justify-between px-space-lg">
      <div className="flex items-center gap-space-md">
        <img
          alt="Logo (1).png"
          className="h-8 w-auto object-contain"
          src="https://lh3.googleusercontent.com/aida/ALJJyrBY2o-dJJ4aAQPt6clR8QZ-0EqgobsGiR0ZuIK8HARrdcganj6i7aZ4Yi_yl2_2lEIqSepZgxwcHHrBKN5VIGYMxeMVEHzouto06XO07iXTUKmPbtg0ZF5RK2QCUHfpzMWnOUjksLVomygo9kHkGCgkjR4tSkq6SneiaXUcELnlwMI3uNyMFJlCDC4SBqzlkcrIArvKOQAxRnLB_A5hcqONokfhonH0ve2exd_sK8e_-Ts4FSCvEnJd"
        />
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
        <button
          className="relative p-2 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-all shadow-[1px_1px_0px_#2a3235]"
          type="button"
          title="Alertas de inventario"
        >
          <span className="material-symbols-outlined text-[20px]">
            notifications
          </span>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-[2px_2px_0px_#2a3235]">
          <span className="material-symbols-outlined text-on-primary text-[18px]">
            person
          </span>
        </div>
      </div>
    </header>
  );
}
