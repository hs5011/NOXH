import React from 'react';
import { BarChart3, TrendingUp, Users, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const KPIStat = ({ label, value, trend, isUp }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
    <p className="text-slate-500 text-lg font-bold uppercase tracking-wider mb-2">{label}</p>
    <div className="flex items-end justify-between">
      <h3 className="text-5xl font-bold text-slate-900">{value}</h3>
      <div className={`flex items-center gap-1 text-lg font-bold ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
        {isUp ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
        {trend}
      </div>
    </div>
  </div>
);

export default function KPIView() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold text-slate-900">Báo cáo KPI & Hiệu suất</h2>
          <p className="text-slate-500 text-lg">Phân tích dữ liệu vận hành và tốc độ xử lý hồ sơ</p>
        </div>
        <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-lg font-bold text-slate-600 outline-none">
          <option>Quý 1 - 2024</option>
          <option>Năm 2023</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPIStat label="Thời gian xử lý TB" value="14.5 ngày" trend="Giảm 12%" isUp={true} />
        <KPIStat label="Tỷ lệ đúng hạn" value="92.4%" trend="Tăng 2.1%" isUp={true} />
        <KPIStat label="Hồ sơ tồn đọng" value="45" trend="Tăng 5%" isUp={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-500" />
            Biểu đồ tăng trưởng dự án
          </h3>
          <div className="h-64 flex items-end gap-4">
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-blue-500 rounded-t-lg hover:bg-blue-600 transition-all cursor-pointer relative group"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-base px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {h} dự án
                  </div>
                </div>
                <span className="text-base font-bold text-slate-400">T{i+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2">
            <Users size={20} className="text-blue-500" />
            Phân bổ nguồn lực theo Sở
          </h3>
          <div className="space-y-6">
            {[
              { name: 'Sở Xây dựng', count: 85, color: 'bg-blue-500' },
              { name: 'Sở Quy hoạch KT', count: 42, color: 'bg-emerald-500' },
              { name: 'Sở Tài nguyên MT', count: 38, color: 'bg-amber-500' },
              { name: 'Sở Tài chính', count: 12, color: 'bg-rose-500' }
            ].map((s) => (
              <div key={s.name} className="flex items-center gap-4">
                <span className="w-32 text-lg font-bold text-slate-600">{s.name}</span>
                <div className="flex-1 h-3 bg-slate-50 rounded-full overflow-hidden">
                  <div className={`h-full ${s.color}`} style={{ width: `${(s.count / 85) * 100}%` }} />
                </div>
                <span className="text-lg font-bold text-slate-900">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
