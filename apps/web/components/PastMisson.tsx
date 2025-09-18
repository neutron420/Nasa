"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowUpRight, FiCalendar, FiZap, FiCheckCircle, FiImage } from 'react-icons/fi';

// Define types for the NASA Launch Library API response
interface Mission {
  id: string;
  name: string;
  description: string;
  launch_date: string;
  status: {
    name: string;
    description: string;
  };
  image: string;
  agency: {
    name: string;
    country_code: string;
  };
  rocket: {
    configuration: {
      name: string;
    };
  };
  mission_type: string;
  // Additional fields for better image handling
  mission_patch?: string;
  mission_patch_small?: string;
  infographic?: string;
}

interface LaunchLibraryResponse {
  results: Mission[];
  count: number;
  next: string | null;
  previous: string | null;
}

// A reusable card component to display individual mission details with improved design
interface MissionCardProps {
  mission: Mission;
  index: number;
}

function MissionCard({ mission, index }: MissionCardProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'bg-green-500/10 border-green-500/30 text-green-300';
      case 'failure':
        return 'bg-red-500/10 border-red-500/30 text-red-300';
      case 'partial failure':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300';
      case 'in flight':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-300';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-300';
    }
  };

  return (
    <div 
      className="animate-fadeInUp w-full max-w-sm bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl transform hover:-translate-y-3 hover:scale-105 transition-all duration-500 ease-out group relative"
      style={{ animationDelay: `${index * 150}ms`, opacity: 0 }}
    >
      {/* Gradient overlay for better visual appeal */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
      
      <div className="relative p-6">
        <div className="flex justify-between items-start mb-5">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <p className="text-sm text-gray-400 font-medium">NASA Mission</p>
            </div>
            <h3 className="text-xl font-bold text-white mt-1 line-clamp-2 group-hover:text-cyan-300 transition-colors duration-300">
              {mission.name}
            </h3>
          </div>
          <div className={`${getStatusColor(mission.status.name)} text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ml-3 shadow-lg`}>
            {mission.status.name.toUpperCase()}
          </div>
        </div>
        
        <p className="text-gray-300 text-sm line-clamp-3 mb-5 leading-relaxed">
          {mission.description || 'No description available for this mission.'}
        </p>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm bg-white/5 rounded-lg p-2">
            <div className="p-1.5 bg-cyan-500/20 rounded-lg">
              <FiCalendar className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <span className="text-gray-400 text-xs">Launch Date</span>
              <p className="text-white font-semibold">{formatDate(mission.launch_date)}</p>
            </div>
          </div>
          
          {mission.agency && (
            <div className="flex items-center gap-3 text-sm bg-white/5 rounded-lg p-2">
              <div className="p-1.5 bg-green-500/20 rounded-lg">
                <FiCheckCircle className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <span className="text-gray-400 text-xs">Agency</span>
                <p className="text-white font-semibold">{mission.agency.name}</p>
              </div>
            </div>
          )}
          
          {mission.rocket?.configuration && (
            <div className="flex items-center gap-3 text-sm bg-white/5 rounded-lg p-2">
              <div className="p-1.5 bg-orange-500/20 rounded-lg">
                <FiZap className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <span className="text-gray-400 text-xs">Rocket</span>
                <p className="text-white font-semibold">{mission.rocket.configuration.name}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t border-white/10 pt-4 flex justify-between items-center">
          <div className="flex-1">
            <p className="text-xs text-gray-400 mb-1">Mission Type</p>
            <p className="font-semibold text-sm bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {mission.mission_type || 'Unknown'}
            </p>
          </div>
          <a
            href={mission.id.startsWith('fallback') ? '#' : `https://ll.thespacedevs.com/2.2.0/launch/${mission.id}/`}
            target={mission.id.startsWith('fallback') ? '_self' : '_blank'}
            rel="noopener noreferrer"
            className="flex items-center text-sm text-sky-400 hover:text-sky-300 transition-all duration-300 hover:scale-110 bg-sky-500/10 hover:bg-sky-500/20 px-3 py-2 rounded-lg"
          >
            Details <FiArrowUpRight className="ml-1 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

// This is the main component that will fetch and display the mission data.
export default function PastMissions() {
  // State to store the list of missions from the API
  const [missions, setMissions] = useState<Mission[]>([]);
  // State to manage the loading status while fetching data
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // State to store any potential errors during the API call
  const [error, setError] = useState<string | null>(null);

  // useEffect hook runs once when the component mounts to fetch the data
  useEffect(() => {
    const fetchMissions = async () => {
      try {
        console.log('🚀 Starting to fetch NASA missions...');
        
        // Try multiple approaches to get mission data
        let missionsData: Mission[] = [];
        
        // First, try with CORS proxy
        try {
          const proxyUrl = 'https://api.allorigins.win/raw?url=';
          const apiUrl = encodeURIComponent('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?search=nasa&limit=6&ordering=-net');
          const response = await fetch(proxyUrl + apiUrl);
          
          if (response.ok) {
            const data: LaunchLibraryResponse = await response.json();
            console.log('🎯 Missions received via proxy:', data.results?.length || 0);
            
            if (data.results && data.results.length > 0) {
              missionsData = data.results.filter(mission => 
                mission.agency?.name?.toLowerCase().includes('nasa') ||
                mission.name?.toLowerCase().includes('nasa')
              );
            }
          }
        } catch {
          console.log('⚠️ Proxy method failed, trying direct API...');
        }
        
        // If proxy failed, try direct API (might work in some environments)
        if (missionsData.length === 0) {
          try {
            const directUrl = 'https://ll.thespacedevs.com/2.2.0/launch/upcoming/?search=nasa&limit=6&ordering=-net';
            const response = await fetch(directUrl);
            
            if (response.ok) {
              const data: LaunchLibraryResponse = await response.json();
              console.log('🎯 Missions received via direct API:', data.results?.length || 0);
              
              if (data.results && data.results.length > 0) {
                missionsData = data.results.filter(mission => 
                  mission.agency?.name?.toLowerCase().includes('nasa') ||
                  mission.name?.toLowerCase().includes('nasa')
                );
              }
            }
          } catch {
            console.log('⚠️ Direct API also failed, using fallback data...');
          }
        }
        
        // If all API methods fail, use fallback data
        if (missionsData.length === 0) {
          console.log('📋 Using fallback mission data...');
          missionsData = [
            {
              id: 'fallback-1',
              name: 'Artemis II',
              description: 'The first crewed mission of NASA\'s Orion spacecraft, launching on the Space Launch System rocket. This mission will carry astronauts around the Moon and back to Earth.',
              launch_date: '2025-09-01T00:00:00Z',
              status: { name: 'Upcoming', description: 'Mission is scheduled' },
              image: '',
              agency: { name: 'NASA', country_code: 'US' },
              rocket: { configuration: { name: 'Space Launch System' } },
              mission_type: 'Crewed Lunar Mission'
            },
            {
              id: 'fallback-2',
              name: 'Europa Clipper',
              description: 'A mission to investigate Jupiter\'s moon Europa to determine if it has conditions suitable for life. The spacecraft will perform detailed reconnaissance of Europa\'s ice shell and subsurface ocean.',
              launch_date: '2024-10-10T00:00:00Z',
              status: { name: 'Success', description: 'Mission completed successfully' },
              image: '',
              agency: { name: 'NASA', country_code: 'US' },
              rocket: { configuration: { name: 'Falcon Heavy' } },
              mission_type: 'Planetary Science'
            },
            {
              id: 'fallback-3',
              name: 'James Webb Space Telescope',
              description: 'The most powerful space telescope ever built, designed to study the universe in infrared light. It will help scientists understand the formation of stars, planets, and galaxies.',
              launch_date: '2021-12-25T00:00:00Z',
              status: { name: 'Success', description: 'Mission operational' },
              image: '',
              agency: { name: 'NASA', country_code: 'US' },
              rocket: { configuration: { name: 'Ariane 5' } },
              mission_type: 'Space Telescope'
            }
          ];
        }
        
        // Take up to 3 missions for display
        const displayMissions = missionsData.slice(0, 3);
        console.log('✅ Final missions to display:', displayMissions.length);
        
        setMissions(displayMissions);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
        console.error('💥 Error fetching missions:', e);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMissions();
  }, []);

  if (isLoading) {
    return (
      <section className="bg-black text-white py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              NASA Missions
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Latest and upcoming NASA space missions and launches
            </p>
          </div>
          
          <div className="flex items-center justify-center p-20">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-400/20 border-t-cyan-400 mx-auto mb-4"></div>
                <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-purple-400 animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <p className="text-xl text-white font-medium mb-2">Loading NASA Mission Data...</p>
              <p className="text-gray-400">Fetching the latest space missions</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 text-red-400">
        <p>Error: Could not fetch mission data. {error}</p>
        <p className="mt-4 text-sm text-gray-500">Check the browser console for detailed logs.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (missions.length === 0 && !isLoading) {
    return (
      <div className="text-center p-10 text-yellow-400">
        <p>No NASA missions found.</p>
        <p className="mt-2 text-sm text-gray-500">This might be due to:</p>
        <ul className="mt-2 text-sm text-gray-400 text-left max-w-md mx-auto">
          <li>• API rate limiting</li>
          <li>• No NASA missions available</li>
          <li>• Network connectivity issues</li>
          <li>• API service temporarily unavailable</li>
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
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 px-4 py-2 rounded-full border border-cyan-500/30 mb-6">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-cyan-400 text-sm font-medium">Live Mission Data</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
            NASA Missions
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Explore the latest and upcoming NASA space missions, launches, and groundbreaking discoveries from the final frontier.
          </p>
        </div>

        {/* Mission cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {missions.length > 0 ? (
            missions.map((mission, index) => (
              <MissionCard key={`${mission.id}-${index}`} mission={mission} index={index} />
            ))
          ) : (
            <div className="col-span-full text-center">
              <div className="bg-gray-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiZap className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400 text-lg">No missions available</p>
                <p className="text-gray-500 text-sm mt-2">Check back later for updates</p>
              </div>
            </div>
          )}
        </div>

        {/* Button to redirect to the missions page */}
        <div className="mt-16 text-center">
          <Link
            href="/missions"
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
          </Link>
        </div>
      </div>
    </section>
  );
}