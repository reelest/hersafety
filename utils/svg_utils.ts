// A little helper to generate matrix color from source and destination colors
// To easily dive in : https://codepen.io/jacobberglund/pen/ORNQAr
// To understand what's going on here read this article by A List Apart
// https://alistapart.com/article/finessing-fecolormatrix/

interface RgbColor {
  /** Values are in percent (ex: 255,127,0,255 => 1,0.5,0,1) */
  r: number;
  g: number;
  b: number;
  a: number;
}

  export function getMatrix(hexColor: string) {
    const rgbColor: RgbColor = hexToRgb(hexColor);
    return computeMatrixColor(rgbColor);
  }

  // Inspired by this answer : https://stackoverflow.com/a/5624139/11480016
  function hexToRgb(hex3or6): RgbColor {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const hex6 = hex3or6.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex6);
    const base = 1 / 255;
    return result
      ? {
          r: parseInt(result[1], 16) * base,
          g: parseInt(result[2], 16) * base,
          b: parseInt(result[3], 16) * base,
          a: result[4] ? parseInt(result[4], 16) * base : 1,
        }
      : null;
  }

  function computeMatrixColor(rgbColor: RgbColor): string {
    let matrix;
    if (rgbColor) {
      // Ignore original colors and apply the new one
      matrix =
        `0 0 0 0 ${rgbColor.r} ` + // Red
        `0 0 0 0 ${rgbColor.g} ` + // Green
        `0 0 0 0 ${rgbColor.b} ` + // Blue
        `0 0 0 ${rgbColor.a} 0`; // Alpha
    } else {
      // Identity (keep orignal colors)
      matrix =
        `1 0 0 0 0 ` + // Red
        `0 1 0 0 0 ` + // Green
        `0 0 1 0 0 ` + // Blue
        `0 0 0 1 0`; // Alpha
    }
    return matrix;
  }
