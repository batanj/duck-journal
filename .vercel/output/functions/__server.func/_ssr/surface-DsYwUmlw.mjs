import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { m as cn } from "./app-shell-BIAHNqug.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/surface-DsYwUmlw.js
var import_jsx_runtime = require_jsx_runtime();
function Surface({ className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: cn("rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5", className),
		children
	});
}
function SectionLabel({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mb-3 text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase",
		children
	});
}
//#endregion
export { Surface as n, SectionLabel as t };
