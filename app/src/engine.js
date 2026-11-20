// VICEFRAME poster engine.
// Renders a GTA-style multi-panel game cover onto a 2D canvas: graded photo
// panels with character callouts, a framed border, a gradient masthead that
// overlaps the art, and the full set of poster furniture (wanted stars, press
// quote, studio seal, barcode, billing block), finished with vignette + grain.

export const EXPORT_SIZES = [
  { id: "square", label: "Square · 1080 × 1080", w: 1080, h: 1080 },
  { id: "portrait", label: "Portrait · 1080 × 1350", w: 1080, h: 1350 },
  { id: "landscape", label: "Landscape · 1920 × 1080", w: 1920, h: 1080 },
  { id: "story", label: "Story · 1080 × 1920", w: 1080, h: 1920 },
];

export const CAST = [
  "THE DRIVER",
  "THE INSIDER",
  "THE RIDER",
  "THE BOSS",
  "THE COURIER",
  "THE FIXER",
  "THE LOOKOUT",
  "THE WHEELMAN",
  "THE GHOST",
];

// Panel rects are fractions of the canvas; rects() resolves them to pixels.
// `rot` (radians) marks the tilted snapshot layout.
export const LAYOUTS = [
  {
    id: "fever",
    label: "Fever — hero centre",
    rects: [
      { x: 0.345, y: 0.055, w: 0.31, h: 0.825 },
      { x: 0.035, y: 0.055, w: 0.285, h: 0.4 },
      { x: 0.035, y: 0.485, w: 0.285, h: 0.395 },
      { x: 0.68, y: 0.055, w: 0.285, h: 0.4 },
      { x: 0.68, y: 0.485, w: 0.285, h: 0.395 },
    ],
  },
  {
    id: "classic",
    label: "Classic — two over three",
    rects: [
      { x: 0.035, y: 0.05, w: 0.46, h: 0.44 },
      { x: 0.505, y: 0.05, w: 0.46, h: 0.44 },
      { x: 0.035, y: 0.51, w: 0.3033, h: 0.44 },
      { x: 0.3483, y: 0.51, w: 0.3033, h: 0.44 },
      { x: 0.6617, y: 0.51, w: 0.3033, h: 0.44 },
    ],
  },
  {
    id: "nine",
    label: "Nine — full grid",
    rects: [
      { x: 0.035, y: 0.05, w: 0.302, h: 0.292 },
      { x: 0.349, y: 0.05, w: 0.302, h: 0.292 },
      { x: 0.663, y: 0.05, w: 0.302, h: 0.292 },
      { x: 0.035, y: 0.354, w: 0.302, h: 0.292 },
      { x: 0.349, y: 0.354, w: 0.302, h: 0.292 },
      { x: 0.663, y: 0.354, w: 0.302, h: 0.292 },
      { x: 0.035, y: 0.658, w: 0.302, h: 0.292 },
      { x: 0.349, y: 0.658, w: 0.302, h: 0.292 },
      { x: 0.663, y: 0.658, w: 0.302, h: 0.292 },
    ],
  },
  {
    id: "fullbleed",
    label: "Full bleed — one big scene",
    rects: [
      { x: 0.0, y: 0.0, w: 1.0, h: 0.72 },
      { x: 0.012, y: 0.735, w: 0.3173, h: 0.225 },
      { x: 0.3413, y: 0.735, w: 0.3173, h: 0.225 },
      { x: 0.6707, y: 0.735, w: 0.3173, h: 0.225 },
    ],
  },
  {
    id: "tilted",
    label: "Tilted — snapshot stack",
    rects: [
      { x: 0.08, y: 0.13, w: 0.4, h: 0.34, rot: -0.06 },
      { x: 0.52, y: 0.09, w: 0.4, h: 0.34, rot: 0.05 },
      { x: 0.1, y: 0.55, w: 0.4, h: 0.34, rot: 0.04 },
      { x: 0.54, y: 0.53, w: 0.4, h: 0.34, rot: -0.05 },
    ],
  },
  {
    id: "split",
    label: "Split — two tall halves",
    rects: [
      { x: 0.03, y: 0.05, w: 0.455, h: 0.9 },
      { x: 0.515, y: 0.05, w: 0.455, h: 0.9 },
    ],
  },
];

