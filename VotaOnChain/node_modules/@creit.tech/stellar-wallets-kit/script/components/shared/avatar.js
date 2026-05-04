"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarSize = void 0;
exports.Avatar = Avatar;
const preact_1 = require("htm/preact");
const twind_js_1 = require("../twind.js");
var AvatarSize;
(function (AvatarSize) {
    AvatarSize["xs"] = "w-6 h-6";
    AvatarSize["sm"] = "w-8 h-8";
    AvatarSize["md"] = "w-10 h-10";
    AvatarSize["lg"] = "w-12 h-12";
    AvatarSize["xl"] = "w-14 h-14";
})(AvatarSize || (exports.AvatarSize = AvatarSize = {}));
const defaultClasses = "inline-block rounded-full outline -outline-offset-1 outline-black/5 dark:outline-white/10";
function Avatar(props) {
    return (0, preact_1.html) `
    <img alt="${props.alt}" src="${props.image}" class="${(0, twind_js_1.tw)((0, twind_js_1.cx)(defaultClasses, props.size))}" />
  `;
}
