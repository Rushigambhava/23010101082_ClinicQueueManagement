import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../core/context/AuthContext";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PeopleIcon from "@mui/icons-material/People";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MedicationIcon from "@mui/icons-material/Medication";
import DescriptionIcon from "@mui/icons-material/Description";
import ListAltIcon from "@mui/icons-material/ListAlt";
import HealingIcon from "@mui/icons-material/Healing";
import LogoutIcon from "@mui/icons-material/Logout";

const navItems = {
  admin: [
    { section: "Management" },
    { to: "/dashboard", icon: <DashboardIcon fontSize="small" />, label: "Dashboard" },
    { to: "/admin/clinic", icon: <LocalHospitalIcon fontSize="small" />, label: "Clinic Info" },
    { to: "/admin/users", icon: <PeopleIcon fontSize="small" />, label: "Users" },
  ],
  patient: [
    { section: "Appointments" },
    { to: "/dashboard", icon: <DashboardIcon fontSize="small" />, label: "Dashboard" },
    { to: "/appointments", icon: <EventNoteIcon fontSize="small" />, label: "My Appointments" },
    { to: "/appointments/book", icon: <CalendarMonthIcon fontSize="small" />, label: "Book Appointment" },
    { section: "Records" },
    { to: "/prescriptions", icon: <MedicationIcon fontSize="small" />, label: "My Prescriptions" },
    { to: "/reports", icon: <DescriptionIcon fontSize="small" />, label: "My Reports" },
  ],
  receptionist: [
    { section: "Queue" },
    { to: "/dashboard", icon: <DashboardIcon fontSize="small" />, label: "Dashboard" },
    { to: "/queue", icon: <ListAltIcon fontSize="small" />, label: "Daily Queue" },
  ],
  doctor: [
    { section: "Clinical" },
    { to: "/dashboard", icon: <DashboardIcon fontSize="small" />, label: "Dashboard" },
    { to: "/doctor/queue", icon: <HealingIcon fontSize="small" />, label: "My Queue" },
  ],
};

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.role?.toLowerCase() || "patient";
  const items = navItems[role] || navItems.patient;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <>
      <div className="sidebar-brand">
        <h2><LocalHospitalIcon style={{ fontSize: 22, verticalAlign: "middle" }} /> CMS</h2>
        <span className="clinic-sub">{user?.clinicName || "Clinic"}</span>
      </div>

      <nav className="sidebar-nav">
        {items.map((item, i) =>
          item.section ? (
            <div key={i} className="nav-section-label">
              {item.section}
            </div>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
              end={item.to === "/dashboard"}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          )
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{user?.name || "User"}</div>
            <div className="user-role">{role}</div>
          </div>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          <LogoutIcon fontSize="small" /> Sign Out
        </button>
      </div>
    </>
  );
};

export default Navigation;
