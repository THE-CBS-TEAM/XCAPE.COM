import React, { useState, useEffect } from 'react';
import { AlertCircle, Check, Info } from 'lucide-react';

interface ReservoirProperties {
  rock_properties?: {
    porosity?: number | string;
    permeability?: number | string;
    depth?: number | string;
    temperature?: number | string;
  };
  fluid_properties?: {
    initial_pressure?: number | string;
    water_saturation?: number | string;
    oil_density?: number | string;
    gas_density?: number | string;
    oil_viscosity?: number | string;
    oil_initial_sat?: number | string;
    formation_volume_factor?: number | string;
  };
  rock_mechanics?: {
    rock_compressibility?: number | string;
    relative_perm_endpoint?: number | string;
    capillary_pressure_entry?: number | string;
  };
  reservoir_geometry?: {
    thickness?: number | string;
    area?: number | string;
    well_productivity_index?: number | string;
  };
}

interface ReservoirPropertiesFormProps {
  initialData?: ReservoirProperties;
  onDataChange: (data: ReservoirProperties) => void;
}

/**
 * Compute Formation Volume Factor (Bo) using Standing's correlation.
 * Bo = 0.972 + 0.000147 * F^1.175
 * where F = Rs * (γg / γo)^0.5 + 1.25 * T
 * Rs = GOR (scf/STB), γg = gas SG, γo = oil SG, T = temperature (°F)
 *
 * Simplified: if we don't have GOR/gravities, we estimate from API and pressure.
 */
function computeBoFromStanding(
  temperature: number | null,
  pressure: number | null,
  oilDensity: number | null
): number | null {
  if (!temperature || !pressure) return null;

  // Estimate API gravity from oil density (lb/bbl → API approximation)
  // If oil density is in lb/ft³, typical range 45-55
  const apiGravity = oilDensity && oilDensity > 0
    ? 141.5 / (oilDensity / 5.615 / 62.4 + 0.0001) - 131.5
    : 30; // default moderate API

  // Clamp API to reasonable range
  const api = Math.max(10, Math.min(60, apiGravity));

  // Estimate oil specific gravity from API
  const gammaO = 141.5 / (api + 131.5);

  // Estimate gas specific gravity (typical)
  const gammaG = 0.75;

  // Estimate solution GOR from Standing's correlation
  // Rs = γg * ((P/18.2 + 1.4) * 10^(0.0125*API - 0.00091*T))^1.2048
  const rsExponent = 0.0125 * api - 0.00091 * temperature;
  const rs = gammaG * Math.pow((pressure / 18.2 + 1.4) * Math.pow(10, rsExponent), 1.2048);

  // Bo = 0.972 + 0.000147 * F^1.175
  const F = rs * Math.sqrt(gammaG / gammaO) + 1.25 * temperature;
  const bo = 0.972 + 0.000147 * Math.pow(Math.max(0, F), 1.175);

  return Math.round(bo * 1000) / 1000; // 3 decimal places
}

