export default function StatsCard({ title, value, color }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h3 className="text-gray-500 text-sm">{title}</h3>

      <h1 className={`mt-2 text-3xl font-bold ${color}`}>{value}</h1>
    </div>
  );
}
