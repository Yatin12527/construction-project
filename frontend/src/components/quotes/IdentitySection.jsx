import { ChevronDown } from "lucide-react";

export const IdentitySection = ({
  isCustomSupplier,
  isCustomMaterial,
  smartSupplierList,
  smartMaterialList,
  handleChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Supplier */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase">
          Supplier
        </label>
        {!isCustomSupplier ? (
          <div className="relative">
            <select
              name="supplierSelect"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg bg-white appearance-none"
            >
              {smartSupplierList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
              <option value="custom" className="font-bold text-emerald-600">
                + New Supplier
              </option>
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        ) : (
          <input
            name="supplierName"
            autoFocus
            placeholder="Name..."
            className="w-full px-3 py-2 border border-gray-400 bg-gray-100 rounded-lg"
            onChange={handleChange}
            required
          />
        )}
      </div>

      {/* Material */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase">
          Material
        </label>
        {!isCustomMaterial ? (
          <div className="relative">
            <select
              name="materialSelect"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg bg-white appearance-none"
            >
              {smartMaterialList.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
              <option value="custom" className="font-bold text-emerald-600">
                + New Material
              </option>
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        ) : (
          <input
            name="materialName"
            placeholder="Name..."
            className="w-full px-3 py-2 border border-gray-400 bg-gray-50/10 rounded-lg"
            onChange={handleChange}
            required
          />
        )}
      </div>
    </div>
  );
};
