export interface FilterState {
  admin: string;
  action: string;
  entityType: string;
  status: string;
  dateRange: {
    from: Date;
    to: Date;
  };
  search: string;
  ipAddress: string;
  advancedQuery: Array<{
    id: string;
    field: string;
    operator: string;
    value: string;
    logic?: 'AND' | 'OR';
  }>;
}

export interface SelectFilterOption {
  value: string;
  label: string;
}

export interface AdminOption {
  id: string;
  username: string;
}
