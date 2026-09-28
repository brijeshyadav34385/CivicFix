import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import MapView from "../components/MapView.jsx";

const CATEGORIES = ["pothole", "streetlight", "garbage", "waterlogging", "electricity", "other"];

export default function ReportIssue() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("pothole");
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState(null); // { lat, lng }
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!position) {
      setError("Please click on the map to pin the issue's location.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("longitude", position.lng);
      formData.append("latitude", position.lat);
      formData.append("address", address);
      if (image) formData.append("image", image);

      const { data } = await api.post("/issues", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate(`/issues/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit issue");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-5 py-8">
      <h1 className="text-2xl font-bold text-navy mb-1">Report a civic issue</h1>
      <p className="text-gray-500 text-sm mb-6">
        Click on the map to pin the exact spot, then fill in the details.
      </p>

      {error && <p className="bg-pending/10 text-pending text-sm p-3 rounded-md mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl overflow-hidden border border-gray-200 h-[350px] md:h-auto">
          <MapView
            onMapClick={(latlng) => setPosition(latlng)}
            pickedPosition={position ? [position.lat, position.lng] : null}
            height="100%"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-ink">Title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Large pothole near bus stop"
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-signal"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ink">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-ink">Description</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-signal"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ink">Landmark / address (optional)</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-signal"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ink">Photo (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full mt-1 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-signal text-white font-semibold py-2.5 rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
}
