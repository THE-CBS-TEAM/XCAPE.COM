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

      // Save manual dataset (production data + reservoir properties)
      if (activeTab === 'manual') {
        if (!productionData && !reservoirData) {
          setError('Please enter reservoir properties or production data before saving');
          return;
        }

        // Clean reservoir model: strip empty strings, convert valid numbers to floats
        let cleanModel: Record<string, any> | null = null;
        if (reservoirData) {
          cleanModel = {};
          const parseSection = (section: any) => {
            if (!section || typeof section !== 'object') return {};
            const clean: Record<string, any> = {};
            for (const [k, v] of Object.entries(section)) {
              if (v !== '' && v !== null && v !== undefined) {
                const n = Number(v);
                clean[k] = !isNaN(n) ? n : v;
              }
            }
            return clean;
          };

          const rp = parseSection(reservoirData.rock_properties);
          const fp = parseSection(reservoirData.fluid_properties);
          const rg = parseSection(reservoirData.reservoir_geometry);
          const rm = parseSection(reservoirData.rock_mechanics);

          if (Object.keys(rp).length > 0) cleanModel.rock_properties = rp;
          if (Object.keys(fp).length > 0) cleanModel.fluid_properties = fp;
          if (Object.keys(rg).length > 0) cleanModel.reservoir_geometry = rg;
          if (Object.keys(rm).length > 0) cleanModel.rock_mechanics = rm;

          // Top-level aliases for universal parser compatibility
          if (fp.initial_pressure != null) cleanModel.initial_pressure = fp.initial_pressure;
          if (rp.porosity != null) cleanModel.porosity = rp.porosity;
          if (rp.permeability != null) cleanModel.permeability = rp.permeability;
          if (fp.water_saturation != null) cleanModel.water_saturation = fp.water_saturation;
          if (rg.thickness != null) cleanModel.thickness = rg.thickness;
          if (rg.area != null) cleanModel.area = rg.area;
          if (fp.formation_volume_factor != null) cleanModel.formation_volume_factor = fp.formation_volume_factor;
          if (rp.depth != null) cleanModel.depth = rp.depth;
          if (rp.temperature != null) cleanModel.temperature = rp.temperature;
        }

        // If production data wasn't entered manually, provide standard 12-month production baseline
        const defaultPressure = cleanModel?.initial_pressure ? Number(cleanModel.initial_pressure) : 3000;
        const prod = productionData || {
          Days: [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 365],
          Oil_bbl: [2500, 2420, 2350, 2280, 2210, 2150, 2090, 2030, 1980, 1930, 1880, 1840],
          Water_bbl: [120, 150, 190, 240, 300, 370, 450, 540, 640, 750, 870, 1000],
          Gas_scf: [1500000, 1450000, 1410000, 1370000, 1320000, 1290000, 1250000, 1220000, 1190000, 1160000, 1130000, 1100000],
          Pressure_psi: [defaultPressure, defaultPressure - 50, defaultPressure - 100, defaultPressure - 150, defaultPressure - 200, defaultPressure - 250, defaultPressure - 290, defaultPressure - 330, defaultPressure - 370, defaultPressure - 410, defaultPressure - 450, defaultPressure - 480],
        };
        // Merge production arrays with reservoir_model key
        dataToSave = {
          ...prod,
          ...(cleanModel && { reservoir_model: cleanModel }),
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col dark:bg-[#111827] dark:border dark:border-white/10 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-[#F8FAFC]">Add Dataset</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-100"
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
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium text-sm dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-sky-400 dark:hover:bg-sky-300 dark:text-slate-950 text-white rounded-lg font-semibold text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            disabled={
              isLoading ||
              !name.trim() ||
              activeTab === 'file' ||
              (activeTab === 'manual' && !(productionData || reservoirData))
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
