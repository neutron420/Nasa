// apps/web/app/missions/page.tsx - ENHANCED VERSION WITH 100+ MISSIONS

"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

interface Mission {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  imageUrl?: string;
  mediaType?: string;
  source: 'apod' | 'rover' | 'hubble' | 'jwst' | 'admin';
}

// NASA Mission Statistics Component
const NASAStats = ({ totalMissions }: { totalMissions: number }) => {
  return (
    <div className="bg-black/80 border border-gray-700 rounded-3xl p-8 mb-12 max-w-6xl mx-auto shadow-xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">NASA Mission Legacy</h2>
        <p className="text-gray-300 text-lg">Since 1958, NASA has conducted thousands of missions</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="text-center p-6 bg-gray-900 rounded-2xl border border-gray-800 shadow-lg">
          <div className="text-4xl font-bold text-white mb-2">{totalMissions}</div>
          <div className="text-gray-300 font-medium">Current Display</div>
          <div className="text-xs text-gray-500 mt-1">Live Data</div>
        </div>
        
        <div className="text-center p-6 bg-gray-900 rounded-2xl border border-gray-800 shadow-lg">
          <div className="text-4xl font-bold text-white mb-2">800+</div>
          <div className="text-gray-300 font-medium">Total Missions</div>
          <div className="text-xs text-gray-500 mt-1">Since 1958</div>
        </div>
        
        <div className="text-center p-6 bg-gray-900 rounded-2xl border border-gray-800 shadow-lg">
          <div className="text-4xl font-bold text-white mb-2">135</div>
          <div className="text-gray-300 font-medium">Shuttle Missions</div>
          <div className="text-xs text-gray-500 mt-1">1981-2011</div>
        </div>
        
        <div className="text-center p-6 bg-gray-900 rounded-2xl border border-gray-800 shadow-lg">
          <div className="text-4xl font-bold text-white mb-2">80+</div>
          <div className="text-gray-300 font-medium">Active Missions</div>
          <div className="text-xs text-gray-500 mt-1">Currently Operating</div>
        </div>
        
        <div className="text-center p-6 bg-gray-900 rounded-2xl border border-gray-800 shadow-lg">
          <div className="text-4xl font-bold text-white mb-2">12</div>
          <div className="text-gray-300 font-medium">Moon Landings</div>
          <div className="text-xs text-gray-500 mt-1">Apollo Program</div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-gray-400 text-sm">
        <p className="mb-2">Major Programs: Mercury • Gemini • Apollo • Space Shuttle • ISS • Artemis</p>
        <p>Space Telescopes: Hubble • James Webb • Spitzer • Kepler</p>
        <p className="mt-2 text-white">Mars Rovers: Spirit • Opportunity • Curiosity • Perseverance • Ingenuity</p>
      </div>
    </div>
  );
};

// Helper function to determine mission status
const getMissionStatus = (mission: Mission) => {
  const today = new Date();
  const missionDate = new Date(mission.date);
  const daysDiff = (today.getTime() - missionDate.getTime()) / (1000 * 60 * 60 * 24);
  
  if (missionDate > today) return "Upcoming";
  else if (daysDiff <= 30 && (mission.source === 'rover' || mission.source === 'jwst')) return "Active";
  else if (daysDiff <= 365 && mission.source === 'apod') return "Recent";
  else return "Completed";
};

