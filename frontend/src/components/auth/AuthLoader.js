"use client";

import useAuth from "@/hooks/useAuth";

export default function AuthLoader({ children }) {
  useAuth();

  return children;
}
