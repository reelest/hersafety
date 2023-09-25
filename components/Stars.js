import { memo } from "react";
function ImpureStars({ width, height }) {
  const stars = function (x, y, width, height, NUM_STARS) {
    const arr = [];
    for (let i = 0; i < NUM_STARS; i++) {
      const size = Math.random() * 2;
      arr[i] = (
        <rect
          width={size}
          height={size}
          x={x + Math.random() * width}
          y={y + Math.random() * height}
          className="star"
          opacity={0.5 + Math.random() * 0.5}
          style={{
            animation: `star-pulse ${1 + Math.random() * 5}s ${
              Math.random() * 4
            }s linear infinite`,
          }}
        />
      );
    }
    return arr;
  };
  return (
    <svg
      xmlns="https://www.w3.org/2000/svg"
      className="w-full h-full"
      viewBox={`0 0 ${width} ${height}`}
    >
      {stars(0, 0, width, height, 500)}
      {stars(width / 4, 0, width / 4, height / 2, 20)}
      {stars((3 * width) / 4, height / 2, width / 4, height / 2, 20)}
    </svg>
  );
}
const Stars = memo(ImpureStars);
export default Stars;
