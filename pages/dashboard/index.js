import BottomRow from "@/parts/admin_dashboard/BottomRow";
import FirstRow from "@/parts/admin_dashboard/FirstRow";
import MiddleRow from "@/parts/admin_dashboard/MiddleRow";
import TopRow from "@/parts/admin_dashboard/TopRow";

const MainView = () => {
  return (
    <div className="px-4 py-16 sm:px-8">
      <TopRow />
      <FirstRow />
      <MiddleRow />
      <BottomRow />
    </div>
  );
};

export default MainView;
