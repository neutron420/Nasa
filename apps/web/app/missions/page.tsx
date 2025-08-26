"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

interface Mission {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
  imageUrl?: string;
}

// Helper function to determine mission status
const getMissionStatus = (mission: Mission) => {
  const today = new Date();
  const missionDate = new Date(mission.date);
  if (missionDate > today) return "Upcoming";
  else if (missionDate <= today && missionDate.getFullYear() % 2 === 0)
    return "Ongoing";
  else return "Completed";
};

const MissionCard: React.FC<{ mission: Mission }> = ({ mission }) => {
  const status = getMissionStatus(mission);
  const statusColors: { [key: string]: string } = {
    Upcoming: "bg-yellow-500/20 text-yellow-400",
    Ongoing: "bg-blue-500/20 text-blue-300",
    Completed: "bg-green-500/20 text-green-300",
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300 ease-in-out flex flex-col cursor-pointer">
      {mission.imageUrl && (
        <div className="relative h-52 w-full overflow-hidden">
          <img
            src={mission.imageUrl}
            alt={mission.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src =
                "https://placehold.co/800x600/000000/FFFFFF?text=No+Image";
            }}
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-sm text-gray-400">
          Date: {new Date(mission.date).toLocaleDateString()}
        </p>
        <h3 className="text-xl font-bold text-white mt-2">{mission.title}</h3>
        <p className="text-gray-300 mt-3 text-sm flex-grow line-clamp-3">
          {mission.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <span className="px-2 py-1 text-xs font-bold rounded-full bg-blue-500/20 text-blue-300">
            {mission.category}
          </span>
          <span
            className={`px-2 py-1 text-xs font-bold rounded-full ${statusColors[status]}`}
          >
            {status}
          </span>
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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const missionsPerPage = 10;

  useEffect(() => {
    const fetchMissions = async () => {
      const apiKey = "pdtag40NLaH9jCvTaTWWBv37BuyGEZo3ou2M0OIl";
      try {
        const apodRes = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=10`
        );
        const apodData = await apodRes.json();

        const rovers = ["curiosity", "perseverance", "opportunity", "spirit"];
        let roverPhotos: any[] = [];

        for (const rover of rovers) {
          for (let sol = 100; sol <= 102; sol++) {
            const res = await fetch(
              `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${apiKey}`
            );
            const data = await res.json();
            if (data.photos) roverPhotos = [...roverPhotos, ...data.photos];
          }
        }

        const formatted: Mission[] = [
          ...apodData.map((item: any, idx: number) => ({
            id: 1000 + idx,
            title: item.title,
            description: item.explanation,
            date: item.date,
            category: "APOD",
            imageUrl: item.url,
          })),
          ...roverPhotos.map((photo: any, idx: number) => ({
            id: 2000 + idx,
            title: `${photo.rover.name} Rover - ${photo.camera.full_name}`,
            description: `Photo taken on sol ${photo.sol}`,
            date: photo.earth_date,
            category: photo.rover.name.toUpperCase(),
            imageUrl: photo.img_src,
          })),
        ];

        setMissions(formatted);
        setFilteredMissions(formatted);
        setCategories(Array.from(new Set(formatted.map((m) => m.category))));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch missions");
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  // Filter
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

  return (
    <div className="relative bg-black text-white min-h-screen">
      <Navbar />
      <main className="pt-24 px-4 md:px-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
            NASA Missions
          </h1>
          <p className="text-base sm:text-lg text-gray-300 mt-3 max-w-3xl mx-auto px-4">
            Explore NASA's projects and latest space images by category.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-8 flex-wrap gap-2 sm:gap-4 px-4">
          <button
            className={`px-3 sm:px-4 py-2 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 ${
              selectedCategory === "All"
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => setSelectedCategory("All")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-3 sm:px-4 py-2 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-24">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
            <div className="text-gray-400 text-xl">Loading missions...</div>
          </div>
        ) : error ? (
          <div className="text-center py-24 text-red-400 text-xl">{error}</div>
        ) : currentMissions.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto pb-8">
              {currentMissions.map((mission) => (
                <Link key={mission.id} href={`/missions/${mission.id}`}>
                  <MissionCard mission={mission} />
                </Link>
              ))}
            </div>

            <div className="flex justify-center gap-4 mb-24">
              <button
                className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-24 text-gray-400 text-xl">
            No missions found in this category.
          </div>
        )}
      </main>
    </div>
  );
}
