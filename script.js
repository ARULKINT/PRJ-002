function parseOptionsWithRanges(raw) {
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

function getDistinctWords(text) {
  const matches = text.match(/[A-Za-z0-9']+/g) || [];
  return [...new Set(matches)].sort();
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Templates are shared across both panels and saved in this browser only
// (localStorage) — nothing is uploaded anywhere.
const TemplateStore = (() => {
  const KEY = "swapsheet:templates";
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

  return {
    all() {
      return load();
    },
    add(template) {
      const list = load();
      list.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, ...template });
      save(list);
    },
    remove(id) {
      save(load().filter((t) => t.id !== id));
    },
    onChange(fn) {
      listeners.push(fn);
    },
  };
})();

function initPanel(panelEl) {
  const state = {
    template: "",
    marker: null,
    options: [],
    optionRanges: [],
    activeIndex: null,
  };

  const copyBtn = panelEl.querySelector(".copy-btn");
  const statusEl = panelEl.querySelector(".status");
  const passageBox = panelEl.querySelector(".passage-box");
  const markerSelect = panelEl.querySelector(".marker-select");
  const seedBox = panelEl.querySelector(".seed-box");
  const prevBtn = panelEl.querySelector(".prev-btn");
  const nextBtn = panelEl.querySelector(".next-btn");
  const currentWordEl = panelEl.querySelector(".current-word");
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

  function renderPreview() {
    if (state.marker === null || state.activeIndex === null) {
      passageBox.value = state.template;
    } else {
      const value = state.options[state.activeIndex];
      const pattern = new RegExp(`\\b${escapeRegExp(state.marker)}\\b`, "g");
      passageBox.value = state.template.replace(pattern, () => value);
    }
  }

  function updateCycleControl() {
    const hasOptions = state.options.length > 0;
    prevBtn.disabled = !hasOptions;
    nextBtn.disabled = !hasOptions;
    currentWordEl.textContent = hasOptions
      ? state.activeIndex === null
        ? `${state.options.length} option${state.options.length === 1 ? "" : "s"} — click ▶ or click a line below`
        : `${state.options[state.activeIndex]} (${state.activeIndex + 1}/${state.options.length})`
      : "No options yet";
    seedBox.classList.toggle("has-active", state.activeIndex !== null);
  }

  function setActive(index) {
    state.activeIndex = index;
    renderPreview();
    updateCycleControl();
  }

  function cycle(step) {
    if (state.options.length === 0) return;
    const base = state.activeIndex === null ? (step > 0 ? -1 : 0) : state.activeIndex;
    const next = (base + step + state.options.length) % state.options.length;
    setActive(next);
  }

  function recomputeOptions() {
    const previousValue =
      state.activeIndex !== null ? state.options[state.activeIndex] : null;

    const parsed = parseOptionsWithRanges(seedBox.value);
    state.options = parsed.map((p) => p.text);
    state.optionRanges = parsed.map((p) => ({ start: p.start, end: p.end }));

    const matchIndex =
      previousValue !== null ? state.options.indexOf(previousValue) : -1;
    if (matchIndex !== -1) {
      setActive(matchIndex);
    } else {
      state.activeIndex = null;
      renderPreview();
      updateCycleControl();
    }
  }

  function selectLineAtCaret() {
    const pos = seedBox.selectionStart;
    const idx = state.optionRanges.findIndex(
      (r) => pos >= r.start && pos <= r.end
    );
    if (idx !== -1) setActive(idx);
  }

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
    // passage-box "input" handler) — a marker from a previous passage may
    // no longer make sense, so the user re-picks it for the new passage.
    state.marker = null;
    markerSelect.value = "";
    placeholderOpt.selected = true;
    renderPreview();
  }

  seedBox.addEventListener("input", recomputeOptions);
  // Click (or keyboard-move the caret) onto a line to make it the active
  // replacement — this box is both where you edit the list AND where you
  // pick from it, no separate list widget.
  seedBox.addEventListener("click", selectLineAtCaret);
  seedBox.addEventListener("keyup", (e) => {
    if (e.key.startsWith("Arrow") || e.key === "Home" || e.key === "End") {
      selectLineAtCaret();
    }
  });

  markerSelect.addEventListener("change", () => {
    state.marker = markerSelect.value === "" ? null : markerSelect.value;
    renderPreview();
  });

  prevBtn.addEventListener("click", () => cycle(-1));
  nextBtn.addEventListener("click", () => cycle(1));

  // Programmatic writes to passageBox.value (in renderPreview) don't fire
  // "input", so this only fires on genuine user typing/pasting — that's
  // what tells us the user is (re)defining the whole passage, at which
  // point the marker choice and any active replacement are stale.
  passageBox.addEventListener("input", () => {
    state.template = passageBox.value;
    state.activeIndex = null;
    rebuildMarkerUI();
    updateCycleControl();
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
    seedBox.value = template.seed;
    recomputeOptions();
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
      seed: seedBox.value,
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

  updateCycleControl();
}

document.querySelectorAll(".panel").forEach(initPanel);

(function initGlobalTemplateTransfer() {
  const exportBtn = document.getElementById("exportTemplatesBtn");
  const importInput = document.getElementById("importTemplatesInput");
  const statusEl = document.getElementById("globalStatus");

  function showStatus(message) {
    statusEl.textContent = message;
    clearTimeout(showStatus._t);
    showStatus._t = setTimeout(() => {
      statusEl.textContent = "";
    }, 2500);
  }

  exportBtn.addEventListener("click", () => {
    const templates = TemplateStore.all();
    if (templates.length === 0) {
      showStatus("No templates saved yet.");
      return;
    }
    const blob = new Blob([JSON.stringify(templates, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "swapsheet-templates.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showStatus(`Exported ${templates.length} template${templates.length === 1 ? "" : "s"}.`);
  });

  importInput.addEventListener("change", () => {
    const file = importInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      let incoming;
      try {
        incoming = JSON.parse(reader.result);
        if (!Array.isArray(incoming)) throw new Error("not an array");
      } catch (err) {
        showStatus("That file isn't a valid templates export.");
        importInput.value = "";
        return;
      }

      const existing = TemplateStore.all();
      const isDuplicate = (t) =>
        existing.some(
          (e) => e.name === t.name && e.passage === t.passage && e.seed === t.seed
        );

      let added = 0;
      incoming.forEach((t) => {
        if (
          t &&
          typeof t.name === "string" &&
          typeof t.passage === "string" &&
          typeof t.seed === "string" &&
          !isDuplicate(t)
        ) {
          TemplateStore.add({
            name: t.name,
            passage: t.passage,
            marker: typeof t.marker === "string" ? t.marker : "",
            seed: t.seed,
          });
          added += 1;
        }
      });

      showStatus(
        added === 0
          ? "Nothing new to import (already had these)."
          : `Imported ${added} template${added === 1 ? "" : "s"}.`
      );
      importInput.value = "";
    };
    reader.readAsText(file);
  });
})();
