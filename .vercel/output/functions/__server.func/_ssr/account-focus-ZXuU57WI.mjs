import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { d as SelectItem, f as SelectTrigger, l as Select, p as SelectValue, u as SelectContent, x as useJournalStore } from "./app-shell-BIAHNqug.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-focus-ZXuU57WI.js
var import_jsx_runtime = require_jsx_runtime();
function AccountFocus({ className }) {
	const accounts = useJournalStore((s) => s.accounts);
	const focus = useJournalStore((s) => s.focusAccountId);
	const setFocus = useJournalStore((s) => s.setFocusAccountId);
	if (accounts.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
		value: focus,
		onValueChange: setFocus,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
			className: className ?? "w-full sm:w-52",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All accounts" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
			value: "all",
			children: "All accounts"
		}), accounts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
			value: a.id,
			children: a.name
		}, a.id))] })]
	});
}
//#endregion
export { AccountFocus as t };
