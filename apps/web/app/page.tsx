"use client";
import React from "react";
import { SparklesCore } from "../components/ui/sparkles";
import Navbar from "../components/Navbar";
import Globe from "../components/ui/Globe";
import SelfHostedPlayer from "../components/ui/SelfHosted";
import PastMissions from "../components/PastMisson";

function SparklesPreview() {
  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden px-2 sm:px-4">
      <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-center text-white relative z-20 mb-4 sm:mb-8">
        NASA
      </h1>
      <div className="w-full max-w-[90%] sm:max-w-[40rem] h-24 xs:h-28 sm:h-32 md:h-40 relative">
        {/* Gradients - Enhanced mobile responsiveness */}
        <div className="absolute inset-x-2 xs:inset-x-4 sm:inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-2 xs:inset-x-4 sm:inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-4 xs:inset-x-8 sm:inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-2/3 xs:w-1/2 sm:w-1/4 blur-sm" />
        <div className="absolute inset-x-4 xs:inset-x-8 sm:inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-2/3 xs:w-1/2 sm:w-1/4" />

        {/* Core component - Optimized for mobile performance */}
        <SparklesCore
          background="transparent"
          minSize={0.3}
          maxSize={0.8}
          particleDensity={window.innerWidth < 768 ? 800 : 1200}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />

        {/* Radial Gradient - Better mobile scaling */}
        <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(200px_120px_at_top,transparent_20%,white)] xs:[mask-image:radial-gradient(250px_150px_at_top,transparent_20%,white)] sm:[mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>
      
      {/* Mobile scroll indicator */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center text-white/60">
          <span className="text-xs sm:text-sm mb-2 hidden sm:block">Scroll to explore</span>
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen">
      <Navbar />
      <SparklesPreview />
      
      {/* Enhanced mobile spacing and layout */}
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 space-y-8 sm:space-y-12 md:space-y-16">
        <div className="w-full">
          <Globe />
        </div>
        
        <div className="w-full">
          <SelfHostedPlayer
            videoSrc="/nasa.mp4"
            title="Explore the Universe with NASA"
          />
        </div>
        
        <div className="w-full">
          <PastMissions />
        </div>
      </div>
      
      {/* Mobile-friendly footer spacing */}
      <div className="h-8 sm:h-16"></div>
    </main>
  );
}