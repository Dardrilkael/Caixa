/**
 * svg.js – SVG scaffolding.
 *
 * Provides the `el()` element helper, keeps a reference to the root <svg>,
 * creates the layer groups (creation order = stacking order) and draws the
 * bare board outline plus the four mounting holes.
 */
(function () {

  const svg = document.getElementById("svg");
  PCB.svg = svg;

  /** Create an SVG element, set attributes and append it to `parent` (or the root). */
  PCB.el = function (tag, attrs, parent) {
    const e = document.createElementNS(PCB.NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    (parent || svg).appendChild(e);
    return e;
  };

  // Bare board outline – bottom of the z-order.
  PCB.el("rect", {
    x: 0, y: 0, width: PCB.BOARD.W, height: PCB.BOARD.H, rx: 2,
    fill: "var(--board)", stroke: "var(--boardline)", "stroke-width": 0.8
  });

  // Layer groups. Creation order fixes the stacking order:
  // parts → LDO annotation → holes → TFT → board dims → keypad.
  PCB.layers = {
    parts:  PCB.el("g", {}),   // PCB parts (movable)
    ldo:    PCB.el("g", {}),   // fixed "5× AS1117" annotation
    holes:  PCB.el("g", {}),   // corner mounting holes
    tft:    PCB.el("g", {}),   // floating TFT display
    dims:   PCB.el("g", {}),   // board dimension annotations
    keypad: PCB.el("g", {})    // off-board keypad
  };

  // Mounting holes in the four board corners.
  const W = PCB.BOARD.W, H = PCB.BOARD.H;
  [[3, 3], [W - 3, 3], [3, H - 3], [W - 3, H - 3]].forEach(function (h) {
    PCB.el("circle", {
      cx: h[0], cy: h[1], r: 1.6, fill: "var(--bg)",
      stroke: "var(--boardline)", "stroke-width": 0.4
    }, PCB.layers.holes);
  });
})();
