import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, Filter, Download, ChevronLeft, ChevronRight, ChevronDown, 
  Search, Building2, MapPin, Info, CheckCircle2, Clock, AlertCircle,
  Check, RotateCcw, Layers
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { MOCK_PROGRESS_DATA } from '../data/mockData';

interface MilestoneData {
  investorDate?: string;
  investorStatus: 'done' | 'in_progress' | 'not_started' | 'delayed';
  agencyDate?: string;
  agencyStatus: 'done' | 'in_progress' | 'not_started' | 'delayed';
}

interface Project {
  id: string;
  name: string;
  code: string;
  investor: string;
  location: string;
  stage: string;
  currentStep: string;
  childStep?: string;
  progress: number;
  status: string;
  deadline: string;
  // Additional fields for Gantt
  area?: string;
  height?: string;
  units?: string;
  apartmentCount?: number;
  startDate?: string;
  endDate?: string;
  textProgress?: string;
  milestoneDetails: {
    [key: string]: MilestoneData;
  };
}

interface GanttDashboardNOXHProps {
  projects?: Project[];
  reportDate: string;
  projectStatuses: string[];
  projectStages: string[];
  onProjectClick?: (project: any) => void;
}

const PHASES = [
  { id: 'chutruong', name: 'CHỦ TRƯƠNG ĐẦU TƯ', color: 'bg-[#E3F2FD]', textColor: 'text-blue-700', borderColor: 'border-blue-200', cdtKey: 'chutruong_cdt_date', nnKey: 'chutruong_nn_date', agency: 'sxd' },
  { id: 'qh1500', name: 'QH 1/500', color: 'bg-[#F3E5F5]', textColor: 'text-purple-700', borderColor: 'border-purple-200', cdtKey: 'qh1500_cdt_date', nnKey: 'qh1500_nn_date', agency: 'sqhkt' },
  { id: 'giaodat', name: 'QĐ GIAO ĐẤT', color: 'bg-[#E8F5E9]', textColor: 'text-emerald-700', borderColor: 'border-emerald-200', cdtKey: 'qdgiaodat_cdt_date', nnKey: 'qdgiaodat_nn_date', agency: 'ubnd_xa' },
  { id: 'htkt', name: 'ĐẤU NỐI HTKT/ĐTM', color: 'bg-[#FFFDE7]', textColor: 'text-amber-700', borderColor: 'border-amber-200', cdtKey: 'htkt_dtm_cdt_date', nnKey: 'htkt_dtm_nn_date', agency: 'sxd' },
  { id: 'bcnckt', name: 'BC NCKT', color: 'bg-[#FBE9E7]', textColor: 'text-rose-700', borderColor: 'border-rose-200', cdtKey: 'baocaonckt_cdt_date', nnKey: 'baocaonckt_nn_date', agency: 'sxd' },
  { id: 'pccc', name: 'THẨM DUYỆT PCCC', color: 'bg-[#FCE4EC]', textColor: 'text-pink-700', borderColor: 'border-pink-200', cdtKey: 'pccc_cdt_date', nnKey: 'pccc_nn_date', agency: 'pccc_agency' },
  { id: 'gpxd', name: 'GPXD', color: 'bg-[#E0F7FA]', textColor: 'text-cyan-700', borderColor: 'border-cyan-200', cdtKey: 'gpxaydung_cdt_date', nnKey: 'gpxaydung_nn_date', agency: 'sxd' },
];

const MILESTONES = PHASES.map(p => p.name);

// Helper to format various date strings to dd/mm/yy
const formatDisplayDate = (dateStr: string | undefined): string => {
  if (!dateStr || dateStr === '--') return '--';
  if (dateStr === 'X') return 'X';
  
  let d, m, y;
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return dateStr;
    d = parts[0];
    m = parts[1];
    y = parts[2];
  } else if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    y = parts[0];
    m = parts[1];
    d = parts[2];
  } else {
    return dateStr;
  }
  
  const day = d.padStart(2, '0');
  const month = m.padStart(2, '0');
  const year = y.length === 4 ? y.slice(-2) : y;
  
  return `${day}/${month}/${year}`;
};

