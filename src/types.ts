export type StyleMap = {
  bold: string;
  boldItalic: string;
  box: string;
  boxFilled: string;
  circle: string;
  cursive: string;
  cursiveBold: string;
  goth: string;
  gothBold: string;
  italic: string;
  stemOutline: string;
  typewriter: string;
  wide: string;
  alternatingCaseOne?: string;
  alternatingCaseTwo?: string;
};

export type GlyphMap = {
  [glyph: string]: StyleMap;
};

export type TextStyles = keyof StyleMap;