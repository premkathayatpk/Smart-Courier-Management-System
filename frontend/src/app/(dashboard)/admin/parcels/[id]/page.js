"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { getParcelById } from "@/services/parcelService";

import ParcelDetails from "@/components/parcel/ParcelDetails";
import UpdateStatusCard from "@/components/parcel/UpdateStatusCard";
import ParcelTimeline from "@/components/parcel/ParcelTimeline";

export default function ParcelDetailPage() {
  const { id } = useParams();

  const [parcel, setParcel] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadParcel() {
      try {
        const res = await getParcelById(id);

        setParcel(res.data.data);
      } finally {
        setLoading(false);
      }
    }

    loadParcel();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Parcel Details</h1>

      <ParcelDetails parcel={parcel} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ParcelDetails parcel={parcel} />

        <UpdateStatusCard parcelId={parcel._id} currentStatus={parcel.status} />
      </div>

      <ParcelTimeline history={parcel.statusHistory} />

      <ParcelTimeline history={parcel.statusHistory || []} />
    </div>
  );
}
