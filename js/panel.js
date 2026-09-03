/**
 * initPanel — wires up one "Passage" section (Passage 1 or Passage 2).
 *
 * Each panel owns: its own pasted passage text, its own word-to-replace
 * dropdown (built from the words actually present in that passage), Copy,
 * and its own template Save/Load/Remove controls. The replacement VALUES
 * themselves come from the single shared ReplacementOptions list — see
 * js/replacement-options.js.
 */

import { getDistinctWords, applyMarkerReplacement } from "./text-utils.js";
import { TemplateStore } from "./template-store.js";
import { ReplacementOptions } from "./replacement-options.js";

/** Escapes HTML special characters so passage text can't be misread as markup. */
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function initPanel(panelEl) {
  const state = {
    template: "", // the pasted passage, unmodified
    marker: null, // the word inside `template` currently chosen to be replaced
  };

  const copyBtn = panelEl.querySelector(".copy-btn");
  const statusEl = panelEl.querySelector(".status");
  const passageBox = panelEl.querySelector(".passage-box");
  const passageBackdrop = panelEl.querySelector(".passage-backdrop");
  const markerSelect = panelEl.querySelector(".marker-select");
  const templateSelect = panelEl.querySelector(".template-select");
  const templateSaveBtn = panelEl.querySelector(".template-save-btn");
  const templateDeleteBtn = panelEl.querySelector(".template-delete-btn");

  function showStatus(message) {
    statusEl.textContent = message;
    clearTimeout(showStatus._t);
    showStatus._t = setTimeout(() => {
      statusEl.textContent = "";
    }, 2000);
  }

  // ---- Passage preview -----------------------------------------------

  // The passage box has to stay a real, editable <textarea> (so typing and
  // native Ctrl+V paste keep working) — but a plain textarea can't render
  // colored spans. So a same-sized, non-interactive backdrop <div> sits
  // exactly behind it; the textarea's own background is transparent, so
  // the backdrop's highlighted <mark> regions show through behind the
  // textarea's real (opaque) text on top.
  function updateBackdrop(text, ranges) {
    let html = "";
    let pos = 0;
    ranges.forEach(({ start, end }) => {
      html += escapeHtml(text.slice(pos, start));
      html += `<mark>${escapeHtml(text.slice(start, end))}</mark>`;
      pos = end;
    });
    html += escapeHtml(text.slice(pos));
    // Trailing "&nbsp;" keeps a trailing blank line from collapsing, so
    // the backdrop's height/wrapping always matches the textarea's.
    passageBackdrop.innerHTML = html + "&nbsp;";
  }

  /** Recomputes what the passage box shows: raw template, or with the marker swapped (highlighted). */
  function renderPreview() {
    const value = ReplacementOptions.activeValue();
    if (state.marker === null || value === null) {
      passageBox.value = state.template;
      updateBackdrop(state.template, []);
    } else {
      const { text, ranges } = applyMarkerReplacement(state.template, state.marker, value);
      passageBox.value = text;
      updateBackdrop(text, ranges);
    }
  }

  // Keep the highlight backdrop scrolling in lockstep with the textarea.
  passageBox.addEventListener("scroll", () => {
    passageBackdrop.scrollTop = passageBox.scrollTop;
    passageBackdrop.scrollLeft = passageBox.scrollLeft;
  });

  /** Rebuilds the "word to replace" dropdown from the words in the current passage. */
  function rebuildMarkerUI() {
    const words = getDistinctWords(state.template);

    markerSelect.innerHTML = "";
    const placeholderOpt = document.createElement("option");
    placeholderOpt.value = "";
    placeholderOpt.disabled = true;
    placeholderOpt.textContent =
      words.length === 0 ? "Paste a passage first…" : "Choose word…";
    markerSelect.appendChild(placeholderOpt);

    words.forEach((word) => {
      const optionEl = document.createElement("option");
      optionEl.value = word;
      optionEl.textContent = word;
      markerSelect.appendChild(optionEl);
    });

    // Marker is reset whenever the underlying passage changes (see the
    // passage-box "input" handler below) — a marker from a previous
    // passage may no longer make sense, so the user re-picks it.
    state.marker = null;
    markerSelect.value = "";
    placeholderOpt.selected = true;
    renderPreview();
  }

  markerSelect.addEventListener("change", () => {
    state.marker = markerSelect.value === "" ? null : markerSelect.value;
    renderPreview();
  });

  // Programmatic writes to passageBox.value (in renderPreview) don't fire
  // "input", so this only fires on genuine user typing/pasting — that's
  // what tells us the user is (re)defining the whole passage, at which
  // point the marker choice is stale.
  passageBox.addEventListener("input", () => {
    state.template = passageBox.value;
    rebuildMarkerUI();
  });

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(passageBox.value);
      showStatus("Copied!");
    } catch (err) {
      passageBox.focus();
      passageBox.select();
      showStatus("Selected — press Ctrl+C to copy.");
    }
  });

  // ---- Templates (save / load / remove) --------------------------------

  function refreshTemplateOptions() {
    const templates = TemplateStore.all();
    const previousValue = templateSelect.value;

    templateSelect.innerHTML = "";
    const placeholderOpt = document.createElement("option");
    placeholderOpt.value = "";
    placeholderOpt.textContent =
      templates.length === 0 ? "No saved templates yet" : "Load a saved template…";
    templateSelect.appendChild(placeholderOpt);

    templates.forEach((t) => {
      const optionEl = document.createElement("option");
      optionEl.value = t.id;
      optionEl.textContent = t.name;
      templateSelect.appendChild(optionEl);
    });

    const stillExists = templates.some((t) => t.id === previousValue);
    templateSelect.value = stillExists ? previousValue : "";
    templateDeleteBtn.disabled = !stillExists;
  }

  templateSelect.addEventListener("change", () => {
    templateDeleteBtn.disabled = templateSelect.value === "";
    if (templateSelect.value === "") return;

    const template = TemplateStore.all().find((t) => t.id === templateSelect.value);
    if (!template) return;

    passageBox.value = template.passage;
    state.template = template.passage;
    rebuildMarkerUI();
    state.marker = template.marker;
    markerSelect.value = template.marker;
    // Loading a template also replaces the SHARED replacement list, since
    // in practice the same list applies across a template's language
    // variants (e.g. an English and a Tamil draft of the same campaign).
    ReplacementOptions.setRawAndRecompute(template.seed);
    showStatus(`Loaded "${template.name}"`);
  });

  templateSaveBtn.addEventListener("click", () => {
    if (!state.template.trim()) {
      showStatus("Paste a passage before saving a template.");
      return;
    }
    const suggested = state.template.trim().slice(0, 40);
    const name = window.prompt("Name this template:", suggested);
    if (!name || !name.trim()) return;

    TemplateStore.add({
      name: name.trim(),
      passage: state.template,
      marker: state.marker || "",
      seed: ReplacementOptions.rawText(),
    });
    showStatus("Template saved!");
  });

  templateDeleteBtn.addEventListener("click", () => {
    if (!templateSelect.value) return;
    const template = TemplateStore.all().find((t) => t.id === templateSelect.value);
    if (template && window.confirm(`Delete template "${template.name}"?`)) {
      TemplateStore.remove(template.id);
    }
  });

  TemplateStore.onChange(refreshTemplateOptions);
  refreshTemplateOptions();

  // Re-render this panel's preview whenever the shared replacement list
  // (or its active pick) changes — including when the OTHER panel loads a
  // template and replaces the shared list.
  ReplacementOptions.onChange(renderPreview);
  renderPreview();
}
