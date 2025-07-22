import { showToast } from 'hooks/ui/use-toast';

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  successMessage?: string;
  errorMessage?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

export async function apiRequest<T = any>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<{ data: T | null; error: string | null; response: Response | null }> {
  const {
    method = 'GET',
    headers = {},
    body,
    successMessage,
    errorMessage,
    showSuccessToast = false,
    showErrorToast = true,
  } = options;

  try {
    const fetchOptions: RequestInit = {
      method,
      headers: { ...headers },
    };
    if (body !== undefined) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
      if (!headers['Content-Type']) {
        fetchOptions.headers = {
          ...fetchOptions.headers,
          'Content-Type': 'application/json',
        };
      }
    }
    const response = await fetch(url, fetchOptions);
    let data: any = null;
    let error: string | null = null;
    try {
      data = await response.json();
    } catch (e) {
      // Not a JSON response
      data = null;
    }
    if (!response.ok) {
      error = (data && data.error) || errorMessage || 'Request failed';
      if (showErrorToast) {
        showToast({ type: 'error', title: 'Error', description: error });
      }
      return { data: null, error, response };
    }
    if (showSuccessToast && successMessage) {
      showToast({ title: 'Success', description: successMessage });
    }
    return { data, error: null, response };
  } catch (err: any) {
    const error = err?.message || errorMessage || 'Network error';
    if (showErrorToast) {
      showToast({ type: 'error', title: 'Error', description: error });
    }
    return { data: null, error, response: null };
  }
}
