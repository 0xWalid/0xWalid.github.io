const { createCanvas } = require("@napi-rs/canvas");
const fs = require("fs");
const ROOT = "/home/noob/projects/website";
const src = fs.readFileSync(ROOT + "/js/writeups.js", "utf8");
const WRITEUPS = new Function(src + "; return WRITEUPS;")();
const OUT = ROOT + "/assets/og";
fs.mkdirSync(OUT, { recursive: true });

const difColor = { Easy: "#00e07f", Medium: "#ffb454", Hard: "#ff2d55", Insane: "#ff2d55" };

function wrap(x, text, maxW) {
  const words = text.split(" "), lines = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? cur + " " + w : w;
    if (x.measureText(test).width > maxW && cur) { lines.push(cur); cur = w; }
    else cur = test;
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

function drawCard(w, isSite) {
  const c = createCanvas(1200, 630), x = c.getContext("2d");
  x.fillStyle = "#0a0a0c"; x.fillRect(0, 0, 1200, 630);
  x.strokeStyle = "rgba(255,255,255,.05)";
  for (let i = 0; i <= 1200; i += 56) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 630); x.stroke(); }
  for (let i = 0; i <= 630; i += 56) { x.beginPath(); x.moveTo(0, i); x.lineTo(1200, i); x.stroke(); }
  const g = x.createRadialGradient(980, 80, 40, 980, 80, 650);
  g.addColorStop(0, "rgba(255,45,85,.25)"); g.addColorStop(1, "rgba(255,45,85,0)");
  x.fillStyle = g; x.fillRect(0, 0, 1200, 630);
  const dc = difColor[w.difficulty] || "#ff2d55";
  x.setLineDash([14, 10]); x.strokeStyle = dc; x.lineWidth = 3;
  x.strokeRect(46, 46, 1108, 538);
  x.setLineDash([]);
  x.font = "bold 26px monospace"; x.fillStyle = dc;
  x.fillText("[ " + (isSite ? "0XWALID.DEV" : String(w.platform).toUpperCase() + " // " + String(w.difficulty).toUpperCase()) + " ]", 90, 130);
  let title = isSite ? "Lab Notes" : w.title;
  x.font = "700 62px sans-serif"; x.fillStyle = "#eceae6";
  const lines = wrap(x, title, 1000);
  let ty = 230;
  for (const ln of lines.slice(0, 3)) { x.fillText(ln, 90, ty); ty += 72; }
  x.font = "500 28px monospace"; x.fillStyle = "#ff2d55";
  x.fillText("> waleed \u00b7 aka 0xWalid", 90, Math.min(ty + 30, 520));
  x.font = "400 24px sans-serif"; x.fillStyle = "#8f8f9a";
  const tldr = isSite
    ? "Security writeups, labs & AI security research"
    : String(w.tldr).slice(0, 90) + (String(w.tldr).length > 90 ? "…" : "");
  x.fillText(tldr, 90, Math.min(ty + 76, 560));
  fs.writeFileSync(OUT + "/" + w.slug + ".png", c.toBuffer("image/png"));
}

drawCard({ slug: "site", platform: "Portfolio", difficulty: "Hard", title: "" }, true);
let n = 1;
for (const w of WRITEUPS.filter(v => v.visible !== false)) { drawCard(w, false); n++; }
console.log("OG images:", n);
