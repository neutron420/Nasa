"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";


// Define interfaces for our data models
interface Mission {
  id: number;
  title: string;
  description: string;
  launchDate: string;
  status: string;
  imageUrl: string | null;
  createdBy: number;
  createdAt: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  startDate: string;
  status: string;
  imageUrl: string | null;
  createdBy: number;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("missions");
  const [missions, setMissions] = useState<Mission[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Form states for new mission/project
  const [showMissionForm, setShowMissionForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newMission, setNewMission] = useState({
    title: "",
    description: "",
    launchDate: "",
    status: "Planned",
    imageUrl: ""
  });
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    startDate: "",
    status: "Planned",
    imageUrl: ""
  });

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          router.push("/auth/signin");
          return;
        }
        
        // Verify token by decoding it
        const tokenData = JSON.parse(atob(token?.split(".")[1] || ""));
        
        if (tokenData.role !== "ADMIN") {
          router.push("/auth/signin");
          return;
        }
        
        setIsAuthenticated(true);
        
        // Fetch missions and projects
        await fetchMissions();
        await fetchProjects();
      } catch (err) {
        console.error("Authentication error:", err);
        router.push("/auth/signin");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  // Fetch missions from API
  const fetchMissions = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_URL}/missions`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch missions");
      }
      
      const data = await response.json();
      setMissions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_URL}/projects`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Handle mission creation
  const handleCreateMission = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const token = localStorage.getItem("token");
      
      // Create payload that matches backend expectations
      const missionPayload = {
        title: newMission.title,
        description: newMission.description,
        launchDate: new Date(newMission.launchDate).toISOString(),
        status: newMission.status,
        imageUrl: newMission.imageUrl || null
      };
      
      const response = await fetch(`${API_URL}/missions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(missionPayload)
      });
      
      if (!response.ok) {
        throw new Error("Failed to create mission");
      }
      
      // Refresh missions list
      await fetchMissions();
      setShowMissionForm(false);
      setNewMission({
        title: "",
        description: "",
        launchDate: "",
        status: "Planned",
        imageUrl: ""
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Handle project creation
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const token = localStorage.getItem("token");
      
      // Create payload that matches backend expectations
      const projectPayload = {
        title: newProject.title,
        description: newProject.description,
        startDate: new Date(newProject.startDate).toISOString(),
        status: newProject.status,
        imageUrl: newProject.imageUrl || null
      };
      
      const response = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(projectPayload)
      });
      
      if (!response.ok) {
        throw new Error("Failed to create project");
      }
      
      // Refresh projects list
      await fetchProjects();
      setShowProjectForm(false);
      setNewProject({
        title: "",
        description: "",
        startDate: "",
        status: "Planned",
        imageUrl: ""
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Handle mission deletion
  const handleDeleteMission = async (id: number) => {
    if (!confirm("Are you sure you want to delete this mission?")) return;
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_URL}/missions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete mission");
      }
      
      // Refresh missions list
      await fetchMissions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Handle project deletion
  const handleDeleteProject = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete project");
      }
      
      // Refresh projects list
      await fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-black min-h-screen">
        <Navbar />
        <div className="pt-24 text-center py-32">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-6"></div>
          <div className="text-white text-xl">Authenticating...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      
      <main className="pt-24 px-4 md:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Admin Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-400">Manage missions and projects</p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <button 
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/auth/signin");
                }}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors duration-300"
              >
                Sign Out
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-8">
            <button
              className={`px-6 py-3 font-medium text-lg ${activeTab === "missions" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"}`}
              onClick={() => setActiveTab("missions")}
            >
              Missions
            </button>
            <button
              className={`px-6 py-3 font-medium text-lg ${activeTab === "projects" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"}`}
              onClick={() => setActiveTab("projects")}
            >
              Projects
            </button>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
              <button 
                className="ml-2 text-red-300 hover:text-white"
                onClick={() => setError(null)}
              >
                ×
              </button>
            </div>
          )}
          
          {/* Missions Tab */}
          {activeTab === "missions" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Missions List</h2>
                <button
                  onClick={() => setShowMissionForm(!showMissionForm)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2"
                >
                  {showMissionForm ? "Cancel" : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add Mission
                    </>
                  )}
                </button>
              </div>
              
              {/* New Mission Form */}
              {showMissionForm && (
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8">
                  <h3 className="text-xl font-semibold mb-4">Create New Mission</h3>
                  <form onSubmit={handleCreateMission}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={newMission.title}
                          onChange={(e) => setNewMission({...newMission, title: e.target.value})}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Launch Date
                        </label>
                        <input
                          type="date"
                          value={newMission.launchDate}
                          onChange={(e) => setNewMission({...newMission, launchDate: e.target.value})}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Status
                        </label>
                        <select
                          value={newMission.status}
                          onChange={(e) => setNewMission({...newMission, status: e.target.value})}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white"
                        >
                          <option value="Planned">Planned</option>
                          <option value="Active">Active</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Image URL
                        </label>
                        <input
                          type="text"
                          value={newMission.imageUrl}
                          onChange={(e) => setNewMission({...newMission, imageUrl: e.target.value})}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Description
                        </label>
                        <textarea
                          value={newMission.description}
                          onChange={(e) => setNewMission({...newMission, description: e.target.value})}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white h-32"
                          required
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-300"
                      >
                        Create Mission
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Missions Table */}
              <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-800">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Launch Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {missions.length > 0 ? (
                        missions.map((mission) => (
                          <tr key={mission.id} className="hover:bg-gray-800/50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {mission.imageUrl && (
                                  <div className="flex-shrink-0 h-10 w-10 mr-3">
                                    <img 
                                      src={mission.imageUrl} 
                                      alt={mission.title} 
                                      className="h-10 w-10 rounded-full object-cover"
                                    />
                                  </div>
                                )}
                                <div>
                                  <div className="text-sm font-medium">{mission.title}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {new Date(mission.launchDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                mission.status === "Completed" ? "bg-green-100 text-green-800" :
                                mission.status === "Active" ? "bg-blue-100 text-blue-800" :
                                "bg-yellow-100 text-yellow-800"
                              }`}>
                                {mission.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                className="text-blue-400 hover:text-blue-300 mr-4"
                                onClick={() => {
                                  // Edit functionality would go here
                                  alert("Edit functionality to be implemented");
                                }}
                              >
                                Edit
                              </button>
                              <button 
                                className="text-red-400 hover:text-red-300"
                                onClick={() => handleDeleteMission(mission.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                            No missions found. Create your first mission!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Projects List</h2>
                <button
                  onClick={() => setShowProjectForm(!showProjectForm)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2"
                >
                  {showProjectForm ? "Cancel" : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add Project
                    </>
                  )}
                </button>
              </div>
              
              {/* New Project Form */}
              {showProjectForm && (
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8">
                  <h3 className="text-xl font-semibold mb-4">Create New Project</h3>
                  <form onSubmit={handleCreateProject}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={newProject.title}
                          onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={newProject.startDate}
                          onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Status
                        </label>
                        <select
                          value={newProject.status}
                          onChange={(e) => setNewProject({...newProject, status: e.target.value})}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white"
                        >
                          <option value="Planned">Planned</option>
                          <option value="Active">Active</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Image URL
                        </label>
                        <input
                          type="text"
                          value={newProject.imageUrl}
                          onChange={(e) => setNewProject({...newProject, imageUrl: e.target.value})}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Description
                        </label>
                        <textarea
                          value={newProject.description}
                          onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white h-32"
                          required
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-300"
                      >
                        Create Project
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Projects Table */}
              <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-800">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Start Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {projects.length > 0 ? (
                        projects.map((project) => (
                          <tr key={project.id} className="hover:bg-gray-800/50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {project.imageUrl && (
                                  <div className="flex-shrink-0 h-10 w-10 mr-3">
                                    <img 
                                      src={project.imageUrl} 
                                      alt={project.title} 
                                      className="h-10 w-10 rounded-full object-cover"
                                    />
                                  </div>
                                )}
                                <div>
                                  <div className="text-sm font-medium">{project.title}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {new Date(project.startDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                project.status === "Completed" ? "bg-green-100 text-green-800" :
                                project.status === "Active" ? "bg-blue-100 text-blue-800" :
                                "bg-yellow-100 text-yellow-800"
                              }`}>
                                {project.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                className="text-blue-400 hover:text-blue-300 mr-4"
                                onClick={() => {
                                  // Edit functionality would go here
                                  alert("Edit functionality to be implemented");
                                }}
                              >
                                Edit
                              </button>
                              <button 
                                className="text-red-400 hover:text-red-300"
                                onClick={() => handleDeleteProject(project.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                            No projects found. Create your first project!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}