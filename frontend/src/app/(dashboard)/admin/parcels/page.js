"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllParcels } from "@/services/parcelService";

import ParcelTable from "@/components/parcel/ParcelTable";
import ParcelSearch from "@/components/parcel/ParcelSearch";
import ParcelFilters from "@/components/parcel/ParcelFilters";

export default function AdminParcelsPage() {
  const [loading, setLoading] = useState(true);
  const [parcels, setParcels] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function loadParcels() {
      try {
        const res = await getAllParcels();

        setParcels(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadParcels();
  }, []);

  const filteredParcels = useMemo(() => {
    return parcels.filter((parcel) => {
      const matchesSearch = parcel.trackingNumber
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus = status === "" || parcel.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [parcels, search, status]);

  if (loading) {
    return <div className="p-8 text-center">Loading parcels...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">Parcel Management</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ParcelSearch value={search} onChange={setSearch} />

        <ParcelFilters status={status} setStatus={setStatus} />
      </div>

      <ParcelTable parcels={filteredParcels} />
    </div>
  );
}
