import { html } from "htm/preact";
import { cx, tw } from "../twind.js";
export var AvatarSize;
(function (AvatarSize) {
    AvatarSize["xs"] = "w-6 h-6";
    AvatarSize["sm"] = "w-8 h-8";
    AvatarSize["md"] = "w-10 h-10";
    AvatarSize["lg"] = "w-12 h-12";
    AvatarSize["xl"] = "w-14 h-14";
})(AvatarSize || (AvatarSize = {}));
const defaultClasses = "inline-block rounded-full outline -outline-offset-1 outline-black/5 dark:outline-white/10";
export function Avatar(props) {
    return html `
    <img alt="${props.alt}" src="${props.image}" class="${tw(cx(defaultClasses, props.size))}" />
  `;
}
