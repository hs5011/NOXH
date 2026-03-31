import React, { useState, useRef, useEffect } from 'react';
import { X, Save, Building2, MapPin, User, Calendar, Info, FileText, Upload, Trash2, DollarSign, Maximize, Users, Plus, Download } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { vi } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";
import { PROJECT_STAGES } from '../constants';

registerLocale('vi', vi);

import { Agency } from './AgencyManagement';
import { Process } from './StepManagementView';
import { calculateProjectStatus } from '../lib/projectUtils';

interface Location {
  ward: string;
  oldArea: string;
}

interface CreateProjectProps {
  onClose: () => void;
  onSuccess: (project?: any) => void;
  project?: any;
  investors: string[];
  locations: Location[];
  projectGroups: string[];
  fundingSources: string[];
  projectStages: string[];
  projectSteps: string[];
  processingAgencies: Agency[];
  processes: Process[];
  followers: string[];
}

interface LegalFile {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  milestoneKey?: string; // Add milestoneKey
}

const PROJECT_REGIONS = [
  'Quận 1', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8', 'Quận 10', 'Quận 11', 'Quận 12',
  'Bình Tân', 'Bình Thạnh', 'Gò Vấp', 'Phú Nhuận', 'Tân Bình', 'Tân Phú', 'Thủ Đức',
  'Bình Chánh', 'Cần Giờ', 'Củ Chi', 'Hóc Môn', 'Nhà Bè'
];

