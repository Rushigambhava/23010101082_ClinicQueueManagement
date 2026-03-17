import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../core/api/api";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/appointments/my");
        setAppointments(Array.isArray(res.data) ? res.data : res.data.appointments || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const statusBadge = (status) => {
    const map = { queued: "badge-info", waiting: "badge-warning", in_progress: "badge-primary", done: "badge-success", skipped: "badge-gray" };
    return <span className={`badge ${map[status?.toLowerCase()] || "badge-gray"}`}>{status}</span>;
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Loading appointments...</p></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1><EventNoteIcon style={{ verticalAlign: "middle", marginRight: 8 }} />My Appointments</h1>
          <p>{appointments.length} appointment(s)</p>
        </div>
        <Link to="/appointments/book" className="btn btn-primary">
          <AddCircleOutlineIcon fontSize="small" /> Book Appointment
        </Link>
      </div>

      {error && <div className="alert alert-error"><WarningAmberIcon fontSize="small" /> {error}</div>}

      {appointments.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon"><CalendarMonthIcon style={{ fontSize: 48, color: "var(--gray-300)" }} /></div>
            <h3>No appointments yet</h3>
            <p>Book your first appointment to get started.</p>
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Token</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id || apt._id}>
                  <td style={{ fontWeight: 500 }}>{apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleDateString() : "—"}</td>
                  <td>{apt.timeSlot || "—"}</td>
                  <td>{apt.queueEntry?.tokenNumber ?? "—"}</td>
                  <td>{statusBadge(apt.status)}</td>
                  <td>
                    <Link to={`/appointments/${apt.id || apt._id}`} className="btn btn-sm btn-secondary">
                      <VisibilityIcon fontSize="small" /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
