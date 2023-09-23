import useBreakpoints from "@/utils/useBreakpoints";
import Sidebar from "./Sidebar";
import { useState } from "react";

const DashboardLayout = ({ children, tabs }) => {
  const isWideScreen = useBreakpoints().lg;
  const [isOpen, setOpen] = useState(false);
  return (
    <div className="flex h-screen w-screen">
      <Sidebar
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        isStatic={isWideScreen}
        tabs={tabs}
      />
      <main className="flex-grow  overflow-y-scroll">{children}</main>
    </div>
  );
};

export default DashboardLayout;
