import classes from "./title_animation.module.css";

const SECONDARY = "#ed254e";
const PURPLE = "#DA5ADE";
const ORANGE = "#FF8C74";

const colors = [SECONDARY, PURPLE, ORANGE, SECONDARY, "#ff9225"];
const z = [2, 3, 5, 1, 2];
const x = [20, 230, 350, 423, 156];
export default function TitleAnimation() {
  return (
    <svg className={classes.root} viewBox="0 0 485 154">
      <desc>Reelest</desc>
      <defs>
        <filter id="f1" x="0" y="0" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="2" dy="2" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.2"></feFuncA>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic"></feMergeNode>
          </feMerge>
        </filter>
        <linearGradient id="grad1" x1="0" x2="100%" y1="0%" y2="0%">
          <stop
            offset="0%"
            style={{ stopColor: "var(--primary)", stopOpacity: 1 }}
          />
          <stop
            offset="60%"
            style={{ stopColor: "var(--primary-dark)", stopOpacity: 1 }}
          />
          <stop
            offset="100%"
            style={{ stopColor: "var(--primary-dark)", stopOpacity: 1 }}
          />
        </linearGradient>
        <linearGradient id="grad2" x1="0" x2="100%" y1="0%" y2="0%">
          <stop
            offset="0%"
            style={{ stopColor: "var(--primary-dark)", stopOpacity: 1 }}
          />
          <stop
            offset="100%"
            style={{ stopColor: "var(--primary-dark)", stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>
      <mask id="text_mask">
        <text
          y={120}
          x={0}
          fill="#ffffff"
          fontFamily={"Righteous"}
          // mask="url(#line_mask2)"
          fontSize={116}
        >
          REELEST
        </text>
      </mask>

      <text
        y={120}
        x={0}
        fill="#ffffff"
        className={classes.mainText}
        fontFamily={"Righteous"}
        // filter="url(#f1)"
        fontSize={116}
      >
        REELEST
      </text>
      <g mask="url(#text_mask)">
        {x.map((e, i) => (
          <circle
            cx={e}
            key={e + ":" + i}
            style={{ "--z": z[i] }}
            fill={colors[i]}
            r={Math.pow(z[i], 0.5) * 20 + "px"}
            className={classes.smallCircle}
          />
        ))}
        <circle className={classes.circle} fill="url(#grad1)" />
      </g>
    </svg>
  );
}
