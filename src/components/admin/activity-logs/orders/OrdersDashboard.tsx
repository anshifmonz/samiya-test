'use client';

import { SummaryCards } from './SummaryCards';
import { EventsTable } from './EventsTable';
import { FilterBar } from './FilterBar';
import { ChartsSection } from './ChartsSection';
import { Settings, RefreshCw } from 'lucide-react';
import { Button } from 'ui/button';
import { useOrdersDashboardContext } from 'contexts/admin/activity-logs/order/OrdersActivityLogsContext';
import { OrdersActivityLogsProvider } from 'contexts/admin/activity-logs/order/OrdersActivityLogsContext';

function OrdersDashboardContent() {
  const { isRefreshing, handleRefresh } = useOrdersDashboardContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-admin-background to-muted">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-luxury-black">Order Events Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Monitor and manage order status events
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="border-muted text-luxury-black hover:bg-muted/30"
              >
                <RefreshCw className={'h-4 w-4 mr-2' + (isRefreshing ? ' animate-spin' : '')} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-muted text-luxury-black hover:bg-muted/30"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 py-6 space-y-6">
        <SummaryCards />
        <FilterBar />
        <ChartsSection />
        <EventsTable />
      </main>
    </div>
  );
}

export default function OrdersDashboard() {
  return (
    <OrdersActivityLogsProvider>
      <OrdersDashboardContent />
    </OrdersActivityLogsProvider>
  );
}
