import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, ChevronRight, MapPin, 
  Building2, Calendar, Clock, AlertCircle, Plus,
  Pencil, Trash2, ChevronLeft, Download, GitBranch, ChevronDown
} from 'lucide-react';

import { Agency } from './AgencyManagement';

import { Process } from './StepManagementView';
import { fetchJson } from '../services/apiService';

interface ProjectListProps {
  onProjectClick?: (project: any) => void;
  onEditClick?: (project: any) => void;
  onDeleteClick?: (project: any) => void;
  onUpdateProgressClick?: (project: any) => void;
  onHousingUpdateClick?: (project: any) => void;
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
}

export default function ProjectList({ 
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
  followers = []
}: ProjectListProps) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // New filters
  const [processFilter, setProcessFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [fundingFilter, setFundingFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [followerFilter, setFollowerFilter] = useState('');

  useEffect(() => {
    fetchJson('/api/v1/projects')
      .then(data => {
        let filtered = data;
        if (filter) {
          if (filter.id) {
            filtered = data.filter((p: any) => p.id === filter.id);
          } else if (filter.status) {
            filtered = data.filter((p: any) => p.status === filter.status);
          } else if (filter.isKeyProject) {
            filtered = data.filter((p: any) => p.isKeyProject);
          } else if (filter.step) {
            filtered = data.filter((p: any) => p.currentStep === filter.step);
          } else if (filter.alert) {
            filtered = data.filter((p: any) => p.status === 'Delayed' || p.alert === filter.alert);
          } else if (filter.region) {
            filtered = data.filter((p: any) => p.location.includes(filter.region));
          }
        }
        setProjects(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error('ProjectList fetch error:', err);
        setLoading(false);
      });
  }, [filter]);

  const filteredProjects = projects.filter(p => {
    const searchMatch = searchTerm === '' || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.investor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const processMatch = processFilter === '' || p.processId === processFilter;
    const groupMatch = groupFilter === '' || p.projectGroup === groupFilter;
    const fundingMatch = fundingFilter === '' || p.fundingSource === fundingFilter;
    const locationMatch = locationFilter === '' || p.location === locationFilter;
    const followerMatch = followerFilter === '' || p.follower === followerFilter;

    return searchMatch && processMatch && groupMatch && fundingMatch && locationMatch && followerMatch;
  });

  const getProjectStatusDetails = (p: any) => {
    const process = processes.find(proc => proc.id === p.processId);
    if (!process) return null;

    const allSteps: { id: string, name: string, agency?: string, parentName: string }[] = [];
    process.parentSteps.forEach(ps => {
      allSteps.push({ id: ps.id, name: ps.name, parentName: ps.name });
      ps.childSteps.forEach(cs => {
        allSteps.push({ id: cs.id, name: cs.name, agency: cs.agency, parentName: ps.name });
      });
    });

    let currentStepInfo = null;
    for (const step of allSteps) {
      const m = p.milestones?.[step.id];
      if (!m?.actualDate) {
        currentStepInfo = {
          ...step,
          investorDeadline: m?.investor,
          agencyDeadline: m?.agency,
          actualDate: m?.actualDate
        };
        break;
      }
    }

    // If all completed, last step
    if (!currentStepInfo && allSteps.length > 0) {
      const lastStep = allSteps[allSteps.length - 1];
      const m = p.milestones?.[lastStep.id];
      currentStepInfo = {
        ...lastStep,
        investorDeadline: m?.investor,
        agencyDeadline: m?.agency,
        actualDate: m?.actualDate
      };
    }

    return currentStepInfo;
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Danh sách Dự án NOXH</h2>
          <p className="text-slate-500 text-sm">
            Đang hiển thị {filteredProjects.length} dự án
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
          >
            <Download size={18} /> Xuất báo cáo
          </button>
          <button 
            onClick={onCreateClick}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
          >
            <Plus size={18} /> Khởi tạo Dự án
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
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
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Dự án</th>
                <th className="px-6 py-4">Quy trình & Nguồn vốn</th>
                <th className="px-6 py-4">Chủ đầu tư</th>
                <th className="px-6 py-4">Giai đoạn hiện tại</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedProjects.length > 0 ? paginatedProjects.map((p) => {
                const statusDetails = getProjectStatusDetails(p);
                return (
                  <tr 
                    key={p.id} 
                    className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4" onClick={() => onProjectClick?.(p)}>
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${p.status === 'Delayed' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{p.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4" onClick={() => onProjectClick?.(p)}>
                      <p className="text-xs font-bold text-slate-700">{processes.find(proc => proc.id === p.processId)?.name || 'N/A'}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{p.fundingSource}</p>
                    </td>
                    <td className="px-6 py-4" onClick={() => onProjectClick?.(p)}>
                      <p className={`text-xs font-bold ${getStatusColorClass(statusDetails?.investorDeadline, statusDetails?.actualDate)}`}>
                        {p.investor}
                      </p>
                      <div className="flex flex-col gap-0.5 mt-1">
                        <p className="text-[9px] text-slate-400 uppercase tracking-tighter">HXL: <span className={getStatusColorClass(statusDetails?.investorDeadline, statusDetails?.actualDate)}>{formatDate(statusDetails?.investorDeadline)}</span></p>
                        <p className="text-[9px] text-slate-400 uppercase tracking-tighter">HT: <span className="text-emerald-600 font-bold">{formatDate(statusDetails?.actualDate)}</span></p>
                      </div>
                    </td>
                    <td className="px-6 py-4" onClick={() => onProjectClick?.(p)}>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-700">
                          <span className="text-blue-600">[{statusDetails?.parentName}]</span> {statusDetails?.name}
                        </p>
                        <p className={`text-[10px] font-bold ${getStatusColorClass(statusDetails?.agencyDeadline, statusDetails?.actualDate)}`}>
                          {statusDetails?.agency || 'N/A'}
                        </p>
                        <div className="flex gap-4">
                          <p className="text-[9px] text-slate-400 uppercase tracking-tighter">HXL: <span className={getStatusColorClass(statusDetails?.agencyDeadline, statusDetails?.actualDate)}>{formatDate(statusDetails?.agencyDeadline)}</span></p>
                          <p className="text-[9px] text-slate-400 uppercase tracking-tighter">HT: <span className="text-emerald-600 font-bold">{formatDate(statusDetails?.actualDate)}</span></p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); onUpdatePlanClick?.(p); }}
                          className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                          title="Cập nhật kế hoạch thực hiện"
                        >
                          <Calendar size={16} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onHousingUpdateClick?.(p); }}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Cập nhật tiến độ NOXH"
                        >
                          <GitBranch size={16} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onEditClick?.(p); }}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Sửa dự án"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onDeleteClick?.(p); }}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Xóa dự án"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button 
                          onClick={() => onProjectClick?.(p)}
                          className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic text-sm">
                    Không tìm thấy dự án nào phù hợp...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-8 py-6 bg-white border border-slate-200 rounded-[32px] shadow-lg shadow-slate-100 mt-6">
          <div className="flex flex-col">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Trang hiện tại</p>
            <p className="text-xs text-slate-500 font-medium">
              Hiển thị <span className="text-slate-900 font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-slate-900 font-bold">{Math.min(currentPage * itemsPerPage, filteredProjects.length)}</span> trong tổng số <span className="text-slate-900 font-bold">{filteredProjects.length}</span> dự án
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all disabled:opacity-30 disabled:hover:bg-transparent border border-transparent hover:border-blue-100"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
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
              className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all disabled:opacity-30 disabled:hover:bg-transparent border border-transparent hover:border-blue-100"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

