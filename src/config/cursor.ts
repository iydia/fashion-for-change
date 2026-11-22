type RGB = readonly [number, number, number];

export type CursorTone = 'dark' | 'light' | 'photo';

// Dominant opaque blue sampled from FC_Light_Blue_Logo.png: #8CCAFB.
export const FC_BLUE: RGB = [140, 202, 251];

export const CURSOR = {
    maxParticles: 20,
    lifetime: 260,
    maxLength: 96,
    offset: 0,
    palettes: {
        dark: { color: FC_BLUE, core: [232, 247, 255] as RGB, radius: 19, opacity: 0.6 },
        light: { color: [38, 116, 173] as RGB, core: [38, 116, 173] as RGB, radius: 10, opacity: 0.35 },
        photo: { color: FC_BLUE, core: [221, 242, 255] as RGB, radius: 12, opacity: 0.5 }
    }
} as const;
