// Extract published particulars from an Instagram/YouTube caption.
// Only reads what is literally written; returns null when a value is absent.

const num = s => (s == null ? null : Number(String(s).replace(/[\s,]/g, '').replace(/\.(?=\d{3}\b)/g, '')));

export function parsePrice(text) {
  const t = text.replace(/ /g, ' ');
  if (/\bP\.?O\.?A\b/i.test(t) && !/R\s?\d/.test(t)) return { priceZAR: null, priceOnApplication: true };
  // First rand figure written with separators, e.g. R31,000,000 / R 28 000 000 / R7.900.000
  const m = t.match(/R\s?(\d{1,3}(?:[ ,.]\d{3}){2,})(?!\d)/);
  if (m) return { priceZAR: num(m[1].replace(/\./g, ',')), priceOnApplication: false };
  return { priceZAR: null, priceOnApplication: /\bPOA\b/i.test(t) };
}

export function parseSpecs(text) {
  const t = text.replace(/ /g, ' ');
  const pick = re => { const m = t.match(re); return m ? m[1] : null; };
  const baths = pick(/🛁\s*:?\s*([\d]+(?:[.,]5)?)\s*(?:Bath|$|\s)/im);
  const area = label => {
    const m = t.match(new RegExp(`±?\\s?(\\d[\\d,\\s]*\\d|\\d)\\s?(?:m2|m²|sqm|SQM)\\s*-?\\s*(?:${label})`, 'i'))
      || t.match(new RegExp(`(?:${label})\\s*:?\\s*±?\\s?(\\d[\\d,\\s]*\\d)\\s?(?:m2|m²)`, 'i'));
    return m ? num(m[1]) : null;
  };
  return {
    bedrooms: num(pick(/🛏\s*:?\s*(\d+)/)),
    bathrooms: baths ? Number(baths.replace(',', '.')) : null,
    garages: num(pick(/(?:🚗|🚘|🚙)\s*:?\s*(\d+)/)),
    erfSizeM2: area('Stand|Erf|Plot'),
    floorSizeM2: area('Floor|Living Space|Under Roof'),
  };
}
