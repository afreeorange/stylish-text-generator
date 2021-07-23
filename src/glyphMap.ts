/**
a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z 1 2 3 4 5 6 7 8 9 0
*/

import {
  italic,
  bold,
  boldItalic,
  cursive,
  cursiveBold,
  goth,
  gothBold,
  box,
  boxFilled,
  stemOutline,
  wide,
  circle,
  typewriter,
} from "./glyphs";
import { GlyphMap } from "./types";

const base = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

const glyphMap: GlyphMap = {};

base.split("").forEach((char, i) => {
  glyphMap[char] = {
    italic: italic[i],
    bold: bold[i],
    boldItalic: boldItalic[i],
    cursive: cursive[i],
    cursiveBold: cursiveBold[i],
    goth: goth[i],
    gothBold: gothBold[i],
    box: box[i],
    boxFilled: boxFilled[i],
    stemOutline: stemOutline[i],
    wide: wide[i],
    circle: circle[i],
    typewriter: typewriter[i],
  };
});

export const validGlyphs = base.split("");

export default glyphMap;
