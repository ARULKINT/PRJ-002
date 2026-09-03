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

  updateCycleControl();
}

document.querySelectorAll(".panel").forEach(initPanel);
