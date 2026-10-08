/* ─────────────────────────────────────────────────────────────
   Visual layer: every pouch gets a contrasting "ground" colour
   and a cut-out (sticker) image generated from its studio photo.
   ───────────────────────────────────────────────────────────── */

export interface Ground {
  name: string;
  bg: string;   // the ground colour the pouch sits on
  ink: string;  // readable text colour on that ground
}

const DARK = '#1E0B36';
const MILK = '#FFF6EA';

const cobalt: Ground = { name: 'cobalt', bg: '#2D3BFF', ink: MILK };
const lime: Ground = { name: 'lime', bg: '#C9F23B', ink: DARK };
const tangerine: Ground = { name: 'tangerine', bg: '#FF7A29', ink: DARK };
const butter: Ground = { name: 'butter', bg: '#FFD93D', ink: DARK };
const emerald: Ground = { name: 'emerald', bg: '#0F8A5F', ink: MILK };
const sky: Ground = { name: 'sky', bg: '#8CC8FF', ink: DARK };
const violet: Ground = { name: 'violet', bg: '#7B3FF2', ink: MILK };
const teal: Ground = { name: 'teal', bg: '#0EA5A0', ink: DARK };
const hotpink: Ground = { name: 'hotpink', bg: '#FF4F9A', ink: DARK };
const tomato: Ground = { name: 'tomato', bg: '#F2432F', ink: MILK };
const bubblegum: Ground = { name: 'bubblegum', bg: '#FF9CC7', ink: DARK };
const lilac: Ground = { name: 'lilac', bg: '#B69CFF', ink: DARK };

/** Chosen as the colour that clashes best with each pouch. */
export const GROUNDS: Record<string, Ground> = {
  'dyson-airwrap-pouch-pink-gingham-ruffle': cobalt,
  'dyson-airwrap-pouch-polka-lace': lime,
  'dyson-airwrap-pouch-blue-stripe-bow': tangerine,
  'dyson-airwrap-pouch-navy-quilted': butter,
  'dyson-airwrap-pouch-pink-stripe-ruffle': emerald,
  'hairtool-wrap-pouch-red-gingham-ruffle': sky,
  'napkin-pouch-pink-hearts': violet,
  'makeup-pouch-pink-chess': teal,
  'makeup-pouch-cheetah': hotpink,
  'makeup-pouch-green-gingham-floral': tomato,
  'makeup-pouch-polka-ruffle': bubblegum,
  'makeup-pouch-cherry-cream-ruffle': lilac,
};

export const CATEGORY_GROUNDS: Record<string, Ground> = {
  'hair-tool-pouches': cobalt,
  'makeup-pouches': lime,
  'napkin-small-pouches': violet,
};

export function getGround(slug: string): Ground {
  return GROUNDS[slug] ?? cobalt;
}

/** width / height of each cut-out file (used to keep layouts stable). */
const CUTOUT_RATIO: Record<string, number> = {
  'dyson-airwrap-pouch-pink-gingham-ruffle': 1026 / 973,
  'dyson-airwrap-pouch-polka-lace': 910 / 1027,
  'dyson-airwrap-pouch-blue-stripe-bow': 678 / 1026,
  'dyson-airwrap-pouch-navy-quilted': 1026 / 654,
  'dyson-airwrap-pouch-pink-stripe-ruffle': 421 / 1026,
  'hairtool-wrap-pouch-red-gingham-ruffle': 688 / 1027,
  'napkin-pouch-pink-hearts': 914 / 1026,
  'makeup-pouch-pink-chess': 1027 / 895,
  'makeup-pouch-cheetah': 1026 / 617,
  'makeup-pouch-green-gingham-floral': 1026 / 844,
  'makeup-pouch-polka-ruffle': 1026 / 878,
  'makeup-pouch-cherry-cream-ruffle': 1026 / 968,
};

export function getCutoutUrl(slug: string): string {
  return `/cutouts/${slug}.webp`;
}

export function getCutoutRatio(slug: string): number {
  return CUTOUT_RATIO[slug] ?? 1;
}

export const PETAL_COLORS = ['#FF4F9A', '#FF9CC7', '#FFD93D', '#C9F23B', '#FFF6EA', '#FF7A29', '#B69CFF'];
