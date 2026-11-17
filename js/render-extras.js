/**
 * render-extras.js – the floating TFT display, the off-board 4×3 keypad
 * and the board dimension annotations.
 *
 * TFT and keypad are drawn from the part object (not the config constants),
 * so their size can be edited in the UI; annotations follow the size.
 *
 * Exposes: renderTFT(), renderKeypad(), renderBoardDims().
 */
(function () {

  /* -- TFT 2.8″ display body (dashed outline: floats above the board) ----- */
  function drawTFT(p, gMove) {
    // Invisible hit area so the whole outline is grabbable.
    PCB.el("rect", { x: p.x, y: p.y, width: p.w, height: p.h,
      fill: "transparent", "pointer-events": "all" }, gMove);
    PCB.el("rect", { x: p.x, y: p.y, width: p.w, height: p.h, rx: 2,
      fill: "none", stroke: "var(--disp)", "stroke-width": 0.6,
      "stroke-dasharray": "4 2" }, gMove);
    PCB.el("rect", { x: p.x + 2, y: p.y + 2, width: p.w - 4, height: p.h - 4, rx: 1.5,
      fill: "none", stroke: "#555", "stroke-width": 0.3 }, gMove);
    PCB.el("rect", { x: p.x + 8, y: p.y + 8, width: p.w - 16, height: p.h - 16, rx: 1,
      fill: "#000", stroke: "#333", "stroke-width": 0.3, "fill-opacity": 0.6 }, gMove);
    PCB.el("rect", { x: p.x + p.w / 2 - 15, y: p.y + p.h - 4, width: 30, height: 3, rx: 0.5,
      fill: "#c8981b", stroke: "#8a6810", "stroke-width": 0.2 }, gMove);
    const dt = PCB.el("text", { x: p.x + p.w / 2, y: p.y + 6, "font-size": 3,
      fill: "var(--fg)", "text-anchor": "middle", class: "svg-text part-label" }, gMove);
    dt.textContent = "TFT 2.8″ " + p.w + " × " + p.h + " mm (Floating)";
  }

  /* -- 4×3 matrix keypad body (off-board / front panel) ------------------- */
  function drawKeypad(p, gMove) {
    // Panel body.
    PCB.el("rect", { x: p.x, y: p.y, width: p.w, height: p.h, rx: 2.5,
      fill: "#12191f", stroke: "var(--key)", "stroke-width": 0.7,
      "stroke-dasharray": "4 2" }, gMove);
    PCB.el("rect", { x: p.x + 1.5, y: p.y + 1.5, width: p.w - 3, height: p.h - 3, rx: 2,
      fill: "none", stroke: "#2a3742", "stroke-width": 0.3 }, gMove);

    // Key grid.
    const mL = 5.5, mT = 5.5, kGap = 2.5;
    const kw = (p.w - 2 * mL - 2 * kGap) / 3;
    const kh = (p.h - 2 * mT - 3 * kGap) / 4;
    const labels = [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], ["*", "0", "#"]];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        const x = p.x + mL + c * (kw + kGap);
        const y = p.y + mT + r * (kh + kGap);
        PCB.el("rect", { x: x, y: y, width: kw, height: kh, rx: 1.6,
          fill: "#24313c", stroke: "#41535f", "stroke-width": 0.35 }, gMove);
        const t = PCB.el("text", { x: x + kw / 2, y: y + kh / 2 + 2.1, "font-size": 6,
          fill: "#e6edf3", "text-anchor": "middle", class: "svg-text" }, gMove);
        t.textContent = labels[r][c];
      }
    }

    // 8-way FPC tail on the bottom edge.
    PCB.el("rect", { x: p.x + p.w / 2 - 12, y: p.y + p.h, width: 24, height: 3.2, rx: 0.4,
      fill: "#c8981b", stroke: "#8a6810", "stroke-width": 0.2 }, gMove);
    for (let f = 0; f < 8; f++) {
      PCB.el("rect", { x: p.x + p.w / 2 - 10.5 + f * 2.7, y: p.y + p.h + 0.6,
        width: 1.4, height: 2, fill: "#8a6810", "fill-opacity": 0.7 }, gMove);
    }

    // Mounting posts.
    [[p.x + 2.6,       p.y + 2.6],
     [p.x + p.w - 2.6, p.y + 2.6],
     [p.x + 2.6,       p.y + p.h - 2.6],
     [p.x + p.w - 2.6, p.y + p.h - 2.6]].forEach(function (h) {
      PCB.el("circle", { cx: h[0], cy: h[1], r: 1,
        fill: "#0f1216", stroke: "#3a4a56", "stroke-width": 0.3 }, gMove);
    });

    // Dimensions.
    PCB.el("text", { x: p.x + p.w / 2, y: p.y - 2.6, "font-size": 3,
      fill: "var(--mut)", "text-anchor": "middle", class: "dims" }, gMove)
      .textContent = p.w + " mm";
    PCB.el("line", { x1: p.x, y1: p.y - 1.2, x2: p.x + p.w, y2: p.y - 1.2,
      stroke: "var(--mut)", "stroke-width": 0.35, class: "dims" }, gMove);
    const vk = PCB.el("text", {
      x: p.x - 4.5, y: p.y + p.h / 2, "font-size": 3, fill: "var(--mut)",
      "text-anchor": "middle", class: "dims",
      transform: "rotate(-90 " + (p.x - 4.5) + " " + (p.y + p.h / 2) + ")"
    }, gMove);
    vk.textContent = p.h + " mm";
    PCB.el("line", { x1: p.x - 2, y1: p.y, x2: p.x - 2, y2: p.y + p.h,
      stroke: "var(--mut)", "stroke-width": 0.35, class: "dims" }, gMove);

    // Title.
    const kt = PCB.el("text", { x: p.x + p.w / 2, y: p.y + p.h + 9, "font-size": 3,
      fill: "var(--fg)", "text-anchor": "middle", class: "svg-text part-label" }, gMove);
    kt.textContent = "4×3 matrix keypad – " + p.w + " × " + p.h + " mm";
  }

  /** Wire a wrapper group to a part: draw it, make it draggable & editable. */
  function mountExtra(p, layer, drawBody) {
    const gMove = PCB.el("g", { class: "part-move" }, layer);
    p._gMove = gMove;
    p._drawInto = function () { drawBody(p, gMove); };
    p._drawInto();

    PCB.makeDraggable(gMove, p);
    gMove.addEventListener("mouseenter", function () { PCB.show(p); });
    gMove.addEventListener("click",      function () { PCB.show(p); });
    return gMove;
  }

  PCB.renderTFT = function () {
    mountExtra(PCB.TFT_PART, PCB.layers.tft, drawTFT);
  };

  PCB.renderKeypad = function () {
    mountExtra(PCB.KEYPAD_PART, PCB.layers.keypad, drawKeypad);
  };

  /* -- Board dimensions (fixed annotation layer) --------------------------- */
  PCB.renderBoardDims = function () {
    const W = PCB.BOARD.W, H = PCB.BOARD.H, layer = PCB.layers.dims;

    PCB.el("text", { x: W / 2, y: -4.5, "font-size": 3,
      fill: "var(--mut)", "text-anchor": "middle", class: "dims" }, layer)
      .textContent = "110 mm";
    PCB.el("line", { x1: 0, y1: -2, x2: W, y2: -2,
      stroke: "var(--mut)", "stroke-width": 0.35, class: "dims" }, layer);
    const vt = PCB.el("text", {
      x: -5, y: H / 2, "font-size": 3, fill: "var(--mut)",
      "text-anchor": "middle", class: "dims",
      transform: "rotate(-90 -5 " + H / 2 + ")"
    }, layer);
    vt.textContent = "90 mm";
    PCB.el("line", { x1: -2, y1: 0, x2: -2, y2: H,
      stroke: "var(--mut)", "stroke-width": 0.35, class: "dims" }, layer);
  };
})();
