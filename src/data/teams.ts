import glossary from './glossary.json';

export interface TeamStructure {
    teams: readonly string[];
    leadership?: string;
}

export interface TeamYear extends TeamStructure {
    slug: string;
    label: string;
}

const structures: Record<string, TeamStructure> = glossary.teamStructure;

export const teamYears: TeamYear[] = Object.entries(structures).map(([slug, structure]) => {
    const match = /^(\d{4})-(\d{4})$/.exec(slug);
    if (!match || Number(match[2]) !== Number(match[1]) + 1) {
        throw new Error(`Invalid academic year in glossary.teamStructure: ${slug}`);
    }
    return { ...structure, slug, label: slug.replace('-', '–') };
}).sort((a, b) => b.slug.localeCompare(a.slug));

export const leadershipTerms = {
    BOD: glossary.BOD,
    PVP: glossary.PVP,
    pvpParent: glossary.relationships.PVP.subsetOf
} as const;
