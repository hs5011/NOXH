import React, { useState, useEffect } from 'react';
import { 
  Search, Building2, ChevronRight, ChevronLeft, 
  Clock, CheckCircle2, X, Edit3, Paperclip, 
  Upload, Trash2, File, Save, Filter, ArrowLeft,
  BarChart3, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
}

interface Agency {
  id: string;
  name: string;
  departments: string[];
}

interface AgencyProjectStatsProps {
  processingAgencies: Agency[];
}

export default function AgencyProjectStats({ processingAgencies }: AgencyProjectStatsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'agencies' | 'departments' | 'investors' | 'projects'>('agencies');
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedInvestor, setSelectedInvestor] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Summary Stats
  const totalProjects = projects.length;
  const overdueProjects = projects.filter(p => p.status === 'Delayed').length;
  const onTimeProjects = totalProjects - overdueProjects;
  
  // Progress Update State
  const [updatingProgressProject, setUpdatingProgressProject] = useState<Project | null>(null);
  const [updateContent, setUpdateContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/projects');
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProgress = async (project: Project, content: string) => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/v1/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...project, progress_status_2026: content }),
      });
      if (res.ok) {
        setProjects(prev => prev.map(p => p.id === project.id ? { ...p, progress_status_2026: content } : p));
        setUpdatingProgressProject(null);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getAgencyStats = (agencyName: string) => {
    const agencyProjects = projects.filter(p => p.currentAgency === agencyName);
    const delayed = agencyProjects.filter(p => p.status === 'Delayed' || p.status === 'Warning').length;
    return {
      total: agencyProjects.length,
      delayed
    };
  };

  const getDepartmentStats = (agencyName: string, deptName: string) => {
    const deptProjects = projects.filter(p => {
      if (agencyName === '168 Phường xã') return p.location.includes(deptName);
      return p.currentAgency === agencyName && p.currentDepartment === deptName;
    });
    const delayed = deptProjects.filter(p => p.status === 'Delayed' || p.status === 'Warning').length;
    return {
      total: deptProjects.length,
      delayed
    };
  };

  const getInvestorStats = (investorName: string) => {
    const investorProjects = projects.filter(p => p.investor === investorName);
    const delayed = investorProjects.filter(p => p.status === 'Delayed' || p.status === 'Warning').length;
    return {
      total: investorProjects.length,
      delayed
    };
  };

  const investors = Array.from(new Set(projects.map(p => p.investor))).sort();

  const filteredProjects = projects.filter(p => {
    if (view === 'projects') {
      if (selectedInvestor) return p.investor === selectedInvestor;
      if (selectedDepartment) {
        if (selectedAgency?.name === '168 Phường xã') return p.location.includes(selectedDepartment);
        return p.currentAgency === selectedAgency?.name && p.currentDepartment === selectedDepartment;
      }
      return p.currentAgency === selectedAgency?.name;
    }
    return false;
  }).filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBack = () => {
    if (view === 'projects') {
      if (selectedInvestor) {
        setView('investors');
        setSelectedInvestor(null);
      } else if (selectedDepartment) {
        setView('departments');
        setSelectedDepartment(null);
      } else {
        setView('agencies');
        setSelectedAgency(null);
      }
    } else if (view === 'departments' || view === 'investors') {
      setView('agencies');
      setSelectedAgency(null);
      setSelectedInvestor(null);
    }
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
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={20} className="text-blue-600" />
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Thống kê DA theo cơ quan</h2>
          </div>
          <p className="text-slate-500 text-base font-medium">Theo dõi số lượng và tiến độ dự án tại các cơ quan nhà nước</p>
        </div>
        
        {view !== 'agencies' && (
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm font-bold text-base"
          >
            <ArrowLeft size={18} />
            Quay lại
          </button>
        )}
      </div>

      {showSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm"
        >
          <CheckCircle2 size={18} />
          <span className="text-base font-bold">Cập nhật tiến độ thành công!</span>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {view === 'agencies' && (
          <motion.div 
            key="agency-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Summary Statistics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-50 p-4 rounded-3xl border border-blue-100 flex flex-col items-center text-center shadow-sm">
                <span className="text-3xl font-black text-blue-700 tracking-tighter">{totalProjects}</span>
                <span className="text-xs font-black text-blue-400 uppercase tracking-widest mt-1">Tổng dự án</span>
              </div>
              <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100 flex flex-col items-center text-center shadow-sm">
                <span className="text-3xl font-black text-emerald-700 tracking-tighter">{onTimeProjects}</span>
                <span className="text-xs font-black text-emerald-400 uppercase tracking-widest mt-1">Còn hạn</span>
              </div>
              <div className="bg-rose-50 p-4 rounded-3xl border border-rose-100 flex flex-col items-center text-center shadow-sm">
                <span className="text-3xl font-black text-rose-700 tracking-tighter">{overdueProjects}</span>
                <span className="text-xs font-black text-rose-400 uppercase tracking-widest mt-1">Trễ hạn</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Investor Card */}
              <button
                onClick={() => setView('investors')}
                className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all text-left group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                    <Building2 size={24} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 leading-tight mb-2 group-hover:text-emerald-600 transition-colors">Chủ đầu tư</h3>
                  <div className="flex items-end justify-between mt-6">
                    <div className="space-y-1">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Tổng số CĐT</p>
                      <p className="text-4xl font-black text-slate-900 tracking-tighter">{investors.length}</p>
                    </div>
                  </div>
                </div>
              </button>

              {processingAgencies.map((agency) => {
                const stats = getAgencyStats(agency.name);
                return (
                  <button
                    key={agency.id}
                    onClick={() => {
                      setSelectedAgency(agency);
                      if (agency.name === 'Sở Xây dựng' || agency.name === '168 Phường xã') {
                        setView('departments');
                      } else {
                        setView('projects');
                      }
                    }}
                    className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all text-left group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />
                    
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                        <Building2 size={24} />
                      </div>
                      <h3 className="text-xl font-black text-slate-800 leading-tight mb-2 group-hover:text-blue-600 transition-colors">{agency.name}</h3>
                      
                      <div className="flex items-end justify-between mt-6">
                        <div className="space-y-1">
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Đang xử lý</p>
                          <p className="text-4xl font-black text-slate-900 tracking-tighter">{stats.total}</p>
                        </div>
                        
                        {stats.delayed > 0 && (
                          <div className="flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100">
                            <AlertCircle size={14} className="text-rose-500" />
                            <span className="text-xs font-black text-rose-600 uppercase tracking-wider">{stats.delayed} trễ hạn</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {view === 'departments' && selectedAgency && (
          <motion.div 
            key="department-grid"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {selectedAgency.departments.map((dept, idx) => {
              const stats = getDepartmentStats(selectedAgency.name, dept);
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedDepartment(dept);
                    setView('projects');
                  }}
                  className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all text-left group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />
                  <div className="relative z-10">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                      <Building2 size={20} />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 leading-tight mb-2 group-hover:text-blue-600 transition-colors">{dept}</h3>
                    <div className="flex items-end justify-between mt-4">
                      <div className="space-y-1">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Đang xử lý</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">{stats.total}</p>
                      </div>
                      {stats.delayed > 0 && (
                        <div className="flex items-center gap-1.5 bg-rose-50 px-2 py-1 rounded-full border border-rose-100">
                          <AlertCircle size={12} className="text-rose-500" />
                          <span className="text-xs font-black text-rose-600 uppercase tracking-wider">{stats.delayed} trễ</span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}

        {view === 'investors' && (
          <motion.div 
            key="investor-grid"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {investors.map((investor, idx) => {
              const stats = getInvestorStats(investor);
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedInvestor(investor);
                    setView('projects');
                  }}
                  className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all text-left group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />
                  <div className="relative z-10">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                      <Building2 size={20} />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 leading-tight mb-2 group-hover:text-emerald-600 transition-colors">{investor}</h3>
                    <div className="flex items-end justify-between mt-4">
                      <div className="space-y-1">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Dự án</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">{stats.total}</p>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}

        {view === 'projects' && (
          <motion.div 
            key="project-list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">
                      {selectedInvestor || selectedDepartment || selectedAgency?.name}
                    </h3>
                    <p className="text-sm font-medium text-slate-500">Danh sách dự án đang xử lý</p>
                  </div>
                </div>
                
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Tìm dự án..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-base w-full md:w-64 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left p-4 text-xs font-black text-slate-400 uppercase tracking-widest">Mã dự án</th>
                      <th className="text-left p-4 text-xs font-black text-slate-400 uppercase tracking-widest">Tên dự án</th>
                      <th className="text-left p-4 text-xs font-black text-slate-400 uppercase tracking-widest">Chủ đầu tư</th>
                      <th className="text-center p-4 text-xs font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                      <th className="text-center p-4 text-xs font-black text-slate-400 uppercase tracking-widest">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-slate-400 font-medium italic">Không có dự án nào đang xử lý</td>
                      </tr>
                    ) : (
                      filteredProjects.map((project) => (
                        <tr key={project.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="p-4 text-sm font-bold text-slate-500">{project.code}</td>
                          <td className="p-4 text-base font-black text-slate-900">{project.name}</td>
                          <td className="p-4 text-sm font-bold text-slate-600">{project.investor}</td>
                          <td className="p-4 text-center">
                            <span className={`text-xs font-black uppercase tracking-wider px-2 py-1 rounded-full ${
                              project.status === 'On Track' ? 'bg-emerald-50 text-emerald-600' :
                              project.status === 'Warning' ? 'bg-amber-50 text-amber-600' :
                              'bg-rose-50 text-rose-600'
                            }`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => {
                                setUpdatingProgressProject(project);
                                setUpdateContent(project.progress_status_2026 || '');
                                setAttachments([]);
                              }}
                              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all mx-auto"
                            >
                              <Clock size={14} />
                              <span className="text-xs font-black uppercase tracking-widest">Cập nhật tiến độ</span>
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

      {/* Progress Update Modal (Reused from AnnualProgressUpdate) */}
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
