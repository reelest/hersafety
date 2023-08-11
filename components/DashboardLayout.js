import useBreakpoints from "@/utils/useBreakpoints";
import Sidebar, { useActiveTab } from "./Sidebar";
import { useState } from "react";
import NoSsr from "@mui/material/NoSsr";

const DashboardLayout = ({ renderChild = _renderChild, tabs }) => {
  const isWideScreen = useBreakpoints().lg;
  const [isOpen, setOpen] = useState(false);
  return (
    <div className="flex h-screen w-screen">
      <NoSsr>
        <Sidebar
          isOpen={isOpen}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          isStatic={isWideScreen}
          tabs={tabs}
        />
      </NoSsr>

      <main className="flex-grow  overflow-y-scroll">
        <ChooseLayout renderChild={renderChild} tabs={tabs} />
      </main>
    </div>
  );
};

const _renderChild = function (tab, tabs) {
  const Component = (
    tabs.find(
      (e) => tab === (e.id ?? encodeURIComponent(e.name.toLowerCase()))
    ) ?? tabs[0]
  ).component;
  return <Component />;
};

function ChooseLayout({ renderChild, tabs }) {
  const tab = useActiveTab(tabs);
  return renderChild(tab, tabs);
}
export default DashboardLayout;
