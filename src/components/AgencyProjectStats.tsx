import React, { useState, useEffect } from 'react';
import { 
  Search, Building2, ChevronRight, ChevronLeft, 
  Clock, CheckCircle2, X, Edit3, Paperclip, 
  Upload, Trash2, File, Save,
  BarChart3, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_PROCESSES } from '../data/appData';

interface Project {
  id: string;
  code: string;
  name: string;
  investor: string;
  location: string;
  currentAgency: string;
  currentDepartment?: string;
  status: string;
  progress_status_2026?: string;
  stage?: string;
  parentStep?: string;
  childStep?: string;
  processId?: string;
}

interface Agency {
  id: string;
  name: string;
  departments: string[];
  displayOrder: number;
}

interface AgencyProjectStatsProps {
  projects?: Project[];
  processingAgencies: Agency[];
  projectStages?: string[];
  locations?: any[];
  investors?: string[];
  projectSteps?: string[];
  onProjectClick?: (project: any) => void;
}

export default function AgencyProjectStats({ 
  projects: initialProjects = [], 
  processingAgencies, 
  projectStages = [],
  locations = [],
  investors: initialInvestors = [],
  projectSteps = [],
  onProjectClick
}: AgencyProjectStatsProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'agencies' | 'departments' | 'investors' | 'projects' | 'steps' | 'child-steps' | 'processes'>('agencies');
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedInvestor, setSelectedInvestor] = useState<string | null>(null);
  const [selectedParentStep, setSelectedParentStep] = useState<string | null>(null);
  const [selectedChildStep, setSelectedChildStep] = useState<string | null>(null);
  const [selectedProjectStage, setSelectedProjectStage] = useState<string | null>(null);
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stepSearchTerm, setStepSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'delayed' | 'ontime'>('all');

  // Summary Stats
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

  const totalProjects = globalFilteredProjects.length;
  const overdueProjects = globalFilteredProjects.filter(p => p.status === 'Delayed' || p.status === 'Warning').length;
  const onTimeProjects = totalProjects - overdueProjects;
  
  // Progress Update State
  const [updatingProgressProject, setUpdatingProgressProject] = useState<Project | null>(null);
  const [updateContent, setUpdateContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const handleSaveProgress = async (project: Project, content: string) => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setProjects(prev => prev.map(p => p.id === project.id ? { ...p, progress_status_2026: content } : p));
    setUpdatingProgressProject(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setIsSaving(false);
  };

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
    {
      id: 'no-investor-stat',
      name: 'Chưa có chủ đầu tư',
      count: globalFilteredProjects.filter(p => p.investor === 'Chưa có chủ đầu tư').length,
      delayedCount: globalFilteredProjects.filter(p => p.investor === 'Chưa có chủ đầu tư' && (p.status === 'Delayed' || p.status === 'Warning')).length,
      subtext: 'dự án đang xử lý',
      color: 'bg-amber-50',
      iconColor: 'text-amber-500',
      departments: []
    }
  ];

  const getDepartmentStats = (agencyName: string, deptName: string) => {
    const deptProjects = globalFilteredProjects.filter(p => p.currentAgency === agencyName && p.currentDepartment === deptName);
    const delayed = deptProjects.filter(p => p.status === 'Delayed' || p.status === 'Warning').length;
    const ontime = deptProjects.length - delayed;
    let count = deptProjects.length;
    if (statusFilter === 'delayed') count = delayed;
    if (statusFilter === 'ontime') count = ontime;
    return {
      total: deptProjects.length,
      delayed,
      ontime,
      count
    };
  };

  const getInvestorStats = (investorName: string) => {
    const investorProjects = globalFilteredProjects.filter(p => p.investor === investorName);
    const delayed = investorProjects.filter(p => p.status === 'Delayed' || p.status === 'Warning').length;
    const ontime = investorProjects.length - delayed;
    let count = investorProjects.length;
    if (statusFilter === 'delayed') count = delayed;
    if (statusFilter === 'ontime') count = ontime;
    return {
      total: investorProjects.length,
      delayed,
      ontime,
      count
    };
  };

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

  const getParentStepStats = () => {
    const parentSteps = new Set<string>();
    let baseProjects = globalFilteredProjects;
    if (selectedProcess) {
      baseProjects = baseProjects.filter(p => p.processId === selectedProcess);
    } else if (selectedProjectStage) {
      baseProjects = baseProjects.filter(p => p.stage === selectedProjectStage || (p as any).stage === selectedProjectStage);
    }

    baseProjects.forEach(p => {
      if ((p as any).parentStep) parentSteps.add((p as any).parentStep);
    });

    return Array.from(parentSteps)
      .filter(stepName => stepName.toLowerCase().includes(stepSearchTerm.toLowerCase()))
      .map(stepName => {
        const stepProjects = baseProjects.filter(p => (p as any).parentStep === stepName);
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
    let baseProjects = globalFilteredProjects;
    if (selectedProcess) {
      baseProjects = baseProjects.filter(p => p.processId === selectedProcess);
    } else if (selectedProjectStage) {
      baseProjects = baseProjects.filter(p => p.stage === selectedProjectStage || (p as any).stage === selectedProjectStage);
    }

    baseProjects.forEach(p => {
      if ((p as any).parentStep === parentStepName && (p as any).childStep) childSteps.add((p as any).childStep);
    });

    return Array.from(childSteps)
      .filter(stepName => stepName.toLowerCase().includes(stepSearchTerm.toLowerCase()))
      .map(stepName => {
        const stepProjects = baseProjects.filter(p => (p as any).parentStep === parentStepName && (p as any).childStep === stepName);
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

  const investorsList = (initialInvestors.length > 0 ? initialInvestors : Array.from(new Set(projects.map(p => p.investor))).sort()).filter(i => i !== 'Chưa có chủ đầu tư');

  const filteredProjects = globalFilteredProjects.filter(p => {
    if (view === 'projects') {
      if (selectedChildStep) {
        let match = (p as any).childStep === selectedChildStep;
        if (selectedParentStep) match = match && (p as any).parentStep === selectedParentStep;
        if (selectedProcess) match = match && p.processId === selectedProcess;
        if (selectedProjectStage) match = match && (p.stage === selectedProjectStage || (p as any).stage === selectedProjectStage);
        return match;
      }
      if (selectedParentStep) {
        let match = (p as any).parentStep === selectedParentStep;
        if (selectedProcess) match = match && p.processId === selectedProcess;
        if (selectedProjectStage) match = match && (p.stage === selectedProjectStage || (p as any).stage === selectedProjectStage);
        return match;
      }
      if (selectedProjectStage) return (p as any).stage === selectedProjectStage || p.stage === selectedProjectStage;
      if (selectedProcess) return p.processId === selectedProcess;
      if (selectedInvestor) return p.investor === selectedInvestor;
      if (selectedDepartment) {
        return p.currentAgency === selectedAgency?.name && p.currentDepartment === selectedDepartment;
      }
      if (selectedAgency) return p.currentAgency === selectedAgency?.name;
      return true; // If no specific filter is selected, show all (e.g., when clicking summary cards)
    }
    return false;
  }).filter(p => {
    if (statusFilter === 'delayed') return p.status === 'Delayed' || p.status === 'Warning';
    if (statusFilter === 'ontime') return p.status === 'On Track';
    return true;
  });

  const handleBack = () => {
    if (view === 'projects') {
      if (selectedChildStep) {
        setView('child-steps');
        setSelectedChildStep(null);
      } else if (selectedParentStep) {
        setView('steps');
        setSelectedParentStep(null);
      } else if (selectedProjectStage) {
        setView('agencies');
        setSelectedProjectStage(null);
      } else if (selectedProcess) {
        setView('agencies');
        setSelectedProcess(null);
      } else if (selectedInvestor) {
        if (selectedInvestor === 'Chưa có chủ đầu tư') {
          setView('agencies');
        } else {
          setView('investors');
        }
        setSelectedInvestor(null);
      } else if (selectedDepartment) {
        setView('departments');
        setSelectedDepartment(null);
      } else {
        setView('agencies');
        setSelectedAgency(null);
      }
    } else if (view === 'child-steps') {
      setView('steps');
      setSelectedChildStep(null);
    } else if (view === 'steps') {
      if (selectedProcess) {
        setView('processes');
        setSelectedProcess(null);
      } else if (selectedProjectStage) {
        setView('agencies');
        setSelectedProjectStage(null);
      } else {
        setView('agencies');
      }
    } else if (view === 'departments' || view === 'investors' || view === 'processes') {
      setView('agencies');
      setSelectedAgency(null);
      setSelectedInvestor(null);
      setSelectedParentStep(null);
      setSelectedProjectStage(null);
      setSelectedProcess(null);
    }
    setStatusFilter('all');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-bold text-lg animate-pulse">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
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
      
      {/* Header - Styled like DashboardApp */}
      <div className="bg-[#1e40af] text-white p-6 sm:p-8 relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">THỐNG KÊ THEO CƠ QUAN</h1>
            <div className="flex items-center gap-2 mt-2 text-blue-100/80 text-sm font-bold tracking-widest uppercase">
              SỞ XÂY DỰNG TP.HCM
            </div>
          </div>
        </div>
        <div className="absolute inset-0 animate-shimmer opacity-20 pointer-events-none"></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm"
          >
            <CheckCircle2 size={18} />
            <span className="text-base font-bold">Cập nhật tiến độ thành công!</span>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {view === 'agencies' && (
            <motion.div 
              key="agency-overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Search Box */}
              <div className="space-y-6">
                <div className="relative">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm cơ quan, dự án..."
                    className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Summary Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setStatusFilter('all');
                    setView('projects');
                  }}
                  className={`bg-blue-50 p-6 rounded-2xl border ${statusFilter === 'all' ? 'border-blue-400 shadow-md ring-2 ring-blue-500/20' : 'border-blue-100 shadow-sm hover:border-blue-300'} flex flex-col items-center text-center cursor-pointer transition-all`}
                >
                  <span className="text-4xl font-black text-blue-700 tracking-tighter leading-none">{totalProjects}</span>
                  <span className="text-xs font-black text-blue-500 uppercase tracking-widest mt-2">Tổng dự án</span>
                </motion.div>
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setStatusFilter('delayed');
                    setView('projects');
                  }}
                  className={`bg-rose-50 p-6 rounded-2xl border ${statusFilter === 'delayed' ? 'border-rose-400 shadow-md ring-2 ring-rose-500/20' : 'border-rose-100 shadow-sm hover:border-rose-300'} flex flex-col items-center text-center cursor-pointer transition-all`}
                >
                  <span className="text-4xl font-black text-rose-700 tracking-tighter leading-none">{overdueProjects}</span>
                  <span className="text-xs font-black text-rose-500 uppercase tracking-widest mt-2">Quá hạn</span>
                </motion.div>
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setStatusFilter('ontime');
                    setView('projects');
                  }}
                  className={`bg-emerald-50 p-6 rounded-2xl border ${statusFilter === 'ontime' ? 'border-emerald-400 shadow-md ring-2 ring-emerald-500/20' : 'border-emerald-100 shadow-sm hover:border-emerald-300'} flex flex-col items-center text-center cursor-pointer transition-all`}
                >
                  <span className="text-4xl font-black text-emerald-700 tracking-tighter leading-none">{onTimeProjects}</span>
                  <span className="text-xs font-black text-emerald-500 uppercase tracking-widest mt-2">Còn hạn</span>
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
                            if (agency.id === 'investor-stat') {
                              setView('investors');
                            } else if (agency.id === 'no-investor-stat') {
                              setSelectedInvestor('Chưa có chủ đầu tư');
                              setView('projects');
                            } else {
                              setSelectedAgency(agency as any);
                              if (agency.departments && agency.departments.length > 0) {
                                setView('departments');
                              } else {
                                setView('projects');
                              }
                            }
                          }}
                          className={`${agency.color} p-4 rounded-2xl flex flex-col justify-between border border-white shadow-sm hover:shadow-md transition-all relative overflow-hidden h-28 cursor-pointer group`}
                        >
                          <div className="relative z-10 flex justify-between items-start gap-3">
                            <p className="text-sm font-bold text-slate-800 leading-tight line-clamp-2 flex-1 group-hover:text-blue-700 transition-colors">{agency.name}</p>
                            <span className={`text-2xl font-black ${agency.iconColor} tracking-tighter leading-none`}>{displayCount}</span>
                          </div>
                          
                          <div className="relative z-10 flex justify-between items-end mt-2">
                            {(statusFilter === 'all' || statusFilter === 'delayed') ? (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (agency.id === 'investor-stat') {
                                    setView('investors');
                                    setStatusFilter('delayed');
                                  } else if (agency.id === 'no-investor-stat') {
                                    setSelectedInvestor('Chưa có chủ đầu tư');
                                    setView('projects');
                                    setStatusFilter('delayed');
                                  } else {
                                    setSelectedAgency(agency as any);
                                    setStatusFilter('delayed');
                                    if (agency.departments && agency.departments.length > 0) {
                                      setView('departments');
                                    } else {
                                      setView('projects');
                                    }
                                  }
                                }}
                                className="flex flex-col items-start hover:scale-105 transition-transform"
                              >
                                <span className="text-2xl font-black text-rose-600 leading-none">{delayedCount > 0 ? delayedCount : '0'}</span>
                              </button>
                            ) : <div />}
                            {(statusFilter === 'all' || statusFilter === 'ontime') ? (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (agency.id === 'investor-stat') {
                                    setView('investors');
                                    setStatusFilter('ontime');
                                  } else if (agency.id === 'no-investor-stat') {
                                    setSelectedInvestor('Chưa có chủ đầu tư');
                                    setView('projects');
                                    setStatusFilter('ontime');
                                  } else {
                                    setSelectedAgency(agency as any);
                                    setStatusFilter('ontime');
                                    if (agency.departments && agency.departments.length > 0) {
                                      setView('departments');
                                    } else {
                                      setView('projects');
                                    }
                                  }
                                }}
                                className="flex flex-col items-end hover:scale-105 transition-transform"
                              >
                                <span className="text-2xl font-black text-emerald-600 leading-none">{onTimeCount > 0 ? onTimeCount : '0'}</span>
                              </button>
                            ) : <div />}
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              </div>

              {/* Statistics Grids */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Statistics by Process */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Thống kê theo quy trình</h2>
                    <button 
                      onClick={() => setView('processes')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest flex items-center gap-1"
                    >
                      Xem tất cả <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    {getProcessStats()
                      .slice(0, 5) // Show only top 5 on overview
                      .map((process, index) => {
                        return (
                          <div key={process.id} className={index !== 0 ? "pt-4 border-t border-slate-100" : ""}>
                            <p className="text-sm font-bold text-slate-800 leading-tight line-clamp-2 mb-3 min-h-[2.5rem] flex items-center">{process.name}</p>
                            <div className={`grid gap-3 ${statusFilter === 'all' ? 'grid-cols-3' : 'grid-cols-1'}`}>
                              {statusFilter === 'all' && (
                                <motion.button
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => {
                                    setSelectedProcess(process.id);
                                    setStatusFilter('all');
                                    setView('steps');
                                  }}
                                  className="bg-blue-50 hover:bg-blue-100 p-2 rounded-xl border border-blue-100 flex flex-col items-center transition-colors"
                                >
                                  <span className="text-2xl font-black text-blue-700 tracking-tighter leading-none">{process.total}</span>
                                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-1">Tổng</span>
                                </motion.button>
                              )}
                              {(statusFilter === 'all' || statusFilter === 'delayed') && (
                                <motion.button
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => {
                                    setSelectedProcess(process.id);
                                    setStatusFilter('delayed');
                                    setView('steps');
                                  }}
                                  className="bg-rose-50 hover:bg-rose-100 p-2 rounded-xl border border-rose-100 flex flex-col items-center transition-colors"
                                >
                                  <span className="text-2xl font-black text-rose-700 tracking-tighter leading-none">{process.delayed}</span>
                                  <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest mt-1">Quá hạn</span>
                                </motion.button>
                              )}
                              {(statusFilter === 'all' || statusFilter === 'ontime') && (
                                <motion.button
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => {
                                    setSelectedProcess(process.id);
                                    setStatusFilter('ontime');
                                    setView('steps');
                                  }}
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
                  </div>
                </div>

                {/* Statistics by Stage */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Thống kê theo giai đoạn</h2>
                  </div>
                  <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    {projectStages
                      .map(stage => {
                        const stageProjects = globalFilteredProjects.filter(p => p.stage === stage || (p as any).stage === stage);
                        return { name: stage, projects: stageProjects };
                      })
                      .filter(stage => stage.projects.length > 0)
                      .map((stage, index) => {
                        const stageProjects = stage.projects;
                        const delayed = stageProjects.filter(p => p.status === 'Delayed' || p.status === 'Warning').length;
                        const ontime = stageProjects.length - delayed;
                        const total = stageProjects.length;

                        return (
                          <div key={stage.name} className={index !== 0 ? "pt-4 border-t border-slate-100" : ""}>
                            <p className="text-sm font-bold text-slate-800 leading-tight line-clamp-2 mb-3 min-h-[2.5rem] flex items-center">{stage.name}</p>
                            <div className={`grid gap-3 ${statusFilter === 'all' ? 'grid-cols-3' : 'grid-cols-1'}`}>
                              {statusFilter === 'all' && (
                                <motion.button
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => {
                                    setSelectedProjectStage(stage.name);
                                    setStatusFilter('all');
                                    setView('steps');
                                  }}
                                  className="bg-blue-50 hover:bg-blue-100 p-2 rounded-xl border border-blue-100 flex flex-col items-center transition-colors"
                                >
                                  <span className="text-2xl font-black text-blue-700 tracking-tighter leading-none">{total}</span>
                                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-1">Tổng</span>
                                </motion.button>
                              )}
                              {(statusFilter === 'all' || statusFilter === 'delayed') && (
                                <motion.button
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => {
                                    setSelectedProjectStage(stage.name);
                                    setStatusFilter('delayed');
                                    setView('steps');
                                  }}
                                  className="bg-rose-50 hover:bg-rose-100 p-2 rounded-xl border border-rose-100 flex flex-col items-center transition-colors"
                                >
                                  <span className="text-2xl font-black text-rose-700 tracking-tighter leading-none">{delayed}</span>
                                  <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest mt-1">Quá hạn</span>
                                </motion.button>
                              )}
                              {(statusFilter === 'all' || statusFilter === 'ontime') && (
                                <motion.button
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => {
                                    setSelectedProjectStage(stage.name);
                                    setStatusFilter('ontime');
                                    setView('steps');
                                  }}
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
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'departments' && selectedAgency && (
            <motion.div 
              key="department-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <button onClick={handleBack} className="p-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 transition-all">
                  <ChevronLeft size={20} />
                </button>
                <div>
                  <h2 className="text-xl font-black text-slate-900 leading-tight">{selectedAgency.name}</h2>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Thống kê chi tiết phòng ban</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {selectedAgency.departments
                  .map(dept => ({ name: dept, stats: getDepartmentStats(selectedAgency.name, dept) }))
                  .filter(item => item.stats.count > 0)
                  .map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedDepartment(item.name);
                        setView('projects');
                      }}
                      className="bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-sm transition-all text-left group flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex-1 min-w-0 flex items-center justify-between px-2">
                        <div className="flex flex-col">
                          <h3 className="text-base font-black text-slate-800 truncate leading-tight group-hover:text-blue-600 transition-colors">{item.name}</h3>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">
                            Tổng số {item.stats.count} {statusFilter === 'all' ? 'dự án' : statusFilter === 'delayed' ? 'dự án quá hạn' : 'dự án còn hạn'}
                          </p>
                        </div>
                        <div className="flex items-center gap-6">
                          {(statusFilter === 'all' || statusFilter === 'ontime') && (
                            <div className="flex flex-col items-center">
                              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest leading-none mb-1">Còn hạn</span>
                              <span className="text-xl font-black text-emerald-600 leading-none">{item.stats.ontime}</span>
                            </div>
                          )}
                          {(statusFilter === 'all' || statusFilter === 'delayed') && (
                            <div className="flex flex-col items-center">
                              <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest leading-none mb-1">Quá hạn</span>
                              <span className="text-xl font-black text-rose-600 leading-none">{item.stats.delayed}</span>
                            </div>
                          )}
                          <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          )}

          {view === 'investors' && (
            <motion.div 
              key="investor-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <button onClick={handleBack} className="p-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 transition-all">
                  <ChevronLeft size={20} />
                </button>
                <div>
                  <h2 className="text-xl font-black text-slate-900 leading-tight">Chủ đầu tư</h2>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Thống kê dự án theo chủ đầu tư</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {investorsList
                  .map(investor => ({ name: investor, stats: getInvestorStats(investor) }))
                  .filter(item => item.stats.count > 0)
                  .map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedInvestor(item.name);
                        setView('projects');
                      }}
                      className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all text-left group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />
                      <div className="relative z-10">
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-110 transition-transform">
                          <Building2 size={20} />
                        </div>
                        <h3 className="text-base font-black text-slate-800 leading-tight mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">{item.name}</h3>
                        <div className="flex items-end justify-between mt-4">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              {statusFilter === 'all' ? 'Dự án' : statusFilter === 'delayed' ? 'Quá hạn' : 'Còn hạn'}
                            </p>
                            <p className="text-2xl font-black text-slate-900 tracking-tighter">{item.stats.count}</p>
                          </div>
                          <ChevronRight size={16} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </motion.div>
          )}

          {view === 'processes' && (
            <motion.div 
              key="processes-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <button onClick={handleBack} className="p-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 transition-all">
                    <ChevronLeft size={20} />
                  </button>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 leading-tight">Thống kê theo quy trình</h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Danh sách các quy trình</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {getProcessStats().map((process) => (
                  <motion.div
                    key={process.id}
                    className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                          <BarChart3 size={20} />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800 leading-tight">{process.name}</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            {process.count} {statusFilter === 'all' ? 'dự án' : statusFilter === 'delayed' ? 'dự án quá hạn' : 'dự án còn hạn'}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedProcess(process.id);
                          setView('steps');
                        }}
                        className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                    <div className={`grid gap-2 ${statusFilter === 'all' ? 'grid-cols-3' : 'grid-cols-1'}`}>
                      {statusFilter === 'all' && (
                        <button
                          onClick={() => {
                            setSelectedProcess(process.id);
                            setStatusFilter('all');
                            setView('steps');
                          }}
                          className="bg-blue-50/50 p-2 rounded-xl border border-blue-100/50 flex flex-col items-center"
                        >
                          <span className="text-lg font-black text-blue-700 tracking-tighter leading-none">{process.total}</span>
                          <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest mt-1">Tổng</span>
                        </button>
                      )}
                      {(statusFilter === 'all' || statusFilter === 'delayed') && (
                        <button
                          onClick={() => {
                            setSelectedProcess(process.id);
                            setStatusFilter('delayed');
                            setView('steps');
                          }}
                          className="bg-rose-50/50 p-2 rounded-xl border border-rose-100/50 flex flex-col items-center"
                        >
                          <span className="text-lg font-black text-rose-700 tracking-tighter leading-none">{process.delayed}</span>
                          <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest mt-1">Quá hạn</span>
                        </button>
                      )}
                      {(statusFilter === 'all' || statusFilter === 'ontime') && (
                        <button
                          onClick={() => {
                            setSelectedProcess(process.id);
                            setStatusFilter('ontime');
                            setView('steps');
                          }}
                          className="bg-emerald-50/50 p-2 rounded-xl border border-emerald-100/50 flex flex-col items-center"
                        >
                          <span className="text-lg font-black text-emerald-700 tracking-tighter leading-none">{process.ontime}</span>
                          <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mt-1">Còn hạn</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'steps' && (
            <motion.div 
              key="steps-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <button onClick={handleBack} className="p-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 transition-all">
                    <ChevronLeft size={20} />
                  </button>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 leading-tight">
                      {selectedProcess ? (INITIAL_PROCESSES.find(p => p.id === selectedProcess)?.name || 'Thống kê theo thủ tục') : 
                       selectedProjectStage ? `Giai đoạn: ${selectedProjectStage}` : 
                       'Thống kê theo thủ tục'}
                    </h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Danh sách các thủ tục hành chính</p>
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Tìm thủ tục..."
                    value={stepSearchTerm}
                    onChange={(e) => setStepSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none w-48 sm:w-64"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {getParentStepStats().map((step) => (
                  <motion.div
                    key={step.name}
                    className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                          <BarChart3 size={20} />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800 leading-tight">{step.name}</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            {step.count} {statusFilter === 'all' ? 'dự án' : statusFilter === 'delayed' ? 'dự án quá hạn' : 'dự án còn hạn'}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedParentStep(step.name);
                          setView('child-steps');
                          setStepSearchTerm('');
                        }}
                        className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                    <div className={`grid gap-2 ${statusFilter === 'all' ? 'grid-cols-3' : 'grid-cols-1'}`}>
                      {statusFilter === 'all' && (
                        <button
                          onClick={() => {
                            setSelectedParentStep(step.name);
                            setStatusFilter('all');
                            setView('projects');
                          }}
                          className="bg-blue-50/50 p-2 rounded-xl border border-blue-100/50 flex flex-col items-center"
                        >
                          <span className="text-lg font-black text-blue-700 tracking-tighter leading-none">{step.total}</span>
                          <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest mt-1">Tổng</span>
                        </button>
                      )}
                      {(statusFilter === 'all' || statusFilter === 'delayed') && (
                        <button
                          onClick={() => {
                            setSelectedParentStep(step.name);
                            setStatusFilter('delayed');
                            setView('projects');
                          }}
                          className="bg-rose-50/50 p-2 rounded-xl border border-rose-100/50 flex flex-col items-center"
                        >
                          <span className="text-lg font-black text-rose-700 tracking-tighter leading-none">{step.delayed}</span>
                          <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest mt-1">Quá hạn</span>
                        </button>
                      )}
                      {(statusFilter === 'all' || statusFilter === 'ontime') && (
                        <button
                          onClick={() => {
                            setSelectedParentStep(step.name);
                            setStatusFilter('ontime');
                            setView('projects');
                          }}
                          className="bg-emerald-50/50 p-2 rounded-xl border border-emerald-100/50 flex flex-col items-center"
                        >
                          <span className="text-lg font-black text-emerald-700 tracking-tighter leading-none">{step.ontime}</span>
                          <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mt-1">Còn hạn</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'child-steps' && (
            <motion.div 
              key="child-steps-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <button onClick={handleBack} className="p-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 transition-all">
                    <ChevronLeft size={20} />
                  </button>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 leading-tight">Chi tiết thủ tục</h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{selectedParentStep}</p>
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Tìm bước..."
                    value={stepSearchTerm}
                    onChange={(e) => setStepSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none w-48 sm:w-64"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {getChildStepStats(selectedParentStep || '').map((step) => (
                  <motion.div
                    key={step.name}
                    className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <Settings size={20} />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800 leading-tight">{step.name}</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            {step.count} {statusFilter === 'all' ? 'dự án' : statusFilter === 'delayed' ? 'dự án quá hạn' : 'dự án còn hạn'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className={`grid gap-2 ${statusFilter === 'all' ? 'grid-cols-3' : 'grid-cols-1'}`}>
                      {statusFilter === 'all' && (
                        <button
                          onClick={() => {
                            setSelectedChildStep(step.name);
                            setStatusFilter('all');
                            setView('projects');
                          }}
                          className="bg-blue-50/50 p-2 rounded-xl border border-blue-100/50 flex flex-col items-center"
                        >
                          <span className="text-lg font-black text-blue-700 tracking-tighter leading-none">{step.total}</span>
                          <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest mt-1">Tổng</span>
                        </button>
                      )}
                      {(statusFilter === 'all' || statusFilter === 'delayed') && (
                        <button
                          onClick={() => {
                            setSelectedChildStep(step.name);
                            setStatusFilter('delayed');
                            setView('projects');
                          }}
                          className="bg-rose-50/50 p-2 rounded-xl border border-rose-100/50 flex flex-col items-center"
                        >
                          <span className="text-lg font-black text-rose-700 tracking-tighter leading-none">{step.delayed}</span>
                          <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest mt-1">Quá hạn</span>
                        </button>
                      )}
                      {(statusFilter === 'all' || statusFilter === 'ontime') && (
                        <button
                          onClick={() => {
                            setSelectedChildStep(step.name);
                            setStatusFilter('ontime');
                            setView('projects');
                          }}
                          className="bg-emerald-50/50 p-2 rounded-xl border border-emerald-100/50 flex flex-col items-center"
                        >
                          <span className="text-lg font-black text-emerald-700 tracking-tighter leading-none">{step.ontime}</span>
                          <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mt-1">Còn hạn</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'projects' && (
            <motion.div 
              key="project-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <button onClick={handleBack} className="p-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 transition-all">
                  <ChevronLeft size={20} />
                </button>
                <div>
                  <h2 className="text-xl font-black text-slate-900 leading-tight">
                    {selectedChildStep || selectedParentStep || (selectedProcess ? INITIAL_PROCESSES.find(p => p.id === selectedProcess)?.name : null) || selectedProjectStage || selectedInvestor || selectedDepartment || selectedAgency?.name || 'Tất cả dự án'}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Danh sách dự án</p>
                    {selectedAgency && (
                      <>
                        <ChevronRight size={12} className="text-slate-300" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedAgency.name}</span>
                        {selectedDepartment && (
                          <>
                            <ChevronRight size={12} className="text-slate-300" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedDepartment}</span>
                          </>
                        )}
                      </>
                    )}
                    {selectedInvestor && (
                      <>
                        <ChevronRight size={12} className="text-slate-300" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedInvestor}</span>
                      </>
                    )}
                    {selectedProcess && (
                      <>
                        <ChevronRight size={12} className="text-slate-300" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{INITIAL_PROCESSES.find(p => p.id === selectedProcess)?.name || selectedProcess}</span>
                      </>
                    )}
                    {selectedProjectStage && (
                      <>
                        <ChevronRight size={12} className="text-slate-300" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedProjectStage}</span>
                      </>
                    )}
                    {selectedParentStep && (
                      <>
                        <ChevronRight size={12} className="text-slate-300" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedParentStep}</span>
                        {selectedChildStep && (
                          <>
                            <ChevronRight size={12} className="text-slate-300" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedChildStep}</span>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã DA</th>
                        <th className="text-left p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên dự án</th>
                        <th className="text-center p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                        <th className="text-center p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredProjects.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-12 text-center text-slate-400 font-medium italic">Không có dự án nào</td>
                        </tr>
                      ) : (
                        filteredProjects.map((project) => (
                          <tr 
                            key={project.id} 
                            className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                            onClick={() => {
                              if (onProjectClick) {
                                onProjectClick(project);
                              }
                            }}
                          >
                            <td className="p-4 text-xs font-bold text-slate-500">{project.code}</td>
                            <td className="p-4">
                              <p className="text-sm font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{project.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold mt-0.5">{project.investor}</p>
                            </td>
                            <td className="p-4 text-center">
                              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${
                                project.status === 'On Track' ? 'bg-emerald-50 text-emerald-600' :
                                project.status === 'Warning' ? 'bg-amber-50 text-amber-600' :
                                'bg-rose-50 text-rose-600'
                              }`}>
                                {project.status === 'On Track' ? 'Đúng hạn' : project.status === 'Warning' ? 'Cảnh báo' : 'Quá hạn'}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setUpdatingProgressProject(project);
                                  setUpdateContent(project.progress_status_2026 || '');
                                  setAttachments([]);
                                }}
                                className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all mx-auto"
                              >
                                <Clock size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Update Modal */}
      <AnimatePresence>
        {updatingProgressProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-emerald-50/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Cập nhật tiến độ dự án</h3>
                    <p className="text-base font-medium text-slate-500 mt-1">{updatingProgressProject.name}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setUpdatingProgressProject(null)}
                  className="p-2 hover:bg-white rounded-2xl text-slate-400 hover:text-slate-600 transition-all shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Edit3 size={14} className="text-emerald-500" />
                    Nội dung cập nhật
                  </label>
                  <textarea 
                    rows={5}
                    placeholder="Nhập chi tiết tiến độ thực tế hiện tại của dự án..."
                    value={updateContent}
                    onChange={(e) => setUpdateContent(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[24px] text-base outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all resize-none font-medium"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Paperclip size={14} className="text-emerald-500" />
                    Đính kèm danh sách file liên quan
                  </label>
                  
                  <div className="border-2 border-dashed border-slate-200 rounded-[24px] p-8 flex flex-col items-center justify-center gap-3 bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-300 transition-all cursor-pointer group relative">
                    <input 
                      type="file" 
                      multiple 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={(e) => {
                        if (e.target.files) {
                          setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
                        }
                      }}
                    />
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-emerald-500 group-hover:scale-110 transition-all shadow-sm">
                      <Upload size={24} />
                    </div>
                    <div className="text-center">
                      <p className="text-base font-bold text-slate-700">Kéo thả hoặc Click để tải lên</p>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Hỗ trợ PDF, DOCX, XLSX, JPG (Tối đa 10MB)</p>
                    </div>
                  </div>

                  {attachments.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {attachments.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm group">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                              <File size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-700 truncate max-w-[300px]">{file.name}</p>
                              <p className="text-xs text-slate-400 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                            className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setUpdatingProgressProject(null)}
                  className="px-6 py-2.5 text-base font-bold text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={() => {
                    if (updatingProgressProject) {
                      handleSaveProgress(updatingProgressProject, updateContent);
                    }
                  }}
                  disabled={isSaving || !updateContent.trim()}
                  className="px-8 py-2.5 bg-emerald-600 text-white rounded-2xl text-base font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? <Clock size={18} className="animate-spin" /> : <Save size={18} />}
                  Cập nhật tiến độ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
