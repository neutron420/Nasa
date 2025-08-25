"use client";

import React from "react";

// You can install react-icons by running: npm install react-icons
import { FiArrowUpRight } from "react-icons/fi"; 

export default function RocketLaunchCard() {
  return (
    <div className="w-full max-w-sm bg-gray-900/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300 ease-in-out">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-400">Mission</p>
            <h3 className="text-2xl font-bold text-white mt-1">Artemis II</h3>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold px-3 py-1 rounded-full">
            UPCOMING
          </div>
        </div>
        <p className="text-gray-300 mt-4 text-sm">
          The first crewed mission of NASA's Orion spacecraft, launching on the
          Space Launch System rocket.
        </p>
        <div className="mt-6 border-t border-white/10 pt-4 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400">Launch Date</p>
            <p className="text-white font-semibold">September 2025</p>
          </div>
          <a
            href="#"
            className="flex items-center text-sm text-sky-400 hover:text-sky-300 transition-colors"
          >
            Details <FiArrowUpRight className="ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}