import type { ImageMetadata } from 'astro';
import mef from '../assets/funds/mef/MEF_Logo_Stacked.png';
import slef from '../assets/funds/slef/SLEF_Logo_Color_Logo_Name.png';
import crisisServices from '../assets/charities/Women’s_Crisis_Services_of_Waterloo_Region.png';
import oneRoof from '../assets/charities/oneROOF_Youth_Services.jpg';
import humaneSociety from '../assets/charities/KW_Humane_Society.png';
import foodBank from '../assets/charities/Food_Bank_of_Waterloo_Region/2020_04_28_Logo_PrimaryFCPrint.png';

export interface PartnerLogo {
    name: string;
    image: ImageMetadata;
    href?: string;
    // Visible artwork bounds [x, y, width, height] in the original image.
    // These exclude export whitespace; original files remain untouched.
    viewBox: readonly [number, number, number, number];
}

export const funders = [
    { name: 'Mathematics Endowment Fund', href: 'https://uwaterloo.ca/math-endowment-fund/', image: mef, viewBox: [1146, 2831, 6083, 2522] },
    { name: 'Student Life Endowment Fund', href: 'https://wusa.ca/about/your-money/funding/', image: slef, viewBox: [69, 216, 1723, 609] }
] satisfies readonly PartnerLogo[];

export const donationRecipients = [
    { name: 'Women’s Crisis Services of Waterloo Region', image: crisisServices, viewBox: [32, 30, 1397, 342] },
    { name: 'oneROOF Youth Services', image: oneRoof, viewBox: [108, 132, 475, 426] },
    { name: 'The Humane Society of Kitchener Waterloo & Stratford Perth', image: humaneSociety, viewBox: [0, 0, 402, 124] },
    { name: 'The Food Bank of Waterloo Region', image: foodBank, viewBox: [0, 0, 752, 568] }
] satisfies readonly PartnerLogo[];
