/**
 * render-extras.js – the floating TFT display, the off-board 4×3 keypad
 * and the board dimension annotations.
 *
 * Exposes: renderTFT(), renderKeypad(), renderBoardDims().
 */
(function () {

  /* -- TFT 2.8″ display (dashed outline: floats above the board) ---------- */
  PCB.renderTFT = function () {
    const D = PCB.TFT, p = PCB.TFT_PART;
    const gMove = PCB.el("g", { class: "part-move" }, PCB.layers.tft);

    // Invisible hit area so the whole outline is grabbable.
    PCB.el("rect", { x: D.x, y: D.y, width: D.w, height: D.h,
      fill: "transparent", "pointer-events": "all" }, gMove);
    PCB.el("rect", { x: D.x, y: D.y, width: D.w, height: D.h, rx: 2,
      fill: "none", stroke: "var(--disp)", "stroke-width": 0.6,
      "stroke-dasharray": "4 2" }, gMove);
    PCB.el("rect", { x: D.x + 2, y: D.y + 2, width: D.w - 4, height: D.h - 4, rx: 1.5,
      fill: "none", stroke: "#555", "stroke-width": 0.3 }, gMove);
    PCB.el("rect", { x: D.x + 8, y: D.y + 8, width: D.w - 16, height: D.h - 16, rx: 1,
      fill: "#000", stroke: "#333", "stroke-width": 0.3, "fill-opacity": 0.6 }, gMove);
    PCB.el("rect", { x: D.x + D.w / 2 - 15, y: D.y + D.h - 4, width: 30, height: 3, rx: 0.5,
      fill: "#c8981b", stroke: "#8a6810", "stroke-width": 0.2 }, gMove);
    const dt = PCB.el("text", { x: D.x + D.w / 2, y: D.y + 6, "font-size": 3,
      fill: "var(--fg)", "text-anchor": "middle", class: "svg-text part-label" }, gMove);
    dt.textContent = "TFT 2.8″ 81.8 × 50 mm (Floating)";

    PCB.makeDraggable(gMove, p);
    gMove.addEventListener("mouseenter", function () { PCB.show(p); });
    gMove.addEventListener("click",      function () { PCB.show(p); });
  };

  /* -- 4×3 matrix keypad (69 × 77 mm, off-board / front panel) ------------ */
  PCB.renderKeypad = function () {
    const K = PCB.KEYPAD, p = PCB.KEYPAD_PART;
    const gMove = PCB.el("g", { class: "part-move" }, PCB.layers.keypad);

    // Panel body.
    PCB.el("rect", { x: K.x, y: K.y, width: K.w, height: K.h, rx: 2.5,
      fill: "#12191f", stroke: "var(--key)", "stroke-width": 0.7,
      "stroke-dasharray": "4 2" }, gMove);
    PCB.el("rect", { x: K.x + 1.5, y: K.y + 1.5, width: K.w - 3, height: K.h - 3, rx: 2,
      fill: "none", stroke: "#2a3742", "stroke-width": 0.3 }, gMove);

    // Key grid.
    const mL = 5.5, mT = 5.5, kGap = 2.5;
    const kw = (K.w - 2 * mL - 2 * kGap) / 3;
    const kh = (K.h - 2 * mT - 3 * kGap) / 4;
    const labels = [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], ["*", "0", "#"]];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        const x = K.x + mL + c * (kw + kGap);
        const y = K.y + mT + r * (kh + kGap);
        PCB.el("rect", { x: x, y: y, width: kw, height: kh, rx: 1.6,
          fill: "#24313c", stroke: "#41535f", "stroke-width": 0.35 }, gMove);
        const t = PCB.el("text", { x: x + kw / 2, y: y + kh / 2 + 2.1, "font-size": 6,
          fill: "#e6edf3", "text-anchor": "middle", class: "svg-text" }, gMove);
        t.textContent = labels[r][c];
      }
    }

    // 8-way FPC tail on the bottom edge.
    PCB.el("rect", { x: K.x + K.w / 2 - 12, y: K.y + K.h, width: 24, height: 3.2, rx: 0.4,
      fill: "#c8981b", stroke: "#8a6810", "stroke-width": 0.2 }, gMove);
    for (let f = 0; f < 8; f++) {
      PCB.el("rect", { x: K.x + K.w / 2 - 10.5 + f * 2.7, y: K.y + K.h + 0.6,
        width: 1.4, height: 2, fill: "#8a6810", "fill-opacity": 0.7 }, gMove);
    }

    // Mounting posts.
    [[K.x + 2.6,       K.y + 2.6],
     [K.x + K.w - 2.6, K.y + 2.6],
     [K.x + 2.6,       K.y + K.h - 2.6],
     [K.x + K.w - 2.6, K.y + K.h - 2.6]].forEach(function (h) {
      PCB.el("circle", { cx: h[0], cy: h[1], r: 1,
        fill: "#0f1216", stroke: "#3a4a56", "stroke-width": 0.3 }, gMove);
    });

    // Dimensions.
    PCB.el("text", { x: K.x + K.w / 2, y: K.y - 2.6, "font-size": 3,
      fill: "var(--mut)", "text-anchor": "middle", class: "dims" }, gMove)
      .textContent = "69 mm";
    PCB.el("line", { x1: K.x, y1: K.y - 1.2, x2: K.x + K.w, y2: K.y - 1.2,
      stroke: "var(--mut)", "stroke-width": 0.35, class: "dims" }, gMove);
    const vk = PCB.el("text", {
      x: K.x - 4.5, y: K.y + K.h / 2, "font-size": 3, fill: "var(--mut)",
      "text-anchor": "middle", class: "dims",
      transform: "rotate(-90 " + (K.x - 4.5) + " " + (K.y + K.h / 2) + ")"
    }, gMove);
    vk.textContent = "77 mm";
    PCB.el("line", { x1: K.x - 2, y1: K.y, x2: K.x - 2, y2: K.y + K.h,
      stroke: "var(--mut)", "stroke-width": 0.35, class: "dims" }, gMove);

    // Title.
    const kt = PCB.el("text", { x: K.x + K.w / 2, y: K.y + K.h + 9, "font-size": 3,
      fill: "var(--fg)", "text-anchor": "middle", class: "svg-text part-label" }, gMove);
    kt.textContent = "4×3 matrix keypad – 69 × 77 mm";

    PCB.makeDraggable(gMove, p);
    gMove.addEventListener("mouseenter", function () { PCB.show(p); });
    gMove.addEventListener("click",      function () { PCB.show(p); });
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
