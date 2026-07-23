"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/authService";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      const res = await registerUser(form);

      console.log(res.data);

      toast.success("Registration Successful");

      router.replace("/login");
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message || err.message || "Registration Failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-xl bg-white p-8 shadow"
        >
          <h1 className="mb-6 text-center text-3xl font-bold">Register</h1>

          <input
            className="mb-4 w-full rounded border p-3"
            type="text"
            name="name"
            placeholder="Full Name"
            required
            onChange={handleChange}
          />

          <input
            className="mb-4 w-full rounded border p-3"
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
          />

          <input
            className="mb-4 w-full rounded border p-3"
            type="tel"
            name="phone"
            placeholder="Phone Number"
            required
            onChange={handleChange}
          />

          <input
            className="mb-6 w-full rounded border p-3"
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
          />

          <button
            className="w-full rounded bg-blue-600 py-3 text-white disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </>
  );
}