// Each grade: a CSS filter for the photo, a 3-stop translucent wash laid over
// every panel, 4 masthead gradient stops, and the backdrop colour.
export const GRADES = [
  {
    id: "sunset",
    label: "Sunset Vice",
    filter: "saturate(1.28) contrast(1.08) brightness(1.03)",
    wash: ["rgba(255, 106, 0, 0.26)", "rgba(255, 46, 136, 0.16)", "rgba(34, 8, 74, 0.34)"],
    masthead: ["#ffe259", "#ffa751", "#ff2e88", "#b537f2"],
    backdrop: "#1b0b33",
  },
  {
    id: "neon",
    label: "Neon Nights",
    filter: "saturate(1.42) contrast(1.12) hue-rotate(-8deg)",
    wash: ["rgba(0, 229, 255, 0.20)", "rgba(140, 0, 255, 0.16)", "rgba(255, 0, 128, 0.26)"],
    masthead: ["#7bf1ff", "#37b6ff", "#ff2e88", "#ffe259"],
    backdrop: "#070b26",
  },
  {
    id: "golden",
    label: "Golden Hour",
    filter: "sepia(0.25) saturate(1.3) contrast(1.05) brightness(1.06)",
    wash: ["rgba(255, 183, 3, 0.22)", "rgba(251, 133, 0, 0.16)", "rgba(90, 30, 0, 0.30)"],
    masthead: ["#fff3b0", "#ffd60a", "#ff8500", "#e63946"],
    backdrop: "#241103",
  },
  {
    id: "teal",
    label: "Teal Coast",
    filter: "saturate(1.15) contrast(1.1) hue-rotate(12deg)",
    wash: ["rgba(0, 180, 216, 0.20)", "rgba(0, 119, 182, 0.14)", "rgba(2, 43, 66, 0.32)"],
    masthead: ["#c8fff4", "#64dfdf", "#ff70a6", "#ffd670"],
    backdrop: "#04252b",
  },
  {
    id: "candy",
    label: "Candy Pop",
    filter: "saturate(1.5) brightness(1.06) contrast(1.04)",
    wash: ["rgba(255, 175, 204, 0.22)", "rgba(255, 112, 166, 0.16)", "rgba(123, 44, 191, 0.28)"],
    masthead: ["#ffffff", "#ffd6ff", "#ff70a6", "#c77dff"],
    backdrop: "#2b0a2e",
  },
  {
    id: "noir",
    label: "Noir Heat",
    filter: "grayscale(0.85) contrast(1.26) brightness(0.96)",
    wash: ["rgba(255, 255, 255, 0.08)", "rgba(60, 60, 60, 0.12)", "rgba(0, 0, 0, 0.42)"],
    masthead: ["#ffffff", "#ced4da", "#e63946", "#6c757d"],
    backdrop: "#0a0a0a",
  },
];

// Frame: outer band colour, the gold "key" line, the inner line, and the band
// thickness as a fraction of the canvas's smaller dimension.
export const FRAMES = [
  { id: "purple", label: "Vice Purple", outer: "#160a2e", key: "#ffb703", inner: "#ff2e88", band: 0.03 },
  { id: "gold", label: "Gold Leaf", outer: "#140d02", key: "#ffd60a", inner: "#fff3b0", band: 0.03 },
  { id: "chrome", label: "Chrome", outer: "#101318", key: "#e9ecef", inner: "#adb5bd", band: 0.03 },
  { id: "white", label: "Gallery White", outer: "#f1f3f5", key: "#212529", inner: "#ff2e88", band: 0.03 },
  { id: "black", label: "Midnight Black", outer: "#050505", key: "#ffb703", inner: "#343a40", band: 0.03 },
];

export function layoutById(id) {
  return LAYOUTS.find((l) => l.id === id) || LAYOUTS[0];
}
export function gradeById(id) {
  return GRADES.find((g) => g.id === id) || GRADES[0];
}
export function frameById(id) {
  return FRAMES.find((f) => f.id === id) || FRAMES[0];
}

// A fresh set of panel states. fy defaults to 0.30 so portrait photos anchor
// toward the top of the frame — faces stay whole instead of being centre-cropped.
export function defaultPanelState(count) {
  const panels = [];
  for (let i = 0; i < count; i++) {
    panels.push({
      photo: null,
      label: CAST[i % CAST.length],
      fx: 0.5,
      fy: 0.3,
      zoom: 1,
      ox: 0,
      oy: 0,
    });
  }
  return panels;
}

// ---------------------------------------------------------------- helpers

