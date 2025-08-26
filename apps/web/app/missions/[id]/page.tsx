"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

interface Mission {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  imageUrl?: string;
}

export default function MissionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMission = async () => {
      setLoading(true);
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

        const allMissions: Mission[] = [
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

        const foundMission = allMissions.find((m) => m.id.toString() === id);
        setMission(foundMission || null);
      } catch (err) {
        console.error(err);
        setMission(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMission();
  }, [id]);

  if (loading)
    return (
      <div className="text-center py-24 text-gray-400 text-lg">Loading...</div>
    );

  if (!mission)
    return (
      <div className="text-center py-24">
        <p className="text-xl mb-4">Mission not found.</p>
        <button
          className="mt-4 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          onClick={() => router.push("/missions")}
        >
          Back to Missions
        </button>
      </div>
    );

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <main className="pt-24 px-6 md:px-12 max-w-4xl mx-auto space-y-6">
        {/* Mission Title */}
        <h1 className="text-5xl font-bold mb-2">{mission.title}</h1>

        {/* Mission Meta */}
        <div className="flex flex-wrap items-center gap-4 text-gray-400">
          <span>
            Started on:{" "}
            <strong>{new Date(mission.date).toLocaleDateString()}</strong>
          </span>
          <span className="px-2 py-1 text-xs font-bold rounded-full bg-blue-500/20 text-blue-300">
            {mission.category}
          </span>
        </div>

        {/* Mission Image */}
        {mission.imageUrl && (
          <div className="mt-6 shadow-lg rounded-xl overflow-hidden">
            <img
              src={mission.imageUrl}
              alt={mission.title}
              className="w-full object-cover rounded-xl"
            />
          </div>
        )}

        {/* Mission Description */}
        <div className="mt-6 text-gray-300 leading-relaxed text-lg">
          {mission.description}
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            onClick={() => router.push("/missions")}
          >
            Back to Missions
          </button>
        </div>
      </main>
    </div>
  );
}
