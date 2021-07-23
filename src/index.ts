import glyphMap, { validGlyphs } from "./glyphMap";
import { TextStyles } from "./types";

const mapInput = (text: string): TextStyles => {
  const chars = text.split("");

  const ret = {
    italic: chars.map((c) => glyphMap[c].italic).join(""),
    bold: chars.map((c) => glyphMap[c].bold).join(""),
    boldItalic: chars.map((c) => glyphMap[c].boldItalic).join(""),
    cursive: chars.map((c) => glyphMap[c].cursive).join(""),
    cursiveBold: chars.map((c) => glyphMap[c].cursiveBold).join(""),
    goth: chars.map((c) => glyphMap[c].goth).join(""),
    gothBold: chars.map((c) => glyphMap[c].gothBold).join(""),
    box: chars.map((c) => glyphMap[c].box).join(""),
    boxFilled: chars.map((c) => glyphMap[c].boxFilled).join(""),
    stemOutline: chars.map((c) => glyphMap[c].stemOutline).join(""),
    wide: chars.map((c) => glyphMap[c].wide).join(""),
    circle: chars.map((c) => glyphMap[c].circle).join(""),
    typewriter: chars.map((c) => glyphMap[c].typewriter).join(""),
  };

  return ret;
};

(() => {
  document.querySelector("input").addEventListener("keyup", (e) => {
    const filtered = e.target.value
      .split("")
      .filter((v) => validGlyphs.includes(v))
      .join("");

    document.querySelector("div[name=bold]").innerHTML =
      mapInput(filtered).bold;

    document.querySelector("div[name=boldItalic]").innerHTML =
      mapInput(filtered).boldItalic;

    document.querySelector("div[name=cursive]").innerHTML =
      mapInput(filtered).cursive;

    document.querySelector("div[name=cursiveBold]").innerHTML =
      mapInput(filtered).cursiveBold;

    document.querySelector("div[name=goth]").innerHTML =
      mapInput(filtered).goth;

    document.querySelector("div[name=gothBold]").innerHTML =
      mapInput(filtered).gothBold;

    document.querySelector("div[name=box]").innerHTML = mapInput(filtered).box;

    document.querySelector("div[name=boxFilled]").innerHTML =
      mapInput(filtered).boxFilled;

    document.querySelector("div[name=stemOutline]").innerHTML =
      mapInput(filtered).stemOutline;

    document.querySelector("div[name=wide]").innerHTML =
      mapInput(filtered).wide;

    document.querySelector("div[name=circle]").innerHTML =
      mapInput(filtered).circle;

    document.querySelector("div[name=typewriter]").innerHTML =
      mapInput(filtered).typewriter;
  });
})();
