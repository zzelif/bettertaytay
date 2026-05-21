/* Interfaces for Hotline */

export interface Hotline {
  name: string;
  category: string;
  numbers: string[];
  description?: string;
}

export interface HotlineProps {
  maxItems?: number;
}
