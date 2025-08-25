"use client";

import React from "react";
import image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl p-2 z-50 flex justify-between items-center bg-black/40 backdrop-blur-xl rounded-full border border-white/20 shadow-lg">
      <div className="pl-2">
        <a href="#">
          <img src="/nasaa.png" alt="NASA Logo" className="h-8 w-auto" />
        </a>
      </div>
      <div className="hidden md:flex items-center space-x-2 text-sm text-gray-300">
        <a
          href="#"
          className="hover:bg-white/10 hover:text-white transition-all duration-300 px-4 py-2 rounded-full"
        >
          Missions
        </a>
        <a
          href="#"
          className="hover:bg-white/10 hover:text-white transition-all duration-300 px-4 py-2 rounded-full"
        >
          Projects
        </a>
        <a
          href="#"
          className="hover:bg-white/10 hover:text-white transition-all duration-300 px-4 py-2 rounded-full"
        >
          Admin
        </a>
      </div>
      <div className="hidden md:flex items-center space-x-2">
        <button className="text-gray-300 hover:text-white transition-colors px-4 py-2 text-sm">
          Login
        </button>
        <button className="bg-white text-black font-semibold px-5 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors">
          Sign Up
        </button>
      </div>
    </nav>
  );
}