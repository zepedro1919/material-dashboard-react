// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";

// Images
import LogoAsana from "assets/images/small-logos/logo-asana.svg";
import logoGithub from "assets/images/small-logos/github.svg";
import logoAtlassian from "assets/images/small-logos/logo-atlassian.svg";
import logoSlack from "assets/images/small-logos/logo-slack.svg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
import logoInvesion from "assets/images/small-logos/logo-invision.svg";

const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0s";
  let h = Math.floor((seconds % (3600 * 24)) / 3600);
  let m = Math.floor((seconds % 3600) / 60);
  let s = seconds % 60;

  return `${h}h ${m}m ${s}s`;
}

export default async function fetchMaintenanceLogs() {
  try {

    const response = await fetch("https://nautilustech.onrender.com/maintenance-logs", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    };

    const logs = await response.json();

    return {
      columns: [
        { Header: "User", accessor: "user", align: "center" },
        { Header: "Machine", accessor: "machine_name", align: "center" },
        { Header: "Maintenance", accessor: "maintenance_type", align: "center" },
        { Header: "Start Time", accessor: "start_time", align: "center" },
        { Header: "End Time", accessor: "stop_time", align: "center" },
        { Header: "Duration", accessor: "duration", align: "center" },
      ],

      rows:  (Array.isArray(logs) ? logs : []).map(log => ({
        user: (
          <MDTypography variant="caption" fontWeight="medium">
            {log.user_name}
          </MDTypography>
        ),
        machine_name: (
          <MDTypography variant="caption" fontWeight="medium">
            {log.machine_name}
          </MDTypography>
        ),
        maintenance_type: (
          <MDTypography variant="caption" fontWeight="medium">
            {log.maintenance_type}
          </MDTypography>
        ),
        start_time: (
          <MDTypography variant="caption" color="text">
            {log.start_time}
          </MDTypography>
        ),
        stop_time: (
          <MDTypography variant="caption" color="text">
            {log.end_time}
          </MDTypography>
        ),
        duration: (
          <MDTypography variant="caption" color="text">
            {formatDuration(log.duration)}
          </MDTypography>
        ),
      }))
    };
  } catch (error) {
    console.error("Error fetching machine usage logs:", error);
    return { columns: [], rows: [] };
  }
}
