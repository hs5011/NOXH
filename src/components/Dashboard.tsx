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

export default function DashboardView({ projects: initialProjects = [], onCreateClick, onNavigateToProjects, processingAgencies = [], projectStages = [] }: any) {
  const [hoveredStep, setHoveredStep] = useState<{step: number, project: number, info: string} | null>(null);
  const [projects, setProjects] = useState<any[]>(initialProjects);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);


  if (loading) {
    return <div className="p-8 text-slate-500">Đang tải dữ liệu...</div>;
  }

  // Calculate KPIs
  const totalProjects = projects.length;
  const treHan = projects.filter(p => p.status === 'Delayed' || p.status === 'Warning').length;

  // Filter stages to only include the 3 main NOXH process stages for KPIs and Pie chart
  const noxhProcessStages = projectStages.filter((s: string) => s !== 'Hoàn thành');

  const dynamicKpis = noxhProcessStages.map((stage: string, index: number) => {
    const count = projects.filter(p => p.stage === stage).length;
    const colors = [
      { bg: 'bg-amber-50', text: 'text-amber-600' },
      { bg: 'bg-indigo-50', text: 'text-indigo-600' },
      { bg: 'bg-emerald-50', text: 'text-emerald-600' },
      { bg: 'bg-sky-50', text: 'text-sky-600' },
      { bg: 'bg-purple-50', text: 'text-purple-600' },
      { bg: 'bg-pink-50', text: 'text-pink-600' },
    ];
    // Use different icons based on index for variety
    const icons = [Clock, TrendingUp, CheckCircle2, Building2];
    return {
      label: stage,
      value: count,
      icon: icons[index % icons.length],
      color: colors[index % colors.length]
    };
  });

  const kpis = [
    { label: 'Tổng số dự án', value: totalProjects, icon: Building2, color: { bg: 'bg-blue-50', text: 'text-blue-600' } },
    ...dynamicKpis,
    { label: 'Quá hạn', value: treHan, icon: AlertCircle, color: { bg: 'bg-rose-50', text: 'text-rose-600' } },
  ];

  const stageData = noxhProcessStages.map((stage: string) => ({
    name: stage,
    value: projects.filter(p => p.stage === stage).length
  })).filter((d: any) => d.value > 0);
  
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
    const stepName = p.childStep || p.currentStep;
    if (stepName && p.stage !== 'Hoàn thành') {
      stepCounts[stepName] = (stepCounts[stepName] || 0) + 1;
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
    { label: 'Dự án quá hạn', count: treHan },
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
    if (alertLabel === 'Dự án quá hạn') {
      onNavigateToProjects({ alert: 'Delayed' });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">Điều hành Dự án NOXH</h2>
          <p className="text-slate-500 text-sm sm:text-lg mt-1">Tổng hợp dữ liệu tiến độ thực hiện các dự án Nhà ở xã hội TP.HCM</p>
        </div>
      </div>

      {/* KPI SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {kpis.map((kpi, i) => <StatCard key={i} {...kpi} />)}
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-4 sm:mb-6 uppercase tracking-tight">Phân bổ dự án theo quy trình NOXH</h3>
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stageData} innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                  {stageData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend iconSize={10} wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-4 sm:mb-6">Thống kê theo cơ quan xử lý</h3>
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agencyData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 10}} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>


      {/* Row 3: Gantt Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
        <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-4 sm:mb-6">Gantt Chart tổng thể (Top 5 dự án mới cập nhật)</h3>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-sm sm:text-base border-collapse min-w-[600px] sm:min-w-0">
            <thead>
              <tr className="text-slate-400 text-xs sm:text-base uppercase text-left">
                <th className="pb-4 px-4 sm:px-0 pr-4">Mã dự án</th>
                <th className="pb-4 pr-4">Tên dự án</th>
                <th className="pb-4">Timeline (15 bước)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.slice(0, 5).map((p, i) => (
                <tr key={p.id}>
                  <td className="py-3 sm:py-4 px-4 sm:px-0 pr-4 font-bold">{p.code}</td>
                  <td className="py-3 sm:py-4 pr-4 truncate max-w-[150px] sm:max-w-[200px]" title={p.name}>{p.name}</td>
                  <td className="py-3 sm:py-4">
                    <div className="flex gap-0.5 sm:gap-1 h-4 sm:h-6">
                      {[...Array(15)].map((_, step) => {
                        let color = 'bg-slate-200'; // chưa bắt đầu
                        const progressStep = Math.floor((p.progress / 100) * 15);
                        if (step < progressStep) color = 'bg-emerald-600'; // hoàn thành
                        else if (step === progressStep) {
                          color = p.status === 'Delayed' ? 'bg-rose-500' : 'bg-blue-500'; // đang xử lý hoặc quá hạn
                        }
                        
                        const stepNames = ['Quy hoạch', 'Giao đất', 'PCCC', 'GPXD', 'Thi công', 'Nghiệm thu', 'Bàn giao', 'Vận hành', 'Bảo trì', 'Kiểm toán', 'Quyết toán', 'Pháp lý', 'Tài chính', 'Nhân sự', 'Hoàn tất'];
                        const agencyNames = ['Sở QHKT', 'Sở TNMT', 'Cảnh sát PCCC', 'Sở XD', 'Nhà thầu', 'Chủ đầu tư', 'Ban QLDA', 'Vận hành', 'Bảo trì', 'Kiểm toán', 'Sở Tài chính', 'Sở Tư pháp', 'Ngân hàng', 'HR', 'UBND'];
                        
                        return (
                          <div 
                            key={step} 
                            className={`w-3 sm:w-6 rounded-sm sm:rounded ${color} cursor-help relative`} 
                            onMouseEnter={() => setHoveredStep({step, project: p.id, info: `Bước ${step + 1}: ${stepNames[step]}\nThực hiện: ${agencyNames[step]}`})}
                            onMouseLeave={() => setHoveredStep(null)}
                          >
                            {hoveredStep?.step === step && hoveredStep?.project === p.id && (
                              <div className="absolute z-50 bg-slate-800 text-white text-[10px] sm:text-base p-2 rounded shadow-lg whitespace-pre-line w-32 sm:w-48 -top-16 left-0">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-4 sm:mb-6">Thống kê theo khu vực</h3>
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData}>
                <XAxis dataKey="name" tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" onClick={handleRegionClick} className="cursor-pointer" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-4 sm:mb-6">Danh sách bước đang tắc</h3>
          <div className="space-y-3 sm:space-y-4">
            {stuckSteps.map(({step, count}, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleStepClick(step)}>
                <span className="font-bold text-sm sm:text-base">{step}</span>
                <span className="px-2 py-1 bg-slate-200 rounded-lg text-xs sm:text-base font-bold">{count} dự án</span>
              </div>
            ))}
            {stuckSteps.length === 0 && (
              <div className="text-slate-500 text-center py-4 text-sm">Không có dữ liệu</div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
