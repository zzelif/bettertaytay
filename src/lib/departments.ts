/**
 * Resolves Citizens Charter `office_division` strings to matching entries
 * in the LGU department directory (departments.json).
 *
 * WHY THIS EXISTS
 * ───────────────
 * The Citizens Charter document uses official long-form office names
 * (e.g. "MUNICIPAL PLANNING AND DEVELOPMENT OFFICE"), while the LGU
 * directory may use shortened, acronym-appended, or structurally different
 * names (e.g. "PLANNING AND DEVELOPMENT COORDINATOR (MPDO)").
 * This utility bridges that gap without modifying any source data file,
 * the Python pipeline, or the merge script.
 *
 * MATCHING STRATEGY (in order of precedence)
 * ───────────────────────────────────────────
 *   1. EXPLICIT_ALIASES   — Hardcoded map for structural mismatches
 *                           that normalization cannot handle.
 *   2. NORMALIZED MATCH   — Strip known prefixes ("MUNICIPAL", "TAYTAY"),
 *                           acronym suffixes ("(MPDO)"), punctuation
 *                           differences, then exact-compare.
 *   3. ACRONYM MATCH      — Extract the acronym from a directory name's
 *                           parenthetical suffix and check whether the CC
 *                           query string contains it as a whole word.
 *
 * MAINTENANCE GUIDE
 * ─────────────────
 * When a new CC service fails to resolve, the dev console will emit:
 *
 *   [OfficeDivisionResolver] No match for: "SOME OFFICE NAME"
 *     → If this is a valid CC office, add it to EXPLICIT_ALIASES in
 *       src/lib/officeDivisionResolver.ts
 *
 * Run auditOfficeDivisions(KNOWN_CC_OFFICE_DIVISIONS) in the browser
 * console after any change to verify full coverage.
 *
 * NEVER modify departments.json, citizens-charter.json, or the Python
 * pipeline to fix a mismatch — add an alias here instead.
 */

import departmentsData from '@/data/directory/generated_departments.json';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type DepartmentEntry = (typeof departmentsData)[number];

/** Which of the three strategies produced the match. */
export type ResolveMethod = 'alias' | 'normalized' | 'acronym';

