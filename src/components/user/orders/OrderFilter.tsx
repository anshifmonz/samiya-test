'use client';

import { Card, CardContent, CardHeader, CardTitle } from 'ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'ui/select';
import { Filter } from 'lucide-react';

interface OrderFilterProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const OrderFilter = ({ selectedFilter, onFilterChange }: OrderFilterProps) => {
  return (
    <Card className="bg-profile-card border-profile-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filter Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-foreground">Time Period:</label>
            <Select value={selectedFilter} onValueChange={onFilterChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="last30days">Last 30 Days</SelectItem>
                <SelectItem value="past3months">Past 3 Months</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderFilter;
