"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

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

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300 ease-in-out flex flex-col cursor-pointer">
      {project.imageUrl && (
        <div className="relative h-56 w-full overflow-hidden">
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
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-sm text-gray-400">Year: {project.year}</p>
        <h3 className="text-xl font-bold text-white mt-2">{project.title}</h3>
        <p className="text-gray-300 mt-3 text-sm flex-grow line-clamp-3">
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-800/20 text-gray-300">
            {project.category}
          </span>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[project.status]}`}
          >
            {project.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 12;

  useEffect(() => {
    const fetchProjects = async () => {
      const apiKey = "pdtag40NLaH9jCvTaTWWBv37BuyGEZo3ou2M0OIl";
      try {
        // Fixed date range for consistent projects
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

        setProjects(formatted);
        setFilteredProjects(formatted);
        setCategories(Array.from(new Set(formatted.map((p) => p.category))));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter
  useEffect(() => {
    setCurrentPage(1);
    setFilteredProjects(
      selectedCategory === "All"
        ? projects
        : projects.filter((p) => p.category === selectedCategory)
    );
  }, [selectedCategory, projects]);

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  return (
    <div className="relative bg-black text-white min-h-screen">
      <Navbar />
      <main className="pt-24 px-6 md:px-12 lg:px-24">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
            NASA Projects
          </h1>
          <p className="text-base sm:text-lg text-gray-300 mt-4 max-w-4xl mx-auto">
            Explore NASA's big projects and missions by year and category.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-10 flex-wrap gap-3">
          <button
            className={`px-4 py-2 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 ${
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
              className={`px-4 py-2 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 ${
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
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
            <div className="text-gray-400 text-xl">Loading projects...</div>
          </div>
        ) : error ? (
          <div className="text-center py-24 text-red-400 text-xl">{error}</div>
        ) : currentProjects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <ProjectCard project={project} />
                </Link>
              ))}
            </div>

            <div className="flex justify-center items-center gap-6 mt-12 mb-24">
              <button
                className="px-5 py-2 bg-gray-800 text-white rounded disabled:opacity-50 transition"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-gray-300 text-lg">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="px-5 py-2 bg-gray-800 text-white rounded disabled:opacity-50 transition"
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
            No projects found in this category.
          </div>
        )}
      </main>
    </div>
  );
}
