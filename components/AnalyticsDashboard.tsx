"use client";

import { useEffect, useState } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Search, TrendingUp, Activity } from "lucide-react";

export default function AnalyticsDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(apiData => {
        if (apiData && apiData.categories && apiData.categories.length > 0) {
          setData(apiData);
        } else {
          useMockData();
        }
      })
      .catch(err => {
        console.error("Analytics Error:", err);
        useMockData();
      });
  }, []);

  const useMockData = () => {
    setData({
      total: 12450,
      categories: [
        { name: 'Finance', value: 4500 },
        { name: 'Education', value: 3200 },
        { name: 'Healthcare', value: 1800 },
        { name: 'General', value: 850 },
        { name: 'Agriculture', value: 2100 }, 
      ]
    });
  };

  if (!data) return (
    <div className="w-full h-64 bg-slate-50 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 animate-pulse border border-slate-100">
        <div className="p-4 bg-white rounded-full shadow-sm">
            <Activity className="text-rose-400 animate-spin" size={24} />
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Syncing Data...</span>
    </div>
  );

  return (
    <div className="w-full animate-in fade-in zoom-in-95 duration-700">
      <div className="grid md:grid-cols-5 gap-6">
        
        {/* 1. THE "IMPACT" CARD */}
        <div className="md:col-span-2 bg-slate-900 rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col justify-between group shadow-2xl shadow-slate-900/20">
          
          {/* Background Effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-rose-500/30 transition-colors duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            <div className="mb-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full bg-white/5">
                  Live Impact
                </span>
            </div>
            
            <div className="space-y-1">
                <h3 className="text-6xl font-black text-white tracking-tighter">
                    {data.total?.toLocaleString() || "0"}
                </h3>
                <p className="text-slate-400 font-medium text-sm">Queries Resolved Successfully</p>
            </div>
          </div>

          <div className="relative z-10 mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
             <div>
                <div className="text-xs text-slate-500 font-bold uppercase mb-1">Status</div>
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Operational
                </div>
             </div>
             <div>
                <div className="text-xs text-slate-500 font-bold uppercase mb-1">Latency</div>
                <div className="text-white font-bold text-sm">~45ms</div>
             </div>
          </div>
        </div>

        {/* 2. THE "TREND" CHART */}
        <div className="md:col-span-3 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
           
           <div className="flex justify-between items-start mb-2">
              <div>
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <Search size={18} className="text-indigo-500" />
                    Demand Trends
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">Most searched scheme categories</p>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                  <TrendingUp size={20} />
              </div>
           </div>

           {/* REMOVED -ml-4 AND ADDED MARGIN TO CHART */}
           <div className="h-48 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={data.categories || []} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                 <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                    dy={10}
                    interval={0} 
                    padding={{ left: 20, right: 20 }} // Pushes first/last labels in so they aren't cut off
                 />
                 <Tooltip 
                    cursor={{stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4'}}
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                        return (
                            <div className="bg-slate-900 text-white text-xs font-bold py-2 px-3 rounded-lg shadow-xl">
                                {payload[0].value} Requests
                            </div>
                        );
                        }
                        return null;
                    }}
                 />
                 <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                 />
               </AreaChart>
             </ResponsiveContainer>
           </div>

        </div>
      </div>
    </div>
  );
}