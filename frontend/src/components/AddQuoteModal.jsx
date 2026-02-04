import { X, Loader2 } from "lucide-react";
import { useQuoteForm } from "../hooks/useQuoteForm";
import { PaymentTermsSection } from "./quotes/PaymentTermsSection";
import { IdentitySection } from "./quotes/IdentitySection";
import { PhysicsAndPriceSection } from "./quotes/PhysicsAndPriceSection";

const AddQuoteModal = ({
  isOpen,
  onClose,
  onSuccess,
  existingMaterials = [],
  existingSuppliers = [],
}) => {
  const {
    formData,
    setFormData,
    loading,
    measureType,
    setMeasureType,
    paymentMode,
    setPaymentMode,
    creditDays,
    setCreditDays,
    isCustomMaterial,
    isCustomSupplier,
    isCustomUnit,
    smartMaterialList,
    smartSupplierList,
    handleChange,
    handleSubmit,
  } = useQuoteForm(existingMaterials, existingSuppliers, onSuccess, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl border border-slate-200 my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center rounded-t-xl">
          <h2 className="text-lg font-bold text-slate-800">
            Add New Market Quote
          </h2>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-slate-500 hover:text-red-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <IdentitySection
            isCustomSupplier={isCustomSupplier}
            isCustomMaterial={isCustomMaterial}
            smartSupplierList={smartSupplierList}
            smartMaterialList={smartMaterialList}
            handleChange={handleChange}
          />

          <PhysicsAndPriceSection
            measureType={measureType}
            setMeasureType={setMeasureType}
            formData={formData}
            isCustomUnit={isCustomUnit}
            handleChange={handleChange}
          />

          {/* Commercials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Transport & GST */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Transport
                </label>
                <div className="flex gap-2">
                  <select
                    name="deliveryTerm"
                    className="w-full px-2 py-2 border rounded-lg bg-white text-sm"
                    onChange={handleChange}
                  >
                    <option value="FOR">FOR (Free Delivery)</option>
                    <option value="EX_WORKS">Ex-Works (Extra)</option>
                  </select>
                  {formData.deliveryTerm === "EX_WORKS" && (
                    <input
                      type="number"
                      name="transportCost"
                      placeholder="₹ Cost"
                      className="w-24 px-2 py-2 border border-red-200 bg-red-50 rounded-lg text-sm"
                      onChange={handleChange}
                    />
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  GST Handling
                </label>
                <div className="flex gap-2">
                  {!formData.gstIncluded && (
                    <select
                      name="gstRate"
                      className="w-20 px-2 py-2 border rounded-lg bg-white font-bold"
                      onChange={handleChange}
                      defaultValue={18}
                    >
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                      <option value="28">28%</option>
                    </select>
                  )}
                  <div className="flex-1 bg-slate-100 p-1 rounded-lg flex text-xs font-bold">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, gstIncluded: false }))
                      }
                      className={`flex-1 rounded py-1 transition-all ${
                        !formData.gstIncluded
                          ? "bg-white text-slate-800 shadow"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      + Tax (Extra)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, gstIncluded: true }))
                      }
                      className={`flex-1 rounded py-1 transition-all ${
                        formData.gstIncluded
                          ? "bg-green-100 text-green-800 shadow"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      Incl. Tax
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <PaymentTermsSection
              paymentMode={paymentMode}
              setPaymentMode={setPaymentMode}
              creditDays={creditDays}
              setCreditDays={setCreditDays}
            />
          </div>

          {/* MOQ */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">
              Minimum Order Qty (MOQ)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                name="minOrderQuantity"
                className="w-full px-3 py-2 border rounded-lg"
                defaultValue={1}
                onChange={handleChange}
              />
              <span className="text-sm font-bold text-slate-400 whitespace-nowrap">
                {formData.unit || "Unit"}s
              </span>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 border-t border-slate-100 mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white font-bold rounded-xl shadow-lg transition-all ${
                loading
                  ? "bg-slate-400 cursor-not-allowed opacity-70"
                  : "bg-slate-900 hover:bg-slate-800 active:scale-95"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Adding Quote..." : "Add Market Quote"}
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuoteModal;
