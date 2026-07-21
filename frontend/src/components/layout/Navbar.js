"use client";

import { FiBell, FiUser } from "react-icons/fi";

export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <h1 className="text-2xl font-semibold">Smart Courier Management</h1>

      <div className="flex items-center gap-5">
        <FiBell size={22} className="cursor-pointer" />

        <div className="flex items-center gap-2 cursor-pointer">
          <FiUser size={22} />
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
}
