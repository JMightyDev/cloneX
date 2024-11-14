import { Outlet } from "react-router-dom";
import RightPanel from "../components/RightPanel/RightPanel";
import LeftPanel from "../components/LeftPanel/LeftPanel";

export default function MainLayout() {
  return (
    <div className="flex container mx-auto">
      <LeftPanel />
      <Outlet />
      <RightPanel />
    </div>
  );
}
