import { config } from '@/lib/lguConfig';

export interface LGULabels {
  lguName: string;
  lguFullName: string;
  province: string;
  regionCode: string;
  portalName: string;
  tagline: string;
  description: string;
  footerBrandName: string;
  aboutLgu: string;
  discoverLgu: string;
  costStatement: string;
  copyrightStatement: () => string;
}

export const lguLabels: LGULabels = {
  lguName: config.lgu.name,
  lguFullName: config.lgu.fullName,
  province: config.lgu.province,
  regionCode: config.lgu.regionCode,
  portalName: config.portal.name,
  tagline: config.portal.tagline,
  description: config.portal.description,
  footerBrandName: config.portal.footerBrandName,
  aboutLgu: `About ${config.lgu.name}`,
  discoverLgu: `Discover ${config.lgu.name}`,
  costStatement: `Cost to the People of ${config.lgu.name} = ₱0`,
  copyrightStatement: () =>
    `© ${new Date().getFullYear()} ${config.portal.name}. All rights reserved.`,
};
