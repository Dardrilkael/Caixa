/**
 * ui.js – user interface: info panel, layer toggles and the stats row.
 *
 * Exposes: show(p), bindToggles(), buildStats().
 */
(function () {

  const info = document.getElementById("info");
  const svg = PCB.svg;

  /** Show a part's details (size, position, rotation, offset) plus controls. */
  PCB.show = function (p) {
    let html = "<b>" + p.n + "</b> – " + p.w + " × " + p.h + " mm at (" + p.x + ", " + p.y + ").";
    if (p.rot) html += " Rotated " + p.rot + "°.";
    if (p.tx || p.ty) html += " Offset (" + (p.tx || 0).toFixed(1) + ", " + (p.ty || 0).toFixed(1) + ") mm.";
    html += " " + p.d;
    info.innerHTML = html;

    const bar = document.createElement("div");
    bar.className = "rot-bar";
    const b1 = document.createElement("button");
    b1.textContent = "⟲ −45°";
    b1.onclick = function () { PCB.rotatePart(p, -45); };
    const b2 = document.createElement("button");
    b2.textContent = "⟳ +45°";
    b2.onclick = function () { PCB.rotatePart(p, 45); };
    const b3 = document.createElement("button");
    b3.textContent = "↺ Reset";
    b3.onclick = function () { PCB.resetPart(p); };
    bar.appendChild(b1);
    bar.appendChild(b2);
    bar.appendChild(b3);
    info.appendChild(bar);
  };

  /** Checkbox → show/hide a whole layer group. */
  function bindDisplay(id, group) {
    document.getElementById(id).onchange = function () {
      group.style.display = this.checked ? "" : "none";
    };
  }

  /** Checkbox → toggle a CSS class on the <svg> (hides elements by class). */
  function bindClass(id, cls) {
    document.getElementById(id).onchange = function () {
      svg.classList.toggle(cls, !this.checked);
    };
  }

  /** Wire up the five layer checkboxes. */
  PCB.bindToggles = function () {
    bindDisplay("tDisp", PCB.layers.tft);
    bindDisplay("tKey",  PCB.layers.keypad);
    bindClass("tNoise",  "hide-keepout");
    bindClass("tLbl",    "hide-labels");
    bindClass("tDim",    "hide-dims");
  };

  /** Build the stats row: footprint totals and board utilisation. */
  PCB.buildStats = function () {
    let sum = 0;
    PCB.PARTS.forEach(function (p) { sum += p.w * p.h; });

    const W = PCB.BOARD.W, H = PCB.BOARD.H, K = PCB.KEYPAD;
    const rows = [
      [sum.toFixed(0) + " mm²",  "component footprints"],
      [(W * H) + " mm²",         "board area"],
      [(sum / (W * H) * 100).toFixed(0) + " %", "utilization"],
      ["~18–20 mm",              "display standoff height"],
      [(K.w * K.h) + " mm²",     "4×3 keypad (off-board)"]
    ];

    document.getElementById("stats").innerHTML = rows.map(function (s) {
      return '<div class="stat"><b>' + s[0] + '</b><span>' + s[1] + '</span></div>';
    }).join("");
  };
})();
