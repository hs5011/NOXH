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
  projectCategories?: string[];
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
  investors = [],
  projectCategories = []
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
  const [stepFilter, setStepFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    // Reset filters
    setSearchTerm('');
    setProcessFilter('');
    setGroupFilter('');
    setFundingFilter('');
    setLocationFilter('');
    setFollowerFilter('');
    setInvestorFilter('');
    setStageFilter('');
    setStepFilter('');
    setStatusFilter('');
    setCategoryFilter('');

    if (filter) {
      if (filter.searchTerm) setSearchTerm(filter.searchTerm);
      if (filter.status) setStatusFilter(filter.status);
      if (filter.step) setStepFilter(filter.step);
      if (filter.region) setLocationFilter(filter.region);
      if (filter.investor) setInvestorFilter(filter.investor);
      if (filter.stage) setStageFilter(filter.stage);
      if (filter.alert) setStatusFilter(filter.alert === 'Delayed' ? 'Delayed' : filter.alert);
      if (filter.id) setSearchTerm(filter.id);
    }
    
    setProjects(initialProjects);
  }, [filter, initialProjects]);


  const filteredProjects = projects.filter(p => {
    const searchMatch = searchTerm === '' || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.investor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.location && p.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.id === searchTerm;
    
    const processMatch = processFilter === '' || p.processId === processFilter;
    const groupMatch = groupFilter === '' || p.projectGroup === groupFilter;
    const fundingMatch = fundingFilter === '' || p.fundingSource === fundingFilter;
    const locationMatch = locationFilter === '' || (p.location && p.location.includes(locationFilter));
    const followerMatch = followerFilter === '' || p.follower === followerFilter;
    const investorMatch = investorFilter === '' || p.investor === investorFilter;
    const stageMatch = stageFilter === '' || p.stage === stageFilter;
    const stepMatch = stepFilter === '' || p.childStep === stepFilter || p.currentStep === stepFilter;
    const statusMatch = statusFilter === '' || p.status === statusFilter || (statusFilter === 'Delayed' && p.status === 'Warning');
    const categoryMatch = !categoryFilter || p.projectCategory === categoryFilter;

    return searchMatch && processMatch && groupMatch && fundingMatch && locationMatch && followerMatch && investorMatch && stageMatch && stepMatch && statusMatch && categoryMatch;
  });

  const getStepDateKey = (stepName: string, parentName: string = "", isInvestor: boolean = false) => {
    const lowerStep = stepName?.toLowerCase() || "";
    const lowerParent = parentName?.toLowerCase() || "";
    const combined = (lowerStep + " " + lowerParent).toLowerCase();
    
    const suffix = isInvestor ? "_cdt_date" : "_nn_date";
    
    if (combined.includes("chủ trương")) return "chutruong" + suffix;
    if (combined.includes("quy hoạch")) return "qh1500" + suffix;
    if (combined.includes("giao đất") || combined.includes("thuê đất") || combined.includes("qd giao đất")) return "qdgiaodat" + suffix;
    if (combined.includes("bc nckt") || combined.includes("nghiên cứu khả thi") || combined.includes("thẩm duyệt bc nckt")) return "baocaonckt" + suffix;
    if (combined.includes("pccc")) return "pccc" + suffix;
    if (combined.includes("hạ tầng kỹ thuật") || combined.includes("htkt")) return "htkt_dtm" + suffix;
    if (combined.includes("giấy phép xây dựng") || combined.includes("gpxd")) return "gpxaydung" + suffix;
    
    // Fallback for public investment specific steps if they don't have their own keys
    if (combined.includes("nhiệm vụ chuẩn bị đầu tư")) return "chutruong" + suffix;
    
    return null;
  };

  const getProjectStatusDetails = (p: any) => {
    const process = processes.find(proc => proc.id === p.processId);
    if (!process) return [];

    const allSteps: any[] = [];
    process.parentSteps.forEach(ps => {
      ps.childSteps.forEach(cs => {
        // Try to get data from structured milestone/plan first
        const m = p.milestones?.[cs.id];
        const plan = p.implementationPlan?.[cs.id];
        
        let invDeadline = m?.investor;
        let agyDeadline = m?.agency;
        let actual = plan?.agencyActualDate;

        // Fallback to flat props from appData.ts / DashboardApp pattern
        if (!invDeadline) {
          const invKey = getStepDateKey(cs.name, ps.name, true);
          if (invKey && p[invKey]) invDeadline = p[invKey];
        }
        if (!agyDeadline) {
          const agyKey = getStepDateKey(cs.name, ps.name, false);
          if (agyKey && p[agyKey]) agyDeadline = p[agyKey];
        }

        // If deadline is 'X' in initial data, it might mean it's already done
        if ((invDeadline === 'X' || agyDeadline === 'X') && !actual) {
          actual = 'X';
        }

        allSteps.push({ 
          id: cs.id, 
          parentId: ps.id,
          name: cs.name, 
          agency: cs.agency, 
          parentName: ps.name,
          stage: ps.stage,
          investorDeadline: invDeadline,
          agencyDeadline: agyDeadline,
          actualDate: actual
        });
      });
    });

    // Priority 1: Match the currentStep name or childStep name from project data
    const currentStepInProcess = allSteps.find(s => 
      s.name === p.currentStep || s.name === p.childStep
    );
    if (currentStepInProcess) {
      return [currentStepInProcess];
    }

    // Priority 2: Fuzzy match - check if currentStep and process step share similar starting words
    const fuzzyMatch = allSteps.find(s => {
      if (!p.currentStep && !p.childStep) return false;
      const sName = s.name.toLowerCase();
      const pCurrent = p.currentStep?.toLowerCase() || "";
      const pChild = p.childStep?.toLowerCase() || "";
      
      // Check if one contains the other
      if (sName.includes(pCurrent) || pCurrent.includes(sName)) return true;
      if (sName.includes(pChild) || pChild.includes(sName)) return true;
      
      // Check if they start with the same verb (e.g. "Thẩm định")
      const sWords = sName.split(' ').filter(w => w.length > 2);
      const pWords = pCurrent.split(' ').filter(w => w.length > 2);
      if (sWords[0] === pWords[0] && sWords[0] !== undefined) return true;
      
      return false;
    });
    if (fuzzyMatch) {
      return [fuzzyMatch];
    }

    // Priority 3: Find the first step that is not completed and has a deadline
    const firstIncompleteWithDeadline = allSteps.find(s => 
      (!s.actualDate || s.actualDate === '-' || s.actualDate === '') && 
      (s.agencyDeadline && s.agencyDeadline !== 'X' && s.agencyDeadline !== '-')
    );
    if (firstIncompleteWithDeadline) {
      return [firstIncompleteWithDeadline];
    }

    // Priority 4: Find the first step that is not completed
    const firstIncomplete = allSteps.find(s => !s.actualDate || s.actualDate === '-' || s.actualDate === '');
    if (firstIncomplete) {
      return [firstIncomplete];
    }
    
    // Priority 5: Return the last step if all are completed
    if (allSteps.length > 0) {
      return [allSteps[allSteps.length - 1]];
    }

    return [];
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateStr;
    }
  };

  const parseVNDate = (dateStr: string) => {
    if (!dateStr || dateStr === 'X' || dateStr === '-') return null;
    const parts = dateStr.split('/');
    if (parts.length !== 3) {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? null : d;
    }
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const year = parseInt(parts[2]);
    const fullYear = year < 100 ? 2000 + year : year;
    return new Date(fullYear, month, day);
  };

  const isDelayed = (deadline: string, actual: string) => {
    if (actual && actual !== '-') return false;
    if (!deadline || deadline === 'X') return false;
    
    const deadlineDate = parseVNDate(deadline);
    if (!deadlineDate) return false;
    
    return new Date() > deadlineDate;
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
      ...filteredProjects.map(p => [p.code, `"${p.name}"`, `"${p.investor}"`, p.processId, p.fundingSource, formatDate(p.deadline)].join(','))
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
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {statusFilter === 'Delayed' ? 'KH bị chậm' : statusFilter === 'On Track' ? 'CQNN đang xử lý' : 'Danh sách Dự án NOXH'}
          </h2>
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
            {Array.from(new Set([
              ...locations.map(l => l.ward),
              ...locations.map(l => l.oldArea)
            ])).filter(Boolean).sort().map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)} 
            className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer appearance-none"
          >
            <option value="">Phân loại dự án</option>
            {projectCategories.map(pc => <option key={pc} value={pc}>{pc}</option>)}
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
        <div className="relative">
          <select 
            value={stepFilter} 
            onChange={(e) => setStepFilter(e.target.value)} 
            className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer appearance-none"
          >
            <option value="">Thủ tục</option>
            {Array.from(new Set([
              ...projectSteps,
              ...processes.flatMap(p => p.parentSteps.flatMap(ps => ps.childSteps.map(cs => cs.name)))
            ])).filter(Boolean).sort().map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)} 
            className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer appearance-none"
          >
            <option value="">Trạng thái</option>
            <option value="On Track">Đúng tiến độ</option>
            <option value="Delayed">Trễ hạn</option>
            <option value="Warning">Cảnh báo</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header Row */}
        <div className="bg-slate-50 border-b border-slate-100 flex items-center justify-between px-5 py-3">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-12">Thông tin dự án & Tiến độ</div>
        </div>

        {/* Project Cards List */}
        <div className="divide-y divide-slate-100">
          {paginatedProjects.length > 0 ? paginatedProjects.map((p) => {
            const statusDetails = getProjectStatusDetails(p);
            return (
              <div key={p.id} className="p-3 sm:p-4 hover:bg-slate-50/50 transition-all flex flex-col group relative">
                {/* Project Info Section */}
                <div className="w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100">
                        <CheckCircle2 size={14} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                          {p.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-tighter">{p.code}</span>
                          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                            <MapPin size={10} /> {p.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 shrink-0 ml-9 sm:ml-0">
                      {[
                        { icon: Calendar, color: 'orange', action: onUpdatePlanClick, label: 'Kế hoạch' },
                        { icon: Pencil, color: 'blue', action: onEditClick, label: 'Sửa' },
                        { icon: Trash2, color: 'rose', action: onDeleteClick, label: 'Xóa' }
                      ].map((btn, bIdx) => (
                        <div key={bIdx} className="relative group/action">
                          <button 
                            onClick={(e) => { e.stopPropagation(); btn.action?.(p); }}
                            className={`w-8 h-8 flex items-center justify-center text-slate-400 hover:text-${btn.color}-600 hover:bg-${btn.color}-50 rounded-lg transition-all`}
                          >
                            <btn.icon size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Steps Nested Cards */}
                  <div className="ml-0 sm:ml-9 space-y-2">
                    {statusDetails.map((step: any) => {
                      const currentStageIndex = projectStages.indexOf(step.stage);

                      return (
                        <div key={step.id} className="bg-white rounded-xl border border-slate-100 p-3 sm:p-4 shadow-sm hover:shadow-md transition-all border-l-4 border-l-blue-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            {/* Compressed Stage Indicators */}
                            <div className="flex items-center gap-1.5 mb-2 overflow-x-auto scrollbar-hide pb-1">
                              {projectStages.map((stage, idx) => {
                                const isCurrentStage = idx === currentStageIndex;
                                const isCompletedStage = idx < currentStageIndex;
                                return (
                                  <div key={stage} className={`h-1 flex-1 min-w-[20px] rounded-full ${
                                    isCompletedStage ? 'bg-emerald-500' : isCurrentStage ? 'bg-blue-500' : 'bg-slate-100'
                                  }`} title={stage} />
                                );
                              })}
                            </div>
                            
                            <div className="space-y-0.5">
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Bước hiện tại</p>
                              <h4 className="text-sm font-black text-slate-900 leading-tight truncate">{step.name}</h4>
                              <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{step.agency || 'N/A'}</span>
                                <div className="flex items-center gap-1.5 text-[11px] font-bold">
                                  <span className="text-slate-400 uppercase tracking-tighter">Hạn xử lý:</span>
                                  <span className={getStatusColorClass(step.agencyDeadline, step.actualDate)}>
                                    {formatDate(step.agencyDeadline)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <button 
                            onClick={(e) => { e.stopPropagation(); onHousingUpdateClick?.(p, step.parentId, step.id); }}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm border border-blue-700 group/btn shrink-0"
                          >
                            <GitBranch size={14} className="group-hover/btn:rotate-12 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Cập nhật</span>
                          </button>
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

