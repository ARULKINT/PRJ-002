/**
 * Entry point. Loaded via <script type="module" src="js/main.js"> at the
 * bottom of index.html, so the DOM is already parsed by the time this runs.
 *
 * File map:
 *   data/default-templates.js  – the 6 built-in outreach templates
 *   js/text-utils.js           – plain text-parsing helpers (no DOM)
 *   js/template-store.js       – save/load/remove templates (localStorage)
 *   js/replacement-options.js  – the one shared replacement-value list
 *   js/panel.js                – wiring for a single Passage 1/2 panel
 *   js/template-transfer.js    – page-level Export/Import buttons
 *   js/main.js                 – this file: wires it all together
 */

import { TemplateStore } from "./template-store.js";
import { ReplacementOptions } from "./replacement-options.js";
import { initPanel } from "./panel.js";
import { initTemplateTransfer } from "./template-transfer.js";

TemplateStore.ensureSeeded();
ReplacementOptions.init();
document.querySelectorAll(".panel").forEach(initPanel);
initTemplateTransfer();
