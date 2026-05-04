"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonShape = exports.ButtonMode = exports.ButtonSize = void 0;
exports.Button = Button;
const preact_1 = require("htm/preact");
const twind_js_1 = require("../twind.js");
var ButtonSize;
(function (ButtonSize) {
    ButtonSize["xs"] = "xs";
    ButtonSize["sm"] = "sm";
    ButtonSize["md"] = "md";
    ButtonSize["lg"] = "lg";
    ButtonSize["xl"] = "xl";
})(ButtonSize || (exports.ButtonSize = ButtonSize = {}));
var ButtonMode;
(function (ButtonMode) {
    ButtonMode["primary"] = "primary";
    ButtonMode["secondary"] = "secondary";
    ButtonMode["ghost"] = "ghost";
    ButtonMode["free"] = "free";
})(ButtonMode || (exports.ButtonMode = ButtonMode = {}));
var ButtonShape;
(function (ButtonShape) {
    ButtonShape["regular"] = "regular";
    ButtonShape["icon"] = "icon";
})(ButtonShape || (exports.ButtonShape = ButtonShape = {}));
const defaultClasses = "flex items-center justify-center font-semibold easy-in-out transition leading-none";
function Button({ size = ButtonSize.md, mode = ButtonMode.primary, shape = ButtonShape.regular, classes, styles, children, onClick }) {
    const modeStyle = (0, twind_js_1.cx)({
        "border-none bg-primary text-primary-foreground shadow-default hover:opacity-70 focus:opacity-90": mode === ButtonMode.primary,
        "border-none bg-background text-foreground shadow-default hover:opacity-70 focus:opacity-90": mode === ButtonMode.secondary,
        "bg-transparent text-foreground border-transparent border-1 hover:border-light-gray": mode === ButtonMode.ghost,
    });
    const radius = (0, twind_js_1.cx)({
        "rounded-default": shape === ButtonShape.regular,
        "rounded-full": shape === ButtonShape.icon,
    });
    const sizeStyle = (0, twind_js_1.cx)({
        "text-xs": size === ButtonSize.xs,
        "text-sm": size !== ButtonSize.xs,
    });
    const padding = (0, twind_js_1.cx)({
        "px-2 py-1": shape === ButtonShape.regular && (size === ButtonSize.xs || size === ButtonSize.sm),
        "px-2.5 py-1.5": shape === ButtonShape.regular && size === ButtonSize.md,
        "px-3 py-2": shape === ButtonShape.regular && size === ButtonSize.lg,
        "px-3.5 py-2.5": shape === ButtonShape.regular && size === ButtonSize.xl,
        "p-1": shape === ButtonShape.icon && size === ButtonSize.xs,
        "p-1.5": shape === ButtonShape.icon && size === ButtonSize.sm,
        "p-2": shape === ButtonShape.icon && size === ButtonSize.md,
        "p-2.5": shape === ButtonShape.icon && size === ButtonSize.lg,
        "p-3": shape === ButtonShape.icon && size === ButtonSize.xl,
    });
    const theme = mode === ButtonMode.free ? "" : (0, twind_js_1.tw)((0, twind_js_1.cx)("cursor-pointer", defaultClasses, modeStyle, radius, sizeStyle, padding));
    return (0, preact_1.html) `
    <button onClick="${() => onClick()}" type="button" style="${styles}" class="${theme} ${classes}">
      ${children}
    </button>
  `;
}
