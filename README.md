# PCB Layout Demo – 110 × 90 mm

An interactive, to-scale PCB layout visualisation drawn entirely in vanilla SVG.
Top view of a 110 × 90 mm board: **drag any part** to move it and **double-click**
(or use the ⟲/⟳/Reset buttons in the info panel) to **rotate it in 45° steps**.
Every part can also be **resized, renamed and re-described** in the info panel,
and new parts can be **added programmatically**. The 4×3 keypad (69 × 77 mm) is
drawn to scale beside the board because it does not fit on the PCB – it mounts
on the front panel.

Refactored from a single-file demo (`PCB23.html`) into a structured,
dependency-free project. **No build step required** – open `index.html`
directly in a browser, or serve the folder with any static file server.

## Features

- To-scale drawing: 1 SVG unit = 1 mm, with 110 × 90 mm board dimensions
- 13 parts: RP2350B MCU board, ESP32 DevKit placeholder, CAN surge filter,
  ISOCANFD isolation module, 3× MP1584EN buck converters (with noise
  keep-outs), 5× vertical AS1117 LDOs, and the connector block
- Floating TFT 2.8″ display (81.8 × 50 mm) and off-board 4×3 keypad (69 × 77 mm)
- Drag (pointer/touch) and rotate (double-click or buttons) every piece
- Per-part editor: custom width/height, name and description inputs
- ↺ Reset restores the original position, rotation **and default size**
- Programmatic API: register part types and place parts from code
- Layer toggles: display, keypad, buck noise keep-outs, labels, dimensions
- Stats row: total footprint area, board area, utilisation (live)

## Project structure

```
pcb23/
├── index.html            # markup + script load order (classic scripts, no bundler)
├── css/
│   └── style.css         # theme (CSS custom properties), layout, part & editor styles
├── js/
│   ├── config.js         # geometry constants: board, TFT, keypad (1 unit = 1 mm)
│   ├── parts.js          # part catalogue – data only + normalizePart()
│   ├── svg.js            # SVG scaffolding: el() helper, layer groups, board, holes
│   ├── interact.js       # drag & rotate engine, resizePart(), resetPart()
│   ├── ui.js             # info panel + per-part editor, layer toggles, stats
│   ├── render-parts.js   # type registry + drawing routines for the PCB parts
│   ├── render-extras.js  # TFT display, keypad, board dimension annotations
│   ├── api.js            # PCB.addPart() – programmatic extension of the layout
│   └── main.js           # bootstrap: render everything, wire up the UI
├── examples/
│   └── custom-parts.js   # demo of the API (not loaded by default)
├── package.json          # project metadata + optional `npm start` dev server
├── .gitignore
└── .editorconfig
```

### How it works

Every file extends a single global `PCB` namespace, loaded in dependency order
(see the `<script>` tags at the bottom of `index.html`). Classic scripts were
chosen deliberately so the page also works when opened via `file://` — ES
modules would require a web server.

- **Data vs. drawing**: `parts.js` holds only data; `render-parts.js` /
  `render-extras.js` turn it into SVG. Each part stores its own re-draw
  closure (`p._drawInto`), so a size edit re-renders just that part.
- **Default size**: `normalizePart()` snapshots `defW`/`defH` on every part
  (including programmatically added ones). Custom W/H inputs change
  `p.w`/`p.h`; ↺ Reset restores the snapshot along with position/rotation.
- **Transform state** (`tx`, `ty`, `rot`) and the rotation centre
  (`p._cx`, `p._cy`) live on the part object; the wrapper group's
  `transform` attribute is rebuilt from them.
- **Type registry**: `PCB.TYPES` maps a type key to `{ draw, keepout }`.
  Built-in catalogue parts are matched by flags (`buck`, `ldo`) or name;
  new parts can name a registered `type` directly or fall back to a plain
  labelled box.
- **Layer toggles** either hide a whole SVG group (`display`, `keypad`) or
  toggle a CSS class on the `<svg>` root (`keepout`, `part-label`, `dims`).

## Editing parts in the UI

Click (or hover) any part – the info panel shows its summary plus an editor:

- **W / H** – custom size in mm; the part is re-drawn in place and the stats
  update. The inputs' tooltips show the default size.
- **Name / Desc** – rename the part and edit its description; the summary
  line updates as you type.
- **↺ Reset** – back to the original position, rotation and default size.
- The TFT display and the keypad are editable the same way; their dimension
  annotations and titles follow the new size.

## Programmatic API

```js
// 1. Register a reusable part type (drawing routine reads p.x/p.y/p.w/p.h
//    so resize & rotate keep working):
PCB.registerType("relay", {
  draw: function (p, g) {
    PCB.el("rect", { x: p.x, y: p.y, width: p.w, height: p.h, rx: 1,
      fill: "#1a1a1a", stroke: "#c46a6a", "stroke-width": 0.4 }, g);
  }
});

// 2. Place parts of it – they become fully interactive (drag/rotate/edit):
PCB.addPart({ type: "relay", n: "Relay K1", x: 55, y: 55, w: 15, h: 12,
              d: "30 A relay for the fan output." });

// 3. Without a registered type you get a plain labelled box:
PCB.addPart({ n: "Buzzer", x: 97, y: 33.5, w: 7, h: 6, lbl: "BUZ" });
```

`PCB.addPart()` validates and defaults the fields, appends to `PCB.PARTS`,
renders the part and refreshes the stats. A runnable demo (three extra
parts placed in free board space) is in `examples/custom-parts.js` – add
`<script src="examples/custom-parts.js"></script>` after `js/api.js` in
`index.html` to load it.

## Running

Open `index.html` in any modern browser, or run a local dev server:

```bash
npm start          # uses npx serve (no install needed)
# or: python3 -m http.server 8000
```

Then visit the printed URL (e.g. http://localhost:3000).

## Customising

- **Board size** – `PCB.BOARD` in `js/config.js`.
- **Add a part in code** – `PCB.registerType()` + `PCB.addPart()` (see above).
- **Add a part in data** – append an entry to `PCB.PARTS` in `js/parts.js`
  (`n`, `x`, `y`, `w`, `h`, `d`, plus an optional type flag) and register a
  drawing routine in `js/render-parts.js` if it needs a new one.
- **Colors** – all theme colors are CSS custom properties at the top of
  `css/style.css`.
