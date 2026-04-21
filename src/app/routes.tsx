import { createBrowserRouter } from "react-router";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { Profile } from "./components/Profile";
import { Settings } from "./components/Settings";
import { Legal } from "./components/Legal";
import { Contacts } from "./components/Contacts";
import { Messages } from "./components/Messages";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/profile",
    Component: Profile,
  },
  {
    path: "/settings",
    Component: Settings,
  },
  {
    path: "/legal",
    Component: Legal,
  },
  {
    path: "/contacts",
    Component: Contacts,
  },
  {
    path: "/messages",
    Component: Messages,
  },
]);
