// ---------- MongoDB-backed types (matching NestJS schema) ----------

export interface AssignedResource {
  resourceId: string;
  type: "Human" | "Equipment";
  name:string;
  role:string;
}

export interface Job {
  _id: string;
  taskId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  status: "Planifié" | "En cours" | "Terminé";
  assignedResources: AssignedResource[];
  createdAt: string;
  updatedAt: string;
}

export type CreateJobPayload = Omit<Job, "_id" | "createdAt" | "updatedAt">;
export type UpdateJobPayload = Partial<CreateJobPayload>;

// ---------- Auxiliary types (kept for resources/tasks pages) ----------
export interface Equipment {
  _id?: string;
  name: string;
  category: string;
  serialNumber: string;
  model: string;
  brand: string;
  purchaseDate: string;        // ISO date string
  lastMaintenanceDate: string; // ISO date string
  location: string;
  availability: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Resource {
  _id: string;
  type: "Human" | "Equipment";
  name: string;
  role: string;
  availability: boolean;
  createdAt: string;
}

export interface CreateResourcePayload {
  type: "Human" | "Equipment";
  name: string;
  role: string;
  availability: boolean;
}
export interface Human {
  _id: string;
  firstName: string;
  lastName: string;
  cin: string;
  birthDate: string; // ISO date string
  phone: string;
  role: string;
  cvUrl?: string;
  imageUrl?: string;
  availability: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface UpdateResourcePayload {
  type?: "Human" | "Equipment";
  name?: string;
  role?: string;
  availability?: boolean;
}
export interface Task {
  _id: number;
  title: string;
  project: string;
  description:string;
}

// ---------- API error type ----------

export class ApiError extends Error {
  status: number;
  info: unknown;

  constructor(message: string, status: number, info?: unknown) {
    super(message);
    this.status = status;
    this.info = info;
  }
}