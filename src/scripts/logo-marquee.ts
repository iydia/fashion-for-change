const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

document.querySelectorAll<HTMLElement>('[data-logo-marquee]').forEach((band) => {
    let visible = false;
    let activeCard: HTMLElement | null = null;
    let frame: number | null = null;
    let pointerX = 0;
    let pointerY = 0;

    const resetTilt = () => {
        if (frame !== null) cancelAnimationFrame(frame);
        frame = null;
        if (activeCard) {
            delete activeCard.dataset.tilting;
            for (const property of ['--tilt-x', '--tilt-y', '--pointer-x', '--pointer-y']) {
                activeCard.style.removeProperty(property);
            }
        }
        activeCard = null;
    };

    const updateTilt = () => {
        if (!activeCard) return;
        // Read the untransformed hit area: the surface tilts, not the card slot.
        // Re-read while active because the marquee continues moving underneath it.
        const bounds = activeCard.getBoundingClientRect();
        const x = (pointerX - bounds.left) / bounds.width;
        const y = (pointerY - bounds.top) / bounds.height;
        if (x < 0 || x > 1 || y < 0 || y > 1) {
            resetTilt();
            return;
        }
        // The nearest edge dips away; the opposite edge lifts. Maximum tilt: 3°.
        activeCard.style.setProperty('--tilt-x', `${((0.5 - y) * 6).toFixed(2)}deg`);
        activeCard.style.setProperty('--tilt-y', `${((x - 0.5) * 6).toFixed(2)}deg`);
        activeCard.style.setProperty('--pointer-x', `${(x * 100).toFixed(1)}%`);
        activeCard.style.setProperty('--pointer-y', `${(y * 100).toFixed(1)}%`);
        frame = requestAnimationFrame(updateTilt);
    };

    const updateVisibility = () => {
        const active = visible && !document.hidden;
        band.dataset.inView = String(active);
        if (!active) resetTilt();
    };

    const updatePreference = () => {
        band.toggleAttribute('data-animated', !motionPreference.matches);
        if (motionPreference.matches || !finePointer.matches) resetTilt();
    };

    band.querySelectorAll<HTMLElement>('.logo-card').forEach((card) => {
        card.addEventListener('pointerenter', (event) => {
            if (event.pointerType !== 'mouse' || motionPreference.matches || !finePointer.matches || document.hidden) return;
            resetTilt();
            activeCard = card;
            pointerX = event.clientX;
            pointerY = event.clientY;
            card.dataset.tilting = '';
            frame = requestAnimationFrame(updateTilt);
        });
        card.addEventListener('pointermove', (event) => {
            if (activeCard !== card) return;
            pointerX = event.clientX;
            pointerY = event.clientY;
        });
        card.addEventListener('pointerleave', () => {
            if (activeCard === card) resetTilt();
        });
        card.addEventListener('pointercancel', () => {
            if (activeCard === card) resetTilt();
        });
    });

    // CSS owns track movement. Only the currently hovered card uses a frame loop.
    const observer = new IntersectionObserver(([entry]) => {
        visible = entry?.isIntersecting ?? false;
        updateVisibility();
    }, { rootMargin: '100px' });
    observer.observe(band);
    document.addEventListener('visibilitychange', updateVisibility);
    motionPreference.addEventListener('change', updatePreference);
    finePointer.addEventListener('change', updatePreference);
    updatePreference();
});
