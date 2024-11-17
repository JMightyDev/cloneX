import { Outlet } from "react-router-dom";
import RightPanel from "../components/RightPanel/RightPanel";
import LeftPanel from "../components/LeftPanel/LeftPanel";

export default function MainLayout() {
  return (
    <div className="flex lg:container mx-auto">
      <LeftPanel />
      {/* padding en bas pour la navbar mobile */}
      <div className="pb-16 lg:pb-0 basis-full">
        <Outlet />
      </div>
      <RightPanel />
    </div>
  );
}
