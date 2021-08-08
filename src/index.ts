import glyphMap, { validGlyphs } from "./glyphMap";
import { StyleMap, TextStyles } from "./types";

const turnText = (chars: string[], style: TextStyles) =>
  chars.map((c) => (validGlyphs.includes(c) ? glyphMap[c][style] : c)).join("");

const mapInput = (text: string): StyleMap => {
  const chars = text.split("");

  const ret = {
    bold: turnText(chars, "bold"),
    boldItalic: turnText(chars, "boldItalic"),
    superscript: turnText(chars, "superscript"),
    subscript: turnText(chars, "subscript"),
    box: turnText(chars, "box"),
    boxFilled: turnText(chars, "boxFilled"),
    circle: turnText(chars, "circle"),
    cursive: turnText(chars, "cursive"),
    cursiveBold: turnText(chars, "cursiveBold"),
    goth: turnText(chars, "goth"),
    gothBold: turnText(chars, "gothBold"),
    italic: turnText(chars, "italic"),
    stemOutline: turnText(chars, "stemOutline"),
    typewriter: turnText(chars, "typewriter"),
    wide: turnText(chars, "wide"),
    alternatingCaseOne: chars
      .map((c, i) => (i % 2 === 0 ? c : c.toUpperCase()))
      .join(""),
    alternatingCaseTwo: chars
      .map((c, i) => (i % 2 === 0 ? c.toUpperCase() : c))
      .join(""),
  };

  return ret;
};

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

(() => {
  $("input").addEventListener("keyup", (e) =>
    ([
      "italic",
      "bold",
      "boldItalic",
      "superscript",
      "subscript",
      "cursive",
      "cursiveBold",
      "goth",
      "gothBold",
      "box",
      "boxFilled",
      "stemOutline",
      "wide",
      "circle",
      "typewriter",
      "alternatingCaseOne",
      "alternatingCaseTwo",
    ] as TextStyles[]).map((style) => {
      $(`div[name=${style}]`).innerHTML = mapInput(e.target.value)[style];
    })
  );
})();