export interface ResolveResult {
  /** Department slug — use for routing and departmentsData lookups. */
  slug: string;
  /** Official office name as listed in departments.json. */
  officeName: string;
  /** Which strategy found the match — useful for auditing. */
  method: ResolveMethod;
  /** The original CC query string that was resolved. */
  inputQuery: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 1 — Explicit Alias Map
// ─────────────────────────────────────────────────────────────────────────────
//
// Key   : CC `office_division` string — uppercase, trimmed, exactly as it
//         appears in citizens-charter.json.
// Value : Department `slug` from departments.json.
//
// ADD AN ENTRY HERE when both Step 2 and Step 3 fail for a CC office name.
// Every entry MUST have a comment explaining why normalization alone cannot
// resolve the mismatch.
//
// Keep entries sorted alphabetically by key for easy scanning.
// ─────────────────────────────────────────────────────────────────────────────

const EXPLICIT_ALIASES: Record<string, string> = {
  // CC:  "MANAGEMENT INFORMATION SERVICE SYSTEM"
  // Dir: "MANAGEMENT INFORMATION SYSTEM SERVICES OFFICE (MISSO)"
  // Why: "SERVICE SYSTEM" ≠ "SYSTEM SERVICES OFFICE" — word order inversion
  //      plus CC omits the word "OFFICE" entirely. Normalization trims the
  //      acronym suffix but cannot swap word order.
  'MANAGEMENT INFORMATION SERVICE SYSTEM':
    'management-information-system-services-office-misso',

  // CC:  "MUNICIPAL PLANNING AND DEVELOPMENT OFFICE"
  // Dir: "PLANNING AND DEVELOPMENT COORDINATOR (MPDO)"
  // Why: "MUNICIPAL" is stripped by normalization, but "COORDINATOR" vs
  //      "OFFICE" are semantically distinct words that cannot be equated
  //      automatically without risking false positives elsewhere.
  'MUNICIPAL PLANNING AND DEVELOPMENT OFFICE':
    'planning-and-development-coordinator-mpdo',

  // CC:  "OFFICE OF AGRICULTURAL SERVICES"
  // Dir: "AGRICULTURE OFFICE"
  // Why: Inverted prepositional structure ("OFFICE OF X SERVICES" vs
  //      "X OFFICE"). No shared token sequence survives normalization
  //      without ambiguity risk against other "OFFICE OF …" names.
  'OFFICE OF AGRICULTURAL SERVICES': 'agriculture-office',

  // ── Add new aliases below. Template:
  //
  // // CC:  "<exact CC office_division>"
  // // Dir: "<exact departments.json office_name>"
  // // Why: <one sentence explaining the structural mismatch>
  // '<CC_OFFICE_DIVISION_UPPERCASE>': '<department-slug>',
};

// ─────────────────────────────────────────────────────────────────────────────
// Step 2 — Normalization helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalizes an office name string for comparison.
 *
 * Transformations (applied in order):
 *   1. Uppercase
 *   2. Remove parenthetical acronym suffixes — "(MPDO)", "(GAD-KP)", etc.
 *   3. Strip leading "MUNICIPAL" prefix  — common in CC, absent in directory
 *   4. Strip leading "TAYTAY" prefix     — present in some CC entries
 *   5. Strip leading "LGU" prefix
 *   6. Normalize "&" → "AND"
 *   7. Normalize apostrophes and hyphens → spaces
 *      (handles "ASSESSOR'S" ↔ "ASSESSORS")
 *   8. Collapse multiple whitespace into a single space and trim
 */
function normalize(name: string): string {
  return name
    .toUpperCase()
    .replace(/\s*\([A-Z0-9\s/-]+\)\s*/g, ' ') // Remove "(ACRONYM)" groups
    .replace(/^MUNICIPAL\s+/, '') // Strip leading "MUNICIPAL"
    .replace(/^TAYTAY\s+/, '') // Strip leading "TAYTAY"
    .replace(/^LGU\s+/, '') // Strip leading "LGU"
    .replace(/&/g, 'AND') // & → AND
    .replace(/['-]/g, ' ') // apostrophes/hyphens → spaces
    .replace(/\s+/g, ' ') // collapse whitespace
    .trim();
}

function matchByNormalization(
  query: string,
  entries: DepartmentEntry[]
): DepartmentEntry | null {
  const normalizedQuery = normalize(query);
  return (
    entries.find(d => normalize(d.office_name) === normalizedQuery) ?? null
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 3 — Acronym match
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extracts the primary acronym from a directory office name's parenthetical
 * suffix.
 *
 * "GENERAL SERVICES OFFICE (GSO)"                         → "GSO"
 * "MANAGEMENT INFORMATION SYSTEM SERVICES OFFICE (MISSO)" → "MISSO"
 * "LOCAL CIVIL REGISTRY OFFICE (LCR)"                     → "LCR"
 * "PLANNING AND DEVELOPMENT COORDINATOR (MPDO)"           → "MPDO"
 * "LEGAL SERVICES OFFICE"                                  → null
 *
 * Only matches acronyms of 2–10 uppercase letters/digits (no slashes or
 * internal punctuation) to avoid false positives on long parentheticals.
 */
function extractParentheticalAcronym(officeName: string): string | null {
  const match = officeName
    .toUpperCase()
    .match(/\(\s*([A-Z0-9]{2,10})\s*\)\s*$/);
  return match ? match[1] : null;
}

/**
 * Returns the first department whose parenthetical acronym appears as a
 * whole word inside `query`.
 *
 * Example: query = "MENRO OFFICE SERVICES"
 *          dept  = "ENVIRONMENT AND NATURAL RESOURCES OFFICE (MENRO)"
 *          → match, because \bMENRO\b is found in the query.
 *
 * The word-boundary regex prevents partial matches (e.g. "PESO" inside
 * "TRAPESO" would not match).
 */
function matchByAcronym(
  query: string,
  entries: DepartmentEntry[]
): DepartmentEntry | null {
  const upperQuery = query.toUpperCase();

  for (const dept of entries) {
    const acronym = extractParentheticalAcronym(dept.office_name);
    if (!acronym) continue;

    if (new RegExp(`\\b${acronym}\\b`).test(upperQuery)) {
      return dept;
    }
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Session cache — avoid repeated work for the same query
// ─────────────────────────────────────────────────────────────────────────────

const _cache = new Map<string, ResolveResult | null>();

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolves a Citizens Charter `office_division` string to its best-matching
 * LGU department directory entry.
 *
 * Returns `null` when no match is found after all three strategies. In
 * development mode, a console warning is emitted — use it to identify
 * aliases that need to be added to EXPLICIT_ALIASES.
 *
 * @example
 * // Alias path
 * resolveOfficeDivision('MUNICIPAL PLANNING AND DEVELOPMENT OFFICE')
 * // → { slug: 'planning-and-development-coordinator-mpdo', method: 'alias', … }
 *
 * @example
 * // Normalized path (strips "(GAD)" suffix from directory name)
 * resolveOfficeDivision('GENDER AND DEVELOPMENT OFFICE')
 * // → { slug: 'gender-and-development-office-gad', method: 'normalized', … }
 *
 * @example
 * // Unresolvable — returns null and logs a dev warning
 * resolveOfficeDivision('UNKNOWN OFFICE')
 * // → null
 */
export function resolveOfficeDivision(
  officeDivision: string | null | undefined
): ResolveResult | null {
  if (!officeDivision?.trim()) return null;

  const key = officeDivision.toUpperCase().trim();

  if (_cache.has(key)) return _cache.get(key) ?? null;

  const departments = departmentsData as DepartmentEntry[];

  // ── Step 1: Explicit alias ────────────────────────────────────────────────
  const aliasSlug = EXPLICIT_ALIASES[key];
  if (aliasSlug) {
    const dept = departments.find(d => d.slug === aliasSlug);
    if (dept) {
      const result: ResolveResult = {
        slug: dept.slug,
        officeName: dept.office_name,
        method: 'alias',
        inputQuery: officeDivision,
      };
      _cache.set(key, result);
      return result;
    }
  }

  // ── Step 2: Normalized match ──────────────────────────────────────────────
  const normalizedDept = matchByNormalization(key, departments);
  if (normalizedDept) {
    const result: ResolveResult = {
      slug: normalizedDept.slug,
      officeName: normalizedDept.office_name,
      method: 'normalized',
      inputQuery: officeDivision,
    };
    _cache.set(key, result);
    return result;
  }

  // ── Step 3: Acronym match ─────────────────────────────────────────────────
  const acronymDept = matchByAcronym(key, departments);
  if (acronymDept) {
    const result: ResolveResult = {
      slug: acronymDept.slug,
      officeName: acronymDept.office_name,
      method: 'acronym',
      inputQuery: officeDivision,
    };
    _cache.set(key, result);
    return result;
  }

  // ── No match ──────────────────────────────────────────────────────────────
  _cache.set(key, null);

  if (import.meta.env.DEV) {
    console.warn(
      `[OfficeDivisionResolver] No match for: "${officeDivision}"\n` +
        `  → If this is a valid CC office, add it to EXPLICIT_ALIASES in\n` +
        `    src/lib/officeDivisionResolver.ts`
    );
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Audit / dev utilities
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Runs the resolver against every string in `queries` and prints a full
 * coverage table to the browser console.
 *
 * Call this from a dev console or a one-off test file whenever you add new
 * CC services or update the LGU directory:
 *
 *   import { auditOfficeDivisions, KNOWN_CC_OFFICE_DIVISIONS } from '@/lib/officeDivisionResolver';
 *   auditOfficeDivisions(KNOWN_CC_OFFICE_DIVISIONS);
 */
export function auditOfficeDivisions(queries: string[]): void {
  const rows = queries.map(q => {
    const r = resolveOfficeDivision(q);
    return {
      input: q,
      status: r ? '✅' : '❌',
      slug: r?.slug ?? '—',
      method: r?.method ?? 'unresolved',
    };
  });

  const unmatched = rows.filter(r => r.status === '❌');

  console.group('[OfficeDivisionResolver] Audit Report');
  console.log(`Matched: ${rows.length - unmatched.length} / ${rows.length}`);

  if (unmatched.length) {
    console.warn(`Unmatched (${unmatched.length}) — add to EXPLICIT_ALIASES:`);
    unmatched.forEach(r => console.warn(`  "${r.input}"`));
  }

  console.table(rows);
  console.groupEnd();
}

/**
 * All known `office_division` values from generate_citizens_charter_json.py.
 *
 * Keep this list in sync with the `AGR`, `ASS`, `GAD`, … constants in that
 * script. Used as the input to auditOfficeDivisions() for full coverage checks.
 */
export const KNOWN_CC_OFFICE_DIVISIONS = [
  // From generate_citizens_charter_json.py (section constants)
  'OFFICE OF AGRICULTURAL SERVICES', // AGR
  "ASSESSOR'S OFFICE", // ASS
  'GENDER AND DEVELOPMENT OFFICE', // GAD
  'GENERAL SERVICES OFFICE', // GSO
  'LOCAL CIVIL REGISTRY OFFICE', // LCR
  'LEGAL SERVICES OFFICE', // LEG
  'MANAGEMENT INFORMATION SERVICE SYSTEM', // MISS
  'MUNICIPAL ENVIRONMENT AND NATURAL RESOURCES OFFICE', // MENRO
  'PUBLIC EMPLOYMENT SERVICE OFFICE', // PESO
  'TAYTAY SPORTS DEVELOPMENT OFFICE', // TSDO
  'TOURISM OFFICE', // TOUR
  'TREASURY OFFICE', // TRES
  'URBAN POOR AFFAIRS OFFICE', // UPAO
  'BUSINESS PERMIT AND LICENSING OFFICE', // BPLO
  // Additional offices referenced in the CC data
  'MUNICIPAL PLANNING AND DEVELOPMENT OFFICE',
] as const;
