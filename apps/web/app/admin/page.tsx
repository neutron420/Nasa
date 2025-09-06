"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import AdminDashboard from "@/components/AdminDashboard";
import AdminSettings from "@/components/AdminSettings";
import AdminNotifications from "@/components/AdminNotifications";
// withAuth import removed as it's not being used
import { useAuth } from "@/contexts/AuthContext";

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timestamp: Date;
}

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

// Helper function for status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800";
    case "Active":
      return "bg-blue-100 text-blue-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    case "Planned":
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

function AdminPageComponent() {
// Router removed since it's not being used
  const searchParams = useSearchParams();
  const { state } = useAuth();
  
  // Get tab from URL params or default to dashboard
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || "dashboard");
  const [missions, setMissions] = useState<Mission[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Search states
  const [missionSearch, setMissionSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  
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

  // Handle tab from URL and initialize data
  useEffect(() => {
    // Handle tab from URL
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
    
    // Initial data fetch
    const initializeData = async () => {
      await fetchMissions();
      await fetchProjects();
      
      // Add welcome notification
      addNotification({
        type: "info",
        message: "Welcome to Admin Dashboard"
      });
    };
    
    initializeData();
  }, [tabParam]); // Remove other dependencies to avoid infinite loops

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
      addNotification({
        type: "error",
        message: "Failed to fetch missions"
      });
    }
  };

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
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
      addNotification({
        type: "error",
        message: "Failed to fetch projects"
      });
    }
  };

  // Handle mission creation
  const handleCreateMission = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
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
      
      // In handleCreateMission function, update this part:
      if (!response.ok) {
        throw new Error("Failed to create mission");
      }
      
      // Get the newly created mission
      const createdMission = await response.json();
      
      // Update missions list with the new mission
      setMissions(prevMissions => [...prevMissions, createdMission]);
      
      // Also fetch all missions to ensure we have the latest data
      await fetchMissions();
      
      setShowMissionForm(false);
      setNewMission({
        title: "",
        description: "",
        launchDate: "",
        status: "Planned",
        imageUrl: ""
      });

      addNotification({
        type: "success",
        message: "Mission created successfully"
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      addNotification({
        type: "error",
        message: "Failed to create mission"
      });
    }
  };

  // Handle project creation
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
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
      
      // In handleCreateProject function, update this part:
      if (!response.ok) {
        throw new Error("Failed to create project");
      }
      
      // Get the newly created project
      const createdProject = await response.json();
      
      // Update projects list with the new project
      setProjects(prevProjects => [...prevProjects, createdProject]);
      
      // Also fetch all projects to ensure we have the latest data
      await fetchProjects();
      
      setShowProjectForm(false);
      setNewProject({
        title: "",
        description: "",
        startDate: "",
        status: "Planned",
        imageUrl: ""
      });

      addNotification({
        type: "success",
        message: "Project created successfully"
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      addNotification({
        type: "error",
        message: "Failed to create project"
      });
    }
  };

  // Add these filtering functions before the return statement
  // Filter missions based on search term
  const filteredMissions = missions.filter(mission => 
    mission.title.toLowerCase().includes(missionSearch.toLowerCase()) ||
    mission.description.toLowerCase().includes(missionSearch.toLowerCase()) ||
    mission.status.toLowerCase().includes(missionSearch.toLowerCase())
  );
  
  // Filter projects based on search term
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
    project.description.toLowerCase().includes(projectSearch.toLowerCase()) ||
    project.status.toLowerCase().includes(projectSearch.toLowerCase())
  );

  // Handle mission deletion
  const handleDeleteMission = async (id: number) => {
    if (!confirm("Are you sure you want to delete this mission?")) return;
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
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
      addNotification({
        type: "success",
        message: "Mission deleted successfully"
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      addNotification({
        type: "error",
        message: "Failed to delete mission"
      });
    }
  };

  // Handle project deletion
  const handleDeleteProject = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
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
      addNotification({
        type: "success",
        message: "Project deleted successfully"
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      addNotification({
        type: "error",
        message: "Failed to delete project"
      });
    }
  };

  // Notification system
  const addNotification = ({ type, message }: { type: "success" | "error" | "info" | "warning", message: string }) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      dismissNotification(newNotification.id);
    }, 5000);
  };
  
  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Loading state
  if (state.loading) {
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
      
      {/* Admin Notifications */}
      <AdminNotifications 
        notifications={notifications}
        onDismiss={dismissNotification}
      />
      
      <div className="flex">
        {/* Admin Sidebar */}
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Main Content */}
        <main className="ml-64 pt-24 px-8 pb-16 w-full">
          <div className="max-w-6xl mx-auto">
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
            
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <AdminDashboard missions={missions} projects={projects} />
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
                
                {/* Search Bar for Missions - add this after the missions tab header */}
                <div className="mb-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search missions..."
                      value={missionSearch}
                      onChange={(e) => setMissionSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-700 bg-gray-800 rounded-lg w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
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
                            <option value="Cancelled">Cancelled</option>
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
                          type="button"
                          onClick={() => setShowMissionForm(false)}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg mr-2"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        >
                          Create Mission
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* Missions List */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-800/50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Launch Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {filteredMissions.length > 0 ? (
                        filteredMissions.map((mission) => (
                          <tr key={mission.id} className="hover:bg-gray-800/30">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {mission.imageUrl ? (
                                  <img src={mission.imageUrl} alt={mission.title} className="h-10 w-10 rounded-full mr-3 object-cover" />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-blue-600/30 flex items-center justify-center mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                    </svg>
                                  </div>
                                )}
                                <div>
                                  <div className="text-sm font-medium text-white">{mission.title}</div>
                                  <div className="text-sm text-gray-400 truncate max-w-xs">{mission.description}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {new Date(mission.launchDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(mission.status)}`}>
                                {mission.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleDeleteMission(mission.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                            {missionSearch ? "No missions found matching your search" : "No missions found"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
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
                
                {/* Search Bar for Projects - add this after the projects tab header */}
                <div className="mb-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-700 bg-gray-800 rounded-lg w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
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
                            <option value="Cancelled">Cancelled</option>
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
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        >
                          Create Project
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* Projects List */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
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
                      {filteredProjects.length > 0 ? (
                        filteredProjects.map((project) => (
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
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}>
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
                            {projectSearch ? "No projects found matching your search" : "No projects found. Create your first project!"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Settings Tab */}
            {activeTab === "settings" && (
              <AdminSettings />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return <AdminPageComponent />;
}
