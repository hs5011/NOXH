import React, { useState } from 'react';
import { X, Save, FileText, Building2, Calendar } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { vi } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";
import { Process } from './StepManagementView';

registerLocale('vi', vi);

interface UpdatePlanModalProps {
  project: any;
  processes: Process[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpdatePlanModal({ project, processes, onClose, onSuccess }: UpdatePlanModalProps) {
  const [milestones, setMilestones] = useState(project.milestones || {});
  const [submitting, setSubmitting] = useState(false);

  const selectedProcess = processes.find(p => p.id === project.processId);

  const handleMilestoneChange = (key: string, type: 'investor' | 'agency', value: string) => {
    setMilestones({
      ...milestones,
      [key]: {
        ...milestones[key],
        [type]: value
      }
    });
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/v1/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...project,
          milestones
        })
      });

      if (res.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error updating plan:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 my-4 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-100">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Cập nhật kế hoạch thực hiện</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{project.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          {!selectedProcess ? (
            <div className="p-12 text-center bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold italic">Dự án này chưa được gán quy trình thực hiện.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-12 gap-4 px-4">
                <div className="col-span-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bước quy trình / Cơ quan xử lý</div>
                <div className="col-span-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">HXL CĐT</div>
                <div className="col-span-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">HXL Cơ quan NN</div>
              </div>

              {selectedProcess.parentSteps.map((parent) => (
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
                          selected={milestones[child.id]?.investor ? new Date(milestones[child.id].investor) : null}
                          onChange={(date) => handleMilestoneChange(child.id, 'investor', date ? date.toISOString().split('T')[0] : '')}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Chọn ngày"
                          locale="vi"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                        />
                      </div>
                      <div className="col-span-3">
                        <DatePicker 
                          selected={milestones[child.id]?.agency ? new Date(milestones[child.id].agency) : null}
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

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 flex justify-end gap-4 bg-white shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="px-10 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Hủy bỏ
          </button>
          <button 
            onClick={handleSave}
            disabled={submitting}
            className="px-14 py-4 bg-blue-600 text-white rounded-2xl text-sm font-bold shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-3 disabled:opacity-50"
          >
            <Save size={20} />
            {submitting ? 'Đang xử lý...' : 'Lưu kế hoạch'}
          </button>
        </div>
      </div>
    </div>
  );
}
