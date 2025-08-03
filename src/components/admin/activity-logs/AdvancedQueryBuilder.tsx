import { useState } from "react";
import { Plus, Trash2, Code, Copy } from "lucide-react";

import { Button } from "ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "ui/select";
import { Input } from "ui/input";
import { Badge } from "ui/badge";
import { Textarea } from "ui/textarea";
import { useToast } from "ui/use-toast";
import { useActivityLogsContext } from "contexts/ActivityLogsContext";

export interface QueryCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  logic?: 'AND' | 'OR';
}

export interface QueryBuilderProps {
  onQueryChange: (query: QueryCondition[]) => void;
  availableFields: Array<{ value: string; label: string }>;
}

const operators = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'not_contains', label: 'Does Not Contain' },
  { value: 'starts_with', label: 'Starts With' },
  { value: 'ends_with', label: 'Ends With' },
];

export const AdvancedQueryBuilder = () => {
  const { updateFilter, availableFields } = useActivityLogsContext();
  const [conditions, setConditions] = useState<QueryCondition[]>([]);
  const [showRawQuery, setShowRawQuery] = useState(false);
  const [idCounter, setIdCounter] = useState(0);
  const { toast } = useToast();

  const onQueryChange = (query: QueryCondition[]) => {
    updateFilter('advancedQuery', query);
  };

  const addCondition = () => {
    const newId = `condition-${idCounter}`;
    setIdCounter(prev => prev + 1);

    const newCondition: QueryCondition = {
      id: newId,
      field: availableFields[0]?.value || 'action',
      operator: 'equals',
      value: '',
      logic: conditions.length > 0 ? 'AND' : undefined
    };

    const newConditions = [...conditions, newCondition];
    setConditions(newConditions);
    onQueryChange(newConditions);
  };

  const removeCondition = (id: string) => {
    const newConditions = conditions.filter(c => c.id !== id);
    // Reset logic for first condition
    if (newConditions.length > 0) {
      newConditions[0] = { ...newConditions[0], logic: undefined };
    }
    setConditions(newConditions);
    onQueryChange(newConditions);
  };

  const updateCondition = (id: string, updates: Partial<QueryCondition>) => {
    const newConditions = conditions.map(c =>
      c.id === id ? { ...c, ...updates } : c
    );
    setConditions(newConditions);
    onQueryChange(newConditions);
  };

  const clearAll = () => {
    setConditions([]);
    onQueryChange([]);
  };

  const generateQueryString = () => {
    return conditions
      .map((condition, index) => {
        const logicPrefix = index > 0 ? `${condition.logic} ` : '';
        return `${logicPrefix}${condition.field} ${condition.operator} "${condition.value}"`;
      })
      .join(' ');
  };

  const copyQuery = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(generateQueryString());
      toast({
        title: "Query copied",
        description: "The query string has been copied to your clipboard.",
      });
    }
  };

  return (
    <Card className="border-muted">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-luxury-black flex items-center gap-2">
            <Code className="h-5 w-5" />
            Advanced Query Builder
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRawQuery(!showRawQuery)}
              className="text-luxury-black hover:text-luxury-black"
            >
              {showRawQuery ? 'Hide' : 'Show'} Query
            </Button>
            {conditions.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-luxury-black hover:text-luxury-black"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Conditions */}
        <div className="space-y-3">
          {conditions.map((condition, index) => (
            <div key={condition.id} className="flex items-center gap-2 p-3 bg-admin-muted/20 rounded-lg">
              {index > 0 && (
                <Select
                  value={condition.logic}
                  onValueChange={(value: 'AND' | 'OR') => updateCondition(condition.id, { logic: value })}
                >
                  <SelectTrigger className="w-20 h-8  border-muted text-luxury-black">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-muted">
                    <SelectItem value="AND" className="text-luxury-black hover:bg-[#fcfafa] data-[highlighted]:bg-[#fcfafa] hover:cursor-pointer">AND</SelectItem>
                    <SelectItem value="OR" className="text-luxury-black hover:bg-[#fcfafa] data-[highlighted]:bg-[#fcfafa] hover:cursor-pointer">OR</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <Select
                value={condition.field}
                onValueChange={(value) => updateCondition(condition.id, { field: value })}
              >
                <SelectTrigger className="w-40 h-8  border-muted text-luxury-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-muted">
                  {availableFields.map((field) => (
                    <SelectItem key={field.value} value={field.value} className="text-luxury-black hover:bg-[#fcfafa] data-[highlighted]:bg-[#fcfafa] hover:cursor-pointer">
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={condition.operator}
                onValueChange={(value) => updateCondition(condition.id, { operator: value })}
              >
                <SelectTrigger className="w-40 h-8  border-muted text-luxury-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-muted">
                  {operators.map((op) => (
                    <SelectItem key={op.value} value={op.value} className="text-luxury-black hover:bg-[#fcfafa] data-[highlighted]:bg-[#fcfafa] hover:cursor-pointer">
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Value"
                value={condition.value}
                onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                className="flex-1 h-8 border-muted text-luxury-black"
              />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCondition(condition.id)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-error"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add Condition Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={addCondition}
          className=" border-muted text-luxury-black hover:bg-admin-muted/30"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Condition
        </Button>

        {/* Raw Query Display */}
        {showRawQuery && conditions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-luxury-black border-muted">
                Generated Query
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyQuery}
                className="h-6 text-muted-foreground hover:text-luxury-black"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
            </div>
            <Textarea
              value={generateQueryString()}
              readOnly
              className="h-20 bg-admin-muted/20 border-muted text-luxury-black font-mono text-sm resize-none"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
