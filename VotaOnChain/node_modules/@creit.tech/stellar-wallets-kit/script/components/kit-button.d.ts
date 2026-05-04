import type { VNode } from "preact";
import { ButtonMode, ButtonShape, type ButtonSize } from "./shared/mod.js";
export type SwkButtonProps = {
    styles?: string;
    classes?: string;
    mode?: ButtonMode;
    shape?: ButtonShape;
    size?: ButtonSize;
    onClick?: () => void;
    children?: any;
};
export declare function SwkButton(props: SwkButtonProps): VNode;
//# sourceMappingURL=kit-button.d.ts.map