"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function SignIn() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Step 1: Call custom API route
      const apiRes = await fetch("/api/signIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await apiRes.json();
      if (!apiRes.ok) {
        setError(data.message || "Invalid email or password");
        return;
      }

      // Step 2: Create the NextAuth session
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/Dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    );
  }

  // Already signed in
  if (session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-neutral-100 px-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 w-full max-w-[420px] shadow-2xl flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl text-white font-bold shadow-lg shadow-indigo-500/20">
            {session.user?.email?.[0].toUpperCase() || "U"}
          </div>
          <div className="text-center">
            <h1 className="text-white text-2xl font-bold tracking-tight mb-1">Welcome Back</h1>
            <p className="text-neutral-400 text-sm">{session.user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/signIn" })}
            className="w-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 rounded-xl py-3 text-sm font-medium transition-all"
          >
            Sign out
          </button>
          <button
            onClick={() => router.push("/Dashboard")}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3 text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Sign in form
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-neutral-100 relative overflow-hidden px-4">
      {/* Background glow — matches Dashboard radial gradient */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <div className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            Lexora
          </div>
          <div className="text-xs text-indigo-400 font-medium">Enterprise RAG</div>
        </div>
      </div>

      {/* Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 sm:p-10 w-full max-w-[460px] shadow-2xl z-10">
        <h1 className="text-white text-2xl font-bold tracking-tight mb-1">Welcome back</h1>
        <p className="text-neutral-400 text-sm mb-8">Sign in to continue your conversation with knowledge.</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-medium mb-6">
            {error}
          </div>
        )}

        {/* Social buttons */}
        <div className="flex gap-3 mb-6">
          <button
            type="button"
            onClick={() => signIn("google")}
            className="flex-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 text-neutral-300 text-sm font-medium transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>
          <button
            type="button"
            onClick={() => signIn("github")}
            className="flex-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 text-neutral-300 text-sm font-medium transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-neutral-800" />
          <span className="text-neutral-600 text-xs font-semibold tracking-widest uppercase">or with email</span>
          <div className="h-px flex-1 bg-neutral-800" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-neutral-500 text-xs font-bold tracking-widest uppercase">
              Email
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 pl-10 pr-4 text-neutral-100 text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-neutral-800 transition-all placeholder:text-neutral-600"
                placeholder="you@lexora.ai"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-neutral-500 text-xs font-bold tracking-widest uppercase">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 pl-10 pr-11 text-neutral-100 text-sm focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-neutral-600"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition-colors"
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" x2="22" y1="2" y2="22" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div
                className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                  rememberMe ? "bg-indigo-600" : "bg-neutral-800 border border-neutral-700 group-hover:border-neutral-500"
                }`}
                onClick={() => setRememberMe(!rememberMe)}
              >
                {rememberMe && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="text-neutral-400 text-xs">Remember me</span>
            </label>
            <button type="button" className="text-neutral-500 hover:text-neutral-300 text-xs transition-colors">
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-600 text-white font-semibold rounded-xl py-3 text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20 disabled:cursor-not-allowed mt-1"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </>
            ) : (
              "Sign in to Lexora"
            )}
          </button>
        </form>

        <p className="text-center text-neutral-500 text-sm mt-6">
          New to Lexora?{" "}
          <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Create an account
          </Link>
        </p>
      </div>

      <p className="text-neutral-700 text-xs mt-6 z-10">By signing in you agree to our Terms and Privacy.</p>
    </div>
  );
}
