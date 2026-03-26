import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Calendar, Clock, AlertCircle, 
  Save, CheckCircle2, Building2, ChevronRight, 
  ChevronLeft, Download, Info, Edit3, X,
  ArrowUpDown, ArrowUp, ArrowDown, Layers,
  Paperclip, Upload, Trash2, File
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, parse, isValid } from 'date-fns';
import { utils, writeFile } from 'xlsx';

// Helper to parse dd/mm/yyyy to Date
const parseDate = (dateStr: string | undefined): Date | null => {
  if (!dateStr) return null;
  const parsed = parse(dateStr, 'dd/MM/yyyy', new Date());
  return isValid(parsed) ? parsed : null;
};

// Helper to format Date to dd/mm/yyyy
const formatDate = (date: Date | null): string => {
  if (!date) return '';
  return format(date, 'dd/MM/yyyy');
};

interface Project {
  id: string;
  code: string;
  name: string;
  investor: string;
  isPublicInvestment: boolean;
  // Annual progress fields (red-boxed in image)
  chutruong_cdt_date?: string;
  chutruong_nn_date?: string;
  qh1500_cdt_date?: string;
  qh1500_nn_date?: string;
  qdgiaodat_cdt_date?: string;
  qdgiaodat_nn_date?: string;
  pccc_cdt_date?: string;
  pccc_nn_date?: string;
  htkt_dtm_cdt_date?: string;
  htkt_dtm_nn_date?: string;
  gpxaydung_cdt_date?: string;
  gpxaydung_nn_date?: string;
  completion_date?: string;
  progress_status_2026?: string;
}

interface AnnualProgressUpdateProps {
  projects?: Project[];
  reportDate: string;
  setReportDate: (date: string) => void;
}

