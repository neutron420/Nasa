"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAdminPopup, setShowAdminPopup] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleAdminPopup = () => setShowAdminPopup(!showAdminPopup);
  
  const handleAdminSignIn = () => {
    router.push("/auth/signin");
    setShowAdminPopup(false);
    if (isMenuOpen) setIsMenuOpen(false);
  };

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
          <button
            onClick={toggleAdminPopup}
            className="hover:bg-white/10 hover:text-white transition-all duration-300 px-4 py-2 rounded-full text-sm text-gray-300"
          >
            Admin
          </button>
        </div>

        {/* Desktop Sign In Button */}
        <div className="hidden md:flex items-center">
          <a 
            href="/auth/signin"
            className="group flex items-center justify-center gap-2 bg-white text-black font-semibold px-5 py-2 rounded-full text-sm shadow-md hover:bg-gray-200 hover:shadow-lg transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          >
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
          </a>
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
              <button
                onClick={toggleAdminPopup}
                className="block w-full text-left text-white hover:text-blue-400 hover:bg-white/10 transition-all duration-300 px-4 py-3 rounded-xl text-base font-medium"
              >
                Admin
              </button>
            </div>
            
            <div className="pt-4 border-t border-white/20">
              <a 
                href="/auth/signin"
                className="w-full bg-white text-black font-semibold px-6 py-3 rounded-xl text-base shadow-md hover:bg-gray-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Sign in as Admin
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Sign In Popup */}
      {showAdminPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={toggleAdminPopup}
          ></div>
          
          <div className="relative bg-black border border-gray-800 rounded-2xl p-6 w-[90%] max-w-md shadow-2xl animate-fadeIn">
            <button 
              onClick={toggleAdminPopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              aria-label="Close popup"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
              <p className="text-gray-400">Sign in to access admin controls</p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={handleAdminSignIn}
                className="w-full bg-white text-black font-semibold px-6 py-3 rounded-xl text-base shadow-md hover:bg-gray-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center gap-2"
              >
                <span>Continue to Sign In</span>
                <svg
                  className="w-4 h-4"
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
              
              <p className="text-center text-xs text-gray-500 mt-4">
                Only authorized personnel can access admin features
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
