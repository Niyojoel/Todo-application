function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}

function rgbToHex(r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  let r= parseInt(result[1], 16)
  let g= parseInt(result[2], 16)
  let b= parseInt(result[3], 16)

  return result ? [r, g, b] : null;

  {/*return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;*/}
}

// alert(hexToRgb("#0033ff"));

export default rgbToHex;
