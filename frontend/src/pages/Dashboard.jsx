import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import {
  Search,
  AlertTriangle,
  TrendingDown,
  Truck,
  Clock,
  CreditCard,
  Package,
  Filter,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import AddQuoteModal from "../components/AddQuoteModal";
import Navbar from "../components/Navbar";

// Helper: Make terms readable
const translateTerms = (term) => {
  if (!term) return "Unknown";
  if (term.toLowerCase().includes("net")) {
    const days = term.match(/\d+/);
    return days ? `Credit: ${days[0]} Days` : "Credit";
  }
  if (term === "Advance") return "Pay First";
  if (term === "COD") return "Pay on Delivery";
  return term;
};

const Dashboard = () => {
  const { logout } = useAuth();

  const [allQuotes, setAllQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false); // New state for specific calc loader

  // UI State
  const [selectedMaterial, setSelectedMaterial] = useState("All");
  const [qtyNeed, setQtyNeed] = useState("");
  const [debouncedQty, setDebouncedQty] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("price");

  // Debounce Input
  useEffect(() => {
    // When user types, start "Calculating" state immediately
    if (qtyNeed !== debouncedQty) setIsCalculating(true);

    const timer = setTimeout(() => {
      setDebouncedQty(Number(qtyNeed) || 0);
    }, 500);

    return () => clearTimeout(timer);
  }, [qtyNeed]);

  // Fetch Data
  const fetchQuotes = async () => {
    // Only set main loading on initial load, otherwise just calculating
    if (allQuotes.length === 0) setLoading(true);
    else setIsCalculating(true);

    try {
      const { data } = await api.get(`/api/quotes?qty=${debouncedQty}`);
      setAllQuotes(data);
      if (selectedMaterial === "All" && data.length > 0)
        setSelectedMaterial(data[0].materialName);
    } catch (error) {
      toast.error("Failed to load market data");
    } finally {
      setLoading(false);
      setIsCalculating(false); // Stop calculating animation
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [debouncedQty]);

  const categories = useMemo(
    () => [...new Set(allQuotes.map((q) => q.materialName))].sort(),
    [allQuotes],
  );
  const suppliers = useMemo(
    () => [...new Set(allQuotes.map((q) => q.supplierName))].sort(),
    [allQuotes],
  );

  // Sorting & Filtering
  const filteredQuotes = useMemo(() => {
    if (!selectedMaterial || selectedMaterial === "All") return [];

    let filtered = allQuotes.filter((q) => q.materialName === selectedMaterial);

    if (sortBy === "time") {
      filtered.sort((a, b) => a.leadTime - b.leadTime);
    } else if (sortBy === "moq") {
      filtered.sort((a, b) => a.minOrderQuantity - b.minOrderQuantity);
    } else {
      filtered.sort((a, b) => a.effectivePrice - b.effectivePrice);
    }
    return filtered;
  }, [allQuotes, selectedMaterial, sortBy]);

  const currentBaseUnit = filteredQuotes[0]?.baseUnit || "Unit";

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* HEADER */}
      <Navbar logout={logout} setIsModalOpen={setIsModalOpen} />

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {/* TABS */}
        <div className="no-scrollbar mb-8 flex items-center gap-3 overflow-x-scroll scroll-smooth px-1 pb-2 pt-2">
          {categories.map((cat) => {
            const isActive = selectedMaterial === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedMaterial(cat)}
                className={`
                  relative px-6 py-2.5 rounded-full text-sm font-bold tracking-wide whitespace-nowrap transition-all duration-200 ease-out snap-center select-none border
                  ${
                    isActive
                      ? "bg-slate-200 text-slate-800 border-transparent shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] translate-y-[1px]" // The "Carved" Look
                      : "bg-white text-slate-500 border-slate-200 shadow-sm hover:border-slate-300 hover:text-slate-600 hover:bg-slate-50" // The "Raised" Look
                  }
                `}
              >
                <div className="flex items-center gap-2">{cat}</div>
              </button>
            );
          })}
        </div>
        {/* CONTROLS */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-end gap-6">
            <div className="flex-1 w-full">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Quantity Needed{" "}
                <span className="text-slate-400 font-normal">
                  (in {currentBaseUnit})
                </span>
              </label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-600 transition-colors duration-200" />
                <input
                  type="number"
                  className="
                    w-full pl-11 pr-5 py-2.5 rounded-full text-sm font-bold outline-none transition-all duration-200
                    bg-white border border-slate-200 shadow-sm text-slate-500 placeholder-slate-400
                    focus:bg-slate-100 focus:border-transparent focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] focus:text-slate-800
                  "
                  placeholder={`e.g. 500 ${currentBaseUnit}`}
                  value={qtyNeed}
                  onChange={(e) => setQtyNeed(e.target.value)}
                />
              </div>
            </div>
            {/* filter options */}
            <div className="w-full md:w-auto">
              <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                <Filter className="h-3 w-3" /> Sort By
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy("price")}
                  className={`
                  px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all duration-200 ease-out border select-none
                  ${
                    sortBy === "price"
                      ? "bg-slate-200  border-transparent shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] translate-y-[1px]"
                      : "bg-white text-slate-500 border-slate-200 shadow-sm hover:border-slate-300  hover:bg-green-50/10"
                  }
                `}
                >
                  <TrendingDown className="h-4 w-4" /> Price
                </button>

                <button
                  onClick={() => setSortBy("time")}
                  className={`
                  px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all duration-200 ease-out border select-none
                  ${
                    sortBy === "time"
                      ? "bg-slate-200  border-transparent shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] translate-y-[1px]"
                      : "bg-white text-slate-500 border-slate-200 shadow-sm hover:border-slate-300  hover:bg-blue-50/10"
                  }
                `}
                >
                  <Clock className="h-4 w-4" /> Time
                </button>

                <button
                  onClick={() => setSortBy("moq")}
                  className={`
                  px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all duration-200 ease-out border select-none
                  ${
                    sortBy === "moq"
                      ? "bg-slate-200  border-transparent shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] translate-y-[1px]"
                      : "bg-white text-slate-500 border-slate-200 shadow-sm hover:border-slate-300  hover:bg-purple-50/10"
                  }
                `}
                >
                  <Package className="h-4 w-4" /> MOQ
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 md:overflow-hidden overflow-x-scroll">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Logistics
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Terms & MOQ
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Raw Price
                </th>

                {/* --- STATIC COLUMN (Always Visible) --- */}
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right bg-blue-50/50 w-48">
                  Total Project Cost
                </th>

                <th className="w-[235px] min-w-[235px] px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right bg-slate-100/50">
                  Effective Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    No quotes found for this category. Add one!
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((quote, index) => {
                  const isTrap = quote.penaltyNote !== null;
                  const isWinner = index === 0;
                  // RANKING LOGIC 
                  let rankBadge;
                  if (index === 0) {
                    rankBadge = (
                      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 font-extrabold shadow-sm">
                        1
                      </div>
                    );
                  } else if (index === 1) {
                    rankBadge = (
                      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-600 font-bold shadow-sm">
                        2
                      </div>
                    );
                  } else if (index === 2) {
                    rankBadge = (
                      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 border border-orange-200 text-orange-700 font-bold shadow-sm">
                        3
                      </div>
                    );
                  } else {
                    rankBadge = (
                      <span className="text-sm font-medium text-slate-400">
                        #{index + 1}
                      </span>
                    );
                  }

                  return (
                    <tr
                      key={quote._id}
                      className={`group transition-colors ${isWinner ? "bg-green-50/30" : "hover:bg-slate-50"}`}
                    >
                      <td className="px-6 py-4 text-center w-16">
                        {rankBadge}
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">
                          {quote.supplierName}
                        </div>
                        {quote.status === "pending" && (
                          <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1 rounded">
                            Pending
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <div
                            className={`flex items-center gap-1.5 text-xs font-bold ${quote.deliveryTerm === "FOR" ? "text-green-700" : "text-orange-600"}`}
                          >
                            <Truck className="h-3.5 w-3.5" />
                            {quote.deliveryTerm === "FOR"
                              ? "Free Delivery"
                              : "+ Transport"}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Clock className="h-3.5 w-3.5" />
                            {quote.leadTime === 1
                              ? "Next Day"
                              : `${quote.leadTime} Days`}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                            <CreditCard className="h-3.5 w-3.5 " />
                            {translateTerms(quote.paymentTerms)}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Package className="h-3.5 w-3.5 text-yellow-600" />
                            Min: {quote.minOrderQuantity} {quote.unit}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="text-sm font-medium text-slate-600">
                          ₹{quote.rawPrice.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-400">
                          per {quote.unit}
                        </div>
                      </td>

                      {/*  TOTAL BILL COLUMN   */}
                      <td className="px-6 py-4 text-right bg-blue-50/30 border-l border-blue-100/50">
                        {/* State 1: Calculating (Loader) */}
                        {isCalculating ? (
                          <div className="flex justify-end">
                            <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
                          </div>
                        ) : /* State 2: Has Data (Price) */
                        quote.totalBill > 0 ? (
                          <div
                            className={`font-bold ${isTrap ? "text-orange-600" : "text-emerald-600"} animate-in fade-in zoom-in duration-200`}
                          >
                            <div className="text-lg">
                              ₹
                              {quote.totalBill?.toLocaleString(undefined, {
                                maximumFractionDigits: 0,
                              })}
                            </div>
                            <div className="text-[10px] uppercase tracking-wide opacity-70">
                              {isTrap ? "Incl. Penalty" : "Total Payable"}
                            </div>
                          </div>
                        ) : (
                          /* State 3: Empty (Dash) */
                          <div className="text-slate-300 font-bold text-xl">
                            -
                          </div>
                        )}
                      </td>

                      <td
                        className={`px-6 py-4 text-right ${isWinner ? "bg-green-100/50" : "bg-slate-50/50"}`}
                      >
                        <div
                          className={`text-lg font-bold ${isTrap ? "text-red-600" : "text-slate-900"}`}
                        >
                          ₹{quote.effectivePrice?.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          per {quote.baseUnit}
                        </div>
                        {isTrap && (
                          <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-red-600 font-bold animate-pulse">
                            <AlertTriangle className="h-3 w-3" />{" "}
                            {quote.penaltyNote}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>

      <AddQuoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchQuotes}
        existingMaterials={categories}
        existingSuppliers={suppliers}
      />
    </div>
  );
};

export default Dashboard;
