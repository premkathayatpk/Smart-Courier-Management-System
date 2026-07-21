"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiPackage,
  FiTruck,
  FiUsers,
  FiMapPin,
  FiSettings,
} from "react-icons/fi";
const menuItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icone: <FiHome size={20} />,
  },
  {
    title: "Parcels",
    href: "/admin/parcels",
    icon: <FiPackage size={20} />,
  },
  {
    title: "Drivers",
    href: "/admin/drivers",
    icon: <FiTruck size={20} />,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: <FiUsers size={20} />,
  },
  {
    title: "Tracking",
    href: "/admin/tracking",
    icon: <FiMapPin size={20} />,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: <FiSettings size={20} />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold">Courier MS</h2>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${
              pathname === item.href ? "bg-blue-600" : "hover:bg-gray-800"
            }`}
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
