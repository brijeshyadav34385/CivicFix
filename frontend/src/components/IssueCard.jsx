import { Link } from "react-router-dom";

const statusStyles = {
  pending: "bg-pending/10 text-pending",
  "in-progress": "bg-progress/10 text-progress",
  resolved: "bg-resolved/10 text-resolved",
};

export default function IssueCard({ issue }) {
  return (
    <Link
      to={`/issues/${issue._id}`}
      className="block bg-white rounded-xl border border-gray-200 hover:border-signal transition-colors p-4"
    >
      <div className="flex justify-between items-start gap-3">
        <div>
          <h3 className="font-display font-semibold text-navy">{issue.title}</h3>
          <p className="text-sm text-gray-500 capitalize mt-0.5">{issue.category}</p>
        </div>
        <span className={`status-pill ${statusStyles[issue.status]}`}>{issue.status}</span>
      </div>
      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{issue.description}</p>
      <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
        <span>Reported by {issue.reportedBy?.name || "citizen"}</span>
        <span>▲ {issue.upvotes?.length || 0} upvotes</span>
      </div>
    </Link>
  );
}
