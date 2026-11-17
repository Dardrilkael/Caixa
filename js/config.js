/**
 * config.js – board geometry and shared constants.
 *
 * All dimensions are in millimetres; the SVG uses 1 unit = 1 mm so the
 * layout is drawn exactly to scale.
 *
 * Every other file extends the global `PCB` namespace created here.
 */
window.PCB = window.PCB || {};

PCB.NS = "http://www.w3.org/2000/svg";

/** Bare board size. */
PCB.BOARD = { W: 110, H: 90 };

/** TFT 2.8″ display – floats above the board on standoffs. */
PCB.TFT = { x: 5, y: 5, w: 81.8, h: 50 };

/** 4×3 matrix keypad – mounted off-board on the front panel. */
PCB.KEYPAD = { x: 122, y: 6, w: 69, h: 77 };
