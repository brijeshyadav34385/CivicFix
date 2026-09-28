import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import api from "../api/axios.js";

const STATUS_COLORS = {
  pending: "#D64550",
  "in-progress": "#E8A33D",
  resolved: "#2F9E68",
};

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api.get("/issues/analytics").then(({ data }) => setAnalytics(data));
  }, []);

  if (!analytics) return <p className="text-center text-gray-400 mt-16">Loading analytics…</p>;

  const categoryData = analytics.byCategory.map((c) => ({ name: c._id, count: c.count }));
  const statusData = analytics.byStatus.map((s) => ({ name: s._id, value: s.count }));

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <h1 className="text-2xl font-bold text-navy mb-1">Admin Dashboard</h1>
      <p className="text-gray-500 text-sm mb-6">City-wide overview of reported civic issues.</p>

      <div className="bg-navy text-paper rounded-xl p-5 mb-6 inline-block">
        <p className="text-sm opacity-70">Total Issues Reported</p>
        <p className="text-3xl font-display font-bold">{analytics.total}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-semibold text-navy mb-4">Issues by Category</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#FF6B35" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-semibold text-navy mb-4">Issues by Status</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={100} label>
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#16233F"} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
