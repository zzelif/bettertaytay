export interface OutboundRequirement {
  id: string;
  title: string;
  description: string;
  icon: string;
  link?: string;
  linkLabel?: string;
}

export interface ImportantVisaInfo {
  id: string;
  title: string;
  description: string;
  link?: string;
  linkLabel?: string;
  note?: string;
}

export interface VisaTypeItem {
  code: string;
  name: string;
  description: string;
  link?: string;
  linkLabel?: string;
}

export interface VisaTypeCategory {
  category: string;
  description: string;
  items: VisaTypeItem[];
}

export interface CountryVisaPolicy {
  name: string;
  visaFree: boolean;
  allowedStay: string;
  visaType: string;
  requirements: string;
}

export interface EmbassyOffice {
  name: string;
  city: string;
  url: string;
}

export interface EmbassyRegion {
  region: string;
  offices: EmbassyOffice[];
}

export interface FilipinoOutboundTravelPolicy {
  lastUpdated: string;
  disclaimer: string;
  entryRequirements: OutboundRequirement[];
  importantVisaInfo: ImportantVisaInfo[];
  visaTypes: VisaTypeCategory[];
  countries: CountryVisaPolicy[];
  embassies: EmbassyRegion[];
}
