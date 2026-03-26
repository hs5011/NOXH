import React from 'react';
import { X, Building2, MapPin, Calendar, Info, FileText, DollarSign, Maximize, Users, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface ProjectDetailProps {
  project: any;
  onClose: () => void;
}

export default function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  if (!project) return null;

  const statusColors: any = {
    'On Track': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Delayed': 'bg-rose-50 text-rose-600 border-rose-100',
    'Warning': 'bg-amber-50 text-amber-600 border-amber-100'
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 my-8">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
              <Building2 size={24} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-4xl font-bold text-slate-900">{project.name}</h3>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-base font-bold border ${statusColors[project.status] || 'bg-slate-50'}`}>
                    {project.status}
                  </span>
                  {project.isKeyProject && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-600 border border-amber-200 rounded-full text-base font-bold uppercase">
                      Trọng điểm
                    </span>
                  )}
                  {project.isPublicInvestment && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 border border-blue-200 rounded-full text-base font-bold uppercase">
                      DTC
                    </span>
                  )}
                </div>
              </div>
              <p className="text-base text-slate-400 font-bold uppercase tracking-[0.2em]">{project.code}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-200 rounded-2xl text-slate-400 transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <h4 className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Info size={16} /> Thông tin cơ bản
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-base text-slate-400 font-bold uppercase">Chủ đầu tư</p>
                    <p className="text-lg font-bold text-slate-700">{project.investor}</p>
                  </div>
                  <div>
                    <p className="text-base text-slate-400 font-bold uppercase">Địa điểm</p>
                    <p className="text-lg font-bold text-slate-700">{project.location}</p>
                  </div>
                  <div>
                    <p className="text-base text-slate-400 font-bold uppercase">Giai đoạn</p>
                    <p className="text-lg font-bold text-slate-700">{project.stage}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <h4 className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Maximize size={16} /> Quy mô & Đầu tư
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <p className="text-base text-slate-400 font-bold uppercase">Diện tích đất</p>
                    <p className="text-lg font-bold text-slate-700">{project.totalArea || 'N/A'} ha</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-base text-slate-400 font-bold uppercase">Tầng cao</p>
                    <p className="text-lg font-bold text-slate-700">{project.height || 'N/A'} tầng</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-base text-slate-400 font-bold uppercase">Số căn hộ</p>
                    <p className="text-lg font-bold text-slate-700">{project.apartmentCount || 'N/A'} căn</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-base text-slate-400 font-bold uppercase">Tổng mức đầu tư</p>
                    <p className="text-lg font-bold text-blue-600">{project.totalInvestment || 'N/A'} Tỷ</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Milestones */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 size={16} /> Tiến độ hồ sơ pháp lý (Chi tiết)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Chủ trương đầu tư', key: 'investmentPolicy' },
                  { label: 'Quy hoạch chi tiết 1/500', key: 'planning1500' },
                  { label: 'Quyết định giao đất', key: 'landAllocation' },
                  { label: 'Thẩm duyệt PCCC', key: 'pcccApproval' },
                  { label: 'Đấu nối HTKT/ĐTM', key: 'technicalConnection' },
                  { label: 'Giấy phép xây dựng', key: 'constructionPermit' },
                ].map((m) => {
                  const milestone = project.milestones?.[m.key] || { investor: '', agency: '' };
                  const isCompleted = !!milestone.agency;
                  const isInProgress = !!milestone.investor && !milestone.agency;
                  
                  return (
                    <div key={m.key} className={`p-4 rounded-2xl border transition-all ${isCompleted ? 'bg-emerald-50 border-emerald-100' : isInProgress ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-lg font-bold ${isCompleted ? 'text-emerald-700' : isInProgress ? 'text-amber-700' : 'text-slate-500'}`}>{m.label}</span>
                        {isCompleted ? <CheckCircle2 size={18} className="text-emerald-500" /> : isInProgress ? <Clock size={18} className="text-amber-500" /> : <Clock size={18} className="text-slate-300" />}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-400 font-bold uppercase mb-1">CĐT nộp</p>
                          <p className="text-base font-bold text-slate-600">{milestone.investor || '---'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400 font-bold uppercase mb-1">Cơ quan trả</p>
                          <p className="text-base font-bold text-slate-600">{milestone.agency || '---'}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Files */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FileText size={16} /> Hồ sơ pháp lý ({project.files?.length || 0})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.files?.map((file: any) => (
                  <div key={file.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-900 truncate max-w-[150px]">{file.name}</p>
                        <p className="text-base text-slate-400 font-medium">{file.type} • {file.size}</p>
                      </div>
                    </div>
                    <CheckCircle2 size={18} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
                {(!project.files || project.files.length === 0) && (
                  <div className="col-span-2 py-8 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center text-slate-300">
                    <FileText size={32} className="mb-2" />
                    <p className="text-lg font-bold">Chưa có hồ sơ đính kèm</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Status & Actions */}
          <div className="space-y-6">
            <div className="bg-blue-600 rounded-[32px] p-8 text-white shadow-xl shadow-blue-100">
              <h4 className="text-base font-bold uppercase tracking-widest opacity-60 mb-6">Trạng thái hiện tại</h4>
              <div className="space-y-6">
                <div>
                  <p className="text-base uppercase font-bold opacity-60">Bước đang thực hiện</p>
                  <p className="text-2xl font-bold">{project.currentStep}</p>
                </div>
                <div>
                  <p className="text-base uppercase font-bold opacity-60">Cơ quan chủ trì</p>
                  <p className="text-lg font-bold">
                    {project.currentAgency}{project.currentDepartment ? ` - ${project.currentDepartment}` : ''}
                  </p>
                </div>
                <div>
                  <p className="text-base uppercase font-bold opacity-60">Thời hạn xử lý</p>
                  <p className="text-lg font-bold flex items-center gap-2">
                    <Clock size={16} /> {project.deadline}
                  </p>
                </div>
              </div>
              <button className="w-full mt-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl text-lg font-bold transition-all">
                Đôn đốc xử lý
              </button>
            </div>

            <div className="bg-slate-900 rounded-[32px] p-8 text-white">
              <h4 className="text-base font-bold uppercase tracking-widest opacity-60 mb-4">Nhật ký xử lý</h4>
              <div className="space-y-4">
                {[
                  { date: '12/03', action: 'Tiếp nhận hồ sơ', user: 'Admin' },
                  { date: '14/03', action: 'Thẩm định bước 1', user: 'SXD' },
                ].map((log, i) => (
                  <div key={i} className="flex gap-3 text-lg">
                    <span className="text-slate-500 font-mono">{log.date}</span>
                    <div>
                      <p className="font-bold">{log.action}</p>
                      <p className="text-base opacity-40">{log.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