export const ReservoirPropertiesForm: React.FC<ReservoirPropertiesFormProps> = ({
  initialData,
  onDataChange,
}) => {
  const [data, setData] = useState<ReservoirProperties>(
    initialData || {
      rock_properties: {
        porosity: '',
        permeability: '',
        depth: '',
        temperature: '',
      },
      fluid_properties: {
        initial_pressure: '',
        water_saturation: '',
        oil_density: '',
        gas_density: '',
        oil_viscosity: '',
        oil_initial_sat: '',
        formation_volume_factor: '',
      },
      rock_mechanics: {
        rock_compressibility: '',
        relative_perm_endpoint: '',
        capillary_pressure_entry: '',
      },
      reservoir_geometry: {
        thickness: '',
        area: '',
        well_productivity_index: '',
      },
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [boAutoComputed, setBoAutoComputed] = useState(false);

  // Auto-compute Bo when relevant fields change
  useEffect(() => {
    const temp = Number(data.rock_properties?.temperature) || null;
    const pressure = Number(data.fluid_properties?.initial_pressure) || null;
    const oilDensity = Number(data.fluid_properties?.oil_density) || null;

    if (temp && pressure) {
      const bo = computeBoFromStanding(temp, pressure, oilDensity);
      if (bo !== null) {
        setData((prev) => {
          const newData = { ...prev };
          if (!newData.fluid_properties) newData.fluid_properties = {};
          newData.fluid_properties.formation_volume_factor = bo.toString();
          return newData;
        });
        setBoAutoComputed(true);
      }
    } else {
      setBoAutoComputed(false);
    }
  }, [
    data.rock_properties?.temperature,
    data.fluid_properties?.initial_pressure,
    data.fluid_properties?.oil_density,
  ]);

  const validateField = (path: string, value: string | number): boolean => {
    if (value === '' || value === null) {
      return false; // Allow empty for optional fields
    }

    if (isNaN(Number(value))) {
      return false;
    }

    // Validate ranges for known fields
    const numValue = Number(value);
    const fieldName = path.split('.').pop() || '';

    if (
      ['porosity', 'water_saturation', 'oil_initial_sat', 'relative_perm_endpoint'].includes(fieldName) &&
      (numValue < 0 || numValue > 100)
    ) {
      return false;
    }

    if (['permeability', 'depth', 'thickness', 'area'].includes(fieldName) && numValue < 0) {
      return false;
    }

    if (fieldName === 'rock_compressibility' && numValue < 0) {
      return false;
    }

    return true;
  };

  const handleChange = (path: string, value: string) => {
    const parts = path.split('.');
    let updatedData: ReservoirProperties | null = null;
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      let current: any = newData;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      updatedData = newData;
      return newData;
    });

    // Clear error if valid
    if (validateField(path, value)) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[path];
        return newErrors;
      });
    } else if (value !== '') {
      setErrors((prev) => ({
        ...prev,
        [path]: 'Invalid value',
      }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[path];
        return newErrors;
      });
    }

    if (updatedData) {
      onDataChange(updatedData);
    }
  };

  const getFieldValue = (path: string): string => {
    const parts = path.split('.');
    let current: any = data;
    for (const part of parts) {
      current = current?.[part];
    }
    return current?.toString() || '';
  };

  const hasAtLeastOneField = (): boolean => {
    const requiredFields = [
      'rock_properties.porosity',
      'rock_properties.permeability',
      'fluid_properties.initial_pressure',
      'fluid_properties.water_saturation',
    ];

    return requiredFields.some((field) => {
      const value = getFieldValue(field);
      return value !== '';
    });
  };

  const isValid = hasAtLeastOneField() && Object.keys(errors).length === 0;

  // Helper to render a field
  const renderField = (
    path: string,
    label: string,
    placeholder: string,
    disabled = false,
    helperText?: string
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-300">
        {label}
      </label>
      <input
        type="text"
        inputMode="decimal"
        value={getFieldValue(path)}
        onChange={(e) => handleChange(path, e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 ${
          disabled
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-slate-700 dark:text-slate-400 border-gray-200 dark:border-slate-600'
            : errors[path]
            ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900 dark:text-red-300'
            : 'border-gray-300 focus:ring-blue-500 dark:border-slate-600 dark:bg-transparent dark:text-slate-100'
        }`}
      />
      {errors[path] && (
        <p className="text-xs text-red-600 mt-1">{errors[path]}</p>
      )}
      {helperText && (
        <p className="text-xs text-gray-500 mt-1 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  );

  return (
    <div className="w-full space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded p-3 flex items-start gap-2 dark:bg-slate-800 dark:border-slate-700">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700 dark:text-blue-200">
          Enter reservoir model properties. At least one core field (porosity, permeability,
          pressure, or water saturation) must be filled. All units are oilfield standard.
        </p>
      </div>

      {/* Rock Properties Section */}
      <div className="border border-gray-200 rounded p-4 space-y-4 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="font-semibold text-gray-900 text-sm dark:text-slate-100">Rock Properties</h3>

        <div className="grid grid-cols-2 gap-4">
          {renderField('rock_properties.porosity', 'Porosity (%)', '0-100')}
          {renderField('rock_properties.permeability', 'Permeability (mD)', 'e.g., 100')}
          {renderField('rock_properties.depth', 'Depth (ft)', 'e.g., 10000')}
          {renderField('rock_properties.temperature', 'Temperature (°F)', 'e.g., 200')}
        </div>
      </div>

      {/* Fluid Properties Section */}
      <div className="border border-gray-200 rounded p-4 space-y-4 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="font-semibold text-gray-900 text-sm dark:text-slate-100">Fluid Properties</h3>

        <div className="grid grid-cols-2 gap-4">
          {renderField('fluid_properties.initial_pressure', 'Initial Pressure (psi)', 'e.g., 3000')}
          {renderField('fluid_properties.water_saturation', 'Water Saturation (%)', '0-100')}
          {renderField('fluid_properties.oil_density', 'Oil Density (lb/ft³)', 'e.g., 50')}
          {renderField('fluid_properties.gas_density', 'Gas Density (lb/ft³)', 'e.g., 0.065')}
          {renderField('fluid_properties.oil_viscosity', 'Oil Viscosity (cp)', 'e.g., 2.5')}
          {renderField('fluid_properties.oil_initial_sat', 'Initial Oil Saturation (fraction)', '0-1, e.g., 0.7')}

          {/* Formation Volume Factor — auto-computed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-300">
              Formation Volume Factor, Bo (RB/STB)
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={getFieldValue('fluid_properties.formation_volume_factor')}
              onChange={(e) => handleChange('fluid_properties.formation_volume_factor', e.target.value)}
              placeholder="Auto-computed"
              className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 ${
                boAutoComputed
                  ? 'bg-green-50 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300'
                  : 'border-gray-300 focus:ring-blue-500 dark:border-slate-600 dark:bg-transparent dark:text-slate-100'
              }`}
            />
            {boAutoComputed && (
              <div className="flex items-center gap-1 mt-1">
                <Info className="w-3 h-3 text-green-600 dark:text-green-400" />
                <p className="text-xs text-green-700 dark:text-green-400">
                  Auto-computed from Standing&apos;s correlation using temperature &amp; pressure
                </p>
              </div>
            )}
            {!boAutoComputed && (
              <p className="text-xs text-gray-500 mt-1 dark:text-slate-400">
                Enter temperature &amp; pressure above to auto-compute, or enter manually
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Rock Mechanics Section */}
      <div className="border border-gray-200 rounded p-4 space-y-4 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="font-semibold text-gray-900 text-sm dark:text-slate-100">Rock Mechanics</h3>

        <div className="grid grid-cols-2 gap-4">
          {renderField(
            'rock_mechanics.rock_compressibility',
            'Rock Compressibility (1/psi)',
            'e.g., 3e-6',
            false,
            'Typical range: 1×10⁻⁶ to 25×10⁻⁶ 1/psi'
          )}
          {renderField(
            'rock_mechanics.relative_perm_endpoint',
            'Relative Perm Endpoint (fraction)',
            '0-1, e.g., 0.85',
            false,
            'Oil relative permeability at connate water saturation'
          )}
          {renderField(
            'rock_mechanics.capillary_pressure_entry',
            'Capillary Entry Pressure (psi)',
            'e.g., 20',
            false,
            'Threshold pressure for non-wetting phase entry'
          )}
        </div>
      </div>

      {/* Reservoir Geometry Section */}
      <div className="border border-gray-200 rounded p-4 space-y-4 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="font-semibold text-gray-900 text-sm dark:text-slate-100">Reservoir Geometry</h3>

        <div className="grid grid-cols-2 gap-4">
          {renderField(
            'reservoir_geometry.thickness',
            'Net Pay Thickness (ft)',
            'e.g., 150',
            false,
            'Net productive reservoir thickness'
          )}
          {renderField(
            'reservoir_geometry.area',
            'Drainage Area (acres)',
            'e.g., 640',
            false,
            'Productive area of the reservoir'
          )}
          {renderField(
            'reservoir_geometry.well_productivity_index',
            'Well Productivity Index (bbl/day/psi)',
            'e.g., 1.0',
            false,
            'Flow capacity of the wellbore completion'
          )}
        </div>
      </div>

      {/* Validation Status */}
      <div className="flex items-center gap-2">
        {isValid ? (
          <div className="inline-flex items-center gap-2 text-green-700 bg-green-50 px-3 py-2 rounded border border-green-200 dark:bg-slate-800 dark:border-slate-700 dark:text-green-300">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">Data valid</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded border border-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Fill at least one core field</span>
          </div>
        )}
      </div>
    </div>
  );
};
