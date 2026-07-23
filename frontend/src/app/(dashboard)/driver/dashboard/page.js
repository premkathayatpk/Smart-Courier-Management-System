import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DriverDashboard() {
  return (
    <ProtectedRoute allowedRoles={["driver"]}>
      <div>
        <h1 className="text-3xl font-bold">Driver Dashboard</h1>
      </div>
    </ProtectedRoute>
  );
}
