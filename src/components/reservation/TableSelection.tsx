
import React from 'react';
import { Users } from 'lucide-react';
import { TableType } from '@/services/tableService';

interface TableSelectionProps {
  tableTypes: TableType[];
  selectedTable: string;
  setSelectedTable: (table: string) => void;
}

const TableSelection: React.FC<TableSelectionProps> = ({ 
  tableTypes, 
  selectedTable, 
  setSelectedTable 
}) => {
  return (
    <div>
      <h3 className="font-medium mb-3">Select Table Type</h3>
      <div className="space-y-4">
        {tableTypes.map((table) => (
          <div
            key={table.id}
            className={`table-option ${selectedTable === table.size ? 'selected' : ''} p-4 rounded-lg border cursor-pointer hover:bg-accent transition-colors ${selectedTable === table.size ? 'bg-accent' : ''}`}
            onClick={() => setSelectedTable(table.size)}
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5" />
              <div>
                <p className="font-medium">{table.size}</p>
                <p className="text-sm text-muted-foreground">Available: {table.quantity}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSelection;
