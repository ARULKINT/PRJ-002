/**
 * ReplacementOptions — the single shared replacement-value list.
 *
 * The list (and which entry is currently "active") is shared by BOTH
 * passages instead of duplicated per panel: maintaining one list matches
 * how these templates are actually used — the same name list drives an
 * English draft and a Tamil draft at once. Each passage still picks its
 * own word-to-replace independently (see js/panel.js), since that word is
 * tied to that passage's own text.
 *
 * Owns the shared DOM controls directly (the textarea + Prev/Next
 * buttons + "current word" readout) since there is exactly one instance
 * of each on the page.
 */

import { parseOptionsWithRanges } from "./text-utils.js";

export const ReplacementOptions = (() => {
  let options = [];
  let optionRanges = [];
  let activeIndex = null;
  let listeners = [];
  let seedBox, prevBtn, nextBtn, currentWordEl;

  function notify() {
    listeners.forEach((fn) => fn());
  }

  function updateControl() {
    const hasOptions = options.length > 0;
    prevBtn.disabled = !hasOptions;
    nextBtn.disabled = !hasOptions;
    currentWordEl.textContent = hasOptions
      ? activeIndex === null
        ? `${options.length} option${options.length === 1 ? "" : "s"} — click ▶ or click a line below`
        : `${options[activeIndex]} (${activeIndex + 1}/${options.length})`
      : "No options yet";
    seedBox.classList.toggle("has-active", activeIndex !== null);
  }

  /** Re-parses the textarea, keeping the same active value selected if it still exists. */
  function recompute() {
    const previousValue = activeIndex !== null ? options[activeIndex] : null;
    const parsed = parseOptionsWithRanges(seedBox.value);
    options = parsed.map((p) => p.text);
    optionRanges = parsed.map((p) => ({ start: p.start, end: p.end }));
    const matchIndex = previousValue !== null ? options.indexOf(previousValue) : -1;
    activeIndex = matchIndex !== -1 ? matchIndex : null;
    updateControl();
    notify();
  }

  function setActive(index) {
    activeIndex = index;
    updateControl();
    notify();
  }

  /** Moves the active selection by +1/-1, wrapping around at either end. */
  function cycle(step) {
    if (options.length === 0) return;
    const base = activeIndex === null ? (step > 0 ? -1 : 0) : activeIndex;
    setActive((base + step + options.length) % options.length);
  }

  /** Activates whichever list entry contains the textarea's current caret position. */
  function selectAtCaret() {
    const pos = seedBox.selectionStart;
    const idx = optionRanges.findIndex((r) => pos >= r.start && pos <= r.end);
    if (idx !== -1) setActive(idx);
  }

  return {
    /** Wires up the shared DOM controls. Call once, after the page has rendered them. */
    init() {
      seedBox = document.querySelector(".seed-box");
      prevBtn = document.querySelector(".prev-btn");
      nextBtn = document.querySelector(".next-btn");
      currentWordEl = document.querySelector(".current-word");

      seedBox.addEventListener("input", recompute);
      // Click (or keyboard-move the caret) onto a line to make it the
      // active replacement — this box is both where you edit the list AND
      // where you pick from it, no separate list widget.
      seedBox.addEventListener("click", selectAtCaret);
      seedBox.addEventListener("keyup", (e) => {
        if (e.key.startsWith("Arrow") || e.key === "Home" || e.key === "End") {
          selectAtCaret();
        }
      });
      prevBtn.addEventListener("click", () => cycle(-1));
      nextBtn.addEventListener("click", () => cycle(1));

      updateControl();
    },

    /** The currently active replacement value, or null if none is picked. */
    activeValue() {
      return activeIndex === null ? null : options[activeIndex];
    },

    /** The textarea's raw text, exactly as typed/pasted (used when saving a template). */
    rawText() {
      return seedBox.value;
    },

    /** Replaces the list's contents programmatically (used when loading a template). */
    setRawAndRecompute(text) {
      seedBox.value = text;
      recompute();
    },

    /** Registers `fn` to run whenever the list or its active pick changes. */
    onChange(fn) {
      listeners.push(fn);
    },
  };
})();
