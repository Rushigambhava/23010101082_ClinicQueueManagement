import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../core/api/api";
import HealingIcon from "@mui/icons-material/Healing";
import MedicationIcon from "@mui/icons-material/Medication";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import InboxIcon from "@mui/icons-material/Inbox";
import RefreshIcon from "@mui/icons-material/Refresh";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const DoctorQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await api.get("/doctor/queue");
      console.log("Doctor queue response:", res.data);
      const data = res.data;
      setQueue(Array.isArray(data) ? data : (data.queue || data.data || []));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQueue(); }, []);

  const statusConfig = {
    waiting: { label: "Waiting", badge: "badge-warning", icon: <HourglassEmptyIcon fontSize="small" /> },
    in_progress: { label: "In Progress", badge: "badge-info", icon: <PlayArrowIcon fontSize="small" /> },
    "in-progress": { label: "In Progress", badge: "badge-info", icon: <PlayArrowIcon fontSize="small" /> },
    done: { label: "Done", badge: "badge-success", icon: <CheckCircleIcon fontSize="small" /> },
    skipped: { label: "Skipped", badge: "badge-gray", icon: <SkipNextIcon fontSize="small" /> },
  };

  const getStatusDisplay = (status) => {
    const s = status?.toLowerCase();
    const cfg = statusConfig[s] || { label: status, badge: "badge-gray", icon: null };
    return (
      <span className={`badge ${cfg.badge}`} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        {cfg.icon} {cfg.label}
      </span>
    );
  };

  // Extract patient name from various shapes
  const getPatientName = (entry) => {
    return entry.patientName
      || entry.patient?.name
      || entry.appointment?.patient?.name
      || `Patient #${entry.patientId || entry.appointment?.patientId || "—"}`;
  };

  // Extract appointment ID
  const getAppointmentId = (entry) => {
    return entry.appointmentId || entry.appointment_id || entry.appointment?.id || entry.id;
  };

  // Extract time slot
  const getTimeSlot = (entry) => {
    return entry.timeSlot || entry.appointment?.timeSlot || "";
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Loading queue...</p></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1><HealingIcon style={{ verticalAlign: "middle", marginRight: 8 }} />My Queue — Today</h1>
          <p>{queue.length} patient(s) in queue</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={fetchQueue} title="Refresh">
          <RefreshIcon fontSize="small" /> Refresh
        </button>
      </div>

      {error && <div className="alert alert-error"><WarningAmberIcon fontSize="small" /> {error}</div>}

      {queue.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon"><InboxIcon style={{ fontSize: 48, color: "var(--gray-300)" }} /></div>
            <h3>No patients today</h3>
            <p>Your queue is empty for today.</p>
          </div>
        </div>
      ) : (
        <div className="queue-list">
          {queue.map((entry, idx) => {
            const aptId = getAppointmentId(entry);
            const s = entry.status?.toLowerCase();
            const isActive = s === "in_progress" || s === "in-progress";
            return (
              <div
                className={`queue-card ${isActive ? "queue-card-active" : ""} ${s === "done" ? "queue-card-done" : ""} ${s === "skipped" ? "queue-card-skipped" : ""}`}
                key={entry.id || entry._id || idx}
              >
                <div className="queue-card-token">
                  <span className="token-number">#{entry.tokenNumber ?? idx + 1}</span>
                </div>
                <div className="queue-card-info">
                  <div className="queue-patient-name">
                    <PersonIcon fontSize="small" style={{ color: "var(--gray-400)", marginRight: 4 }} />
                    {getPatientName(entry)}
                  </div>
                  <div className="queue-meta">
                    {getTimeSlot(entry) && (
                      <span><AccessTimeIcon style={{ fontSize: 14 }} /> {getTimeSlot(entry)}</span>
                    )}
                    {getStatusDisplay(entry.status)}
                  </div>
                </div>
                <div className="queue-card-actions">
                  <div className="queue-actions">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => navigate(`/doctor/prescriptions/${aptId}`)}
                      disabled={!aptId}
                    >
                      <MedicationIcon fontSize="small" /> Medicines
                    </button>
                    <button
                      className="btn btn-sm btn-accent"
                      onClick={() => navigate(`/doctor/reports/${aptId}`)}
                      disabled={!aptId}
                    >
                      <DescriptionIcon fontSize="small" /> Report
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DoctorQueue;
