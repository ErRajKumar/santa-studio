import inv01 from '../assets/images/inv_classic_elegance_1795107675084.jpg';
import inv02 from '../assets/images/inv_midnight_magic_1795107675063.jpg';
import inv03 from '../assets/images/inv_candy_cane_1795107674949.jpg';
import inv04 from '../assets/images/inv_neon_party_1795107674762.jpg';
import inv05 from '../assets/images/inv_rustic_kraft_1795107674752.jpg';
import inv06 from '../assets/images/inv_luxury_gold_1795107674722.jpg';
import inv07 from '../assets/images/inv_snowy_wonderland_1795107675508.jpg';
import inv08 from '../assets/images/inv_santa_party_1795107674766.jpg';
import inv09 from '../assets/images/inv_minimal_nordic_1795107674812.jpg';
import inv10 from '../assets/images/inv_vintage_ticket_1795107674509.jpg';

import wish01 from '../assets/images/wish_traditional_merry_1795107704457.jpg';
import wish02 from '../assets/images/wish_elegant_gold_1795107704810.jpg';
import wish03 from '../assets/images/wish_snowfall_greetings_1795107708353.jpg';
import wish04 from '../assets/images/wish_christmas_lights_1795107674882.jpg';
import wish05 from '../assets/images/wish_santa_greetings_1795107707220.jpg';
import wish06 from '../assets/images/wish_luxury_minimal_1795107707379.jpg';
import wish07 from '../assets/images/wish_christmas_family_1795107708125.jpg';
import wish08 from '../assets/images/wish_cute_gingerbread_1795107675943.jpg';
import wish09 from '../assets/images/wish_midnight_starry_1795107706442.jpg';
import wish10 from '../assets/images/wish_modern_editorial_1795107707516.jpg';

export interface BackdropPlacement {
  src: string;
  /** Slight edge crop (>1) removes desk shadow edges on flat-lay paper renders */
  cropScale: number;
  /** Safe vertical content zone in canonical 1200x1500 coordinates */
  textTopY: number;
  textBottomY: number;
  maxTextWidth: number;
  /** Optional subtle center scrim for maximum contrast over scenic areas */
  centerScrimColor?: string;
  metallicGoldTitle?: boolean;
  neonGlowTitle?: boolean;
}

export const TEMPLATE_BACKDROPS: Record<string, BackdropPlacement> = {
  'invitation-01': {
    src: inv01,
    cropScale: 1.0,
    textTopY: 425,
    textBottomY: 1365,
    maxTextWidth: 820,
    metallicGoldTitle: true,
  },
  'invitation-02': {
    src: inv02,
    cropScale: 1.0,
    textTopY: 325,
    textBottomY: 1185,
    maxTextWidth: 760,
    centerScrimColor: 'rgba(6, 17, 34, 0.36)',
    metallicGoldTitle: true,
  },
  'invitation-03': {
    src: inv03,
    cropScale: 1.0,
    textTopY: 340,
    textBottomY: 1265,
    maxTextWidth: 780,
  },
  'invitation-04': {
    src: inv04,
    cropScale: 1.0,
    textTopY: 195,
    textBottomY: 1370,
    maxTextWidth: 860,
    centerScrimColor: 'rgba(9, 8, 28, 0.38)',
    neonGlowTitle: true,
  },
  'invitation-05': {
    src: inv05,
    cropScale: 1.0,
    textTopY: 465,
    textBottomY: 1365,
    maxTextWidth: 790,
  },
  'invitation-06': {
    src: inv06,
    cropScale: 1.0,
    textTopY: 485,
    textBottomY: 1380,
    maxTextWidth: 840,
    metallicGoldTitle: true,
  },
  'invitation-07': {
    src: inv07,
    cropScale: 1.0,
    textTopY: 315,
    textBottomY: 1350,
    maxTextWidth: 780,
    centerScrimColor: 'rgba(232, 243, 252, 0.38)',
  },
  'invitation-08': {
    src: inv08,
    cropScale: 1.0,
    textTopY: 540,
    textBottomY: 1235,
    maxTextWidth: 820,
    centerScrimColor: 'rgba(130, 14, 22, 0.34)',
  },
  'invitation-09': {
    src: inv09,
    cropScale: 1.12,
    textTopY: 440,
    textBottomY: 1255,
    maxTextWidth: 820,
  },
  'invitation-10': {
    src: inv10,
    cropScale: 1.0,
    textTopY: 190,
    textBottomY: 1315,
    maxTextWidth: 700,
  },
  'wishes-01': {
    src: wish01,
    cropScale: 1.0,
    textTopY: 345,
    textBottomY: 1170,
    maxTextWidth: 640,
    metallicGoldTitle: true,
  },
  'wishes-02': {
    src: wish02,
    cropScale: 1.12,
    textTopY: 340,
    textBottomY: 1200,
    maxTextWidth: 760,
  },
  'wishes-03': {
    src: wish03,
    cropScale: 1.0,
    textTopY: 225,
    textBottomY: 1090,
    maxTextWidth: 860,
    centerScrimColor: 'rgba(12, 32, 56, 0.25)',
    metallicGoldTitle: true,
  },
  'wishes-04': {
    src: wish04,
    cropScale: 1.0,
    textTopY: 345,
    textBottomY: 1155,
    maxTextWidth: 820,
    metallicGoldTitle: true,
  },
  'wishes-05': {
    src: wish05,
    cropScale: 1.0,
    textTopY: 545,
    textBottomY: 1230,
    maxTextWidth: 820,
  },
  'wishes-06': {
    src: wish06,
    cropScale: 1.12,
    textTopY: 345,
    textBottomY: 1320,
    maxTextWidth: 780,
  },
  'wishes-07': {
    src: wish07,
    cropScale: 1.0,
    textTopY: 265,
    textBottomY: 1245,
    maxTextWidth: 800,
    metallicGoldTitle: true,
  },
  'wishes-08': {
    src: wish08,
    cropScale: 1.0,
    textTopY: 295,
    textBottomY: 1150,
    maxTextWidth: 820,
  },
  'wishes-09': {
    src: wish09,
    cropScale: 1.0,
    textTopY: 390,
    textBottomY: 1215,
    maxTextWidth: 820,
    metallicGoldTitle: true,
  },
  'wishes-10': {
    src: wish10,
    cropScale: 1.12,
    textTopY: 420,
    textBottomY: 1290,
    maxTextWidth: 840,
  },
};
