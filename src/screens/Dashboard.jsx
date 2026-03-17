import { useAuth } from "../core/context/AuthContext";
import { Link } from "react-router-dom";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventNoteIcon from "@mui/icons-material/EventNote";
import MedicationIcon from "@mui/icons-material/Medication";
import DescriptionIcon from "@mui/icons-material/Description";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PeopleIcon from "@mui/icons-material/People";
import ListAltIcon from "@mui/icons-material/ListAlt";
import HealingIcon from "@mui/icons-material/Healing";

const roleCards = {
  admin: [
    { icon: <LocalHospitalIcon />, title: "Clinic Info", desc: "View clinic details & stats", to: "/admin/clinic", color: "var(--primary)" },
    { icon: <PeopleIcon />, title: "Manage Users", desc: "Create & manage staff and patients", to: "/admin/users", color: "var(--accent)" },
  ],
  patient: [
    { icon: <CalendarMonthIcon />, title: "Book Appointment", desc: "Schedule a new visit", to: "/appointments/book", color: "var(--primary)" },
    { icon: <EventNoteIcon />, title: "My Appointments", desc: "View your upcoming & past visits", to: "/appointments", color: "var(--accent)" },
    { icon: <MedicationIcon />, title: "Prescriptions", desc: "View your prescriptions", to: "/prescriptions", color: "var(--success)" },
    { icon: <DescriptionIcon />, title: "Reports", desc: "View your medical reports", to: "/reports", color: "var(--info)" },
  ],
  receptionist: [
    { icon: <ListAltIcon />, title: "Daily Queue", desc: "Manage today's patient queue", to: "/queue", color: "var(--primary)" },
  ],
  doctor: [
    { icon: <HealingIcon />, title: "My Queue", desc: "View today's patients", to: "/doctor/queue", color: "var(--primary)" },
  ],
};

const Dashboard = () => {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase() || "patient";
  const cards = roleCards[role] || roleCards.patient;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Welcome, {user?.name || "User"} 👋</h1>
          <p>
            {user?.clinicName || "Clinic"} &middot;{" "}
            <span className="badge badge-primary" style={{ marginLeft: 4 }}>
              {role}
            </span>
          </p>
        </div>
      </div>

      <div className="stats-grid">
        {cards.map((card) => (
          <Link key={card.to} to={card.to} style={{ textDecoration: "none", color: "inherit" }}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: card.color + "15", color: card.color }}>
                {card.icon}
              </div>
              <div className="stat-value" style={{ fontSize: "1.1rem" }}>{card.title}</div>
              <div className="stat-label">{card.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Quick Info</h3>
        </div>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Clinic</span>
            <span className="detail-value">{user?.clinicName || "—"}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Clinic Code</span>
            <span className="detail-value">{user?.clinicCode || "—"}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email</span>
            <span className="detail-value">{user?.email || "—"}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Role</span>
            <span className="detail-value" style={{ textTransform: "capitalize" }}>{role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
