import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, ChevronRight, MapPin, 
  Building2, Calendar, Clock, AlertCircle, Plus,
  Pencil, Trash2, ChevronLeft, Download, GitBranch, ChevronDown,
  CheckCircle2
} from 'lucide-react';

import { Agency } from './AgencyManagement';

import { Process } from './StepManagementView';

interface ProjectListProps {
  projects?: any[];
  onProjectClick?: (project: any) => void;
  onEditClick?: (project: any) => void;
  onDeleteClick?: (project: any) => void;
  onUpdateProgressClick?: (project: any) => void;
  onHousingUpdateClick?: (project: any, stepId?: string, subStepId?: string) => void;
  onUpdatePlanClick?: (project: any) => void;
  onCreateClick?: () => void;
  filter?: any;
  key?: React.Key;
  projectStages?: string[];
  projectSteps?: string[];
  processingAgencies?: Agency[];
  locations?: { ward: string, oldArea: string }[];
  processes?: Process[];
  projectGroups?: string[];
  fundingSources?: string[];
  followers?: string[];
  investors?: string[];
}

export default function ProjectList({ 
  projects: initialProjects = [],
  onProjectClick, 
  onEditClick, 
  onDeleteClick, 
  onUpdateProgressClick,
  onHousingUpdateClick,
  onUpdatePlanClick,
  onCreateClick, 
  filter,
  projectStages = [],
  projectSteps = [],
  processingAgencies = [],
  locations = [],
  processes = [],
  projectGroups = [],
  fundingSources = [],
  followers = [],
  investors = []
}: ProjectListProps) {
  const [projects, setProjects] = useState<any[]>(initialProjects);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // New filters
  const [processFilter, setProcessFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [fundingFilter, setFundingFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [followerFilter, setFollowerFilter] = useState('');
  const [investorFilter, setInvestorFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('');

  useEffect(() => {
    let filtered = initialProjects;
    if (filter) {
      if (filter.searchTerm) {
        setSearchTerm(filter.searchTerm);
      }
      
      if (filter.id) {
        filtered = initialProjects.filter((p: any) => p.id === filter.id);
      } else if (filter.status) {
        filtered = initialProjects.filter((p: any) => p.status === filter.status);
      } else if (filter.isKeyProject) {
        filtered = initialProjects.filter((p: any) => p.isKeyProject);
      } else if (filter.step) {
        filtered = initialProjects.filter((p: any) => p.currentStep === filter.step);
      } else if (filter.alert) {
        filtered = initialProjects.filter((p: any) => p.status === 'Delayed' || p.alert === filter.alert);
      } else if (filter.region) {
        filtered = initialProjects.filter((p: any) => p.location.includes(filter.region));
      }
    } else {
      setSearchTerm('');
    }
    setProjects(filtered);
  }, [filter, initialProjects]);


  const filteredProjects = projects.filter(p => {
    const searchMatch = searchTerm === '' || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.investor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.location && p.location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const processMatch = processFilter === '' || p.processId === processFilter;
    const groupMatch = groupFilter === '' || p.projectGroup === groupFilter;
    const fundingMatch = fundingFilter === '' || p.fundingSource === fundingFilter;
    const locationMatch = locationFilter === '' || p.location === locationFilter;
    const followerMatch = followerFilter === '' || p.follower === followerFilter;
    const investorMatch = investorFilter === '' || p.investor === investorFilter;
    const stageMatch = stageFilter === '' || p.stage === stageFilter;

    return searchMatch && processMatch && groupMatch && fundingMatch && locationMatch && followerMatch && investorMatch && stageMatch;
  });

  const getProjectStatusDetails = (p: any) => {
    const process = processes.find(proc => proc.id === p.processId);
    if (!process) return [];

    const allSteps: any[] = [];
    process.parentSteps.forEach(ps => {
      ps.childSteps.forEach(cs => {
        const m = p.milestones?.[cs.id];
        const actual = p.implementationPlan?.[cs.id]?.agencyActualDate;
        allSteps.push({ 
          id: cs.id, 
          parentId: ps.id,
          name: cs.name, 
          agency: cs.agency, 
          parentName: ps.name,
          stage: ps.stage, // Added stage property
          investorDeadline: m?.investor,
          agencyDeadline: m?.agency,
          actualDate: actual
        });
      });
    });

    const activeSteps = allSteps.filter(s => !s.actualDate);
    
    // If project has more than 2 steps in total, show all active steps
    // Otherwise show only the first active step
    if (allSteps.length > 2) {
      if (activeSteps.length === 0 && allSteps.length > 0) {
        return [allSteps[allSteps.length - 1]];
      }
      return activeSteps;
    } else {
      if (activeSteps.length > 0) return [activeSteps[0]];
      if (allSteps.length > 0) return [allSteps[allSteps.length - 1]];
      return [];
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('vi-VN');
    } catch (e) {
      return dateStr;
    }
  };

  const isDelayed = (deadline: string, actual: string) => {
    if (actual) return false;
    if (!deadline) return false;
    return new Date() > new Date(deadline);
  };

  const isCompleted = (actual: string) => !!actual;

  const getStatusColorClass = (deadline: string, actual: string) => {
    if (isCompleted(actual)) return 'text-emerald-600 font-bold';
    if (isDelayed(deadline, actual)) return 'text-rose-600 font-bold';
    return 'text-slate-600';
  };

  const exportToCSV = () => {
    const headers = ['Mã dự án', 'Tên dự án', 'Chủ đầu tư', 'Quy trình', 'Nguồn vốn', 'Hạn chót'];
    const csvContent = [
      headers.join(','),
      ...filteredProjects.map(p => [p.code, `"${p.name}"`, `"${p.investor}"`, p.processId, p.fundingSource, p.deadline].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'danh_sach_du_an.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Đang tải dữ liệu...</div>;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Danh sách Dự án NOXH</h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Đang hiển thị {filteredProjects.length} dự án
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button 
            onClick={exportToCSV}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
          >
            <Download size={16} /> <span className="hidden xs:inline">Xuất báo cáo</span><span className="xs:hidden">Xuất</span>
          </button>
          <button 
            onClick={onCreateClick}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
          >
            <Plus size={16} /> <span className="hidden xs:inline">Khởi tạo Dự án</span><span className="xs:hidden">Thêm mới</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
          />
        </div>
        <div className="relative">
          <select 
            value={processFilter} 
            onChange={(e) => setProcessFilter(e.target.value)} 
            className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer appearance-none"
          >
            <option value="">Quy trình</option>
            {processes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select 
            value={groupFilter} 
            onChange={(e) => setGroupFilter(e.target.value)} 
            className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer appearance-none"
          >
            <option value="">Nhóm dự án</option>
            {projectGroups.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select 
            value={fundingFilter} 
            onChange={(e) => setFundingFilter(e.target.value)} 
            className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer appearance-none"
          >
            <option value="">Nguồn vốn</option>
            {fundingSources.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select 
            value={locationFilter} 
            onChange={(e) => setLocationFilter(e.target.value)} 
            className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer appearance-none"
          >
            <option value="">Địa điểm</option>
            {locations.map(loc => <option key={loc.ward} value={loc.ward}>{loc.ward}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select 
            value={followerFilter} 
            onChange={(e) => setFollowerFilter(e.target.value)} 
            className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer appearance-none"
          >
            <option value="">Người theo dõi</option>
            {followers.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select 
            value={investorFilter} 
            onChange={(e) => setInvestorFilter(e.target.value)} 
            className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer appearance-none"
          >
            <option value="">Chủ đầu tư</option>
            {investors.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select 
            value={stageFilter} 
            onChange={(e) => setStageFilter(e.target.value)} 
            className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer appearance-none"
          >
            <option value="">Giai đoạn</option>
            {projectStages.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        {/* Header Row */}
        <div className="bg-slate-50/50 border-b border-slate-100 flex items-center justify-between px-4 sm:px-10 py-3 sm:py-5">
          <div className="text-[11px] sm:text-[13px] font-black text-slate-400 uppercase tracking-[0.1em] sm:tracking-[0.2em] ml-10 sm:ml-16">Thông tin dự án & Tiến độ</div>
        </div>

        {/* Project Cards List */}
        <div className="divide-y divide-slate-100">
          {paginatedProjects.length > 0 ? paginatedProjects.map((p) => {
            const statusDetails = getProjectStatusDetails(p);
            return (
              <div key={p.id} className="p-4 sm:p-8 hover:bg-blue-50/10 transition-all flex flex-col group relative">
                {/* Project Info Section */}
                <div className="w-full">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-5 mb-4 sm:mb-8">
                    <div className="flex items-start gap-3 sm:gap-5">
                      <div className="mt-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
                        <CheckCircle2 size={14} className="sm:hidden" />
                        <CheckCircle2 size={18} className="hidden sm:block" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg sm:text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight mb-1">
                          {p.name} <span className="text-slate-400 font-medium block sm:inline">— {p.location}</span>
                        </h3>
                        <p className="text-[10px] sm:text-sm text-slate-400 font-bold uppercase tracking-[0.1em] sm:tracking-[0.15em]">{p.code}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-9 sm:ml-0">
                      <div className="relative group/action">
                        <button 
                          onClick={(e) => { e.stopPropagation(); onUpdatePlanClick?.(p); }}
                          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
                        >
                          <Calendar size={20} />
                        </button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 invisible group-hover/action:opacity-100 group-hover/action:visible transition-all whitespace-nowrap z-50">
                          Kế hoạch
                        </div>
                      </div>

                      <div className="relative group/action">
                        <button 
                          onClick={(e) => { e.stopPropagation(); onEditClick?.(p); }}
                          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <Pencil size={20} />
                        </button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 invisible group-hover/action:opacity-100 group-hover/action:visible transition-all whitespace-nowrap z-50">
                          Sửa
                        </div>
                      </div>

                      <div className="relative group/action">
                        <button 
                          onClick={(e) => { e.stopPropagation(); onDeleteClick?.(p); }}
                          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 invisible group-hover/action:opacity-100 group-hover/action:visible transition-all whitespace-nowrap z-50">
                          Xóa
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Steps Nested Cards */}
                  <div className="ml-0 sm:ml-12 space-y-4 sm:space-y-5">
                    {statusDetails.map((step: any) => {
                      const currentProcess = processes.find(proc => proc.id === p.processId);
                      const currentStageIndex = projectStages.indexOf(step.stage);

                      return (
                        <div key={step.id} className="bg-white rounded-[20px] sm:rounded-[24px] border border-slate-100 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all border-l-4 border-l-blue-500">
                          {/* Step Header: Timeline */}
                          <div className="flex items-center justify-between mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-hide">
                            <div className="flex items-center gap-4 sm:gap-8 min-w-max">
                              <div className="flex items-center gap-3 sm:gap-5">
                                {projectStages.map((stage, idx) => {
                                  const isCurrentStage = idx === currentStageIndex;
                                  const isCompleted = idx < currentStageIndex;
                                  
                                  return (
                                    <React.Fragment key={stage}>
                                      <div className="flex items-center gap-2.5 relative group/stage">
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 invisible group-hover/stage:opacity-100 group-hover/stage:visible transition-all whitespace-nowrap z-50 shadow-xl">
                                          {stage}
                                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-slate-900" />
                                        </div>

                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                          isCompleted 
                                            ? 'bg-emerald-500 border border-emerald-600' 
                                            : isCurrentStage
                                              ? 'bg-blue-500 border border-blue-600'
                                              : 'bg-slate-200 border border-slate-300'
                                        }`}>
                                          {isCompleted ? (
                                            <CheckCircle2 size={14} className="text-white" />
                                          ) : isCurrentStage ? (
                                            <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                                          ) : (
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                          )}
                                        </div>
                                        {isCurrentStage && (
                                          <span className="text-[11px] font-black uppercase tracking-widest text-blue-600">
                                            {stage}
                                          </span>
                                        )}
                                      </div>
                                      {idx < projectStages.length - 1 && <div className={`h-[2px] w-4 ${isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
                                    </React.Fragment>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Step Details */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-10">
                            <div className="flex-1 space-y-1 sm:space-y-2">
                              <p className="text-sm sm:text-base font-bold text-slate-700">
                                Bước hiện tại: <span className="text-slate-900">{step.name}</span>
                              </p>
                              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-500 font-bold">
                                <span className="text-blue-600">{step.agency || 'N/A'}</span>
                                <span className="hidden sm:inline text-slate-200">|</span>
                                <span className="uppercase tracking-widest text-[9px] sm:text-[11px]">HXL:</span>
                                <span className={getStatusColorClass(step.agencyDeadline, step.actualDate)}>
                                  {formatDate(step.agencyDeadline)}
                                </span>
                              </div>
                            </div>

                            <div className="relative group/tooltip shrink-0">
                              <button 
                                onClick={(e) => { e.stopPropagation(); onHousingUpdateClick?.(p, step.parentId, step.id); }}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100 group/btn"
                              >
                                <GitBranch size={16} className="sm:size-[18px] group-hover/btn:rotate-12 transition-transform" />
                                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">Cập nhật tiến độ</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="px-6 py-20 text-center text-slate-400 italic text-lg bg-white">
              Không tìm thấy dự án nào phù hợp...
            </div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-8 py-4 sm:py-6 bg-white border border-slate-200 rounded-[24px] sm:rounded-[32px] shadow-lg shadow-slate-100 mt-6">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Trang hiện tại</p>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
              Hiển thị <span className="text-slate-900 font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-slate-900 font-bold">{Math.min(currentPage * itemsPerPage, filteredProjects.length)}</span> / <span className="text-slate-900 font-bold">{filteredProjects.length}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 sm:p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl sm:rounded-2xl transition-all disabled:opacity-30 disabled:hover:bg-transparent border border-transparent hover:border-blue-100"
            >
              <ChevronLeft size={18} className="sm:size-5" />
            </button>
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl sm:rounded-2xl border border-slate-100 overflow-x-auto max-w-[150px] sm:max-w-none">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`min-w-[32px] sm:min-w-[40px] h-8 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all ${
                    currentPage === page 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                      : 'text-slate-500 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 sm:p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl sm:rounded-2xl transition-all disabled:opacity-30 disabled:hover:bg-transparent border border-transparent hover:border-blue-100"
            >
              <ChevronRight size={18} className="sm:size-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

