/* Generates raster app icons from the favicon.svg design (drawn on canvas).
   Run: node tools/gen-icons.js   (needs @napi-rs/canvas) */
const { createCanvas } = require("@napi-rs/canvas");
const fs = require("fs");
const ROOT = "/home/noob/projects/website";

function drawIcon(size) {
  const c = createCanvas(size, size), x = c.getContext("2d");
  const s = size / 64; // favicon.svg viewBox is 64x64
  // rounded dark background
  const r = 12 * s;
  x.fillStyle = "#0a0a0c";
  x.beginPath();
  x.moveTo(r, 0); x.arcTo(size, 0, size, size, r); x.arcTo(size, size, 0, size, r);
  x.arcTo(0, size, 0, 0, r); x.arcTo(0, 0, size, 0, r); x.closePath(); x.fill();

  x.strokeStyle = "#ff2d55";
  x.lineJoin = "miter"; x.lineCap = "butt";

  // top-left corner bracket: M14 20 L8 20 L8 8 L20 8 L20 14
  x.lineWidth = 3 * s;
  x.beginPath();
  x.moveTo(14 * s, 20 * s); x.lineTo(8 * s, 20 * s); x.lineTo(8 * s, 8 * s);
  x.lineTo(20 * s, 8 * s); x.lineTo(20 * s, 14 * s); x.stroke();
  // bottom-right corner bracket: M50 44 L56 44 L56 56 L44 56 L44 50
  x.beginPath();
  x.moveTo(50 * s, 44 * s); x.lineTo(56 * s, 44 * s); x.lineTo(56 * s, 56 * s);
  x.lineTo(44 * s, 56 * s); x.lineTo(44 * s, 50 * s); x.stroke();

  // reticle ring (r=13, opacity .4)
  x.globalAlpha = 0.4; x.lineWidth = 2 * s;
  x.beginPath(); x.arc(32 * s, 32 * s, 13 * s, 0, Math.PI * 2); x.stroke();
  x.globalAlpha = 1;
  // center dot (r=6)
  x.fillStyle = "#ff2d55";
  x.beginPath(); x.arc(32 * s, 32 * s, 6 * s, 0, Math.PI * 2); x.fill();

  return c.toBuffer("image/png");
}

for (const [name, size] of [["apple-touch-icon", 180], ["icon-192", 192], ["icon-512", 512]]) {
  fs.writeFileSync(ROOT + "/assets/" + name + ".png", drawIcon(size));
  console.log("wrote assets/" + name + ".png (" + size + "px)");
}
