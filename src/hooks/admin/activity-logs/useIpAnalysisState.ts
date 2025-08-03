import { useState, useCallback } from 'react';

interface IpAnalysisFilters {
  dateRange: { from: Date | undefined; to: Date | undefined };
  severity: string;
  minActions: string;
}

const defaultFilters: IpAnalysisFilters = {
  dateRange: { from: undefined, to: undefined },
  severity: "all",
  minActions: "0"
};

export const useIpAnalysisState = () => {
  const [state, setState] = useState<IpAnalysisFilters>(defaultFilters);

  const updateState = useCallback((updates: Partial<IpAnalysisFilters>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetState = useCallback(() => {
    setState(defaultFilters);
  }, []);

  return {
    state,
    updateState,
    resetState
  };
};
