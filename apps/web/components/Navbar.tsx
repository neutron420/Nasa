"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAdminPopup, setShowAdminPopup] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const { state, logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleAdminPopup = () => setShowAdminPopup(!showAdminPopup);
  const toggleUserMenu = () => setShowUserMenu(!showUserMenu);
  
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

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center relative">
          {state.user ? (
            /* User is logged in - show profile */
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="group flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <div className="bg-blue-600/30 p-1.5 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="font-medium">{state.user.name}</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* User dropdown menu */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-black/90 backdrop-blur-xl border border-gray-700 rounded-xl shadow-2xl z-50"
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-700">
                        <div className="bg-blue-600/30 p-2 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-medium">{state.user.name}</p>
                          <p className="text-gray-400 text-sm">{state.user.email}</p>
                          <span className="inline-block bg-blue-600/20 text-blue-300 text-xs px-2 py-0.5 rounded-full mt-1">
                            {state.user.role}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Link
                          href="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="block text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          Admin Dashboard
                        </Link>
                        
                        <button
                          onClick={() => {
                            router.push('/admin?tab=settings');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Profile Settings
                        </button>
                        
                        <hr className="border-gray-700 my-2" />
                        
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                            router.push('/');
                          }}
                          className="w-full text-left text-red-400 hover:text-red-300 hover:bg-red-900/20 px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* User is not logged in - show sign in button */
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
          )}
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
