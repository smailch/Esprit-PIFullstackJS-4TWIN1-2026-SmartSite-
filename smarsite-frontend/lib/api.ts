import type { Job, CreateJobPayload, UpdateJobPayload,Resource,CreateResourcePayload,UpdateResourcePayload } from "./types";
import { ApiError } from "./types";

// ✅ API dynamique
const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

// Generic fetch helper
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const info = await res.json().catch(() => null);
    throw new ApiError(
      info?.message ?? `Request failed with status ${res.status}`,
      res.status,
      info
    );
  }

  // ✅ FIX DELETE / 204
  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  return text ? JSON.parse(text) : (undefined as T);
}


/* ======================
        SWR Keys
====================== */

export function getJobsKey() {
  return `/jobs`;
}

export function getJobKey(id: string) {
  return `/jobs/${id}`;
}

/* ======================
        CRUD
====================== */

export function fetcher<T = unknown>(endpoint: string) {
  return apiFetch<T>(endpoint);
}

export function createJob(payload: CreateJobPayload): Promise<Job> {
  return apiFetch<Job>(`/jobs`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateJob(
  id: string,
  payload: UpdateJobPayload
): Promise<Job> {
  return apiFetch<Job>(`/jobs/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteJob(id: string): Promise<void> {
  return apiFetch<void>(`/jobs/${id}`, {
    method: "DELETE",
  });
}
/* ======================
        Resource CRUD
====================== */
export function getResourcesKey() {
  return `/resources`;
}
export function getResourceKey(id: string) {
  return `/resources/${id}`;
}


export function createResource(
  payload: CreateResourcePayload
): Promise<Resource> {
  return apiFetch<Resource>(`/resources`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateResource(
  id: string,
  payload: UpdateResourcePayload
): Promise<Resource> {
  return apiFetch<Resource>(`/resources/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteResource(id: string): Promise<void> {
  return apiFetch<void>(`/resources/${id}`, {
    method: "DELETE",
  });
}
/* ======================
        HUMAN CRUD
====================== */

export function getHumansKey() {
  return `/humans`;
}

export function getHumanKey(id: string) {
  return `/humans/${id}`;
}

export function createHuman(payload: any) {
  return apiFetch(`/humans`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateHuman(id: string, payload: any) {
  return apiFetch(`/humans/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteHuman(id: string) {
  return apiFetch(`/humans/${id}`, {
    method: "DELETE",
  });
}

/* ======================
        EQUIPMENT CRUD
====================== */

export function getEquipmentsKey() {
  return `/equipment`;
}

export function getEquipmentKey(id: string) {
  return `/equipment/${id}`;
}

export function createEquipment(payload: any) {
  return apiFetch(`/equipment`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateEquipment(id: string, payload: any) {
  return apiFetch(`/equipment/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteEquipment(id: string) {
  return apiFetch(`/equipment/${id}`, {
    method: "DELETE",
  });
}
export function getTasksKey() {
  return `/tasks`;
}

// Optionnel : si tu veux fetcher une tâche unique plus tard
export function getTaskKey(id: string) {
  return `/tasks/${id}`;
}