import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, Filter, Download, ChevronLeft, ChevronRight, ChevronDown, 
  Search, Building2, MapPin, Info, CheckCircle2, Clock, AlertCircle
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface MilestoneData {
  investorDate?: string;
  investorStatus: 'done' | 'doing' | 'pending' | 'delayed';
  agencyDate?: string;
  agencyStatus: 'done' | 'doing' | 'pending' | 'delayed';
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
}

const MILESTONES = [
  'Chủ trương đầu tư',
  'QH 1/500',
  'QĐ giao đất',
  'Thẩm duyệt PCCC',
  'Đấu nối HTKT/ĐTM',
  'Giấy phép xây dựng'
];

// Helper to format yyyy-mm-dd to dd/mm/yyyy
const formatDisplayDate = (dateStr: string | undefined): string => {
  if (!dateStr) return '--';
  if (dateStr.includes('/')) return dateStr; // Already formatted or different format
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

export default function GanttDashboardNOXH({ projects: initialProjects = [], reportDate, projectStatuses, projectStages }: GanttDashboardNOXHProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái');
  const [stageFilter, setStageFilter] = useState('Tất cả giai đoạn');

  useEffect(() => {
    // Mocking additional data for Gantt view if not present
    const enrichedData = initialProjects.map((p: any, pIdx: number) => {
      const details: { [key: string]: MilestoneData } = {};
      
      MILESTONES.forEach((m, mIdx) => {
        // Logic to create some realistic looking data
        const isPast = mIdx < (pIdx % 3 + 1);
        const isCurrent = mIdx === (pIdx % 3 + 1);
        
        details[m] = {
          investorDate: isPast ? '23/10/2025' : isCurrent ? '24/02/2026' : '',
          investorStatus: isPast ? 'done' : isCurrent ? 'doing' : 'pending',
          agencyDate: isPast ? '22/05/2029' : isCurrent ? '18/03/2026' : '',
          agencyStatus: isPast ? (mIdx === 0 && pIdx === 0 ? 'delayed' : 'done') : isCurrent ? 'doing' : 'pending'
        };
      });

      return {
        ...p,
        area: p.area || `${(Math.random() * 3 + 0.5).toFixed(2)} ha`,
        height: p.height || `${Math.floor(Math.random() * 20) + 25} tầng`,
        units: p.units || `${Math.floor(Math.random() * 2000) + 500} căn`,
        startDate: p.startDate || '23/10/2025',
        endDate: p.endDate || '31/12/2027',
        textProgress: p.id === '1' ? 'Thô đến tầng 8' : p.id === '2' ? 'Thô đến tầng 5' : p.id === '3' ? 'Hoàn thành' : 'Đang triển khai',
        milestoneDetails: details,
        // Map status for filtering
        status: p.status === 'Delayed' ? 'Quá hạn' : 'Đúng tiến độ',
        stage: p.stage || 'Chuẩn bị đầu tư'
      };
    });
    setProjects(enrichedData);
  }, [initialProjects]);


  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.currentStep.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'Tất cả trạng thái' || p.status === statusFilter;
    const matchesStage = stageFilter === 'Tất cả giai đoạn' || p.stage === stageFilter;

    return matchesSearch && matchesStatus && matchesStage;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-emerald-500';
      case 'doing': return 'bg-amber-500';
      case 'delayed': return 'bg-rose-500';
      default: return 'bg-slate-100';
    }
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
      'THẨM DUYỆT PCCC', '', 
      'ĐẤU NỐI HTKT/ĐTM', '', 
      'GIẤY PHÉP XÂY DỰNG', '',
      'NGÀY HOÀN THÀNH',
      `TIẾN ĐỘ ĐẾN ${reportDate}`
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
      '', ''
    ];

    // Data Rows
    const dataRows = filteredProjects.map((p, idx) => {
      const row = [
        idx + 1,
        `${p.name}\n(${p.code})\n${p.status === 'Quá hạn' ? 'Quá hạn' : 'Đúng tiến độ'}`,
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
      row.push(p.textProgress || '');

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
      { s: { r: 0, c: 14 }, e: { r: 0, c: 15 } }, // PCCC
      { s: { r: 0, c: 16 }, e: { r: 0, c: 17 } }, // Đấu nối
      { s: { r: 0, c: 18 }, e: { r: 0, c: 19 } }, // Giấy phép
      { s: { r: 0, c: 20 }, e: { r: 1, c: 20 } }, // Ngày hoàn thành
      { s: { r: 0, c: 21 }, e: { r: 1, c: 21 } }, // Tiến độ đến [reportDate]
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
      { wch: 15 }, // Ngày hoàn thành
      { wch: 20 }, // Tiến độ đến [reportDate]
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Gantt Dashboard NOXH');
    XLSX.writeFile(workbook, 'Sơ_đồ_Gantt_Dự_án_NOXH.xlsx');
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
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download size={18} /> Xuất dữ liệu dự án
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Bộ lọc</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm mã dự án, tên dự án, bước hiện tại..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none cursor-pointer"
            >
              <option>Tất cả trạng thái</option>
              {projectStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none cursor-pointer"
            >
              <option>Tất cả giai đoạn</option>
              {projectStages.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Summary Stats at the top */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Tổng số dự án', value: projects.length, icon: Building2, color: 'blue' },
          { label: 'Đúng tiến độ', value: projects.filter(p => p.status !== 'Trễ').length, icon: CheckCircle2, color: 'emerald' },
          { label: 'Chậm tiến độ', value: projects.filter(p => p.status === 'Quá hạn').length, icon: AlertCircle, color: 'rose' },
          { label: 'Giai đoạn chuẩn bị', value: projects.filter(p => p.stage === 'Chuẩn bị đầu tư').length, icon: Clock, color: 'amber' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-xs font-medium text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-lg bg-emerald-500" />
          <span>Hoàn thành / Đúng hạn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-lg bg-amber-500" />
          <span>Đang thực hiện</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-lg bg-rose-500" />
          <span>Quá hạn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-lg bg-slate-100" />
          <span>Chưa bắt đầu</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-380px)]">
        <div className="overflow-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-separate border-spacing-0 min-w-[1800px]">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <th rowSpan={2} className="sticky top-0 z-20 bg-slate-50 px-4 py-4 border-r border-b border-slate-200 text-center w-12">STT</th>
                <th rowSpan={2} className="sticky top-0 z-20 bg-slate-50 px-4 py-4 border-r border-b border-slate-200 min-w-[250px]">Tên dự án</th>
                <th rowSpan={2} className="sticky top-0 z-20 bg-slate-50 px-4 py-4 border-r border-b border-slate-200 min-w-[200px]">Địa điểm / Chủ đầu tư</th>
                <th rowSpan={2} className="sticky top-0 z-20 bg-slate-50 px-4 py-4 border-r border-b border-slate-200 text-center min-w-[160px]">Quy mô dự án</th>
                <th rowSpan={2} className="sticky top-0 z-20 bg-slate-50 px-4 py-4 border-r border-b border-slate-200 text-center min-w-[140px]">Tiến độ TH theo CT CTĐT<br/><span className="lowercase font-normal">Từ - Đến</span></th>
                {MILESTONES.map((m, idx) => (
                  <th key={idx} colSpan={2} className="sticky top-0 z-20 bg-slate-50 px-2 py-2 border-r border-b border-slate-200 text-center leading-tight">{m}</th>
                ))}
                <th rowSpan={2} className="sticky top-0 z-20 bg-slate-50 px-4 py-4 border-r border-b border-slate-200 text-center w-32">Ngày hoàn thành</th>
                <th rowSpan={2} className="sticky top-0 z-20 bg-slate-50 px-4 py-4 border-b border-slate-200 text-center w-32">Tiến độ đến {reportDate}</th>
              </tr>
              <tr className="bg-slate-50 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                {MILESTONES.map((_, idx) => (
                  <React.Fragment key={idx}>
                    <th className="sticky top-[45px] z-20 bg-slate-50 px-2 py-2 border-r border-b border-slate-100 text-center w-20">CĐT</th>
                    <th className="sticky top-[45px] z-20 bg-slate-50 px-2 py-2 border-r border-b border-slate-200 text-center w-20">Cơ quan NN</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.map((p, idx) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-4 py-6 border-r border-b border-slate-100 text-center text-sm font-bold text-slate-900">{idx + 1}</td>
                  <td className="px-4 py-6 border-r border-b border-slate-100">
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">{p.name}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-mono font-bold">{p.code}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.status === 'Delayed' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                        }`}>
                          {p.status === 'Delayed' ? 'Quá hạn' : 'Đúng tiến độ'}
                        </span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">
                          {p.stage}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 italic">Bước hiện tại: {p.childStep || p.currentStep}</p>
                    </div>
                  </td>
                  <td className="px-4 py-6 border-r border-b border-slate-100">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-600"><span className="text-slate-400">Địa điểm:</span> {p.location}</p>
                      <p className="text-xs text-slate-600 font-bold"><span className="text-slate-400 font-normal">Chủ đầu tư:</span> {p.investor}</p>
                    </div>
                  </td>
                  <td className="px-4 py-6 border-r border-b border-slate-100 text-left">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-600"><span className="text-slate-400">Diện tích:</span> <span className="font-bold">{p.area}</span></p>
                      <p className="text-xs text-slate-600"><span className="text-slate-400">Tầng cao:</span> <span className="font-bold">{p.height}</span></p>
                      <p className="text-xs text-slate-600"><span className="text-slate-400">Số căn:</span> <span className="font-bold">{p.units}</span></p>
                    </div>
                  </td>
                  <td className="px-4 py-6 border-r border-b border-slate-100 text-center">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-700">{p.startDate}</p>
                      <div className="w-8 h-[1px] bg-slate-300 mx-auto" />
                      <p className="text-xs font-bold text-slate-700">{p.endDate}</p>
                    </div>
                  </td>
                  
                  {/* Milestones */}
                  {MILESTONES.map((m, mIdx) => {
                    const milestone = p.milestoneDetails[m];
                    return (
                      <React.Fragment key={mIdx}>
                        {/* Investor Column */}
                        <td className="px-2 py-6 border-r border-b border-slate-100 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <div className={`w-6 h-6 rounded-lg transition-all ${getStatusColor(milestone.investorStatus)}`} />
                            <span className="text-[10px] text-slate-500 font-medium">{milestone.investorDate || '--'}</span>
                          </div>
                        </td>
                        {/* Agency Column */}
                        <td className="px-2 py-6 border-r border-b border-slate-200 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <div className={`w-6 h-6 rounded-lg transition-all ${getStatusColor(milestone.agencyStatus)}`} />
                            <span className="text-[10px] text-slate-500 font-medium">{milestone.agencyDate || '--'}</span>
                          </div>
                        </td>
                      </React.Fragment>
                    );
                  })}

                  <td className="px-4 py-6 border-r border-b border-slate-100 text-center">
                    <span className="text-sm font-bold text-slate-700">{formatDisplayDate(p.deadline)}</span>
                  </td>
                  <td className="px-4 py-6 border-b border-slate-100 text-center">
                    <span className="text-xs font-medium text-slate-600">{p.currentStep || p.textProgress}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
