import type { VNode } from "preact";
export type ButtonProps = {
    styles?: string;
    classes?: string;
    size: ButtonSize;
    mode: ButtonMode;
    shape: ButtonShape;
    children: any;
    onClick: () => any;
};
export declare enum ButtonSize {
    xs = "xs",
    sm = "sm",
    md = "md",
    lg = "lg",
    xl = "xl"
}
export declare enum ButtonMode {
    primary = "primary",
    secondary = "secondary",
    ghost = "ghost",
    free = "free"
}
export declare enum ButtonShape {
    regular = "regular",
    icon = "icon"
}
export declare function Button({ size, mode, shape, classes, styles, children, onClick }: ButtonProps): VNode;
//# sourceMappingURL=button.d.ts.map