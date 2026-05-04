import type { VNode } from "preact";
export type AvatarProps = {
    alt: string;
    image: string;
    size: AvatarSize;
};
export declare enum AvatarSize {
    xs = "w-6 h-6",
    sm = "w-8 h-8",
    md = "w-10 h-10",
    lg = "w-12 h-12",
    xl = "w-14 h-14"
}
export declare function Avatar(props: AvatarProps): VNode;
//# sourceMappingURL=avatar.d.ts.map