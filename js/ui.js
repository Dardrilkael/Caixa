/**
 * ui.js – user interface: info panel with part editor, layer toggles, stats.
 *
 * The info panel shows the selected part's summary, the rotate controls and
 * an editor bar: Name, Description and custom W/H inputs (mm). Each part
 * snapshots its default size (defW/defH), so ↺ Reset restores position,
 * rotation AND size.
 *
 * Exposes: show(p), bindToggles(), buildStats().
 */
(function () {

  const info = document.getElementById("info");
  const svg = PCB.svg;

  /** Minimal HTML escaping – name and description are user-editable now. */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /** One-line summary: size, position, rotation, offset, description. */
  function summaryHtml(p) {
    let html = "<b>" + esc(p.n) + "</b> – " + p.w + " × " + p.h + " mm at (" + p.x + ", " + p.y + ").";
    if (p.rot) html += " Rotated " + p.rot + "°.";
    if (p.tx || p.ty) html += " Offset (" + (p.tx || 0).toFixed(1) + ", " + (p.ty || 0).toFixed(1) + ") mm.";
    if (p.d) html += " " + esc(p.d);
    return html;
  }

  /** Editor bar: name, description and custom width/height inputs. */
  function buildEditor(p, summary) {
    const bar = document.createElement("div");
    bar.className = "edit-bar";

    function refresh() { summary.innerHTML = summaryHtml(p); }

    function addField(labelText, input) {
      const lab = document.createElement("label");
      lab.appendChild(document.createTextNode(labelText));
      lab.appendChild(input);
      bar.appendChild(lab);
      return input;
    }
    function textInput(value, width) {
      const input = document.createElement("input");
      input.type = "text";
      input.value = value;
      if (width) input.style.width = width;
      return input;
    }
    function numberInput(value) {
      const input = document.createElement("input");
      input.type = "number";
      input.min = 0.5;
      input.max = 500;
      input.step = 0.1;
      input.value = value;
      input.title = "Custom size in mm – default " + p.defW + " × " + p.defH +
                    " mm (↺ Reset restores it)";
      return input;
    }

    // -- Name & description: live edit, no redraw of the form (keeps focus) --
    addField("Name", textInput(p.n, "9em")).addEventListener("input", function () {
      p.n = this.value;
      refresh();
    });
    addField("Desc", textInput(p.d, "15em")).addEventListener("input", function () {
      p.d = this.value;
      refresh();
    });

    // -- Custom size: commits valid values while typing, fixes typos on blur --
    function commitSize() {
      const w = parseFloat(wIn.value), h = parseFloat(hIn.value);
      if (w > 0 && h > 0 && (w !== p.w || h !== p.h)) {
        PCB.resizePart(p, w, h);
        refresh();
      }
    }
    function correctSize() {
      const w = parseFloat(wIn.value), h = parseFloat(hIn.value);
      if (!(w > 0) || !(h > 0)) { wIn.value = p.w; hIn.value = p.h; }
    }
    const wIn = addField("W", numberInput(p.w));
    const hIn = addField("H", numberInput(p.h));
    wIn.addEventListener("input", commitSize);
    hIn.addEventListener("input", commitSize);
    wIn.addEventListener("change", correctSize);
    hIn.addEventListener("change", correctSize);

    const unit = document.createElement("span");
    unit.textContent = "mm";
    unit.className = "unit";
    bar.appendChild(unit);

    return bar;
  }

  /** Show a part's details plus rotate/reset controls and its editor bar. */
  PCB.show = function (p) {
    info.innerHTML = "";

    const summary = document.createElement("div");
    summary.innerHTML = summaryHtml(p);
    info.appendChild(summary);

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

    info.appendChild(buildEditor(p, summary));
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

    const W = PCB.BOARD.W, H = PCB.BOARD.H, K = PCB.KEYPAD_PART;
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
