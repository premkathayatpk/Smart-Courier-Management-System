"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const router = useRouter();

  const { loading, initialized, isAuthenticated, user } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (!initialized || loading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
      router.replace("/unauthorized");
    }
  }, [initialized, loading, isAuthenticated, user, router, allowedRoles]);

  if (!initialized || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  // Prevent flashing content if unauthenticated or unauthorized
  if (!isAuthenticated) return null;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return null;
  }

  return children;
}
