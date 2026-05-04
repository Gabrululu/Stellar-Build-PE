import type { SwkAppRoute } from '../types/mod.js';
import type { VNode } from "preact";
export declare function resetHistory(): void;
export declare function navigateTo(nextRoute: SwkAppRoute): void;
export declare function goBack(): void;
export type MultiPageAnimatorProps = {
    currentRoute: SwkAppRoute;
    pages: Record<SwkAppRoute, () => VNode>;
    duration?: number;
};
export declare function MultiPageAnimator({ currentRoute, pages, duration }: MultiPageAnimatorProps): VNode<{}>;
//# sourceMappingURL=router.d.ts.map