export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  features: string;
  imageUrl: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  features: string;
  imageUrl: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  location: string;
  logoUrl: string;
  description: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  designation: string;
  content: string;
  rating: number;
  videoUrl: string;
  imageUrl: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  author: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  location: string;
  description: string;
  imageUrl: string;
  category: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface SiteSettings {
  [key: string]: string;
}

// API helper functions
const API_BASE = '/api';

export async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function fetchProducts(category?: string): Promise<Product[]> {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  params.set('active', 'true');
  return fetchAPI(`/products?${params.toString()}`);
}

export async function fetchServices(activeOnly?: boolean): Promise<Service[]> {
  const query = activeOnly ? '?active=true' : '';
  return fetchAPI(`/services${query}`);
}

export async function fetchClients(activeOnly?: boolean): Promise<Client[]> {
  const query = activeOnly ? '?active=true' : '';
  return fetchAPI(`/clients${query}`);
}

export async function fetchTestimonials(activeOnly?: boolean): Promise<Testimonial[]> {
  const query = activeOnly ? '?active=true' : '';
  return fetchAPI(`/testimonials${query}`);
}

export async function fetchBlogs(publishedOnly?: boolean): Promise<Blog[]> {
  const query = publishedOnly ? '?published=true' : '';
  return fetchAPI(`/blogs${query}`);
}

export async function fetchProjects(category?: string): Promise<Project[]> {
  const query = category ? `?category=${category}` : '';
  return fetchAPI(`/projects${query}`);
}

export async function fetchSettings(): Promise<SiteSettings> {
  return fetchAPI('/settings');
}

export async function submitContact(data: { name: string; email: string; phone?: string; subject?: string; message: string }): Promise<ContactMessage> {
  return fetchAPI('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Admin CRUD helpers
export async function createItem<T>(endpoint: string, data: Partial<T>): Promise<T> {
  return fetchAPI(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateItem<T>(endpoint: string, id: string, data: Partial<T>): Promise<T> {
  return fetchAPI(`${endpoint}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteItem(endpoint: string, id: string): Promise<void> {
  await fetchAPI(`${endpoint}/${id}`, {
    method: 'DELETE',
  });
}

// New interfaces

export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  responsibility: string;
  experience: number;
  initials: string;
  gradientFrom: string;
  gradientTo: string;
  accent: string;
  linkedinUrl: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Sector {
  id: string;
  name: string;
  description: string;
  icon: string;
  stat: string;
  statLabel: string;
  gradientFrom: string;
  gradientTo: string;
  accent: string;
  details: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  city: string;
  state: string;
  type: string;
  icon: string;
  isHQ: boolean;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Career {
  id: string;
  title: string;
  location: string;
  experience: string;
  department: string;
  type: string;
  icon: string;
  accent: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// New fetch functions

export async function fetchTeamMembers(activeOnly?: boolean): Promise<TeamMember[]> {
  const query = activeOnly ? '?active=true' : '';
  return fetchAPI(`/team${query}`);
}

export async function fetchSectors(activeOnly?: boolean): Promise<Sector[]> {
  const query = activeOnly ? '?active=true' : '';
  return fetchAPI(`/sectors${query}`);
}

export async function fetchMilestones(activeOnly?: boolean): Promise<Milestone[]> {
  const query = activeOnly ? '?active=true' : '';
  return fetchAPI(`/milestones${query}`);
}

export async function fetchBranches(activeOnly?: boolean): Promise<Branch[]> {
  const query = activeOnly ? '?active=true' : '';
  return fetchAPI(`/branches${query}`);
}

export async function fetchCareers(activeOnly?: boolean): Promise<Career[]> {
  const query = activeOnly ? '?active=true' : '';
  return fetchAPI(`/careers${query}`);
}
