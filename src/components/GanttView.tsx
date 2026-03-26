import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

interface GanttViewProps {
  projects?: any[];
}

export default function GanttView({ projects: initialProjects = [] }: GanttViewProps) {
  const [projects, setProjects] = useState<any[]>(initialProjects);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);


  const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

  if (loading) return <div className="p-8 text-center text-slate-500">Đang tải dữ liệu...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Lộ trình thực hiện Dự án</h2>
          <p className="text-slate-500 text-base">Tiến độ thi công và dự kiến hoàn thành năm 2026-2027</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden">
            <button className="px-4 py-2 text-base font-bold border-r border-slate-100 hover:bg-slate-50">2026</button>
            <button className="px-4 py-2 text-base font-bold bg-blue-50 text-blue-600">2027</button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-base font-bold text-slate-600">
            <Filter size={18} /> Lọc dự án
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          <div className="w-64 p-4 border-r border-slate-100 font-bold text-sm text-slate-400 uppercase tracking-widest">Tên Dự án</div>
          <div className="flex-1 flex overflow-x-auto">
            {months.map(m => (
              <div key={m} className="flex-1 min-w-[100px] p-4 text-center font-bold text-xs text-slate-400 uppercase border-r border-slate-100 last:border-0">
                {m}
              </div>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {projects.map((p, i) => {
            // Mocking Gantt positions based on project index for visual variety
            const startPos = (i * 10) % 40;
            const width = 30 + (i * 5) % 40;
            
            return (
              <div key={p.id} className="flex hover:bg-slate-50/50 transition-colors">
                <div className="w-64 p-4 border-r border-slate-100 flex flex-col justify-center">
                  <span className="text-base font-bold text-slate-700 truncate">{p.name}</span>
                  <span className="text-xs text-slate-400 font-mono uppercase">{p.code}</span>
                </div>
                <div className="flex-1 relative h-16 flex items-center px-2">
                  <div className="absolute inset-0 flex">
                    {months.map((_, idx) => (
                      <div key={idx} className="flex-1 border-r border-slate-50 last:border-0" />
                    ))}
                  </div>
                  <div 
                    className={`h-8 rounded-xl shadow-lg relative z-10 flex items-center px-4 text-xs text-white font-bold truncate transition-all hover:scale-[1.02] ${
                      p.status === 'Delayed' ? 'bg-rose-500 shadow-rose-200' : 'bg-blue-600 shadow-blue-200'
                    }`}
                    style={{ 
                      marginLeft: `${startPos}%`, 
                      width: `${width}%` 
                    }}
                  >
                    {p.progress}% - {p.currentStep}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
