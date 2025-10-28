import { Consultant, Project } from '../types';

export interface ProjectSearchQuery {
  keyword?: string;
  role?: string;
  skills?: string[];
  rateMin?: number;
  rateMax?: number;
  utilization?: number;
  workStyle?: string;
  industry?: string;
  sort?: 'new' | 'rate-high' | 'start-soon';
}

export interface ConsultantSearchQuery {
  keyword?: string;
  skills?: string[];
  experience?: number;
  rateMax?: number;
  utilization?: number;
  location?: string;
  remote?: string;
  industry?: string;
  sort?: 'new' | 'rate-low' | 'experience';
}

export function filterProjects(projects: Project[], query: ProjectSearchQuery): Project[] {
  return projects.filter((project) => {
    if (query.keyword) {
      const keyword = query.keyword.toLowerCase();
      if (
        !project.title.toLowerCase().includes(keyword) &&
        !project.description.toLowerCase().includes(keyword)
      ) {
        return false;
      }
    }
    if (query.role && project.role !== query.role) {
      return false;
    }
    if (query.workStyle && project.workStyle !== query.workStyle) {
      return false;
    }
    if (query.industry && project.industry !== query.industry) {
      return false;
    }
    if (query.skills && query.skills.length > 0) {
      const hasAll = query.skills.every((skill) =>
        project.requiredSkills.concat(project.niceToHaveSkills ?? []).includes(skill)
      );
      if (!hasAll) {
        return false;
      }
    }
    if (query.rateMin && project.rateUpper < query.rateMin) {
      return false;
    }
    if (query.rateMax && project.rateLower > query.rateMax) {
      return false;
    }
    if (query.utilization && project.utilization < query.utilization) {
      return false;
    }
    return true;
  });
}

export function filterConsultants(
  consultants: Consultant[],
  query: ConsultantSearchQuery
): Consultant[] {
  return consultants.filter((consultant) => {
    if (query.keyword) {
      const keyword = query.keyword.toLowerCase();
      if (
        !consultant.name.toLowerCase().includes(keyword) &&
        !consultant.bio.toLowerCase().includes(keyword)
      ) {
        return false;
      }
    }
    if (query.skills && query.skills.length > 0) {
      const hasAll = query.skills.every((skill) => consultant.skills.includes(skill));
      if (!hasAll) {
        return false;
      }
    }
    if (query.experience && consultant.experienceYears < query.experience) {
      return false;
    }
    if (query.rateMax && consultant.preferredRate.amount > query.rateMax) {
      return false;
    }
    if (query.utilization && consultant.preferredUtilization < query.utilization) {
      return false;
    }
    if (query.location && consultant.baseLocation !== query.location) {
      return false;
    }
    if (query.remote) {
      const wantsRemote = query.remote === 'true';
      if (consultant.remote !== wantsRemote) {
        return false;
      }
    }
    if (query.industry && !consultant.industries.includes(query.industry)) {
      return false;
    }
    return true;
  });
}

export function sortProjects(projects: Project[], sort?: ProjectSearchQuery['sort']): Project[] {
  const sorted = [...projects];
  switch (sort) {
    case 'rate-high':
      return sorted.sort((a, b) => b.rateUpper - a.rateUpper);
    case 'start-soon':
      return sorted.sort((a, b) => a.startDate.localeCompare(b.startDate));
    case 'new':
    default:
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

export function sortConsultants(
  consultants: Consultant[],
  sort?: ConsultantSearchQuery['sort']
): Consultant[] {
  const sorted = [...consultants];
  switch (sort) {
    case 'rate-low':
      return sorted.sort((a, b) => a.preferredRate.amount - b.preferredRate.amount);
    case 'experience':
      return sorted.sort((a, b) => b.experienceYears - a.experienceYears);
    case 'new':
    default:
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

export function paginate<T>(items: T[], page: number, perPage: number): {
  items: T[];
  totalPages: number;
} {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const start = (page - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    totalPages,
  };
}
