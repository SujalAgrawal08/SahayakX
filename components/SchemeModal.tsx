"use client";

import { 
  X, 
  CheckCircle, 
  FileText, 
  Building2, 
  Wallet, 
  Users, 
  MapPin, 
  Calendar, 
  ExternalLink 
} from "lucide-react";

export default function SchemeModal({ scheme, onClose }: { scheme: any, onClose: () => void }) {
  if (!scheme) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300 relative hide-scrollbar">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* 1. HEADER SECTION */}
        <div className="bg-slate-50 p-8 pb-10 border-b border-slate-100">
          {/* Ministry Badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm mb-4">
            <Building2 size={14} className="text-rose-500" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
              {scheme.ministry || "Government Scheme"}
            </span>
          </div>

          {/* Scheme Name (The Fix) */}
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-4">
            {scheme.name}
          </h2>

          <p className="text-slate-500 font-medium leading-relaxed">
            {scheme.description}
          </p>
        </div>

        {/* 2. BODY SECTION */}
        <div className="p-8 space-y-8">
          
          {/* Eligibility Grid */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Users size={16} className="text-indigo-500"/> Eligibility Criteria
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                <div className="text-xs text-slate-400 font-bold uppercase mb-1 flex justify-center items-center gap-1"><Calendar size={10}/> Age</div>
                <div className="font-bold text-slate-900">{scheme.age_min} - {scheme.age_max}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                <div className="text-xs text-slate-400 font-bold uppercase mb-1 flex justify-center items-center gap-1"><Wallet size={10}/> Income</div>
                <div className="font-bold text-slate-900">
                  {scheme.income_max > 10000000 ? "No Limit" : `< ₹${(scheme.income_max/1000).toFixed(0)}k`}
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                <div className="text-xs text-slate-400 font-bold uppercase mb-1 flex justify-center items-center gap-1"><Users size={10}/> Gender</div>
                <div className="font-bold text-slate-900">{scheme.gender}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                <div className="text-xs text-slate-400 font-bold uppercase mb-1 flex justify-center items-center gap-1"><MapPin size={10}/> State</div>
                <div className="font-bold text-slate-900">{scheme.state}</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Benefits */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Wallet size={16} className="text-emerald-500"/> Benefits
              </h3>
              <ul className="space-y-3">
                {scheme.benefits?.map((benefit: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 text-sm font-medium">
                    <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    {benefit}
                  </li>
                )) || <p className="text-slate-400 text-sm italic">Details available on portal</p>}
              </ul>
            </div>

            {/* Documents */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FileText size={16} className="text-orange-500"/> Required Docs
              </h3>
              <div className="flex flex-wrap gap-2">
                {scheme.required_docs?.map((doc: string, i: number) => (
                  <span key={i} className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-orange-100">
                    <FileText size={12} /> {doc}
                  </span>
                )) || <span className="text-slate-400 text-sm italic">Standard ID Proofs</span>}
              </div>
            </div>
          </div>

        </div>

        {/* 3. FOOTER */}
        <div className="p-8 pt-0 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          <button className="flex-[2] bg-slate-900 text-white py-4 rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2">
            Apply Now <ExternalLink size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}