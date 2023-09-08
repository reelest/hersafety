import { forwardRef, useEffect, useRef } from "react";
import { VariableSizeList } from "react-window";

function useResetCache(data) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}
// Adapter for react-window
export const VirtualList = forwardRef(function ListboxComponent(
  { children, renderRow, getChildSize, padding = 8 },
  ref
) {
  const itemData = [];
  children.forEach((item) => {
    itemData.push(item);
    itemData.push(...(item.children || []));
  });

  const itemCount = itemData.length;

  const getHeight = () => {
    return (
      itemData
        .slice(0, 8)
        .map(getChildSize)
        .reduce((a, b) => a + b, 0) +
      2 * padding
    );
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <VariableSizeList
        itemData={itemData}
        height={getHeight()}
        width="100%"
        ref={gridRef}
        innerElementType="ul"
        itemSize={(index) => getChildSize(itemData[index])}
        overscanCount={5}
        itemCount={itemCount}
      >
        {renderRow}
      </VariableSizeList>
    </div>
  );
});

export default VirtualList;
