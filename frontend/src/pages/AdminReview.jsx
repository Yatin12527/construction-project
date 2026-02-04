import { useState, useEffect } from "react";
import api from "../utils/api";
import { Check, X, Scale, User, ChevronLeft, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const AdminReview = () => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Pending Items
  const fetchPending = async () => {
    try {
      const { data } = await api.get("/api/quotes/pending");
      setPending(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load pending items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  // 2. Handle Logic (Approve/Reject)
  const handleDecision = async (id, status) => {
    try {
      await api.patch(`/api/quotes/${id}/status`, { status });
      toast.success(status === "approved" ? "Approved & Live" : "Rejected");
      fetchPending();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 text-zinc-500 font-medium animate-pulse">
        Loading Governance Panel...
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-50 font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 border-b border-zinc-200 pb-6">
          <div className="flex gap-6 items-center">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg transition-all group border border-zinc-200"
            >
              <ChevronLeft />
              <span className="text-sm font-bold">Back</span>
            </Link>
            <div className="h-8 w-px bg-zinc-200"></div>
            <div>
              <h1 className="text-xl font-bold text-black tracking-tight">
                Master Data Governance
              </h1>
              <p className="text-zinc-500  text-sm font-small">
                Review and standardize incoming market data.
              </p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-4xl font-bold text-zinc-900">
              {pending.length}
            </div>
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mt-1">
              Pending
            </div>
          </div>
        </div>

        {/* Empty State */}
        {pending.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-zinc-300">
            <div className="bg-zinc-100 p-4 rounded-full mb-4">
              <Check className="h-8 w-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-bold text-zinc-800">
              All Systems Operational
            </h3>
            <p className="text-zinc-500 text-sm mt-1">
              No pending quotes require review.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-zinc-50 border-b border-zinc-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Submitter
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Market Data
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Unit Logic
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider text-right">
                    Costing
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {pending.map((q) => (
                  <tr
                    key={q._id}
                    className="group hover:bg-zinc-50 transition-colors duration-150"
                  >
                    {/* 1. Submitter */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200 text-zinc-500">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-zinc-900">
                            {q.submittedBy?.name || "Unknown"}
                          </div>
                          <div className="text-xs text-zinc-400 font-medium mt-0.5">
                            {new Date(q.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 2. Market Data */}
                    <td className="px-6 py-4 align-top">
                      <div className="text-sm font-bold text-zinc-900">
                        {q.materialName}
                      </div>
                      <div className="text-xs font-medium text-zinc-500 mt-1 flex items-center gap-1">
                        <span className="bg-zinc-100 px-2 py-0.5 rounded text-zinc-600 border border-zinc-200">
                          {q.supplierName}
                        </span>
                      </div>
                      {/* Flags */}
                      <div className="flex gap-2 mt-2">
                        {q.isCustomMaterial && (
                          <span className="text-[10px] font-bold text-zinc-400 uppercase border border-zinc-200 px-1.5 rounded">
                            New Item
                          </span>
                        )}
                        {q.isCustomSupplier && (
                          <span className="text-[10px] font-bold text-zinc-400 uppercase border border-zinc-200 px-1.5 rounded">
                            New Vendor
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 3. Logic Check */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center gap-2 text-sm text-zinc-600 bg-zinc-50/50 p-2 rounded border border-transparent group-hover:border-zinc-200 transition-colors">
                        <Scale className="h-4 w-4 text-zinc-400" />
                        <span className="font-mono">
                          1 <strong>{q.unit}</strong>{" "}
                          <span className="text-zinc-300">➜</span>{" "}
                          {q.conversionFactor} <strong>{q.baseUnit}</strong>
                        </span>
                      </div>
                    </td>

                    {/* 4. Costing */}
                    <td className="px-6 py-4 text-right align-top">
                      <div className="text-sm font-bold text-zinc-900 font-mono">
                        ₹{q.rawPrice.toLocaleString()}
                      </div>
                      <div className="text-xs text-zinc-400 font-medium mt-0.5">
                        per {q.unit}
                      </div>
                      <div className="flex items-center justify-end gap-1 text-xs text-zinc-500 font-medium mt-2">
                        <Clock className="h-3 w-3" />
                        <span>
                          {q.leadTime === 1
                            ? "Next Day"
                            : `${q.leadTime || 3} Days`}
                        </span>
                      </div>
                    </td>

                    {/* 5. Actions */}
                    <td className="px-6 py-4 text-right align-middle">
                      <div className="flex items-center justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDecision(q._id, "rejected")}
                          className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Reject Item"
                        >
                          <X className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDecision(q._id, "approved")}
                          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold rounded-lg shadow-sm hover:bg-zinc-800 hover:shadow-md transition-all active:scale-95"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Approve</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReview;
