import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import MaintenanceTracker from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";

// @mui icons
import Icon from "@mui/material/Icon";

const routesConfig = (handleLogout) => [
  {
    type: "collapse",
    name: "Machines",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: (
        <Dashboard />
    ),
    disabled: false,
    protected: true,
  },
  {
    type: "collapse",
    name: "Tables",
    key: "tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/tables",
    component: <Tables />,
    disabled: false,
    protected: true,
  },
  {
    type: "collapse",
    name: "Machine Usage",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/machines/:id",
    component: <Billing />,
    disabled: true,
    protected: true,
  },
  {
    type: "collapse",
    name: "Maintenance Tracker",
    key: "rtl",
    icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
    route: "/maintenance-tracker",
    component: <MaintenanceTracker />,
    disabled: true,
    protected: true,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
    disabled: false,
    protected: true,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
    disabled: false,
    protected: true,
  },
  {
    type: "collapse",
    name: "Sign Out",
    key: "sign-out",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
    disabled: false,
    protected: false,
    onClick: handleLogout,
  },
];

export default routesConfig;
