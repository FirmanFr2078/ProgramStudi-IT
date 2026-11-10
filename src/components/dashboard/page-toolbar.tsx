"use client";

import Link from "next/link";
import { PlusIcon, SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type PageToolbarProps = {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  addHref?: string; // kosong = sembunyiin tombol tambah (mis. halaman read-only)
  addLabel?: string;
};

export function PageToolbar({
  searchPlaceholder = "Cari...",
  searchValue,
  onSearchChange,
  addHref,
  addLabel = "Tambah",
}: PageToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-9"
        />
      </div>

      {addHref && (
        <Button render={<Link href={addHref} />}>
          <PlusIcon className="size-4" />
          {addLabel}
        </Button>
      )}
    </div>
  );
}
