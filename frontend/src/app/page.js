import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-5xl font-bold">Smart Courier Management System</h1>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded-lg bg-blue-600 px-6 py-3 text-white"
        >
          Login
        </Link>

        <Link
          href="/register"
          className="rounded-lg bg-green-600 px-6 py-3 text-white"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
