import { useState, useEffect } from "react";
import api from "../../core/api/api";
import DescriptionIcon from "@mui/icons-material/Description";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InboxIcon from "@mui/icons-material/Inbox";

const PatientReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/reports/my");
        console.log("Reports response:", res.data);
        setReports(Array.isArray(res.data) ? res.data : res.data.reports || res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Loading reports...</p></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1><DescriptionIcon style={{ verticalAlign: "middle", marginRight: 8 }} />My Reports</h1>
          <p>{reports.length} report(s)</p>
        </div>
      </div>

      {error && <div className="alert alert-error"><WarningAmberIcon fontSize="small" /> {error}</div>}

      {reports.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon"><InboxIcon style={{ fontSize: 48, color: "var(--gray-300)" }} /></div>
            <h3>No reports yet</h3>
            <p>Your medical reports will appear here after a doctor visit.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {reports.map((rpt, i) => (
            <div className="card" key={rpt.id || rpt._id || i}>
              <div className="card-header">
                <h3>Report #{rpt.appointmentId || rpt.id || i + 1}</h3>
                <span className="badge badge-info">
                  {rpt.createdAt ? new Date(rpt.createdAt).toLocaleDateString() : "—"}
                </span>
              </div>
              <div className="detail-grid">
                {rpt.diagnosis && (
                  <div className="detail-item">
                    <span className="detail-label">Diagnosis</span>
                    <span className="detail-value">{rpt.diagnosis}</span>
                  </div>
                )}
                {rpt.testRecommended && (
                  <div className="detail-item">
                    <span className="detail-label">Test Recommended</span>
                    <span className="detail-value">{rpt.testRecommended}</span>
                  </div>
                )}
                {rpt.remarks && (
                  <div className="detail-item">
                    <span className="detail-label">Remarks</span>
                    <span className="detail-value">{rpt.remarks}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientReports;
