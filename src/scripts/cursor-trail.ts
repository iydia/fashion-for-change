import { CURSOR, type CursorTone } from '../config/cursor';

interface TrailPoint {
    x: number;
    y: number;
    born: number;
}

const canvas = document.querySelector<HTMLCanvasElement>('[data-cursor-trail]');
const context = canvas?.getContext('2d');

if (canvas && context) {
    const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    const points: TrailPoint[] = [];
    let enabled = false;
    let inside = false;
    let frame: number | null = null;
    let x = 0;
    let y = 0;
    let moved = false;
    let toneDirty = true;
    let tone: CursorTone = 'light';
    let color: number[] = [...CURSOR.palettes.light.color];
    let radius: number = CURSOR.palettes.light.radius;
    let opacity: number = CURSOR.palettes.light.opacity;

    const rgba = (rgb: readonly number[], alpha: number) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;

    const clear = () => {
        if (frame !== null) cancelAnimationFrame(frame);
        frame = null;
        delete document.documentElement.dataset.glowCursor;
        points.length = 0;
        inside = false;
        moved = false;
        context.clearRect(0, 0, innerWidth, innerHeight);
    };

    const sampleTone = () => {
        const declared = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-cursor-tone]')?.dataset.cursorTone;
        tone = declared === 'dark' || declared === 'photo' ? declared : 'light';
    };

    const glow = (px: number, py: number, size: number, alpha: number) => {
        const gradient = context.createRadialGradient(px, py, 0, px, py, size);
        gradient.addColorStop(0, rgba(color, alpha));
        gradient.addColorStop(0.35, rgba(color, alpha * 0.45));
        gradient.addColorStop(1, rgba(color, 0));
        context.fillStyle = gradient;
        context.fillRect(px - size, py - size, size * 2, size * 2);
    };

    const render = (now: number) => {
        frame = null;
        if (!enabled || !inside || document.hidden) return;
        context.clearRect(0, 0, innerWidth, innerHeight);
        if (toneDirty) {
            sampleTone();
            toneDirty = false;
        }
        const palette = CURSOR.palettes[tone];
        color = color.map((value, i) => value + (palette.color[i] - value) * 0.22);
        radius += (palette.radius - radius) * 0.22;
        opacity += (palette.opacity - opacity) * 0.22;

        if (moved) {
            points.push({ x: x + CURSOR.offset, y: y + CURSOR.offset, born: now });
            if (points.length > CURSOR.maxParticles) points.shift();
            moved = false;
        }
        while (points.length && now - points[0].born > CURSOR.lifetime) points.shift();

        const headX = x + CURSOR.offset;
        const headY = y + CURSOR.offset;
        const trailLength = tone === 'light' ? CURSOR.maxLength * 0.6 : CURSOR.maxLength;
        let previous: TrailPoint | null = null;
        for (const point of points) {
            const age = 1 - (now - point.born) / CURSOR.lifetime;
            const proximity = Math.max(0, 1 - Math.hypot(point.x - headX, point.y - headY) / trailLength);
            const strength = age * proximity;
            if (previous && strength > 0 && Math.hypot(point.x - previous.x, point.y - previous.y) < CURSOR.maxLength) {
                context.beginPath();
                context.moveTo(previous.x, previous.y);
                context.lineTo(point.x, point.y);
                context.lineWidth = 0.5 + strength * 2.3;
                context.lineCap = 'round';
                context.strokeStyle = rgba(color, opacity * strength * 0.7);
                context.stroke();
            }
            if (strength > 0) glow(point.x, point.y, 3 + strength * 5, strength * opacity * 0.4);
            previous = point;
        }

        glow(headX, headY, radius, opacity);
        context.beginPath();
        context.arc(headX, headY, tone === 'light' ? 1.8 : 2, 0, Math.PI * 2);
        context.fillStyle = rgba(palette.core, 0.95);
        context.fill();
        if (tone === 'photo') {
            context.strokeStyle = 'rgba(14, 43, 68, 0.6)';
            context.lineWidth = 0.7;
            context.stroke();
        }

        // Replace the native cursor only after a usable glow has been painted.
        document.documentElement.dataset.glowCursor = '';

        // Leave the head painted when idle; do not run a permanent animation loop.
        if (points.length || color.some((value, i) => Math.abs(value - palette.color[i]) > 0.5)
            || Math.abs(radius - palette.radius) > 0.1 || Math.abs(opacity - palette.opacity) > 0.01) {
            frame = requestAnimationFrame(render);
        }
    };

    const schedule = () => {
        if (enabled && inside && frame === null) frame = requestAnimationFrame(render);
    };

    const resize = () => {
        if (!enabled) return;
        const ratio = Math.min(devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(innerWidth * ratio);
        canvas.height = Math.round(innerHeight * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        schedule();
    };

    const updatePreference = () => {
        enabled = !motionPreference.matches && finePointer.matches;
        canvas.hidden = !enabled;
        clear();
        if (enabled) resize();
    };

    document.addEventListener('pointermove', (event) => {
        if (!enabled) return;
        if (event.pointerType !== 'mouse') {
            clear();
            return;
        }
        x = event.clientX;
        y = event.clientY;
        inside = true;
        moved = true;
        toneDirty = true;
        schedule();
    }, { passive: true });

    // A stationary pointer can move from a light to dark section during scroll.
    window.addEventListener('scroll', () => {
        if (!enabled || !inside) return;
        toneDirty = true;
        schedule();
    }, { passive: true });
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('blur', clear);
    document.documentElement.addEventListener('pointerleave', clear);
    document.addEventListener('visibilitychange', () => { if (document.hidden) clear(); });
    motionPreference.addEventListener('change', updatePreference);
    finePointer.addEventListener('change', updatePreference);
    updatePreference();
}
