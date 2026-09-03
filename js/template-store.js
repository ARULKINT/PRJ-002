/**
 * TemplateStore — save/load/delete named templates.
 *
 * A template bundles one passage + its word-to-replace + a replacement
 * list, so a full setup can be recalled by name later. Templates persist
 * in this browser's localStorage only — nothing is uploaded anywhere.
 * (See js/template-transfer.js for moving templates between browsers.)
 */

import { DEFAULT_TEMPLATES } from "../data/default-templates.js";

const KEY = "swapsheet:templates";
const SEEDED_KEY = "swapsheet:defaultsSeeded";

let listeners = [];

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

function save(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch (err) {
    // Storage unavailable (private browsing, quota, etc.) — templates
    // just won't persist for this session; the rest of the app still works.
  }
  listeners.forEach((fn) => fn(list));
}

export const TemplateStore = {
  /** All saved templates, most-recently-added last. */
  all() {
    return load();
  },

  /** Adds a new template (auto-assigns an id) and notifies listeners. */
  add(template) {
    const list = load();
    list.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      ...template,
    });
    save(list);
  },

  /** Removes one template by id. */
  remove(id) {
    save(load().filter((t) => t.id !== id));
  },

  /** Registers `fn` to run whenever the saved-template list changes. */
  onChange(fn) {
    listeners.push(fn);
  },

  /**
   * Runs once ever per browser: if the built-in defaults (see
   * data/default-templates.js) haven't been loaded in yet, adds them.
   * Marking SEEDED_KEY — rather than checking "is the list empty" — means
   * deleting every template later doesn't cause them to silently reappear
   * on the next page load.
   */
  ensureSeeded() {
    let seeded;
    try {
      seeded = localStorage.getItem(SEEDED_KEY);
    } catch (err) {
      return;
    }
    if (seeded) return;

    const list = load();
    DEFAULT_TEMPLATES.forEach((t) => {
      if (!list.some((existing) => existing.id === t.id)) list.push(t);
    });
    save(list);

    try {
      localStorage.setItem(SEEDED_KEY, "1");
    } catch (err) {
      // ignore
    }
  },
};
