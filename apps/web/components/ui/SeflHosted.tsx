"use client";
import React from "react";
import YouTube, { YouTubeProps } from "react-youtube"; // Import YouTubeProps for typing

// You'll need to install this package first:
// npm install react-youtube

// Define the props for the component
type VideoPlayerProps = {
  videoId: string; // The ID of the YouTube video
  title: string;   // A title to display above the video
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, title }) => {
  // Function to handle errors from the YouTube player
  const onError: YouTubeProps['onError'] = (event) => {
    console.error("YouTube Player Error:", event.data);
    // Common error codes:
    // 2 – The request contains an invalid parameter value.
    // 5 – The requested content cannot be played in an HTML5 player.
    // 100 – The video requested was not found.
    // 101 or 150 – The owner of the requested video does not allow it to be played in embedded players.
  };

  // Options for the YouTube player
  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      controls: 1,
    },
  };

  return (
    <section className="w-full max-w-5xl mx-auto py-24 px-4">
      <h2 className="text-4xl font-bold text-center text-white mb-10">
        {title}
      </h2>
      <div 
        className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/20" 
        style={{ paddingTop: '56.25%' }} // This maintains a 16:9 aspect ratio
      >
        <YouTube
          videoId={videoId}
          opts={opts}
          onError={onError} // Add the error handler here
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
    </section>
  );
};
export default VideoPlayer;