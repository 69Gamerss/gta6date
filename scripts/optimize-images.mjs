// Generates responsive background variants, a social-share card, and a
// low-quality image placeholder (LQIP) from the single 8K source image.
//
//   npm install            # installs sharp (devDependency)
//   npm run optimize       # regenerates everything below
//
// Re-run this whenever assets/gta6-bg-8k.jpg changes.

import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = join(ROOT, 'assets');
const SOURCE = join(ASSETS, 'gta6-bg-8k.jpg');

const WIDTHS = [768, 1280, 1920];

// Quality settings tuned for a dark, heavily-overlaid photographic background:
// visible artefacts are hidden by the gradient overlay, so we can push hard.
const FORMATS = [
  { ext: 'avif', opts: { quality: 50, effort: 4 } },
  { ext: 'webp', opts: { quality: 72 } },
  { ext: 'jpg',  opts: { quality: 78, mozjpeg: true }, sharpFmt: 'jpeg' },
];

async function main() {
  const meta = await sharp(SOURCE).metadata();
  const aspect = meta.width / meta.height;
  console.log(`Source: ${meta.width}x${meta.height} (aspect ${aspect.toFixed(3)})`);

  // ── Responsive background variants ────────────────────────────────────────
  for (const w of WIDTHS) {
    for (const f of FORMATS) {
      const out = join(ASSETS, `bg-${w}.${f.ext}`);
      const info = await sharp(SOURCE)
        .resize({ width: w, withoutEnlargement: true })
        .toFormat(f.sharpFmt || f.ext, f.opts)
        .toFile(out);
      console.log(`  bg-${w}.${f.ext.padEnd(4)} ${(info.size / 1024).toFixed(1)} KB`);
    }
  }

  // ── Social share card (1200x630, safe for Open Graph / Twitter) ───────────
  const ogInfo = await sharp(SOURCE)
    .resize({ width: 1200, height: 630, fit: 'cover', position: 'attention' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(join(ASSETS, 'og-image.jpg'));
  console.log(`  og-image.jpg ${(ogInfo.size / 1024).toFixed(1)} KB`);

  // ── LQIP: tiny blurred placeholder, emitted as an inline base64 data URI ──
  const lqipBuf = await sharp(SOURCE)
    .resize({ width: 32 })
    .blur(2)
    .jpeg({ quality: 40 })
    .toBuffer();
  const dataUri = `data:image/jpeg;base64,${lqipBuf.toString('base64')}`;
  await writeFile(join(ASSETS, 'bg-lqip.txt'), dataUri);
  console.log(`  bg-lqip.txt ${(lqipBuf.length / 1024).toFixed(2)} KB (inline data URI)`);
  console.log('\nLQIP data URI (paste into styles.css body background):\n');
  console.log(dataUri);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
