import {
  base,
  bold,
  boldItalic,
  box,
  boxFilled,
  circle,
  cursive,
  cursiveBold,
  goth,
  gothBold,
  italic,
  slashSymbol,
  stemOutline,
  strike,
  typewriter,
  wide,
} from "./glyphs";

const glyphMap = {};

base.forEach((char, i) => {
  glyphMap[char] = {
    "Bold Italic": boldItalic[i],
    Bold: bold[i],
    "Box Filled": boxFilled[i],
    Box: box[i],
    Circle: circle[i],
    "Cursive Bold": cursiveBold[i],
    Cursive: cursive[i],
    "Goth Bold": gothBold[i],
    Goth: goth[i],
    Italic: italic[i],
    Slash: slashSymbol[i],
    Stem: stemOutline[i],
    Strike: strike[i],
    Typewriter: typewriter[i],
    Wide: wide[i],
  };
});

export const validGlyphs = base;

const turnText = (chars, style) =>
  chars.map((c) => (validGlyphs.includes(c) ? glyphMap[c][style] : c)).join("");

export const mapInput = (text) => {
  const chars = text.split("");

  const ret = {
    Bold: turnText(chars, "Bold"),
    "Bold Italic": turnText(chars, "Bold Italic"),
    Box: turnText(chars, "Box"),
    "Box Filled": turnText(chars, "Box Filled"),
    Circle: turnText(chars, "Circle"),
    Cursive: turnText(chars, "Cursive"),
    "Cursive Bold": turnText(chars, "Cursive Bold"),
    Goth: turnText(chars, "Goth"),
    "Goth Bold": turnText(chars, "Goth Bold"),
    Italic: turnText(chars, "Italic"),
    Slash: turnText(chars, "Slash"),
    Stem: turnText(chars, "Stem"),
    Strike: turnText(chars, "Strike"),
    Typewriter: turnText(chars, "Typewriter"),
    Wide: turnText(chars, "Wide"),
    "Alternating Case One": chars
      .map((c, i) => (i % 2 === 0 ? c : c.toUpperCase()))
      .join(""),
    "Alternating Case Two": chars
      .map((c, i) => (i % 2 === 0 ? c.toUpperCase() : c))
      .join(""),
  };

  return ret;
};
