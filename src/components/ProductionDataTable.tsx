import React, { useState } from 'react';
import { Plus, Trash2, AlertCircle, Check } from 'lucide-react';

interface ProductionDataRow {
  Days: number | string;
  Oil_bbl: number | string;
  Water_bbl: number | string;
  Gas_scf: number | string;
  Pressure_psi: number | string;
}

interface ProductionDataTableProps {
  initialData?: ProductionDataRow[];
  onDataChange: (data: ProductionDataRow[]) => void;
}

const REQUIRED_COLUMNS = ['Days', 'Oil_bbl', 'Water_bbl', 'Gas_scf', 'Pressure_psi'];
const COLUMN_LABELS: Record<string, string> = {
  Days: 'Days',
  Oil_bbl: 'Oil (bbl)',
  Water_bbl: 'Water (bbl)',
  Gas_scf: 'Gas (scf)',
  Pressure_psi: 'Pressure (psi)',
};

export const ProductionDataTable: React.FC<ProductionDataTableProps> = ({
  initialData,
  onDataChange,
}) => {
  const [rows, setRows] = useState<ProductionDataRow[]>(
    initialData && initialData.length > 0
      ? initialData
      : [
          {
            Days: '',
            Oil_bbl: '',
            Water_bbl: '',
            Gas_scf: '',
            Pressure_psi: '',
          },
        ]
  );

  const [errors, setErrors] = useState<Record<number, Record<string, string>>>({});
  const [pasteError, setPasteError] = useState<string>('');

  const handleCellChange = (rowIndex: number, column: string, value: string) => {
    const newRows = [...rows];
    newRows[rowIndex] = {
      ...newRows[rowIndex],
      [column]: value,
    };
    setRows(newRows);

    // Clear error when user starts editing
    if (errors[rowIndex]?.[column]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (newErrors[rowIndex]) {
          delete newErrors[rowIndex][column];
          if (Object.keys(newErrors[rowIndex]).length === 0) {
            delete newErrors[rowIndex];
          }
        }
        return newErrors;
      });
    }

    onDataChange(newRows);
  };

  const addRow = () => {
    const newRow: ProductionDataRow = {
      Days: '',
      Oil_bbl: '',
      Water_bbl: '',
      Gas_scf: '',
      Pressure_psi: '',
    };
    setRows([...rows, newRow]);
  };

  const removeRow = (index: number) => {
    if (rows.length === 1) return; // Don't allow removing last row
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
    // Clean up errors for removed row
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
    onDataChange(newRows);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setPasteError('');

    const pastedText = e.clipboardData?.getData('text');
    if (!pastedText) return;

    try {
      // Parse CSV - support both comma and tab delimiters
      const lines = pastedText.trim().split('\n');
      const parsedRows: ProductionDataRow[] = [];

      // Check if first line is a header
      const firstLine = lines[0].split(/[,\t]/);
      let startIndex = 0;

      // Simple header detection - if first row contains non-numeric values
      const isHeader =
        firstLine.some(
          (cell) =>
            isNaN(Number(cell.trim())) &&
            REQUIRED_COLUMNS.some((col) =>
              cell.toLowerCase().includes(col.toLowerCase())
            )
        ) || firstLine.some((cell) => isNaN(Number(cell.trim())));

      if (isHeader) {
        // Try to map headers to columns
        const headerMap: Record<string, string> = {};
        firstLine.forEach((header, idx) => {
          const normalizedHeader = header.toLowerCase().trim();
          const matchedColumn = REQUIRED_COLUMNS.find(
            (col) =>
              normalizedHeader.includes(col.toLowerCase()) ||
              col.toLowerCase().includes(normalizedHeader)
          );
          if (matchedColumn) {
            headerMap[idx] = matchedColumn;
          }
        });

        if (Object.keys(headerMap).length === 0) {
          // No headers matched - treat as data
          startIndex = 0;
        } else {
          startIndex = 1;

          // Parse data rows using header map
          for (let i = startIndex; i < lines.length; i++) {
            const cells = lines[i].split(/[,\t]/);
            const row: ProductionDataRow = {
              Days: '',
              Oil_bbl: '',
              Water_bbl: '',
              Gas_scf: '',
              Pressure_psi: '',
            };

            Object.entries(headerMap).forEach(([cellIdx, columnName]) => {
              const cellValue = cells[parseInt(cellIdx)]?.trim() || '';
              row[columnName as keyof ProductionDataRow] = cellValue;
            });

            parsedRows.push(row);
          }

          if (parsedRows.length > 0) {
            setRows(parsedRows);
            onDataChange(parsedRows);
            return;
          }
        }
      }

      // No header detected or header parsing failed - assume column order
      for (let i = startIndex; i < lines.length; i++) {
        const cells = lines[i].split(/[,\t]/);
        if (cells.length >= REQUIRED_COLUMNS.length) {
          const row: ProductionDataRow = {
            Days: cells[0]?.trim() || '',
            Oil_bbl: cells[1]?.trim() || '',
            Water_bbl: cells[2]?.trim() || '',
            Gas_scf: cells[3]?.trim() || '',
            Pressure_psi: cells[4]?.trim() || '',
          };
          parsedRows.push(row);
        }
      }

      if (parsedRows.length === 0) {
        setPasteError('No valid data found in pasted content');
        return;
      }

      setRows(parsedRows);
      setErrors({}); // Clear errors on paste
      onDataChange(parsedRows);
    } catch (error) {
      setPasteError(`Error parsing pasted data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const isValid = rows.length > 0 && Object.keys(errors).length === 0 && rows.every(row =>
    REQUIRED_COLUMNS.every(col => {
      const value = row[col as keyof ProductionDataRow];
      return value !== '' && value !== null && !isNaN(Number(value));
    })
  );

  return (
    <div className="w-full space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded p-3 flex items-start gap-2 dark:bg-slate-800 dark:border-slate-700">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700 dark:text-blue-200">
          Paste production data from CSV (comma or tab-separated). Expected columns: Days, Oil_bbl,
          Water_bbl, Gas_scf, Pressure_psi
        </p>
      </div>

      {pasteError && (
        <div className="bg-red-50 border border-red-200 rounded p-3 flex items-start gap-2 dark:bg-red-900 dark:border-red-700">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-300">{pasteError}</p>
        </div>
      )}

      <div className="overflow-x-auto border border-gray-200 rounded dark:border-slate-700">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              {REQUIRED_COLUMNS.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700 text-center dark:text-slate-100"
                >
                  {COLUMN_LABELS[col]}
                </th>
              ))}
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-12">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`border-b border-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 ${
                  errors[rowIndex] ? 'bg-red-50 dark:bg-red-900' : ''
                }`}
              >
                {REQUIRED_COLUMNS.map((col) => (
                  <td key={`${rowIndex}-${col}`} className="px-4 py-3">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={row[col as keyof ProductionDataRow]}
                      onChange={(e) => handleCellChange(rowIndex, col, e.target.value)}
                      onPaste={handlePaste}
                      placeholder="0"
                      className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 ${
                        errors[rowIndex]?.[col]
                          ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900 dark:text-red-300'
                          : 'border-gray-300 focus:ring-blue-500 dark:border-slate-600 dark:bg-transparent dark:text-slate-100'
                      }`}
                      title={
                        errors[rowIndex]?.[col]
                          ? `${COLUMN_LABELS[col]}: ${errors[rowIndex][col]}`
                          : ''
                      }
                    />
                    {errors[rowIndex]?.[col] && (
                      <p className="text-xs text-red-600 mt-1">{errors[rowIndex][col]}</p>
                    )}
                  </td>
                ))}
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => removeRow(rowIndex)}
                    disabled={rows.length === 1}
                    className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-red-100 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={rows.length === 1 ? 'Cannot remove last row' : 'Remove row'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3">
        <button
          onClick={addRow}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Row
        </button>

        <div className="flex-1" />

        {isValid && (
          <div className="inline-flex items-center gap-2 text-green-700 bg-green-50 px-3 py-2 rounded border border-green-200">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">Data valid: {rows.length} rows</span>
          </div>
        )}
      </div>
    </div>
  );
};
