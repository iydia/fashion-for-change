const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll<HTMLElement>('[data-documentary]').forEach((section) => {
    const frame = section.querySelector<HTMLElement>('[data-documentary-frame]');
    const launch = section.querySelector<HTMLAnchorElement>('[data-video-launch]');
    if (!frame || !launch) return;

    let visible = false;
    let pendingFrame: number | null = null;

    const updateCurtains = () => {
        pendingFrame = null;
        if (reducedMotion.matches) {
            frame.removeAttribute('data-curtains-ready');
            return;
        }
        const bounds = frame.getBoundingClientRect();
        const distance = Math.abs(bounds.top + bounds.height / 2 - innerHeight / 2);
        const fullyOpenZone = innerHeight * 0.12;
        const travel = innerHeight * 0.62;
        const progress = Math.max(0, Math.min(1, 1 - (distance - fullyOpenZone) / travel));
        const eased = progress * progress * (3 - 2 * progress);
        frame.style.setProperty('--curtain-shift', `${(eased * 100).toFixed(2)}%`);
        frame.setAttribute('data-curtains-ready', '');
    };

    const schedule = () => {
        if (pendingFrame === null && !document.hidden) pendingFrame = requestAnimationFrame(updateCurtains);
    };

    const observer = new IntersectionObserver(([entry]) => {
        visible = entry?.isIntersecting ?? false;
        schedule();
    }, { rootMargin: '100px' });
    observer.observe(frame);
    window.addEventListener('scroll', () => { if (visible && !reducedMotion.matches) schedule(); }, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    reducedMotion.addEventListener('change', schedule);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && pendingFrame !== null) {
            cancelAnimationFrame(pendingFrame);
            pendingFrame = null;
        } else if (!document.hidden) schedule();
    });
    schedule();

    launch.addEventListener('click', (event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const videoId = frame.dataset.videoId;
        if (!videoId) return;
        event.preventDefault();
        if (frame.querySelector('iframe')) return;
        const player = document.createElement('iframe');
        player.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?rel=0&playsinline=1`;
        player.title = frame.dataset.videoTitle ?? 'Club documentary';
        player.allow = 'encrypted-media; picture-in-picture; fullscreen';
        player.allowFullscreen = true;
        player.referrerPolicy = 'strict-origin-when-cross-origin';
        frame.append(player);
        launch.hidden = true;
        player.focus();
    });
});
