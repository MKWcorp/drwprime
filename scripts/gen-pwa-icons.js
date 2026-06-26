/* Generate PWA icons for DRW Prime.
 * - icon-{192,512}.png        -> transparent logo, purpose "any"
 * - icon-maskable-{192,512}.png -> full-bleed dark brand bg + centered gold logo (safe zone), purpose "maskable"
 * - apple-touch-icon.png      -> full-bleed dark brand bg (iOS rounds corners itself)
 * Run: node scripts/gen-pwa-icons.js
 */
const sharp = require('sharp');
const path = require('path');

const PUBLIC = path.join(__dirname, '..', 'public');
const LOGO = path.join(PUBLIC, 'drwprime-icon.png');

function bgSvg(size) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
       <defs>
         <radialGradient id="g" cx="50%" cy="44%" r="72%">
           <stop offset="0%" stop-color="#16130b"/>
           <stop offset="100%" stop-color="#080808"/>
         </radialGradient>
       </defs>
       <rect width="100%" height="100%" fill="url(#g)"/>
     </svg>`
  );
}

async function trimmedLogo(target) {
  return sharp(LOGO)
    .trim()
    .resize(target, target, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

async function makeMaskable(size, out) {
  const inner = Math.round(size * 0.62); // keep logo inside the adaptive-icon safe zone
  const logo = await trimmedLogo(inner);
  await sharp(bgSvg(size))
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toFile(out);
}

async function makeAny(size, out) {
  await sharp(LOGO)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(out);
}

async function makeApple(size, out) {
  const inner = Math.round(size * 0.74); // iOS only rounds corners (no circle crop), so logo can be larger
  const logo = await trimmedLogo(inner);
  await sharp(bgSvg(size))
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toFile(out);
}

(async () => {
  await makeAny(192, path.join(PUBLIC, 'icon-192x192.png'));
  await makeAny(512, path.join(PUBLIC, 'icon-512x512.png'));
  await makeMaskable(192, path.join(PUBLIC, 'icon-maskable-192.png'));
  await makeMaskable(512, path.join(PUBLIC, 'icon-maskable-512.png'));
  await makeApple(152, path.join(PUBLIC, 'apple-touch-icon-152.png'));
  await makeApple(167, path.join(PUBLIC, 'apple-touch-icon-167.png'));
  await makeApple(180, path.join(PUBLIC, 'apple-touch-icon-180.png'));
  await makeApple(180, path.join(PUBLIC, 'apple-touch-icon.png'));
  console.log('PWA icons generated.');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
