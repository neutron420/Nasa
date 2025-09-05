import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface DashboardStats {
  totalMissions: number;
  activeMissions: number;
  totalProjects: number;
  activeProjects: number;
}

interface AdminDashboardProps {
  missions: any[];
  projects: any[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ missions, projects }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalMissions: 0,
    activeMissions: 0,
    totalProjects: 0,
    activeProjects: 0,
  });

  useEffect(() => {
    // Calculate stats from missions and projects
    const activeMissions = missions.filter(m => m.status === "Active").length;
    const activeProjects = projects.filter(p => p.status === "Active").length;
    
    setStats({
      totalMissions: missions.length,
      activeMissions,
      totalProjects: projects.length,
      activeProjects,
    });
  }, [missions, projects]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Missions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 border border-blue-700/30 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Total Missions</p>
                <p className="text-white text-3xl font-bold mt-2">{stats.totalMissions}</p>
              </div>
              <div className="bg-blue-600/30 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 text-sm text-blue-200">
              <span className="font-medium">{stats.activeMissions} active</span> missions currently
            </div>
          </motion.div>

          {/* Total Projects */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 border border-purple-700/30 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Total Projects</p>
                <p className="text-white text-3xl font-bold mt-2">{stats.totalProjects}</p>
              </div>
              <div className="bg-purple-600/30 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <div className="mt-4 text-sm text-purple-200">
              <span className="font-medium">{stats.activeProjects} active</span> projects currently
            </div>
          </motion.div>

          {/* System Status */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-gradient-to-br from-green-900/40 to-green-800/40 border border-green-700/30 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">System Status</p>
                <p className="text-white text-3xl font-bold mt-2">Online</p>
              </div>
              <div className="bg-green-600/30 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 text-sm text-green-200">
              <span className="font-medium">All systems</span> operational
            </div>
          </motion.div>

          {/* Admin Users */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-gradient-to-br from-amber-900/40 to-amber-800/40 border border-amber-700/30 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-300 text-sm font-medium">Admin Users</p>
                <p className="text-white text-3xl font-bold mt-2">1</p>
              </div>
              <div className="bg-amber-600/30 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 text-sm text-amber-200">
              <span className="font-medium">1 active</span> administrator
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <div className="space-y-4">
            {missions.slice(0, 3).map((mission, index) => (
              <div key={mission.id || index} className="flex items-center p-3 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
                <div className="bg-blue-600/20 p-2 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">{mission.title}</p>
                  <p className="text-gray-400 text-sm">{mission.status}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-gray-400 text-xs">{new Date(mission.createdAt || mission.launchDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))}

            {projects.slice(0, 2).map((project, index) => (
              <div key={project.id || index} className="flex items-center p-3 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
                <div className="bg-purple-600/20 p-2 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">{project.title}</p>
                  <p className="text-gray-400 text-sm">{project.status}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-gray-400 text-xs">{new Date(project.createdAt || project.startDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;