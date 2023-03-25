/**
 * Add new stuff here. We don't add the `base` module.
 * NOTE: This style of importing is only for the latest and greatest.
 */

const LISTS_OF_GLYPHS: readonly Glyph[] = [
  (await import("./bold")).default,
  (await import("./boldItalic")).default,
  (await import("./box")).default,
  (await import("./boxFilled")).default,
  (await import("./circle")).default,
  (await import("./cursive")).default,
  (await import("./cursiveBold")).default,
  (await import("./goth")).default,
  (await import("./gothBold")).default,
  (await import("./italic")).default,
  (await import("./slashSymbol")).default,
  (await import("./smallCaps")).default,
  (await import("./stemOutline")).default,
  (await import("./strike")).default,
  (await import("./subscript")).default,
  (await import("./superscript")).default,
  (await import("./typewriter")).default,
  (await import("./upsideDown")).default,
  (await import("./wide")).default,
] as const;

/* --- The rest is bean-counting --- */

import base from "./base";

export type Glyph = {
  name: string;
  glyphs: string[];
};

const STYLES = [...LISTS_OF_GLYPHS.map((_) => _.name)] as const;
// export const Styles = typeof STYLES[number]; // TODO: Why doesn't this work?

// Make a lookup map.
const LOOKUP: Record<string, Record<string, string>> = {};
base.glyphs.map((char, idx) => {
  LOOKUP[char] = {};

  LISTS_OF_GLYPHS.map((_) => {
    LOOKUP[char][_.name] = _.glyphs[idx];
  });
});

// Make some functions to look up a string. Lots of optimism here...
const process = (chars: string[], style: string): string =>
  chars.map((c) => (base.glyphs.includes(c) ? LOOKUP[c][style] : c)).join("");

export const generate = (s: string): Record<string, string> => {
  const chars = s.split("");
  let ret: Record<string, string> = {};

  // throw Error("lol");

  STYLES.map((style) => {
    ret[style] = process(chars, style);
  });

  // Now add some unmappable stuff
  ret = {
    ...ret,
    "Alternating Case (One)": chars
      .map((c, i) => (i % 2 === 0 ? c : c.toUpperCase()))
      .join(""),
    "Alternating Case (Two)": chars
      .map((c, i) => (i % 2 === 0 ? c.toUpperCase() : c))
      .join(""),
    "Alternating Case (Random)": chars
      .map((c) =>
        Boolean(Math.round(Math.random()))
          ? c.toLocaleUpperCase()
          : c.toLocaleLowerCase()
      )
      .join(""),
  };

  // Return text sorted by style name to be nice
  return Object.keys(ret)
    .sort()
    .reduce((accumulator: Record<string, string>, key) => {
      accumulator[key] = ret[key];
      return accumulator;
    }, {});
};
