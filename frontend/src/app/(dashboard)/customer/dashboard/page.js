import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function CustomerDashboard() {
  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <div>
        <h1 className="text-3xl font-bold">Customer Dashboard</h1>
      </div>
    </ProtectedRoute>
  );
}
