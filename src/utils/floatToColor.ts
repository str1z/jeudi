export default function floatToColor(percentage) {
  const colorPartDec = String(255 * percentage);
  const colorPartHex = Number(parseInt(colorPartDec, 10)).toString(16);
  const strValue = "0x" + colorPartHex + colorPartHex + colorPartHex;
  return eval(strValue);
}
