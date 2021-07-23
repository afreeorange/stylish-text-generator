export type TextStyles = {
  italic: string;
  bold: string;
  boldItalic: string;
  cursive: string;
  cursiveBold: string;
  goth: string;
  gothBold: string;
  box: string;
  boxFilled: string;
  stemOutline: string;
  wide: string;
  circle: string;
  typewriter: string;
};

export type GlyphMap = {
  [glyph: string]: TextStyles;
};
