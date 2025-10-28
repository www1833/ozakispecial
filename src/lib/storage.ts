import { Consultant, Project, Inquiry, CollectionKey } from '../types';

const STORAGE_KEY_PREFIX = 'consultbridge:';
const COLLECTION_KEYS: Record<CollectionKey, string> = {
  consultants: `${STORAGE_KEY_PREFIX}consultants`,
  projects: `${STORAGE_KEY_PREFIX}projects`,
  inquiries: `${STORAGE_KEY_PREFIX}inquiries`,
};

const DATA_VERSION_KEY = `${STORAGE_KEY_PREFIX}version`;
const DATA_VERSION = '2024-03-25';

export async function seedData(): Promise<void> {
  const storedVersion = localStorage.getItem(DATA_VERSION_KEY);
  if (storedVersion === DATA_VERSION) {
    return;
  }

  const [consultantsRes, projectsRes] = await Promise.all([
    fetch(`${import.meta.env.BASE_URL}mock/consultants.json`),
    fetch(`${import.meta.env.BASE_URL}mock/projects.json`),
  ]);

  if (!consultantsRes.ok || !projectsRes.ok) {
    throw new Error('モックデータの読み込みに失敗しました');
  }

  const consultants = (await consultantsRes.json()) as Consultant[];
  const projects = (await projectsRes.json()) as Project[];

  localStorage.setItem(COLLECTION_KEYS.consultants, JSON.stringify(consultants));
  localStorage.setItem(COLLECTION_KEYS.projects, JSON.stringify(projects));
  localStorage.setItem(COLLECTION_KEYS.inquiries, JSON.stringify([]));
  localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
}

function readCollection<T>(key: CollectionKey): T[] {
  const raw = localStorage.getItem(COLLECTION_KEYS[key]);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as T[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

function writeCollection<T>(key: CollectionKey, items: T[]): void {
  localStorage.setItem(COLLECTION_KEYS[key], JSON.stringify(items));
}

export function getConsultants(): Consultant[] {
  return readCollection<Consultant>('consultants');
}

export function getProjects(): Project[] {
  return readCollection<Project>('projects');
}

export function getInquiries(): Inquiry[] {
  return readCollection<Inquiry>('inquiries');
}

export function addConsultant(consultant: Consultant): void {
  const consultants = getConsultants();
  consultants.push(consultant);
  writeCollection('consultants', consultants);
}

export function addProject(project: Project): void {
  const projects = getProjects();
  projects.push(project);
  writeCollection('projects', projects);
}

export function addInquiry(inquiry: Inquiry): void {
  const inquiries = getInquiries();
  inquiries.push(inquiry);
  writeCollection('inquiries', inquiries);
}

export function updateConsultant(updated: Consultant): void {
  const consultants = getConsultants().map((consultant) =>
    consultant.id === updated.id ? updated : consultant
  );
  writeCollection('consultants', consultants);
}

export function updateProject(updated: Project): void {
  const projects = getProjects().map((project) => (project.id === updated.id ? updated : project));
  writeCollection('projects', projects);
}

export function deleteConsultant(id: string): void {
  const consultants = getConsultants().filter((consultant) => consultant.id !== id);
  writeCollection('consultants', consultants);
}

export function deleteProject(id: string): void {
  const projects = getProjects().filter((project) => project.id !== id);
  writeCollection('projects', projects);
}

export function deleteInquiry(id: string): void {
  const inquiries = getInquiries().filter((inquiry) => inquiry.id !== id);
  writeCollection('inquiries', inquiries);
}
