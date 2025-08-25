"use client";
import React from "react";

// Define the props for the component
type SelfHostedPlayerProps = {
  videoSrc: string; // The path to the video in your /public folder
  title: string;    // A title to display above the video
};

const SelfHostedPlayer: React.FC<SelfHostedPlayerProps> = ({ videoSrc, title }) => {
  return (
    <section className="w-full max-w-5xl mx-auto py-24 px-4">
      <h2 className="text-4xl font-bold text-center text-white mb-10">
        {title}
      </h2>
      <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/20">
        <video
          className="w-full h-full"
          src={videoSrc}
          loop
          playsInline // Important for mobile devices
          controls // Shows the default video controls for play, pause, volume, etc.
        />
      </div>
    </section>
  );
};

export default SelfHostedPlayer;