/**
 * render-parts.js – drawing routines for the parts on the bare PCB.
 *
 * Every part is drawn inside its own movable wrapper group and can be
 * re-drawn in place (needed when the user edits its size). Drawing
 * routines are organised in a type registry, so new part types can be
 * added from code via PCB.registerType(key, def) / PCB.addPart(spec).
 *
 * Exposes: renderParts(), renderPart(p), redrawPart(p), registerType(key, def).
 */
(function () {

  /* -- RP2350B (WeAct) main MCU board ----------------------------------- */
  function drawRP2350(p, g, gMove) {
    PCB.el("rect", { x: p.x, y: p.y, width: p.w, height: p.h, rx: 1,
      fill: "#1a1a1a", stroke: "#333", "stroke-width": 0.3 }, g);
    for (let j = 0; j < 10; j++) {
      PCB.el("circle", { cx: p.x, cy: p.y + 4 + j * 3.5, r: 0.8, fill: "#d4af37" }, g);
      PCB.el("circle", { cx: p.x + p.w, cy: p.y + 4 + j * 3.5, r: 0.8, fill: "#d4af37" }, g);
    }
    PCB.el("rect", { x: p.x + p.w / 2 - 4, y: p.y - 1, width: 8, height: 4, rx: 1,
      fill: "#a0a0a0", stroke: "#555", "stroke-width": 0.2 }, g);
    PCB.el("rect", { x: p.x + p.w / 2 - 5, y: p.y + p.h / 2 - 5, width: 10, height: 10,
      fill: "#111", stroke: "#444", "stroke-width": 0.2 }, g);
    const txt = PCB.el("text", { x: p.x + p.w / 2, y: p.y + p.h - 4, "font-size": 2.8,
      fill: "#fff", "text-anchor": "middle", class: "svg-text part-label" }, gMove);
    txt.textContent = "RP2350B";
  }

  /* -- ESP32 DevKit placeholder ------------------------------------------ */
  function drawESP32(p, g, gMove) {
    PCB.el("rect", { x: p.x, y: p.y, width: p.w, height: p.h, rx: 1,
      fill: "#1a1a1a", stroke: "#333", "stroke-width": 0.3 }, g);
    PCB.el("rect", { x: p.x + p.w - 6, y: p.y + 2, width: 4, height: p.h - 4, rx: 1,
      fill: "#d4af37" }, g);
    for (let j = 0; j < 8; j++) {
      PCB.el("rect", { x: p.x, y: p.y + 3 + j * 3, width: 2, height: 1, fill: "#a0a0a0" }, g);
      PCB.el("rect", { x: p.x + p.w - 8, y: p.y + 3 + j * 3, width: 2, height: 1, fill: "#a0a0a0" }, g);
    }
    PCB.el("rect", { x: p.x + p.w / 2 - 6, y: p.y + p.h / 2 - 4, width: 12, height: 8,
      fill: "#222", stroke: "#444", "stroke-width": 0.2 }, g);
    const txt = PCB.el("text", { x: p.x + p.w / 2, y: p.y + p.h / 2 + 1.5, "font-size": 3,
      fill: "#fff", "text-anchor": "middle", class: "svg-text part-label" }, gMove);
    txt.textContent = "ESP32";
  }

  /* -- MP1584EN buck converter -------------------------------------------- */
  function drawBuck(p, g, gMove) {
    PCB.el("rect", { x: p.x, y: p.y, width: p.w, height: p.h, rx: 0.5,
      fill: "#0f4c81", stroke: "#1a6fb5", "stroke-width": 0.3 }, g);
    PCB.el("rect", { x: p.x + 12, y: p.y + 2, width: 8, height: 8, rx: 1.5,
      fill: "#444", stroke: "#222", "stroke-width": 0.3 }, g);
    PCB.el("circle", { cx: p.x + 16, cy: p.y + 6, r: 2.5,
      fill: "none", stroke: "#666", "stroke-width": 0.5 }, g);
    PCB.el("rect", { x: p.x + 2, y: p.y + 2, width: 6, height: 6,
      fill: "#0055cc", stroke: "#003380", "stroke-width": 0.3 }, g);
    PCB.el("circle", { cx: p.x + 5, cy: p.y + 5, r: 1.8, fill: "#ccc" }, g);
    PCB.el("line", { x1: p.x + 4, y1: p.y + 5, x2: p.x + 6, y2: p.y + 5,
      stroke: "#000", "stroke-width": 0.3 }, g);
    PCB.el("line", { x1: p.x + 5, y1: p.y + 4, x2: p.x + 5, y2: p.y + 6,
      stroke: "#000", "stroke-width": 0.3 }, g);
    [2, 6, 14, 18].forEach(function (px) {
      PCB.el("rect", { x: p.x + px, y: p.y + p.h - 2, width: 2, height: 2, fill: "#d4af37" }, g);
    });
    const txt = PCB.el("text", { x: p.x + p.w / 2, y: p.y + p.h / 2 + 1.5, "font-size": 2.5,
      fill: "#fff", "text-anchor": "middle", class: "svg-text part-label" }, gMove);
    txt.textContent = "MP1584";
  }

  /* -- AS1117 LDO on a vertical 1×3 pin bar (no label) --------------------- */
  function drawLDO(p, g) {
    PCB.el("rect", { x: p.x, y: p.y, width: p.w, height: p.h, rx: 0.3,
      fill: "#1a1a1a", stroke: "#444", "stroke-width": 0.2 }, g);
    PCB.el("rect", { x: p.x + 2, y: p.y, width: 3, height: 1, fill: "#a0a0a0" }, g);
    PCB.el("rect", { x: p.x + 1, y: p.y + p.h - 1, width: 1, height: 1, fill: "#a0a0a0" }, g);
    PCB.el("rect", { x: p.x + 3, y: p.y + p.h - 1, width: 1, height: 1, fill: "#a0a0a0" }, g);
    PCB.el("rect", { x: p.x + 5, y: p.y + p.h - 1, width: 1, height: 1, fill: "#a0a0a0" }, g);
  }

  /* -- CAN surge filter ----------------------------------------------------- */
  function drawCanFilter(p, g, gMove) {
    PCB.el("rect", { x: p.x, y: p.y, width: p.w, height: p.h, rx: 1,
      fill: "#1a1a1a", stroke: "#333", "stroke-width": 0.3 }, g);
    PCB.el("rect", { x: p.x + 4, y: p.y + 4, width: 10, height: 10, rx: 2,
      fill: "#333", stroke: "#555", "stroke-width": 0.3 }, g);
    PCB.el("rect", { x: p.x + 16, y: p.y + 4, width: 10, height: 10, rx: 2,
      fill: "#333", stroke: "#555", "stroke-width": 0.3 }, g);
    [2, 8, 14, 20, 26, 32].forEach(function (px) {
      PCB.el("rect", { x: p.x + px, y: p.y - 1, width: 2, height: 2, fill: "#d4af37" }, g);
      PCB.el("rect", { x: p.x + px, y: p.y + p.h - 1, width: 2, height: 2, fill: "#d4af37" }, g);
    });
    const txt = PCB.el("text", { x: p.x + p.w / 2, y: p.y + p.h / 2 + 1.5, "font-size": 2.8,
      fill: "#fff", "text-anchor": "middle", class: "svg-text part-label" }, gMove);
    txt.textContent = "CAN Filter";
  }

  /* -- WeAct ISOCANFD isolation module -------------------------------------- */
  function drawIsoCanFd(p, g, gMove) {
    PCB.el("rect", { x: p.x, y: p.y, width: p.w, height: p.h, rx: 1,
      fill: "#1a1a1a", stroke: "#333", "stroke-width": 0.3 }, g);
    PCB.el("rect", { x: p.x + 8, y: p.y + 3, width: 8, height: 9,
      fill: "#0a0a0a", stroke: "#444", "stroke-width": 0.2 }, g);
    PCB.el("rect", { x: p.x + 20, y: p.y + 3, width: 8, height: 9,
      fill: "#0a0a0a", stroke: "#444", "stroke-width": 0.2 }, g);
    PCB.el("rect", { x: p.x + p.w - 5, y: p.y + 2, width: 4, height: 4,
      fill: "#0f6b45", stroke: "#083d27", "stroke-width": 0.2 }, g);
    PCB.el("rect", { x: p.x + p.w - 5, y: p.y + 9, width: 4, height: 4,
      fill: "#0f6b45", stroke: "#083d27", "stroke-width": 0.2 }, g);
    const txt = PCB.el("text", { x: p.x + p.w / 2, y: p.y + p.h / 2 + 1.5, "font-size": 2.8,
      fill: "#fff", "text-anchor": "middle", class: "svg-text part-label" }, gMove);
    txt.textContent = "ISOCANFD";
  }

  /* -- Connector block: 12 V in, CAN terminal, SWD header ------------------- */
  function drawConnectors(p, g, gMove) {
    PCB.el("rect", { x: p.x, y: p.y, width: p.w, height: p.h, rx: 1,
      fill: "#1a1a1a", stroke: "#333", "stroke-width": 0.3 }, g);
    PCB.el("rect", { x: p.x + 2, y: p.y + 2, width: 12, height: p.h - 4,
      fill: "#0f6b45", stroke: "#083d27", "stroke-width": 0.3 }, g);
    PCB.el("circle", { cx: p.x + 6, cy: p.y + p.h / 2, r: 1.5, fill: "#a0a0a0" }, g);
    PCB.el("circle", { cx: p.x + 10, cy: p.y + p.h / 2, r: 1.5, fill: "#a0a0a0" }, g);
    PCB.el("rect", { x: p.x + 18, y: p.y + 2, width: 12, height: p.h - 4,
      fill: "#0f6b45", stroke: "#083d27", "stroke-width": 0.3 }, g);
    PCB.el("circle", { cx: p.x + 22, cy: p.y + p.h / 2, r: 1.5, fill: "#a0a0a0" }, g);
    PCB.el("circle", { cx: p.x + 26, cy: p.y + p.h / 2, r: 1.5, fill: "#a0a0a0" }, g);
    PCB.el("rect", { x: p.x + 34, y: p.y + 2, width: 10, height: p.h - 4,
      fill: "#222", stroke: "#555", "stroke-width": 0.3 }, g);
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 3; k++) {
        PCB.el("rect", { x: p.x + 36 + j * 4, y: p.y + 4 + k * 2.5, width: 1.5, height: 1.5,
          fill: "#d4af37" }, g);
      }
    }
    const txt = PCB.el("text", { x: p.x + p.w / 2, y: p.y + p.h / 2 + 1.5, "font-size": 2.8,
      fill: "#fff", "text-anchor": "middle", class: "svg-text part-label" }, gMove);
    txt.textContent = "Connectors";
  }

  /* -- Plain labelled box (fallback for parts without a drawing routine) ---- */
  function drawPlainBox(p, g, gMove) {
    PCB.el("rect", { x: p.x, y: p.y, width: p.w, height: p.h, rx: 1,
      fill: "#1a1a1a", stroke: p.color || "#3a4a56", "stroke-width": 0.4 }, g);
    const txt = PCB.el("text", { x: p.x + p.w / 2, y: p.y + p.h / 2 + 1.5, "font-size": 2.8,
      fill: "#fff", "text-anchor": "middle", class: "svg-text part-label" }, gMove);
    txt.textContent = p.lbl || p.n;
  }

  // =====================================================================
  //  TYPE REGISTRY
  // =====================================================================
  PCB.TYPES = {};

  /**
   * Register a reusable part type.
   * def fields:
   *   draw(p, g, gMove) – drawing routine (all coordinates from p.x/p.y/p.w/p.h)
   *   keepout           – true: draw a dashed noise keep-out around the part
   */
  PCB.registerType = function (key, def) {
    PCB.TYPES[key] = def;
  };

  // Built-in types (matching by key; the catalogue uses name/flag detection).
  PCB.registerType("rp2350",     { draw: drawRP2350 });
  PCB.registerType("esp32",      { draw: drawESP32 });
  PCB.registerType("buck",       { draw: drawBuck, keepout: true });
  PCB.registerType("ldo",        { draw: drawLDO });
  PCB.registerType("canfilter",  { draw: drawCanFilter });
  PCB.registerType("isocanfd",   { draw: drawIsoCanFd });
  PCB.registerType("connectors", { draw: drawConnectors });

  /** Fallback type detection for catalogue parts without an explicit `type`. */
  function detectType(p) {
    if (p.buck)                                return PCB.TYPES.buck;
    if (p.ldo)                                 return PCB.TYPES.ldo;
    if (p.n.indexOf("RP2350B") >= 0)           return PCB.TYPES.rp2350;
    if (p.n.indexOf("ESP32") >= 0)             return PCB.TYPES.esp32;
    if (p.n.indexOf("CAN surge filter") >= 0)  return PCB.TYPES.canfilter;
    if (p.n.indexOf("ISOCANFD") >= 0)          return PCB.TYPES.isocanfd;
    if (p.n.indexOf("Connectors") >= 0)        return PCB.TYPES.connectors;
    return null;
  }

  /** Draw a part (keep-out + body) into its wrapper group. */
  function drawPartInto(p, gMove) {
    const t = p.type ? PCB.TYPES[p.type] : detectType(p);

    // Noise keep-out (moves & rotates with the part).
    if (t && t.keepout) {
      PCB.el("rect", {
        x: p.x - 5, y: p.y - 5, width: p.w + 10, height: p.h + 10, rx: 3,
        fill: "var(--buck)", "fill-opacity": 0.13, stroke: "var(--buck)",
        "stroke-width": 0.3, "stroke-dasharray": "1.4 1", class: "keepout"
      }, gMove);
    }

    const g = PCB.el("g", { class: "part" }, gMove);
    if (t && t.draw) t.draw(p, g, gMove);
    else drawPlainBox(p, g, gMove);
  }

  /** Draw one part into a fresh movable wrapper on the parts layer. */
  PCB.renderPart = function (p) {
    const gMove = PCB.el("g", { class: "part-move" }, PCB.layers.parts);
    p._gMove = gMove;
    p._drawInto = function () { drawPartInto(p, gMove); };
    p._drawInto();

    PCB.makeDraggable(gMove, p);
    gMove.addEventListener("mouseenter", function () { PCB.show(p); });
    gMove.addEventListener("click",      function () { PCB.show(p); });
    return gMove;
  };

  /** Re-draw an existing part in place (after a size edit). */
  PCB.redrawPart = function (p) {
    const gMove = p._gMove;
    if (!gMove || !p._drawInto) return;
    while (gMove.firstChild) gMove.removeChild(gMove.firstChild);
    p._drawInto();
    if (p._apply) p._apply();
  };

  /** Render every part, then the fixed LDO group annotation. */
  PCB.renderParts = function () {
    PCB.PARTS.forEach(PCB.renderPart);

    const ldoLabel = PCB.el("text", {
      x: 72.5, y: 45.5, "font-size": 2.5, fill: "#fff",
      "text-anchor": "middle", class: "svg-text part-label"
    }, PCB.layers.ldo);
    ldoLabel.textContent = "5× AS1117";
  };
})();
