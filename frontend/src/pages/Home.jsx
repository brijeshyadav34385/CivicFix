import { useEffect, useState } from "react";
import api from "../api/axios.js";
import MapView from "../components/MapView.jsx";
import IssueCard from "../components/IssueCard.jsx";

const CATEGORIES = ["pothole", "streetlight", "garbage", "waterlogging", "electricity", "other"];
const STATUSES = ["pending", "in-progress", "resolved"];

export default function Home() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [nearMe, setNearMe] = useState(null); // { lng, lat }

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (status) params.status = status;
      if (nearMe) {
        params.lng = nearMe.lng;
        params.lat = nearMe.lat;
        params.radius = 5; // km
      }
      const { data } = await api.get("/issues", { params });
      setIssues(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, status, nearMe]);

  const handleNearMe = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setNearMe({ lng: pos.coords.longitude, lat: pos.coords.latitude }),
      () => alert("Could not access your location")
    );
  };

  const mapCenter = nearMe
    ? [nearMe.lat, nearMe.lng]
    : issues[0]
    ? [issues[0].location.coordinates[1], issues[0].location.coordinates[0]]
    : undefined;

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Issues near you</h1>
        <p className="text-gray-500 text-sm mt-1">
          Tracked civic issues plotted on the map — pin colors show pending, in-progress, or resolved status.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button
          onClick={handleNearMe}
          className="border border-signal text-signal font-semibold rounded-md px-3 py-2 text-sm hover:bg-signal hover:text-white transition-colors"
        >
          📍 Near me (5km)
        </button>

        {nearMe && (
          <button
            onClick={() => setNearMe(null)}
            className="text-gray-400 text-sm underline"
          >
            Clear location filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 rounded-xl overflow-hidden border border-gray-200">
          <MapView issues={issues} center={mapCenter} />
        </div>

        <div className="lg:col-span-2 space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {loading && <p className="text-gray-400 text-sm">Loading issues…</p>}
          {!loading && issues.length === 0 && (
            <p className="text-gray-400 text-sm">No issues found. Be the first to report one!</p>
          )}
          {issues.map((issue) => (
            <IssueCard key={issue._id} issue={issue} />
          ))}
        </div>
      </div>
    </div>
  );
}
