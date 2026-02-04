import { IndianRupee } from "lucide-react";
import { UNIT_TYPES } from "../../constants/quoteConstants";

export const PhysicsAndPriceSection = ({
  measureType,
  setMeasureType,
  formData,
  isCustomUnit,
  handleChange,
}) => {
  return (
    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
      {/* Type Selector */}
      <div className="flex gap-2 mb-3">
        {Object.keys(UNIT_TYPES).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setMeasureType(type)}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              measureType === type
                ? "bg-slate-800 text-white shadow"
                : "bg-white border text-slate-500 hover:bg-slate-100"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Unit & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Sales Unit</label>
          {!isCustomUnit ? (
            <select
              name="unitSelect"
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg bg-white"
            >
              {UNIT_TYPES[measureType].options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
              <option value="custom" className="font-bold text-emerald-600">
                + Custom Unit
              </option>
            </select>
          ) : (
            <input
              name="unit"
              placeholder="e.g. Truckload"
              className="w-full px-3 py-2 border border-yellow-400 bg-yellow-50 rounded-lg"
              value={formData.unit}
              onChange={handleChange}
              required
            />
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Raw Price (₹)</label>
          <div className="relative">
            <IndianRupee className="absolute left-2 top-3 h-4 w-4 text-slate-400" />
            <input
              type="number"
              name="rawPrice"
              required
              className="w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-400 outline-none"
              placeholder="0.00"
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Custom Unit Logic */}
      {isCustomUnit && (
        <div className="mt-3 flex items-center justify-end gap-2 text-sm text-slate-600">
          <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-lg border border-yellow-200 animate-pulse">
            <span className="font-bold text-yellow-800">Logic:</span>
            <span>1 {formData.unit || "Unit"} =</span>
            <input
              type="number"
              name="conversionFactor"
              className="w-20 px-1 py-0.5 border border-yellow-400 rounded text-center font-bold"
              placeholder="?"
              onChange={handleChange}
              required
            />
            <span className="font-bold">{formData.baseUnit}</span>
          </div>
        </div>
      )}
    </div>
  );
};