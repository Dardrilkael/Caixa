/**
 * main.js – bootstrap: draw everything and wire up the UI.
 */
(function () {
  PCB.renderParts();      // parts on the bare PCB
  PCB.renderTFT();        // floating display
  PCB.renderKeypad();     // off-board keypad
  PCB.renderBoardDims();  // 110 × 90 mm annotations
  PCB.bindToggles();      // layer checkboxes
  PCB.buildStats();       // footprint totals / utilisation
})();
