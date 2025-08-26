"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useParams, useRouter } from "next/navigation";

interface Project {
  id: number;
  title: string;
  description: string;
  year: number;
  status: "Ongoing" | "Completed";
  category: string;
  imageUrl?: string;
}

const statusColors: { [key in Project["status"]]: string } = {
  Ongoing: "bg-blue-500/20 text-blue-300",
  Completed: "bg-green-500/20 text-green-300",
};

export default function ProjectDetailPage() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      const apiKey = "pdtag40NLaH9jCvTaTWWBv37BuyGEZo3ou2M0OIl";
      try {
        const res = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=2025-01-01&end_date=2025-01-20`
        );
        const data = await res.json();

        const formatted: Project[] = data
          .map((item: any, idx: number) => ({
            id: idx + 1,
            title: item.title,
            description: item.explanation,
            year: new Date(item.date).getFullYear(),
            status:
              new Date(item.date) > new Date() ? "Ongoing" : "Completed",
            category: "NASA",
            imageUrl: item.url,
          }))
          .sort(
            (a: { year: string | number | Date; }, b: { year: string | number | Date; }) =>
              new Date(b.year).getTime() - new Date(a.year).getTime()
          );

        const foundProject = formatted.find((p) => p.id === Number(id));
        if (!foundProject) throw new Error("Project not found");
        setProject(foundProject);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading)
    return (
      <div className="text-center py-24 text-gray-400 text-xl">Loading...</div>
    );
  if (error)
    return (
      <div className="text-center py-24 text-red-400 text-xl">{error}</div>
    );
  if (!project) return null;

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <main className="pt-24 px-6 md:px-12 lg:px-24 max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
        <div className="flex flex-wrap gap-4 mb-6">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-800/20 text-gray-300">
            {project.category}
          </span>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[project.status]}`}
          >
            {project.status}
          </span>
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-800/20 text-gray-300">
            Year: {project.year}
          </span>
        </div>
        {project.imageUrl && (
          <div className="relative w-full h-96 mb-6 overflow-hidden rounded-xl">
            <img
              src={project.imageUrl}
              alt={project.title}
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
        <p className="text-gray-300 text-lg">{project.description}</p>
      </main>
    </div>
  );
}
