/**
 * examples/custom-parts.js – demonstration of the programmatic API.
 *
 * This file is NOT loaded by index.html. To try it, add one line to the
 * script block at the bottom of index.html, after js/api.js:
 *
 *   <script src="examples/custom-parts.js"></script>
 *
 * It registers a reusable "relay" part type, places two relays and adds
 * one part without a registered type (drawn as a plain labelled box).
 */
(function () {

  // 1. Register a reusable part type with a custom drawing routine.
  //    All coordinates must come from p.x / p.y / p.w / p.h so the part
  //    can be resized and rotated in the UI.
  PCB.registerType("relay", {
    draw: function (p, g) {
      PCB.el("rect", { x: p.x, y: p.y, width: p.w, height: p.h, rx: 1,
        fill: "#1a1a1a", stroke: "#c46a6a", "stroke-width": 0.4 }, g);
      PCB.el("rect", { x: p.x + p.w / 2 - 2, y: p.y + 1.5, width: 4, height: p.h - 3,
        rx: 0.5, fill: "#7a3535" }, g);
    }
  });

  // 2. Place two parts of that type (in the free strip below the LDO row).
  PCB.addPart({ type: "relay", n: "Relay K1 (fan)", x: 5, y: 41.5, w: 15, h: 7,
                d: "30 A relay for the fan output." });
  PCB.addPart({ type: "relay", n: "Relay K2 (pump)", x: 22, y: 41.5, w: 15, h: 7,
                d: "30 A relay for the pump output." });

  // 3. A part without a registered type is drawn as a plain labelled box.
  PCB.addPart({ n: "Buzzer", x: 97, y: 33.5, w: 7, h: 6, lbl: "BUZ",
                d: "Passive buzzer, drawn with the default box renderer." });
})();
