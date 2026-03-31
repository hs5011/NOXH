import React, { useState, useEffect } from 'react';
import { 
  Building2, Clock, CheckCircle2, AlertCircle, 
  FileText, MessageSquare, History, Info, 
  ChevronRight, ChevronDown, Upload, Save, Send, AlertTriangle,
  User, Calendar, Shield, MapPin, DollarSign,
  FileCheck, FileX, Paperclip, Download, Eye,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { calculateProjectStatus } from '../lib/projectUtils';

// --- Types ---
import { Process, ParentStep, ChildStep } from './StepManagementView';

interface ExtendedParentStep extends ParentStep {
  status?: string;
}

interface Project {
  id: string;
  code: string;
  name: string;
  investor: string;
  location: string;
  type: string;
  fundingSource: string;
  currentStage: string;
  currentStep: string;
  processingAgency: string;
  processingDept: string;
  status: string;
  completionRate: number;
  isPublicInvestment: boolean;
  processId?: string;
  milestones?: Record<string, {
    agency?: string;
    investor?: string;
  }>;
  implementationPlan?: Record<string, {
    agencyActualDate?: string;
    investorActualDate?: string;
  }>;
}

// --- Mock Data ---
// (MOCK_PROJECT is kept for fallback if needed, but primary data comes from props)
const MOCK_PROJECT: Project = {
  id: '1',
  code: 'NOXH-2024-001',
  name: 'Khu nhà ở xã hội Phường Phú Hữu',
  investor: 'Công ty Cổ phần Bất động sản Dragon Village',
  location: 'Phường Phú Hữu, TP. Thủ Đức',
  type: 'Nhà ở xã hội',
  fundingSource: 'Vốn doanh nghiệp',
  currentStage: 'Thực hiện đầu tư',
  currentStep: 'Quy hoạch chi tiết 1/500',
  processingAgency: 'Sở Quy hoạch Kiến trúc',
  processingDept: 'Phòng Quản lý quy hoạch',
  status: 'Đang xử lý',
  completionRate: 35,
  isPublicInvestment: false,
  processId: 'p2',
  milestones: {
    'ss1': { agency: '2024-02-10' },
    'ss2': { agency: '2024-03-15' },
    'ss3': { agency: '2024-04-15' },
    'ps1': { agency: '2024-01-20', investor: '2024-01-20' },
    'ps2': { agency: '2024-02-05', investor: '2024-02-05' },
  },
  implementationPlan: {
    'ss1': { agencyActualDate: '2024-02-05' },
    'ss2': { agencyActualDate: '2024-03-10' },
    'ss3': { agencyActualDate: '' },
    'ps1': { agencyActualDate: '2024-01-18', investorActualDate: '2024-01-19' },
    'ps2': { agencyActualDate: '2024-02-07', investorActualDate: '2024-02-04' },
  }
};

interface HousingUpdateViewProps {
  project?: any;
  onBack?: () => void;
  onSuccess?: (updatedProject: any) => void;
  stepStatuses?: string[];
  priorities?: string[];
  processingResults?: string[];
  processes?: Process[];
  initialStepId?: string;
  initialSubStepId?: string;
}

export default function HousingUpdateView({ 
  project: initialProject, 
  onBack,
  onSuccess,
  stepStatuses = ['Chưa bắt đầu', 'Đang xử lý', 'Chờ bổ sung hồ sơ', 'Đã trình', 'Đã phê duyệt', 'Hoàn thành', 'Bị trả hồ sơ', 'Tạm dừng'],
  priorities = ['Thấp', 'Trung bình', 'Cao', 'Khẩn cấp'],
  processingResults = ['Chưa có kết quả', 'Chấp thuận', 'Có ý kiến', 'Phê duyệt', 'Không chấp thuận', 'Yêu cầu bổ sung'],
  processes = [],
  initialStepId,
  initialSubStepId
}: HousingUpdateViewProps) {
  const [project, setProject] = useState<any>(initialProject || MOCK_PROJECT);
  const [activeStepId, setActiveStepId] = useState<string>(initialStepId || '');
  const [activeSubStepId, setActiveSubStepId] = useState<string>(initialSubStepId || '');
  const [activeTab, setActiveTab] = useState<'overview' | 'docs' | 'history' | 'comments'>('overview');
  const [isSaving, setIsSaving] = useState(false);
  const [nextStepIds, setNextStepIds] = useState<string[]>([]);
  const [completionDate, setCompletionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [currentStatus, setCurrentStatus] = useState<string>('Đang xử lý');
  const [processingContent, setProcessingContent] = useState<string>('');

  const selectedProcess = processes.find(p => p.id === project.processId);
  const steps: ExtendedParentStep[] = selectedProcess?.parentSteps || [];

  useEffect(() => {
    if (initialProject) {
      setProject(initialProject);
      const proc = processes.find(p => p.id === initialProject.processId);
      if (proc && proc.parentSteps.length > 0) {
        // Use initial IDs if provided, otherwise find first valid
        if (initialStepId && proc.parentSteps.some(s => s.id === initialStepId)) {
          setActiveStepId(initialStepId);
          if (initialSubStepId) {
            const parent = proc.parentSteps.find(s => s.id === initialStepId);
            if (parent?.childSteps?.some(cs => cs.id === initialSubStepId)) {
              setActiveSubStepId(initialSubStepId);
            } else if (parent?.childSteps?.length > 0) {
              setActiveSubStepId(parent.childSteps[0].id);
            }
          } else {
            const parent = proc.parentSteps.find(s => s.id === initialStepId);
            if (parent?.childSteps?.length > 0) {
              setActiveSubStepId(parent.childSteps[0].id);
            }
          }
        } else {
          // Fallback to first step if no initial IDs or invalid
          const isValid = proc.parentSteps.some(s => s.id === activeStepId);
          if (!activeStepId || !isValid) {
            setActiveStepId(proc.parentSteps[0].id);
            if (proc.parentSteps[0].childSteps?.length > 0) {
              setActiveSubStepId(proc.parentSteps[0].childSteps[0].id);
            }
          } else {
            const currentStep = proc.parentSteps.find(s => s.id === activeStepId);
            const isSubValid = currentStep?.childSteps?.some(s => s.id === activeSubStepId);
            if (!activeSubStepId || !isSubValid) {
              if (currentStep?.childSteps && currentStep.childSteps.length > 0) {
                setActiveSubStepId(currentStep.childSteps[0].id);
              }
            }
          }
        }
      }
    }
  }, [initialProject, processes, initialStepId, initialSubStepId]);

  useEffect(() => {
    const currentStep = steps.find(s => s.id === activeStepId);
    if (currentStep && currentStep.childSteps && currentStep.childSteps.length > 0) {
      // Only reset if current activeSubStep is not in the new activeStep's children
      if (!currentStep.childSteps.find(cs => cs.id === activeSubStepId)) {
        setActiveSubStepId(currentStep.childSteps[0].id);
      }
    }
  }, [activeStepId, steps]);
  
  const activeStep = steps.find(s => s.id === activeStepId) || steps[0];
  const activeSubStep = activeStep?.childSteps?.find(cs => cs.id === activeSubStepId) || activeStep?.childSteps?.[0];

  // Get all sub-steps for the "Next Step" select
  const allSubSteps = steps.flatMap(s => s.childSteps || []);

  const addDays = (dateStr: string, days: number) => {
    if (!dateStr) return '---';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '---';
    date.setDate(date.getDate() + (days || 0));
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${d}/${m}/${y}`;
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr || dateStr === 'N/A' || dateStr === '---') return dateStr || '---';
    // Handle YYYY-MM-DD
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }
    return dateStr;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoàn thành': return 'bg-emerald-500';
      case 'Đang xử lý': return 'bg-blue-500';
      case 'Chờ bổ sung hồ sơ': return 'bg-amber-500';
      case 'Bị trả hồ sơ': return 'bg-rose-500';
      default: return 'bg-slate-300';
    }
  };

  const getStatusLabel = (status: string) => {
    return status;
  };

  const getSubStepStatus = (childId: string) => {
    const milestone = project.milestones?.[childId];
    const actual = project.implementationPlan?.[childId];
    
    if (!milestone && !actual) return 'not_started';

    const hasAgencyActual = !!actual?.agencyActualDate;
    const hasInvestorActual = !!actual?.investorActualDate;
    
    if (!hasAgencyActual && !hasInvestorActual) return 'not_started';

    const isAgencyOverdue = hasAgencyActual && milestone?.agency && actual?.agencyActualDate && actual.agencyActualDate > milestone.agency;
    const isInvestorOverdue = hasInvestorActual && milestone?.investor && actual?.investorActualDate && actual.investorActualDate > milestone.investor;

    if (isAgencyOverdue || isInvestorOverdue) return 'overdue';
    
    return 'completed';
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // Create a deep copy of the project to update
    const updatedProject = JSON.parse(JSON.stringify(project));
    
    // 1. Update current sub-step actual date and status
    if (!updatedProject.implementationPlan) updatedProject.implementationPlan = {};
    if (!updatedProject.implementationPlan[activeSubStepId]) updatedProject.implementationPlan[activeSubStepId] = {};
    updatedProject.implementationPlan[activeSubStepId].agencyActualDate = completionDate;
    
    // 2. Update next steps milestones (HXL dự kiến)
    if (!updatedProject.milestones) updatedProject.milestones = {};
    nextStepIds.forEach(id => {
      const step = allSubSteps.find(s => s.id === id);
      if (step) {
        if (!updatedProject.milestones[id]) updatedProject.milestones[id] = {};
        
        const date = new Date(completionDate);
        date.setDate(date.getDate() + (step.slaDays || 0));
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        updatedProject.milestones[id].agency = `${y}-${m}-${d}`;
      }
    });

    // 3. Update parent step status if needed (simplified logic)
    if (currentStatus === 'Hoàn thành') {
      if (!updatedProject.stepStatuses) updatedProject.stepStatuses = {};
      updatedProject.stepStatuses[activeStepId] = 'Hoàn thành';
    }

    // 4. Recalculate project-level status using utility
    const { progress, currentStep, status, currentAgency, childStep, parentStep } = calculateProjectStatus(
      updatedProject.milestones || {}, 
      updatedProject.processId, 
      processes,
      updatedProject.implementationPlan || {}
    );

    updatedProject.progress = progress;
    updatedProject.currentStep = currentStep;
    updatedProject.status = status;
    updatedProject.currentAgency = currentAgency;
    updatedProject.childStep = childStep;
    updatedProject.parentStep = parentStep;

    setTimeout(() => {
      setIsSaving(false);
      setProject(updatedProject);
      if (onSuccess) {
        onSuccess(updatedProject);
      }
      // alert('Cập nhật tiến độ thành công!'); // Removed alert as per guidelines
      // Reset form
      setNextStepIds([]);
      setProcessingContent('');
    }, 800);
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* A. HEADER THÔNG TIN DỰ ÁN */}
      <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              {onBack && (
                <button 
                  onClick={onBack}
                  className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all mr-2"
                  title="Quay lại"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-black uppercase tracking-widest rounded-full border border-blue-100">
                {project.code}
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-sm font-black uppercase tracking-widest rounded-full border border-emerald-100">
                {project.status === 'Delayed' ? 'Chậm tiến độ' : 'Đang xử lý'}
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">{project.name}</h1>
            
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Quy trình:</p>
                <p className="text-base font-black text-blue-600 uppercase">{selectedProcess?.name || 'Chưa gán quy trình'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-500 text-lg">
              <div className="flex items-center gap-1.5">
                <Building2 size={20} />
                <span className="font-medium">{project.investor}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={20} />
                <span className="font-medium">{project.location}</span>
              </div>
            </div>
          </div>
          

        </div>
      </div>

      {/* B. VÙNG CẬP NHẬT TIẾN ĐỘ BƯỚC */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg bg-blue-600">
              <FileText size={24} />
            </div>
            <div className="flex flex-col">
              <h3 className="text-2xl font-black text-slate-900 leading-tight">Cập nhật tiến độ bước</h3>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">{activeStep?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl text-lg font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={22} />
              )}
              {isSaving ? 'Đang lưu...' : 'Lưu cập nhật'}
            </button>
          </div>
        </div>

        <div className="p-8 space-y-10">
          {/* Vùng 1: Thông tin bước hiện tại (Trên cùng, Full Width) */}
          <div className="space-y-6 pb-8 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 bg-blue-600 rounded-full" />
              <h4 className="text-xl font-black text-slate-900 uppercase tracking-widest">THÔNG TIN BƯỚC</h4>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                <div className="space-y-1">
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Tên thủ tục</p>
                  <p className="text-2xl font-black text-slate-900 leading-tight tracking-tight">{activeStep?.name}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Tên bước con</p>
                  <p className="text-2xl font-black text-blue-600 leading-tight tracking-tight">{activeSubStep?.name || '---'}</p>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col justify-end space-y-4">
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">HXL (Kế hoạch)</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">CQNN:</span>
                    <span className="text-xl font-black text-slate-700">{formatDate(project.milestones?.[activeSubStep?.id || '']?.agency) || '---'}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">CĐT:</span>
                    <span className="text-xl font-black text-slate-700">{formatDate(project.milestones?.[activeSubStep?.id || '']?.investor) || '---'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Vùng 2: Nội dung xử lý (Bên trái) */}
            <div className="space-y-8">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 bg-blue-600 rounded-full" />
                <h4 className="text-xl font-black text-slate-900 uppercase tracking-widest">NỘI DUNG XỬ LÝ</h4>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">NHẬP NỘI DUNG XỬ LÝ *</label>
                  <textarea 
                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl min-h-[120px] focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-slate-700 font-medium placeholder:text-slate-300"
                    placeholder="Nhập nội dung xử lý chi tiết... Ví dụ: Đã tiếp nhận hồ sơ, đang thẩm định tính pháp lý dự án, yêu cầu bổ sung giấy tờ A, B, C..."
                    value={processingContent}
                    onChange={(e) => setProcessingContent(e.target.value)}
                  />
                </div>

                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Info size={16} className="text-blue-600" />
                  </div>
                  <p className="text-sm font-bold text-blue-700">Vui lòng cập nhật trạng thái và ngày hoàn thành trước khi lưu.</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">NGÀY HOÀN THÀNH DỰ KIẾN</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="date"
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-slate-700 font-bold"
                        value={completionDate}
                        onChange={(e) => setCompletionDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">TRẠNG THÁI *</label>
                    <div className="relative">
                      <select 
                        className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-slate-700 font-bold appearance-none cursor-pointer"
                        value={currentStatus}
                        onChange={(e) => setCurrentStatus(e.target.value)}
                      >
                        {stepStatuses.map(status => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">HỒ SƠ ĐÍNH KÈM</label>
                  <div className="flex flex-col gap-4">
                    <button className="flex items-center gap-3 px-6 py-4 bg-slate-50 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl text-sm font-bold hover:bg-slate-100 hover:border-slate-300 hover:text-slate-600 transition-all justify-center group">
                      <Paperclip size={20} className="group-hover:scale-110 transition-transform" />
                      Chọn tệp tin đính kèm (Có thể chọn nhiều file)
                    </button>
                    <div className="flex flex-wrap gap-2">
                      <div className="px-3 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-200 group">
                        <FileText size={14} className="text-blue-500" />
                        Bao-cao-tien-do.pdf
                        <button className="text-slate-400 hover:text-red-500 font-black text-lg leading-none ml-1">×</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vùng 3: Cập nhật trạng thái (Bên phải) */}
            <div className="space-y-8">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 bg-blue-600 rounded-full" />
                <h4 className="text-xl font-black text-slate-900 uppercase tracking-widest">CẬP NHẬT TRẠNG THÁI</h4>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">BƯỚC TIẾP THEO</label>
                  <div className="relative">
                    <div className="flex flex-wrap gap-2 p-3 bg-white border border-slate-200 rounded-2xl min-h-[56px] cursor-pointer hover:border-blue-300 transition-all focus-within:ring-2 focus-within:ring-blue-100">
                      {nextStepIds.length === 0 && <span className="text-slate-400 text-base">Chọn các bước tiếp theo...</span>}
                      {nextStepIds.map(id => {
                        const step = allSubSteps.find(s => s.id === id);
                        return (
                          <div key={id} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold flex items-center gap-2 border border-blue-100">
                            {step?.name}
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setNextStepIds(nextStepIds.filter(i => i !== id));
                              }} 
                              className="text-blue-400 hover:text-blue-600 font-black text-lg leading-none"
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <select 
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val && !nextStepIds.includes(val)) {
                          setNextStepIds([...nextStepIds, val]);
                        }
                        e.target.value = "";
                      }}
                    >
                      <option value="">Thêm bước...</option>
                      {allSubSteps
                        .filter(ss => ss.id !== activeSubStepId)
                        .map(ss => (
                        <option key={ss.id} value={ss.id} disabled={nextStepIds.includes(ss.id)}>{ss.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-5 bg-blue-600 rounded-full" />
                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-widest">NGÀY HOÀN THÀNH DỰ KIẾN</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {nextStepIds.length === 0 ? (
                      <div className="p-8 border-2 border-dashed border-slate-100 rounded-[24px] flex flex-col items-center justify-center text-slate-300 space-y-2">
                        <Info size={32} strokeWidth={1} />
                        <p className="text-sm font-bold uppercase tracking-widest">Chưa chọn bước tiếp theo</p>
                      </div>
                    ) : (
                      nextStepIds.map(id => {
                        const step = allSubSteps.find(s => s.id === id);
                        if (!step) return null;
                        return (
                          <div key={id} className="p-6 bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                            <p className="text-base font-black text-blue-700 mb-4 uppercase tracking-tight group-hover:text-blue-800 transition-colors">{step.name}</p>
                            <div className="flex items-end justify-between">
                              <div className="space-y-1.5">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cơ quan chủ trì</p>
                                <p className="text-sm font-bold text-slate-700">{step.agency || '---'}</p>
                              </div>
                              <div className="space-y-1.5 text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">HXL dự kiến</p>
                                <p className="text-xl font-black text-slate-900">
                                  {addDays(completionDate, step.slaDays)}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* C. QUY TRÌNH THỰC HIỆN */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* TIMELINE QUY TRÌNH Ở BÊN TRÁI */}
        <div className="w-full lg:w-80 bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm flex flex-col self-start">
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-6 px-2">Quy trình thực hiện</h3>
          <div className="pr-2">
            <div className="space-y-4 relative">
              {/* Vertical Line */}
              <div className="absolute left-6 top-4 bottom-4 w-[2px] bg-slate-100" />
              
              {steps.map((step, index) => (
                <button 
                  key={step.id}
                  onClick={() => setActiveStepId(step.id)}
                  className={`w-full text-left relative pl-12 pr-2 py-3 rounded-2xl transition-all group ${
                    activeStepId === step.id ? 'bg-blue-50/50 ring-1 ring-blue-100' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className={`absolute left-[18px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 transition-all ${
                    getStatusColor(step.status || 'Chưa bắt đầu')
                  } ${activeStepId === step.id ? 'scale-125 ring-4 ring-blue-100' : ''}`} />
                  
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-black text-slate-400 uppercase">Bước {index + 1}</span>
                    </div>
                    <p className={`text-base font-bold leading-tight mb-1 ${activeStepId === step.id ? 'text-blue-700' : 'text-slate-700'}`}>
                      {step.name}
                    </p>
                    
                    {/* Sub-steps in timeline */}
                    {activeStepId === step.id && step.childSteps && step.childSteps.length > 0 && (
                      <div className="mt-3 pl-2 border-l border-slate-200 space-y-2">
                        {step.childSteps.map((sub) => {
                          const subStatus = getSubStepStatus(sub.id);
                          return (
                            <div key={sub.id} className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                subStatus === 'completed' ? 'bg-blue-500' :
                                subStatus === 'overdue' ? 'bg-rose-500' :
                                'bg-slate-300'
                              }`} />
                              <p className={`text-xs font-bold leading-tight ${
                                subStatus === 'completed' ? 'text-blue-600' :
                                subStatus === 'overdue' ? 'text-rose-600' :
                                'text-slate-600'
                              }`}>{sub.name}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    <div className="mt-2 flex items-center justify-between">
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded uppercase ${
                        step.status === 'Hoàn thành' ? 'bg-emerald-100 text-emerald-700' : 
                        step.status === 'Đang xử lý' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {getStatusLabel(step.status || 'Chưa bắt đầu')}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CHI TIẾT QUY TRÌNH Ở BÊN PHẢI */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Danh sách bước con */}
          {activeStep?.childSteps && activeStep.childSteps.length > 0 && (
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-5 bg-blue-600 rounded-full" />
                <h4 className="text-base font-black text-slate-900 uppercase tracking-widest">DANH SÁCH BƯỚC CON</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="px-4 py-3 text-left text-sm font-black text-slate-400 uppercase tracking-widest">Tên bước con</th>
                      <th className="px-4 py-3 text-center text-sm font-black text-slate-400 uppercase tracking-widest bg-emerald-50/50 rounded-t-xl">Cơ quan xử lý</th>
                      <th className="px-4 py-3 text-center text-sm font-black text-slate-400 uppercase tracking-widest bg-blue-50/50 rounded-t-xl">Chủ đầu tư</th>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="px-4 py-2"></th>
                      <th className="px-4 py-2 bg-emerald-50/30">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-xs font-bold text-slate-400">HXL</span>
                          <span className="text-xs font-bold text-slate-400">HT</span>
                        </div>
                      </th>
                      <th className="px-4 py-2 bg-blue-50/30">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-xs font-bold text-slate-400">HXL</span>
                          <span className="text-xs font-bold text-slate-400">HT</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {activeStep.childSteps.map((child: any) => {
                      const milestone = project.milestones?.[child.id];
                      const actual = project.implementationPlan?.[child.id];
                      const isActive = activeSubStepId === child.id;
                      
                      return (
                        <tr 
                          key={child.id} 
                          onClick={() => setActiveSubStepId(child.id)}
                          className={`cursor-pointer transition-all ${
                            isActive ? 'bg-blue-50/80 shadow-inner' : 'hover:bg-slate-50/50'
                          }`}
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              {isActive && <div className="w-1.5 h-10 bg-blue-600 rounded-full shrink-0" />}
                              <div>
                                <p className={`text-base font-bold ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>{child.name}</p>
                                <p className="text-xs text-slate-400 font-medium">{child.agency}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 bg-emerald-50/10">
                            <div className="grid grid-cols-2 gap-2 items-center">
                              <span className="text-sm font-bold text-slate-600 text-center">
                                {formatDate(milestone?.agency)}
                              </span>
                              <span className={`text-sm font-bold text-center px-2 py-1 rounded ${
                                actual?.agencyActualDate && milestone?.agency && actual.agencyActualDate > milestone.agency 
                                  ? 'text-rose-600 bg-rose-50' 
                                  : actual?.agencyActualDate ? 'text-blue-600 bg-blue-50' : 'text-slate-400'
                              }`}>
                                {formatDate(actual?.agencyActualDate) || '---'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 bg-blue-50/10">
                            <div className="grid grid-cols-2 gap-2 items-center">
                              <span className="text-sm font-bold text-slate-600 text-center">
                                {formatDate(milestone?.investor)}
                              </span>
                              <span className={`text-sm font-bold text-center px-2 py-1 rounded ${
                                actual?.investorActualDate && milestone?.investor && actual.investorActualDate > milestone.investor 
                                  ? 'text-rose-600 bg-rose-50' 
                                  : actual?.investorActualDate ? 'text-blue-600 bg-blue-50' : 'text-slate-400'
                              }`}>
                                {formatDate(actual?.investorActualDate) || '---'}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TABS PHỤ */}
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div id="sub-tabs" className="bg-slate-50 border-b border-slate-100">
              <div className="flex items-center px-8">
                <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Tổng quan" icon={Info} />
                <TabButton active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} label="Hồ sơ" icon={FileText} />
                <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} label="Lịch sử xử lý" icon={History} />
                <TabButton active={activeTab === 'comments'} onClick={() => setActiveTab('comments')} label="Trao đổi / Bình luận" icon={MessageSquare} />
              </div>
            </div>
            
            <div className="p-8">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h5 className="text-sm font-black text-slate-900 uppercase tracking-widest">Tình trạng chung</h5>
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <p className="text-base font-bold text-emerald-700">Dự án đang triển khai đúng tiến độ cam kết.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h5 className="text-sm font-black text-slate-900 uppercase tracking-widest">Cảnh báo</h5>
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                      <p className="text-base font-bold text-amber-700">Bước tiếp theo ({steps[2]?.name}) cần chuẩn bị hồ sơ pháp lý sớm.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'docs' && (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                          <FileText size={28} />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-slate-700">Quyết định phê duyệt quy hoạch 1/500 - Lần {i}</p>
                          <p className="text-sm text-slate-400 font-medium">Cập nhật: {formatDate('2024-03-12')} • 2.4 MB • PDF</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-all" title="Xem trước">
                          <Eye size={22} />
                        </button>
                        <button className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-all" title="Tải xuống">
                          <Download size={22} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-6">
                  {[1, 2].map(i => (
                    <div key={i} className="flex gap-4 relative">
                      {i < 2 && <div className="absolute left-6 top-12 bottom-0 w-[2px] bg-slate-100" />}
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 z-10">
                        <User size={28} />
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-lg font-bold text-slate-900">Nguyễn Văn A <span className="text-slate-400 font-medium">đã cập nhật trạng thái</span></p>
                          <span className="text-sm text-slate-400 font-medium">14:30 - {formatDate('2024-03-12')}</span>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-base text-slate-600">Thay đổi trạng thái từ <span className="font-bold text-amber-600">Chờ bổ sung</span> sang <span className="font-bold text-blue-600">Đang xử lý</span>. Đã nhận đủ hồ sơ bản vẽ điều chỉnh.</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'comments' && (
                <div className="flex flex-col space-y-6">
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                        <User size={28} />
                      </div>
                      <div className="flex-1">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <p className="text-lg font-bold text-slate-900 mb-1">Trần Văn B <span className="text-sm text-slate-400 font-medium ml-2">10:15 - {formatDate('2024-03-13')}</span></p>
                          <p className="text-base text-slate-600">Đề nghị đơn vị kiểm tra lại diện tích sàn trong bản vẽ mới nhất.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                      <User size={28} />
                    </div>
                    <div className="flex-1 relative">
                      <textarea 
                        placeholder="Nhập bình luận hoặc trao đổi..."
                        className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-lg outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[120px]"
                      />
                      <div className="absolute bottom-3 right-3 flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-blue-600 transition-all">
                          <Paperclip size={24} />
                        </button>
                        <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-base font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                          Gửi
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

function FormField({ label, value, defaultValue, placeholder, type = 'text', readOnly = false, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <input 
        type={type}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        readOnly={readOnly}
        onChange={onChange}
        className={`w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-lg outline-none transition-all ${
          readOnly ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300'
        }`}
      />
    </div>
  );
}

function FormSelect({ label, options, value, defaultValue, onChange, readOnly = false, placeholder }: any) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        <select 
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={readOnly}
          className={`w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-lg outline-none transition-all appearance-none ${
            readOnly ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300'
          }`}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt: any) => {
            const isObject = typeof opt === 'object';
            const label = isObject ? opt.label : opt;
            const val = isObject ? opt.value : opt;
            return <option key={val} value={val}>{label}</option>;
          })}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <ChevronRight size={20} className="rotate-90" />
        </div>
      </div>
    </div>
  );
}

function FormTextArea({ label, placeholder, defaultValue, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <textarea 
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 min-h-[120px] transition-all"
      />
    </div>
  );
}

function TabButton({ active, onClick, label, icon: Icon }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-4 text-base font-bold transition-all relative ${
        active ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      <Icon size={20} />
      {label}
      {active && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
    </button>
  );
}
