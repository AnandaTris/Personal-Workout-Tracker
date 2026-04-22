import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Bodybuilder silhouette SVG - flexing pose, dark bg with purple accent
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <!-- Background -->
  <rect width="512" height="512" rx="80" fill="#0f172a"/>

  <!-- Subtle gradient overlay -->
  <defs>
    <radialGradient id="glow" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a78bfa"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="80" fill="url(#glow)"/>

  <!-- Bodybuilder figure - classic double bicep pose -->
  <!-- Head -->
  <ellipse cx="256" cy="118" rx="38" ry="42" fill="url(#bodyGrad)"/>

  <!-- Neck -->
  <rect x="238" y="154" width="36" height="28" rx="8" fill="url(#bodyGrad)"/>

  <!-- Torso - wide shoulders, V-taper -->
  <path d="M148 178 Q180 168 218 172 L238 182 L274 182 L294 172 Q332 168 364 178 L372 280 Q340 296 300 298 L280 308 L256 312 L232 308 L212 298 Q172 296 140 280 Z" fill="url(#bodyGrad)"/>

  <!-- Chest definition lines -->
  <path d="M216 195 Q240 210 256 208 Q272 210 296 195" stroke="#c4b5fd" stroke-width="3" fill="none" opacity="0.5"/>

  <!-- Abs -->
  <path d="M230 310 L226 380 Q256 390 286 380 L282 310 Z" fill="url(#bodyGrad)"/>
  <!-- Ab lines -->
  <line x1="243" y1="325" x2="269" y2="325" stroke="#c4b5fd" stroke-width="2.5" opacity="0.4"/>
  <line x1="240" y1="345" x2="272" y2="345" stroke="#c4b5fd" stroke-width="2.5" opacity="0.4"/>
  <line x1="238" y1="365" x2="274" y2="365" stroke="#c4b5fd" stroke-width="2.5" opacity="0.4"/>
  <line x1="256" y1="312" x2="256" y2="382" stroke="#c4b5fd" stroke-width="2" opacity="0.3"/>

  <!-- Left arm - raised and flexed -->
  <path d="M148 178 L108 155 Q88 148 75 162 Q62 178 72 194 Q82 208 100 202 L130 192" fill="url(#bodyGrad)"/>
  <!-- Left bicep peak -->
  <path d="M75 162 Q60 140 80 125 Q100 110 112 138 Q105 155 88 158 Z" fill="url(#bodyGrad)"/>
  <!-- Left forearm -->
  <path d="M72 194 L50 230 Q44 248 54 258 Q64 268 78 258 L98 220" fill="url(#bodyGrad)"/>

  <!-- Right arm - raised and flexed -->
  <path d="M364 178 L404 155 Q424 148 437 162 Q450 178 440 194 Q430 208 412 202 L382 192" fill="url(#bodyGrad)"/>
  <!-- Right bicep peak -->
  <path d="M437 162 Q452 140 432 125 Q412 110 400 138 Q407 155 424 158 Z" fill="url(#bodyGrad)"/>
  <!-- Right forearm -->
  <path d="M440 194 L462 230 Q468 248 458 258 Q448 268 434 258 L414 220" fill="url(#bodyGrad)"/>

  <!-- Legs -->
  <!-- Left leg -->
  <path d="M226 380 L215 390 L205 460 Q202 480 220 484 Q236 488 240 468 L248 400 Z" fill="url(#bodyGrad)"/>
  <!-- Right leg -->
  <path d="M286 380 L297 390 L307 460 Q310 480 292 484 Q276 488 272 468 L264 400 Z" fill="url(#bodyGrad)"/>

  <!-- Highlight on biceps -->
  <ellipse cx="85" cy="140" rx="10" ry="14" fill="#c4b5fd" opacity="0.3" transform="rotate(-20 85 140)"/>
  <ellipse cx="427" cy="140" rx="10" ry="14" fill="#c4b5fd" opacity="0.3" transform="rotate(20 427 140)"/>
</svg>`;

const svgBuffer = Buffer.from(svg);

async function generate() {
  const publicDir = path.resolve(__dirname, '..', 'public');

  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'icon-512.png'));
  console.log('Generated icon-512.png');

  await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'icon-192.png'));
  console.log('Generated icon-192.png');

  await sharp(svgBuffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png (iOS home screen)');
}

generate().catch(console.error);
