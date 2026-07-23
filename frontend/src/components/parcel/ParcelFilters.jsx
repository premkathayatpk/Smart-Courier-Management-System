"use client";

export default function ParcelFilters({ status, setStatus }) {
  return (
    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      className="rounded-lg border p-3"
    >
      <option value="">All Status</option>
      <option value="Pending">Pending</option>
      <option value="Assigned">Assigned</option>
      <option value="Picked Up">Picked Up</option>
      <option value="In Transit">In Transit</option>
      <option value="Delivered">Delivered</option>
      <option value="Cancelled">Cancelled</option>
    </select>
  );
}
