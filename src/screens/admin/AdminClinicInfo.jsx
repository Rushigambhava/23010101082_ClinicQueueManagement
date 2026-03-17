import { useState, useEffect } from "react";
import api from "../../core/api/api";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PeopleIcon from "@mui/icons-material/People";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const AdminClinicInfo = () => {
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClinic = async () => {
      try {
        const res = await api.get("/admin/clinic");
        setClinic(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load clinic info");
      } finally {
        setLoading(false);
      }
    };
    fetchClinic();
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Loading clinic info...</p></div>;
  if (error) return <div className="alert alert-error"><WarningAmberIcon fontSize="small" /> {error}</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1><LocalHospitalIcon style={{ verticalAlign: "middle", marginRight: 8 }} />Clinic Information</h1>
          <p>Overview of your clinic</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "var(--primary-bg)", color: "var(--primary)" }}>
            <PeopleIcon />
          </div>
          <div className="stat-value">{clinic?.userCount ?? 0}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "var(--accent-bg)", color: "var(--accent)" }}>
            <EventNoteIcon />
          </div>
          <div className="stat-value">{clinic?.appointmentCount ?? 0}</div>
          <div className="stat-label">Appointments</div>
        </div>
      </div>

      {/* Clinic details card */}
      <div className="card">
        <div className="card-header">
          <h3>Clinic Details</h3>
          <span className="badge badge-primary">{clinic?.code}</span>
        </div>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Clinic Name</span>
            <span className="detail-value">{clinic?.name || "—"}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Clinic Code</span>
            <span className="detail-value">{clinic?.code || "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminClinicInfo;
