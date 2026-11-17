/**
 * api.js – programmatic API for extending the layout at runtime.
 *
 * Register a reusable part type with a custom drawing routine, then place
 * any number of parts of it (run in the console or from your own script):
 *
 *   PCB.registerType("relay", {
 *     draw: function (p, g) {
 *       PCB.el("rect", { x: p.x, y: p.y, width: p.w, height: p.h, rx: 1,
 *         fill: "#1a1a1a", stroke: "#c46a6a", "stroke-width": 0.4 }, g);
 *     }
 *   });
 *   PCB.addPart({ type: "relay", n: "Relay K1", x: 55, y: 55, w: 15, h: 12,
 *                 d: "30 A relay for the fan output." });
 *
 * Parts without a registered type are drawn as plain labelled boxes.
 * A working demo lives in examples/custom-parts.js.
 *
 * Exposes: addPart(spec).
 */
(function () {

  /**
   * Add a part to the layout programmatically.
   *
   * spec fields:
   *   type  – key of a registered type (see PCB.registerType); omit for a
   *           plain labelled box
   *   n     – display name                     (default: "Part #N")
   *   x, y  – position in mm, top-left corner  (default: 5, 5)
   *   w, h  – size in mm                       (default: 10 × 10)
   *   d     – description for the info panel   (default: "")
   *   lbl   – short label drawn on plain boxes (default: the name)
   *   color – outline colour of plain boxes    (default: "#3a4a56")
   *
   * Returns the created part object (also appended to PCB.PARTS).
   */
  PCB.addPart = function (spec) {
    if (!spec || typeof spec !== "object") {
      throw new Error("PCB.addPart: expected a spec object");
    }
    if (spec.type && !PCB.TYPES[spec.type]) {
      throw new Error('PCB.addPart: unknown type "' + spec.type +
                      '" – register it with PCB.registerType() first');
    }

    const p = Object.assign({}, spec);
    if (!p.n) p.n = "Part #" + (PCB.PARTS.length + 1);
    if (!isFinite(p.x)) p.x = 5;
    if (!isFinite(p.y)) p.y = 5;
    if (!isFinite(p.w) || p.w <= 0) p.w = 10;
    if (!isFinite(p.h) || p.h <= 0) p.h = 10;
    if (!p.d) p.d = "";

    PCB.normalizePart(p);
    PCB.PARTS.push(p);
    PCB.renderPart(p);
    PCB.buildStats();
    return p;
  };
})();
