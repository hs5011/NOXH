import React, { useState, useEffect } from 'react';
import { 
  Building2, AlertCircle, CheckCircle2, Clock, 
  Search, MapPin, TrendingUp, X, ExternalLink,
  Layers, Building
} from 'lucide-react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PROJECT_REGIONS } from '../constants';
import { INITIAL_PROCESSES } from '../data/appData';

export default function DashboardView({ 
  projects: initialProjects = [], 
  onNavigateToProjects, 
  onProjectClick, 
  processingAgencies = [], 
  projectStages = [], 
  currentUser,
  onSeeProjects 
}: any) {
  const [projects, setProjects] = useState<any[]>(initialProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'delayed' | 'ontime'>('all');
  const [statsCategory, setStatsCategory] = useState<'stage' | 'group'>('stage');

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

  // TPHCM Stats Logic
  const statsGroups = (() => {
    const isChutruongDone = (p: any) => p.chutruong_nn_date === 'X' || p.chutruong_cdt_date === 'X';
    const isLicensed = (p: any) => p.gpxaydung_nn_date === 'X' || p.gpxaydung_cdt_date === 'X';

    const completed = projects.filter(p => p.stage === 'Hoàn thành' || p.progress === 100);
    const licensed = projects.filter(p => p.stage === 'CHUẨN BỊ ĐẦU TƯ' && isLicensed(p));
    const approved = projects.filter(p => p.stage === 'CHUẨN BỊ ĐẦU TƯ' && isChutruongDone(p) && !isLicensed(p));
    const preparing = projects.filter(p => p.stage === 'CHUẨN BỊ ĐẦU TƯ' && !isChutruongDone(p));
    const announced = projects.filter(p => p.stage === 'THỰC HIỆN ĐẦU TƯ');

    const groups: Record<string, any[]> = {};
    projects.forEach(p => {
      const g = p.projectGroup || 'Khác';
      if (!groups[g]) groups[g] = [];
      groups[g].push(p);
    });

    return { completed, licensed, approved, preparing, announced, byGroup: groups };
  })();

  const stats = (() => {
    const { completed, licensed, approved, preparing, announced } = statsGroups;
    const sumUnits = (list: any[]) => list.reduce((acc, p) => acc + (Number(p.apartmentCount) || 0), 0);
    const sumArea = (list: any[]) => list.reduce((acc, p) => acc + (Number(p.totalArea) || 0), 0);

    return {
      preparing: { projects: preparing.length, units: sumUnits(preparing), area: sumArea(preparing) },
      approved: { projects: approved.length, units: sumUnits(approved), area: sumArea(approved) },
      licensed: { projects: licensed.length, units: sumUnits(licensed), area: sumArea(licensed) },
      announced: { projects: announced.length, units: sumUnits(announced), area: sumArea(announced) },
      completed: { projects: completed.length, units: sumUnits(completed), area: sumArea(completed) },
      total: { projects: projects.length, units: sumUnits(projects), area: sumArea(projects) }
    };
  })();

  const handleShowProjects = (title: string, list: any[]) => {
    if (onSeeProjects) {
      onSeeProjects(title, list);
    } else {
      onNavigateToProjects({ ids: list.map(p => p.id) });
    }
  };

  const formatNum = (num: number) => num === undefined ? '0' : new Intl.NumberFormat('vi-VN').format(Math.floor(num));
  const formatArea = (num: number) => num === undefined ? '0' : new Intl.NumberFormat('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
  
  const completionRate = stats.total.projects > 0 ? (stats.completed.projects / stats.total.projects) * 100 : 0;
  const licensedRate = stats.total.projects > 0 ? (stats.licensed.projects / stats.total.projects) * 100 : 0;

  const totalFilteredProjects = globalFilteredProjects.length;

  const showInvestorStat = !currentUser || currentUser.roleId === 'Admin' || (currentUser.userType === 'agency' && currentUser.agencyId === '1') || currentUser.userType === 'investor';

  const dynamicAgencies = [
    ...[...processingAgencies].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)).map(a => {
      const agencyProjects = globalFilteredProjects.filter(p => p.currentAgency === a.name);
      return {
        ...a,
        count: agencyProjects.length,
        delayedCount: agencyProjects.filter(p => p.status === 'Delayed' || p.status === 'Warning').length,
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
        iconColor: 'text-emerald-500'
      }
    ] : [])
  ];

  const agencyData = processingAgencies.map((agency: any) => ({
    name: agency.name,
    value: projects.filter(p => p.currentAgency === agency.name).length
  })).filter((d: any) => d.value > 0).sort((a: any, b: any) => b.value - a.value);

  const regionData = PROJECT_REGIONS.map(region => ({
    name: region,
    value: projects.filter(p => p.location && p.location.includes(region)).length
  }));

  const handleRegionClick = (data: any) => {
    onNavigateToProjects({ region: data.name });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto pb-24 -m-4 sm:-m-8">
      {/* Header section from TPHCM */}
      <div className="bg-[#1e40af] text-white p-6 pb-12 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase">Tổng quan Điều hành</h1>
            <p className="text-blue-100/60 text-[11px] font-black tracking-[0.2em] uppercase">Hệ thống theo dõi dự án Nhà ở xã hội TP.HCM</p>
          </div>
        </div>
      </div>

      <div className="flex-1 -mt-8 px-4 sm:px-8">
        <div className="max-w-[1600px] mx-auto space-y-6">
          
          {/* Top Row: Main Status Cards from TPHCM */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* 1. Total NOXH */}
            <div 
              onClick={() => handleShowProjects("Tất cả dự án NOXH", projects)}
              className="bg-emerald-800 rounded-2xl shadow-lg shadow-emerald-200/50 p-4 flex flex-col text-white relative overflow-hidden group cursor-pointer hover:bg-emerald-900 transition-colors h-full"
            >
              <div className="absolute right-2 bottom-2 text-white/5 group-hover:scale-125 transition-transform">
                <Building2 size={80} strokeWidth={1} />
              </div>
              <div className="relative z-10 text-center flex flex-col h-full justify-center">
                <h4 className="text-[12px] font-black uppercase tracking-widest mb-1">Tổng dự án NOXH</h4>
                <div className="h-px bg-white/20 w-full my-2"></div>
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black leading-none">{formatNum(stats.total.projects)}</span>
                    <span className="text-[11px] font-bold opacity-70 uppercase">dự án</span>
                  </div>
                  <div className="w-full flex flex-col gap-1.5 px-4 py-2 bg-white/10 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-100 uppercase">Quy mô</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black leading-none">{formatNum(stats.total.units)}</span>
                        <span className="text-[10px] font-bold opacity-70 uppercase">căn</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/10 pt-1.5">
                      <span className="text-[10px] font-bold text-emerald-100 uppercase">Quỹ đất</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black leading-none">{formatArea(stats.total.area)}</span>
                        <span className="text-[10px] font-bold opacity-70 uppercase">ha</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Preparing */}
            <div 
              onClick={() => handleShowProjects("Dự án đang chuẩn bị hồ sơ", statsGroups.preparing)}
              className="bg-emerald-50 border border-emerald-100 rounded-2xl shadow-sm p-4 flex flex-col relative overflow-hidden group cursor-pointer hover:border-emerald-300 transition-colors h-full"
            >
              <div className="absolute right-2 bottom-2 text-emerald-200/50 group-hover:scale-125 transition-transform">
                <MapPin size={80} strokeWidth={1} />
              </div>
              <div className="relative z-10 text-center flex flex-col h-full justify-center">
                <h4 className="text-[12px] font-black text-emerald-900 uppercase tracking-widest mb-1">Đang chuẩn bị hồ sơ</h4>
                <div className="h-px bg-emerald-200/50 w-full my-2"></div>
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-emerald-700 leading-none">{formatNum(stats.preparing.projects)}</span>
                    <span className="text-[11px] font-bold text-emerald-600 uppercase">dự án</span>
                  </div>
                  <div className="w-full flex flex-col gap-1.5 px-4 py-2 bg-white rounded-xl border border-emerald-100 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-500 uppercase">Quy mô</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-emerald-700 leading-none">{formatNum(stats.preparing.units)}</span>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase">căn</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-emerald-50 pt-1.5">
                      <span className="text-[10px] font-bold text-emerald-500 uppercase">Quỹ đất</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-emerald-700 leading-none">{formatArea(stats.preparing.area)}</span>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase">ha</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Approved */}
            <div 
              onClick={() => handleShowProjects("Dự án Chuẩn bị đầu tư (Chấp thuận CTĐT)", statsGroups.approved)}
              className="bg-blue-50 border border-blue-100 rounded-2xl shadow-sm p-4 flex flex-col relative overflow-hidden group cursor-pointer hover:border-blue-300 transition-colors h-full"
            >
              <div className="absolute right-2 bottom-2 text-blue-200/50 group-hover:scale-125 transition-transform">
                <TrendingUp size={80} strokeWidth={1} />
              </div>
              <div className="relative z-10 text-center flex flex-col h-full justify-center">
                <h4 className="text-[11px] font-black text-blue-900 uppercase tracking-widest mb-1 leading-tight">Chấp thuận chủ trương ĐT</h4>
                <div className="h-px bg-blue-200/50 w-full my-2"></div>
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-blue-700 leading-none">{formatNum(stats.approved.projects)}</span>
                    <span className="text-[11px] font-bold text-blue-600 uppercase">dự án</span>
                  </div>
                  <div className="w-full flex flex-col gap-1.5 px-4 py-2 bg-white rounded-xl border border-blue-100 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-blue-500 uppercase">Quy mô</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-blue-700 leading-none">{formatNum(stats.approved.units)}</span>
                        <span className="text-[10px] font-bold text-blue-600 uppercase">căn</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-blue-50 pt-1.5">
                      <span className="text-[10px] font-bold text-blue-500 uppercase">Quỹ đất</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-blue-700 leading-none">{formatArea(stats.approved.area)}</span>
                        <span className="text-[10px] font-bold text-blue-600 uppercase">ha</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Licensed */}
            <div 
              onClick={() => handleShowProjects("Dự án được cấp phép xây dựng", statsGroups.licensed)}
              className="bg-sky-50 border border-sky-100 rounded-2xl shadow-sm p-4 flex flex-col relative overflow-hidden group cursor-pointer hover:border-sky-300 transition-colors h-full"
            >
              <div className="absolute right-2 bottom-2 text-sky-200/50 group-hover:scale-125 transition-transform">
                <Layers size={80} strokeWidth={1} />
              </div>
              <div className="relative z-10 text-center flex flex-col h-full justify-center">
                <h4 className="text-[11px] font-black text-sky-900 uppercase tracking-widest mb-1 leading-tight">Được cấp phép xây dựng</h4>
                <div className="h-px bg-sky-200/50 w-full my-2"></div>
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-sky-700 leading-none">{formatNum(stats.licensed.projects)}</span>
                    <span className="text-[11px] font-bold text-sky-600 uppercase">dự án</span>
                  </div>
                  <div className="w-full flex flex-col gap-1.5 px-4 py-2 bg-white rounded-xl border border-sky-100 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-sky-500 uppercase">Quy mô</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-sky-700 leading-none">{formatNum(stats.licensed.units)}</span>
                        <span className="text-[10px] font-bold text-sky-600 uppercase">căn</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-sky-50 pt-1.5">
                      <span className="text-[10px] font-bold text-sky-500 uppercase">Quỹ đất</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-sky-700 leading-none">{formatArea(stats.licensed.area)}</span>
                        <span className="text-[10px] font-bold text-sky-600 uppercase">ha</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Completed */}
            <div 
              onClick={() => handleShowProjects("Dự án Đã hoàn thành", statsGroups.completed)}
              className="bg-amber-50 border border-amber-100 rounded-2xl shadow-sm p-4 flex flex-col relative overflow-hidden group cursor-pointer hover:border-amber-300 transition-colors h-full"
            >
              <div className="absolute right-2 bottom-2 text-amber-200/50 group-hover:scale-125 transition-transform">
                <Building size={80} strokeWidth={1} />
              </div>
              <div className="relative z-10 text-center flex flex-col h-full justify-center">
                <h4 className="text-[11px] font-black text-amber-900 uppercase tracking-widest mb-1 leading-tight">Hoàn thành, một phần</h4>
                <div className="h-px bg-amber-200/50 w-full my-2"></div>
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-amber-700 leading-none">{formatNum(stats.completed.projects)}</span>
                    <span className="text-[11px] font-bold text-amber-600 uppercase">dự án</span>
                  </div>
                  <div className="w-full flex flex-col gap-1.5 px-4 py-2 bg-white rounded-xl border border-amber-100 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-500 uppercase">Quy mô</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-amber-700 leading-none">{formatNum(stats.completed.units)}</span>
                        <span className="text-[10px] font-bold text-amber-600 uppercase">căn</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-amber-50 pt-1.5">
                      <span className="text-[10px] font-bold text-amber-500 uppercase">Quỹ đất</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-amber-700 leading-none">{formatArea(stats.completed.area)}</span>
                        <span className="text-[10px] font-bold text-amber-600 uppercase">ha</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Row: Rates and Progress Classification (TPHCM style) */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* 1. Tỷ lệ cluster (Left) */}
            <div className="flex flex-col gap-4">
              <div 
                onClick={() => handleShowProjects("Dự án đã hoàn thành", statsGroups.completed)}
                className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm flex items-center gap-4 transition-all hover:shadow-md hover:border-blue-200 cursor-pointer group"
              >
                <div className="relative w-16 h-16 shrink-0">
                  <PieChart width={64} height={64}>
                    <Pie
                      data={[
                        { value: completionRate, fill: '#3b82f6' },
                        { value: 100 - completionRate, fill: '#f1f5f9' }
                      ]}
                      cx="50%" cy="50%" innerRadius={22} outerRadius={30} paddingAngle={0} dataKey="value" startAngle={90} endAngle={-270}
                    />
                  </PieChart>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-blue-600">
                    {completionRate.toFixed(1)}%
                  </div>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tỷ lệ hoàn thành</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{completionRate.toFixed(2)}%</span>
                    <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">({stats.completed.projects}/{stats.total.projects} dự án)</span>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => handleShowProjects("Dự án được cấp phép xây dựng", statsGroups.licensed)}
                className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm flex items-center gap-4 transition-all hover:shadow-md hover:border-orange-200 text-left cursor-pointer group"
              >
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <Layers size={28} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tỷ lệ xây dựng</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-slate-800 leading-tight group-hover:text-orange-600 transition-colors">{licensedRate.toFixed(2)}%</span>
                    <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">({stats.licensed.projects}/{stats.total.projects} dự án)</span>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => handleShowProjects("Dự án đang chuẩn bị hồ sơ", statsGroups.preparing)}
                className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm flex items-center gap-4 transition-all hover:shadow-md hover:border-slate-300 text-left cursor-pointer group"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-slate-500 group-hover:text-white transition-all">
                  <Clock size={28} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Đang chuẩn bị hồ sơ</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-slate-800 leading-tight group-hover:text-slate-500 transition-colors">{(stats.preparing.projects / stats.total.projects * 100).toFixed(2)}%</span>
                    <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">({stats.preparing.projects}/{stats.total.projects} dự án)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. THỐNG KÊ CHI TIẾT - Pie Chart */}
            <div className="lg:col-span-3 bg-white rounded-[32px] border border-slate-100 shadow-sm flex flex-col overflow-hidden h-full">
              <div className="px-8 py-5 flex items-center justify-between border-b border-slate-50 shrink-0">
                <div className="flex flex-col">
                  <span className="text-[12px] font-black text-slate-500 uppercase tracking-[0.2em]">Thống kê dự án</span>
                  <div className="flex gap-4 mt-2">
                    <button 
                      onClick={() => setStatsCategory('stage')}
                      className={`text-[10px] font-bold uppercase tracking-wider pb-1 border-b-2 transition-all ${statsCategory === 'stage' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                      Theo tiến độ
                    </button>
                    <button 
                      onClick={() => setStatsCategory('group')}
                      className={`text-[10px] font-bold uppercase tracking-wider pb-1 border-b-2 transition-all ${statsCategory === 'group' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                      Theo nhóm
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
                </div>
              </div>
              
              <div className="flex-1 p-8 flex flex-col md:flex-row items-center justify-center gap-10">
                <div className="w-full md:w-1/2 h-[260px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statsCategory === 'stage' ? [
                          { name: 'Hoàn thành', value: stats.completed.projects, color: '#10b981' },
                          { name: 'Đã công bố', value: stats.announced.projects, color: '#059669' },
                          { name: 'Đã cấp phép', value: stats.licensed.projects, color: '#ea580c' },
                          { name: 'Chấp thuận CT', value: stats.approved.projects, color: '#2563eb' },
                          { name: 'Đang chuẩn bị', value: stats.preparing.projects, color: '#64748b' }
                        ].filter(d => d.value > 0) : Object.entries(statsGroups.byGroup).map(([name, list], index) => ({
                          name,
                          value: list.length,
                          color: index === 0 ? '#10b981' : index === 1 ? '#ea580c' : index === 2 ? '#2563eb' : '#64748b'
                        }))}
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {(statsCategory === 'stage' ? [
                          '#10b981', '#059669', '#ea580c', '#2563eb', '#64748b'
                        ] : Object.entries(statsGroups.byGroup).map((_, index) => 
                          index === 0 ? '#10b981' : index === 1 ? '#ea580c' : index === 2 ? '#2563eb' : '#64748b'
                        )).map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        itemStyle={{ fontWeight: '800', fontSize: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-slate-800 leading-none">{stats.total.projects}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Dự án</span>
                  </div>
                </div>
                
                <div className="flex-1 w-full flex flex-col gap-2 overflow-y-auto max-h-[300px] pr-2">
                  {(statsCategory === 'stage' ? [
                    { label: 'Hoàn thành', count: stats.completed.projects, rate: (stats.completed.projects / stats.total.projects) * 100, color: 'bg-emerald-500', group: statsGroups.completed },
                    { label: 'Đã công bố', count: stats.announced.projects, rate: (stats.announced.projects / stats.total.projects) * 100, color: 'bg-emerald-600', group: statsGroups.announced },
                    { label: 'Đã cấp phép', count: stats.licensed.projects, rate: (stats.licensed.projects / stats.total.projects) * 100, color: 'bg-orange-600', group: statsGroups.licensed },
                    { label: 'Chấp thuận CT', count: stats.approved.projects, rate: (stats.approved.projects / stats.total.projects) * 100, color: 'bg-blue-600', group: statsGroups.approved },
                    { label: 'Đang chuẩn bị', count: stats.preparing.projects, rate: (stats.preparing.projects / stats.total.projects) * 100, color: 'bg-slate-500', group: statsGroups.preparing }
                  ] : Object.entries(statsGroups.byGroup).map(([name, list], index) => ({
                    label: name,
                    count: list.length,
                    rate: stats.total.projects > 0 ? (list.length / stats.total.projects) * 100 : 0,
                    color: index === 0 ? 'bg-emerald-500' : index === 1 ? 'bg-orange-600' : index === 2 ? 'bg-blue-600' : 'bg-slate-500',
                    group: list
                  }))).filter(item => item.count > 0 || statsCategory !== 'stage').map((item, idx) => (
                    <div 
                      key={idx}
                      onClick={() => handleShowProjects(item.label, item.group)}
                      className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-100 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-3 h-3 rounded-full shrink-0 ${item.color}`}></div>
                        <span className="text-[13px] font-black text-slate-600 uppercase tracking-tight truncate">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-6 shrink-0">
                        <div className="text-right">
                          <span className="text-lg font-black text-slate-800">{item.count}</span>
                          <span className="text-[10px] font-bold text-slate-400 ml-1">DA</span>
                        </div>
                        <div className="w-12 text-right">
                          <span className="text-[13px] font-black text-slate-400">{item.rate.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Grid: Original Dashboard stats */}
          <div className="space-y-6 sm:space-y-8 pt-8 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight uppercase">THỐNG KÊ CHI TIẾT THEO CƠ QUAN</h2>
            </div>

            {/* Search Box */}
            <div className="relative z-30">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm nhanh dự án (Tên dự án, mã dự án)..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full text-slate-400"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {searchTerm && globalFilteredProjects.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto overflow-x-hidden">
                  <div className="p-2 border-b border-slate-50 bg-slate-50/50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3">Kết quả tìm thấy ({globalFilteredProjects.length})</p>
                  </div>
                  {globalFilteredProjects.map((p) => (
                    <div 
                      key={p.id}
                      onClick={() => onProjectClick(p)}
                      className="p-4 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-sm transition-all">
                          <Building size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 line-clamp-1 group-hover:text-blue-700">{p.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{p.code}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className="text-[10px] font-bold text-blue-600 uppercase italic">{p.stage}</span>
                          </div>
                        </div>
                      </div>
                      <ExternalLink size={16} className="text-slate-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  ))}
                </div>
              )}
              {searchTerm && globalFilteredProjects.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-8 text-center">
                  <Search size={32} className="mx-auto text-slate-200 mb-2" />
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Không tìm thấy dự án nào</p>
                </div>
              )}
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
                          <p className="text-sm font-bold text-slate-800 leading-tight line-clamp-2 flex-1 group-hover:text-blue-700 transition-colors" title={agency.name}>{agency.name}</p>
                          <span className={`text-2xl font-black ${agency.iconColor} tracking-tighter leading-none`}>{displayCount}</span>
                        </div>
                        
                        <div className="relative z-10 flex justify-between items-end mt-2">
                          <div className="flex flex-col items-start">
                            <span className="text-xs font-bold text-rose-500 uppercase">Trễ:</span>
                            <span className="text-lg font-black text-rose-600 leading-none">{delayedCount > 0 ? delayedCount : '0'}</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-emerald-500 uppercase">Hạn:</span>
                            <span className="text-lg font-black text-emerald-600 leading-none">{onTimeCount > 0 ? onTimeCount : '0'}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </div>

            {/* Region & Process Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-lg text-slate-900 mb-4 uppercase tracking-tight">Thống kê theo cơ quan (Biểu đồ)</h3>
                <div className="h-[300px]">
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
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-lg text-slate-900 mb-4 uppercase tracking-tight">Thống kê theo khu vực</h3>
                <div className="h-[300px]">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
