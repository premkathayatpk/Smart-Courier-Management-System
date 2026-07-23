"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import { loginSuccess } from "@/redux/slices/authSlice";
import { loginUser } from "@/services/authService";

import toast from "react-hot-toast";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
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
      const res = await loginUser(form);

      console.log(res.data);

      const user = res.data.data;

      dispatch(loginSuccess(user));

      toast.success("Login Successful");

      switch (user.role) {
        case "admin":
          router.replace("/admin/dashboard");
          break;

        case "driver":
          router.replace("/driver/dashboard");
          break;

        default:
          router.replace("/customer/dashboard");
      }
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.message || err.message || "Login Failed");
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
          <h1 className="mb-6 text-center text-3xl font-bold">Login</h1>

          <input
            className="mb-4 w-full rounded border p-3"
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            className="mb-6 w-full rounded border p-3"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <button
            className="w-full rounded bg-blue-600 py-3 text-white"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}
