"use client";

import Link from "next/link";
import ParcelStatusBadge from "./ParcelStatusBadge";

export default function ParcelTable({ parcels }) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left">Tracking</th>
            <th className="p-4 text-left">Sender</th>
            <th className="p-4 text-left">Receiver</th>
            <th className="p-4 text-left">Price</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Driver</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {parcels.map((parcel) => (
            <tr key={parcel._id} className="border-b hover:bg-gray-50">
              <td className="p-4 font-medium">{parcel.trackingNumber}</td>

              <td className="p-4">{parcel.pickupContact?.name}</td>

              <td className="p-4">{parcel.deliveryContact?.name}</td>

              <td className="p-4">Rs. {parcel.price}</td>

              <td className="p-4">
                <ParcelStatusBadge status={parcel.status} />
              </td>

              <td className="p-4">{parcel.driver?.name || "-"}</td>

              <td className="p-4">
                <div className="flex gap-2">
                  <Link
                    href={`/admin/parcels/${parcel._id}`}
                    className="rounded bg-blue-500 px-3 py-1 text-white"
                  >
                    View
                  </Link>

                  <Link
                    href={`/admin/parcels/assign/${parcel._id}`}
                    className="rounded bg-green-500 px-3 py-1 text-white"
                  >
                    Assign
                  </Link>
                </div>
              </td>
            </tr>
          ))}

          {parcels.length === 0 && (
            <tr>
              <td colSpan={7} className="p-10 text-center text-gray-500">
                No parcels found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
