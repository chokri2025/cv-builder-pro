import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';

/**
 * The 6 translation.json files are hand-maintained independently (no
 * extraction/lint tooling keeps them in sync). A key added to one locale and
 * missed in another doesn't fail a build — i18next just falls back silently
 * — so this test is the only thing that catches that drift.
 */

const LOCALES = ['en', 'fr', 'es', 'ar', 'tr', 'pt'] as const;

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

function flattenKeys(obj: JsonObject, prefix = ''): Set<string> {
  const keys = new Set<string>();
  for (const [key, value] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      for (const k of flattenKeys(value as JsonObject, full)) keys.add(k);
    } else {
      keys.add(full);
    }
  }
  return keys;
}

function loadKeys(locale: string): Set<string> {
  const source = readFileSync(path.resolve(__dirname, `${locale}/translation.json`), 'utf8');
  return flattenKeys(JSON.parse(source) as JsonObject);
}

describe('locale translation key parity', () => {
  const [reference, ...rest] = LOCALES;
  const referenceKeys = loadKeys(reference);

  it(`has a non-empty reference key set (${reference})`, () => {
    expect(referenceKeys.size).toBeGreaterThan(0);
  });

  for (const locale of rest) {
    it(`${locale} has exactly the same keys as ${reference}`, () => {
      const keys = loadKeys(locale);
      const missing = [...referenceKeys].filter((k) => !keys.has(k));
      const extra = [...keys].filter((k) => !referenceKeys.has(k));

      expect({ missing, extra }).toEqual({ missing: [], extra: [] });
    });
  }
});