function fitFontSize(ctx, text, family, maxSize, maxWidth) {
  let size = maxSize;
  ctx.font = `${size}px ${family}`;
  const width = ctx.measureText(text).width;
  if (width > maxWidth && width > 0) size = Math.max(6, (size * maxWidth) / width);
  ctx.font = `${size}px ${family}`;
  return size;
}

function starPath(ctx, cx, cy, r) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const x = cx + Math.cos(a) * rad;
    const y = cy + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

let grainPattern = null;
function getGrain(ctx) {
  if (grainPattern) return grainPattern;
  const tile = document.createElement("canvas");
  tile.width = 128;
  tile.height = 128;
  const tctx = tile.getContext("2d");
  const img = tctx.createImageData(128, 128);
  let seed = 1234567;
  for (let i = 0; i < img.data.length; i += 4) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const v = 110 + (seed % 145);
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  tctx.putImageData(img, 0, 0);
  grainPattern = ctx.createPattern(tile, "repeat");
  return grainPattern;
}

function seededBars(text) {
  let seed = 7;
  for (let i = 0; i < text.length; i++) seed = (seed * 31 + text.charCodeAt(i)) & 0x7fffffff;
  const bars = [];
  for (let i = 0; i < 30; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    bars.push(1 + (seed % 4));
  }
  return bars;
}

// ---------------------------------------------------------------- panels

function drawPanelPhoto(ctx, rect, panel, grade, img, min) {
  const { x, y, w, h } = rect;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  if (img && img.naturalWidth > 0) {
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(w / iw, h / ih) * (panel.zoom || 1);
    const dw = iw * scale;
    const dh = ih * scale;
    // Focal anchoring: fx/fy say where the image's slack goes. fy 0.30 keeps
    // the top of a portrait (the face) inside the panel.
    const dx = x + (w - dw) * (panel.fx ?? 0.5) + (panel.ox || 0) * w;
    const dy = y + (h - dh) * (panel.fy ?? 0.3) + (panel.oy || 0) * h;
    try {
      ctx.filter = grade.filter;
    } catch (e) {
      /* filter unsupported — draw raw */
    }
    ctx.drawImage(img, dx, dy, dw, dh);
    try {
      ctx.filter = "none";
    } catch (e) {
      /* noop */
    }
  } else {
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, "#2a1650");
    grad.addColorStop(1, "#120826");
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    fitFontSize(ctx, "ADD A PHOTO", "'Bebas Neue', sans-serif", min * 0.032, w * 0.8);
    ctx.fillText("ADD A PHOTO", x + w / 2, y + h / 2);
  }
  // Grade wash over the photo.
  const wash = ctx.createLinearGradient(x, y, x, y + h);
  wash.addColorStop(0, grade.wash[0]);
  wash.addColorStop(0.55, grade.wash[1]);
  wash.addColorStop(1, grade.wash[2]);
  ctx.fillStyle = wash;
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}

function drawCallout(ctx, rect, label, frame, min) {
  if (!label) return;
  const size = min * 0.027;
  ctx.font = `${size}px 'Bebas Neue', sans-serif`;
  const textW = ctx.measureText(label).width;
  const chipH = size * 1.5;
  const tickW = min * 0.009;
  const padX = min * 0.011;
  const chipW = tickW + padX + textW + padX * 0.7;
  const cx = rect.x + min * 0.012;
  const cy = rect.y + rect.h - min * 0.012 - chipH;
  ctx.fillStyle = "rgba(9, 3, 22, 0.85)";
  ctx.fillRect(cx, cy, chipW, chipH);
  ctx.fillStyle = frame.key;
  ctx.fillRect(cx, cy, tickW, chipH);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(label, cx + tickW + padX, cy + chipH / 2 + size * 0.05);
}

function drawPanel(ctx, rect, panel, grade, frame, img, min) {
  if (rect.rot) {
    const cx = rect.x + rect.w / 2;
    const cy = rect.y + rect.h / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rect.rot);
    const local = { x: -rect.w / 2, y: -rect.h / 2, w: rect.w, h: rect.h };
    // White snapshot border behind the photo.
    const b = min * 0.014;
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(local.x - b, local.y - b, local.w + b * 2, local.h + b * 2 + min * 0.02);
    drawPanelPhoto(ctx, local, panel, grade, img, min);
    ctx.strokeStyle = frame.inner;
    ctx.lineWidth = Math.max(1.5, min * 0.003);
    ctx.strokeRect(local.x, local.y, local.w, local.h);
    drawCallout(ctx, local, panel.label, frame, min);
    ctx.restore();
    return;
  }
  drawPanelPhoto(ctx, rect, panel, grade, img, min);
  ctx.strokeStyle = frame.inner;
  ctx.lineWidth = Math.max(1.5, min * 0.0035);
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  drawCallout(ctx, rect, panel.label, frame, min);
}

