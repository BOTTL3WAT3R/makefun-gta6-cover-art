// VICEFRAME editor: the studio UI around the poster engine.
// State lives in one object; every edit snapshots it (JSON) onto an undo
// stack. Photos live in a Map shared by reference so snapshots stay cheap.
// Boot also handles the screenshot mode: ?shot=<scene>&size=<W>x<H> applies a
// deterministic scene from shots.js, hides the chrome (unless the scene is
// "editor"), renders once and raises window.__shotReady.

import {
  EXPORT_SIZES,
  FRAMES,
  GRADES,
  LAYOUTS,
  defaultPanelState,
  frameById,
  gradeById,
  layoutById,
  renderPoster,
} from "./engine.js";
import { loadSamples, sceneState } from "./shots.js";

const canvas = document.getElementById("poster");
const ctx = canvas.getContext("2d");
const controlsEl = document.getElementById("controls");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");

let photos = new Map();
let state = null;
let lastRects = [];
let selectedPhotoId = null;
let undoStack = [];
let redoStack = [];
let uploadCount = 0;

const SERIAL_KEYS = ["layout", "grade", "frame", "title", "subtitle", "quote", "tagline", "billing", "stars", "panels"];

function snapshot() {
  const snap = {};
  for (const k of SERIAL_KEYS) snap[k] = state[k];
  return JSON.parse(JSON.stringify(snap));
}

function applySnapshot(snap) {
  for (const k of SERIAL_KEYS) state[k] = snap[k];
  state.photos = photos;
}

function commit() {
  undoStack.push(snapshot());
  if (undoStack.length > 80) undoStack.shift();
  redoStack = [];
  syncHistoryButtons();
}

function undo() {
  if (!undoStack.length) return;
  redoStack.push(snapshot());
  applySnapshot(undoStack.pop());
  syncHistoryButtons();
  rebuildPanelInputs();
  refreshControlStates();
  syncTextInputs();
  render();
}

function redo() {
  if (!redoStack.length) return;
  undoStack.push(snapshot());
  applySnapshot(redoStack.pop());
  syncHistoryButtons();
  rebuildPanelInputs();
  refreshControlStates();
  syncTextInputs();
  render();
}

function syncHistoryButtons() {
  undoBtn.disabled = undoStack.length === 0;
  redoBtn.disabled = redoStack.length === 0;
}

function render() {
  if (!state) return;
  lastRects = renderPoster(ctx, canvas.width, canvas.height, state);
}

// ------------------------------------------------------------ control builders

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

function section(title) {
  const sec = el("section", "ctl-section");
  sec.appendChild(el("h2", null, title));
  controlsEl.appendChild(sec);
  return sec;
}

function choiceRow(items, getId, onPick, dataAttr) {
  const row = el("div", "btn-row");
  for (const item of items) {
    const b = el("button", "chip", item.label);
    b.type = "button";
    b.dataset[dataAttr] = item.id;
    b.addEventListener("click", () => {
      if (getId() === item.id) return;
      commit();
      onPick(item.id);
      refreshControlStates();
      render();
    });
    row.appendChild(b);
  }
  return row;
}

let layoutRow, gradeRow, frameRow, trayEl, panelInputsEl;
const textInputs = {};
let starsRange, starsValue;

function markActive(row, attr, id) {
  if (!row) return;
  row.querySelectorAll("button").forEach((b) => {
    b.classList.toggle("active", b.dataset[attr] === id);
  });
}

function refreshControlStates() {
  markActive(layoutRow, "layout", state.layout);
  markActive(gradeRow, "grade", state.grade);
  markActive(frameRow, "frame", state.frame);
  if (starsRange) {
    starsRange.value = String(state.stars);
    starsValue.textContent = String(state.stars);
  }
}

function syncTextInputs() {
  for (const key of Object.keys(textInputs)) {
    if (document.activeElement !== textInputs[key]) textInputs[key].value = state[key] || "";
  }
}

function rebuildTray() {
  trayEl.innerHTML = "";
  for (const [id, img] of photos) {
    const b = el("button", "thumb" + (id === selectedPhotoId ? " selected" : ""));
    b.type = "button";
    b.title = id;
    const thumb = document.createElement("img");
    thumb.src = img.src;
    thumb.alt = id;
    b.appendChild(thumb);
    b.appendChild(el("span", null, id));
    b.addEventListener("click", () => {
      selectedPhotoId = selectedPhotoId === id ? null : id;
      rebuildTray();
    });
    trayEl.appendChild(b);
  }
  if (photos.size === 0) trayEl.appendChild(el("p", "hint", "No photos yet — load the sample cast or add your own."));
}

