import { Summary } from '@/types/admin/order';
import { TrendingUp, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

export function useSummaryCards(summary: Summary) {
  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      normal: 'bg-success text-white',
      refund: 'bg-status-refund text-white',
      retry: 'bg-status-retry text-black',
      return: 'bg-status-return text-white',
      cancelled: 'bg-status-cancelled text-white'
    };
    return colors[action] || 'bg-muted text-muted-foreground';
  };

  const getActionIcon = (action: string) => {
    const icons: Record<string, React.ReactNode> = {
      normal: <CheckCircle className="h-4 w-4" />,
      refund: <AlertTriangle className="h-4 w-4" />,
      retry: <Clock className="h-4 w-4" />,
      return: <TrendingUp className="h-4 w-4" />,
      cancelled: <AlertTriangle className="h-4 w-4" />
    };
    return icons[action] || <CheckCircle className="h-4 w-4" />;
  };

  return { getActionColor, getActionIcon, summary };
}
