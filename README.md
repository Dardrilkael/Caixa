# PCB Layout Demo – 110 × 90 mm

An interactive, to-scale PCB layout visualisation drawn entirely in vanilla SVG.
Top view of a 110 × 90 mm board: **drag any part** to move it and **double-click**
(or use the ⟲/⟳/Reset buttons in the info panel) to **rotate it in 45° steps**.
The 4×3 keypad (69 × 77 mm) is drawn to scale beside the board because it does
not fit on the PCB – it mounts on the front panel.

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
- Info panel shows live position, rotation and offset of the selected part
- Layer toggles: display, keypad, buck noise keep-outs, labels, dimensions
- Stats row: total footprint area, board area, utilisation

## Project structure

```
pcb23/
├── index.html            # markup + script load order (classic scripts, no bundler)
├── css/
│   └── style.css         # theme (CSS custom properties), layout, part styles
├── js/
│   ├── config.js         # geometry constants: board, TFT, keypad (1 unit = 1 mm)
│   ├── parts.js          # part catalogue – data only (name, position, size, notes)
│   ├── svg.js            # SVG scaffolding: el() helper, layer groups, board, holes
│   ├── interact.js       # drag & rotate engine (pointer events + transform state)
│   ├── ui.js             # info panel, layer toggles, stats row
│   ├── render-parts.js   # drawing routines for each part type on the PCB
│   ├── render-extras.js  # TFT display, keypad, board dimension annotations
│   └── main.js           # bootstrap: render everything, wire up the UI
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
  `render-extras.js` turn it into SVG. Adding a part means adding one entry
  to `PCB.PARTS` and (for a new part type) one drawing routine.
- **Transform state** (`tx`, `ty`, `rot`) lives on each part object; the
  wrapper group's `transform` attribute is rebuilt from it, so the info panel
  can always report the current offset and angle.
- **Layer toggles** either hide a whole SVG group (`display`, `keypad`) or
  toggle a CSS class on the `<svg>` root (`keepout`, `part-label`, `dims`).

## Running

Open `index.html` in any modern browser, or run a local dev server:

```bash
npm start          # uses npx serve (no install needed)
# or: python3 -m http.server 8000
```

Then visit the printed URL (e.g. http://localhost:3000).

## Customising

- **Board size** – `PCB.BOARD` in `js/config.js`.
- **Add a part** – append an entry to `PCB.PARTS` in `js/parts.js`
  (`n`, `x`, `y`, `w`, `h`, `d`, plus an optional type flag) and extend
  `drawBody()` in `js/render-parts.js` if it needs a new drawing routine.
- **Colors** – all theme colors are CSS custom properties at the top of
  `css/style.css`.
