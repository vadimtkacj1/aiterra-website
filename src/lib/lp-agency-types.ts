export interface LeadFormData {
  name: string;
  phone: string;
  email: string;
  businessType: string;
}

export interface ShortLeadFormData {
  name: string;
  phone: string;
}

export interface Service {
  id: number;
  title: string;
  description: string[];
  icon: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image?: string;
  url?: string;
  tags?: string[];
}

export interface Pillar {
  id: number;
  title: string;
  description: string;
  icon: string;
}
