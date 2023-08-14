import { useTheme } from "@mui/material";
import { select as d3Select } from "d3";
import { useLayoutEffect, useRef } from "react";
const PieChart = ({ percent, ...props }) => {
  const ref = useRef();
  const theme = useTheme();
  useLayoutEffect(
    function () {
      ref.current.innerHTML = "";
      const R = 25;
      const _percent = percent / 100;
      const circumference = Math.PI * R * 0.875 * 2;
      const svg = d3Select(ref.current)
        .append("svg")
        .style("width", "100%")
        .attr("viewBox", "0 0 50 50");
      svg
        .append("circle")
        .attr("r", R * 0.875) //half of the radius so stroke-widht removes hole in center
        .attr("cx", R)
        .attr("cy", R)
        .attr("fill", "transparent")
        .attr("stroke", theme.palette.gray.light)
        .attr("stroke-width", R * 0.25); //equal to radius
      svg
        .append("circle")
        .attr("r", R * 0.875) //half of the radius so stroke-widht removes hole in center
        .attr("cx", R)
        .attr("cy", R)
        .attr("fill", "transparent")
        .attr("stroke", theme.palette.primary.main)
        .attr("stroke-width", R * 0.25) //equal to radius
        .attr(
          "stroke-dasharray",
          `${_percent * circumference} ${(1 - _percent) * circumference}`
        );
      // svg
      //   .append("circle")
      //   .attr("r", R * 0.875) //half of the radius so stroke-widht removes hole in center
      //   .attr("cx", R)
      //   .attr("cy", R)
      //   .attr("fill", theme.palette.common.white);
    },
    [percent]
  );
  return <div ref={ref} {...props}></div>;
};

export default PieChart;
