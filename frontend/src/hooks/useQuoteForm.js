import { useState, useMemo, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import api from "../utils/api";
import { DEFAULT_SUPPLIERS, DEFAULT_MATERIALS, UNIT_TYPES, INITIAL_FORM_STATE } from "../constants/quoteConstants";

const getInitialFormData = (smartSupplierList, smartMaterialList) => ({
  ...INITIAL_FORM_STATE,
  supplierName: smartSupplierList[0] ?? "",
  materialName: smartMaterialList[0] ?? "",
});

export const useQuoteForm = (existingMaterials, existingSuppliers, onSuccess, onClose, isOpen) => {
  const [isCustomMaterial, setIsCustomMaterial] = useState(false);
  const [isCustomSupplier, setIsCustomSupplier] = useState(false);
  const [isCustomUnit, setIsCustomUnit] = useState(false);
  const [measureType, setMeasureType] = useState("MASS");
  const [paymentMode, setPaymentMode] = useState("Advance");
  const [creditDays, setCreditDays] = useState(30);
  const [loading, setLoading] = useState(false);

  const smartMaterialList = useMemo(
    () => [...new Set([...DEFAULT_MATERIALS, ...existingMaterials])].sort(),
    [existingMaterials]
  );

  const smartSupplierList = useMemo(
    () => [...new Set([...DEFAULT_SUPPLIERS, ...existingSuppliers])].sort(),
    [existingSuppliers]
  );

  const [formData, setFormData] = useState(() =>
    getInitialFormData(smartSupplierList, smartMaterialList)
  );

  const prevOpenRef = useRef(false);
  // Reset form only when modal opens (not when lists change while open)
  useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      setIsCustomMaterial(false);
      setIsCustomSupplier(false);
      setIsCustomUnit(false);
      setMeasureType("MASS");
      setPaymentMode("Advance");
      setCreditDays(30);
      setFormData(getInitialFormData(smartSupplierList, smartMaterialList));
    }
    prevOpenRef.current = isOpen;
  }, [isOpen, smartSupplierList, smartMaterialList]);

  // Sync payment terms
  useEffect(() => {
    const termString = paymentMode === "Credit" ? `Net ${creditDays} Days` : paymentMode;
    setFormData((prev) => ({ ...prev, paymentTerms: termString }));
  }, [paymentMode, creditDays]);

  // Reset units when measure type changes
  useEffect(() => {
    const defaultUnit = UNIT_TYPES[measureType].options[0];
    setIsCustomUnit(false);
    setFormData((prev) => ({
      ...prev,
      baseUnit: UNIT_TYPES[measureType].base,
      unit: defaultUnit.value,
      conversionFactor: defaultUnit.factor,
    }));
  }, [measureType]);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const name = e.target.name;

    if (name === "unitSelect") {
      if (value === "custom") {
        setIsCustomUnit(true);
        setFormData((prev) => ({ ...prev, unit: "", conversionFactor: 1 }));
      } else {
        setIsCustomUnit(false);
        const selectedOption = UNIT_TYPES[measureType].options.find((u) => u.value === value);
        setFormData((prev) => ({
          ...prev,
          unit: value,
          conversionFactor: selectedOption?.factor || 1,
        }));
      }
    } else if (name === "materialSelect") {
      setIsCustomMaterial(value === "custom");
      setFormData((prev) => ({ ...prev, materialName: value === "custom" ? "" : value }));
    } else if (name === "supplierSelect") {
      setIsCustomSupplier(value === "custom");
      setFormData((prev) => ({ ...prev, supplierName: value === "custom" ? "" : value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const payload = { ...formData, isCustomMaterial, isCustomSupplier, isCustomUnit };
      await api.post("/api/quotes", payload);
      toast.success("Quote Added Successfully!");
      if (onSuccess) await onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.response?.data?.message || "Failed to add quote");
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};