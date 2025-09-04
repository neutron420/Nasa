"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

export default function AdminSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [category] = useState("admin");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Updated API endpoint - using environment variable or default to port 3000
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign in");
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("adminCategory", category);

      // Check if user is admin before redirecting
      const tokenData = JSON.parse(atob(data.token.split(".")[1]));
      if (tokenData.role !== "ADMIN") {
        throw new Error("Not authorized as admin");
      }

      // Redirect based on fixed category
      router.push(`/${category}`);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex flex-col">
      <Navbar />

      {/* centered with margin-top */}
      <div className="flex-1 flex items-center justify-center px-4 mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="backdrop-blur-lg bg-black/40 rounded-3xl p-8 shadow-2xl border border-gray-800/50">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                Admin Portal
              </h1>
              <p className="text-gray-400 mt-2">Access mission control</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Fixed Admin Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Admin Category
                </label>
                <input
                  type="text"
                  id="category"
                  value="Admin"
                  disabled
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl py-3 px-4 text-gray-400 cursor-not-allowed"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 disabled:opacity-50 shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Authenticating...
                  </div>
                ) : (
                  "Access Control Center"
                )}
              </motion.button>
            </form>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center justify-center w-full">
                <hr className="w-full h-px my-8 bg-gray-700/30 border-0" />
                <span className="absolute px-3 text-xs font-medium text-gray-400 -translate-x-1/2 bg-black/90 left-1/2">
                  SECURE CONNECTION
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
