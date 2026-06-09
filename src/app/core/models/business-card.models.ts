export interface BusinessCardHelpItem {
  title: string;
  description?: string;
  items?: BusinessCardHelpItem[];
}

export interface BusinessCardConfig {
  cardTitle: string;
  tagline: string;
  availability: string;
  helpHeading: string;
  helpItems: BusinessCardHelpItem[];
  portfolioUrl: string;
  qrTargetUrl: string;
}

export type CopyFeedback = 'email' | 'url' | null;
