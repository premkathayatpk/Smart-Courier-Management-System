"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { updateParcelStatus } from "@/services/parcelService";

const STATUS_OPTIONS = ["Assigned", "Picked Up", "In Transit", "Delivered"];

export default function UpdateStatusCard({ parcelId, currentStatus }) {
  const router = useRouter();

  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (status === currentStatus) {
      toast("Status is already selected.");
      return;
    }

    try {
      setLoading(true);

      await updateParcelStatus(parcelId, status);

      toast.success("Parcel status updated.");

      router.refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">Update Parcel Status</h2>

      <select
        className="mb-4 w-full rounded-lg border p-3"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        {STATUS_OPTIONS.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <button
        onClick={handleUpdate}
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Updating..." : "Update Status"}
      </button>
    </div>
  );
}