// ---------------------------------------------------------------- furniture

function drawFrame(ctx, W, H, frame, min) {
  const band = frame.band * min;
  ctx.strokeStyle = frame.outer;
  ctx.lineWidth = band;
  ctx.strokeRect(band / 2, band / 2, W - band, H - band);
  ctx.strokeStyle = frame.key;
  ctx.lineWidth = Math.max(2, min * 0.006);
  const k = band + min * 0.004;
  ctx.strokeRect(k, k, W - k * 2, H - k * 2);
  ctx.strokeStyle = frame.inner;
  ctx.lineWidth = Math.max(1.5, min * 0.003);
  const i2 = band + min * 0.011;
  ctx.strokeRect(i2, i2, W - i2 * 2, H - i2 * 2);
}

function drawStars(ctx, count, frame, W, H, min) {
  const r = min * 0.017;
  const gap = r * 2.45;
  const x0 = W * 0.052 + r;
  const cy = H * 0.048;
  for (let i = 0; i < 5; i++) {
    const cx = x0 + i * gap;
    starPath(ctx, cx, cy, r);
    if (i < count) {
      ctx.fillStyle = "#ffb703";
      ctx.fill();
    } else {
      ctx.fillStyle = "rgba(10, 4, 24, 0.45)";
      ctx.fill();
    }
    ctx.strokeStyle = "rgba(9, 3, 22, 0.85)";
    ctx.lineWidth = Math.max(1, min * 0.0022);
    ctx.stroke();
  }
  void frame;
}

function arcText(ctx, text, cx, cy, radius, startAngle, endAngle, flip) {
  const n = text.length;
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const a = startAngle + (endAngle - startAngle) * t;
    ctx.save();
    ctx.translate(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
    ctx.rotate(a + (flip ? -Math.PI / 2 : Math.PI / 2));
    ctx.fillText(text[i], 0, 0);
    ctx.restore();
  }
}

