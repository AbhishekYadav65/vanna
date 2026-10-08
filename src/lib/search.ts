import productsData, { type Product } from '../data/products';

/** Loose synonyms so "leopard" finds the cheetah pouch, "check" finds gingham, etc. */
const SYNONYMS: Record<string, string[]> = {
  dyson: ['airwrap'], airwrap: ['dyson', 'hair'], hair: ['hairtool', 'airwrap', 'wrap'],
  curl: ['airwrap'], curling: ['airwrap'], curler: ['airwrap'], styler: ['airwrap'],
  makeup: ['cosmetic', 'chess', 'cheetah'], cosmetic: ['makeup'], 'make-up': ['makeup'],
  napkin: ['pad', 'sanitary', 'period', 'tissue'], pad: ['napkin'], sanitary: ['napkin'],
  period: ['napkin'], tissue: ['napkin'],
  leopard: ['cheetah'], animal: ['cheetah'], print: ['cheetah', 'polka'],
  check: ['gingham', 'chess'], checks: ['gingham', 'chess'], checkered: ['chess'],
  checker: ['chess'], plaid: ['gingham'],
  dot: ['polka'], dots: ['polka'], spot: ['polka'], spots: ['polka'],
  floral: ['flower', 'daisy'], flower: ['floral', 'daisy'], daisy: ['floral'],
  cherries: ['cherry'], ribbon: ['bow'], frill: ['ruffle'], frills: ['ruffle'],
  quilt: ['quilted'], denim: ['navy'], navy: ['denim', 'blue'], blue: ['navy', 'stripe'],
  travel: ['pouch'], case: ['pouch'], bag: ['pouch'], purse: ['pouch'],
  red: ['cherry', 'gingham'], green: ['meadow', 'floral'], purple: ['lilac'], lace: ['eyelet'],
};

export const POPULAR_SEARCHES = ['Gingham', 'Ruffle', 'Cherry', 'Polka', 'Quilted', 'Airwrap', 'Leopard', 'Hearts'];

function stem(word: string): string {
  if (word.length > 4 && word.endsWith('ies')) return word.slice(0, -3) + 'y';
  if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
}

export function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(stem);
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 1) return 2;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let last = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, last + (a[i - 1] === b[j - 1] ? 0 : 1));
      last = tmp;
    }
  }
  return prev[b.length];
}

interface Indexed {
  product: Product;
  name: string;
  tags: string;
  category: string;
  fabric: string;
  body: string;
  words: string[];
}

let INDEX: Indexed[] | null = null;
function getIndex(): Indexed[] {
  if (INDEX) return INDEX;
  INDEX = productsData.products.map((product) => {
    const name = product.name.toLowerCase();
    const tags = product.tags.join(' ').toLowerCase();
    const category = product.category.toLowerCase();
    const fabric = product.fabric.toLowerCase();
    const body = `${product.shortDescription} ${product.description} ${product.highlights.join(' ')}`.toLowerCase();
    const words = Array.from(new Set(`${name} ${tags} ${fabric}`.split(/[^a-z0-9]+/).filter((w) => w.length > 2)));
    return { product, name, tags, category, fabric, body, words };
  });
  return INDEX;
}

function scoreToken(item: Indexed, token: string): number {
  let s = 0;
  if (item.name.includes(token)) s += 6;
  if (item.tags.includes(token)) s += 4;
  if (item.category.includes(token)) s += 3;
  if (item.fabric.includes(token)) s += 2;
  if (item.body.includes(token)) s += 1;
  return s;
}

function scoreWithFallbacks(item: Indexed, token: string): number {
  let s = scoreToken(item, token);
  if (s === 0) {
    for (const syn of SYNONYMS[token] ?? []) s = Math.max(s, scoreToken(item, syn) * 0.6);
  }
  if (s === 0 && token.length >= 4) {
    // typo tolerance: "gingam" -> "gingham"
    if (item.words.some((w) => w.length >= 4 && levenshtein(w, token) <= 1)) s = 2;
  }
  return s;
}

export interface SearchResult {
  results: Product[];
  /** true when no product matched every word, so we show the closest matches */
  partial: boolean;
}

export function searchProducts(query: string): SearchResult {
  const tokens = tokenize(query);
  if (tokens.length === 0) return { results: [], partial: false };
  const index = getIndex();

  const scored = index.map((item) => {
    const per = tokens.map((t) => scoreWithFallbacks(item, t));
    return { item, per, total: per.reduce((a, b) => a + b, 0), all: per.every((p) => p > 0) };
  });

  const strict = scored.filter((s) => s.all).sort((a, b) => b.total - a.total);
  if (strict.length) return { results: strict.map((s) => s.item.product), partial: false };

  const loose = scored.filter((s) => s.total > 0).sort((a, b) => b.total - a.total);
  return { results: loose.map((s) => s.item.product), partial: loose.length > 0 };
}
