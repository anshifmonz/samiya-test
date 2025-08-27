import { showToast } from 'hooks/ui/use-toast';
import { globalLoadingTracker } from './loadingTracker';

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  successMessage?: string;
  errorMessage?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  showLoadingBar?: boolean; // Control loading bar
  loadingBarDelay?: number; // Minimum time to show loading bar
  bustCache?: boolean; // Add cache-busting query parameter
  retry?: boolean; // Whether to retry on failure (network errors or 5xx/429)
  retryAttempts?: number; // Number of attempts when retry is enabled (e.g., 3)
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
    showLoadingBar = false,
    loadingBarDelay = 200,
    bustCache = false,
    retry = false,
    retryAttempts = 3
  } = options;

  // Start loading bar if requested using global tracker
  const startTime = Date.now();
  let requestId: string | null = null;
  if (showLoadingBar) {
    requestId = globalLoadingTracker.startRequest();
  }

  const isRetryableStatus = (status: number) => status === 429 || (status >= 500 && status < 600);
  const totalAttempts = retry ? Math.max(1, retryAttempts ?? 3) : 1;

  let lastError: string | null = null;
  let lastResponse: Response | null = null;

  for (let attempt = 1; attempt <= totalAttempts; attempt++) {
    // Recompute URL if cache-busting is enabled so each attempt is unique
    let finalUrl = url;
    if (bustCache) {
      const separator = url.includes('?') ? '&' : '?';
      finalUrl = `${url}${separator}_t=${Date.now()}_${attempt}`;
    }

    try {
      const fetchOptions: RequestInit = {
        method,
        headers: {
          ...headers,
          ...(bustCache && {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0'
          })
        }
      };
      if (body !== undefined) {
        fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
        if (!headers['Content-Type']) {
          fetchOptions.headers = {
            ...fetchOptions.headers,
            'Content-Type': 'application/json'
          };
        }
      }

      const response = await fetch(finalUrl, fetchOptions);
      let data: any = null;
      try {
        data = await response.json();
      } catch (e) {
        // Not a JSON response
        data = null;
      }

      if (response.ok && (data == null || !('error' in data) || !data.error)) {
        if (showSuccessToast && successMessage)
          showToast({ title: 'Success', description: successMessage });

        // Stop loading bar with minimum delay if requested using global tracker
        if (showLoadingBar && requestId) {
          const elapsed = Date.now() - startTime;
          const remainingDelay = Math.max(0, loadingBarDelay - elapsed);

          setTimeout(() => {
            globalLoadingTracker.completeRequest(requestId!);
          }, remainingDelay);
        }

        return { data, error: null, response };
      }

      // Handle non-OK responses
      const errMsg = (data && data.error) || errorMessage || 'Request failed';
      lastError = errMsg;
      lastResponse = response;

      // Decide whether to retry based on status code
      if (attempt < totalAttempts && isRetryableStatus(response.status)) {
        continue;
      } else {
        break;
      }
    } catch (err: any) {
      // Network or fetch error
      const errMsg = err?.message || errorMessage || 'Network error';
      lastError = errMsg;
      lastResponse = null;

      if (attempt < totalAttempts) {
        continue;
      } else {
        break;
      }
    }
  }

  // If we reach here, all attempts failed
  if (showErrorToast && lastError)
    showToast({ type: 'error', title: 'Error', description: lastError });

  // Stop loading bar on error using global tracker
  if (showLoadingBar && requestId) globalLoadingTracker.completeRequest(requestId);

  return {
    data: null,
    error: lastError || errorMessage || 'Request failed',
    response: lastResponse
  };
}
