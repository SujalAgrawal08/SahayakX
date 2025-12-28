"use client";

import { useState, useRef } from "react";
import { 
  UploadCloud, 
  FileText, 
  Loader2, 
  CheckCircle2, 
  ScanLine, 
  ShieldCheck, 
  AlertCircle 
} from "lucide-react";
import { toast } from "sonner"; // Import Toast

interface DocUploaderProps {
  onDataExtracted: (data: any) => void;
}

export default function DocUploader({ onDataExtracted }: DocUploaderProps) {
  const [incomeFile, setIncomeFile] = useState<string>("");
  const [casteFile, setCasteFile] = useState<string>("");
  
  const [loadingIncome, setLoadingIncome] = useState(false);
  const [loadingCaste, setLoadingCaste] = useState(false);
  
  const [isGeneral, setIsGeneral] = useState(false);

  const incomeInputRef = useRef<HTMLInputElement>(null);
  const casteInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File, type: "INCOME" | "CASTE") => {
    if (!file) return;
    
    // Set Loading State
    if (type === "INCOME") {
      setIncomeFile(file.name);
      setLoadingIncome(true);
    } else {
      setCasteFile(file.name);
      setLoadingCaste(true);
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    // Show starting toast
    const toastId = toast.loading(`Scanning ${type === "INCOME" ? "Income Proof" : "Caste Certificate"}...`);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      
      // 1. HANDLE SCANNED PDF ERROR
      if (res.status === 422 && data.error === "SCANNED_PDF") {
        toast.error("Unreadable Document", {
          id: toastId,
          description: "This PDF is a scanned image. Please upload a clear JPG/PNG photo instead.",
          duration: 5000, // Show longer so they can read
        });
        
        // Reset file input
        if (type === "INCOME") setIncomeFile("");
        else setCasteFile("");
        return;
      }

      if (!res.ok) throw new Error("Extraction failed");
      
      // 2. SUCCESS
      toast.success("Scan Complete", {
        id: toastId,
        description: type === "INCOME" 
          ? `Found Income: ₹${data.income} | Age: ${data.age}`
          : `Category Detected: ${data.caste || "General"}`,
      });

      if (type === "INCOME") {
        onDataExtracted({
          income: data.income,
          age: data.age,
          gender: data.gender,
          state: data.state,
          occupation: data.occupation
        });
      } else {
        onDataExtracted({ caste: data.caste || "General" });
      }

    } catch (e) {
      console.error(e);
      // 3. GENERIC ERROR
      toast.error("Scan Failed", {
        id: toastId,
        description: "Could not read document. Try a clearer image.",
      });
      
      if (type === "INCOME") setIncomeFile("");
      else setCasteFile("");
    } finally {
      if (type === "INCOME") setLoadingIncome(false);
      else setLoadingCaste(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
      
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-100 transition-colors"></div>

      {/* Header */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20">
              <ScanLine size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Project Netra</h3>
              <p className="text-xs text-slate-500 font-medium">AI Document Scanner</p>
            </div>
          </div>
          
          {/* General Toggle */}
          <div 
            onClick={() => {
              const newState = !isGeneral;
              setIsGeneral(newState);
              if (newState) {
                onDataExtracted({ caste: "General" });
                toast.info("Category Updated", { description: "Set to General Category" });
              }
            }}
            className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 transition-all select-none ${
              isGeneral 
                ? "bg-slate-800 text-white border-slate-800" 
                : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
            }`}
          >
            {isGeneral ? <CheckCircle2 size={12} /> : <div className="w-3 h-3 rounded-full border-2 border-slate-300" />}
            I am General Category
          </div>
        </div>
      </div>

      {/* Upload Grid */}
      <div className="grid grid-cols-2 gap-4 relative z-10">
        
        {/* Income Upload */}
        <div 
          onClick={() => incomeInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all h-32 ${
            incomeFile 
              ? "border-emerald-200 bg-emerald-50/50" 
              : "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30"
          }`}
        >
          {loadingIncome ? (
            <Loader2 className="animate-spin text-indigo-500 mb-2" />
          ) : incomeFile ? (
            <CheckCircle2 className="text-emerald-500 mb-2" />
          ) : (
            <FileText className="text-indigo-400 mb-2 opacity-50" />
          )}
          
          <div className="text-xs font-bold text-slate-700">
            {incomeFile ? "Income Proof" : "Upload Income"}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 max-w-[80px] truncate">
            {incomeFile || "PDF / JPG"}
          </div>
        </div>

        {/* Caste Upload */}
        <div 
          onClick={() => !isGeneral && casteInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all h-32 ${
            isGeneral 
              ? "border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed" 
              : casteFile 
                ? "border-emerald-200 bg-emerald-50/50 cursor-pointer" 
                : "border-slate-200 hover:border-purple-400 hover:bg-purple-50/30 cursor-pointer"
          }`}
        >
          {isGeneral ? (
            <>
               <ShieldCheck className="text-slate-400 mb-2" />
               <div className="text-xs font-bold text-slate-500">Not Required</div>
            </>
          ) : loadingCaste ? (
            <Loader2 className="animate-spin text-purple-500 mb-2" />
          ) : casteFile ? (
            <CheckCircle2 className="text-emerald-500 mb-2" />
          ) : (
            <ShieldCheck className="text-purple-400 mb-2 opacity-50" />
          )}

          {!isGeneral && (
            <>
              <div className="text-xs font-bold text-slate-700">
                {casteFile ? "Caste Proof" : "Upload Caste"}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 max-w-[80px] truncate">
                {casteFile || "PDF / JPG"}
              </div>
            </>
          )}
        </div>

      </div>

      <input 
        type="file" 
        ref={incomeInputRef} 
        className="hidden" 
        accept="image/*,application/pdf"
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "INCOME")}
      />
      <input 
        type="file" 
        ref={casteInputRef} 
        className="hidden" 
        accept="image/*,application/pdf"
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "CASTE")}
      />

    </div>
  );
}