export default function CreateProject({ 
  onClose, 
  onSuccess, 
  project, 
  investors, 
  locations, 
  projectGroups, 
  fundingSources,
  projectStages,
  projectSteps,
  processingAgencies,
  processes,
  followers
}: CreateProjectProps) {
  const isEdit = !!project;
  
  const [formData, setFormData] = useState({
    code: project?.code || `NOXH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    name: project?.name || '',
    investor: project?.investor || '',
    location: project?.location || '',
    isKeyProject: project?.isKeyProject || false,
    totalArea: project?.totalArea || '',
    height: project?.height || '',
    apartmentCount: project?.apartmentCount || '',
    totalInvestment: project?.totalInvestment || '',
    landStatus: project?.landStatus || '',
    startDate: project?.startDate || '',
    endDate: project?.endDate || '',
    projectGroup: project?.projectGroup || '',
    fundingSource: project?.fundingSource || '',
    processId: project?.processId || '',
    follower: project?.follower || '',
    // Detailed Milestones
    milestones: project?.milestones || {},
    implementationPlan: project?.implementationPlan || {}
  });
  
  const [files, setFiles] = useState<LegalFile[]>(project?.files || []);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'legal'>('general');
  const [activeMilestoneFiles, setActiveMilestoneFiles] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEdit && formData.processId && Object.keys(formData.milestones).length === 0) {
      const selectedProcess = processes.find(p => p.id === formData.processId);
      if (selectedProcess && selectedProcess.parentSteps.length > 0 && selectedProcess.parentSteps[0].childSteps.length > 0) {
        const firstStepId = selectedProcess.parentSteps[0].childSteps[0].id;
        const today = new Date().toISOString().split('T')[0];
        setFormData(prev => ({
          ...prev,
          milestones: {
            [firstStepId]: {
              agency: today,
              investor: today
            }
          }
        }));
      }
    }
  }, [formData.processId, isEdit, processes]);

  const getStepName = (stepId: string) => {
    const process = processes.find(p => p.id === formData.processId);
    if (!process) return 'N/A';
    
    for (const ps of process.parentSteps) {
      if (ps.id === stepId) return ps.name;
      const cs = ps.childSteps.find(c => c.id === stepId);
      if (cs) return cs.name;
    }
    return 'N/A';
  };

  const handleMilestoneChange = (key: string, type: 'investor' | 'agency' | 'actualDate', value: string) => {
    setFormData({
      ...formData,
      milestones: {
        ...formData.milestones,
        [key]: {
          ...formData.milestones[key],
          [type]: value
        }
      }
    });
  };

  const addFile = (file: File, milestoneKey?: string) => {
    const newFile: LegalFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      date: `${String(new Date().getDate()).padStart(2, '0')}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${new Date().getFullYear()}`,
      milestoneKey
    };
    setFiles([...files, newFile]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, milestoneKey?: string) => {
    if (e.target.files) {
      Array.from(e.target.files as FileList).forEach((file: File) => addFile(file, milestoneKey));
    }
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const { progress, currentStep, status, currentAgency, childStep, parentStep } = calculateProjectStatus(formData.milestones, formData.processId, processes, formData.implementationPlan || {});

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedProject = {
      ...project,
      ...formData,
      files,
      progress,
      status,
      currentStep,
      currentAgency,
      childStep,
      parentStep,
      deadline: formData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    setSubmitting(false);
    onSuccess(updatedProject);
  };


  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-7xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 my-4 flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
              <Building2 size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{isEdit ? 'Cập nhật thông tin Dự án' : 'Khởi tạo Dự án NOXH mới'}</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Hệ thống Quản lý Dự án Sở Xây dựng</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Main Content Split */}
        <div className="flex-1 overflow-hidden flex">
          <form id="create-project-form" onSubmit={handleSubmit} className="flex flex-1 overflow-hidden">
            {/* Left Column: Form Info (70%) */}
            <div className="w-[70%] overflow-y-auto border-r border-slate-100 flex flex-col">
              {/* Tabs Navigation */}
              <div className="flex border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => setActiveTab('general')}
                  className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${
                    activeTab === 'general' 
                      ? 'text-blue-600 border-blue-600 bg-white' 
                      : 'text-slate-400 border-transparent hover:text-slate-600'
                  }`}
                >
                  1. THÔNG TIN CHUNG DỰ ÁN
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('legal')}
                  className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${
                    activeTab === 'legal' 
                      ? 'text-blue-600 border-blue-600 bg-white' 
                      : 'text-slate-400 border-transparent hover:text-slate-600'
                  }`}
                >
                  2. Kế hoạch thực hiện
                </button>
              </div>

              <div className="p-10 space-y-12">
                {activeTab === 'general' && (
                  <>
                    {/* Section 1: Thông tin chung */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                          <Info size={18} />
                        </div>
                        <h4 className="text-base font-bold text-slate-800 uppercase tracking-wider">Thông tin chung dự án</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mã dự án (Tự động)</label>
                          <input 
                            type="text" 
                            value={formData.code} 
                            disabled 
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono text-slate-500"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tên dự án <span className="text-rose-500">*</span></label>
                            <div className="flex items-center gap-4">
                              <label className="flex items-center gap-2 cursor-pointer group">
                                <input 
                                  type="checkbox" 
                                  checked={formData.isKeyProject}
                                  onChange={e => setFormData({...formData, isKeyProject: e.target.checked})}
                                  className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                                />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-amber-600 transition-colors">Dự án trọng điểm</span>
                              </label>
                            </div>
                          </div>
                          <input 
                            required
                            type="text" 
                            placeholder="Ví dụ: Dự án Nhà ở xã hội tại số 04 Phan Chu Trinh..."
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quy trình thực hiện <span className="text-rose-500">*</span></label>
                          <select 
                            required
                            value={formData.processId}
                            onChange={e => setFormData({...formData, processId: e.target.value})}
                            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                          >
                            <option value="">Chọn quy trình...</option>
                            {processes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chủ đầu tư <span className="text-rose-500">*</span></label>
                          </div>
                          <select 
                            required
                            value={formData.investor}
                            onChange={e => setFormData({...formData, investor: e.target.value})}
                            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                          >
                            <option value="">Chọn chủ đầu tư...</option>
                            {investors.map(inv => <option key={inv} value={inv}>{inv}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Người theo dõi</label>
                          <select 
                            value={formData.follower}
                            onChange={e => setFormData({...formData, follower: e.target.value})}
                            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                          >
                            <option value="">Chọn người theo dõi...</option>
                            {followers.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nhóm dự án</label>
                          <select 
                            value={formData.projectGroup}
                            onChange={e => setFormData({...formData, projectGroup: e.target.value})}
                            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                          >
                            <option value="">Chọn nhóm dự án...</option>
                            {projectGroups.map(pg => <option key={pg} value={pg}>{pg}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nguồn vốn</label>
                          <select 
                            value={formData.fundingSource}
                            onChange={e => setFormData({...formData, fundingSource: e.target.value})}
                            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                          >
                            <option value="">Chọn nguồn vốn...</option>
                            {fundingSources.map(fs => <option key={fs} value={fs}>{fs}</option>)}
                          </select>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Địa điểm <span className="text-rose-500">*</span></label>
                          </div>
                          <select 
                            required
                            value={formData.location}
                            onChange={e => setFormData({...formData, location: e.target.value})}
                            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                          >
                            <option value="">Chọn địa điểm...</option>
                            {locations.map(loc => <option key={loc.ward} value={loc.ward}>{loc.ward}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Quy mô & Tiến độ thực hiện */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <Maximize size={18} />
                          </div>
                          <h4 className="text-base font-bold text-slate-800 uppercase tracking-wider">Quy mô dự án</h4>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Diện tích đất (ha)</label>
                          <input 
                            type="number" 
                            step="0.01"
                            placeholder="0.00"
                            value={formData.totalArea}
                            onChange={e => setFormData({...formData, totalArea: e.target.value})}
                            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tầng cao</label>
                          <input 
                            type="number" 
                            placeholder="0"
                            value={formData.height}
                            onChange={e => setFormData({...formData, height: e.target.value})}
                            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Số lượng căn hộ</label>
                          <input 
                            type="number" 
                            placeholder="0"
                            value={formData.apartmentCount}
                            onChange={e => setFormData({...formData, apartmentCount: e.target.value})}
                            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <DollarSign size={12} /> Tổng mức đầu tư (Tỷ)
                          </label>
                          <input 
                            type="number" 
                            placeholder="0.00"
                            value={formData.totalInvestment}
                            onChange={e => setFormData({...formData, totalInvestment: e.target.value})}
                            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ngày bắt đầu (Từ)</label>
                          <DatePicker 
                            selected={formData.startDate ? new Date(formData.startDate) : null}
                            onChange={(date) => setFormData({...formData, startDate: date ? date.toISOString().split('T')[0] : ''})}
                            dateFormat={["dd/MM/yyyy", "yyyy"]}
                            placeholderText="dd/mm/yyyy hoặc yyyy"
                            locale="vi"
                            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ngày hoàn thành (Đến)</label>
                          <DatePicker 
                            selected={formData.endDate ? new Date(formData.endDate) : null}
                            onChange={(date) => setFormData({...formData, endDate: date ? date.toISOString().split('T')[0] : ''})}
                            dateFormat={["dd/MM/yyyy", "yyyy"]}
                            placeholderText="dd/mm/yyyy hoặc yyyy"
                            locale="vi"
                            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'legal' && (
                  /* Section 3: Kế hoạch thực hiện */
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                        <FileText size={18} />
                      </div>
                      <h4 className="text-base font-bold text-slate-800 uppercase tracking-wider">Kế hoạch thực hiện chi tiết</h4>
                    </div>
                    
                    {!formData.processId ? (
                      <div className="p-12 text-center bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-bold italic">Vui lòng chọn quy trình ở tab Thông tin chung để lập kế hoạch</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-12 gap-4 px-4">
                          <div className="col-span-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bước quy trình / Cơ quan xử lý</div>
                          <div className="col-span-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Hạn CĐT</div>
                          <div className="col-span-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Hạn Cơ quan NN</div>
                        </div>

                        {processes.find(p => p.id === formData.processId)?.parentSteps.map((parent) => (
                          <React.Fragment key={parent.id}>
                            {/* Parent Step Row */}
                            <div className="grid grid-cols-12 gap-4 items-center p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                              <div className="col-span-12">
                                <span className="text-sm font-black text-blue-900">{parent.name}</span>
                              </div>
                            </div>

                            {/* Child Steps */}
                            {parent.childSteps.map((child) => (
                              <div key={child.id} className="grid grid-cols-12 gap-4 items-center p-4 bg-white rounded-2xl border border-slate-100 ml-8 hover:border-blue-200 transition-all group">
                                <div className="col-span-6">
                                  <p className="text-xs font-bold text-slate-700">{child.name}</p>
                                  <p className="text-[10px] text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                                    <Building2 size={10} /> {child.agency}
                                  </p>
                                </div>
                                <div className="col-span-3">
                                  <DatePicker 
                                    selected={(formData.milestones as any)[child.id]?.investor ? new Date((formData.milestones as any)[child.id].investor) : null}
                                    onChange={(date) => handleMilestoneChange(child.id, 'investor', date ? date.toISOString().split('T')[0] : '')}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Chọn ngày"
                                    locale="vi"
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                  />
                                </div>
                                <div className="col-span-3">
                                  <DatePicker 
                                    selected={(formData.milestones as any)[child.id]?.agency ? new Date((formData.milestones as any)[child.id].agency) : null}
                                    onChange={(date) => handleMilestoneChange(child.id, 'agency', date ? date.toISOString().split('T')[0] : '')}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Chọn ngày"
                                    locale="vi"
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                  />
                                </div>
                              </div>
                            ))}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Files & Upload (30%) */}
            <div className="w-[30%] bg-slate-50/50 flex flex-col">
              <div className="p-8 flex-1 flex flex-col space-y-8 overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Upload size={18} className="text-blue-600" />
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Hồ sơ đính kèm</h4>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-md">
                    {files.length} file
                  </span>
                </div>

                {/* File List Area */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {files.length > 0 ? (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">
                          <th className="py-2 px-1">STT</th>
                          <th className="py-2 px-1">Tên file</th>
                          <th className="py-2 px-1">Dung lượng</th>
                          <th className="py-2 px-1">Ngày</th>
                          <th className="py-2 px-1 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {files.map((file, index) => (
                          <tr key={file.id} className="group hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-1 text-xs font-bold text-slate-500">{index + 1}</td>
                            <td className="py-3 px-1">
                              <p className="text-xs font-bold text-slate-900 truncate max-w-[150px]" title={file.name}>{file.name}</p>
                              {file.milestoneKey && (
                                <p className="text-[9px] font-bold text-blue-600 mt-0.5">
                                  {getStepName(file.milestoneKey)}
                                </p>
                              )}
                            </td>
                            <td className="py-3 px-1 text-xs text-slate-500">{file.size}</td>
                            <td className="py-3 px-1 text-xs text-slate-500">{file.date}</td>
                            <td className="py-3 px-1 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button type="button" className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all" title="Tải xuống">
                                  <Download size={14} />
                                </button>
                                <button type="button" onClick={() => removeFile(file.id)} className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-all" title="Xóa file">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 py-12">
                      <FileText size={48} strokeWidth={1} className="mb-4 opacity-20" />
                      <p className="text-xs font-bold uppercase tracking-widest opacity-40">Chưa có tài liệu</p>
                    </div>
                  )}
                </div>

                {/* Upload Area */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 rounded-[28px] p-8 flex flex-col items-center justify-center text-slate-400 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer group shrink-0"
                >
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                    <Upload size={24} className="text-slate-300 group-hover:text-blue-500" />
                  </div>
                  <p className="text-xs font-bold text-slate-500 text-center">Kéo thả hoặc nhấp để tải lên</p>
                  <p className="text-[10px] mt-1 opacity-60">PDF, DOCX, DWG (Max 20MB)</p>
                  <input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={(e) => handleFileChange(e)}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Popover for milestone files */}
        {activeMilestoneFiles && (
          <div className="fixed inset-0 bg-slate-900/20 z-[60] flex items-center justify-center" onClick={() => setActiveMilestoneFiles(null)}>
            <div className="bg-white rounded-3xl p-6 w-96 shadow-2xl" onClick={e => e.stopPropagation()}>
              <h4 className="font-bold mb-4 text-slate-800">
                {getStepName(activeMilestoneFiles)}
              </h4>
              <div className="space-y-2">
                {files.filter(f => f.milestoneKey === activeMilestoneFiles).map(file => (
                  <div key={file.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="text-xs truncate flex-1 mr-2">{file.name}</span>
                    <div className="flex gap-1 shrink-0">
                      <button type="button" className="p-1 text-slate-400 hover:text-blue-600"><Download size={14} /></button>
                      <button type="button" onClick={() => removeFile(file.id)} className="p-1 text-slate-400 hover:text-rose-600"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-8 border-t border-slate-100 flex justify-end gap-4 bg-white shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="px-10 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Hủy bỏ
          </button>
          <button 
            type="submit"
            form="create-project-form"
            disabled={submitting}
            className="px-14 py-4 bg-blue-600 text-white rounded-2xl text-sm font-bold shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-3 disabled:opacity-50"
          >
            <Save size={20} />
            {submitting ? 'Đang xử lý...' : (isEdit ? 'Cập nhật dự án' : 'Khởi tạo dự án')}
          </button>
        </div>
      </div>
    </div>
  );
}