export default function GanttDashboardNOXH({ projects: initialProjects = [], reportDate, projectStatuses, projectStages, onProjectClick }: GanttDashboardNOXHProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [actualDataStore, setActualDataStore] = useState<Record<string, Record<string, any>>>({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('Tất cả giai đoạn');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Load all actual progress data from localStorage and merge with mock data
    const store: Record<string, any> = { ...MOCK_PROGRESS_DATA };
    initialProjects.forEach((p: any) => {
      const saved = localStorage.getItem(`actual_progress_${p.id}`);
      if (saved) {
        store[p.id] = {
          ...(MOCK_PROGRESS_DATA[p.id] || {}),
          ...JSON.parse(saved)
        };
      }
    });
    setActualDataStore(store);

    const today = new Date();

    // Fill milestones from project data
    const enrichedData = initialProjects.map((p: any) => {
      const details: { [key: string]: MilestoneData } = {};
      const projectActualData = store[p.id] || {};
      
      // Calculate Current Step first to use in milestone status
      const activePhase = PHASES.find(phase => {
        const planCdt = p[phase.cdtKey];
        const planNn = p[phase.nnKey];
        const actual = projectActualData[phase.id];

        const cdtDone = planCdt === 'X' || planCdt === '' || (actual && actual.cdtDate && actual.cdtDate !== '');
        const nnDone = planNn === 'X' || planNn === '' || (actual && actual.nnDate && actual.nnDate !== '');

        return !(cdtDone && nnDone);
      }) || PHASES[PHASES.length - 1];

      const activePhaseIndex = PHASES.findIndex(ph => ph.id === activePhase.id);

      const milestoneMapping: {[key: string]: {cdt: string, nn: string}} = {
        'CHỦ TRƯƠNG ĐẦU TƯ': { cdt: p.chutruong_cdt_date, nn: p.chutruong_nn_date },
        'QH 1/500': { cdt: p.qh1500_cdt_date, nn: p.qh1500_nn_date },
        'QĐ GIAO ĐẤT': { cdt: p.qdgiaodat_cdt_date, nn: p.qdgiaodat_nn_date },
        'ĐẤU NỐI HTKT/ĐTM': { cdt: p.htkt_dtm_cdt_date, nn: p.htkt_dtm_nn_date },
        'BC NCKT': { cdt: p.baocaonckt_cdt_date, nn: p.baocaonckt_nn_date },
        'THẨM DUYỆT PCCC': { cdt: p.pccc_cdt_date, nn: p.pccc_nn_date },
        'GPXD': { cdt: p.gpxaydung_cdt_date, nn: p.gpxaydung_nn_date }
      };

      MILESTONES.forEach((m, mIdx) => {
        const dates = milestoneMapping[m];
        const investorPlanDate = parseDateInternal(dates?.cdt);
        const agencyPlanDate = parseDateInternal(dates?.nn);

        // Actual progress for this project
        const phaseId = PHASES[mIdx].id;
        const actual = projectActualData[phaseId];
        
        let investorStatus: 'done' | 'in_progress' | 'not_started' | 'delayed' = 'not_started';
        let agencyStatus: 'done' | 'in_progress' | 'not_started' | 'delayed' = 'not_started';

        // Investor status logic
        if (actual && actual.cdtDate && actual.cdtDate !== '') {
          investorStatus = 'done';
        } else if (dates?.cdt === 'X') {
          investorStatus = 'done';
        } else if (mIdx < activePhaseIndex) {
          investorStatus = 'delayed';
        } else if (mIdx === activePhaseIndex) {
          if (investorPlanDate && today > investorPlanDate) {
            investorStatus = 'delayed';
          } else {
            investorStatus = 'in_progress';
          }
        } else {
          investorStatus = 'not_started';
        }

        // Agency status logic
        if (actual && actual.nnDate && actual.nnDate !== '') {
          agencyStatus = 'done';
        } else if (dates?.nn === 'X') {
          agencyStatus = 'done';
        } else if (mIdx < activePhaseIndex) {
          agencyStatus = 'delayed';
        } else if (mIdx === activePhaseIndex) {
          // If investor is not done yet, agency hasn't started or is doing? 
          // Based on user: "màu xám ở các cột mốc sau bước hiện tại".
          // If it's current phase, it should be Yellow or Red.
          if (agencyPlanDate && today > agencyPlanDate) {
            agencyStatus = 'delayed';
          } else {
            agencyStatus = 'in_progress';
          }
        } else {
          agencyStatus = 'not_started';
        }

        details[m] = {
          investorDate: dates?.cdt || '',
          investorStatus,
          agencyDate: dates?.nn || '',
          agencyStatus
        };
      });

      const activePlanNnStr = p[activePhase.nnKey];
      const activePlanNnDate = parseDateInternal(activePlanNnStr);
      
      let calculatedStatus = 'Đang xử lý';
      if (activePlanNnDate && today > activePlanNnDate) {
        calculatedStatus = 'Quá hạn';
      }

      return {
        ...p,
        area: p.totalArea ? `${p.totalArea} ha` : p.area,
        height: p.height ? `${p.height} tầng` : p.height,
        units: p.apartmentCount ? `${p.apartmentCount} căn` : p.units,
        startDate: p.startDate || '--',
        endDate: p.endDate || '--',
        textProgress: p.progress_status_2026 || p.textProgress || 'Đang triển khai',
        milestoneDetails: details,
        status: calculatedStatus,
        stage: p.stage || 'Chuẩn bị đầu tư',
        currentStep: activePhase.name
      };
    });
    setProjects(enrichedData);
  }, [initialProjects]);


  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.currentStep.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStage = stageFilter === 'Tất cả giai đoạn' || p.stage === stageFilter;
    const matchesStatus = statusFilter === 'Tất cả' || 
                          (statusFilter === 'Đang xử lý' && p.status === 'Đang xử lý') ||
                          (statusFilter === 'Chậm tiến độ' && p.status === 'Quá hạn');

    return matchesSearch && matchesStage && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-emerald-500';
      case 'in_progress': return 'bg-amber-400';
      case 'delayed': return 'bg-rose-500';
      case 'not_started': return 'bg-slate-200';
      default: return 'bg-slate-100';
    }
  };

  const parseDateInternal = (dateStr: string | undefined): Date | null => {
    if (!dateStr || dateStr === '--' || dateStr === 'X') return null;
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length !== 3) return null;
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      let year = parseInt(parts[2], 10);
      if (year < 100) year += 2000;
      return new Date(year, month, day);
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  };

  const getComparisonColor = (planDateStr: string | undefined, actualDateStr: string | undefined) => {
    const plan = parseDateInternal(planDateStr);
    const actual = parseDateInternal(actualDateStr);
    if (!plan || !actual) return 'bg-blue-600';
    return actual > plan ? 'bg-rose-600' : 'bg-blue-600';
  };

  const MILESTONE_ID_MAP: Record<string, string> = {
    'CHỦ TRƯƠNG ĐẦU TƯ': 'chutruong',
    'QH 1/500': 'qh1500',
    'QĐ GIAO ĐẤT': 'giaodat',
    'ĐẤU NỐI HTKT/ĐTM': 'htkt',
    'BC NCKT': 'bcnckt',
    'THẨM DUYỆT PCCC': 'pccc',
    'GPXD': 'gpxd'
  };

  const MILESTONE_STYLES: Record<string, { color: string, textColor: string, borderColor: string }> = {
    'CHỦ TRƯƠNG ĐẦU TƯ': { color: 'bg-[#E3F2FD]', textColor: 'text-blue-700', borderColor: 'border-blue-200' },
    'QH 1/500': { color: 'bg-[#F3E5F5]', textColor: 'text-purple-700', borderColor: 'border-purple-200' },
    'QĐ GIAO ĐẤT': { color: 'bg-[#E8F5E9]', textColor: 'text-emerald-700', borderColor: 'border-emerald-200' },
    'ĐẤU NỐI HTKT/ĐTM': { color: 'bg-[#FFFDE7]', textColor: 'text-amber-700', borderColor: 'border-amber-200' },
    'BC NCKT': { color: 'bg-[#FBE9E7]', textColor: 'text-rose-700', borderColor: 'border-rose-200' },
    'THẨM DUYỆT PCCC': { color: 'bg-[#FCE4EC]', textColor: 'text-pink-700', borderColor: 'border-pink-200' },
    'GPXD': { color: 'bg-[#E0F7FA]', textColor: 'text-cyan-700', borderColor: 'border-cyan-200' }
  };

  const handleExport = () => {
    // Header Row 1
    const headerRow1 = [
      'STT', 
      'TÊN DỰ ÁN', 
      'ĐỊA ĐIỂM',
      'CHỦ ĐẦU TƯ',
      'DIỆN TÍCH',
      'TẦNG CAO',
      'SỐ CĂN HỘ',
      'TIẾN ĐỘ TH THEO CT CTĐT (Từ - Đến)',
      'CHỦ TRƯƠNG ĐẦU TƯ', '', 
      'QH 1/500', '', 
      'QĐ GIAO ĐẤT', '', 
      'ĐẤU NỐI HTKT/ĐTM', '',
      'BÁO CÁO NCKT', '',
      'THẨM DUYỆT PCCC', '', 
      'GIẤY PHÉP XÂY DỰNG', '',
      'NGÀY HOÀN THÀNH'
    ];

    // Header Row 2
    const headerRow2 = [
      '', '', '', '', '', '', '', '',
      'CĐT', 'CƠ QUAN NN', 
      'CĐT', 'CƠ QUAN NN', 
      'CĐT', 'CƠ QUAN NN', 
      'CĐT', 'CƠ QUAN NN', 
      'CĐT', 'CƠ QUAN NN', 
      'CĐT', 'CƠ QUAN NN',
      'CĐT', 'CƠ QUAN NN',
      ''
    ];

    // Data Rows
    const dataRows = filteredProjects.map((p, idx) => {
      const row = [
        idx + 1,
        `${p.name}\n(${p.code})\n${p.status === 'Quá hạn' ? 'Quá hạn' : 'Đang xử lý'}`,
        p.location,
        p.investor,
        p.area,
        p.height,
        p.units,
        `${p.startDate} - ${p.endDate}`,
      ];

      MILESTONES.forEach(m => {
        const milestone = p.milestoneDetails[m];
        row.push(milestone.investorDate || '--');
        row.push(milestone.agencyDate || '--');
      });

      row.push(formatDisplayDate(p.deadline));

      return row;
    });

    const aoaData = [headerRow1, headerRow2, ...dataRows];
    const worksheet = XLSX.utils.aoa_to_sheet(aoaData);

    // Define Merges
    const merges = [
      { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // STT
      { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // Tên dự án
      { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } }, // Địa điểm
      { s: { r: 0, c: 3 }, e: { r: 1, c: 3 } }, // Chủ đầu tư
      { s: { r: 0, c: 4 }, e: { r: 1, c: 4 } }, // Diện tích
      { s: { r: 0, c: 5 }, e: { r: 1, c: 5 } }, // Tầng cao
      { s: { r: 0, c: 6 }, e: { r: 1, c: 6 } }, // Số căn hộ
      { s: { r: 0, c: 7 }, e: { r: 1, c: 7 } }, // Tiến độ TH
      { s: { r: 0, c: 8 }, e: { r: 0, c: 9 } }, // Chủ trương đầu tư
      { s: { r: 0, c: 10 }, e: { r: 0, c: 11 } }, // QH 1/500
      { s: { r: 0, c: 12 }, e: { r: 0, c: 13 } }, // QĐ giao đất
      { s: { r: 0, c: 14 }, e: { r: 0, c: 15 } }, // Đấu nối
      { s: { r: 0, c: 16 }, e: { r: 0, c: 17 } }, // BC NCKT
      { s: { r: 0, c: 18 }, e: { r: 0, c: 19 } }, // PCCC
      { s: { r: 0, c: 20 }, e: { r: 0, c: 21 } }, // Giấy phép
      { s: { r: 0, c: 22 }, e: { r: 1, c: 22 } }, // Ngày hoàn thành
    ];

    worksheet['!merges'] = merges;

    // Set column widths
    worksheet['!cols'] = [
      { wch: 5 },  // STT
      { wch: 30 }, // Tên dự án
      { wch: 25 }, // Địa điểm
      { wch: 25 }, // Chủ đầu tư
      { wch: 15 }, // Diện tích
      { wch: 10 }, // Tầng cao
      { wch: 10 }, // Số căn hộ
      { wch: 20 }, // Tiến độ TH
      { wch: 12 }, { wch: 12 }, // Milestone 1
      { wch: 12 }, { wch: 12 }, // Milestone 2
      { wch: 12 }, { wch: 12 }, // Milestone 3
      { wch: 12 }, { wch: 12 }, // Milestone 4
      { wch: 12 }, { wch: 12 }, // Milestone 5
      { wch: 12 }, { wch: 12 }, // Milestone 6
      { wch: 12 }, { wch: 12 }, // Milestone 7
      { wch: 15 }, // Ngày hoàn thành
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Gantt Dashboard NOXH');
    XLSX.writeFile(workbook, 'Sơ_đồ_Gantt_Dự_án_NOXH.xlsx');
  };

  const handleResetData = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tất cả dữ liệu tiến độ thực tế đã lưu và quay về dữ liệu mẫu?')) {
      try {
        // Clear all items starting with actual_progress_
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('actual_progress_')) {
            keysToRemove.push(key);
          }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        console.log('Đã reset dữ liệu tiến độ thực tế.');
        window.location.reload();
      } catch (error) {
        console.error('Lỗi khi reset dữ liệu:', error);
        alert('Có lỗi xảy ra khi reset dữ liệu.');
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Đang tải dữ liệu...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Sơ đồ Gantt dự án NOXH</h2>
          <p className="text-slate-500 text-sm">Theo dõi tất cả cả dự án, xác định dự án đang ở giai đoạn nào, bước nào, quá hạn hay đã hoàn thành.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleResetData}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all shadow-sm"
            title="Xóa cache và quay lại dữ liệu mẫu"
          >
            <RotateCcw size={18} /> Reset dữ liệu
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download size={18} /> Xuất dữ liệu dự án
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-blue-600" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Bộ lọc:</h3>
          </div>
          {statusFilter !== 'Tất cả' && (
            <button 
              onClick={() => setStatusFilter('Tất cả')}
              className="px-2 py-1 bg-blue-50 text-[10px] font-black text-blue-600 rounded-md hover:bg-blue-100 transition-colors uppercase flex items-center gap-1"
            >
              <RotateCcw size={10} /> Hiển thị tất cả
            </button>
          )}
        </div>
        
        <div className="flex-1 w-full flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 max-w-md w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm mã dự án, tên dự án, bước hiện tại..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-300"
            />
          </div>
          <div className="relative w-full md:w-64">
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none cursor-pointer"
            >
              <option>Tất cả giai đoạn</option>
              {projectStages.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Tổng số dự án', value: projects.length, icon: Building2, color: 'blue', filter: 'Tất cả' },
          { label: 'CQNN Đang xử lý', value: projects.filter(p => p.status === 'Đang xử lý').length, icon: CheckCircle2, color: 'amber', filter: 'Đang xử lý' },
          { label: 'KH của CQNN bị chậm tiến độ', value: projects.filter(p => p.status === 'Quá hạn').length, icon: AlertCircle, color: 'rose', filter: 'Chậm tiến độ' },
        ].map((stat, idx) => (
          <div 
            key={idx} 
            onClick={() => setStatusFilter(stat.filter)}
            className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer shadow-sm flex items-center gap-4 ${statusFilter === stat.filter ? `ring-2 ring-${stat.color}-500 border-${stat.color}-200 bg-${stat.color}-50/30` : 'border-slate-200 hover:border-blue-300 hover:shadow-md'}`}
          >
            <div className={`w-10 h-10 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl flex items-center justify-center shrink-0`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
              <p className="text-xl font-black text-slate-900 leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Legend & Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-xs font-medium text-slate-600 flex-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-lg bg-emerald-500" />
            <span>Hoàn thành</span>
          </div>
            <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-lg bg-amber-400" />
            <span>Đang thực hiện</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-lg bg-blue-600" />
            <span>TT Đúng hạn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-lg bg-rose-500" />
            <span>TT Quá hạn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-lg bg-slate-200" />
            <span>Chưa bắt đầu</span>
          </div>
        </div>

        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm uppercase tracking-widest shrink-0 border-b-2 active:translate-y-0.5 active:border-b-0"
        >
          <Layers size={18} className="text-slate-400" />
          {isExpanded ? 'Thu gọn' : 'Xem tất cả'}
        </button>
      </div>

      <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col ${isExpanded ? 'h-auto' : 'h-[calc(100vh-250px)]'}`}>
        <div className="overflow-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-separate border-spacing-0 min-w-[1800px]">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <th rowSpan={2} className="sticky top-0 z-20 bg-slate-50 px-4 py-2 border-r border-b border-slate-200 text-center w-12">STT</th>
                <th rowSpan={2} className="sticky top-0 z-20 bg-slate-50 px-4 py-2 border-r border-b border-slate-200 w-[150px]">Tên dự án</th>
                <th rowSpan={2} className="sticky top-0 z-20 bg-slate-50 px-4 py-2 border-r border-b border-slate-200 w-[130px]">Địa điểm / Chủ đầu tư / Quy mô</th>
                <th rowSpan={2} className="sticky top-0 z-20 bg-slate-50 px-4 py-2 border-r border-b border-slate-200 text-center w-[120px]">Tiến độ TH theo CT CTĐT<br/><span className="lowercase font-normal">Từ - Đến</span></th>
                <th rowSpan={2} className="sticky top-0 z-20 bg-slate-50 border-r border-b border-slate-200 w-8"></th>
                {MILESTONES.map((m, idx) => {
                  const style = MILESTONE_STYLES[m] || { color: 'bg-slate-50', textColor: 'text-slate-500', borderColor: 'border-slate-200' };
                  return (
                    <th key={idx} colSpan={2} className={`sticky top-0 z-20 ${style.color} ${style.textColor} ${style.borderColor} px-2 pt-3 pb-1 border-r border-b text-center leading-tight align-bottom`}>
                      {m}
                    </th>
                  );
                })}
                <th rowSpan={2} className="sticky top-0 z-20 bg-slate-50 px-4 py-2 border-b border-slate-200 text-center w-32">Ngày hoàn thành</th>
              </tr>
              <tr className="bg-slate-50 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                {/* Placeholder for spanned headers */}
                {MILESTONES.map((m, idx) => {
                  const style = MILESTONE_STYLES[m] || { color: 'bg-slate-50', textColor: 'text-slate-500', borderColor: 'border-slate-200' };
                  return (
                    <React.Fragment key={idx}>
                      <th className={`sticky top-[38px] z-20 ${style.color} px-2 pt-1 pb-2 border-r border-b border-slate-100 text-center w-20 align-top`}>CĐT</th>
                      <th className={`sticky top-[38px] z-20 ${style.color} px-2 pt-1 pb-2 border-r border-b ${style.borderColor} text-center w-20 align-top`}>Cơ quan NN</th>
                    </React.Fragment>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.map((p, idx) => {
                const actualProjectData = actualDataStore[p.id];
                
                return (
                  <React.Fragment key={p.id}>
                    {/* KH Row */}
                    <tr className="hover:bg-slate-50 transition-colors group">
                      <td rowSpan={2} className="px-3 py-1 border-r border-b border-slate-100 text-center text-xs font-bold text-slate-900 align-top">{idx + 1}</td>
                      <td rowSpan={2} className="px-3 py-1 border-r border-b border-slate-100 align-top w-[150px]">
                        <div className="flex flex-col h-full justify-between">
                          <button 
                            onClick={() => onProjectClick?.(p)}
                            title={p.name}
                            className="space-y-0.5 text-left w-full focus:outline-none"
                          >
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{p.code}</p>
                            <p className="text-[11px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight uppercase line-clamp-4">{p.name}</p>
                          </button>
                        </div>
                      </td>
                      <td rowSpan={2} className="px-3 py-1 border-r border-b border-slate-100 align-top w-[130px]">
                        <div className="space-y-1">
                          <div className="flex items-start gap-1.5">
                            <MapPin size={12} className="text-slate-300 mt-0.5 shrink-0" />
                            <p className="text-[11px] text-slate-600 leading-tight line-clamp-2">{p.location}</p>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <Building2 size={12} className="text-slate-300 mt-0.5 shrink-0" />
                            <div className="flex flex-col">
                              <p className="text-[11px] text-slate-700 font-bold leading-tight line-clamp-2">{p.investor}</p>
                              <p className="text-[9px] text-slate-500 mt-0.5 leading-normal">
                                <span className="font-black text-slate-400 uppercase mr-1">QM:</span> 
                                {p.area}; {p.height}; {p.units}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td rowSpan={2} className="px-3 py-1 border-r border-b border-slate-100 text-center align-top w-[110px]">
                        <div className="bg-slate-50 rounded-lg p-1 border border-slate-100">
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Thời gian TH</p>
                          <p className="text-[10px] font-bold text-slate-700">{formatDisplayDate(p.startDate)}</p>
                          <div className="h-[1px] w-3 bg-slate-200 mx-auto my-0.5" />
                          <p className="text-[10px] font-bold text-slate-700">{formatDisplayDate(p.endDate)}</p>
                        </div>
                      </td>
                      
                      <td className="px-1 py-1.5 border-r border-b border-slate-50 text-center w-8">
                        <span className="px-1.5 py-0.5 border border-blue-200 text-blue-600 text-[9px] font-black rounded-md bg-blue-50/50 uppercase">KH</span>
                      </td>

                      {/* KH Milestones */}
                      {MILESTONES.map((m, mIdx) => {
                        const milestone = p.milestoneDetails[m];
                        const isBothDone = milestone.investorDate === 'X' && milestone.agencyDate === 'X';

                        if (isBothDone) {
                          return (
                            <td key={`kh-done-${mIdx}`} colSpan={2} className="px-1 py-1.5 border-r border-b border-slate-50 text-center">
                              <div className="flex items-center justify-center">
                                <span className="flex items-center gap-1 px-3 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-black uppercase shadow-sm leading-none whitespace-nowrap">
                                  <Check size={12} strokeWidth={4} /> Đã xong
                                </span>
                              </div>
                            </td>
                          );
                        }

                        return (
                          <React.Fragment key={`kh-${mIdx}`}>
                            <td className="px-1 py-1.5 border-r border-b border-slate-50 text-center">
                              {milestone.investorDate === 'X' ? (
                                <div className="flex items-center justify-center">
                                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[9px] font-black uppercase shadow-sm leading-none whitespace-nowrap">
                                    <Check size={10} strokeWidth={4} /> Đã xong
                                  </span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-0.5">
                                  <div className={`w-full h-2 rounded-full transition-all opacity-80 ${getStatusColor(milestone.investorStatus)}`} />
                                  <span className={`text-[10px] font-bold whitespace-nowrap ${milestone.investorStatus === 'delayed' ? 'text-rose-600' : 'text-slate-500'}`}>
                                    {formatDisplayDate(milestone.investorDate)}
                                  </span>
                                </div>
                              )}
                            </td>
                            <td className="px-1 py-1.5 border-r border-b border-slate-100 text-center">
                              {milestone.agencyDate === 'X' ? (
                                <div className="flex items-center justify-center">
                                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[9px] font-black uppercase shadow-sm leading-none whitespace-nowrap">
                                    <Check size={10} strokeWidth={4} /> Đã xong
                                  </span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-0.5">
                                  <div className={`w-full h-2 rounded-full transition-all opacity-80 ${getStatusColor(milestone.agencyStatus)}`} />
                                  <span className={`text-[10px] font-bold whitespace-nowrap ${milestone.agencyStatus === 'delayed' ? 'text-rose-600' : 'text-slate-500'}`}>
                                    {formatDisplayDate(milestone.agencyDate)}
                                  </span>
                                </div>
                              )}
                            </td>
                          </React.Fragment>
                        );
                      })}

                      <td rowSpan={2} className="px-4 py-2 border-b border-slate-100 text-center align-middle">
                        <span className="text-xs font-black text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{formatDisplayDate(p.deadline)}</span>
                      </td>
                    </tr>

                    {/* TD Row */}
                    <tr className="hover:bg-slate-50 transition-colors group">
                      <td className="px-1 py-1 border-r border-b border-blue-100 text-center w-8 bg-blue-50/20">
                        <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[9px] font-black rounded-md shadow-sm uppercase">TT</span>
                      </td>
                      
                      {/* TĐ Milestones */}
                      {MILESTONES.map((m, mIdx) => {
                        const milestone = p.milestoneDetails[m];
                        const phaseId = MILESTONE_ID_MAP[m];
                        const actualProgress = actualProjectData ? actualProjectData[phaseId] : null;

                        return (
                          <React.Fragment key={`td-${mIdx}`}>
                            <td className="px-1 py-1.5 border-r border-b border-slate-50 text-center">
                              {actualProgress?.cdtDate ? (
                                <div className="flex flex-col items-center gap-0.5">
                                  <div className={`w-full h-2 rounded-full shadow-sm ${getComparisonColor(milestone.investorDate, actualProgress.cdtDate)}`} />
                                  <span className="text-[10px] text-slate-900 font-black whitespace-nowrap">{formatDisplayDate(actualProgress.cdtDate)}</span>
                                </div>
                              ) : (
                                <div className="h-2 w-full border border-dashed border-slate-200 rounded-full bg-slate-50 opacity-40 mx-auto" />
                              )}
                            </td>
                            <td className="px-1 py-1.5 border-r border-b border-slate-100 text-center">
                              {actualProgress?.nnDate ? (
                                <div className="flex flex-col items-center gap-0.5">
                                  <div className={`w-full h-2 rounded-full shadow-sm ${getComparisonColor(milestone.agencyDate, actualProgress.nnDate)}`} />
                                  <span className="text-[10px] text-slate-900 font-black whitespace-nowrap">{formatDisplayDate(actualProgress.nnDate)}</span>
                                </div>
                              ) : (
                                <div className="h-2 w-full border border-dashed border-slate-200 rounded-full bg-slate-50 opacity-40 mx-auto" />
                              )}
                            </td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
