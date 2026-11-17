/**
 * parts.js – catalogue of every part shown on the layout (data only).
 *
 * Part fields:
 *   n       – label shown in the info panel
 *   x, y    – position on the board (mm, top-left corner)
 *   w, h    – footprint size (mm)
 *   d       – description shown in the info panel
 *   buck    – flag: MP1584EN buck converter (gets a noise keep-out)
 *   ldo     – flag: vertical AS1117 LDO on a pin bar
 *   type    – key of a registered drawing type (see render-parts.js);
 *             omit for name/flag-based detection or a plain box
 *
 * normalizePart() adds the transform state (tx, ty, rot) and snapshots the
 * default size (defW, defH) which ↺ Reset restores after custom sizing.
 */
(function () {

  PCB.PARTS = [
    { n: "RP2350B (WeAct)",              x: 5,    y: 5,    w: 41.4, h: 41.1,
      d: "Main MCU board, 41.4 × 41.1 mm." },
    { n: "ESP32 (Gabriel’s) – placeholder", x: 49.5, y: 5, w: 54,  h: 28,
      d: "Placeholder 54 × 28 mm DevKit. Antenna at the right edge." },
    { n: "CAN surge filter",             x: 5,    y: 49.5, w: 36.5, h: 19.04,
      d: "36.5 × 19.04 mm. SP00S12 surge suppressor." },
    { n: "WeAct ISOCANFD",               x: 44.5, y: 51,   w: 35,   h: 15,
      d: "35 × 15 mm. Isolation barrier free of ground plane." },
    { n: "MP1584EN #1",                  x: 83,   y: 49.5, w: 22,   h: 17,
      d: "22 × 17 mm, 12 V → 5 V buck.", buck: 1 },
    { n: "MP1584EN #2",                  x: 5,    y: 71,   w: 22,   h: 17,
      d: "22 × 17 mm, 12 V → 5 V buck.", buck: 1 },
    { n: "MP1584EN #3 (optional)",       x: 30,   y: 71,   w: 22,   h: 17,
      d: "22 × 17 mm, optional third buck.", buck: 1 },
    { n: "Connectors (12 V, CAN, SWD)",  x: 58,   y: 73,   w: 46,   h: 12,
      d: "Power in, CAN terminal and programming header." }
  ];

  // Five vertical AS1117 LDOs on 1×3 pin bars, 9 mm pitch.
  for (let i = 0; i < 5; i++) {
    PCB.PARTS.push({
      n: "AS1117 LDO #" + (i + 1), x: 51 + i * 9, y: 37, w: 7, h: 3,
      d: "Vertical 1×3 pin bar, footprint ≈ 7 × 3 mm, 5 V → 3V3.", ldo: 1
    });
  }

  /**
   * Normalise a part: snapshot the default size (kept untouched so ↺ Reset
   * can restore it) and initialise the movable / rotatable state.
   */
  PCB.normalizePart = function (p) {
    if (p.defW === undefined) p.defW = p.w;
    if (p.defH === undefined) p.defH = p.h;
    if (p.tx === undefined) p.tx = 0;
    if (p.ty === undefined) p.ty = 0;
    if (p.rot === undefined) p.rot = 0;
    return p;
  };

  PCB.PARTS.forEach(PCB.normalizePart);

  /** The floating TFT display (not part of the PCB itself). */
  PCB.TFT_PART = Object.assign({}, PCB.TFT, {
    n: "TFT 2.8″ display (floating)",
    d: "81.8 × 50 mm TFT panel, floats above the board.",
    tx: 0, ty: 0, rot: 0
  });
  PCB.normalizePart(PCB.TFT_PART);

  /** The 4×3 matrix keypad, mounted off-board on the front panel. */
  PCB.KEYPAD_PART = Object.assign({}, PCB.KEYPAD, {
    n: "4×3 matrix keypad (off-board)",
    d: "69 × 77 mm membrane keypad, 4 rows × 3 columns (1–9, *, 0, #), " +
       "8-way FPC tail on the bottom edge. Mounted on the front panel – " +
       "it does not fit on the 110 × 90 mm PCB.",
    tx: 0, ty: 0, rot: 0
  });
  PCB.normalizePart(PCB.KEYPAD_PART);
})();
