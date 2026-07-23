"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { assignDriver, getDrivers } from "@/services/parcelService";

import toast from "react-hot-toast";

export default function AssignDriverPage() {
  const { id } = useParams();

  const router = useRouter();

  const [drivers, setDrivers] = useState([]);

  const [driverId, setDriverId] = useState("");

  useEffect(() => {
    async function loadDrivers() {
      const res = await getDrivers();

      setDrivers(res.data.data);
    }

    loadDrivers();
  }, []);

  const handleAssign = async () => {
    if (!driverId) {
      toast.error("Select a driver");
      return;
    }

    try {
      await assignDriver(id, driverId);

      toast.success("Driver Assigned");

      router.push(`/admin/parcels/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Assignment failed");
    }
  };

  return (
    <div className="max-w-xl rounded-xl bg-white p-8 shadow">
      <h1 className="mb-6 text-2xl font-bold">Assign Driver</h1>

      <select
        value={driverId}
        onChange={(e) => setDriverId(e.target.value)}
        className="mb-6 w-full rounded border p-3"
      >
        <option value="">Select Driver</option>

        {drivers.map((driver) => (
          <option key={driver._id} value={driver._id}>
            {driver.name}
          </option>
        ))}
      </select>

      <button
        onClick={handleAssign}
        className="rounded bg-blue-600 px-6 py-3 text-white"
      >
        Assign Driver
      </button>
    </div>
  );
}
