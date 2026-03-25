import React, { useState, useEffect } from 'react';
import { 
  Building2, ChevronRight, ChevronLeft, 
  AlertCircle, Clock, FileText, LayoutDashboard, 
  MapPin, User, Search, Bell, Menu,
  CheckCircle2, TrendingUp, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PROJECT_REGIONS } from '../constants';

// --- Types ---
interface Agency {
  id: string;
  name: string;
  count: number;
  subtext: string;
  color: string;
  iconColor: string;
}

interface Department {
  id: string;
  name: string;
  projectCount: number;
  delayedCount: number;
}

interface Project {
  id: string;
  code: string;
  name: string;
  investor: string;
  location: string;
  progress: number;
  status: string;
  currentStep: string;
  currentAgency: string;
  currentDepartment?: string;
  deadline: string;
  stage: string;
  delayDays?: number;
}

// --- Mock Data ---
import { Agency as AgencyType } from './AgencyManagement';

interface DashboardAppProps {
  processingAgencies?: AgencyType[];
}

export default function DashboardApp({ processingAgencies = [] }: DashboardAppProps) {
  const [view, setView] = useState<'overview' | 'departments' | 'projects' | 'detail'>('overview');
  const [selectedAgency, setSelectedAgency] = useState<any | null>(null);
  const [selectedDept, setSelectedDept] = useState<any | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Summary Stats
  const totalProjects = projects.length;
  const overdueProjects = projects.filter(p => p.status === 'Delayed').length;
  const onTimeProjects = totalProjects - overdueProjects;

  useEffect(() => {
    fetch('/api/v1/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      });
  }, []);

  const dynamicAgencies = [
    {
      id: 'investor-stat',
      name: 'Chủ đầu tư',
      count: projects.filter(p => p.currentAgency === 'Chủ đầu tư').length,
      subtext: 'dự án đang xử lý',
      color: projects.filter(p => p.currentAgency === 'Chủ đầu tư' && (p.status === 'Delayed' || p.status === 'Warning')).length > 0 ? 'bg-emerald-50' : 'bg-emerald-50',
      iconColor: projects.filter(p => p.currentAgency === 'Chủ đầu tư' && (p.status === 'Delayed' || p.status === 'Warning')).length > 0 ? 'text-emerald-500' : 'text-emerald-500',
      departments: []
    },
    ...processingAgencies.map(a => {
      const count = projects.filter(p => p.currentAgency === a.name).length;
      const delayedCount = projects.filter(p => p.currentAgency === a.name && (p.status === 'Delayed' || p.status === 'Warning')).length;
      return {
        ...a,
        count,
        subtext: 'dự án đang xử lý',
        color: delayedCount > 0 ? 'bg-amber-50' : 'bg-emerald-50',
        iconColor: delayedCount > 0 ? 'text-amber-500' : 'text-emerald-500'
      };
    })
  ];

  const dynamicDepartments = selectedAgency ? selectedAgency.departments.map((deptName: string, index: number) => {
    const projectCount = projects.filter(p => p.currentAgency === selectedAgency.name && p.currentDepartment === deptName).length;
    const delayedCount = projects.filter(p => p.currentAgency === selectedAgency.name && p.currentDepartment === deptName && (p.status === 'Delayed' || p.status === 'Warning')).length;
    return {
      id: `${selectedAgency.id}-${index}`,
      name: deptName,
      projectCount,
      delayedCount
    };
  }) : [];

  const handleAgencyClick = (agency: any) => {
    setSelectedAgency(agency);
    if (agency.departments && agency.departments.length > 0) {
      setView('departments');
    } else {
      setView('projects');
    }
  };

  const handleDeptClick = (dept: any) => {
    setSelectedDept(dept);
    setView('projects');
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setView('detail');
  };

  const goBack = () => {
    if (view === 'detail') setView('projects');
    else if (view === 'projects') {
      if (selectedAgency?.departments?.length > 0 && selectedDept) {
        setView('departments');
        setSelectedDept(null);
      } else {
        setView('overview');
        setSelectedAgency(null);
      }
    }
    else if (view === 'departments') {
      setView('overview');
      setSelectedAgency(null);
    }
  };

  // --- Views ---

  const Overview = () => (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="bg-[#1e40af] text-white p-6 pb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <h1 className="text-2xl font-black tracking-tight uppercase">SỞ XÂY DỰNG TP.HCM</h1>
          <div className="flex items-center gap-2 mt-2 text-blue-100/80 text-sm font-bold tracking-widest uppercase">
            HỆ THỐNG THEO DÕI DỰ ÁN NOXH
            <ChevronRight size={16} className="text-blue-300" />
            <ChevronRight size={16} className="text-blue-300 -ml-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 -mt-8 bg-white rounded-t-[32px] p-6 shadow-2xl relative z-20 overflow-y-auto pb-24">
        {/* Summary Statistics */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100 flex flex-col items-center text-center">
            <span className="text-2xl font-black text-blue-700 tracking-tighter">{totalProjects}</span>
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">Tổng dự án</span>
          </div>
          <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 flex flex-col items-center text-center">
            <span className="text-2xl font-black text-emerald-700 tracking-tighter">{onTimeProjects}</span>
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1">Còn hạn</span>
          </div>
          <div className="bg-rose-50 p-3 rounded-2xl border border-rose-100 flex flex-col items-center text-center">
            <span className="text-2xl font-black text-rose-700 tracking-tighter">{overdueProjects}</span>
            <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest mt-1">Trễ hạn</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Cơ quan đang xử lý</h2>
        </div>

        {/* Grid of Agencies */}
        <div className="grid grid-cols-2 gap-4">
          {dynamicAgencies.map((agency) => (
            <motion.button
              key={agency.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAgencyClick(agency)}
              className={`${agency.color} p-4 rounded-2xl flex flex-col items-start text-left border border-white shadow-sm relative overflow-hidden group h-28`}
            >
              <div className="flex justify-between w-full items-start mb-2">
                <span className="text-3xl font-black text-slate-800 tracking-tighter">{agency.count}</span>
                <div className={`${agency.iconColor} bg-white/80 p-1.5 rounded-xl shadow-sm`}>
                  <FileText size={24} />
                </div>
              </div>
              <p className="text-base font-black text-slate-800 leading-tight line-clamp-2">{agency.name}</p>
              <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-tighter">{agency.subtext}</p>
            </motion.button>
          ))}
        </div>

        {/* Projects to watch */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Dự án cần theo dõi</h2>
            <ChevronRight size={24} className="text-slate-400" />
          </div>
          <div className="space-y-3">
            {projects.filter(p => p.status === 'Warning' || p.status === 'Delayed').slice(0, 3).map((p) => (
              <div key={p.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${p.status === 'Delayed' ? 'bg-rose-100 text-rose-500' : 'bg-amber-100 text-amber-500'}`}>
                  {p.status === 'Delayed' ? <AlertCircle size={24} /> : <Clock size={24} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-black text-slate-800 truncate">{p.name}</p>
                  <p className="text-xs text-slate-500 font-bold uppercase">{p.currentAgency}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-slate-800">{p.currentStep}</p>
                  <p className={`text-xs font-black uppercase ${p.status === 'Delayed' ? 'text-rose-500' : 'text-amber-500'}`}>
                    {p.status === 'Delayed' ? 'trễ 8 ngày' : 'sắp trễ'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Progress Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Tiến độ dự án</h2>
            <ChevronRight size={24} className="text-slate-400" />
          </div>
          <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm space-y-5">
            {projects.slice(0, 3).map((p, i) => (
              <div key={p.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-800 truncate max-w-[140px]">{p.name}</span>
                    <span className={`text-xs font-bold ${i === 0 ? 'text-rose-500' : i === 1 ? 'text-amber-500' : 'text-slate-400'}`}>
                      {i === 0 ? 'Trễ 3 ngày' : i === 1 ? 'Sắp trễ' : 'Đúng hạn'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 h-2.5">
                  {[...Array(5)].map((_, step) => {
                    let color = 'bg-slate-100';
                    const progressStep = Math.floor((p.progress / 100) * 5);
                    if (step < progressStep) color = 'bg-blue-400';
                    else if (step === progressStep) color = i === 0 ? 'bg-rose-400' : 'bg-blue-200';
                    return <div key={step} className={`flex-1 rounded-full ${color}`} />;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agency Gantt Chart */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Sơ đồ Gantt cơ quan</h2>
            <ChevronRight size={24} className="text-slate-400" />
          </div>
          <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="space-y-4">
              {dynamicAgencies.slice(0, 4).map((agency, i) => (
                <div key={agency.id} className="flex items-center gap-3">
                  <div className="w-24 shrink-0">
                    <p className="text-xs font-black text-slate-800 truncate uppercase">{agency.name}</p>
                  </div>
                  <div className="flex-1 h-3 bg-slate-50 rounded-full relative overflow-hidden">
                    <div 
                      className={`absolute h-full rounded-full ${i % 2 === 0 ? 'bg-rose-400' : 'bg-emerald-400'}`} 
                      style={{ left: `${i * 15}%`, width: `${40 + i * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 pt-4 border-t border-slate-50">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-rose-400" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Trễ hạn</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Còn hạn</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-slate-200" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Chưa đến</span>
              </div>
            </div>
          </div>
        </div>

        {/* Region Statistics Chart */}
        <div className="mt-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Thống kê theo khu vực</h2>
            <ChevronRight size={24} className="text-slate-400" />
          </div>
          <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm">
            <div className="h-48 flex items-end gap-4 px-2">
              {PROJECT_REGIONS.map((region) => {
                const count = projects.filter(p => p.location && p.location.includes(region)).length;
                const maxCount = Math.max(...PROJECT_REGIONS.map(r => projects.filter(p => p.location && p.location.includes(r)).length), 1);
                const height = (count / maxCount) * 100;
                
                return (
                  <div key={region} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full relative group">
                      <div 
                        className="w-full bg-emerald-500 rounded-t-lg transition-all duration-500" 
                        style={{ height: `${height}%`, minHeight: count > 0 ? '4px' : '0' }}
                      />
                      {count > 0 && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-black text-slate-800">
                          {count}
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-500 text-center leading-tight uppercase">
                      {region === 'Bà Rịa - Vũng Tàu' ? 'Vũng Tàu' : region}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const DepartmentStats = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-[#1e40af] text-white p-6 pb-12 flex items-center gap-4">
        <button onClick={goBack} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase">{selectedAgency?.name}</h1>
          <p className="text-blue-100/60 text-xs font-bold tracking-widest uppercase">Thống kê theo phòng ban</p>
        </div>
      </div>

      <div className="flex-1 -mt-8 bg-white rounded-t-[32px] p-6 shadow-2xl overflow-y-auto">
        <div className="grid gap-4">
          {dynamicDepartments.map((dept: any) => (
            <motion.button
              key={dept.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDeptClick(dept)}
              className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black text-2xl">
                  {dept.projectCount}
                </div>
                <div className="text-left">
                  <p className="text-base font-bold text-slate-800">{dept.name}</p>
                  <p className="text-xs text-slate-500 font-medium">Tổng số {dept.projectCount} dự án</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {dept.delayedCount > 0 && (
                  <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-1 rounded-lg">
                    {dept.delayedCount} trễ
                  </span>
                )}
                <ChevronRight size={24} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );

  const ProjectList = () => {
    const filteredProjects = projects.filter(p => {
      if (selectedDept) {
        return p.currentAgency === selectedAgency?.name && p.currentDepartment === selectedDept.name;
      }
      return p.currentAgency === selectedAgency?.name;
    });
    
    return (
      <div className="flex flex-col h-full bg-slate-50">
        <div className="bg-[#1e40af] text-white p-6 pb-12 flex items-center gap-4">
          <button onClick={goBack} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase">{selectedDept?.name || selectedAgency?.name}</h1>
            <p className="text-blue-100/60 text-xs font-bold tracking-widest uppercase">Danh sách dự án</p>
          </div>
        </div>

        <div className="flex-1 -mt-8 bg-white rounded-t-[32px] p-6 shadow-2xl overflow-y-auto">
          <div className="space-y-4">
            {filteredProjects.length > 0 ? filteredProjects.map((p) => (
              <motion.button
                key={p.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleProjectClick(p)}
                className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3 text-left"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-black text-slate-800 line-clamp-2 leading-tight">{p.name}</p>
                    <p className="text-xs text-slate-400 font-mono mt-1">{p.code}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase ${p.status === 'Delayed' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {p.status === 'Delayed' ? 'Trễ hạn' : 'Đúng hạn'}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-1">
                    <Building2 size={14} />
                    <span className="truncate max-w-[120px]">{p.investor}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{p.deadline}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${p.progress}%` }} />
                  </div>
                  <span className="text-xs font-black text-slate-400">{p.progress}%</span>
                </div>
              </motion.button>
            )) : (
              <div className="text-center py-12 text-slate-400 italic text-sm">
                Không có dự án nào đang xử lý tại đây...
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ProjectDetail = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-[#1e40af] text-white p-6 pb-12 flex items-center gap-4">
        <button onClick={goBack} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase">CHI TIẾT DỰ ÁN</h1>
          <p className="text-blue-100/60 text-xs font-bold tracking-widest uppercase">{selectedProject?.code}</p>
        </div>
      </div>

      <div className="flex-1 -mt-8 bg-white rounded-t-[32px] p-6 shadow-2xl overflow-y-auto">
        <div className="space-y-6">
          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Thông tin chung</h3>
            <div className="bg-slate-50 p-4 rounded-2xl space-y-4">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Tên dự án</p>
                <p className="text-base font-bold text-slate-800 mt-1">{selectedProject?.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Chủ đầu tư</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">{selectedProject?.investor}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Địa điểm</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">{selectedProject?.location}</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Tiến độ thực hiện</h3>
            <div className="bg-slate-50 p-4 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-slate-800">Hoàn thành {selectedProject?.progress}%</p>
                <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-lg uppercase">
                  {selectedProject?.stage}
                </span>
              </div>
              <div className="h-4 bg-white rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-blue-500" style={{ width: `${selectedProject?.progress}%` }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-bold uppercase">Bước hiện tại</p>
                  <p className="text-sm font-black text-blue-600 mt-1">{selectedProject?.currentStep}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-bold uppercase">Hạn chót</p>
                  <p className="text-sm font-black text-slate-800 mt-1">{selectedProject?.deadline}</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Cơ quan xử lý</h3>
            <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-500">
                <Building2 size={24} />
              </div>
              <div>
                <p className="text-base font-bold text-emerald-800">{selectedProject?.currentAgency}</p>
                <p className="text-xs text-emerald-600 font-medium">Đang thụ lý hồ sơ</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  if (loading) return <div className="flex items-center justify-center h-full text-slate-400">Đang tải dữ liệu...</div>;

  return (
    <div className="h-full max-w-md mx-auto bg-slate-100 shadow-2xl overflow-hidden relative border-x border-slate-200">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {view === 'overview' && <Overview />}
          {view === 'departments' && <DepartmentStats />}
          {view === 'projects' && <ProjectList />}
          {view === 'detail' && <ProjectDetail />}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-30">
        <button className="flex flex-col items-center gap-1 text-blue-600">
          <LayoutDashboard size={24} />
          <span className="text-xs font-bold">Trang chủ</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <Search size={24} />
          <span className="text-xs font-bold">Tìm kiếm</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <Bell size={24} />
          <span className="text-xs font-bold">Thông báo</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <User size={24} />
          <span className="text-xs font-bold">Cá nhân</span>
        </button>
      </div>
    </div>
  );
}
