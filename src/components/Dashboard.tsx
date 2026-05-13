import React, { useState, useEffect } from 'react';
import { 
  Building2, AlertCircle, CheckCircle2, Clock, 
  BarChart3, Search, MapPin, TrendingUp, X, ExternalLink,
  ChevronRight, ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PROJECT_STAGES, PROJECT_REGIONS } from '../constants';
import { INITIAL_PROCESSES } from '../data/appData';
import { formatDate } from '../lib/projectUtils';

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className={`p-3 rounded-xl inline-block mb-4 ${color.bg} ${color.text}`}>
      <Icon size={24} />
    </div>
    <p className="text-slate-500 text-base font-bold uppercase tracking-wider mb-1">{label}</p>
    <h3 className="text-4xl font-bold text-slate-900">{value}</h3>
  </div>
);

export default function DashboardView({ projects: initialProjects = [], onCreateClick, onNavigateToProjects, onProjectClick, processingAgencies = [], projectStages = [], currentUser }: any) {
  const [hoveredStep, setHoveredStep] = useState<any | null>(null);
  const [projects, setProjects] = useState<any[]>(initialProjects);
  const [loading, setLoading] = useState(false);
  const [selectedStepProjects, setSelectedStepProjects] = useState<{step: string, projects: any[]} | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'delayed' | 'ontime'>('all');

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const globalFilteredProjects = projects.filter(p => {
    let matches = true;
    if (searchTerm) {
      matches = matches && (
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return matches;
  });

  const totalFilteredProjects = globalFilteredProjects.length;
  const overdueFilteredProjects = globalFilteredProjects.filter(p => p.status === 'Delayed' || p.status === 'Warning').length;
  const onTimeFilteredProjects = totalFilteredProjects - overdueFilteredProjects;

  const showInvestorStat = !currentUser || currentUser.roleId === 'Admin' || (currentUser.userType === 'agency' && currentUser.agencyId === '1') || currentUser.userType === 'investor';

  const dynamicAgencies = [
    ...[...processingAgencies].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)).map(a => {
      const agencyProjects = globalFilteredProjects.filter(p => p.currentAgency === a.name);
      const count = agencyProjects.length;
      const delayedCount = agencyProjects.filter(p => p.status === 'Delayed' || p.status === 'Warning').length;
      return {
        ...a,
        count,
        delayedCount,
        subtext: 'dự án đang xử lý',
        color: 'bg-blue-50',
        iconColor: 'text-blue-500'
      };
    }),
    ...(showInvestorStat ? [
      {
        id: 'investor-stat',
        name: 'Chủ đầu tư',
        count: globalFilteredProjects.filter(p => p.currentAgency === 'Chủ đầu tư').length,
        delayedCount: globalFilteredProjects.filter(p => p.currentAgency === 'Chủ đầu tư' && (p.status === 'Delayed' || p.status === 'Warning')).length,
        subtext: 'dự án đang xử lý',
        color: 'bg-emerald-50',
        iconColor: 'text-emerald-500',
        departments: []
      },
      ...(!currentUser || currentUser?.userType !== 'investor' ? [{
        id: 'no-investor-stat',
        name: 'Chưa có chủ đầu tư',
        count: globalFilteredProjects.filter(p => p.investor === 'Chưa có chủ đầu tư').length,
        delayedCount: globalFilteredProjects.filter(p => p.investor === 'Chưa có chủ đầu tư' && (p.status === 'Delayed' || p.status === 'Warning')).length,
        subtext: 'dự án đang xử lý',
        color: 'bg-amber-50',
        iconColor: 'text-amber-500',
        departments: []
      }] : [])
    ] : [])
  ];

  const getProcessStats = () => {
    const processes = new Set<string>();
    globalFilteredProjects.forEach(p => {
      if (p.processId) processes.add(p.processId);
    });

    return Array.from(processes)
      .map(processId => {
        const process = INITIAL_PROCESSES.find(p => p.id === processId);
        const processName = process ? process.name : 'Quy trình khác';
        const processProjects = globalFilteredProjects.filter(p => p.processId === processId);
        const delayed = processProjects.filter(p => p.status === 'Delayed' || p.status === 'Warning').length;
        const ontime = processProjects.length - delayed;
        
        let count = processProjects.length;
        if (statusFilter === 'delayed') count = delayed;
        if (statusFilter === 'ontime') count = ontime;

        return {
          id: processId,
          name: processName,
          count,
          total: processProjects.length,
          delayed,
          ontime
        };
      }).filter(s => s.count > 0);
  };


  if (loading) {
    return <div className="p-8 text-slate-500">Đang tải dữ liệu...</div>;
  }

  // Calculate KPIs
  const totalProjects = projects.length;
  const treHan = projects.filter(p => (p.status === 'Delayed' || p.status === 'Warning') && p.stage !== 'Hoàn thành').length;

  // New specific milestone counts based on DashboardApp logic
  const approvedCount = projects.filter(p => {
    const isLicensed = (p.gpxaydung_nn_date === 'X' || p.gpxaydung_cdt_date === 'X');
    const isChutruongDone = (p.chutruong_nn_date === 'X' || p.chutruong_cdt_date === 'X');
    // Chỉ tính nếu đang ở giai đoạn Chuẩn bị đầu tư và đã xong chủ trương nhưng chưa có GPXD
    return p.stage === 'CHUẨN BỊ ĐẦU TƯ' && isChutruongDone && !isLicensed;
  }).length;

  const licensedCount = projects.filter(p => {
    const isLicensed = (p.gpxaydung_nn_date === 'X' || p.gpxaydung_cdt_date === 'X');
    // Chỉ tính nếu đang ở giai đoạn Chuẩn bị đầu tư và đã có GPXD
    return p.stage === 'CHUẨN BỊ ĐẦU TƯ' && isLicensed;
  }).length;

  const announcedCount = projects.filter(p => p.stage === 'THỰC HIỆN ĐẦU TƯ').length;

  const kpis = [
    { label: 'Tổng số dự án', value: totalProjects, icon: Building2, color: { bg: 'bg-blue-50', text: 'text-blue-600' } },
    { label: 'Chấp thuận chủ trương ĐT', value: approvedCount, icon: Clock, color: { bg: 'bg-amber-50', text: 'text-amber-600' } },
    { label: 'Được cấp phép xây dựng', value: licensedCount, icon: CheckCircle2, color: { bg: 'bg-indigo-50', text: 'text-indigo-600' } },
    { label: 'Dự án đã công bố', value: announcedCount, icon: TrendingUp, color: { bg: 'bg-emerald-50', text: 'text-emerald-600' } },
    { label: 'Dự án quá hạn', value: treHan, icon: AlertCircle, color: { bg: 'bg-rose-50', text: 'text-rose-600' } },
  ];

  const processData = INITIAL_PROCESSES.map((process: any) => ({
    name: process.name,
    value: projects.filter(p => p.processId === process.id).length
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

  // Danh sách các thủ tục đang tồn nhiều (Top 4 steps with most projects)
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
    const filteredProjects = projects.filter(p => p.childStep === step || p.currentStep === step);
    setSelectedStepProjects({ step, projects: filteredProjects });
  };

  const handleNavigateToProjectDetail = (project: any) => {
    if (onProjectClick) {
      onProjectClick(project);
    } else {
      onNavigateToProjects({ id: project.id });
    }
    setSelectedStepProjects(null);
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
                <Pie data={processData} innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                  {processData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
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
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="font-bold text-lg sm:text-xl text-slate-900">Gantt Chart tổng thể (Top 5 dự án mới cập nhật)</h3>
          <button 
            onClick={() => onNavigateToProjects({ view: 'all-progress' })}
            className="text-blue-600 hover:text-blue-700 font-bold text-sm sm:text-base flex items-center gap-1 transition-colors"
          >
            Xem thêm
          </button>
        </div>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-sm sm:text-base border-collapse">
            <thead>
              <tr className="text-slate-400 text-xs sm:text-base uppercase text-left">
                <th className="pb-4 pr-4 w-fit whitespace-nowrap">Tên dự án / Chủ đầu tư</th>
                <th className="pb-4 pl-4">Tiến độ theo quy trình</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.slice(0, 5).map((p, i) => {
                const process = INITIAL_PROCESSES.find(proc => proc.id === p.processId) || INITIAL_PROCESSES[0];
                
                return (
                  <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors relative hover:z-10">
                    <td className="py-3 sm:py-4 pr-4 w-fit whitespace-nowrap">
                      <div className="flex flex-col max-w-[250px] sm:max-w-[450px]">
                        <span className="font-bold text-slate-900 truncate" title={p.name}>{p.name}</span>
                        <span className="text-xs sm:text-sm text-slate-400 font-medium truncate">{p.investor}</span>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 pl-4">
                      <div className="flex gap-1 h-5 sm:h-7 w-fit">
                        {process.parentSteps.map((stepData, stepIdx) => {
                          let color = 'bg-slate-200'; // chưa bắt đầu
                          
                          // Find current step index in parentSteps
                          const currentStepIdx = process.parentSteps.findIndex(s => s.name === p.parentStep);
                          
                          if (stepIdx < currentStepIdx) {
                            color = 'bg-emerald-500'; // đã xong
                          } else if (stepIdx === currentStepIdx) {
                            color = p.status === 'Delayed' ? 'bg-rose-500' : 'bg-blue-500'; // đang xử lý
                          }
                          
                          if (p.stage === 'Hoàn thành') {
                            color = 'bg-emerald-600';
                          }

                          // Tooltip info logic
                          const childStepIds = stepData.childSteps.map(cs => cs.id);
                          
                          // Check actual dates first, then planned milestones
                          let date = "Chưa xử lý";
                          for (const id of childStepIds) {
                            const actual = p.implementationPlan?.[id]?.agencyActualDate;
                            if (actual) {
                              date = actual;
                              break;
                            }
                            const planned = p.milestones?.[id]?.agency || p.milestones?.[id]?.investor;
                            if (planned) {
                              date = planned;
                              break;
                            }
                          }

                          const agencies = stepData.childSteps.map(cs => cs.agency).filter(Boolean);
                          const agency = agencies.join("; ") || "Đang cập nhật";

                          // Determine status for tooltip coloring
                          let statusType = 'pending';
                          if (stepIdx < currentStepIdx) statusType = 'completed';
                          else if (stepIdx === currentStepIdx) statusType = p.status === 'Delayed' ? 'delayed' : 'processing';
                          if (p.stage === 'Hoàn thành') statusType = 'completed';

                          return (
                            <div 
                              key={stepIdx} 
                              className={`w-6 sm:w-10 h-full rounded-sm sm:rounded-md ${color} cursor-help relative transition-all hover:scale-y-125 hover:z-20 shadow-sm`} 
                              onMouseEnter={() => setHoveredStep({
                                step: stepIdx, 
                                project: p.id, 
                                rowIndex: i, // Track row index to adjust tooltip position
                                info: {
                                  name: stepData.name,
                                  date: date,
                                  agency: agency,
                                  statusType: statusType
                                }
                              })}
                              onMouseLeave={() => setHoveredStep(null)}
                            >
                              {hoveredStep?.step === stepIdx && hoveredStep?.project === p.id && (
                                <div className={`absolute z-[100] bg-slate-900 text-white text-[10px] sm:text-xs p-3 rounded-xl shadow-2xl w-48 sm:w-64 left-1/2 -translate-x-1/2 pointer-events-none border border-white/10 backdrop-blur-md ${
                                  hoveredStep.rowIndex === 0 ? 'top-full mt-2' : '-top-24'
                                }`}>
                                  <div className="space-y-1.5">
                                    <div className="font-black text-blue-400 uppercase tracking-widest border-b border-white/10 pb-1 mb-1">Chi tiết bước</div>
                                    <p><span className="text-slate-400 font-bold">Thủ tục:</span> {hoveredStep.info.name}</p>
                                    <p>
                                      <span className="text-slate-400 font-bold">Ngày xử lý:</span>{' '}
                                      <span className={
                                        hoveredStep.info.statusType === 'delayed' ? 'text-rose-400 font-black' : 
                                        hoveredStep.info.statusType === 'completed' ? 'text-emerald-400 font-black' : 
                                        hoveredStep.info.statusType === 'processing' ? 'text-blue-400 font-black' : ''
                                      }>
                                        {hoveredStep.info.date}
                                        {hoveredStep.info.statusType === 'delayed' && ' (Trễ hạn)'}
                                        {hoveredStep.info.statusType === 'completed' && ' (Hoàn thành)'}
                                      </span>
                                    </p>
                                    <p><span className="text-slate-400 font-bold">Cơ quan:</span> {hoveredStep.info.agency}</p>
                                  </div>
                                  {/* Arrow indicator */}
                                  <div className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent ${
                                    hoveredStep.rowIndex === 0 
                                      ? 'top-0 -translate-y-full border-b-[6px] border-b-slate-900' 
                                      : 'bottom-0 translate-y-full border-t-[6px] border-t-slate-900'
                                  }`} />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
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
          <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-4 sm:mb-6 uppercase tracking-tight">Danh sách các thủ tục đang tồn nhiều</h3>
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

      {/* ADDITIONAL AGENCY STATISTICS SECTIONS FROM USER REQUEST */}
      <div className="space-y-6 sm:space-y-8 pt-8 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight uppercase">THỐNG KÊ CHI TIẾT THEO CƠ QUAN</h2>
        </div>

        {/* Search Box - simplified version of AgencyProjectStats */}
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm nhanh cơ quan, dự án..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Summary Filter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={() => setStatusFilter('all')}
            className={`p-6 rounded-2xl border ${statusFilter === 'all' ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-blue-50 border-blue-100 text-blue-900 shadow-sm hover:border-blue-300'} flex flex-col items-center text-center cursor-pointer transition-all`}
          >
            <span className={`text-4xl font-black tracking-tighter leading-none ${statusFilter === 'all' ? 'text-white' : 'text-blue-700'}`}>{totalFilteredProjects}</span>
            <span className={`text-xs font-black uppercase tracking-widest mt-2 ${statusFilter === 'all' ? 'text-blue-100' : 'text-blue-500'}`}>Tổng dự án</span>
          </motion.div>
          <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={() => setStatusFilter('delayed')}
            className={`p-6 rounded-2xl border ${statusFilter === 'delayed' ? 'bg-rose-600 text-white border-rose-600 shadow-lg' : 'bg-rose-50 border-rose-100 text-rose-900 shadow-sm hover:border-rose-300'} flex flex-col items-center text-center cursor-pointer transition-all`}
          >
            <span className={`text-4xl font-black tracking-tighter leading-none ${statusFilter === 'delayed' ? 'text-white' : 'text-rose-700'}`}>{overdueFilteredProjects}</span>
            <span className={`text-xs font-black uppercase tracking-widest mt-2 ${statusFilter === 'delayed' ? 'text-rose-100' : 'text-rose-500'}`}>Quá hạn</span>
          </motion.div>
          <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={() => setStatusFilter('ontime')}
            className={`p-6 rounded-2xl border ${statusFilter === 'ontime' ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' : 'bg-emerald-50 border-emerald-100 text-emerald-900 shadow-sm hover:border-emerald-300'} flex flex-col items-center text-center cursor-pointer transition-all`}
          >
            <span className={`text-4xl font-black tracking-tighter leading-none ${statusFilter === 'ontime' ? 'text-white' : 'text-emerald-700'}`}>{onTimeFilteredProjects}</span>
            <span className={`text-xs font-black uppercase tracking-widest mt-2 ${statusFilter === 'ontime' ? 'text-emerald-100' : 'text-emerald-500'}`}>Còn hạn</span>
          </motion.div>
        </div>

        {/* Agency Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Cơ quan đang xử lý</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {dynamicAgencies
              .filter(agency => {
                if (statusFilter === 'delayed') return agency.delayedCount > 0;
                if (statusFilter === 'ontime') return (agency.count - agency.delayedCount) > 0;
                return agency.count > 0;
              })
              .map((agency) => {
                const delayedCount = agency.delayedCount;
                const onTimeCount = agency.count - delayedCount;
                
                let displayCount = agency.count;
                if (statusFilter === 'delayed') displayCount = delayedCount;
                if (statusFilter === 'ontime') displayCount = onTimeCount;

                return (
                  <motion.div
                    key={agency.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const filter: any = { agencyName: agency.name };
                      if (statusFilter === 'delayed') filter.status = 'Delayed';
                      if (statusFilter === 'ontime') filter.status = 'On Track';
                      onNavigateToProjects(filter);
                    }}
                    className={`${agency.color} p-4 rounded-2xl flex flex-col justify-between border border-white shadow-sm hover:shadow-md transition-all relative overflow-hidden h-28 cursor-pointer group`}
                  >
                    <div className="relative z-10 flex justify-between items-start gap-3">
                      <p className="text-sm font-bold text-slate-800 leading-tight line-clamp-2 flex-1 group-hover:text-blue-700 transition-colors tooltip" title={agency.name}>{agency.name}</p>
                      <span className={`text-2xl font-black ${agency.iconColor} tracking-tighter leading-none`}>{displayCount}</span>
                    </div>
                    
                    <div className="relative z-10 flex justify-between items-end mt-2">
                      {(statusFilter === 'all' || statusFilter === 'delayed') ? (
                        <div className="flex flex-col items-start">
                          <span className="text-2xl font-black text-rose-600 leading-none">{delayedCount > 0 ? delayedCount : '0'}</span>
                        </div>
                      ) : <div />}
                      {(statusFilter === 'all' || statusFilter === 'ontime') ? (
                        <div className="flex flex-col items-end">
                          <span className="text-2xl font-black text-emerald-600 leading-none">{onTimeCount > 0 ? onTimeCount : '0'}</span>
                        </div>
                      ) : <div />}
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>

        {/* Statistics Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 pb-12">
          {/* Statistics by Process */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Thống kê theo quy trình</h2>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              {getProcessStats()
                .map((process, index) => {
                  return (
                    <div key={process.id} className={index !== 0 ? "pt-4 border-t border-slate-100" : ""}>
                      <p className="text-sm font-bold text-slate-800 leading-tight line-clamp-2 mb-3 min-h-[2.5rem] flex items-center">{process.name}</p>
                      <div className={`grid gap-3 ${statusFilter === 'all' ? 'grid-cols-3' : 'grid-cols-1'}`}>
                        {statusFilter === 'all' && (
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onNavigateToProjects({ processId: process.id })}
                            className="bg-blue-50 hover:bg-blue-100 p-2 rounded-xl border border-blue-100 flex flex-col items-center transition-colors"
                          >
                            <span className="text-2xl font-black text-blue-700 tracking-tighter leading-none">{process.total}</span>
                            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-1">Tổng</span>
                          </motion.button>
                        )}
                        {(statusFilter === 'all' || statusFilter === 'delayed') && (
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onNavigateToProjects({ processId: process.id, status: 'Delayed' })}
                            className="bg-rose-50 hover:bg-rose-100 p-2 rounded-xl border border-rose-100 flex flex-col items-center transition-colors"
                          >
                            <span className="text-2xl font-black text-rose-700 tracking-tighter leading-none">{process.delayed}</span>
                            <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest mt-1">Quá hạn</span>
                          </motion.button>
                        )}
                        {(statusFilter === 'all' || statusFilter === 'ontime') && (
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onNavigateToProjects({ processId: process.id, status: 'On Track' })}
                            className="bg-emerald-50 hover:bg-emerald-100 p-2 rounded-xl border border-emerald-100 flex flex-col items-center transition-colors"
                          >
                            <span className="text-2xl font-black text-emerald-700 tracking-tighter leading-none">{process.ontime}</span>
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">Còn hạn</span>
                          </motion.button>
                        )}
                      </div>
                    </div>
                  );
                })}
              {getProcessStats().length === 0 && (
                <div className="text-center py-4 text-slate-400 font-bold italic">Không có dữ liệu quy trình</div>
              )}
            </div>
          </div>

          {/* Statistics by Stage */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Thống kê theo giai đoạn</h2>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              {projectStages
                .map((stage: string) => {
                  const stageProjects = globalFilteredProjects.filter((p: any) => p.stage === stage || (p as any).stage === stage);
                  return { name: stage, projects: stageProjects };
                })
                .filter((stage: any) => stage.projects.length > 0)
                .map((stage: any, index: number) => {
                  const stageProjects = stage.projects;
                  const delayed = stageProjects.filter((p: any) => p.status === 'Delayed' || p.status === 'Warning').length;
                  const ontime = stageProjects.length - delayed;
                  const total = stageProjects.length;

                  return (
                    <div key={stage.name} className={index !== 0 ? "pt-4 border-t border-slate-100" : ""}>
                      <p className="text-sm font-bold text-slate-800 leading-tight line-clamp-2 mb-3 min-h-[2.5rem] flex items-center">{stage.name}</p>
                      <div className={`grid gap-3 ${statusFilter === 'all' ? 'grid-cols-3' : 'grid-cols-1'}`}>
                        {statusFilter === 'all' && (
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onNavigateToProjects({ stage: stage.name })}
                            className="bg-blue-50 hover:bg-blue-100 p-2 rounded-xl border border-blue-100 flex flex-col items-center transition-colors"
                          >
                            <span className="text-2xl font-black text-blue-700 tracking-tighter leading-none">{total}</span>
                            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-1">Tổng</span>
                          </motion.button>
                        )}
                        {(statusFilter === 'all' || statusFilter === 'delayed') && (
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onNavigateToProjects({ stage: stage.name, status: 'Delayed' })}
                            className="bg-rose-50 hover:bg-rose-100 p-2 rounded-xl border border-rose-100 flex flex-col items-center transition-colors"
                          >
                            <span className="text-2xl font-black text-rose-700 tracking-tighter leading-none">{delayed}</span>
                            <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest mt-1">Quá hạn</span>
                          </motion.button>
                        )}
                        {(statusFilter === 'all' || statusFilter === 'ontime') && (
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onNavigateToProjects({ stage: stage.name, status: 'On Track' })}
                            className="bg-emerald-50 hover:bg-emerald-100 p-2 rounded-xl border border-emerald-100 flex flex-col items-center transition-colors"
                          >
                            <span className="text-2xl font-black text-emerald-700 tracking-tighter leading-none">{ontime}</span>
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">Còn hạn</span>
                          </motion.button>
                        )}
                      </div>
                    </div>
                  );
                })}
              {projectStages.length === 0 && (
                <div className="text-center py-4 text-slate-400 font-bold italic">Không có dữ liệu giai đoạn</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Step Projects */}
      {selectedStepProjects && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h4 className="text-xl font-bold text-slate-900 leading-tight">{selectedStepProjects.step}</h4>
                <p className="text-slate-500 text-sm font-medium mt-1">Danh sách {selectedStepProjects.projects.length} dự án đang ở thủ tục này</p>
              </div>
              <button 
                onClick={() => setSelectedStepProjects(null)}
                className="p-2 hover:bg-slate-200 rounded-xl text-slate-500 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedStepProjects.projects.map((p: any) => (
                <div 
                  key={p.id} 
                  className="group p-4 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-2xl transition-all cursor-pointer"
                  onClick={() => handleNavigateToProjectDetail(p)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h5 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2">{p.name}</h5>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 font-medium">
                        <div className="flex items-center gap-1">
                          <MapPin size={12} className="text-slate-400" />
                          <span>{p.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Building2 size={12} className="text-slate-400" />
                          <span>{p.investor}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertCircle size={12} className="text-slate-400" />
                          <span>{p.currentAgency}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={12} className="text-slate-400" />
                          <span className="font-bold text-blue-600">Hạn: {formatDate(p.stepDeadline || p.deadline)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 p-2 text-slate-300 group-hover:text-blue-500 transition-colors">
                      <ExternalLink size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button 
                onClick={() => {
                  onNavigateToProjects({ step: selectedStepProjects.step });
                  setSelectedStepProjects(null);
                }}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
              >
                Xem tất cả trong danh sách
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
