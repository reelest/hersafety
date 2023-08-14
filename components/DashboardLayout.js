import useBreakpoints from "@/utils/useBreakpoints";
import Sidebar, { useActiveTab } from "./Sidebar";
import NoSsr from "@mui/material/NoSsr";
import createSubscription from "@/utils/createSubscription";

export const [useSidebar, , setSidebar] = createSubscription();
const DashboardLayout = ({ renderChild = _renderChild, tabs }) => {
  const isOpen = useSidebar();
  const isWideScreen = useBreakpoints().lg;
  return (
    <div className="flex h-screen w-screen">
      <NoSsr>
        <Sidebar
          isOpen={isOpen}
          onOpen={() => setSidebar(true)}
          onClose={() => setSidebar(false)}
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
    tabs.find((e) => tab === (e.id ?? e.name.toLowerCase())) ?? tabs[0]
  ).component;
  return <Component />;
};

function ChooseLayout({ renderChild, tabs }) {
  const tab = useActiveTab(tabs);
  return renderChild(tab, tabs);
}
export default DashboardLayout;
