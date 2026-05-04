"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetHistory = resetHistory;
exports.navigateTo = navigateTo;
exports.goBack = goBack;
exports.MultiPageAnimator = MultiPageAnimator;
const mod_js_1 = require("../state/mod.js");
const preact_1 = require("htm/preact");
const hooks_1 = require("preact/hooks");
function resetHistory() {
    mod_js_1.routerHistory.value = [];
}
function navigateTo(nextRoute) {
    mod_js_1.route.value = nextRoute;
    mod_js_1.routerHistory.value = [...mod_js_1.routerHistory.value, nextRoute];
}
function goBack() {
    const currentHistory = mod_js_1.routerHistory.value;
    currentHistory.pop();
    mod_js_1.routerHistory.value = currentHistory.slice();
    mod_js_1.route.value = currentHistory[currentHistory.length - 1];
}
function PageTransition({ children, isActive, duration = 300 }) {
    const [visible, setVisible] = (0, hooks_1.useState)(isActive);
    const [shouldRender, setShouldRender] = (0, hooks_1.useState)(isActive);
    (0, hooks_1.useEffect)(() => {
        if (isActive) {
            setShouldRender(true);
            globalThis.requestAnimationFrame(() => setVisible(true));
        }
        else {
            setVisible(false);
            const timer = globalThis.setTimeout(() => setShouldRender(false), duration);
            return () => globalThis.clearTimeout(timer);
        }
    }, [isActive, duration]);
    if (!shouldRender)
        return null;
    const styles = {
        position: visible ? 'relative' : 'absolute',
        inset: 0,
        transition: `opacity ${duration}ms ease, transform ${duration}ms ease, position ${duration}ms ease`,
        opacity: visible ? 1 : 0,
    };
    return (0, preact_1.html) `<div style=${styles}>${children}</div>`;
}
function MultiPageAnimator({ currentRoute, pages, duration = 300 }) {
    const entries = Object.entries(pages).map(([key, Component]) => (0, preact_1.html) `
      <${PageTransition} id=${key} key=${key} isActive=${currentRoute === key} duration=${duration}>
        <${Component} />
      <//>
    `);
    return (0, preact_1.html) `<div style=${{ position: 'relative', width: '100%', height: '100%' }}>${entries}</div>`;
}
