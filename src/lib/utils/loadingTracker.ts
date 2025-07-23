'use client';

/**
 * Global loading tracker to handle simultaneous API requests
 * Prevents premature hiding of loading bar when multiple requests are active
 */
class LoadingTracker {
  private activeRequests = new Set<string>();
  private requestCounter = 0;

  startRequest(): string {
    const requestId = `req_${++this.requestCounter}_${Date.now()}`;
    this.activeRequests.add(requestId);

    if (this.activeRequests.size === 1) this.triggerLoadingStart();
    return requestId;
  }

  completeRequest(requestId: string): void {
    this.activeRequests.delete(requestId);
    if (this.activeRequests.size === 0) this.triggerLoadingStop();
  }

  completeAllRequests(): void {
    this.activeRequests.clear();
    this.triggerLoadingStop();
  }

  getActiveRequestCount(): number {
    return this.activeRequests.size;
  }

  hasActiveRequests(): boolean {
    return this.activeRequests.size > 0;
  }

  getActiveRequestIds(): string[] {
    return Array.from(this.activeRequests);
  }

  private triggerLoadingStart(): void {
    if (typeof window !== 'undefined')
      window.dispatchEvent(new CustomEvent('start-loading'));
  }

  private triggerLoadingStop(): void {
    if (typeof window !== 'undefined')
      window.dispatchEvent(new CustomEvent('stop-loading'));
  }
}

// global singleton instance
export const globalLoadingTracker = new LoadingTracker();

// hook for components to interact with the global loading tracker
export const useLoadingTracker = () => {
  return {
    startRequest: () => globalLoadingTracker.startRequest(),
    completeRequest: (id: string) => globalLoadingTracker.completeRequest(id),
    completeAllRequests: () => globalLoadingTracker.completeAllRequests(),
    getActiveCount: () => globalLoadingTracker.getActiveRequestCount(),
    hasActiveRequests: () => globalLoadingTracker.hasActiveRequests(),
    getActiveRequestIds: () => globalLoadingTracker.getActiveRequestIds(),
  };
};
