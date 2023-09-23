import Box from "@/components/Box";

function TabHeaders({ tabHeaders, currentTab, onSelectTab, _noPadding }) {
  return tabHeaders ? (
    <ul
      role="tablist"
      className={`${
        _noPadding ? "" : "-mx-8"
      } flex font-24 shadow-2 rounded-t-2xl overflow-auto`}
    >
      {tabHeaders.map((e) => (
        <li
          role="tab"
          className="py-4 px-6 aria-selected:bg-primaryLight aria-selected:text-white cursor-pointer"
          aria-selected={currentTab === e}
          key={e}
          onClick={() => onSelectTab(e)}
        >
          {e}
        </li>
      ))}
    </ul>
  ) : null;
}

export default function TabbedBox({
  tabHeaders,
  onSelectTab,
  currentTab,
  children,
  noPadding,
}) {
  return (
    <Box boxClass={noPadding ? "" : "px-8 pb-6"} className="my-6">
      <TabHeaders
        _noPadding={noPadding}
        tabHeaders={tabHeaders}
        onSelectTab={onSelectTab}
        currentTab={currentTab}
      />
      {children}
    </Box>
  );
}
