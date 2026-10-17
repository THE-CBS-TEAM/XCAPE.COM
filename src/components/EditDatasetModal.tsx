import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { ProductionDataTable } from './ProductionDataTable';
import { ReservoirPropertiesForm } from './ReservoirPropertiesForm';

interface EditDatasetModalProps {
  isOpen: boolean;
  datasetId?: number;
  datasetName?: string;
  onClose: () => void;
  onSave: (datasetId: number, data: {
    name: string;
    description?: string;
    production_data?: Record<string, any>;
  }) => Promise<void>;
}

type InputMode = 'production' | 'reservoir';

export const EditDatasetModal: React.FC<EditDatasetModalProps> = ({
  isOpen,
  datasetId,
  datasetName: defaultName,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(defaultName || '');
  const [description, setDescription] = useState('');
  const [inputMode, setInputMode] = useState<InputMode>('production');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [productionData, setProductionData] = useState<Record<string, any> | null>(null);
  const [reservoirData, setReservoirData] = useState<Record<string, any> | null>(null);

  // Load existing dataset data
  useEffect(() => {
    if (isOpen && datasetId) {
      loadDataset();
    }
  }, [isOpen, datasetId]);

  const loadDataset = async () => {
    try {
      setIsLoadingData(true);
      setError('');

      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
      const response = await fetch(`${API_BASE}/datasets/${datasetId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load dataset');
      }

      const data = await response.json();
      setName(data.name);
      setDescription(data.description || '');

      // Detect data type and set accordingly
      if (data.production_data) {
        if (data.production_data.Days && Array.isArray(data.production_data.Days)) {
          // Production data format
          setInputMode('production');
          setProductionData(data.production_data);
        } else if (data.production_data.reservoir_model) {
          // Reservoir model format
          setInputMode('reservoir');
          setReservoirData(data.production_data.reservoir_model);
        } else {
          setProductionData(data.production_data);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading dataset');
    } finally {
      setIsLoadingData(false);
    }
  };

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      setError('');

      if (!name.trim()) {
        setError('Dataset name is required');
        return;
      }

      if (!datasetId) {
        setError('Dataset ID not found');
        return;
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication token not found');
        return;
      }

      let dataToUpdate: any = {
        name: name.trim(),
        description: description.trim(),
      };

      // Only include production_data if it was modified
      if (inputMode === 'production' && productionData) {
        dataToUpdate.production_data = productionData;
      } else if (inputMode === 'reservoir' && reservoirData) {
        dataToUpdate.production_data = { reservoir_model: reservoirData };
      }

      setIsLoading(true);

      await onSave(datasetId, dataToUpdate);

      // Reset form on success
      setName('');
      setDescription('');
      setProductionData(null);
      setReservoirData(null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving dataset');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col dark:bg-[#111827] dark:border dark:border-white/10 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-[#F8FAFC]">Edit Dataset</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-100"
            disabled={isLoading || isLoadingData}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoadingData ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading dataset...</span>
            </div>
          ) : (
            <>
              {/* Dataset Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-300">
                  Dataset Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Well A Production Data"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-transparent dark:text-slate-100"
                  disabled={isLoading}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-300">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add notes about this dataset..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-transparent dark:text-slate-100"
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              {/* Data Type Selection */}
              <div className="flex gap-2">
                <button
                  onClick={() => setInputMode('production')}
                  className={`flex-1 px-4 py-2 rounded font-medium text-sm transition-colors ${
                    inputMode === 'production'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
                  }`}
                  disabled={isLoading}
                >
                  Production Data
                </button>
                <button
                  onClick={() => setInputMode('reservoir')}
                  className={`flex-1 px-4 py-2 rounded font-medium text-sm transition-colors ${
                    inputMode === 'reservoir'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
                  }`}
                  disabled={isLoading}
                >
                  Reservoir Model
                </button>
              </div>

              {/* Production Data Input */}
              {inputMode === 'production' && productionData && (
                <ProductionDataTable
                  initialData={
                    productionData.Days
                      ? productionData.Days.map((_: any, idx: number) => ({
                          Days: productionData.Days[idx],
                          Oil_bbl: productionData.Oil_bbl[idx],
                          Water_bbl: productionData.Water_bbl[idx],
                          Gas_scf: productionData.Gas_scf[idx],
                          Pressure_psi: productionData.Pressure_psi[idx],
                        }))
                      : undefined
                  }
                  onDataChange={(data) => {
                    setProductionData({
                      Days: data.map((row) => Number(row.Days) || 0),
                      Oil_bbl: data.map((row) => Number(row.Oil_bbl) || 0),
                      Water_bbl: data.map((row) => Number(row.Water_bbl) || 0),
                      Gas_scf: data.map((row) => Number(row.Gas_scf) || 0),
                      Pressure_psi: data.map((row) => Number(row.Pressure_psi) || 0),
                    });
                  }}
                />
              )}

              {/* Reservoir Model Input */}
              {inputMode === 'reservoir' && reservoirData && (
                <ReservoirPropertiesForm
                  initialData={reservoirData}
                  onDataChange={setReservoirData}
                />
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded p-3 flex items-start gap-2 dark:bg-red-900 dark:border-red-700">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium text-sm dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 transition-colors"
            disabled={isLoading || isLoadingData}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-sky-400 dark:hover:bg-sky-300 dark:text-slate-950 text-white rounded-lg font-semibold text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            disabled={isLoading || isLoadingData || !name.trim()}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
