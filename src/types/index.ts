export type RateType = '時給' | '日給' | '月額';

export interface Rate {
  type: RateType;
  amount: number;
}

export interface Consultant {
  id: string;
  name: string;
  experienceYears: number;
  preferredRate: Rate;
  preferredUtilization: number;
  baseLocation: string;
  remote: boolean;
  skills: string[];
  industries: string[];
  availableFrom: string;
  engagementLength: string;
  bio: string;
  contact: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  company: string;
  maskedCompany: string;
  description: string;
  requiredSkills: string[];
  niceToHaveSkills?: string[];
  role: string;
  utilization: number;
  rateLower: number;
  rateUpper: number;
  engagementLength: string;
  startDate: string;
  workStyle: 'リモート' | '出社' | 'ハイブリッド';
  location: string;
  industry: string;
  contact: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  targetId: string;
  targetType: 'project' | 'consultant';
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export type CollectionKey = 'consultants' | 'projects' | 'inquiries';
