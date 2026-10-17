import React, { useState } from 'react';
import { X, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { ProductionDataTable } from './ProductionDataTable';
import { ReservoirPropertiesForm } from './ReservoirPropertiesForm';

interface DataInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    description?: string;
    production_data: Record<string, any>;
  }) => Promise<void>;
  datasetName?: string;
}

type InputMode = 'file' | 'production' | 'reservoir';
type TabType = 'file' | 'manual';

export const DataInputModal: React.FC<DataInputModalProps> = ({
  isOpen,
  onClose,
  onSave,
  datasetName: defaultName,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('file');
  const [, setInputMode] = useState<InputMode>('production');
  const [step, setStep] = useState<'production' | 'reservoir' | 'review'>('production');
  const [name, setName] = useState(defaultName || '');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [productionData, setProductionData] = useState<Record<string, any> | null>(null);
  const [reservoirData, setReservoirData] = useState<Record<string, any> | null>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      setError('');

      if (!name.trim()) {
        setError('Dataset name is required');
        return;
      }

      let dataToSave: Record<string, any> = {};

      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }

      if (activeTab === 'file') {
        setError('Please use file upload for file-based datasets');
        return;
      }

      // Require both production and reservoir data for manual combined save
      if (activeTab === 'manual') {
        if (!productionData) {
          setError('Please enter production data before saving');
          return;
        }
        if (!reservoirData) {
          setError('Please enter or upload a reservoir model before saving');
          return;
        }
        // Merge production arrays with reservoir_model key
        dataToSave = {
          ...productionData,
          reservoir_model: reservoirData,
        };
      } else {
        setError('Please use file upload for file-based datasets');
        return;
      }

      setIsLoading(true);

      await onSave({
        name: name.trim(),
        description: description.trim(),
        production_data: dataToSave,
      });

      // Reset form on success
      setName('');
      setDescription('');
      setProductionData(null);
      setReservoirData(null);
      setInputMode('production');
      setActiveTab('file');
      setStep('production');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving dataset');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] flex flex-col dark:bg-slate-800 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Add Dataset</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-slate-300 dark:hover:text-slate-100"
            disabled={isLoading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
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

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('file')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'file'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-100'
              }`}
              disabled={isLoading}
            >
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload File
              </div>
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'manual'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-100'
              }`}
              disabled={isLoading}
            >
              Manual Entry
            </button>
          </div>

          {/* File Upload Tab */}
          {activeTab === 'file' && (
            <div className="bg-blue-50 border border-blue-200 rounded p-4 dark:bg-slate-800 dark:border-slate-700">
              <p className="text-sm text-blue-700 dark:text-blue-200">
                Use the file upload feature in the Data Drawer to upload CSV or JSON files.
              </p>
            </div>
          )}

          {/* Manual Entry Tab (two-step wizard) */}
          {activeTab === 'manual' && (
            <div className="space-y-4">
              {step === 'production' && (
                <div>
                  <p className="text-sm text-gray-700 dark:text-slate-300 mb-2">Step 1 — Enter production data</p>
                  <ProductionDataTable
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
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => setStep('reservoir')}
                      className={`px-4 py-2 bg-blue-600 text-white rounded font-medium text-sm disabled:opacity-50`}
                      disabled={!productionData}
                    >
                      Next: Reservoir Model
                    </button>
                  </div>
                </div>
              )}

              {step === 'reservoir' && (
                <div>
                  <p className="text-sm text-gray-700 dark:text-slate-300 mb-2">Step 2 — Upload or paste reservoir model JSON</p>
                  <ReservoirPropertiesForm onDataChange={setReservoirData} />
                  <div className="flex justify-between mt-3">
                    <button
                      onClick={() => setStep('production')}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded font-medium text-sm"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep('review')}
                      className={`px-4 py-2 bg-blue-600 text-white rounded font-medium text-sm disabled:opacity-50`}
                      disabled={!reservoirData}
                    >
                      Review & Save
                    </button>
                  </div>
                </div>
              )}

              {step === 'review' && (
                <div>
                  <p className="text-sm text-gray-700 dark:text-slate-300 mb-2">Review your inputs</p>
                  <div className="mb-3">
                    <strong>Production points:</strong> {productionData ? Object.values(productionData)[0]?.length || 0 : 0}
                  </div>
                  <div className="mb-3">
                    <strong>Reservoir model:</strong> {reservoirData ? 'Present' : 'Missing'}
                  </div>
                  <div className="flex justify-between mt-3">
                    <button
                      onClick={() => setStep('reservoir')}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded font-medium text-sm"
                    >
                      Back
                    </button>
                    <div />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 flex items-start gap-2 dark:bg-red-900 dark:border-red-700">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 font-medium text-sm dark:bg-transparent dark:text-slate-200 dark:hover:bg-slate-700"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              isLoading ||
              !name.trim() ||
              activeTab === 'file' ||
              (activeTab === 'manual' && !(productionData && reservoirData))
            }
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Dataset
          </button>
        </div>
      </div>
    </div>
  );
};
