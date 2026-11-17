/**
 * render-parts.js – drawing routines for the parts on the bare PCB.
 *
 * Each part gets its own movable wrapper group; the keep-out of a buck
 * converter lives inside that wrapper so it moves & rotates with the part.
 *
 * Exposes: renderParts().
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

  /** Pick the right drawing routine for a part. */
  function drawBody(p, g, gMove) {
    if (p.n.indexOf("RP2350B") >= 0)            drawRP2350(p, g, gMove);
    else if (p.n.indexOf("ESP32") >= 0)         drawESP32(p, g, gMove);
    else if (p.buck)                            drawBuck(p, g, gMove);
    else if (p.ldo)                             drawLDO(p, g);
    else if (p.n.indexOf("CAN surge filter") >= 0) drawCanFilter(p, g, gMove);
    else if (p.n.indexOf("ISOCANFD") >= 0)      drawIsoCanFd(p, g, gMove);
    else if (p.n.indexOf("Connectors") >= 0)    drawConnectors(p, g, gMove);
  }

  /** Render every part, then the fixed LDO group annotation. */
  PCB.renderParts = function () {
    PCB.PARTS.forEach(function (p) {
      const gMove = PCB.el("g", { class: "part-move" }, PCB.layers.parts);

      // Buck noise keep-out (moves & rotates with the buck).
      if (p.buck) {
        PCB.el("rect", {
          x: p.x - 5, y: p.y - 5, width: p.w + 10, height: p.h + 10, rx: 3,
          fill: "var(--buck)", "fill-opacity": 0.13, stroke: "var(--buck)",
          "stroke-width": 0.3, "stroke-dasharray": "1.4 1", class: "keepout"
        }, gMove);
      }

      const g = PCB.el("g", { class: "part" }, gMove);
      drawBody(p, g, gMove);

      PCB.makeDraggable(gMove, p);
      gMove.addEventListener("mouseenter", function () { PCB.show(p); });
      gMove.addEventListener("click",      function () { PCB.show(p); });
    });

    const ldoLabel = PCB.el("text", {
      x: 72.5, y: 45.5, "font-size": 2.5, fill: "#fff",
      "text-anchor": "middle", class: "svg-text part-label"
    }, PCB.layers.ldo);
    ldoLabel.textContent = "5× AS1117";
  };
})();
