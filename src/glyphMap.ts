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
  stemOutline,
  typewriter,
  wide,
} from "./glyphs";
import { GlyphMap } from "./types";

const glyphMap: GlyphMap = {};

base.forEach((char, i) => {
  glyphMap[char] = {
    bold: bold[i],
    boldItalic: boldItalic[i],
    box: box[i],
    boxFilled: boxFilled[i],
    circle: circle[i],
    cursive: cursive[i],
    cursiveBold: cursiveBold[i],
    goth: goth[i],
    gothBold: gothBold[i],
    italic: italic[i],
    stemOutline: stemOutline[i],
    typewriter: typewriter[i],
    wide: wide[i],
  };
});

export const validGlyphs = base;

export default glyphMap;
