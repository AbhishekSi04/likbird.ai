"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Login failed");
      router.push("/dashboard");
    } catch (e: any) {
      setError(e?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Log in</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="space-y-1">
          <label className="text-sm">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button disabled={loading} className="w-full rounded bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50">
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
      <div className="mt-3 text-center text-sm">
        No account? <Link href="/register" className="text-primary">Register</Link>
      </div>
    </div>
  );
}


