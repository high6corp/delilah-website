import type { ApiError } from '@/types';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export class ApiRequestError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.name = 'ApiRequestError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

async function parseError(response: Response): Promise<ApiRequestError> {
  let message = `Request failed with status ${response.status}`;
  let code = 'UNKNOWN_ERROR';
  try {
    const data = (await response.json()) as ApiError;
    message = data.error?.message ?? message;
    code = data.error?.code ?? code;
  } catch {
    // response body is not JSON
  }
  return new ApiRequestError(message, response.status, code);
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  return response;
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await apiFetch(path, { method: 'GET' });
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await apiFetch(path, {
    method: 'POST',
    body: body instanceof FormData ? body : JSON.stringify(body),
  });
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

export async function apiDelete(path: string): Promise<void> {
  await apiFetch(path, { method: 'DELETE' });
}

export function uploadWithProgress(
  path: string,
  formData: FormData,
  onProgress: (progress: number) => void
): Promise<XMLHttpRequest> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr);
      } else {
        let message = `Upload failed with status ${xhr.status}`;
        let code = 'UNKNOWN_ERROR';
        try {
          const data = JSON.parse(xhr.responseText) as ApiError;
          message = data.error?.message ?? message;
          code = data.error?.code ?? code;
        } catch {
          // ignore
        }
        reject(new ApiRequestError(message, xhr.status, code));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new ApiRequestError('Network error', 0, 'NETWORK_ERROR'));
    });

    xhr.addEventListener('abort', () => {
      reject(new ApiRequestError('Upload aborted', 0, 'ABORTED'));
    });

    xhr.open('POST', `${API_BASE_URL}${path}`);
    xhr.withCredentials = true;
    xhr.send(formData);
  });
}
