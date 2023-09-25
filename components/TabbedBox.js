import Card1 from "@/components/Card1";
import { Box } from "@mui/material";

function TabHeaders({ tabHeaders, currentTab, onSelectTab, _noPadding }) {
  return tabHeaders ? (
    <ul
      role="tablist"
      className={`${
        _noPadding ? "" : "-mx-8"
      } flex font-24 shadow-2 rounded-t overflow-auto`}
    >
      {tabHeaders.map((e) => (
        <Box
          as="li"
          role="tab"
          className="py-4 px-6 cursor-pointer"
          aria-selected={currentTab === e}
          sx={
            currentTab === e
              ? {
                  backgroundColor: "primary.light",
                  color: "white",
                }
              : undefined
          }
          key={e}
          onClick={() => onSelectTab(e)}
        >
          {e}
        </Box>
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
    <Card1 boxClass={noPadding ? "" : "px-8 pb-6"} className="my-6">
      <TabHeaders
        _noPadding={noPadding}
        tabHeaders={tabHeaders}
        onSelectTab={onSelectTab}
        currentTab={currentTab}
      />
      {children}
    </Card1>
  );
}