function drawSeal(ctx, state, frame, W, H, min) {
  const cx = W * 0.925;
  const cy = H * 0.845;
  const R = min * 0.062;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(13, 5, 28, 0.94)";
  ctx.fill();
  ctx.strokeStyle = frame.key;
  ctx.lineWidth = R * 0.075;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.8, 0, Math.PI * 2);
  ctx.strokeStyle = frame.inner;
  ctx.lineWidth = R * 0.045;
  ctx.stroke();
  ctx.fillStyle = "#ffd60a";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${R * 0.21}px 'Bebas Neue', sans-serif`;
  arcText(ctx, "VICEFRAME STUDIO", cx, cy, R * 0.63, -Math.PI * 0.78, -Math.PI * 0.22, false);
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  arcText(ctx, "ORIGINAL COVER ART", cx, cy, R * 0.63, Math.PI * 0.76, Math.PI * 0.24, true);
  starPath(ctx, cx, cy, R * 0.33);
  ctx.fillStyle = "#ffb703";
  ctx.fill();
  ctx.restore();
  void state;
}

function drawBarcode(ctx, state, W, H, min) {
  const bw = W * 0.078;
  const bh = H * 0.042;
  const x = W - min * 0.014 - bw;
  const y = H - min * 0.014 - bh;
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x, y, bw, bh);
  const bars = seededBars(state.title || "VICEFRAME");
  const unit = bw / bars.reduce((a, b) => a + b, 0);
  let bx = x;
  ctx.fillStyle = "#111111";
  const barH = bh * 0.68;
  for (const b of bars) {
    if (b % 2 === 1) ctx.fillRect(bx, y + bh * 0.08, unit * b * 0.72, barH);
    bx += unit * b;
  }
  ctx.fillStyle = "#111111";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  fitFontSize(ctx, "VICEFRAME · PALM BAY", "'Bebas Neue', sans-serif", bh * 0.2, bw * 0.9);
  ctx.fillText("VICEFRAME · PALM BAY", x + bw / 2, y + bh * 0.87);
  ctx.restore();
}

// ---------------------------------------------------------------- main render

// state: { layout, grade, frame, title, subtitle, quote, tagline, billing,
//          stars, panels: [panelState], photos: Map<id, HTMLImageElement> }
// Returns the resolved panel rects in pixels (for editor hit-testing).
export function renderPoster(ctx, W, H, state) {
  const grade = gradeById(state.grade);
  const frame = frameById(state.frame);
  const layout = layoutById(state.layout);
  const min = Math.min(W, H);

  ctx.save();
  ctx.fillStyle = grade.backdrop;
  ctx.fillRect(0, 0, W, H);

  const rects = layout.rects.map((r) => ({
    x: r.x * W,
    y: r.y * H,
    w: r.w * W,
    h: r.h * H,
    rot: r.rot || 0,
  }));

  rects.forEach((rect, i) => {
    const panel = state.panels[i] || defaultPanelState(1)[0];
    const img = panel.photo ? state.photos.get(panel.photo) : null;
    drawPanel(ctx, rect, panel, grade, frame, img, min);
  });

  drawFrame(ctx, W, H, frame, min);

  // ---- masthead: drawn after the panels so the title overlaps the art.
  const title = (state.title || "").toUpperCase();
  if (title) {
    let size = fitFontSize(ctx, title, "'Anton', sans-serif", H * 0.185, W * 0.94);
    if (size > H * 0.185) size = H * 0.185;
    ctx.font = `${size}px 'Anton', sans-serif`;
    const cy = H * 0.665;
    const grad = ctx.createLinearGradient(0, cy - size * 0.55, 0, cy + size * 0.55);
    grade.masthead.forEach((c, i) => grad.addColorStop(i / (grade.masthead.length - 1), c));
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#160a2e";
    ctx.lineWidth = size * 0.085;
    ctx.strokeText(title, W / 2, cy);
    ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
    ctx.shadowBlur = min * 0.012;
    ctx.shadowOffsetY = min * 0.005;
    ctx.fillStyle = grad;
    ctx.fillText(title, W / 2, cy);
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    if (state.subtitle) {
      const sSize = fitFontSize(ctx, state.subtitle, "'Pacifico', cursive", H * 0.052, W * 0.52);
      ctx.font = `${sSize}px 'Pacifico', cursive`;
      ctx.save();
      ctx.translate(W * 0.635, cy + size * 0.52);
      ctx.rotate(-0.03);
      ctx.strokeStyle = "#160a2e";
      ctx.lineWidth = sSize * 0.11;
      ctx.strokeText(state.subtitle, 0, 0);
      ctx.fillStyle = "#ff5da2";
      ctx.fillText(state.subtitle, 0, 0);
      ctx.restore();
    }
  }

  // ---- top row furniture: stars left, quote centre, volume right.
  drawStars(ctx, state.stars ?? 5, frame, W, H, min);
  if (state.quote) {
    ctx.fillStyle = frame.key;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    fitFontSize(ctx, state.quote, "'Bebas Neue', sans-serif", min * 0.028, W * 0.58);
    ctx.fillText(state.quote, W / 2, H * 0.048);
  }
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.font = `${min * 0.026}px 'Bebas Neue', sans-serif`;
  ctx.fillText("VOL. 1", W * 0.948, H * 0.048);

  // ---- bottom furniture.
  if (state.tagline) {
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    fitFontSize(ctx, state.tagline, "'Bebas Neue', sans-serif", min * 0.034, W * 0.8);
    ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
    ctx.shadowBlur = min * 0.007;
    ctx.shadowOffsetY = min * 0.0025;
    try {
      ctx.letterSpacing = "2px";
    } catch (e) {
      /* older canvas — fine without */
    }
    ctx.fillText(state.tagline, W / 2, H * 0.905);
    try {
      ctx.letterSpacing = "0px";
    } catch (e) {
      /* noop */
    }
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  }
  drawSeal(ctx, state, frame, W, H, min);
  drawBarcode(ctx, state, W, H, min);
  if (state.billing) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    fitFontSize(ctx, state.billing, "'Bebas Neue', sans-serif", min * 0.02, W * 0.76);
    ctx.fillText(state.billing, W / 2, H * 0.972);
  }

  // ---- finish: vignette, then tiled grain at 5% alpha.
  const vig = ctx.createRadialGradient(W / 2, H / 2, min * 0.36, W / 2, H / 2, Math.max(W, H) * 0.72);
  vig.addColorStop(0, "rgba(0, 0, 0, 0)");
  vig.addColorStop(1, "rgba(0, 0, 0, 0.38)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  const pattern = getGrain(ctx);
  if (pattern) {
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  ctx.restore();
  return rects;
}
