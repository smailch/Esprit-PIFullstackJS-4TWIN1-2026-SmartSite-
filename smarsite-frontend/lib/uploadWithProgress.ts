import axios from "axios";
import { getApiBaseUrl, getAuthHeaderInit } from "./api";
import { formatAxiosError } from "./formatAxiosError";

export type UploadProgressCallback = (percent: number) => void;

/**
 * POST multipart FormData with upload progress (browser XMLHttpRequest via axios).
 * Does not set Content-Type so the boundary is set automatically.
 */
export async function postFormDataWithUploadProgress<T = unknown>(
  path: string,
  formData: FormData,
  options?: { onUploadProgress?: UploadProgressCallback }
): Promise<T> {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  const onProgress = options?.onUploadProgress;
  try {
    const { data } = await axios.post<T>(`${base}${p}`, formData, {
      headers: { ...getAuthHeaderInit() },
      onUploadProgress: (ev) => {
        if (!onProgress) return;
        const total = ev.total;
        if (total && total > 0) {
          onProgress(Math.min(100, Math.round((ev.loaded / total) * 100)));
        }
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });
    onProgress?.(100);
    return data;
  } catch (e) {
    throw new Error(formatAxiosError(e));
  }
}
