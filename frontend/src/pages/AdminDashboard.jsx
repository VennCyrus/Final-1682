import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@/context/UserContext";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/ApiPath";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Users, FileText, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const { user, loading: userLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (!userLoading && (!user || user.role !== 'admin')) {
      toast.error("Access denied. Admin only.");
      navigate("/dashboard");
      return;
    }

    if (user && user.role === 'admin') {
      fetchStats();
    }
  }, [user, userLoading, navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.ADMIN.GET_STATS);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch admin statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-fuchsia-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-600">
            Overview of platform statistics and analytics
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-violet-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">
                  Total Users
                </p>
                <p className="text-3xl font-black text-slate-900">
                  {stats?.totalUsers || 0}
                </p>
              </div>
              <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 p-4 rounded-xl">
                <Users className="text-white" size={24} />
              </div>
            </div>
          </div>

          {/* Total Resumes Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-rose-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">
                  Total Resumes
                </p>
                <p className="text-3xl font-black text-slate-900">
                  {stats?.totalResumes || 0}
                </p>
              </div>
              <div className="bg-gradient-to-br from-rose-500 to-pink-500 p-4 rounded-xl">
                <FileText className="text-white" size={24} />
              </div>
            </div>
          </div>

          {/* Average Resumes Per Day Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">
                  Avg. Per Day (30d)
                </p>
                <p className="text-3xl font-black text-slate-900">
                  {stats?.resumesByDay
                    ? Math.round(
                        stats.resumesByDay.reduce(
                          (sum, day) => sum + day.count,
                          0
                        ) / 30
                      )
                    : 0}
                </p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-4 rounded-xl">
                <TrendingUp className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <h2 className="text-2xl font-black text-slate-900 mb-6">
            Resumes Created Per Day (Last 30 Days)
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={stats?.resumesByDay || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: "#8b5cf6", r: 4 }}
                name="Resumes Created"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mt-6">
          <h2 className="text-2xl font-black text-slate-900 mb-6">
            Daily Resume Creation (Bar Chart)
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stats?.resumesByDay || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar
                dataKey="count"
                fill="#8b5cf6"
                radius={[8, 8, 0, 0]}
                name="Resumes Created"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

