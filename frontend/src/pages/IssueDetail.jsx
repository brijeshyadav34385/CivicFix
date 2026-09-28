import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import MapView from "../components/MapView.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const statusStyles = {
  pending: "bg-pending/10 text-pending",
  "in-progress": "bg-progress/10 text-progress",
  resolved: "bg-resolved/10 text-resolved",
};

const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");

export default function IssueDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [issue, setIssue] = useState(null);
  const [commentText, setCommentText] = useState("");

  const fetchIssue = async () => {
    const { data } = await api.get(`/issues/${id}`);
    setIssue(data);
  };

  useEffect(() => {
    fetchIssue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpvote = async () => {
    if (!user) return alert("Please log in to upvote");
    const { data } = await api.put(`/issues/${id}/upvote`);
    setIssue(data);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const { data } = await api.post(`/issues/${id}/comments`, { text: commentText });
    setIssue((prev) => ({ ...prev, comments: data }));
    setCommentText("");
  };

  const handleStatusChange = async (newStatus) => {
    const { data } = await api.put(`/issues/${id}/status`, { status: newStatus });
    setIssue(data);
  };

  if (!issue) return <p className="text-center text-gray-400 mt-16">Loading…</p>;

  const hasUpvoted = user && issue.upvotes.includes(user._id);

  return (
    <div className="max-w-4xl mx-auto px-5 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">{issue.title}</h1>
          <p className="text-sm text-gray-500 capitalize mt-1">
            {issue.category} &middot; reported by {issue.reportedBy?.name}
          </p>
        </div>
        <span className={`status-pill ${statusStyles[issue.status]}`}>{issue.status}</span>
      </div>

      {issue.imageUrl && (
        <img
          src={`${API_ORIGIN}${issue.imageUrl}`}
          alt={issue.title}
          className="w-full max-h-80 object-cover rounded-xl mt-4 border border-gray-200"
        />
      )}

      <p className="text-ink mt-4">{issue.description}</p>

      <div className="mt-5 rounded-xl overflow-hidden border border-gray-200 h-[300px]">
        <MapView
          issues={[issue]}
          center={[issue.location.coordinates[1], issue.location.coordinates[0]]}
          zoom={15}
          height="100%"
        />
      </div>

      <div className="flex items-center gap-3 mt-5">
        <button
          onClick={handleUpvote}
          className={`px-4 py-2 rounded-md font-semibold text-sm border transition-colors ${
            hasUpvoted
              ? "bg-navy text-paper border-navy"
              : "border-navy text-navy hover:bg-navy hover:text-paper"
          }`}
        >
          ▲ {issue.upvotes.length} Upvote{issue.upvotes.length !== 1 && "s"}
        </button>

        {user?.role === "admin" && (
          <select
            value={issue.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-navy mb-3">
          Comments ({issue.comments.length})
        </h2>

        {user && (
          <form onSubmit={handleComment} className="flex gap-2 mb-4">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add an update or comment…"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-signal"
            />
            <button
              type="submit"
              className="bg-navy text-paper font-semibold px-4 py-2 rounded-md text-sm hover:bg-navy-light"
            >
              Post
            </button>
          </form>
        )}

        <div className="space-y-3">
          {issue.comments.length === 0 && (
            <p className="text-sm text-gray-400">No comments yet.</p>
          )}
          {issue.comments.map((c) => (
            <div key={c._id} className="bg-white border border-gray-200 rounded-md p-3">
              <p className="text-sm font-semibold text-navy">{c.user?.name || "User"}</p>
              <p className="text-sm text-ink">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