export default function AnnualProgressUpdate({ projects: initialProjects = [], reportDate, setReportDate }: AnnualProgressUpdateProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [updatingProgressProject, setUpdatingProgressProject] = useState<Project | null>(null);
  const [updateContent, setUpdateContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Project | null, direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const [showAll, setShowAll] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const handleSave = async (project: Project) => {
    setIsSaving(true);
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setProjects(prev => prev.map(p => p.id === project.id ? project : p));
    setEditingProject(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setIsSaving(false);
  };


  const handleSort = (key: keyof Project) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleExportExcel = () => {
    // Header Row 1
    const header1 = [
      "Mã dự án", "Tên dự án", "Chủ đầu tư", 
      "Chủ trương ĐT", "", 
      "QH 1/500", "", 
      "QĐ Giao đất", "", 
      "PCCC", "", 
      "HTKT/ĐTM", "", 
      "GP Xây dựng", "", 
      "Hoàn thành", `Tiến độ đến ${reportDate}`
    ];

    // Header Row 2
    const header2 = [
      "", "", "", 
      "CĐT", "NN", 
      "CĐT", "NN", 
      "CĐT", "NN", 
      "CĐT", "NN", 
      "CĐT", "NN", 
      "CĐT", "NN", 
      "", ""
    ];

    // Data rows
    const dataRows = filteredProjects.map(p => [
      p.code,
      p.name,
      p.investor,
      p.chutruong_cdt_date || '',
      p.chutruong_nn_date || '',
      p.qh1500_cdt_date || '',
      p.qh1500_nn_date || '',
      p.qdgiaodat_cdt_date || '',
      p.qdgiaodat_nn_date || '',
      p.pccc_cdt_date || '',
      p.pccc_nn_date || '',
      p.htkt_dtm_cdt_date || '',
      p.htkt_dtm_nn_date || '',
      p.gpxaydung_cdt_date || '',
      p.gpxaydung_nn_date || '',
      p.completion_date || '',
      p.progress_status_2026 || ''
    ]);

    const ws = utils.aoa_to_sheet([header1, header2, ...dataRows]);

    // Merges: { s: { r: row, c: col }, e: { r: row, c: col } }
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // Mã dự án
      { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // Tên dự án
      { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } }, // Chủ đầu tư
      { s: { r: 0, c: 3 }, e: { r: 0, c: 4 } }, // Chủ trương ĐT
      { s: { r: 0, c: 5 }, e: { r: 0, c: 6 } }, // QH 1/500
      { s: { r: 0, c: 7 }, e: { r: 0, c: 8 } }, // QĐ Giao đất
      { s: { r: 0, c: 9 }, e: { r: 0, c: 10 } }, // PCCC
      { s: { r: 0, c: 11 }, e: { r: 0, c: 12 } }, // HTKT/ĐTM
      { s: { r: 0, c: 13 }, e: { r: 0, c: 14 } }, // GP Xây dựng
      { s: { r: 0, c: 15 }, e: { r: 1, c: 15 } }, // Hoàn thành
      { s: { r: 0, c: 16 }, e: { r: 1, c: 16 } }, // Tiến độ
    ];

    // Set column widths
    ws['!cols'] = [
      { wch: 15 }, { wch: 40 }, { wch: 25 }, 
      { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, 
      { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, 
      { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, 
      { wch: 15 }, { wch: 30 }
    ];

    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "TienDoDuAn");
    writeFile(wb, `TienDoDuAn_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`);
  };

  const filteredProjects = projects
    .filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.investor.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';

      if (sortConfig.key === 'completion_date') {
        const aDate = parseDate(aValue as string) || new Date(0);
        const bDate = parseDate(bValue as string) || new Date(0);
        return sortConfig.direction === 'asc' 
          ? aDate.getTime() - bDate.getTime() 
          : bDate.getTime() - aDate.getTime();
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const currentProjects = showAll 
    ? filteredProjects 
    : filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900">Cập nhật tiến độ năm</h2>
          <p className="text-slate-500 text-lg font-medium">Cập nhật các mốc thời gian và tiến độ thực tế hàng năm</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
            <Calendar size={16} className="text-slate-400" />
            <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Tiến độ đến:</span>
            <DatePicker
              selected={parseDate(reportDate)}
              onChange={(date: Date | null) => setReportDate(formatDate(date))}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/yyyy"
              className="text-base font-bold text-slate-900 outline-none w-28 bg-transparent"
            />
          </div>
          <div className="relative group">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Tìm dự án, mã dự án..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-lg w-64 md:w-80 outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all"
            />
          </div>
          <button 
            onClick={handleExportExcel}
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
            title="Xuất Excel"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {showSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-3"
        >
          <CheckCircle2 size={18} />
          <span className="text-base font-bold">Cập nhật tiến độ thành công!</span>
        </motion.div>
      )}

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/80">
                <th 
                  onClick={() => handleSort('name')}
                  className="p-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 sticky left-0 bg-slate-50/80 z-10 cursor-pointer hover:text-blue-600 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Dự án
                    {sortConfig.key === 'name' ? (
                      sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                    ) : <ArrowUpDown size={12} className="opacity-30" />}
                  </div>
                </th>
                <th colSpan={2} className="p-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 border-l border-slate-100">Chủ trương ĐT</th>
                <th colSpan={2} className="p-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 border-l border-slate-100">QH 1/500</th>
                <th colSpan={2} className="p-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 border-l border-slate-100">QĐ Giao đất</th>
                <th colSpan={2} className="p-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 border-l border-slate-100">PCCC</th>
                <th colSpan={2} className="p-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 border-l border-slate-100">HTKT/ĐTM</th>
                <th colSpan={2} className="p-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 border-l border-slate-100">GP Xây dựng</th>
                <th 
                  onClick={() => handleSort('completion_date')}
                  className="p-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 border-l border-slate-100 cursor-pointer hover:text-blue-600 transition-colors"
                >
                  <div className="flex items-center justify-center gap-1">
                    Hoàn thành
                    {sortConfig.key === 'completion_date' ? (
                      sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                    ) : <ArrowUpDown size={12} className="opacity-30" />}
                  </div>
                </th>
                <th className="p-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 border-l border-slate-100">Tiến độ {reportDate}</th>
                <th className="p-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 border-l border-slate-100">Thao tác</th>
              </tr>
              <tr className="bg-slate-50/50">
                <th className="border-b border-slate-100 sticky left-0 bg-slate-50/50 z-10"></th>
                <th className="p-2 text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100 border-l border-slate-100">CĐT</th>
                <th className="p-2 text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100 border-l border-slate-50">NN</th>
                <th className="p-2 text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100 border-l border-slate-100">CĐT</th>
                <th className="p-2 text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100 border-l border-slate-50">NN</th>
                <th className="p-2 text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100 border-l border-slate-100">CĐT</th>
                <th className="p-2 text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100 border-l border-slate-50">NN</th>
                <th className="p-2 text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100 border-l border-slate-100">CĐT</th>
                <th className="p-2 text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100 border-l border-slate-50">NN</th>
                <th className="p-2 text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100 border-l border-slate-100">CĐT</th>
                <th className="p-2 text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100 border-l border-slate-50">NN</th>
                <th className="p-2 text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100 border-l border-slate-100">CĐT</th>
                <th className="p-2 text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100 border-l border-slate-50">NN</th>
                <th className="border-b border-slate-100 border-l border-slate-100"></th>
                <th className="border-b border-slate-100 border-l border-slate-100"></th>
                <th className="border-b border-slate-100 border-l border-slate-100"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={16} className="p-12 text-center text-slate-400 font-medium italic">Đang tải dữ liệu...</td>
                </tr>
              ) : currentProjects.length === 0 ? (
                <tr>
                  <td colSpan={16} className="p-12 text-center text-slate-400 font-medium italic">Không tìm thấy dự án nào</td>
                </tr>
              ) : (
                currentProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 border-b border-slate-100 sticky left-0 bg-white group-hover:bg-slate-50/80 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                      <div className="min-w-[200px]">
                        <p className="text-base font-black text-slate-900 line-clamp-1">{project.name}</p>
                        <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">{project.code}</p>
                      </div>
                    </td>
                    <td className="p-2 text-center border-b border-slate-100 border-l border-slate-100 text-sm font-medium text-slate-600">{project.chutruong_cdt_date || '-'}</td>
                    <td className="p-2 text-center border-b border-slate-100 border-l border-slate-50 text-sm font-medium text-slate-600">{project.chutruong_nn_date || '-'}</td>
                    <td className="p-2 text-center border-b border-slate-100 border-l border-slate-100 text-sm font-medium text-slate-600">{project.qh1500_cdt_date || '-'}</td>
                    <td className="p-2 text-center border-b border-slate-100 border-l border-slate-50 text-sm font-medium text-slate-600">{project.qh1500_nn_date || '-'}</td>
                    <td className="p-2 text-center border-b border-slate-100 border-l border-slate-100 text-sm font-medium text-slate-600">{project.qdgiaodat_cdt_date || '-'}</td>
                    <td className="p-2 text-center border-b border-slate-100 border-l border-slate-50 text-sm font-medium text-slate-600">{project.qdgiaodat_nn_date || '-'}</td>
                    <td className="p-2 text-center border-b border-slate-100 border-l border-slate-100 text-sm font-medium text-slate-600">{project.pccc_cdt_date || '-'}</td>
                    <td className="p-2 text-center border-b border-slate-100 border-l border-slate-50 text-sm font-medium text-slate-600">{project.pccc_nn_date || '-'}</td>
                    <td className="p-2 text-center border-b border-slate-100 border-l border-slate-100 text-sm font-medium text-slate-600">{project.htkt_dtm_cdt_date || '-'}</td>
                    <td className="p-2 text-center border-b border-slate-100 border-l border-slate-50 text-sm font-medium text-slate-600">{project.htkt_dtm_nn_date || '-'}</td>
                    <td className="p-2 text-center border-b border-slate-100 border-l border-slate-100 text-sm font-medium text-slate-600">{project.gpxaydung_cdt_date || '-'}</td>
                    <td className="p-2 text-center border-b border-slate-100 border-l border-slate-50 text-sm font-medium text-slate-600">{project.gpxaydung_nn_date || '-'}</td>
                    <td className="p-2 text-center border-b border-slate-100 border-l border-slate-100 text-sm font-medium text-slate-600">{project.completion_date || '-'}</td>
                    <td className="p-2 text-center border-b border-slate-100 border-l border-slate-100">
                      <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{project.progress_status_2026 || 'Chưa cập nhật'}</span>
                    </td>
                    <td className="p-2 text-center border-b border-slate-100 border-l border-slate-100">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => setEditingProject({...project})}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Chỉnh sửa mốc thời gian"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            setUpdatingProgressProject({...project});
                            setUpdateContent(project.progress_status_2026 || '');
                            setAttachments([]);
                          }}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1"
                          title="Cập nhật tiến độ"
                        >
                          <Clock size={16} />
                          <span className="text-sm font-bold hidden lg:inline">Cập nhật</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-base font-bold text-slate-500">
              Hiển thị {currentProjects.length} / {filteredProjects.length} dự án
            </p>
            <button 
              onClick={() => setShowAll(!showAll)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all shadow-sm border ${
                showAll 
                  ? 'bg-slate-900 text-white border-slate-900' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Layers size={14} />
              {showAll ? 'Bật phân trang' : 'Xem tất cả'}
            </button>
          </div>
          {!showAll && (
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-base font-black text-slate-900 px-4">
                Trang {currentPage} / {totalPages || 1}
              </span>
              <button 
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress Update Modal */}
      <AnimatePresence>
        {updatingProgressProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
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
                    <h3 className="text-xl font-black text-slate-900">Cập nhật tiến độ dự án</h3>
                    <p className="text-sm font-medium text-slate-500 mt-1">{updatingProgressProject.name}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setUpdatingProgressProject(null)}
                  className="p-2 hover:bg-white rounded-2xl text-slate-400 hover:text-slate-600 transition-all shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6">
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
                      handleSave({
                        ...updatingProgressProject,
                        progress_status_2026: updateContent
                      });
                      setUpdatingProgressProject(null);
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

      {/* Edit Modal */}
      <AnimatePresence>
        {editingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Cập nhật tiến độ năm</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">{editingProject.name}</p>
                </div>
                <button 
                  onClick={() => setEditingProject(null)}
                  className="p-2 hover:bg-white rounded-2xl text-slate-400 hover:text-slate-600 transition-all shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Chủ trương đầu tư */}
                  <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
                      Chủ trương đầu tư
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">CĐT (Ngày)</label>
                        <DatePicker
                          selected={parseDate(editingProject.chutruong_cdt_date)}
                          onChange={(date: Date | null) => setEditingProject({...editingProject, chutruong_cdt_date: formatDate(date)})}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="dd/mm/yyyy"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-base outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Cơ quan NN (Ngày)</label>
                        <DatePicker
                          selected={parseDate(editingProject.chutruong_nn_date)}
                          onChange={(date: Date | null) => setEditingProject({...editingProject, chutruong_nn_date: formatDate(date)})}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="dd/mm/yyyy"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-base outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* QH 1/500 */}
                  <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                      Quy hoạch 1/500
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">CĐT (Ngày)</label>
                        <DatePicker
                          selected={parseDate(editingProject.qh1500_cdt_date)}
                          onChange={(date: Date | null) => setEditingProject({...editingProject, qh1500_cdt_date: formatDate(date)})}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="dd/mm/yyyy"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-base outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Cơ quan NN (Ngày)</label>
                        <DatePicker
                          selected={parseDate(editingProject.qh1500_nn_date)}
                          onChange={(date: Date | null) => setEditingProject({...editingProject, qh1500_nn_date: formatDate(date)})}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="dd/mm/yyyy"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-base outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* QĐ Giao đất */}
                  <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-4 bg-amber-500 rounded-full" />
                      QĐ Giao đất / Cho thuê đất
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">CĐT (Ngày)</label>
                        <DatePicker
                          selected={parseDate(editingProject.qdgiaodat_cdt_date)}
                          onChange={(date: Date | null) => setEditingProject({...editingProject, qdgiaodat_cdt_date: formatDate(date)})}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="dd/mm/yyyy"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-base outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Cơ quan NN (Ngày)</label>
                        <DatePicker
                          selected={parseDate(editingProject.qdgiaodat_nn_date)}
                          onChange={(date: Date | null) => setEditingProject({...editingProject, qdgiaodat_nn_date: formatDate(date)})}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="dd/mm/yyyy"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-base outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PCCC */}
                  <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-4 bg-rose-500 rounded-full" />
                      Thẩm duyệt PCCC
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">CĐT (Ngày)</label>
                        <DatePicker
                          selected={parseDate(editingProject.pccc_cdt_date)}
                          onChange={(date: Date | null) => setEditingProject({...editingProject, pccc_cdt_date: formatDate(date)})}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="dd/mm/yyyy"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-base outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Cơ quan NN (Ngày)</label>
                        <DatePicker
                          selected={parseDate(editingProject.pccc_nn_date)}
                          onChange={(date: Date | null) => setEditingProject({...editingProject, pccc_nn_date: formatDate(date)})}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="dd/mm/yyyy"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-base outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* HTKT/ĐTM */}
                  <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-4 bg-purple-500 rounded-full" />
                      Đấu nối HTKT / ĐTM
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">CĐT (Ngày)</label>
                        <DatePicker
                          selected={parseDate(editingProject.htkt_dtm_cdt_date)}
                          onChange={(date: Date | null) => setEditingProject({...editingProject, htkt_dtm_cdt_date: formatDate(date)})}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="dd/mm/yyyy"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-base outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Cơ quan NN (Ngày)</label>
                        <DatePicker
                          selected={parseDate(editingProject.htkt_dtm_nn_date)}
                          onChange={(date: Date | null) => setEditingProject({...editingProject, htkt_dtm_nn_date: formatDate(date)})}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="dd/mm/yyyy"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-base outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* GP Xây dựng */}
                  <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-4 bg-indigo-500 rounded-full" />
                      Giấy phép xây dựng
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">CĐT (Ngày)</label>
                        <DatePicker
                          selected={parseDate(editingProject.gpxaydung_cdt_date)}
                          onChange={(date: Date | null) => setEditingProject({...editingProject, gpxaydung_cdt_date: formatDate(date)})}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="dd/mm/yyyy"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-base outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Cơ quan NN (Ngày)</label>
                        <DatePicker
                          selected={parseDate(editingProject.gpxaydung_nn_date)}
                          onChange={(date: Date | null) => setEditingProject({...editingProject, gpxaydung_nn_date: formatDate(date)})}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="dd/mm/yyyy"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-base outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hoàn thành & Tiến độ */}
                  <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-100 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-4 bg-slate-900 rounded-full" />
                        Kết thúc & Tiến độ thực tế
                      </h4>
                      <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
                        <Clock size={12} className="text-blue-500" />
                        <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Tiến độ đến: {reportDate}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Ngày hoàn thành dự kiến</label>
                        <DatePicker
                          selected={parseDate(editingProject.completion_date)}
                          onChange={(date: Date | null) => setEditingProject({...editingProject, completion_date: formatDate(date)})}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="dd/mm/yyyy"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-base outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Nội dung tiến độ thực tế</label>
                        <textarea 
                          placeholder="Nhập nội dung tiến độ (Ví dụ: Đã hoàn thành móng, đang lên tầng 1...)"
                          value={editingProject.progress_status_2026 || ''}
                          onChange={(e) => setEditingProject({...editingProject, progress_status_2026: e.target.value})}
                          rows={3}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-base outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setEditingProject(null)}
                  className="px-6 py-2.5 text-base font-bold text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={() => handleSave(editingProject)}
                  disabled={isSaving}
                  className="px-8 py-2.5 bg-slate-900 text-white rounded-2xl text-base font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? <Clock size={18} className="animate-spin" /> : <Save size={18} />}
                  Lưu cập nhật
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
