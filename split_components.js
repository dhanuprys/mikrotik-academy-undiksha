const fs = require('fs');
const content = fs.readFileSync('components/home-animations.tsx', 'utf-8');

const lines = content.split('\n');

function getBlock(startLineStr, endLineStr) {
    const start = lines.findIndex(l => l.includes(startLineStr));
    const end = endLineStr ? lines.findIndex(l => l.includes(endLineStr)) : lines.length;
    return lines.slice(start, end).join('\n');
}

const imports = lines.slice(0, 20).join('\n');

const hooks = imports + '\n' + getBlock('// ── MEDIA QUERY HOOK ──', '// ── FLOATING NAV ──');
const layout = imports + '\n' + 
               getBlock('// ── FLOATING NAV ──', '// ── SCROLL ZOOM HERO ──') + '\n' +
               getBlock('// ── HERO TITLE (staggered chars) ──', '// ── FADE IN ──') + '\n' +
               getBlock('// ── FADE IN ──', '// ── FLOATING STAT CARDS ──') + '\n' +
               getBlock('// ── FLOATING STAT CARDS ──', '// ── SCROLL-VELOCITY MARQUEE ──') + '\n' +
               getBlock('// ── PARALLAX FOOTER ──', '// ── TILT CARD ──') + '\n' +
               getBlock('// ── TILT CARD ──', '// ── ELEGANT EVENT CARD') + '\n' +
               getBlock('// ── MAGNETIC BUTTON ──', '// ── INTERACTIVE EVENT SHOWCASE');

const scroll = imports + '\n' +
               getBlock('// ── SCROLL ZOOM HERO ──', '// ── HERO PARALLAX LAYER ──') + '\n' +
               getBlock('// ── HERO PARALLAX LAYER ──', '// ── HERO TITLE') + '\n' +
               getBlock('// ── SCROLL-VELOCITY MARQUEE ──', '// ── STICKY FEATURE SHOWCASE') + '\n' +
               getBlock('// ── DARK TEXT REVEAL SECTION', '// ── SCROLL PROGRESS TIMELINE ──') + '\n' +
               getBlock('// ── SCROLL PROGRESS TIMELINE ──', '// ── PARALLAX FOOTER ──');

const sticky = imports + '\n' + 
               getBlock('// ── STICKY FEATURE SHOWCASE', '// ── DARK TEXT REVEAL SECTION');

const eventInfo = imports + '\n' + 
               getBlock('// Context to share', '// ── MEDIA QUERY HOOK ──') + '\n' +
               getBlock('// ── ELEGANT EVENT CARD', '// ── MAGNETIC BUTTON ──') + '\n' +
               getBlock('// ── INTERACTIVE EVENT SHOWCASE', null);

fs.mkdirSync('components/ui', { recursive: true });
fs.writeFileSync('components/ui/hooks.ts', hooks);
fs.writeFileSync('components/ui/layout-animations.tsx', layout);
fs.writeFileSync('components/ui/scroll-sections.tsx', scroll);
fs.writeFileSync('components/ui/sticky-features.tsx', sticky);
fs.writeFileSync('components/ui/event-showcase.tsx', eventInfo);

const index = `export * from './ui/hooks';
export * from './ui/layout-animations';
export * from './ui/scroll-sections';
export * from './ui/sticky-features';
export * from './ui/event-showcase';
`;

fs.writeFileSync('components/home-animations.tsx', index);

console.log("Split successful!");
