import React, { useState, useEffect } from 'react';
import { 
  Building2, ChevronRight, ChevronLeft, 
  AlertCircle, Clock, FileText, LayoutDashboard, 
  MapPin, User, Search, Bell, Menu,
  CheckCircle2, TrendingUp, Filter, Circle
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
  parentStep?: string;
  childStep?: string;
  stepDeadline?: string;
  currentAgency: string;
  currentDepartment?: string;
  deadline: string;
  stage: string;
  delayDays?: number;
}

// --- Mock Data ---
import { Agency as AgencyType } from './AgencyManagement';

interface DashboardAppProps {
  projects?: Project[];
  processingAgencies?: AgencyType[];
  investors?: any[];
  projectStages?: any[];
  locations?: any[];
}

export default function DashboardApp({ 
  projects: initialProjects = [],
  processingAgencies = [], 
  investors = [], 
  projectStages = [], 
  locations = [] 
}: DashboardAppProps) {
  const [view, setView] = useState<'overview' | 'agencies' | 'departments' | 'projects' | 'detail' | 'search-results'>('overview');
  const [selectedAgency, setSelectedAgency] = useState<any | null>(null);
  const [selectedDept, setSelectedDept] = useState<any | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'delayed' | 'ontime'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filterLocation, setFilterLocation] = useState('');
  const [filterAgencyName, setFilterAgencyName] = useState('');
  const [filterInvestor, setFilterInvestor] = useState('');
  const [filterProjectStage, setFilterProjectStage] = useState('');

  // Helper to check if a project matches a location filter (District or Ward)
  function isProjectInLocation(projectLocation: string, filterLoc: string) {
    if (!filterLoc) return true;
    if (projectLocation.includes(filterLoc)) return true;
    
    // Check if the ward in projectLocation belongs to the district in filterLoc
    const wardName = projectLocation.split(',')[0].trim();
    const wardInfo = locations.find(l => l.ward === wardName);
    return wardInfo?.oldArea === filterLoc;
  }

  // Summary Stats
  const globalFilteredProjects = projects.filter(p => {
    let matches = true;
    if (filterAgencyName) matches = matches && p.currentAgency === filterAgencyName;
    if (filterLocation) matches = matches && isProjectInLocation(p.location, filterLocation);
    if (filterInvestor) matches = matches && p.investor === filterInvestor;
    if (filterProjectStage) matches = matches && p.stage === filterProjectStage;
    return matches;
  });

  const totalProjects = globalFilteredProjects.length;
  const overdueProjects = globalFilteredProjects.filter(p => p.status === 'Delayed').length;
  const onTimeProjects = totalProjects - overdueProjects;

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);


  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    setSearchQuery(query);
    setStatusFilter('all');
    setView('search-results');
  };

  const dynamicAgencies = [
    {
      id: 'investor-stat',
      name: 'Chủ đầu tư',
      count: projects.filter(p => {
        let matches = p.currentAgency === 'Chủ đầu tư';
        if (filterLocation) matches = matches && isProjectInLocation(p.location, filterLocation);
        if (filterInvestor) matches = matches && p.investor === filterInvestor;
        if (filterProjectStage) matches = matches && p.stage === filterProjectStage;
        return matches;
      }).length,
      delayedCount: projects.filter(p => {
        let matches = p.currentAgency === 'Chủ đầu tư' && (p.status === 'Delayed' || p.status === 'Warning');
        if (filterLocation) matches = matches && isProjectInLocation(p.location, filterLocation);
        if (filterInvestor) matches = matches && p.investor === filterInvestor;
        if (filterProjectStage) matches = matches && p.stage === filterProjectStage;
        return matches;
      }).length,
      subtext: 'dự án đang xử lý',
      color: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
      departments: []
    },
    ...processingAgencies.map(a => {
      const agencyProjects = projects.filter(p => {
        let matches = p.currentAgency === a.name;
        if (filterLocation) matches = matches && isProjectInLocation(p.location, filterLocation);
        if (filterInvestor) matches = matches && p.investor === filterInvestor;
        if (filterProjectStage) matches = matches && p.stage === filterProjectStage;
        return matches;
      });
      const count = agencyProjects.length;
      const delayedCount = agencyProjects.filter(p => p.status === 'Delayed' || p.status === 'Warning').length;
      return {
        ...a,
        count,
        delayedCount,
        subtext: 'dự án đang xử lý',
        color: delayedCount > 0 ? 'bg-amber-50' : 'bg-emerald-50',
        iconColor: delayedCount > 0 ? 'text-amber-500' : 'text-emerald-500'
      };
    })
  ];

  const dynamicDepartments = selectedAgency ? (selectedAgency.name.includes('Phường xã') ? Array.from(new Set(locations.map(l => l.ward))) : selectedAgency.departments)
    .map((deptName: string, index: number) => {
      const isWardView = selectedAgency.name.includes('Phường xã') || selectedAgency.name.includes('Phường/Xã');
      
      // If ward view, check if it matches the location filter
      if (isWardView && filterLocation) {
        if (deptName !== filterLocation) {
          return null;
        }
      }

      const deptProjects = projects.filter(p => {
        let matches = p.currentAgency === selectedAgency.name && (p.currentDepartment === deptName || p.location.includes(deptName));
        
        // If not ward view, we might still want to filter by location if a ward was selected as location filter
        if (!isWardView && filterLocation) matches = matches && isProjectInLocation(p.location, filterLocation);
        if (filterInvestor) matches = matches && p.investor === filterInvestor;
        if (filterProjectStage) matches = matches && p.stage === filterProjectStage;
        
        return matches;
      });

      const totalCount = deptProjects.length;
      const delayedCount = deptProjects.filter(p => p.status === 'Delayed' || p.status === 'Warning').length;
      const ontimeCount = totalCount - delayedCount;
      
      let displayCount = totalCount;
      if (statusFilter === 'delayed') displayCount = delayedCount;
      if (statusFilter === 'ontime') displayCount = ontimeCount;

      return {
        id: `${selectedAgency.id}-${index}`,
        name: deptName,
        projectCount: displayCount,
        totalCount,
        delayedCount,
        ontimeCount
      };
    })
    .filter((dept: any) => dept !== null && dept.projectCount > 0) : [];

  const handleAgencyClick = (agency: any, status: 'all' | 'delayed' | 'ontime' = 'all') => {
    setSelectedAgency(agency);
    setStatusFilter(status);
    
    // Special cases: Sở Xây dựng and 168 Phường/Xã go to departments/wards
    const isSpecialAgency = agency.name.includes('Sở Xây dựng') || agency.name.includes('Phường xã') || agency.name.includes('Phường/Xã');
    
    if (isSpecialAgency && agency.departments && agency.departments.length > 0) {
      setView('departments');
    } else {
      setView('projects');
    }
  };

  const handleDeptClick = (dept: any, status: 'all' | 'delayed' | 'ontime' = 'all') => {
    setSelectedDept(dept);
    setStatusFilter(status);
    setView('projects');
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setView('detail');
  };

  const goBack = () => {
    if (view === 'detail') {
      if (searchQuery && !selectedDept && !selectedAgency) setView('search-results');
      else setView('projects');
    }
    else if (view === 'search-results') {
      setView('overview');
      setSearchQuery('');
      setStatusFilter('all');
    }
    else if (view === 'projects') {
      if (selectedAgency?.departments?.length > 0 && selectedDept) {
        setView('departments');
        setSelectedDept(null);
      } else if (selectedAgency && statusFilter !== 'all') {
        // If we came from AgenciesStats with a filter, go back to AgenciesStats
        setView('agencies');
        setSelectedAgency(null);
      } else {
        setView('overview');
        setSelectedAgency(null);
        setStatusFilter('all');
        setFilterProjectStage('');
      }
    }
    else if (view === 'departments') {
      if (statusFilter !== 'all') {
        setView('agencies');
        setSelectedAgency(null);
      } else {
        setView('overview');
        setSelectedAgency(null);
        setStatusFilter('all');
        setFilterProjectStage('');
      }
    }
    else if (view === 'agencies') {
      setView('overview');
      setStatusFilter('all');
    }
    setShowFilters(false);
  };

  const FilterPanel = ({ hideInvestorAndStage = false }: { hideInvestorAndStage?: boolean }) => {
    const agencies = Array.from(new Set(projects.map(p => p.currentAgency).filter(Boolean)));

    return (
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-slate-50 border-b border-slate-200 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cơ quan</label>
                  <select 
                    value={filterAgencyName}
                    onChange={(e) => setFilterAgencyName(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="">Tất cả</option>
                    {agencies.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Địa điểm
                  </label>
                  <select 
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="">Tất cả</option>
                    {locations.map((l, idx) => (
                      <option key={idx} value={l.ward || l}>{l.ward || l}</option>
                    ))}
                  </select>
                </div>
                {!hideInvestorAndStage && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Chủ đầu tư
                      </label>
                      <select 
                        value={filterInvestor}
                        onChange={(e) => setFilterInvestor(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                      >
                        <option value="">Tất cả</option>
                        {investors.map((i, idx) => (
                          <option key={idx} value={i}>{i}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Giai đoạn
                      </label>
                      <select 
                        value={filterProjectStage}
                        onChange={(e) => setFilterProjectStage(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                      >
                        <option value="">Tất cả</option>
                        {projectStages.map((s, idx) => (
                          <option key={idx} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>
              <button 
                onClick={() => {
                  setFilterAgencyName('');
                  setFilterLocation('');
                  setFilterInvestor('');
                  setFilterProjectStage('');
                }}
                className="w-full py-2 text-xs font-bold text-blue-600 uppercase tracking-widest"
              >
                Xóa bộ lọc
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const handleStageClick = (stage: string, status: 'all' | 'delayed' | 'ontime') => {
    setFilterProjectStage(stage);
    setStatusFilter(status);
    setView('projects');
  };

  // --- Views ---

  const Overview = () => {
    const stagesToDisplay = projectStages.map(stage => ({ name: stage, dataName: stage }));

    return (
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
          {/* Search Box */}
          <div className="mb-6 relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm dự án..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch((e.target as HTMLInputElement).value);
                }
              }}
            />
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <motion.div 
              whileTap={{ scale: 0.95 }}
              onClick={() => { setStatusFilter('all'); setView('agencies'); }}
              className="bg-blue-50 p-3 rounded-2xl border border-blue-100 flex flex-col items-center text-center cursor-pointer"
            >
              <span className="text-2xl font-black text-blue-700 tracking-tighter">{totalProjects}</span>
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">Tổng dự án</span>
            </motion.div>
            <motion.div 
              whileTap={{ scale: 0.95 }}
              onClick={() => { setStatusFilter('ontime'); setView('agencies'); }}
              className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 flex flex-col items-center text-center cursor-pointer"
            >
              <span className="text-2xl font-black text-emerald-700 tracking-tighter">{onTimeProjects}</span>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1">Còn hạn</span>
            </motion.div>
            <motion.div 
              whileTap={{ scale: 0.95 }}
              onClick={() => { setStatusFilter('delayed'); setView('agencies'); }}
              className="bg-rose-50 p-3 rounded-2xl border border-rose-100 flex flex-col items-center text-center cursor-pointer"
            >
              <span className="text-2xl font-black text-rose-700 tracking-tighter">{overdueProjects}</span>
              <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest mt-1">Quá hạn</span>
            </motion.div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Cơ quan đang xử lý</h2>
          </div>

          {/* Grid of Agencies */}
          <div className="grid grid-cols-2 gap-4">
            {dynamicAgencies.map((agency) => {
              const delayedCount = agency.delayedCount;
              const onTimeCount = agency.count - delayedCount;

              return (
                <motion.div
                  key={agency.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAgencyClick(agency, 'all')}
                  className={`${agency.color} p-4 rounded-2xl flex flex-col items-start text-left border border-white shadow-sm relative overflow-hidden group h-32 cursor-pointer`}
                >
                  <div className="flex justify-between w-full items-start mb-1">
                    <span className="text-3xl font-black text-slate-800 tracking-tighter">{agency.count}</span>
                  </div>
                  <p className="text-base font-black text-slate-800 leading-tight line-clamp-2 mb-auto">{agency.name}</p>
                  
                  <div className="flex justify-between w-full items-end">
                    <span className="text-xl font-black text-emerald-600">
                      {onTimeCount > 0 ? onTimeCount : ''}
                    </span>
                    <span className="text-xl font-black text-rose-600">
                      {delayedCount > 0 ? delayedCount : ''}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Project Statistics by Stage */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Thống kê dự án theo giai đoạn</h2>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              {stagesToDisplay.map((stage, index) => {
                const stageProjects = globalFilteredProjects.filter(p => p.stage === stage.dataName);
                const delayed = stageProjects.filter(p => p.status === 'Delayed' || p.status === 'Warning').length;
                const ontime = stageProjects.length - delayed;
                const total = stageProjects.length;

                return (
                  <div key={stage.name} className={index !== 0 ? "pt-4 border-t border-slate-100" : ""}>
                    <p className="text-sm font-black text-slate-800 uppercase tracking-tight mb-3">{stage.name}</p>
                    <div className="grid grid-cols-3 gap-2">
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStageClick(stage.dataName, 'all')}
                        className="bg-blue-50 p-2 rounded-xl border border-blue-100 flex flex-col items-center"
                      >
                        <span className="text-lg font-black text-blue-700">{total}</span>
                        <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Tổng</span>
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStageClick(stage.dataName, 'ontime')}
                        className="bg-emerald-50 p-2 rounded-xl border border-emerald-100 flex flex-col items-center"
                      >
                        <span className="text-lg font-black text-emerald-700">{ontime}</span>
                        <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Còn hạn</span>
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStageClick(stage.dataName, 'delayed')}
                        className="bg-rose-50 p-2 rounded-xl border border-rose-100 flex flex-col items-center"
                      >
                        <span className="text-lg font-black text-rose-700">{delayed}</span>
                        <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest">Quá hạn</span>
                      </motion.button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AgenciesStats = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-[#1e40af] text-white p-6 pb-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase">Thống kê theo cơ quan</h1>
            <p className="text-blue-100/60 text-xs font-bold tracking-widest uppercase">
              {statusFilter === 'delayed' ? 'Dự án quá hạn' : statusFilter === 'ontime' ? 'Dự án còn hạn' : 'Tất cả dự án'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-xl transition-all ${showFilters ? 'bg-white text-blue-600' : 'bg-white/10 text-white'}`}
        >
          <Filter size={24} />
        </button>
      </div>

      <FilterPanel />

      <div className="flex-1 -mt-8 bg-white rounded-t-[32px] p-6 shadow-2xl overflow-y-auto">
        <div className="grid gap-2">
          {dynamicAgencies.map((agency: any) => {
            const delayedCount = agency.delayedCount;
            const onTimeCount = agency.count - delayedCount;
            
            let displayCount = agency.count;
            if (statusFilter === 'delayed') displayCount = delayedCount;
            if (statusFilter === 'ontime') displayCount = onTimeCount;

            if (displayCount === 0 && statusFilter !== 'all') return null;

            return (
              <motion.div
                key={agency.id}
                className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col gap-0.5 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <p className="text-base font-bold text-slate-800 leading-tight">{agency.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium leading-none">Tổng số {agency.count} dự án</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-end mt-1">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAgencyClick(agency, 'ontime');
                    }}
                    className="hover:scale-110 transition-transform"
                  >
                    <span className="text-3xl font-black text-emerald-600 leading-none">{onTimeCount}</span>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAgencyClick(agency, 'delayed');
                    }}
                    className="hover:scale-110 transition-transform"
                  >
                    <span className="text-3xl font-black text-rose-600 leading-none">{delayedCount}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const DepartmentStats = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-[#1e40af] text-white p-6 pb-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase">{selectedAgency?.name}</h1>
            <p className="text-blue-100/60 text-xs font-bold tracking-widest uppercase">Thống kê chi tiết</p>
          </div>
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-xl transition-all ${showFilters ? 'bg-white text-blue-600' : 'bg-white/10 text-white'}`}
        >
          <Filter size={24} />
        </button>
      </div>

      <FilterPanel hideInvestorAndStage={selectedAgency?.name.includes('Phường xã') || selectedAgency?.name.includes('Phường/Xã')} />

      <div className="flex-1 -mt-8 bg-white rounded-t-[32px] p-6 shadow-2xl overflow-y-auto">
        <div className="grid gap-2">
          {dynamicDepartments.map((dept: any) => (
            <div
              key={dept.id}
              className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col gap-0.5 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-left">
                    <p className="text-base font-bold text-slate-800 leading-tight">{dept.name}</p>
                    <p className="text-[11px] text-slate-500 font-medium leading-none">Tổng số {dept.projectCount} dự án</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-end mt-1">
                <button 
                  onClick={() => handleDeptClick(dept, 'ontime')}
                  className="hover:scale-110 transition-transform"
                >
                  <span className="text-3xl font-black text-emerald-600 leading-none">{dept.ontimeCount}</span>
                </button>
                <button 
                  onClick={() => handleDeptClick(dept, 'delayed')}
                  className="hover:scale-110 transition-transform"
                >
                  <span className="text-3xl font-black text-rose-600 leading-none">{dept.delayedCount}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ProjectList = () => {
    const [localSearch, setLocalSearch] = useState('');

    const filteredProjects = projects.filter(p => {
      let matches = true;
      if (selectedDept) {
        matches = p.currentAgency === selectedAgency?.name && (p.currentDepartment === selectedDept.name || p.location.includes(selectedDept.name));
      } else if (selectedAgency) {
        matches = p.currentAgency === selectedAgency?.name;
      }
      
      if (statusFilter === 'delayed') matches = matches && (p.status === 'Delayed' || p.status === 'Warning');
      if (statusFilter === 'ontime') matches = matches && p.status !== 'Delayed' && p.status !== 'Warning';
      
      if (filterAgencyName) matches = matches && p.currentAgency === filterAgencyName;
      if (filterLocation) matches = matches && isProjectInLocation(p.location, filterLocation);
      if (filterInvestor) matches = matches && p.investor === filterInvestor;
      if (filterProjectStage) matches = matches && p.stage === filterProjectStage;

      if (localSearch) {
        const searchLower = localSearch.toLowerCase();
        matches = matches && (p.name.toLowerCase().includes(searchLower) || p.investor.toLowerCase().includes(searchLower));
      }

      return matches;
    });
    
    return (
      <div className="flex flex-col h-full bg-slate-50">
        <div className="bg-[#1e40af] text-white p-6 pb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={goBack} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-black tracking-tight uppercase truncate max-w-[200px]">{selectedDept?.name || selectedAgency?.name}</h1>
              <p className="text-blue-100/60 text-xs font-bold tracking-widest uppercase">
                {statusFilter === 'delayed' ? 'Dự án quá hạn' : statusFilter === 'ontime' ? 'Dự án đang xử lý' : 'Danh sách dự án'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-xl transition-all ${showFilters ? 'bg-white text-blue-600' : 'bg-white/10 text-white'}`}
          >
            <Filter size={24} />
          </button>
        </div>

        <FilterPanel />

        <div className="bg-white px-6 py-4 border-b border-slate-100">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Tìm kiếm theo tên dự án, chủ đầu tư..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 bg-white rounded-t-[32px] p-6 shadow-2xl overflow-y-auto pb-24">
          <div className="space-y-4">
            {filteredProjects.length > 0 ? filteredProjects.map((p) => (
              <motion.button
                key={p.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleProjectClick(p)}
                className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2 text-left"
              >
                <div className="flex justify-between items-start">
                  <p className="text-base font-black text-slate-800 line-clamp-2 leading-tight flex-1">{p.name}</p>
                  {p.status === 'Delayed' || p.status === 'Warning' ? (
                    <AlertCircle size={20} className="text-rose-500 ml-2 flex-shrink-0" />
                  ) : (
                    <CheckCircle2 size={20} className="text-emerald-500 ml-2 flex-shrink-0" />
                  )}
                </div>
                
                <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">{p.investor}</p>
                
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                  <span className="text-blue-600">{p.childStep || p.currentStep || 'Đang xử lý'}</span>
                  <span className="text-slate-300">•</span>
                  <span>{p.currentAgency}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-rose-500">{p.deadline}</span>
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

  const SearchResults = () => {
    const filteredProjects = projects.filter(p => {
      let matches = (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     p.investor.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (filterAgencyName) matches = matches && p.currentAgency === filterAgencyName;
      if (filterLocation) matches = matches && isProjectInLocation(p.location, filterLocation);
      if (filterInvestor) matches = matches && p.investor === filterInvestor;
      if (filterProjectStage) matches = matches && p.stage === filterProjectStage;

      return matches;
    });
    
    return (
      <div className="flex flex-col h-full bg-slate-50">
        <div className="bg-[#1e40af] text-white p-6 pb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={goBack} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-black tracking-tight uppercase">KẾT QUẢ TÌM KIẾM</h1>
              <p className="text-blue-100/60 text-xs font-bold tracking-widest uppercase">"{searchQuery}"</p>
            </div>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-xl transition-all ${showFilters ? 'bg-white text-blue-600' : 'bg-white/10 text-white'}`}
          >
            <Filter size={24} />
          </button>
        </div>

        <div className="bg-white px-6 py-4 border-b border-slate-100">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              defaultValue={searchQuery}
              placeholder="Tìm kiếm dự án khác..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch((e.target as HTMLInputElement).value);
                }
              }}
            />
          </div>
        </div>

        <FilterPanel />

        <div className="flex-1 -mt-8 bg-white rounded-t-[32px] p-6 shadow-2xl overflow-y-auto pb-24">
          <div className="space-y-4">
            {filteredProjects.length > 0 ? filteredProjects.map((p) => (
              <motion.button
                key={p.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleProjectClick(p)}
                className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2 text-left"
              >
                <div className="flex justify-between items-start">
                  <p className="text-base font-black text-slate-800 line-clamp-2 leading-tight flex-1">{p.name}</p>
                  {p.status === 'Delayed' || p.status === 'Warning' ? (
                    <AlertCircle size={20} className="text-rose-500 ml-2 flex-shrink-0" />
                  ) : (
                    <CheckCircle2 size={20} className="text-emerald-500 ml-2 flex-shrink-0" />
                  )}
                </div>
                
                <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">{p.investor}</p>
                
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                  <span className="text-blue-600">{p.childStep || p.currentStep || 'Đang xử lý'}</span>
                  <span className="text-slate-300">•</span>
                  <span>{p.currentAgency}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-rose-500">{p.deadline}</span>
                </div>
              </motion.button>
            )) : (
              <div className="text-center py-12 text-slate-400 italic text-sm">
                Không tìm thấy dự án nào phù hợp...
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

      <div className="flex-1 -mt-8 bg-white rounded-t-[32px] p-6 shadow-2xl overflow-y-auto pb-24">
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
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Sơ đồ Gantt / Tiến độ dự án</h3>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="relative">
                {/* Vertical line connecting steps */}
                <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-200"></div>
                
                <div className="space-y-8 relative">
                  {projectStages.map((stage, index) => {
                    const currentStageIndex = projectStages.indexOf(selectedProject?.stage || '');
                    const isCompleted = currentStageIndex > index || selectedProject?.progress === 100;
                    const isCurrent = currentStageIndex === index && selectedProject?.progress !== 100;
                    const isPending = currentStageIndex < index;
                    
                    return (
                      <div key={stage} className="flex gap-4">
                        <div className="relative z-10 flex-shrink-0 mt-1">
                          {isCompleted ? (
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-200">
                              <CheckCircle2 size={18} />
                            </div>
                          ) : isCurrent ? (
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 ring-4 ring-white shadow-sm border border-blue-200">
                              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></div>
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-slate-300 shadow-sm">
                              <Circle size={12} />
                            </div>
                          )}
                        </div>
                        
                        <div className={`flex-1 ${isPending ? 'opacity-50' : ''}`}>
                          <h4 className={`text-sm font-bold ${isCurrent ? 'text-blue-600' : 'text-slate-800'}`}>
                            {stage}
                          </h4>
                          
                          {isCurrent && (
                            <div className="mt-3 space-y-3">
                              {(selectedProject?.parentStep || selectedProject?.childStep) && (
                                <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                                  {selectedProject?.parentStep && (
                                    <p className="text-xs font-bold text-slate-700 mb-1">{selectedProject.parentStep}</p>
                                  )}
                                  {(selectedProject?.childStep || selectedProject?.currentStep) && (
                                    <div className="flex items-start gap-2 mt-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5"></div>
                                      <div className="flex-1">
                                        <p className="text-xs text-slate-600 font-medium">{selectedProject.childStep || selectedProject.currentStep}</p>
                                        {(selectedProject?.stepDeadline || selectedProject?.deadline) && (
                                          <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-rose-600 bg-rose-50 w-fit px-2 py-1 rounded-md border border-rose-100">
                                            <Clock size={12} />
                                            Hạn: {selectedProject.stepDeadline || selectedProject.deadline}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              <div className="flex items-center gap-3">
                                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                                    style={{ width: `${selectedProject?.progress || 0}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-black text-blue-600 w-8 text-right">{selectedProject?.progress || 0}%</span>
                              </div>
                            </div>
                          )}
                          
                          {isCompleted && (
                            <p className="text-xs text-emerald-600 font-bold mt-1">Đã hoàn thành</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
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
          {view === 'agencies' && <AgenciesStats />}
          {view === 'search-results' && <SearchResults />}
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
