import React, { createContext, useContext, ReactNode } from 'react';
import { useOrdersDashboard } from 'hooks/admin/activity-logs/order/useOrdersDashboard';
import { useEventsTable } from 'hooks/admin/activity-logs/order/useEventsTable';
import { useFilterBar } from 'hooks/admin/activity-logs/order/useFilterBar';
import { useChartsSection } from 'hooks/admin/activity-logs/order/useChartsSection';
import { useSummaryCards } from 'hooks/admin/activity-logs/order/useSummaryCards';
import { useDetailsDialog } from 'hooks/admin/activity-logs/order/useDetailsDialog';

// Types for context value
export interface OrdersActivityLogsContextValue {
  ordersDashboard: ReturnType<typeof useOrdersDashboard>;
  eventsTable: ReturnType<typeof useEventsTable>;
  filterBar: ReturnType<typeof useFilterBar>;
  chartsSection: ReturnType<typeof useChartsSection>;
  summaryCards: ReturnType<typeof useSummaryCards>;
  detailsDialog: ReturnType<typeof useDetailsDialog>;
}

const OrdersActivityLogsContext = createContext<OrdersActivityLogsContextValue | undefined>(
  undefined
);

export interface OrdersActivityLogsProviderProps {
  children: ReactNode;
}

export const OrdersActivityLogsProvider: React.FC<OrdersActivityLogsProviderProps> = ({
  children
}) => {
  const ordersDashboard = useOrdersDashboard();
  const { events, summary } = ordersDashboard.data;

  const eventsTable = useEventsTable(events, ordersDashboard.setData);
  const filterBar = useFilterBar(
    ordersDashboard.setFilters,
    ordersDashboard.handleDateRangeChange,
    events
  );
  const chartsSection = useChartsSection(
    events,
    summary,
    ordersDashboard.dateRange.start,
    ordersDashboard.dateRange.end
  );
  const summaryCards = useSummaryCards(summary);
  const detailsDialog = useDetailsDialog();

  const value: OrdersActivityLogsContextValue = {
    ordersDashboard,
    eventsTable,
    filterBar,
    chartsSection,
    summaryCards,
    detailsDialog
  };

  return (
    <OrdersActivityLogsContext.Provider value={value}>
      {children}
    </OrdersActivityLogsContext.Provider>
  );
};

export function useOrdersActivityLogsContext() {
  const ctx = useContext(OrdersActivityLogsContext);
  if (!ctx)
    throw new Error(
      'useOrdersActivityLogsContext must be used within an OrdersActivityLogsProvider'
    );
  return ctx;
}

// Specialized hooks for each section
export function useOrdersDashboardContext() {
  return useOrdersActivityLogsContext().ordersDashboard;
}
export function useEventsTableContext() {
  return useOrdersActivityLogsContext().eventsTable;
}
export function useFilterBarContext() {
  return useOrdersActivityLogsContext().filterBar;
}
export function useChartsSectionContext() {
  return useOrdersActivityLogsContext().chartsSection;
}
export function useSummaryCardsContext() {
  return useOrdersActivityLogsContext().summaryCards;
}
export function useDetailsDialogContext() {
  return useOrdersActivityLogsContext().detailsDialog;
}
