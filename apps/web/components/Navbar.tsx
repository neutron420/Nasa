"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Main Navbar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl p-2 z-50 flex justify-between items-center bg-black/40 backdrop-blur-xl rounded-full border border-white/20 shadow-lg">
        {/* Logo */}
        <div className="pl-2">
          <Link href="/apps">
            <Image src="/nasaa.png" alt="NASA Logo" className="h-6 sm:h-8 w-auto" width={32} height={32} />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2 text-sm text-gray-300">
          <Link
            href="/"
            className="hover:bg-white/10 hover:text-white transition-all duration-300 px-4 py-2 rounded-full"
          >
            Home
          </Link>
          <Link
            href="/missions"
            className="hover:bg-white/10 hover:text-white transition-all duration-300 px-4 py-2 rounded-full"
          >
            Missions
          </Link>
          <a
            href="/projects"
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

        {/* Desktop Sign In Button */}
        <div className="hidden md:flex items-center">
          <button className="group flex items-center justify-center gap-2 bg-white text-black font-semibold px-5 py-2 rounded-full text-sm shadow-md hover:bg-gray-200 hover:shadow-lg transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
            <span>Sign in as Admin</span>
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <button className="bg-white text-black font-semibold px-3 py-1.5 rounded-full text-xs shadow-md hover:bg-gray-200 transition-all duration-300">
            Sign In
          </button>
          
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-5 flex flex-col justify-center items-center">
              <div className={`w-4 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-0.5' : 'mb-1'}`}></div>
              <div className={`w-4 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-4 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-0.5' : 'mt-1'}`}></div>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={toggleMenu}
        ></div>
        
        <div className={`absolute top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-black/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl transition-all duration-300 ${isMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Link
                href="/apps"
                className="block text-white hover:text-blue-400 hover:bg-white/10 transition-all duration-300 px-4 py-3 rounded-xl text-base font-medium"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                href="/apps/missions"
                className="block text-white hover:text-blue-400 hover:bg-white/10 transition-all duration-300 px-4 py-3 rounded-xl text-base font-medium"
                onClick={toggleMenu}
              >
                Missions
              </Link>
              <a
                href="#"
                className="block text-white hover:text-blue-400 hover:bg-white/10 transition-all duration-300 px-4 py-3 rounded-xl text-base font-medium"
                onClick={toggleMenu}
              >
                Projects
              </a>
              <a
                href="#"
                className="block text-white hover:text-blue-400 hover:bg-white/10 transition-all duration-300 px-4 py-3 rounded-xl text-base font-medium"
                onClick={toggleMenu}
              >
                Admin
              </a>
            </div>
            
            <div className="pt-4 border-t border-white/20">
              <button className="w-full bg-white text-black font-semibold px-6 py-3 rounded-xl text-base shadow-md hover:bg-gray-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400">
                Sign in as Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
