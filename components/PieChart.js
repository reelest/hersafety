import { select as d3Select } from "d3";
import { useLayoutEffect, useRef } from "react";
const PieChart = ({ percent }) => {
  const ref = useRef();
  useLayoutEffect(
    function () {
      ref.current.innerHTML = "";
      const R = 25;
      const _percent = percent / 100;
      const circumference = Math.PI * R;
      const svg = d3Select(ref.current)
        .append("svg")
        .style("width", "100%")
        .attr("viewBox", "0 0 50 50");
      svg
        .append("circle")
        .attr("r", R / 2) //half of the radius so stroke-widht removes hole in center
        .attr("cx", R)
        .attr("cy", R)
        .attr("fill", "transparent")
        .attr("class", "stroke-primaryLight")
        .attr("stroke-width", R) //equal to radius
        .attr(
          "stroke-dasharray",
          `${_percent * circumference} ${(1 - _percent) * circumference}`
        );
      svg
        .append("circle")
        .attr("r", R - 0.5) //half of the radius so stroke-widht removes hole in center
        .attr("cx", R)
        .attr("cy", R)
        .attr("fill", "transparent")
        .attr("class", "stroke-primaryLight opacity-20")
        .attr("stroke-width", 1); //equal to radius
    },
    [percent]
  );
  return <div ref={ref}></div>;
};

export default PieChart;
