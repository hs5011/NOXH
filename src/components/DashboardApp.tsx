import React, { useState, useEffect } from 'react';
import { 
  Building2, ChevronRight, ChevronLeft, 
  AlertCircle, Clock, FileText, LayoutDashboard, 
  MapPin, User, Search, Bell, Menu,
  CheckCircle2, TrendingUp, Filter, Circle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PROJECT_REGIONS } from '../constants';
import { INITIAL_PROCESSES } from '../data/appData';

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
  processId?: string;
  milestones?: Record<string, { investor: string; agency: string }>;
  implementationPlan?: Record<string, { agencyActualDate: string }>;
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
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
          background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
          background-size: 200% 100%;
        }
      `}</style>
      <DashboardContent 
        initialProjects={initialProjects}
        processingAgencies={processingAgencies}
        investors={investors}
        projectStages={projectStages}
        locations={locations}
      />
    </>
  );
}

function DashboardContent({ 
  initialProjects = [],
  processingAgencies = [], 
  investors = [], 
  projectStages = [], 
  locations = [] 
}: DashboardAppProps & { initialProjects: Project[] }) {
  const [view, setView] = useState<'overview' | 'agencies' | 'departments' | 'projects' | 'detail' | 'search-results' | 'steps' | 'child-steps'>('overview');
  const [selectedAgency, setSelectedAgency] = useState<any | null>(null);
  const [selectedDept, setSelectedDept] = useState<any | null>(null);
  const [selectedParentStep, setSelectedParentStep] = useState<string | null>(null);
  const [selectedChildStep, setSelectedChildStep] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [stepSearchTerm, setStepSearchTerm] = useState('');
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
  const overdueProjects = globalFilteredProjects.filter(p => p.status === 'Delayed' || p.status === 'Warning').length;
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
      count: globalFilteredProjects.filter(p => p.currentAgency === 'Chủ đầu tư').length,
      delayedCount: globalFilteredProjects.filter(p => p.currentAgency === 'Chủ đầu tư' && (p.status === 'Delayed' || p.status === 'Warning')).length,
      subtext: 'dự án đang xử lý',
      color: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
      departments: []
    },
    ...processingAgencies.map(a => {
      const agencyProjects = globalFilteredProjects.filter(p => p.currentAgency === a.name);
      const count = agencyProjects.length;
      const delayedCount = agencyProjects.filter(p => p.status === 'Delayed' || p.status === 'Warning').length;
      return {
        ...a,
        count,
        delayedCount,
        subtext: 'dự án đang xử lý',
        color: 'bg-emerald-50',
        iconColor: 'text-emerald-500'
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

      const deptProjects = globalFilteredProjects.filter(p => {
        return p.currentAgency === selectedAgency.name && (p.currentDepartment === deptName || p.location.includes(deptName));
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
    } else {
      // Return to main dashboard (Overview) from any other view
      setView('overview');
      setSelectedAgency(null);
      setSelectedDept(null);
      setSelectedParentStep(null);
      setSelectedChildStep(null);
      setStatusFilter('all');
      setSearchQuery('');
      setFilterProjectStage('');
      setStepSearchTerm('');
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
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
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight uppercase">SỞ XÂY DỰNG TP.HCM</h1>
            <div className="flex items-center gap-2 mt-2 text-blue-100/80 text-sm sm:text-base font-bold tracking-widest uppercase">
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
          <div className="grid grid-cols-3 gap-2 mb-4">
            <motion.div 
              whileTap={{ scale: 0.95 }}
              onClick={() => { setStatusFilter('all'); setView('steps'); }}
              className="bg-blue-50 p-2 rounded-2xl border border-blue-100 flex flex-col items-center text-center cursor-pointer"
            >
              <span className="text-xl sm:text-2xl font-black text-blue-700 tracking-tighter leading-none">{totalProjects}</span>
              <span className="text-[8px] sm:text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">Tổng dự án</span>
            </motion.div>
            <motion.div 
              whileTap={{ scale: 0.95 }}
              onClick={() => { setStatusFilter('delayed'); setView('steps'); }}
              className="bg-rose-50 p-2 rounded-2xl border border-rose-100 flex flex-col items-center text-center cursor-pointer"
            >
              <span className="text-xl sm:text-2xl font-black text-rose-700 tracking-tighter leading-none">{overdueProjects}</span>
              <span className="text-[8px] sm:text-[10px] font-black text-rose-400 uppercase tracking-widest mt-1">Quá hạn</span>
            </motion.div>
            <motion.div 
              whileTap={{ scale: 0.95 }}
              onClick={() => { setStatusFilter('ontime'); setView('steps'); }}
              className="bg-emerald-50 p-2 rounded-2xl border border-emerald-100 flex flex-col items-center text-center cursor-pointer"
            >
              <span className="text-xl sm:text-2xl font-black text-emerald-700 tracking-tighter leading-none">{onTimeProjects}</span>
              <span className="text-[8px] sm:text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1">Còn hạn</span>
            </motion.div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Cơ quan đang xử lý</h2>
          </div>

          {/* Grid of Agencies */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {dynamicAgencies.filter(agency => {
              if (statusFilter === 'delayed') return agency.delayedCount > 0;
              if (statusFilter === 'ontime') return (agency.count - agency.delayedCount) > 0;
              return agency.count > 0;
            }).map((agency) => {
              const delayedCount = agency.delayedCount;
              const onTimeCount = agency.count - delayedCount;
              
              let displayCount = agency.count;
              if (statusFilter === 'delayed') displayCount = delayedCount;
              if (statusFilter === 'ontime') displayCount = onTimeCount;

              return (
                <motion.div
                  key={agency.id}
                  onClick={() => handleAgencyClick(agency, statusFilter)}
                  className={`${agency.color} p-3 rounded-2xl flex flex-col justify-between border border-white shadow-sm relative overflow-hidden h-24 cursor-pointer`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm font-black text-slate-800 leading-tight line-clamp-2 flex-1">{agency.name}</p>
                    <span className="text-xl font-black text-slate-800 tracking-tighter leading-none">{displayCount}</span>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    {(statusFilter === 'all' || statusFilter === 'delayed') ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAgencyClick(agency, 'delayed');
                        }}
                        className="hover:scale-110 transition-transform"
                      >
                        <span className="text-2xl font-black text-rose-600 leading-none">{delayedCount > 0 ? delayedCount : '0'}</span>
                      </button>
                    ) : <div />}
                    {(statusFilter === 'all' || statusFilter === 'ontime') ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAgencyClick(agency, 'ontime');
                        }}
                        className="hover:scale-110 transition-transform"
                      >
                        <span className="text-2xl font-black text-emerald-600 leading-none">{onTimeCount > 0 ? onTimeCount : '0'}</span>
                      </button>
                    ) : <div />}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Project Statistics by Stage */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-black text-slate-800 tracking-tight">Thống kê theo giai đoạn</h2>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              {stagesToDisplay
                .map(stage => {
                  const stageProjects = globalFilteredProjects.filter(p => p.stage === stage.dataName);
                  return { ...stage, projects: stageProjects };
                })
                .filter(stage => stage.projects.length > 0)
                .map((stage, index) => {
                  const stageProjects = stage.projects;
                  const delayed = stageProjects.filter(p => p.status === 'Delayed' || p.status === 'Warning').length;
                  const ontime = stageProjects.length - delayed;
                  const total = stageProjects.length;

                  return (
                    <div key={stage.name} className={index !== 0 ? "pt-3 border-t border-slate-100" : ""}>
                      <p className="text-xs font-black text-slate-800 uppercase tracking-tight mb-2">{stage.name}</p>
                      <div className="grid grid-cols-3 gap-2">
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleStageClick(stage.dataName, 'all')}
                          className="bg-blue-50 p-1.5 rounded-xl border border-blue-100 flex flex-col items-center"
                        >
                          <span className="text-sm sm:text-base font-black text-blue-700 leading-none">{total}</span>
                          <span className="text-[7px] sm:text-[8px] font-black text-blue-400 uppercase tracking-widest mt-0.5">Tổng</span>
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleStageClick(stage.dataName, 'delayed')}
                          className="bg-rose-50 p-1.5 rounded-xl border border-rose-100 flex flex-col items-center"
                        >
                          <span className="text-sm sm:text-base font-black text-rose-700 leading-none">{delayed}</span>
                          <span className="text-[7px] sm:text-[8px] font-black text-rose-400 uppercase tracking-widest mt-0.5">Quá hạn</span>
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleStageClick(stage.dataName, 'ontime')}
                          className="bg-emerald-50 p-1.5 rounded-xl border border-emerald-100 flex flex-col items-center"
                        >
                          <span className="text-sm sm:text-base font-black text-emerald-700 leading-none">{ontime}</span>
                          <span className="text-[7px] sm:text-[8px] font-black text-emerald-400 uppercase tracking-widest mt-0.5">Còn hạn</span>
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
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {dynamicAgencies.map((agency: any) => {
            const delayedCount = agency.delayedCount;
            const onTimeCount = agency.count - delayedCount;
            
            let displayCount = agency.count;
            if (statusFilter === 'delayed') displayCount = delayedCount;
            if (statusFilter === 'ontime') displayCount = onTimeCount;

            if (displayCount === 0) return null;

            return (
              <motion.div
                key={agency.id}
                onClick={() => handleAgencyClick(agency, statusFilter)}
                className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col gap-0.5 group cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 text-left">
                    <p className="text-sm sm:text-base font-bold text-slate-800 leading-tight line-clamp-2">{agency.name}</p>
                    {statusFilter === 'all' && (
                      <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-none mt-1">
                        Tổng số {agency.count}
                      </p>
                    )}
                  </div>
                  {statusFilter !== 'all' && (
                    <div className="flex-shrink-0">
                      <span className={`text-2xl sm:text-3xl font-black leading-none ${statusFilter === 'delayed' ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {displayCount}
                      </span>
                    </div>
                  )}
                </div>
                
                {statusFilter === 'all' && (
                  <div className="flex justify-between items-end mt-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAgencyClick(agency, 'delayed');
                      }}
                      className="hover:scale-110 transition-transform"
                    >
                      <span className="text-2xl sm:text-3xl font-black text-rose-600 leading-none">{delayedCount}</span>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAgencyClick(agency, 'ontime');
                      }}
                      className="hover:scale-110 transition-transform"
                    >
                      <span className="text-2xl sm:text-3xl font-black text-emerald-600 leading-none">{onTimeCount}</span>
                    </button>
                  </div>
                )}
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
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {dynamicDepartments.map((dept: any) => (
            <div
              key={dept.id}
              onClick={() => handleDeptClick(dept, statusFilter)}
              className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col gap-0.5 group cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 text-left">
                  <p className="text-sm sm:text-base font-bold text-slate-800 leading-tight line-clamp-2">{dept.name}</p>
                  {statusFilter === 'all' && (
                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-none mt-1">
                      Tổng số {dept.totalCount}
                    </p>
                  )}
                </div>
                {statusFilter !== 'all' && (
                  <div className="flex-shrink-0">
                    <span className={`text-2xl sm:text-3xl font-black leading-none ${statusFilter === 'delayed' ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {dept.projectCount}
                    </span>
                  </div>
                )}
              </div>
              
              {statusFilter === 'all' && (
                <div className="flex justify-between items-end mt-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeptClick(dept, 'delayed');
                    }}
                    className="hover:scale-110 transition-transform"
                  >
                    <span className="text-2xl sm:text-3xl font-black text-rose-600 leading-none">{dept.delayedCount}</span>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeptClick(dept, 'ontime');
                    }}
                    className="hover:scale-110 transition-transform"
                  >
                    <span className="text-2xl sm:text-3xl font-black text-emerald-600 leading-none">{dept.ontimeCount}</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const getParentStepStats = () => {
    const parentSteps = new Set<string>();
    globalFilteredProjects.forEach(p => {
      if (p.parentStep) parentSteps.add(p.parentStep);
    });

    return Array.from(parentSteps)
      .filter(stepName => stepName.toLowerCase().includes(stepSearchTerm.toLowerCase()))
      .map(stepName => {
        const stepProjects = globalFilteredProjects.filter(p => p.parentStep === stepName);
        const delayed = stepProjects.filter(p => p.status === 'Delayed' || p.status === 'Warning').length;
        const ontime = stepProjects.length - delayed;
        
        let count = stepProjects.length;
        if (statusFilter === 'delayed') count = delayed;
        if (statusFilter === 'ontime') count = ontime;

        return {
          name: stepName,
          count,
          total: stepProjects.length,
          delayed,
          ontime
        };
      }).filter(s => s.count > 0);
  };

  const getChildStepStats = (parentStepName: string) => {
    const childSteps = new Set<string>();
    globalFilteredProjects.forEach(p => {
      if (p.parentStep === parentStepName && p.childStep) childSteps.add(p.childStep);
    });

    return Array.from(childSteps)
      .filter(stepName => stepName.toLowerCase().includes(stepSearchTerm.toLowerCase()))
      .map(stepName => {
        const stepProjects = globalFilteredProjects.filter(p => p.parentStep === parentStepName && p.childStep === stepName);
        const delayed = stepProjects.filter(p => p.status === 'Delayed' || p.status === 'Warning').length;
        const ontime = stepProjects.length - delayed;
        
        let count = stepProjects.length;
        if (statusFilter === 'delayed') count = delayed;
        if (statusFilter === 'ontime') count = ontime;

        return {
          name: stepName,
          count,
          total: stepProjects.length,
          delayed,
          ontime
        };
      }).filter(s => s.count > 0);
  };

  const StepsStats = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-[#1e40af] text-white p-6 pb-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase">Thống kê theo thủ tục</h1>
            <p className="text-blue-100/60 text-xs font-bold tracking-widest uppercase">
              {statusFilter === 'delayed' ? 'Dự án quá hạn' : statusFilter === 'ontime' ? 'Dự án còn hạn' : 'Tất cả dự án'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 -mt-8 bg-white rounded-t-[32px] p-6 shadow-2xl overflow-y-auto">
        <div className="relative mb-4">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Tìm theo tên thủ tục..." 
            value={stepSearchTerm}
            onChange={(e) => setStepSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {getParentStepStats().map((step) => (
            <div
              key={step.name}
              onClick={() => {
                setSelectedParentStep(step.name);
                setStatusFilter(statusFilter);
                setView('child-steps');
              }}
              className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col gap-0.5 cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 text-left">
                  <p className="text-sm sm:text-base font-bold text-slate-800 leading-tight line-clamp-2">{step.name}</p>
                  {statusFilter === 'all' && (
                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-none mt-1">
                      Tổng số {step.total}
                    </p>
                  )}
                </div>
                {statusFilter !== 'all' && (
                  <div className="flex-shrink-0">
                    <span className={`text-2xl sm:text-3xl font-black leading-none ${statusFilter === 'delayed' ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {step.count}
                    </span>
                  </div>
                )}
              </div>
              
              {statusFilter === 'all' && (
                <div className="flex justify-between items-end mt-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedParentStep(step.name);
                      setStatusFilter('delayed');
                      setView('child-steps');
                    }}
                    className="hover:scale-110 transition-transform"
                  >
                    <span className="text-2xl sm:text-3xl font-black text-rose-600 leading-none">{step.delayed}</span>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedParentStep(step.name);
                      setStatusFilter('ontime');
                      setView('child-steps');
                    }}
                    className="hover:scale-110 transition-transform"
                  >
                    <span className="text-2xl sm:text-3xl font-black text-emerald-600 leading-none">{step.ontime}</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ChildStepsStats = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-[#1e40af] text-white p-6 pb-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase truncate max-w-[200px]">{selectedParentStep}</h1>
            <p className="text-blue-100/60 text-xs font-bold tracking-widest uppercase">Thống kê bước con</p>
          </div>
        </div>
      </div>

      <div className="flex-1 -mt-8 bg-white rounded-t-[32px] p-6 shadow-2xl overflow-y-auto">
        <div className="relative mb-4">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Tìm theo tên bước con..." 
            value={stepSearchTerm}
            onChange={(e) => setStepSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {selectedParentStep && getChildStepStats(selectedParentStep).map((step) => (
            <div
              key={step.name}
              onClick={() => {
                setSelectedChildStep(step.name);
                setStatusFilter(statusFilter);
                setView('projects');
              }}
              className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col gap-0.5 cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 text-left">
                  <p className="text-sm sm:text-base font-bold text-slate-800 leading-tight line-clamp-2">{step.name}</p>
                  {statusFilter === 'all' && (
                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-none mt-1">
                      Tổng số {step.total}
                    </p>
                  )}
                </div>
                {statusFilter !== 'all' && (
                  <div className="flex-shrink-0">
                    <span className={`text-2xl sm:text-3xl font-black leading-none ${statusFilter === 'delayed' ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {step.count}
                    </span>
                  </div>
                )}
              </div>
              
              {statusFilter === 'all' && (
                <div className="flex justify-between items-end mt-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedChildStep(step.name);
                      setStatusFilter('delayed');
                      setView('projects');
                    }}
                    className="hover:scale-110 transition-transform"
                  >
                    <span className="text-2xl sm:text-3xl font-black text-rose-600 leading-none">{step.delayed}</span>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedChildStep(step.name);
                      setStatusFilter('ontime');
                      setView('projects');
                    }}
                    className="hover:scale-110 transition-transform"
                  >
                    <span className="text-2xl sm:text-3xl font-black text-emerald-600 leading-none">{step.ontime}</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ProjectList = () => {
    const [localSearch, setLocalSearch] = useState('');

    const filteredProjects = globalFilteredProjects.filter(p => {
      let matches = true;
      if (selectedChildStep) {
        matches = p.childStep === selectedChildStep;
      } else if (selectedDept) {
        matches = p.currentAgency === selectedAgency?.name && (p.currentDepartment === selectedDept.name || p.location.includes(selectedDept.name));
      } else if (selectedAgency) {
        matches = p.currentAgency === selectedAgency?.name;
      }
      
      if (statusFilter === 'delayed') matches = matches && (p.status === 'Delayed' || p.status === 'Warning');
      if (statusFilter === 'ontime') matches = matches && p.status !== 'Delayed' && p.status !== 'Warning';
      
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
    const filteredProjects = globalFilteredProjects.filter(p => {
      let matches = (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     p.investor.toLowerCase().includes(searchQuery.toLowerCase()));
      
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

  const ProjectDetail = () => {
    if (!selectedProject) return null;

    const isOverdue = selectedProject.status === 'Delayed' || selectedProject.status === 'Warning';
    
    // Detailed process definition for Gantt chart
    let processDefinition = [];
    const process = INITIAL_PROCESSES.find(p => p.id === selectedProject.processId);
    
    if (process) {
      const stageMap = new Map();
      process.parentSteps.forEach(ps => {
        if (!stageMap.has(ps.stage)) {
          stageMap.set(ps.stage, { stage: ps.stage, steps: [] });
        }
        const stageDef = stageMap.get(ps.stage);
        ps.childSteps.forEach((cs) => {
          stageDef.steps.push({
            id: cs.id,
            name: cs.name,
            agency: cs.agency,
            isParallel: false
          });
        });
      });
      processDefinition = Array.from(stageMap.values());
    } else {
      processDefinition = [
        {
          stage: 'CHUẨN BỊ ĐẦU TƯ',
          steps: [
            { name: 'Chấp thuận chủ trương đầu tư / lựa chọn chủ đầu tư', agency: 'Sở Kế hoạch & Đầu tư' },
            { name: 'Lấy ý kiến các sở ngành', agency: 'Các Sở ngành liên quan', isParallel: true },
            { name: 'Thẩm định báo cáo nghiên cứu khả thi', agency: 'Sở Xây dựng' },
            { name: 'Phê duyệt chủ trương đầu tư', agency: 'UBND Tỉnh' }
          ]
        },
        {
          stage: 'THỰC HIỆN ĐẦU TƯ',
          steps: [
            { name: 'Lập thiết kế cơ sở', agency: 'Đơn vị tư vấn' },
            { name: 'Thẩm định thiết kế cơ sở', agency: 'Sở Xây dựng' },
            { name: 'Cấp giấy phép xây dựng', agency: 'Sở Xây dựng' },
            { name: 'Đánh giá tác động môi trường', agency: 'Sở Tài nguyên Môi trường', isParallel: true }
          ]
        },
        {
          stage: 'KẾT THÚC ĐẦU TƯ',
          steps: [
            { name: 'Tổ chức đấu thầu', agency: 'Ban QLDA' },
            { name: 'Thi công xây dựng', agency: 'Nhà thầu thi công' },
            { name: 'Giám sát thi công', agency: 'Đơn vị tư vấn giám sát', isParallel: true }
          ]
        },
        {
          stage: 'KẾT THÚC ĐẦU TƯ',
          steps: [
            { name: 'Nghiệm thu / Bàn giao', agency: 'Hội đồng nghiệm thu' },
            { name: 'Quyết toán dự án', agency: 'Sở Tài chính' }
          ]
        }
      ];
    }

    // Generate Gantt data based on the detailed process definition
    let foundCurrentStep = false;
    
    // Find exact match first
    let exactMatchStepName: string | null = null;
    for (const stage of processDefinition) {
      for (const step of stage.steps) {
        if (step.name === selectedProject.childStep || step.name === selectedProject.currentStep) {
          exactMatchStepName = step.name;
          break;
        }
      }
      if (exactMatchStepName) break;
    }

    const normalizeStage = (stage: string) => {
      if (!stage) return '';
      const s = stage.toUpperCase();
      if (s === 'THỰC HIỆN ĐẦU TƯ') return 'THỰC HIỆN DỰ ÁN';
      if (s === 'KẾT THÚC ĐẦU TƯ') return 'KẾT THÚC DỰ ÁN';
      if (s === 'KẾT THÚC XÂY DỰNG') return 'KẾT THÚC DỰ ÁN';
      return s;
    };

    const normalizedCurrentStage = normalizeStage(selectedProject.stage);
    const currentStageIndex = projectStages.findIndex(s => normalizeStage(s) === normalizedCurrentStage);

    const ganttData = processDefinition.map((stageDef, stageIndex) => {
      const normalizedDefStage = normalizeStage(stageDef.stage);
      const defStageIndex = projectStages.findIndex(s => normalizeStage(s) === normalizedDefStage);
      const isCurrentStage = defStageIndex === currentStageIndex;

      // If no exact match, we will fallback to the middle step of the current stage
      const fallbackStepIndex = Math.floor(stageDef.steps.length / 2);

      const steps = stageDef.steps.map((stepDef, stepIndex) => {
        let stepStatus: 'completed' | 'current' | 'pending' = 'pending';
        let isDelayed = false;
        let agency = stepDef.agency;
        let stepName = stepDef.name;

        let isCurrentStep = false;
        if (exactMatchStepName) {
           isCurrentStep = stepDef.name === exactMatchStepName;
        } else if (isCurrentStage && stepIndex === fallbackStepIndex) {
           isCurrentStep = true;
           stepName = selectedProject.childStep || selectedProject.currentStep || stepDef.name;
        }

        if (process && stepDef.id && selectedProject.milestones && selectedProject.implementationPlan) {
          const milestone = selectedProject.milestones[stepDef.id];
          const impl = selectedProject.implementationPlan[stepDef.id];
          
          if (impl && impl.agencyActualDate) {
            stepStatus = 'completed';
            if (milestone && milestone.agency) {
              isDelayed = new Date(impl.agencyActualDate) > new Date(milestone.agency);
            }
          } else if (isCurrentStep || (!foundCurrentStep && !impl?.agencyActualDate)) {
            // If it's the current step, or we haven't found the current step yet and this one has no actual date
            stepStatus = 'current';
            foundCurrentStep = true;
            isDelayed = isOverdue;
            agency = selectedProject.currentAgency || stepDef.agency;
          } else if (foundCurrentStep) {
            stepStatus = 'pending';
          } else {
            // Fallback if something is weird
            stepStatus = 'completed';
          }
        } else {
          // Fallback logic for projects without detailed milestones
          if (isCurrentStep) {
            stepStatus = 'current';
            foundCurrentStep = true;
            isDelayed = isOverdue;
            agency = selectedProject.currentAgency || stepDef.agency;
          } else if (!foundCurrentStep) {
            // If we haven't found the current step yet, this step must be completed
            stepStatus = 'completed';
            // Randomly make some previous steps delayed for demo purposes
            isDelayed = (stageIndex + stepIndex) % 4 === 0; 
          } else {
            // If we have already found the current step, this step is pending
            stepStatus = 'pending';
          }
        }

        // Determine pill style
        let statusText = 'CHƯA BẮT ĐẦU';
        let pillClass = 'bg-slate-100 text-slate-400';
        let StatusIcon = Clock;

        if (stepStatus === 'completed') {
          statusText = isDelayed ? 'TRỄ HẠN' : 'ĐÚNG HẠN';
          pillClass = isDelayed ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white';
          StatusIcon = isDelayed ? AlertCircle : CheckCircle2;
        } else if (stepStatus === 'current') {
          statusText = 'ĐANG XỬ LÝ';
          pillClass = 'bg-blue-600 text-white shadow-sm';
          StatusIcon = Circle;
        }

        return {
          stepName,
          agency,
          isDelayed,
          status: stepStatus,
          statusText,
          pillClass,
          StatusIcon,
          isParallel: stepDef.isParallel
        };
      });

      let stageStatus: 'completed' | 'current' | 'pending' = 'pending';
      if (defStageIndex < currentStageIndex) stageStatus = 'completed';
      else if (defStageIndex === currentStageIndex) stageStatus = 'current';

      return {
        stageName: stageDef.stage,
        status: stageStatus,
        steps
      };
    });

    return (
      <div className="flex flex-col h-full bg-slate-50">
        <div className="bg-[#1e40af] text-white p-6 pb-12 flex items-center gap-4">
          <button onClick={goBack} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase">CHI TIẾT DỰ ÁN</h1>
            <p className="text-blue-100/60 text-xs font-bold tracking-widest uppercase">{selectedProject.code}</p>
          </div>
        </div>

        <div className="flex-1 -mt-8 bg-white rounded-t-[32px] p-6 shadow-2xl overflow-y-auto pb-24">
          <div className="space-y-6">
            {/* Project Header Info */}
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-4">
                <h2 className="text-xl font-black text-slate-800 leading-tight">{selectedProject.name}</h2>
              </div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-tight flex items-center gap-2">
                <Building2 size={14} className="text-slate-400" />
                {selectedProject.investor}
              </p>
            </div>

            {/* Current Status Card */}
            <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
                <div className="flex items-center gap-4 flex-1 w-full">
                  <div className="p-3 bg-white/20 rounded-2xl shrink-0">
                    <Clock size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-1">Đang xử lý tại</p>
                    <p className="text-base font-bold leading-tight">{selectedProject.currentAgency}</p>
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-1">Bước hiện tại</p>
                  <p className="text-base font-bold leading-tight">{selectedProject.childStep || selectedProject.currentStep}</p>
                </div>

                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start md:block">
                    <div>
                      <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-1">Thời hạn xử lý</p>
                      <p className="text-base font-bold leading-tight">{selectedProject.stepDeadline || selectedProject.deadline}</p>
                    </div>
                    {selectedProject.delayDays && selectedProject.delayDays > 0 && (
                      <div className="bg-rose-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mt-2 md:mt-2 md:inline-block">
                        Trễ {selectedProject.delayDays} ngày
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Info Grid */}
            <section>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Thông tin chi tiết</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Địa điểm</p>
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-blue-500 mt-0.5" />
                    <p className="text-xs font-bold text-slate-700 leading-tight">{selectedProject.location}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Giai đoạn</p>
                  <div className="flex items-start gap-2">
                    <TrendingUp size={14} className="text-emerald-500 mt-0.5" />
                    <p className="text-xs font-bold text-slate-700 leading-tight">{selectedProject.stage}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phòng ban</p>
                  <div className="flex items-start gap-2">
                    <Building2 size={14} className="text-amber-500 mt-0.5" />
                    <p className="text-xs font-bold text-slate-700 leading-tight">{selectedProject.currentDepartment || 'Chưa xác định'}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Gantt Chart Section */}
            <section>
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Sơ đồ Gantt tiến độ chi tiết</h3>
              </div>
              
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <div className="space-y-8">
                  {ganttData.map((stageData, stageIdx) => (
                    <div key={stageIdx} className="space-y-4">
                      {/* Row 1: Stage Name */}
                      <h4 className={`text-lg font-black uppercase tracking-tight ${stageData.status === 'current' ? 'text-blue-600' : 'text-slate-800'}`}>
                        {stageData.stageName}
                      </h4>

                      <div className="space-y-6">
                        {stageData.steps.map((step, stepIdx) => {
                          // Determine if it's a child step (not the first one in stage or has specific logic)
                          // In our data, stepIdx 0 is usually the parent step of the stage group
                          const isChild = stepIdx > 0;
                          
                          // Map colors to match image
                          let barClass = "bg-slate-100 text-slate-400";
                          if (step.status === 'completed') {
                            barClass = step.isDelayed ? "bg-[#F26A7E] text-white" : "bg-[#50D38D] text-white";
                          } else if (step.status === 'current') {
                            barClass = "bg-[#4F86F7] text-white";
                          }

                          return (
                            <div key={stepIdx} className={`relative ${isChild ? 'pl-8' : ''}`}>
                              {isChild && (
                                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-100"></div>
                              )}
                              
                              {/* Row 2: Step Name */}
                              <p className="text-sm font-bold text-slate-500 mb-3 leading-tight">
                                {step.stepName}
                              </p>

                              {/* Row 3: Agency & Status Bar */}
                              <div className={`flex items-center justify-between px-5 py-3 rounded-2xl shadow-sm ${barClass}`}>
                                <span className="text-sm font-black truncate mr-4">{step.agency}</span>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <step.StatusIcon size={16} className="text-white opacity-90" />
                                  <span className="text-xs font-black uppercase tracking-widest">
                                    {step.statusText}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 justify-center">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Đúng hạn</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Trễ hạn</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Đang xử lý</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-100"></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Chưa bắt đầu</span>
                </div>
              </div>
            </section>

            {/* Timeline View (Secondary) */}
            <section>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Lịch sử xử lý</h3>
              <div className="space-y-4 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-blue-100 border-4 border-white shadow-sm flex items-center justify-center z-10">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-800">{selectedProject.childStep || selectedProject.currentStep}</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-1">{selectedProject.currentAgency}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase">Đang xử lý</span>
                      <span className="text-[9px] font-bold text-slate-400">{selectedProject.deadline}</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative pl-10 opacity-60">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-emerald-100 border-4 border-white shadow-sm flex items-center justify-center z-10">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-800">Tiếp nhận hồ sơ và kiểm tra tính hợp lệ</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-1">Văn phòng Sở</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">Hoàn thành</span>
                      <span className="text-[9px] font-bold text-slate-400">15/03/2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="flex items-center justify-center h-full text-slate-400">Đang tải dữ liệu...</div>;

  return (
    <div className="h-full w-full max-w-7xl mx-auto bg-slate-100 shadow-2xl overflow-hidden relative sm:border-x border-slate-200">
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
          {view === 'steps' && <StepsStats />}
          {view === 'child-steps' && <ChildStepsStats />}
          {view === 'search-results' && <SearchResults />}
          {view === 'departments' && <DepartmentStats />}
          {view === 'projects' && <ProjectList />}
          {view === 'detail' && <ProjectDetail />}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 z-30">
        <div className="max-w-lg mx-auto flex justify-between items-center">
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
    </div>
  );
}