function rebuildPanelInputs() {
  panelInputsEl.innerHTML = "";
  state.panels.forEach((panel, i) => {
    const wrap = el("label", "field");
    wrap.appendChild(el("span", null, `Panel ${i + 1} callout`));
    const input = document.createElement("input");
    input.type = "text";
    input.value = panel.label || "";
    input.addEventListener("focus", () => commit());
    input.addEventListener("input", () => {
      panel.label = input.value.toUpperCase();
      render();
    });
    wrap.appendChild(input);
    panelInputsEl.appendChild(wrap);
  });
}

function setLayout(id) {
  state.layout = id;
  const count = layoutById(id).rects.length;
  const kept = state.panels.slice(0, count);
  while (kept.length < count) {
    const fresh = defaultPanelState(count);
    kept.push(fresh[kept.length]);
  }
  state.panels = kept;
  rebuildPanelInputs();
}

function buildControls() {
  const layoutSec = section("Layout");
  layoutRow = choiceRow(LAYOUTS, () => state.layout, setLayout, "layout");
  layoutSec.appendChild(layoutRow);

  const gradeSec = section("Colour grade");
  gradeRow = choiceRow(GRADES, () => state.grade, (id) => (state.grade = id), "grade");
  gradeSec.appendChild(gradeRow);

  const frameSec = section("Frame");
  frameRow = choiceRow(FRAMES, () => state.frame, (id) => (state.frame = id), "frame");
  frameSec.appendChild(frameRow);

  const photoSec = section("Photos");
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.multiple = true;
  fileInput.className = "file-input";
  fileInput.addEventListener("change", () => addUploads(fileInput.files));
  photoSec.appendChild(fileInput);
  const photoBtns = el("div", "btn-row");
  const loadBtn = el("button", "chip", "Load sample cast");
  loadBtn.type = "button";
  loadBtn.addEventListener("click", async () => {
    const samples = await loadSamples();
    for (const [id, img] of samples) photos.set(id, img);
    rebuildTray();
    render();
  });
  const fillBtn = el("button", "chip", "One photo fills all panels");
  fillBtn.type = "button";
  fillBtn.addEventListener("click", () => {
    const id = selectedPhotoId || state.panels.find((p) => p.photo)?.photo || photos.keys().next().value;
    if (!id) return;
    commit();
    state.panels.forEach((p) => (p.photo = id));
    render();
  });
  photoBtns.appendChild(loadBtn);
  photoBtns.appendChild(fillBtn);
  photoSec.appendChild(photoBtns);
  photoSec.appendChild(el("p", "hint", "Pick a photo, then click a panel to place it. Drag a panel to reframe it; scroll to zoom."));
  trayEl = el("div", "tray");
  photoSec.appendChild(trayEl);

  const wordSec = section("Words");
  const fields = [
    ["title", "Title"],
    ["subtitle", "Script subtitle"],
    ["quote", "Press quote"],
    ["tagline", "Tagline"],
    ["billing", "Billing block"],
  ];
  for (const [key, label] of fields) {
    const wrap = el("label", "field");
    wrap.appendChild(el("span", null, label));
    const input = document.createElement("input");
    input.type = "text";
    input.value = state[key] || "";
    input.addEventListener("focus", () => commit());
    input.addEventListener("input", () => {
      state[key] = input.value;
      render();
    });
    textInputs[key] = input;
    wrap.appendChild(input);
    wordSec.appendChild(wrap);
  }
  const starsWrap = el("label", "field");
  starsWrap.appendChild(el("span", null, "Wanted stars"));
  starsRange = document.createElement("input");
  starsRange.type = "range";
  starsRange.min = "0";
  starsRange.max = "5";
  starsRange.step = "1";
  starsRange.value = String(state.stars);
  starsValue = el("b", "stars-value", String(state.stars));
  starsRange.addEventListener("focus", () => commit());
  starsRange.addEventListener("input", () => {
    state.stars = Number(starsRange.value);
    starsValue.textContent = String(state.stars);
    render();
  });
  starsWrap.appendChild(starsRange);
  starsWrap.appendChild(starsValue);
  wordSec.appendChild(starsWrap);

  const panelSec = section("Panel callouts");
  panelInputsEl = el("div", null);
  panelSec.appendChild(panelInputsEl);
  rebuildPanelInputs();

  const exportSec = section("Export");
  const sizeRow = el("div", "btn-row");
  for (const size of EXPORT_SIZES) {
    const b = el("button", "chip", size.label);
    b.type = "button";
    b.addEventListener("click", () => {
      canvas.width = size.w;
      canvas.height = size.h;
      render();
    });
    sizeRow.appendChild(b);
  }
  exportSec.appendChild(sizeRow);
  const exportBtns = el("div", "btn-row");
  const pngBtn = el("button", "chip primary", "Export PNG");
  pngBtn.type = "button";
  pngBtn.addEventListener("click", () => downloadCanvas(canvas, `viceframe-${canvas.width}x${canvas.height}.png`));
  const allBtn = el("button", "chip", "Export all sizes");
  allBtn.type = "button";
  allBtn.addEventListener("click", exportAll);
  exportBtns.appendChild(pngBtn);
  exportBtns.appendChild(allBtn);
  exportSec.appendChild(exportBtns);

  refreshControlStates();
}

