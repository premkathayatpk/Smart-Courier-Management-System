"use client";

import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";

export default function Home() {
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-5">
      <h1 className="text-3xl font-bold">Redux Working</h1>

      <p>{auth.isAuthenticated ? "Logged In" : "Logged Out"}</p>

      <button
        onClick={() => dispatch(loginSuccess("demo-token"))}
        className="rounded bg-blue-600 px-5 py-2 text-white"
      >
        Login
      </button>
    </div>
  );
}
