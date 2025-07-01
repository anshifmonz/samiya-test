import { ProductFilters } from './product';

export interface UseProductFiltersProps {
  onFiltersChange: (filters: ProductFilters) => void;
}
