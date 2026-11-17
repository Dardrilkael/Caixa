/**
 * interact.js – drag & rotate engine.
 *
 * Each part is drawn inside a movable wrapper <g>. Its transform state
 * (tx, ty offset in mm and rot in degrees) lives on the part data object,
 * so `ui.js` can report it in the info panel. The rotation centre also
 * lives on the part (p._cx / p._cy) so resizePart() can move it.
 *
 * Exposes: makeDraggable(g, p), rotatePart(p, delta), resetPart(p),
 *          resizePart(p, w, h).
 */
(function () {

  const svg = PCB.svg;
  const _pt = svg.createSVGPoint();

  /** Convert a pointer event to SVG user-space coordinates. */
  function toSvg(e) {
    _pt.x = e.clientX;
    _pt.y = e.clientY;
    return _pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  /** Make a wrapper group draggable (pointer events) and rotatable (double-click). */
  PCB.makeDraggable = function (g, p) {
    let dragging = false, startX = 0, startY = 0, startTx = 0, startTy = 0;

    // Rotation centre lives on the part so resizePart() can move it.
    p._cx = p.x + p.w / 2;
    p._cy = p.y + p.h / 2;

    function apply() {
      g.setAttribute("transform",
        "translate(" + p.tx + "," + p.ty + ") rotate(" + p.rot + "," + p._cx + "," + p._cy + ")");
    }
    p._apply = apply;
    apply();

    g.addEventListener("pointerdown", function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      dragging = true;
      const s = toSvg(e);
      startX = s.x; startY = s.y;
      startTx = p.tx; startTy = p.ty;
      try { g.setPointerCapture(e.pointerId); } catch (_) { /* older browsers */ }
      g.style.cursor = "grabbing";
    });

    g.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      const s = toSvg(e);
      p.tx = startTx + (s.x - startX);
      p.ty = startTy + (s.y - startY);
      apply();
    });

    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      try { g.releasePointerCapture(e.pointerId); } catch (_) { /* ignore */ }
      g.style.cursor = "grab";
    }
    g.addEventListener("pointerup", endDrag);
    g.addEventListener("pointercancel", endDrag);

    g.addEventListener("dblclick", function (e) {
      e.preventDefault();
      PCB.rotatePart(p, 45);
    });

    g.style.cursor = "grab";
  };

  /** Rotate a part by `delta` degrees, kept in the [0, 360) range. */
  PCB.rotatePart = function (p, delta) {
    p.rot = (((p.rot || 0) + delta) % 360 + 360) % 360;
    if (p._apply) p._apply();
    PCB.show(p);
  };

  /** Change a part's footprint (mm): redraws it in place, refreshes stats. */
  PCB.resizePart = function (p, w, h) {
    p.w = w;
    p.h = h;
    p._cx = p.x + p.w / 2;
    p._cy = p.y + p.h / 2;
    PCB.redrawPart(p);
    if (p._apply) p._apply();
    PCB.buildStats();
  };

  /** Move a part back to its original position, angle and DEFAULT size. */
  PCB.resetPart = function (p) {
    p.tx = 0; p.ty = 0; p.rot = 0;
    if (p.defW !== undefined && (p.w !== p.defW || p.h !== p.defH)) {
      p.w = p.defW;
      p.h = p.defH;
      p._cx = p.x + p.w / 2;
      p._cy = p.y + p.h / 2;
      PCB.redrawPart(p);
      PCB.buildStats();
    }
    if (p._apply) p._apply();
    PCB.show(p);
  };
})();
