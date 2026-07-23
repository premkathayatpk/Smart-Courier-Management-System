"use client";

export default function ParcelSearch({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search Tracking Number..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border p-3 outline-none"
    />
  );
}
