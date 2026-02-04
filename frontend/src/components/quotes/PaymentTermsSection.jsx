import { CreditCard, Calendar } from "lucide-react";

export const PaymentTermsSection = ({
  paymentMode,
  setPaymentMode,
  creditDays,
  setCreditDays,
}) => {
  return (
    <div className="space-y-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
      <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
        <CreditCard className="h-3 w-3" /> Payment Terms
      </label>

      <div className="grid grid-cols-3 gap-2 mb-2">
        {["Advance", "COD", "Credit"].map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setPaymentMode(mode)}
            className={`py-2 text-xs font-bold rounded-md border transition-all ${
              paymentMode === mode
                ? "bg-black text-white border-black shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:border-black"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {paymentMode === "Credit" && (
        <div className="flex items-center justify-center gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <Calendar className="h-4 w-4" />
          <span className="text-sm text-slate-600">Days:</span>
          <input
            type="number"
            value={creditDays}
            onChange={(e) => setCreditDays(Number(e.target.value) || 30)}
            min={1}
            className="w-20 px-2 py-1 border border-black rounded font-bold text-center focus:ring-2 focus:ring-gray-200 outline-none"
          />
          <span className="text-xs text-slate-400">(Net {creditDays})</span>
        </div>
      )}
    </div>
  );
};