function downloadCanvas(source, name) {
  source.toBlob((blob) => {
    if (!blob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }, "image/png");
}

function exportAll() {
  const off = document.createElement("canvas");
  const offCtx = off.getContext("2d");
  for (const size of EXPORT_SIZES) {
    off.width = size.w;
    off.height = size.h;
    renderPoster(offCtx, size.w, size.h, state);
    downloadCanvas(off, `viceframe-${size.id}-${size.w}x${size.h}.png`);
  }
}

async function addUploads(files) {
  for (const file of files) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    await new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
      img.src = url;
    });
    if (img.naturalWidth > 0) {
      uploadCount += 1;
      photos.set(`upload-${uploadCount}`, img);
    }
  }
  rebuildTray();
  render();
}

// ------------------------------------------------------------ canvas interaction

function canvasPoint(evt) {
  const box = canvas.getBoundingClientRect();
  return {
    x: ((evt.clientX - box.left) / box.width) * canvas.width,
    y: ((evt.clientY - box.top) / box.height) * canvas.height,
  };
}

function panelAt(point) {
  for (let i = lastRects.length - 1; i >= 0; i--) {
    const r = lastRects[i];
    if (point.x >= r.x && point.x <= r.x + r.w && point.y >= r.y && point.y <= r.y + r.h) return i;
  }
  return -1;
}

let drag = null;

canvas.addEventListener("pointerdown", (evt) => {
  const point = canvasPoint(evt);
  const idx = panelAt(point);
  if (idx < 0) return;
  if (selectedPhotoId) {
    commit();
    state.panels[idx].photo = selectedPhotoId;
    render();
    return;
  }
  commit();
  drag = {
    idx,
    startX: point.x,
    startY: point.y,
    ox: state.panels[idx].ox || 0,
    oy: state.panels[idx].oy || 0,
    moved: false,
  };
  canvas.setPointerCapture(evt.pointerId);
});

canvas.addEventListener("pointermove", (evt) => {
  if (!drag) return;
  const point = canvasPoint(evt);
  const rect = lastRects[drag.idx];
  const panel = state.panels[drag.idx];
  panel.ox = drag.ox + (point.x - drag.startX) / rect.w;
  panel.oy = drag.oy + (point.y - drag.startY) / rect.h;
  drag.moved = true;
  render();
});

canvas.addEventListener("pointerup", () => {
  drag = null;
});

let wheelTimer = null;
canvas.addEventListener(
  "wheel",
  (evt) => {
    evt.preventDefault();
    const idx = panelAt(canvasPoint(evt));
    if (idx < 0) return;
    if (!wheelTimer) commit();
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => (wheelTimer = null), 450);
    const panel = state.panels[idx];
    panel.zoom = Math.min(3, Math.max(1, (panel.zoom || 1) * Math.exp(-evt.deltaY * 0.0012)));
    render();
  },
  { passive: false }
);

undoBtn.addEventListener("click", undo);
redoBtn.addEventListener("click", redo);

// ------------------------------------------------------------ boot

async function boot() {
  const params = new URLSearchParams(location.search);
  const shotName = params.get("shot");

  try {
    await Promise.all([
      document.fonts.load("80px Anton"),
      document.fonts.load("40px Pacifico"),
      document.fonts.load("30px 'Bebas Neue'"),
    ]);
    await document.fonts.ready;
  } catch (e) {
    /* fonts fall back to system faces */
  }

  photos = await loadSamples().catch(() => new Map());
  state = sceneState("cover", photos);
  buildControls();
  rebuildTray();
  syncHistoryButtons();

  if (shotName) {
    state = sceneState(shotName, photos);
    state.photos = photos;
    const sizeParam = params.get("size");
    if (sizeParam) {
      const [w, h] = sizeParam.split("x").map(Number);
      if (w > 0 && h > 0) {
        canvas.width = w;
        canvas.height = h;
      }
    }
    if (shotName !== "editor") document.body.classList.add("shot");
    rebuildPanelInputs();
    refreshControlStates();
    syncTextInputs();
    render();
    window.__shotReady = true;
    return;
  }

  render();
}

boot();
