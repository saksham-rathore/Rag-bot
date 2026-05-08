"use client";
import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // NOTE: Replace this with your actual signup API call
      // const res = await fetch("/api/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ name, email, password }),
      // });

      // if (!res.ok) {
      //   const data = await res.json();
      //   throw new Error(data.message || "Something went wrong");
      // }

      // For now, redirect to signIn after successful mock signup
      router.push("/signIn");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] font-sans">
        <div className="text-amber-500 animate-pulse font-serif text-2xl">
          Loading...
        </div>
      </div>
    );
  }

  // If already signed in, redirect
  if (session) {
    router.push("/");
    return null;
  }

  // Sign up Form UI
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] font-sans relative overflow-hidden px-4 py-10">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#d97706]/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#d97706]/10 blur-[150px] rounded-full"></div>
      </div>

      {/* Header Logo */}
      <div className="flex items-center gap-3 mb-10 z-10">
        <div className="w-12 h-12 rounded-full bg-black border border-zinc-800 flex items-center justify-center shadow-lg">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fcd34d"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="text-white text-3xl font-serif tracking-wide font-bold">
          Lexora<span className="text-zinc-200">.AI</span>
        </span>
      </div>

      {/* Main Card */}
      <div
        className="bg-[#0f0f0f]/80 backdrop-blur-xl border border-zinc-800/80 rounded-[2rem] p-8 sm:p-12 w-full max-w-[480px] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none rounded-[2rem]"></div>

        <div className="relative z-10">
          <h1 className="text-white text-3xl font-serif font-bold text-center tracking-tight mb-2">
            Create an account
          </h1>
          <p className="text-[#a1a1aa] text-center text-[15px] mb-8 font-medium">
            Sign up to start your conversation with knowledge.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm text-center font-medium mb-6">
              {error}
            </div>
          )}

          {/* Social Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              type="button"
              className="flex-1 bg-[#141414] hover:bg-[#1f1f1f] border border-zinc-800 rounded-2xl py-3 px-4 flex items-center justify-center gap-2.5 text-[#e4e4e7] text-sm font-semibold transition-colors"
              onClick={() => signIn("google")}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex-1 bg-[#141414] hover:bg-[#1f1f1f] border border-zinc-800 rounded-2xl py-3 px-4 flex items-center justify-center gap-2.5 text-[#e4e4e7] text-sm font-semibold transition-colors"
              onClick={() => signIn("github")}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-zinc-700"></div>
            <span className="text-[#71717a] text-[11px] font-bold tracking-[0.15em] uppercase">
              Or with email
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-zinc-800 to-zinc-700"></div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2.5">
              <label
                htmlFor="name"
                className="text-[#a1a1aa] text-[11px] font-bold tracking-[0.1em] uppercase ml-1"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#121212] border border-zinc-800 rounded-[14px] py-3.5 pl-12 pr-4 text-[#e4e4e7] text-sm focus:outline-none focus:border-amber-500/40 focus:bg-[#181818] transition-all placeholder:text-zinc-600"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <label
                htmlFor="email"
                className="text-[#a1a1aa] text-[11px] font-bold tracking-[0.1em] uppercase ml-1"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#121212] border border-zinc-800 rounded-[14px] py-3.5 pl-12 pr-4 text-[#e4e4e7] text-sm focus:outline-none focus:border-amber-500/40 focus:bg-[#181818] transition-all placeholder:text-zinc-600"
                  placeholder="you@lexora.ai"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <label
                htmlFor="password"
                className="text-[#a1a1aa] text-[11px] font-bold tracking-[0.1em] uppercase ml-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#121212] border border-zinc-800 rounded-[14px] py-3.5 pl-12 pr-12 text-[#e4e4e7] text-sm focus:outline-none focus:border-amber-500/40 focus:bg-[#181818] transition-all placeholder:text-zinc-600"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#fde68a] via-[#fcd34d] to-[#f59e0b] hover:from-[#fef08a] hover:via-[#fde047] hover:to-[#fbbf24] text-black font-semibold rounded-2xl py-3.5 text-[15px] flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                <>
                  Sign up for Lexora
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer Text */}
          <div className="text-center mt-8">
            <span className="text-[#a1a1aa] text-sm">
              Already have an account?{" "}
            </span>
            <Link href="/signIn">
              <button
                type="button"
                className="text-[#fbbf24] hover:text-[#fcd34d] text-sm font-semibold transition-colors cursor-pointer"
              >
                Sign in
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Agreement */}
      <div className="mt-8 text-center z-10">
        <p className="text-[#71717a] text-xs font-medium">
          By signing up you agree to our Terms and Privacy.
        </p>
      </div>
    </div>
  );
}
