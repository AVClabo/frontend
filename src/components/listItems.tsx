import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HelpIcon from "@mui/icons-material/Help";
import SettingsIcon from "@mui/icons-material/Settings";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import SickIcon from "@mui/icons-material/Sick";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

const primarynavList = [
  // { link: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
  // { link: "/profile", label: "Doctor Profile", icon: <AccountCircleIcon /> },
  // { link: "/doctor-list", label: "Doctor List", icon: <PeopleIcon /> },
  { link: "/patient-list", label: "Patient List", icon: <SickIcon /> },
  // { link: "/appointments", label: "Appointments", icon: <BookOnlineIcon /> },
  // { link: "/calender", label: "Calender", icon: <CalendarMonthIcon /> },
  // { link: "/kanban", label: "Kanban", icon: <ViewKanbanIcon /> },
  // { link: "/account", label: "Account", icon: <ManageAccountsIcon /> },
];

const secondaryNavList = [
  // { link: "/lab-results", label: "Lab Results", icon: <ReceiptLongIcon /> },
  // { link: "/medical-records", label: "Medical Records", icon: <DescriptionIcon /> },
  // { link: "/prescriptions", label: "Prescriptions", icon: <AssignmentTurnedInIcon /> },
  // { link: "/plans", label: "Care Plans", icon: <AssignmentIcon /> },
  // { link: "/forms", label: "Forms", icon: <DescriptionIcon /> },
  // { link: "/help", label: "Get Help", icon: <HelpIcon /> },
  { link: "/settings", label: "Settings", icon: <SettingsIcon /> },
  // Logout will be handled separately
];

// 🔄 Logout function as a custom hook
function useLogout() {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await fetch("http://localhost:8000/api/logout/", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      navigate("/login");
    }
  };

  return logout;
}

// ✅ Exported primary nav list
export const mainListItems = (
  <React.Fragment>
    {primarynavList.map((data, index) => (
      <Link
        key={index}
        to={data.link}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <ListItemButton>
          <ListItemIcon>{data.icon}</ListItemIcon>
          <ListItemText primary={data.label} />
        </ListItemButton>
      </Link>
    ))}
  </React.Fragment>
);

// ✅ Exported secondary nav list with Logout
export function SecondaryListItems() {
  const logout = useLogout();

  return (
    <React.Fragment>
      <ListSubheader component="div" inset>
        Saved reports
      </ListSubheader>

      {secondaryNavList.map((data, index) => (
        <Link
          key={index}
          to={data.link}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItemButton>
            <ListItemIcon>{data.icon}</ListItemIcon>
            <ListItemText primary={data.label} />
          </ListItemButton>
        </Link>
      ))}

      {/* 🔐 Logout Button */}
      <ListItemButton onClick={logout}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </React.Fragment>
  );
}
