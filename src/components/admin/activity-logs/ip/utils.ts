export const getSeverityLevel = (failureRate: number, totalActions: number): 'critical' | 'high' | 'medium' | 'low' | 'normal' => {
  if (failureRate > 80 || totalActions > 50) return 'critical';
  if (failureRate > 50 || totalActions > 30) return 'high';
  if (failureRate > 30 || totalActions > 15) return 'medium';
  if (failureRate > 10 || totalActions > 5) return 'low';
  return 'normal';
};

export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-red-500 text-white';
    case 'high': return 'bg-orange-500 text-white';
    case 'medium': return 'bg-yellow-500 text-black';
    case 'low': return 'bg-blue-500 text-white';
    default: return 'bg-green-500 text-white';
  }
};
