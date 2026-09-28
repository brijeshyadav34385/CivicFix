import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Link } from "react-router-dom";

// Fix default marker icon paths (Vite + Leaflet quirk)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const statusColor = {
  pending: "#D64550",
  "in-progress": "#E8A33D",
  resolved: "#2F9E68",
};

const coloredIcon = (color) =>
  L.divIcon({
    className: "",
    html: `<div style="background:${color};width:16px;height:16px;border-radius:50%;border:2px solid white;box-shadow:0 0 0 2px ${color}55"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

function ClickCapture({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick && onMapClick(e.latlng);
    },
  });
  return null;
}

export default function MapView({
  issues = [],
  center = [28.6139, 77.209], // default: New Delhi
  zoom = 12,
  onMapClick,
  pickedPosition,
  height = "500px",
}) {
  return (
    <div className="map-wrapper" style={{ height }}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {onMapClick && <ClickCapture onMapClick={onMapClick} />}

        {pickedPosition && (
          <Marker position={pickedPosition} icon={coloredIcon("#16233F")}>
            <Popup>Selected location</Popup>
          </Marker>
        )}

        {issues.map((issue) => (
          <Marker
            key={issue._id}
            position={[issue.location.coordinates[1], issue.location.coordinates[0]]}
            icon={coloredIcon(statusColor[issue.status] || "#16233F")}
          >
            <Popup>
              <div className="font-body">
                <p className="font-semibold">{issue.title}</p>
                <p className="text-xs capitalize text-gray-500 mb-1">
                  {issue.category} &middot; {issue.status}
                </p>
                <Link to={`/issues/${issue._id}`} className="text-signal text-sm font-semibold">
                  View details →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
