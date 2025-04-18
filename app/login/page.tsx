"use client";

import type React from "react";

import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simple validation
    if (!email || !password) {
      setError("Vennligst fyll ut følgende felt");
      setIsLoading(false);
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden flex">
        {/* Left side - Login form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            {/* <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back</h1> */}
            <p className="text-gray-600">Velkommen</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-xs uppercase tracking-wide text-gray-500 mb-1"
              >
                Brukernavn{" "}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
                className="w-full p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs uppercase tracking-wide text-gray-500 mb-1"
              >
                Passord
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••"
                  className="w-full p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#e9a97e] hover:bg-[#e69c6b] text-white font-medium py-3 px-4 rounded-md flex items-center justify-center transition-colors"
            >
              {isLoading ? (
                <span className="animate-pulse">Vennligst vent...</span>
              ) : (
                <>
                  LOGG INN
                  <ArrowRight className="ml-2" size={18} />
                </>
              )}
            </button>

            {/* <div className="text-sm text-gray-500 text-center mt-4">
              <p>Demo credentials:</p>
              <p>Admin: admin@merhebia.com / admin123</p>
              <p>Seller: seller@merhebia.com / seller123</p>
            </div> */}
          </form>
        </div>

        {/* Right side - Image */}
        <div className="hidden md:block md:w-1/2 relative">
          <Image
            src="/images/logo-banner.png"
            alt="Merhebia car"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
