import { useState, useEffect } from "react";
import api from "../../core/api/api";
import MedicationIcon from "@mui/icons-material/Medication";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InboxIcon from "@mui/icons-material/Inbox";

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/prescriptions/my");
        console.log("Prescriptions response:", res.data);
        setPrescriptions(Array.isArray(res.data) ? res.data : res.data.prescriptions || res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load prescriptions");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Loading prescriptions...</p></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1><MedicationIcon style={{ verticalAlign: "middle", marginRight: 8 }} />My Prescriptions</h1>
          <p>{prescriptions.length} prescription(s)</p>
        </div>
      </div>

      {error && <div className="alert alert-error"><WarningAmberIcon fontSize="small" /> {error}</div>}

      {prescriptions.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon"><InboxIcon style={{ fontSize: 48, color: "var(--gray-300)" }} /></div>
            <h3>No prescriptions yet</h3>
            <p>Your prescriptions will appear here after a doctor visit.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {prescriptions.map((rx, i) => (
            <div className="card" key={rx.id || rx._id || i}>
              <div className="card-header">
                <h3>Prescription #{rx.appointmentId || rx.id || i + 1}</h3>
                <span className="badge badge-primary">
                  {rx.createdAt ? new Date(rx.createdAt).toLocaleDateString() : "—"}
                </span>
              </div>

              {/* Medicines table */}
              {rx.medicines && rx.medicines.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Medicine</th>
                          <th>Dosage</th>
                          <th>Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rx.medicines.map((med, j) => (
                          <tr key={j}>
                            <td style={{ fontWeight: 500 }}>{typeof med === "string" ? med : med.name}</td>
                            <td>{typeof med === "string" ? "—" : (med.dosage || "—")}</td>
                            <td>{typeof med === "string" ? "—" : (med.duration || "—")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {rx.notes && (
                <div>
                  <span className="detail-label">Notes</span>
                  <p style={{ marginTop: 4 }}>{rx.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientPrescriptions;
