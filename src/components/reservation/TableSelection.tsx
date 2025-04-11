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
    <div className="space-y-6">
      <h3 className="font-semibold text-2xl text-center mb-4 text-gray-800">Select Your Table Type</h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tableTypes.map((table) => (
          <div
            key={table.id}
            className={`table-option p-6 rounded-xl border-2 border-transparent cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:border-accent 
              ${selectedTable === table.size ? 'bg-accent text-white border-accent scale-105' : 'bg-white text-gray-800 border-gray-200'}`}
            onClick={() => setSelectedTable(table.size)}
          >
            <div className="flex items-center gap-4">
              <Users className={`w-8 h-8 ${selectedTable === table.size ? 'text-white' : 'text-accent'}`} />
              <div>
                <p className={`font-semibold text-lg ${selectedTable === table.size ? 'text-white' : 'text-gray-900'}`}>{table.size}</p>
                <p className={`text-sm ${selectedTable === table.size ? 'text-white/80' : 'text-gray-600'}`}>Available: {table.quantity}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSelection;
