/**
 * initTemplateTransfer — wires the page-level Export/Import buttons.
 *
 * Templates live in localStorage, which is scoped per browser per device
 * and never syncs on its own. Export downloads all saved templates as a
 * JSON file; Import loads them back in (skipping exact duplicates), so a
 * template saved on one device/browser can be carried over to another.
 */

import { TemplateStore } from "./template-store.js";

export function initTemplateTransfer() {
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
}
