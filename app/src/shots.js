// Sample photos and the deterministic scenes used for the screenshot renders
// (and as the editor's starting point). Everything is local: the samples ship
// inside app/samples/ and load offline.

import { defaultPanelState, layoutById } from "./engine.js";

export const SAMPLE_FILES = [
  "hero.jpg",
  "insider.jpg",
  "rider.jpg",
  "boss.jpg",
  "driver.jpg",
  "boulevard.jpg",
  "pier.jpg",
];

function loadOne(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`could not load ${src}`));
    img.src = src;
  });
}

// Loads every bundled sample; resolves to a Map of photo id -> Image.
// Ids are the file names without the .jpg extension.
export async function loadSamples(base = "samples/") {
  const photos = new Map();
  await Promise.all(
    SAMPLE_FILES.map(async (file) => {
      const img = await loadOne(base + file);
      photos.set(file.replace(/\.jpg$/, ""), img);
    })
  );
  return photos;
}

const BILLING =
  "A VICEFRAME STUDIO PRODUCTION · STARRING YOU AND YOUR CREW · SHOT ON LOCATION IN PALM BAY · MADE IN YOUR BROWSER — NO UPLOAD, EVER";

export const SCENES = {
  cover: {
    layout: "fever",
    grade: "sunset",
    frame: "purple",
    title: "VICE FEVER",
    subtitle: "one last summer",
    quote: '"PURE GOLDEN-HOUR MAYHEM" — THE HARBOR GAZETTE',
    tagline: "FIVE FRIENDS · ONE COAST · NO WAY BACK",
    billing: BILLING,
    stars: 5,
    order: ["hero", "insider", "rider", "boss", "driver"],
    heroFy: 0.22,
  },
  cover2: {
    layout: "fever",
    grade: "neon",
    frame: "purple",
    title: "MIDNIGHT RUN",
    subtitle: "the city never pays",
    quote: '"NEON-SOAKED AND FEARLESS" — PALM BAY FM',
    tagline: "ONE NIGHT · ONE CREW · NO BRAKES",
    billing: BILLING,
    stars: 4,
    order: ["insider", "hero", "boulevard", "boss", "driver"],
  },
  cover3: {
    layout: "classic",
    grade: "golden",
    frame: "purple",
    title: "PALM HEAT",
    subtitle: "no way back",
    quote: '"A SUNSET YOU CAN FRAME" — THE COASTAL POST',
    tagline: "EVERY CREW HAS ONE LAST RIDE",
    billing: BILLING,
    stars: 5,
    order: ["driver", "hero", "rider", "pier", "boss"],
  },
};

// The editor opens on the cover scene with the UI visible.
SCENES.editor = SCENES.cover;

// Builds a complete render state for a scene: layout/grade/frame ids, the
// text fields, and one panel state per layout slot with the scene's photo
// order applied. The hero panel of the cover scene anchors a little higher
// (fy 0.22) so the lead face sits perfectly in frame.
export function sceneState(name, photos) {
  const scene = SCENES[name] || SCENES.cover;
  const count = layoutById(scene.layout).rects.length;
  const panels = defaultPanelState(count);
  scene.order.forEach((photoId, i) => {
    if (panels[i]) panels[i].photo = photoId;
  });
  if (scene.heroFy != null && panels[0]) panels[0].fy = scene.heroFy;
  return {
    layout: scene.layout,
    grade: scene.grade,
    frame: scene.frame,
    title: scene.title,
    subtitle: scene.subtitle,
    quote: scene.quote,
    tagline: scene.tagline,
    billing: scene.billing,
    stars: scene.stars,
    panels,
    photos,
  };
}
