/**
 * ASCII DXF starts with optional comments (999) or SECTION; binary DXF starts
 * with a fixed marker. See AutoCAD DXF Reference — "Binary DXF Files".
 */
export function assertAsciiDxf(text: string): void {
  const t = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text
  if (t.startsWith('AutoCAD Binary DXF')) {
    throw new Error(
      'Binary DXF is not supported. Re-save the drawing as ASCII (text) DXF from your CAD application.',
    )
  }
}
