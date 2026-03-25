import React, { useState, useEffect } from 'react';
import { 
  Building2, AlertCircle, CheckCircle2, Clock, 
  BarChart3, Search, MapPin, TrendingUp
} from 'lucide-react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PROJECT_STAGES, PROJECT_REGIONS } from '../constants';

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className={`p-3 rounded-xl inline-block mb-4 ${color.bg} ${color.text}`}>
      <Icon size={24} />
    </div>
    <p className="text-slate-500 text-base font-bold uppercase tracking-wider mb-1">{label}</p>
    <h3 className="text-4xl font-bold text-slate-900">{value}</h3>
  </div>
);

export default function DashboardView({ onCreateClick, onNavigateToProjects, processingAgencies = [] }: any) {
  const [hoveredStep, setHoveredStep] = useState<{step: number, project: number, info: string} | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch projects", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-slate-500">Đang tải dữ liệu...</div>;
  }

  // Calculate KPIs
  const totalProjects = projects.length;
  const chuanBiDauTu = projects.filter(p => p.stage === 'Chuẩn bị đầu tư').length;
  const thucHienDauTu = projects.filter(p => p.stage === 'Thực hiện đầu tư').length;
  const ketThucDauTu = projects.filter(p => p.stage === 'Kết thúc đầu tư').length;
  const hoanThanh = projects.filter(p => p.stage === 'Hoàn thành').length;
  const treHan = projects.filter(p => p.status === 'Delayed' || p.status === 'Warning').length;

  const kpis = [
    { label: 'Tổng số dự án', value: totalProjects, icon: Building2, color: { bg: 'bg-blue-50', text: 'text-blue-600' } },
    { label: 'Chuẩn bị đầu tư', value: chuanBiDauTu, icon: Clock, color: { bg: 'bg-amber-50', text: 'text-amber-600' } },
    { label: 'Thực hiện đầu tư', value: thucHienDauTu, icon: TrendingUp, color: { bg: 'bg-indigo-50', text: 'text-indigo-600' } },
    { label: 'Kết thúc đầu tư', value: ketThucDauTu, icon: CheckCircle2, color: { bg: 'bg-emerald-50', text: 'text-emerald-600' } },
    { label: 'Hoàn thành', value: hoanThanh, icon: CheckCircle2, color: { bg: 'bg-sky-50', text: 'text-sky-600' } },
    { label: 'Trễ hạn', value: treHan, icon: AlertCircle, color: { bg: 'bg-rose-50', text: 'text-rose-600' } },
  ];

  const stageData = [
    { name: 'Chuẩn bị', value: chuanBiDauTu },
    { name: 'Thực hiện', value: thucHienDauTu },
    { name: 'Kết thúc', value: ketThucDauTu },
    { name: 'Hoàn thành', value: hoanThanh },
  ].filter(d => d.value > 0);
  
  const COLORS = ['#f59e0b', '#4f46e5', '#10b981', '#0ea5e9'];

  const agencyData = processingAgencies.map((agency: any) => ({
    name: agency.name,
    value: projects.filter(p => p.currentAgency === agency.name).length
  })).filter((d: any) => d.value > 0).sort((a: any, b: any) => b.value - a.value);

  const regionData = PROJECT_REGIONS.map(region => ({
    name: region,
    value: projects.filter(p => p.location && p.location.includes(region)).length
  }));

  // Danh sách bước đang tắc (Top 4 steps with most projects)
  const stepCounts: Record<string, number> = {};
  projects.forEach(p => {
    if (p.currentStep && p.stage !== 'Hoàn thành') {
      stepCounts[p.currentStep] = (stepCounts[p.currentStep] || 0) + 1;
    }
  });
  const stuckSteps = Object.entries(stepCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([step, count]) => ({ step, count }));

  // Cảnh báo hệ thống
  const hoSoThieu = projects.filter(p => p.progress < 100 && p.files && p.files.length === 0).length;
  // Mock some other alerts based on data
  const choUBND = projects.filter(p => p.currentAgency && p.currentAgency.includes('UBND')).length;

  const alerts = [
    { label: 'Dự án trễ hạn', count: treHan },
    { label: 'Hồ sơ thiếu', count: hoSoThieu },
    { label: 'Dự án chờ ý kiến UBND', count: choUBND },
  ];

  // Danh sách dự án cần theo dõi (Delayed or Warning)
  const watchProjects = projects.filter(p => p.status === 'Delayed' || p.status === 'Warning').slice(0, 5);

  const handleRegionClick = (data: any) => {
    onNavigateToProjects({ region: data.name });
  };

  const handleStepClick = (step: string) => {
    onNavigateToProjects({ step });
  };

  const handleAlertAction = (alertLabel: string) => {
    if (alertLabel === 'Dự án trễ hạn') {
      onNavigateToProjects({ alert: 'Delayed' });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Điều hành Dự án NOXH</h2>
          <p className="text-slate-500 text-lg mt-1">Tổng hợp dữ liệu tiến độ thực hiện các dự án Nhà ở xã hội TP.HCM</p>
        </div>
        <button 
          onClick={onCreateClick}
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-base font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all"
        >
          Khởi tạo dự án
        </button>
      </div>

      {/* KPI SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => <StatCard key={i} {...kpi} />)}
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-xl text-slate-900 mb-6">Phân bổ dự án theo giai đoạn</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={stageData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {stageData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-xl text-slate-900 mb-6">Thống kê theo cơ quan xử lý</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={agencyData} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} tick={{fontSize: 14}} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Danh sách dự án cần theo dõi */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-xl text-slate-900 mb-6">Danh sách dự án cần theo dõi</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-base">
            <thead>
              <tr className="text-slate-400 text-base uppercase text-left">
                <th className="pb-4">Mã dự án</th>
                <th className="pb-4">Tên dự án</th>
                <th className="pb-4">Bước hiện tại</th>
                <th className="pb-4">Cơ quan xử lý</th>
                <th className="pb-4">% Hoàn thành</th>
                <th className="pb-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {watchProjects.length > 0 ? watchProjects.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => onNavigateToProjects({ id: p.id })}>
                  <td className="py-4 font-bold text-base">{p.code}</td>
                  <td className="py-4 text-base truncate max-w-[200px]" title={p.name}>{p.name}</td>
                  <td className="py-4 text-base">{p.currentStep}</td>
                  <td className="py-4 text-base">{p.currentAgency}</td>
                  <td className="py-4 text-base">{p.progress}%</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-lg text-sm font-bold uppercase ${p.status === 'Delayed' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                      {p.status === 'Delayed' ? 'Trễ hạn' : 'Cảnh báo'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">Không có dự án nào cần theo dõi đặc biệt</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 3: Gantt Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-xl text-slate-900 mb-6">Gantt Chart tổng thể (Top 5 dự án mới cập nhật)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-base border-collapse">
            <thead>
              <tr className="text-slate-400 text-base uppercase text-left">
                <th className="pb-4 pr-4">Mã dự án</th>
                <th className="pb-4 pr-4">Tên dự án</th>
                <th className="pb-4">Timeline (15 bước)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.slice(0, 5).map((p, i) => (
                <tr key={p.id}>
                  <td className="py-4 pr-4 font-bold text-base">{p.code}</td>
                  <td className="py-4 pr-4 text-base truncate max-w-[200px]" title={p.name}>{p.name}</td>
                  <td className="py-4">
                    <div className="flex gap-1 h-6">
                      {[...Array(15)].map((_, step) => {
                        let color = 'bg-slate-200'; // chưa bắt đầu
                        const progressStep = Math.floor((p.progress / 100) * 15);
                        if (step < progressStep) color = 'bg-emerald-600'; // hoàn thành
                        else if (step === progressStep) {
                          color = p.status === 'Delayed' ? 'bg-rose-500' : 'bg-blue-500'; // đang xử lý hoặc trễ
                        }
                        
                        const stepNames = ['Quy hoạch', 'Giao đất', 'PCCC', 'GPXD', 'Thi công', 'Nghiệm thu', 'Bàn giao', 'Vận hành', 'Bảo trì', 'Kiểm toán', 'Quyết toán', 'Pháp lý', 'Tài chính', 'Nhân sự', 'Hoàn tất'];
                        const agencyNames = ['Sở QHKT', 'Sở TNMT', 'Cảnh sát PCCC', 'Sở XD', 'Nhà thầu', 'Chủ đầu tư', 'Ban QLDA', 'Vận hành', 'Bảo trì', 'Kiểm toán', 'Sở Tài chính', 'Sở Tư pháp', 'Ngân hàng', 'HR', 'UBND'];
                        
                        return (
                          <div 
                            key={step} 
                            className={`w-6 rounded ${color} cursor-help relative`} 
                            onMouseEnter={() => setHoveredStep({step, project: p.id, info: `Bước ${step + 1}: ${stepNames[step]}\nThực hiện: ${agencyNames[step]}`})}
                            onMouseLeave={() => setHoveredStep(null)}
                          >
                            {hoveredStep?.step === step && hoveredStep?.project === p.id && (
                              <div className="absolute z-50 bg-slate-800 text-white text-base p-2 rounded shadow-lg whitespace-pre-line w-48 -top-16 left-0">
                                {hoveredStep.info}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-xl text-slate-900 mb-6">Thống kê theo khu vực</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" onClick={handleRegionClick} className="cursor-pointer" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-xl text-slate-900 mb-6">Danh sách bước đang tắc</h3>
          <div className="space-y-4">
            {stuckSteps.map(({step, count}, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleStepClick(step)}>
                <span className="font-bold text-base">{step}</span>
                <span className="px-2 py-1 bg-slate-200 rounded-lg text-base font-bold">{count} dự án</span>
              </div>
            ))}
            {stuckSteps.length === 0 && (
              <div className="text-slate-500 text-center py-4">Không có dữ liệu</div>
            )}
          </div>
        </div>
      </div>

      {/* Row 5: Cảnh báo hệ thống */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-xl text-slate-900 mb-6">Cảnh báo hệ thống</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alertItem, i) => (
            <div key={i} className="flex items-center justify-between gap-4 p-4 border border-slate-100 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer" onClick={() => handleAlertAction(alertItem.label)}>
              <div className="flex items-center gap-4">
                <AlertCircle className="text-rose-500" />
                <span className="font-bold text-base">{alertItem.label}</span>
              </div>
              <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-lg text-base font-bold">{alertItem.count} dự án</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
