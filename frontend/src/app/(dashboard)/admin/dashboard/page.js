"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setDashboardStats,
  setLoading,
  setError,
} from "@/redux/slices/dashboardSlice";

import { getDashboardStats } from "@/services/adminService";

import StatsCard from "@/components/dashboard/StatsCard";

export default function AdminDashboard() {
  const dispatch = useDispatch();

  const { stats, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    const loadDashboard = async () => {
      dispatch(setLoading(true));

      try {
        const res = await getDashboardStats();

        dispatch(setDashboardStats(res.data.data));
      } catch (err) {
        dispatch(setError(err.response?.data?.message));
      }
    };

    loadDashboard();
  }, [dispatch]);

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Total Users"
            value={stats.users.totalUsers || 0}
            color="text-blue-600"
          />

          <StatsCard
            title="Customers"
            value={stats.users.totalCustomers || 0}
            color="text-green-600"
          />

          <StatsCard
            title="Drivers"
            value={stats.users.totalDrivers || 0}
            color="text-orange-600"
          />

          <StatsCard
            title="Active Drivers"
            value={stats.users.activeDrivers || 0}
            color="text-purple-600"
          />

          <StatsCard
            title="Total Parcels"
            value={stats.parcels.totalParcels || 0}
            color="text-cyan-600"
          />

          <StatsCard
            title="Pending"
            value={stats.parcels.pendingParcels || 0}
            color="text-yellow-600"
          />

          <StatsCard
            title="Delivered"
            value={stats.parcels.deliveredParcels || 0}
            color="text-green-700"
          />

          <StatsCard
            title="Revenue"
            value={`Rs. ${stats.revenue.totalRevenue || 0}`}
            color="text-red-600"
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
