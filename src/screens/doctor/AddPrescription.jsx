import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../core/api/api";
import MedicationIcon from "@mui/icons-material/Medication";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const emptyMedicine = { name: "", dosage: "", duration: "" };

const AddPrescription = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([{ ...emptyMedicine }]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateMedicine = (index, field, value) => {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field]: value };
    setMedicines(updated);
  };

  const addMedicine = () => {
    setMedicines([...medicines, { ...emptyMedicine }]);
  };

  const removeMedicine = (index) => {
    if (medicines.length === 1) return;
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate at least one medicine with a name
    const validMedicines = medicines.filter((m) => m.name.trim());
    if (validMedicines.length === 0) {
      setError("Please add at least one medicine with a name");
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/prescriptions/${appointmentId}`, {
        medicines: validMedicines.map((m) => ({
          name: m.name.trim(),
          dosage: m.dosage.trim(),
          duration: m.duration.trim(),
        })),
        notes: notes.trim(),
      });
      setSuccess("Prescription added successfully!");
      setTimeout(() => navigate("/doctor/queue"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add prescription");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1><MedicationIcon style={{ verticalAlign: "middle", marginRight: 8 }} />Add Prescription</h1>
          <p>Appointment #{appointmentId}</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate("/doctor/queue")}>
          <ArrowBackIcon fontSize="small" /> Back
        </button>
      </div>

      <div className="card" style={{ maxWidth: 700 }}>
        {error && <div className="alert alert-error"><WarningAmberIcon fontSize="small" /> {error}</div>}
        {success && <div className="alert alert-success"><CheckCircleOutlineIcon fontSize="small" /> {success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Medicines */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <label className="form-label" style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600 }}>
                <MedicationIcon fontSize="small" style={{ verticalAlign: "middle", marginRight: 4 }} />
                Medicines
              </label>
              <button type="button" className="btn btn-sm btn-outline" onClick={addMedicine}>
                <AddCircleOutlineIcon fontSize="small" /> Add Medicine
              </button>
            </div>

            {medicines.map((med, index) => (
              <div
                key={index}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr auto",
                  gap: 10,
                  marginBottom: 10,
                  padding: 14,
                  background: "var(--gray-50)",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--gray-200)",
                  alignItems: "end",
                }}
              >
                <div>
                  <label className="form-label">Medicine Name</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Paracetamol"
                    value={med.name}
                    onChange={(e) => updateMedicine(index, "name", e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Dosage</label>
                  <input
                    className="form-input"
                    placeholder="e.g. 500mg"
                    value={med.dosage}
                    onChange={(e) => updateMedicine(index, "dosage", e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Duration</label>
                  <input
                    className="form-input"
                    placeholder="e.g. 5 days"
                    value={med.duration}
                    onChange={(e) => updateMedicine(index, "duration", e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => removeMedicine(index)}
                  disabled={medicines.length === 1}
                  style={{ marginBottom: 2 }}
                  title="Remove"
                >
                  <DeleteOutlineIcon fontSize="small" />
                </button>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="form-textarea"
              placeholder="e.g. After food, avoid cold drinks..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Saving..." : "Save Prescription"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPrescription;
