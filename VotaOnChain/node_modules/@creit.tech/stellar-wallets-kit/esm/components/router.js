import { route, routerHistory } from '../state/mod.js';
import { html } from 'htm/preact';
import { useEffect, useState } from "preact/hooks";
export function resetHistory() {
    routerHistory.value = [];
}
export function navigateTo(nextRoute) {
    route.value = nextRoute;
    routerHistory.value = [...routerHistory.value, nextRoute];
}
export function goBack() {
    const currentHistory = routerHistory.value;
    currentHistory.pop();
    routerHistory.value = currentHistory.slice();
    route.value = currentHistory[currentHistory.length - 1];
}
function PageTransition({ children, isActive, duration = 300 }) {
    const [visible, setVisible] = useState(isActive);
    const [shouldRender, setShouldRender] = useState(isActive);
    useEffect(() => {
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
    return html `<div style=${styles}>${children}</div>`;
}
export function MultiPageAnimator({ currentRoute, pages, duration = 300 }) {
    const entries = Object.entries(pages).map(([key, Component]) => html `
      <${PageTransition} id=${key} key=${key} isActive=${currentRoute === key} duration=${duration}>
        <${Component} />
      <//>
    `);
    return html `<div style=${{ position: 'relative', width: '100%', height: '100%' }}>${entries}</div>`;
}
