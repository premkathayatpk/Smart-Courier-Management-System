export default function ParcelTimeline({ history = [] }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-6 text-xl font-bold">Status Timeline</h2>

      <div className="space-y-6">
        {history.map((item, index) => (
          <div key={index} className="border-l-2 border-blue-500 pl-4">
            <h3 className="font-semibold">{item.status}</h3>

            <p className="text-sm text-gray-500">
              {new Date(item.timestamp).toLocaleString()}
            </p>

            <p className="text-gray-600">{item.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
