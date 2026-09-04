/**
 * Small, dependency-free text helpers shared by the replacement-options
 * list and the per-passage word picker. No DOM access, no app state —
 * safe to unit-test or reuse on their own.
 */

/**
 * Splits raw replacement-list text into trimmed, non-empty entries, and
 * records each entry's [start, end) character range within the original
 * string. The ranges let the UI figure out "which line did the user just
 * click on" from a plain caret position (see js/replacement-options.js).
 *
 * Two input shapes are supported:
 *   - One item per line (typing, or pasting an Excel column / CSV rows).
 *   - A single line of comma-separated values.
 */
export function parseOptionsWithRanges(raw) {
  const lines = raw.split(/\r\n|\r|\n/);
  const segments = [];

  if (lines.length === 1 && lines[0].includes(",")) {
    let pos = 0;
    raw.split(",").forEach((part) => {
      const start = pos;
      const end = pos + part.length;
      segments.push({ raw: part, start, end });
      pos = end + 1; // +1 for the comma
    });
  } else {
    let pos = 0;
    lines.forEach((line) => {
      const start = pos;
      const end = pos + line.length;
      segments.push({ raw: line, start, end });
      pos = end + 1; // +1 for the newline
    });
  }

  return segments
    .map((seg) => ({ text: seg.raw.trim(), start: seg.start, end: seg.end }))
    .filter((seg) => seg.text.length > 0);
}

/** Distinct whole words found in `text`, sorted — feeds the "word to replace" dropdown. */
export function getDistinctWords(text) {
  const matches = text.match(/[A-Za-z0-9']+/g) || [];
  return [...new Set(matches)].sort();
}

/** Escapes regex metacharacters so a literal word can be used inside `new RegExp(...)`. */
export function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Finds the first WhatsApp-style bold span in `text` — text wrapped
 * tightly in *asterisks* with no space touching either star, which is
 * WhatsApp's own rule for what actually renders bold (`*Sam*` bolds,
 * `* Sam *` doesn't). Returns the text between the asterisks (asterisks
 * not included), or null if there isn't one.
 */
export function detectAsteriskMarker(text) {
  const match = text.match(/\*(\S(?:[^*\n]*\S)?)\*/);
  return match ? match[1] : null;
}

/**
 * Replaces every whole-word occurrence of `marker` in `template` with
 * `value`, and — unlike a plain String.replace — also reports back where
 * each inserted `value` landed in the RESULT string. That's what lets the
 * passage box highlight exactly the text it just swapped in (see
 * js/panel.js), even though `value` may be a different length than
 * `marker`, which shifts every later match's position.
 *
 * Returns { text, ranges } where each range is a { start, end } pair
 * (end exclusive) into `text`.
 */
export function applyMarkerReplacement(template, marker, value) {
  const pattern = new RegExp(`\\b${escapeRegExp(marker)}\\b`, "g");
  let result = "";
  let lastIndex = 0;
  const ranges = [];
  let match;

  while ((match = pattern.exec(template)) !== null) {
    result += template.slice(lastIndex, match.index);
    const start = result.length;
    result += value;
    ranges.push({ start, end: result.length });
    lastIndex = match.index + match[0].length;
  }
  result += template.slice(lastIndex);

  return { text: result, ranges };
}
