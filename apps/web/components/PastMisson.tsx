"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Define types for the NASA API response
interface Camera {
  id: number;
  name: string;
  full_name: string;
}

interface Rover {
  id: number;
  name: string;
  status: string;
}

interface Photo {
  id: number;
  img_src: string;
  earth_date: string;
  camera: Camera;
  rover: Rover;
}

interface NasaApiResponse {
  photos: Photo[];
}

// A reusable card component to display individual photo details with an improved design
interface MissionCardProps {
  photo: Photo;
  index: number;
}

function MissionCard({ photo, index }: MissionCardProps) {
  return (
    // Outer div for gradient border and glow effect
    <div 
      className="animate-fadeInUp group relative p-[2px] rounded-lg bg-gradient-to-br from-cyan-500/50 to-transparent transition-all duration-300 hover:from-cyan-500"
      style={{ animationDelay: `${index * 100}ms`, opacity: 0 }} // Staggered animation
    >
      {/* Inner div for the main card content with glassmorphism effect */}
      <div className="relative bg-black/80 backdrop-blur-lg rounded-md overflow-hidden h-full transform transition-transform duration-300 group-hover:-translate-y-1">
        {/* Mission Image */}
        <Image 
          src={photo.img_src} 
          alt={`Mars Rover photo taken by ${photo.camera.full_name} on ${photo.earth_date}`}
          width={600}
          height={400}
          className="w-full h-56 object-cover"
          onError={(e) => { 
            const target = e.target as HTMLImageElement;
            target.onerror = null; 
            target.src='https://placehold.co/600x400/000000/FFFFFF?text=Image+Not+Found'; 
          }}
        />
        
        {/* Card Content */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">{photo.camera.full_name}</h3>
          <p className="text-sm text-gray-400 mt-1">Earth Date: {photo.earth_date}</p>
          <div className="mt-4 border-t border-white/10 pt-3">
            <p className="text-xs font-medium text-gray-300">
              <span className="font-semibold text-gray-400">Rover:</span> {photo.rover.name}
            </p>
            <p className="text-xs font-medium text-gray-300">
              <span className="font-semibold text-gray-400">Status:</span> {photo.rover.status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// This is the main component that will fetch and display the mission data.
export default function PastMissions() {
  // State to store the list of photos from the API
  const [photos, setPhotos] = useState<Photo[]>([]);
  // State to manage the loading status while fetching data
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // State to store any potential errors during the API call
  const [error, setError] = useState<string | null>(null);

  // useEffect hook runs once when the component mounts to fetch the data
  useEffect(() => {
    const fetchMissionPhotos = async () => {
      // Your personal NASA API key has been added here.
      const apiKey = 'pdtag40NLaH9jCvTaTWWBv37BuyGEZo3ou2M0OIl'; 
      
      // Different Mars rovers to get variety
      const rovers = [
        { name: 'curiosity', sols: [1000, 1001, 1002] },
        { name: 'perseverance', sols: [100, 101, 102] },
        { name: 'opportunity', sols: [5000, 5001, 5002] },
        { name: 'spirit', sols: [2000, 2001, 2002] }
      ];
      
      let allPhotos: Photo[] = [];
      
      try {
        console.log('🔍 Starting to fetch NASA Mars photos from multiple rovers...');
        
        // Fetch photos from multiple rovers and sols
        for (const rover of rovers) {
          console.log(`🚀 Fetching from ${rover.name.toUpperCase()} rover...`);
          
          for (const sol of rover.sols) {
            const apiUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover.name}/photos?sol=${sol}&api_key=${apiKey}`;
            console.log(`📡 Fetching ${rover.name} sol ${sol}:`, apiUrl);
            
            const response = await fetch(apiUrl);
            console.log(`📊 Response status for ${rover.name} sol ${sol}:`, response.status);
            
            if (response.ok) {
              const data: NasaApiResponse = await response.json();
              console.log(`📸 Photos received for ${rover.name} sol ${sol}:`, data.photos?.length || 0);
              
              if (data.photos && data.photos.length > 0) {
                allPhotos = [...allPhotos, ...data.photos];
                console.log(`✅ Added ${data.photos.length} photos from ${rover.name} sol ${sol}`);
              } else {
                console.log(`⚠️ No photos found for ${rover.name} sol ${sol}`);
              }
            } else {
              console.log(`❌ Error fetching ${rover.name} sol ${sol}:`, response.status, response.statusText);
            }
          }
        }
        
        console.log(`🎯 Total photos collected from all rovers: ${allPhotos.length}`);
        
        if (allPhotos.length === 0) {
          // If no photos found, try to get latest photos from each rover
          console.log('🔄 No photos found from specified sols, trying latest photos from each rover...');
          
          for (const rover of rovers) {
            const latestUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover.name}/latest_photos?api_key=${apiKey}`;
            console.log(`📡 Fetching latest photos from ${rover.name}...`);
            
            const latestResponse = await fetch(latestUrl);
            if (latestResponse.ok) {
              const latestData = await latestResponse.json();
              console.log(`📸 Latest photos from ${rover.name}:`, latestData.latest_photos?.length || 0);
              if (latestData.latest_photos && latestData.latest_photos.length > 0) {
                allPhotos = [...allPhotos, ...latestData.latest_photos];
              }
            }
          }
        }
        
        // Shuffle the photos to get random variety
        const shuffledPhotos = allPhotos.sort(() => Math.random() - 0.5);
        console.log('🎲 Final photos to display:', shuffledPhotos.length);
        
        setPhotos(shuffledPhotos);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
        console.error('💥 Error fetching mission photos:', e);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMissionPhotos();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center p-10 text-white">
        <p>Loading Mission Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 text-red-400">
        <p>Error: Could not fetch mission data. {error}</p>
        <p className="mt-4 text-sm text-gray-500">Check the browser console for detailed logs.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (photos.length === 0 && !isLoading) {
    return (
      <div className="text-center p-10 text-yellow-400">
        <p>No photos found from NASA API.</p>
        <p className="mt-2 text-sm text-gray-500">This might be due to:</p>
        <ul className="mt-2 text-sm text-gray-400 text-left max-w-md mx-auto">
          <li>• API rate limiting</li>
          <li>• No photos available for the specified sols</li>
          <li>• Network connectivity issues</li>
          <li>• API key restrictions</li>
        </ul>
        <p className="mt-4 text-xs text-gray-600">Check browser console for detailed API logs.</p>
      </div>
    );
  }
  
  return (
    <section className="bg-black text-white py-20 px-4 md:px-8">
      {/* Style block for custom animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Multiple Mars Missions
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Images from Curiosity, Perseverance, Opportunity & Spirit Rovers
          </p>
        </div>

        {/* The grid now only maps over the first 3 items from the photos array */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {photos.length > 0 ? (
            (() => {
              // Get photos from different rovers to ensure variety
              const uniqueRoverPhotos = [];
              const seenRovers = new Set();
              
              for (const photo of photos) {
                if (!seenRovers.has(photo.rover.name) && uniqueRoverPhotos.length < 3) {
                  uniqueRoverPhotos.push(photo);
                  seenRovers.add(photo.rover.name);
                }
              }
              
              // If we don't have enough different rovers, add more photos
              if (uniqueRoverPhotos.length < 3) {
                for (const photo of photos) {
                  if (uniqueRoverPhotos.length < 3 && !uniqueRoverPhotos.find(p => p.id === photo.id)) {
                    uniqueRoverPhotos.push(photo);
                  }
                }
              }
              
              return uniqueRoverPhotos.slice(0, 3).map((photo, index) => (
                <MissionCard key={`${photo.rover.name}-${photo.id}-${index}`} photo={photo} index={index} />
              ));
            })()
          ) : (
            <p className="col-span-full text-center text-gray-500">No photos available for this sol.</p>
          )}
        </div>

        {/* Button to redirect to the missions page */}
        <div className="mt-16 text-center">
          <a
            href="/missions" // This link will take the user to the missions page
            className="group inline-flex items-center justify-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-full text-base shadow-md hover:bg-gray-200 hover:shadow-lg transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75"
          >
            <span>See All Missions</span>
            {/* Arrow Icon SVG */}
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
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
      </div>
    </section>
  );
}