const MissionCard: React.FC<{ mission: Mission }> = ({ mission }) => {
  const status = getMissionStatus(mission);
  const statusColors: { [key: string]: string } = {
    Upcoming: "bg-gray-800 text-white border-gray-700",
    Active: "bg-gray-800 text-white border-gray-700",
    Recent: "bg-gray-800 text-white border-gray-700",
    Completed: "bg-gray-800 text-white border-gray-700",
  };

  const shouldShowImage = mission.imageUrl && mission.mediaType !== 'video';

  return (
    <div className="group bg-black border border-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col cursor-pointer">
      {/* Image Section */}
      {shouldShowImage ? (
        <div className="relative h-56 w-full overflow-hidden">
          <img
            src={mission.imageUrl}
            alt={mission.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        </div>
      ) : mission.mediaType === 'video' ? (
        <div className="relative h-56 w-full bg-gray-900 flex items-center justify-center">
          <div className="text-center text-gray-300">
            <div className="text-5xl mb-3 opacity-60">🎬</div>
            <div className="text-sm font-medium">Video Content</div>
          </div>
        </div>
      ) : (
        <div className="relative h-56 w-full bg-gray-900 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-5xl mb-3 opacity-40">🚀</div>
            <div className="text-sm font-medium">Mission Data</div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Date and Status */}
        <div className="flex justify-between items-start mb-3">
          <p className="text-sm text-gray-400 font-medium">
            {new Date(mission.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${statusColors[status]}`}>
            {status}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-gray-300 transition-colors duration-300">
          {mission.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm flex-grow line-clamp-3 leading-relaxed">
          {mission.description.length > 140 
            ? `${mission.description.substring(0, 140)}...` 
            : mission.description
          }
        </p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-800 text-white border border-gray-700">
            {mission.category}
          </span>
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-800 text-white border border-gray-700">
            {mission.source === 'apod' ? 'ASTRONOMY' : 
             mission.source === 'rover' ? 'MARS' : 
             mission.source === 'hubble' ? 'HUBBLE' : 
             mission.source === 'jwst' ? 'JWST' : 'ADMIN'}
          </span>
        </div>

        {/* Hover Effect Indicator */}
        <div className="mt-4 flex items-center text-sm text-gray-400 group-hover:text-white transition-colors duration-300">
          <span className="mr-2">View Details</span>
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [filteredMissions, setFilteredMissions] = useState<Mission[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchProgress, setFetchProgress] = useState<string>("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const missionsPerPage = 15; // Increased per page

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        setFetchProgress("Fetching missions from database...");
        
        // Fetch missions from your backend API
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
        const response = await fetch(`${API_URL}/missions`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch missions: ${response.status}`);
        }
        
        const backendMissions = await response.json();
        
        // Transform backend data to match expected format
        const transformedMissions: Mission[] = backendMissions.map((mission: any) => ({
          id: mission.id.toString(),
          title: mission.title,
          description: mission.description,
          date: mission.launchDate || mission.createdAt,
          category: mission.status || 'Mission',
          imageUrl: mission.imageUrl,
          mediaType: 'image',
          source: 'admin' as const
        }));
        
        setMissions(transformedMissions);
        setFilteredMissions(transformedMissions);
        
        // Get unique categories
        const uniqueCategories = Array.from(new Set(transformedMissions.map(m => m.category)));
        setCategories(uniqueCategories);
        
        setFetchProgress("");
        
        // If no missions from backend, fallback to NASA API data
        if (transformedMissions.length === 0) {
          await fetchNASAData();
        }
        
      } catch (error) {
        console.error('Error fetching missions:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch missions');
        
        // Fallback to NASA API data
        await fetchNASAData();
      } finally {
        setLoading(false);
      }
    };
    
    const fetchNASAData = async () => {
      const apiKey = "pdtag40NLaH9jCvTaTWWBv37BuyGEZo3ou2M0OIl";
      let allMissions: Mission[] = [];
      
      try {
        setFetchProgress("Fetching NASA APOD data as fallback...");
        console.log("🔭 Fetching APOD data...");
        
        const apodRes = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=2024-11-15&end_date=2024-12-15`
        );
        
        if (apodRes.ok) {
          const apodData = await apodRes.json();
          console.log(`📸 APOD: ${apodData.length} items fetched`);
          
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

        // 2. Fetch Mars rover data (comprehensive)
        setFetchProgress("Fetching Mars Rover missions...");
        console.log("🚁 Fetching Mars rover data...");
        
        const rovers = [
          { name: 'curiosity', sols: [1000, 1500, 2000, 2500, 3000], maxPhotos: 8 },
          { name: 'perseverance', sols: [100, 200, 300, 400, 500, 600], maxPhotos: 8 },
          { name: 'opportunity', sols: [1000, 2000, 3000, 4000, 5000], maxPhotos: 6 },
          { name: 'spirit', sols: [500, 1000, 1500, 2000], maxPhotos: 5 }
        ];
        
        for (const rover of rovers) {
          console.log(` Fetching ${rover.name} data...`);
          
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
                console.log(`✅ Added ${roverMissions.length} photos from ${rover.name} Sol ${sol}`);
              }
              
              // Small delay to prevent rate limiting
              await new Promise(resolve => setTimeout(resolve, 100));
              
            } catch (roverError) {
              console.error(`❌ Error fetching ${rover.name} Sol ${sol}:`, roverError);
            }
          }
        }

        // 3. Add some historical NASA missions (simulated data for demonstration)
        setFetchProgress("Adding historical NASA missions...");
        console.log("📚 Adding historical missions...");
        
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

        // Remove duplicates and sort by date
        const uniqueMissions = allMissions.filter((mission, index, self) => 
          index === self.findIndex(m => m.id === mission.id)
        );
        
        uniqueMissions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        console.log(`🎯 Total unique missions: ${uniqueMissions.length}`);
        setFetchProgress(`Successfully loaded ${uniqueMissions.length} missions!`);
        
        setMissions(uniqueMissions);
        setFilteredMissions(uniqueMissions);
        
        const uniqueCategories = Array.from(new Set(uniqueMissions.map((m) => m.category)))
          .sort();
        setCategories(uniqueCategories);
        
      } catch (err) {
        console.error('💥 Error fetching missions:', err);
        setError(err instanceof Error ? err.message : "Failed to fetch missions");
      } finally {
        setLoading(false);
        setFetchProgress("");
      }
    };

    fetchMissions();
  }, []);

  // Filter missions
  useEffect(() => {
    setCurrentPage(1);
    if (selectedCategory === "All") {
      setFilteredMissions(missions);
    } else {
      setFilteredMissions(
        missions.filter((m) => m.category === selectedCategory)
      );
    }
  }, [selectedCategory, missions]);

  const indexOfLastMission = currentPage * missionsPerPage;
  const indexOfFirstMission = indexOfLastMission - missionsPerPage;
  const currentMissions = filteredMissions.slice(
    indexOfFirstMission,
    indexOfLastMission
  );
  const totalPages = Math.ceil(filteredMissions.length / missionsPerPage);

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen">
        <Navbar />
        <div className="pt-24 text-center py-32">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-6"></div>
          <div className="text-gray-400 text-2xl font-medium mb-4">Loading NASA missions...</div>
          <div className="text-blue-400 text-lg mb-2">{fetchProgress}</div>
          <div className="text-gray-500 text-sm">Fetching data from multiple NASA APIs </div>
          <div className="mt-4 text-xs text-gray-600">
            This may take a moment as we gather comprehensive mission data...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black text-white min-h-screen">
        <Navbar />
        <div className="pt-24 text-center py-32">
          <div className="text-6xl mb-6">🛸</div>
          <div className="text-red-400 text-2xl font-bold mb-4">Houston, we have a problem!</div>
          <div className="text-gray-400 mb-6">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors duration-300"
          >
            🔄 Retry Mission
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-black text-white min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 md:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            NASA Missions
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Explore the cosmos through NASA's incredible journey of discovery, from Mars exploration to deep space astronomy
          </p>
        </div>

        {/* NASA Statistics */}
        <NASAStats totalMissions={missions.length} />

        {/* Category Filter */}
        <div className="flex justify-center mb-12 flex-wrap gap-3 px-4">
          <button
            className={`px-6 py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 ${
              selectedCategory === "All"
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25"
                : "bg-gray-800/80 backdrop-blur-md text-gray-300 hover:bg-gray-700 border border-white/10"
            }`}
            onClick={() => setSelectedCategory("All")}
          >
            All Missions ({missions.length})
          </button>
          {categories.map((cat) => {
            const categoryCount = missions.filter(m => m.category === cat).length;
            return (
              <button
                key={cat}
                className={`px-6 py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25"
                    : "bg-gray-800/80 backdrop-blur-md text-gray-300 hover:bg-gray-700 border border-white/10"
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.replace('_', ' ')} ({categoryCount})
              </button>
            );
          })}
        </div>
      </section>

      {/* Missions Grid */}
      <main className="px-4 md:px-8 pb-16">
        {currentMissions.length > 0 ? (
          <>
            <div className="text-center mb-8">
              <p className="text-gray-400">
                Showing {indexOfFirstMission + 1}-{Math.min(indexOfLastMission, filteredMissions.length)} of {filteredMissions.length} missions
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
              {currentMissions.map((mission) => (
                <Link key={mission.id} href={`/missions/${mission.id}`}>
                  <MissionCard mission={mission} />
                </Link>
              ))}
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 flex-wrap">
                <button
                  className="px-6 py-3 bg-gray-800/80 backdrop-blur-md border border-white/10 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-all duration-300 font-semibold"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 7) {
                      pageNum = i + 1;
                    } else {
                      if (currentPage <= 4) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 3) {
                        pageNum = totalPages - 6 + i;
                      } else {
                        pageNum = currentPage - 3 + i;
                      }
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        className={`w-12 h-12 rounded-xl font-semibold transition-all duration-300 ${
                          currentPage === pageNum
                            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                            : "bg-gray-800/80 text-gray-300 hover:bg-gray-700 border border-white/10"
                        }`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  className="px-6 py-3 bg-gray-800/80 backdrop-blur-md border border-white/10 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-all duration-300 font-semibold"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-32">
            <div className="text-6xl mb-6">🔍</div>
            <div className="text-2xl font-bold text-gray-400 mb-4">No missions found</div>
            <div className="text-gray-500">Try selecting a different category</div>
          </div>
        )}
      </main>
    </div>
  );
}