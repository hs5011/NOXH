import React, { useState } from 'react';
import { X, CheckCircle2, Clock, AlertCircle, Save, Building2 } from 'lucide-react';

interface UpdateProgressProps {
  project: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpdateProgress({ project, onClose, onSuccess }: UpdateProgressProps) {
  const [steps, setSteps] = useState(project.processSteps || []);
  const [saving, setSaving] = useState(false);

  const handleStatusChange = (stepId: string, newStatus: string) => {
    setSteps(steps.map((s: any) => s.id === stepId ? { ...s, status: newStatus } : s));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, we would send the updated steps to the server
    // fetch(`/api/v1/projects/${project.id}/steps`, { method: 'PUT', body: JSON.stringify(steps) })
    
    setSaving(false);
    onSuccess();
  };

  const statusOptions = [
    { value: 'pending', label: 'Chưa bắt đầu', icon: Clock, color: 'text-slate-400', bg: 'bg-slate-50' },
    { value: 'in_progress', label: 'Đang xử lý', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { value: 'completed', label: 'Hoàn tất', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { value: 'delayed', label: 'Trễ hạn', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Cập nhật tiến độ</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{project.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl text-slate-400 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            {steps.length > 0 ? steps.map((step: any) => (
              <div key={step.id} className="p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-100 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-base font-bold text-slate-700 mb-1">{step.name}</p>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-tight">
                      Cơ quan: {step.agency || 'N/A'}{step.department ? ` - ${step.department}` : ''}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleStatusChange(step.id, opt.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                          step.status === opt.value 
                            ? `${opt.bg} ${opt.color} border-current shadow-sm` 
                            : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
                        }`}
                      >
                        <opt.icon size={12} />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )) : (
              <div className="py-12 text-center text-slate-400 italic text-base">
                Dự án này chưa có các bước quy trình chi tiết...
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-slate-500 text-base font-bold hover:bg-slate-200 rounded-xl transition-all"
          >
            Hủy bỏ
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl text-base font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {saving ? 'Đang lưu...' : <><Save size={18} /> Lưu thay đổi</>}
          </button>
        </div>
      </div>
    </div>
  );
}
