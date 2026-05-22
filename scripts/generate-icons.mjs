import sharp from 'sharp';
import { mkdirSync } from 'fs';

mkdirSync('static/icons', { recursive: true });

// Beanery coffee bean icon — dark background, crema gold bean, cream steam
const svg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <!-- Dark roast background with rounded corners -->
  <rect width="512" height="512" fill="#2C1A0E" rx="${Math.round(size * 0.17)}"/>

  <!-- Steam wisps -->
  <path d="M186 148 C178 124 190 104 182 80" fill="none" stroke="#FBF9F4" stroke-width="11" stroke-linecap="round" opacity="0.45"/>
  <path d="M256 138 C248 114 260 94 252 70" fill="none" stroke="#FBF9F4" stroke-width="11" stroke-linecap="round" opacity="0.45"/>
  <path d="M326 148 C318 124 330 104 322 80" fill="none" stroke="#FBF9F4" stroke-width="11" stroke-linecap="round" opacity="0.45"/>

  <!-- Coffee bean body -->
  <ellipse cx="256" cy="296" rx="136" ry="118" fill="#C5A059"/>

  <!-- Bean crease (centre line) -->
  <path d="M256 178 C296 218 296 264 256 296 C216 328 216 364 256 414"
        fill="none" stroke="#2C1A0E" stroke-width="15" stroke-linecap="round"/>

  <!-- Subtle highlight on bean -->
  <ellipse cx="210" cy="246" rx="38" ry="22" fill="#FBF9F4" opacity="0.13" transform="rotate(-30 210 246)"/>
</svg>`;

const sizes = [180, 192, 512];

for (const size of sizes) {
  await sharp(Buffer.from(svg(size)))
    .png()
    .toFile(`static/icons/icon-${size}x${size}.png`);
  console.log(`✓ icon-${size}x${size}.png`);
}

console.log('Icons generated.');
