"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

interface Mission {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  imageUrl?: string;
  mediaType?: string;
  source: 'apod' | 'rover' | 'hubble' | 'jwst';
}

export default function MissionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMission = async () => {
      setLoading(true);
      const apiKey = "pdtag40NLaH9jCvTaTWWBv37BuyGEZo3ou2M0OIl";
      
      try {
        let allMissions: Mission[] = [];

        // 1. Fetch APOD data (30 days of content)
        const apodRes = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=2024-11-15&end_date=2024-12-15`
        );
        
        if (apodRes.ok) {
          const apodData = await apodRes.json();
          const apodMissions: Mission[] = apodData.map((item: any, idx: number) => ({
            id: `apod-${item.date}-${idx}`,
            title: item.title,
            description: item.explanation || "A stunning astronomical observation captured by NASA.",
            date: item.date,
            category: item.media_type === 'video' ? 'VIDEO' : 'ASTRONOMY',
            imageUrl: item.media_type === 'image' ? item.url : undefined,
            mediaType: item.media_type,
            source: 'apod' as const
          }));
          
          allMissions = [...allMissions, ...apodMissions];
        }

        // 2. Fetch Mars rover data
        const rovers = [
          { name: 'curiosity', sols: [1000, 1500, 2000, 2500, 3000], maxPhotos: 8 },
          { name: 'perseverance', sols: [100, 200, 300, 400, 500, 600], maxPhotos: 8 },
          { name: 'opportunity', sols: [1000, 2000, 3000, 4000, 5000], maxPhotos: 6 },
          { name: 'spirit', sols: [500, 1000, 1500, 2000], maxPhotos: 5 }
        ];
        
        for (const rover of rovers) {
          for (const sol of rover.sols) {
            try {
              const roverRes = await fetch(
                `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover.name}/photos?sol=${sol}&page=1&api_key=${apiKey}`
              );
              
              if (roverRes.ok) {
                const roverData = await roverRes.json();
                const limitedPhotos = roverData.photos?.slice(0, rover.maxPhotos) || [];
                
                const roverMissions: Mission[] = limitedPhotos.map((photo: any) => ({
                  id: `${rover.name}-${photo.sol}-${photo.id}`,
                  title: `${rover.name.charAt(0).toUpperCase() + rover.name.slice(1)} - Sol ${photo.sol}`,
                  description: `High-resolution photograph captured by the ${rover.name.charAt(0).toUpperCase() + rover.name.slice(1)} rover on Sol ${photo.sol} using the ${photo.camera.full_name}. This image provides valuable scientific data about Mars' geological composition and surface features during the ongoing exploration mission.`,
                  date: photo.earth_date,
                  category: rover.name.toUpperCase(),
                  imageUrl: photo.img_src,
                  mediaType: 'image',
                  source: 'rover' as const
                }));
                
                allMissions = [...allMissions, ...roverMissions];
              }
              
              await new Promise(resolve => setTimeout(resolve, 100));
              
            } catch (roverError) {
              console.error(`Error fetching ${rover.name} Sol ${sol}:`, roverError);
            }
          }
        }

        // 3. Add historical NASA missions
        const historicalMissions = [
          {
            id: "apollo11-1969",
            title: "Apollo 11 - First Moon Landing",
            description: "Historic mission that first landed humans on the Moon. Neil Armstrong and Buzz Aldrin became the first humans to walk on the lunar surface on July 20, 1969.",
            date: "1969-07-20",
            category: "APOLLO",
            source: 'apod' as const
          },
          {
            id: "voyager1-1977",
            title: "Voyager 1 Launch",
            description: "Launched to study the outer Solar System and beyond. Now the most distant human-made object from Earth, traveling through interstellar space.",
            date: "1977-09-05",
            category: "DEEP_SPACE",
            source: 'apod' as const
          },
          {
            id: "hubble-1990",
            title: "Hubble Space Telescope Deployment",
            description: "The Hubble Space Telescope was deployed, revolutionizing our understanding of the universe with unprecedented images of distant galaxies.",
            date: "1990-04-24",
            category: "TELESCOPE",
            source: 'hubble' as const
          },
          {
            id: "iss-1998",
            title: "International Space Station Assembly Begins",
            description: "The first components of the International Space Station were launched, beginning humanity's permanent presence in space.",
            date: "1998-11-20",
            category: "ISS",
            source: 'apod' as const
          },
          {
            id: "jwst-2021",
            title: "James Webb Space Telescope Launch",
            description: "The most powerful space telescope ever built was launched, designed to observe the most distant objects in the universe.",
            date: "2021-12-25",
            category: "JWST",
            source: 'jwst' as const
          },
          {
            id: "artemis1-2022",
            title: "Artemis I Mission",
            description: "Uncrewed test flight of the Orion spacecraft around the Moon, paving the way for future crewed lunar missions.",
            date: "2022-11-16",
            category: "ARTEMIS",
            source: 'apod' as const
          }
        ];
        
        allMissions = [...allMissions, ...historicalMissions];

        // Find the specific mission by ID
        const foundMission = allMissions.find(m => m.id === id);
        setMission(foundMission || null);

      } catch (err) {
        console.error('Error fetching mission details:', err);
        setError(err instanceof Error ? err.message : "Failed to fetch mission details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMission();
    }
  }, [id]);

  const getStatusFromMission = (mission: Mission) => {
    const today = new Date();
    const missionDate = new Date(mission.date);
    const daysDiff = (today.getTime() - missionDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (missionDate > today) return "Upcoming";
    else if (daysDiff <= 30 && (mission.source === 'rover' || mission.source === 'jwst')) return "Active";
    else if (daysDiff <= 365 && mission.source === 'apod') return "Recent";
    else return "Completed";
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen">
        <Navbar />
        <div className="pt-24 text-center py-32">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-6"></div>
          <div className="text-white text-xl">Loading mission details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen">
        <Navbar />
        <div className="pt-24 text-center py-32">
          <div className="text-6xl mb-6">⚠️</div>
          <div className="text-red-400 text-2xl font-bold mb-4">Error Loading Mission</div>
          <div className="text-gray-300 mb-6">{error}</div>
          <button 
            onClick={() => router.push("/missions")}
            className="px-6 py-3 bg-black hover:bg-gray-900 text-white border border-white rounded-lg font-semibold transition-colors duration-300"
          >
            Back to Missions
          </button>
        </div>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="bg-black min-h-screen">
        <Navbar />
        <div className="pt-24 text-center py-32">
          <div className="text-6xl mb-6">🔍</div>
          <div className="text-white text-2xl font-bold mb-4">Mission Not Found</div>
          <div className="text-gray-300 mb-6">The mission you're looking for doesn't exist.</div>
          <button 
            onClick={() => router.push("/missions")}
            className="px-6 py-3 bg-black hover:bg-gray-900 text-white border border-white rounded-lg font-semibold transition-colors duration-300"
          >
            Back to Missions
          </button>
        </div>
      </div>
    );
  }

  const status = getStatusFromMission(mission);
  const statusColors: { [key: string]: string } = {
    Upcoming: "bg-yellow-900 text-yellow-200 border border-yellow-600",
    Active: "bg-green-900 text-green-200 border border-green-600",
    Recent: "bg-blue-900 text-blue-200 border border-blue-600",
    Completed: "bg-gray-700 text-gray-200 border border-gray-500"
  };

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      
      <main className="pt-24 px-4 md:px-8 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <button
              onClick={() => router.push("/missions")}
              className="flex items-center text-gray-300 hover:text-white transition-colors duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Missions
            </button>
          </div>

          {/* Mission Content */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
            {/* Mission Image */}
            {mission.imageUrl && mission.mediaType !== 'video' && (
              <div className="w-full h-96 overflow-hidden">
                <img
                  src={mission.imageUrl}
                  alt={mission.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className="p-8">
              {/* Mission Header */}
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="text-gray-300 text-lg">
                    {new Date(mission.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[status]}`}>
                    {status}
                  </span>
                </div>

                <h1 className="text-4xl font-bold text-white mb-4">
                  {mission.title}
                </h1>
              </div>

              {/* Mission Details */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3">Mission Description</h2>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {mission.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-3">Mission Details</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-gray-300">Date:</span>
                        <span className="ml-2 text-gray-400">
                          {new Date(mission.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-300">Category:</span>
                        <span className="ml-2 text-gray-400">{mission.category.replace('_', ' ')}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-300">Source:</span>
                        <span className="ml-2 text-gray-400">
                          {mission.source === 'apod' ? 'Astronomy Picture of the Day' :
                           mission.source === 'rover' ? 'Mars Rover' :
                           mission.source === 'hubble' ? 'Hubble Space Telescope' :
                           'James Webb Space Telescope'}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-300">Status:</span>
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${statusColors[status]}`}>
                          {status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-3">Mission Classification</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 text-sm font-medium bg-blue-900 text-blue-200 border border-blue-600 rounded-full">
                        {mission.category.replace('_', ' ')}
                      </span>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full border ${
                        mission.source === 'apod' ? 'bg-purple-900 text-purple-200 border-purple-600' :
                        mission.source === 'rover' ? 'bg-red-900 text-red-200 border-red-600' :
                        mission.source === 'hubble' ? 'bg-yellow-900 text-yellow-200 border-yellow-600' :
                        'bg-cyan-900 text-cyan-200 border-cyan-600'
                      }`}>
                        {mission.source === 'apod' ? 'Astronomy' :
                         mission.source === 'rover' ? 'Mars Exploration' :
                         mission.source === 'hubble' ? 'Hubble' :
                         'James Webb'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Actions */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <button
                  onClick={() => router.push("/missions")}
                  className="px-6 py-3 bg-black hover:bg-gray-900 text-white border border-white rounded-lg font-semibold transition-colors duration-300"
                >
                  View All Missions
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}