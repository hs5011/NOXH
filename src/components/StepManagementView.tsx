import React, { useState } from 'react';
import { 
  Plus, Search, Edit2, Trash2, ChevronRight, 
  ChevronDown, Building2, Clock, Save, X,
  Layers, GitBranch, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Agency } from './AgencyManagement';

export interface ChildStep {
  id: string;
  name: string;
  agency: string;
  department?: string;
  slaDays: number;
}

export interface ParentStep {
  id: string;
  name: string;
  slaDays: number;
  stage?: string;
  childSteps: ChildStep[];
}

export interface Process {
  id: string;
  name: string;
  parentSteps: ParentStep[];
}

interface StepManagementViewProps {
  processingAgencies: Agency[];
  processes: Process[];
  setProcesses: React.Dispatch<React.SetStateAction<Process[]>>;
  projectStages: string[];
}

export default function StepManagementView({ processingAgencies, processes, setProcesses, projectStages }: StepManagementViewProps) {
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [isChildModalOpen, setIsChildModalOpen] = useState(false);
  
  const [editingProcess, setEditingProcess] = useState<Process | null>(null);
  const [editingParent, setEditingParent] = useState<{ processId: string, parent: ParentStep | null } | null>(null);
  const [editingChild, setEditingChild] = useState<{ processId: string, parentId: string, child: ChildStep | null } | null>(null);

  const [processFormData, setProcessFormData] = useState({ name: '' });
  const [parentFormData, setParentFormData] = useState({ name: '', slaDays: '', stage: '' });
  const [childFormData, setChildFormData] = useState({ name: '', agency: '', department: '', slaDays: '' });

  const [expandedParentIds, setExpandedParentIds] = useState<string[]>([]);

  const selectedProcess = processes.find(p => p.id === selectedProcessId);

  const toggleParentExpand = (id: string) => {
    setExpandedParentIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Process Handlers
  const handleOpenProcessModal = (process: Process | null = null) => {
    if (process) {
      setEditingProcess(process);
      setProcessFormData({ name: process.name });
    } else {
      setEditingProcess(null);
      setProcessFormData({ name: '' });
    }
    setIsProcessModalOpen(true);
  };

  const handleSaveProcess = () => {
    if (editingProcess) {
      setProcesses(prev => prev.map(p => p.id === editingProcess.id ? { ...p, name: processFormData.name } : p));
    } else {
      const newProcess: Process = {
        id: Math.random().toString(36).substr(2, 9),
        name: processFormData.name,
        parentSteps: []
      };
      setProcesses(prev => [...prev, newProcess]);
    }
    setIsProcessModalOpen(false);
  };

  const handleDeleteProcess = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc chắn muốn xóa quy trình này?')) {
      setProcesses(prev => prev.filter(p => p.id !== id));
      if (selectedProcessId === id) setSelectedProcessId(null);
    }
  };

  // Parent Step Handlers
  const handleOpenParentModal = (processId: string, parent: ParentStep | null = null) => {
    if (parent) {
      setEditingParent({ processId, parent });
      setParentFormData({ name: parent.name, slaDays: parent.slaDays.toString(), stage: parent.stage || '' });
    } else {
      setEditingParent({ processId, parent: null });
      setParentFormData({ name: '', slaDays: '', stage: '' });
    }
    setIsParentModalOpen(true);
  };

  const handleSaveParent = () => {
    if (!editingParent) return;
    const { processId, parent } = editingParent;

    setProcesses(prev => prev.map(p => {
      if (p.id !== processId) return p;
      
      const newParent: ParentStep = {
        id: parent?.id || Math.random().toString(36).substr(2, 9),
        name: parentFormData.name,
        slaDays: parseInt(parentFormData.slaDays) || 0,
        stage: parentFormData.stage,
        childSteps: parent?.childSteps || []
      };

      const updatedParents = parent 
        ? p.parentSteps.map(ps => ps.id === parent.id ? newParent : ps)
        : [...p.parentSteps, newParent];

      return { ...p, parentSteps: updatedParents };
    }));
    setIsParentModalOpen(false);
  };

  const handleDeleteParent = (processId: string, parentId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bước cha này?')) {
      setProcesses(prev => prev.map(p => {
        if (p.id !== processId) return p;
        return { ...p, parentSteps: p.parentSteps.filter(ps => ps.id !== parentId) };
      }));
    }
  };

  // Child Step Handlers
  const handleOpenChildModal = (processId: string, parentId: string, child: ChildStep | null = null) => {
    if (child) {
      setEditingChild({ processId, parentId, child });
      setChildFormData({ 
        name: child.name, 
        agency: child.agency, 
        department: child.department || '',
        slaDays: child.slaDays.toString() 
      });
    } else {
      setEditingChild({ processId, parentId, child: null });
      setChildFormData({ name: '', agency: '', department: '', slaDays: '' });
    }
    setIsChildModalOpen(true);
  };

  const handleSaveChild = () => {
    if (!editingChild) return;
    const { processId, parentId, child } = editingChild;

    setProcesses(prev => prev.map(p => {
      if (p.id !== processId) return p;
      
      return {
        ...p,
        parentSteps: p.parentSteps.map(ps => {
          if (ps.id !== parentId) return ps;

          const newChild: ChildStep = {
            id: child?.id || Math.random().toString(36).substr(2, 9),
            name: childFormData.name,
            agency: childFormData.agency,
            department: childFormData.agency === 'Sở Xây dựng' ? childFormData.department : undefined,
            slaDays: parseInt(childFormData.slaDays) || 0
          };

          const updatedChildren = child 
            ? ps.childSteps.map(cs => cs.id === child.id ? newChild : cs)
            : [...ps.childSteps, newChild];

          return { ...ps, childSteps: updatedChildren };
        })
      };
    }));
    setIsChildModalOpen(false);
  };

  const handleDeleteChild = (processId: string, parentId: string, childId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bước con này?')) {
      setProcesses(prev => prev.map(p => {
        if (p.id !== processId) return p;
        return {
          ...p,
          parentSteps: p.parentSteps.map(ps => {
            if (ps.id !== parentId) return ps;
            return { ...ps, childSteps: ps.childSteps.filter(cs => cs.id !== childId) };
          })
        };
      }));
    }
  };

  if (selectedProcessId && selectedProcess) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => setSelectedProcessId(null)}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-1">{selectedProcess.name}</h1>
            <p className="text-lg text-slate-500 font-medium">Quản lý các bước cha và bước con của quy trình</p>
          </div>
          <button 
            onClick={() => handleOpenParentModal(selectedProcess.id)}
            className="ml-auto flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all text-lg"
          >
            <Plus size={24} />
            Thêm bước cha
          </button>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {Object.entries(
            selectedProcess.parentSteps.reduce((acc, step) => {
              const stage = step.stage || 'Chưa phân loại';
              if (!acc[stage]) acc[stage] = [];
              acc[stage].push(step);
              return acc;
            }, {} as Record<string, ParentStep[]>)
          ).map(([stage, steps]) => (
            <div key={stage} className="bg-slate-50/50">
              <div className="px-6 py-4 bg-slate-100 border-b border-slate-200">
                <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">{stage}</h3>
              </div>
              <div className="divide-y divide-slate-100 bg-white">
                {steps.map((parent) => (
                  <div key={parent.id} className="group">
                    <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all">
                      <div className="flex items-center gap-4 flex-1">
                        <button 
                          onClick={() => toggleParentExpand(parent.id)}
                          className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all"
                        >
                          {expandedParentIds.includes(parent.id) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        </button>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{parent.name}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-slate-400 font-medium flex items-center gap-1">
                              <Clock size={12} /> {parent.slaDays} ngày thực hiện
                            </span>
                            <span className="text-sm text-slate-400 font-medium">
                              {parent.childSteps.length} bước con
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => handleOpenParentModal(selectedProcess.id, parent)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteParent(selectedProcess.id, parent.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedParentIds.includes(parent.id) && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-slate-50/30"
                        >
                          <div className="pl-20 pr-6 pb-6 space-y-3">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Danh sách bước con</h4>
                              <button 
                                onClick={() => handleOpenChildModal(selectedProcess.id, parent.id)}
                                className="text-sm font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1"
                              >
                                <Plus size={14} /> Thêm bước con
                              </button>
                            </div>
                            {parent.childSteps.map((child) => (
                              <div key={child.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group/sub">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                    <GitBranch size={18} />
                                  </div>
                                  <div>
                                    <p className="text-base font-bold text-slate-700">{child.name}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                      <span className="text-sm text-slate-400 font-medium flex items-center gap-1">
                                        <Building2 size={12} /> {child.agency} {child.department && ` - ${child.department}`}
                                      </span>
                                      <span className="text-sm text-slate-400 font-medium flex items-center gap-1">
                                        <Clock size={12} /> {child.slaDays} ngày
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover/sub:opacity-100 transition-all">
                                  <button 
                                    onClick={() => handleOpenChildModal(selectedProcess.id, parent.id, child)}
                                    className="p-1.5 text-slate-400 hover:text-blue-600 transition-all"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteChild(selectedProcess.id, parent.id, child.id)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-all"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                            {parent.childSteps.length === 0 && (
                              <div className="py-4 text-center text-slate-400 text-sm italic">
                                Chưa có bước con nào
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {selectedProcess.parentSteps.length === 0 && (
            <div className="p-12 text-center text-slate-400 italic">
              Chưa có bước cha nào được thêm vào quy trình này
            </div>
          )}
        </div>

        {/* Modals for Parent and Child Steps */}
        <AnimatePresence>
          {isParentModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="text-2xl font-black text-slate-900">{editingParent?.parent ? 'Sửa bước cha' : 'Thêm bước cha'}</h3>
                  <button onClick={() => setIsParentModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-all">
                    <X size={24} />
                  </button>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Tên bước cha</label>
                    <input 
                      type="text" 
                      value={parentFormData.name}
                      onChange={e => setParentFormData({...parentFormData, name: e.target.value})}
                      placeholder="Nhập tên bước..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Số ngày thực hiện</label>
                    <input 
                      type="number" 
                      value={parentFormData.slaDays}
                      onChange={e => setParentFormData({...parentFormData, slaDays: e.target.value})}
                      placeholder="Nhập số ngày..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Giai đoạn</label>
                    <select 
                      value={parentFormData.stage}
                      onChange={e => setParentFormData({...parentFormData, stage: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
                    >
                      <option value="">Chọn giai đoạn...</option>
                      {projectStages.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                  <button onClick={() => setIsParentModalOpen(false)} className="flex-1 py-3 text-lg font-bold text-slate-500 hover:bg-slate-200 rounded-2xl transition-all">
                    Hủy
                  </button>
                  <button onClick={handleSaveParent} className="flex-1 py-3 bg-blue-600 text-white text-lg font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                    Lưu thông tin
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {isChildModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="text-2xl font-black text-slate-900">{editingChild?.child ? 'Sửa bước con' : 'Thêm bước con'}</h3>
                  <button onClick={() => setIsChildModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-all">
                    <X size={24} />
                  </button>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Tên bước con</label>
                    <input 
                      type="text" 
                      value={childFormData.name}
                      onChange={e => setChildFormData({...childFormData, name: e.target.value})}
                      placeholder="Nhập tên bước..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Cơ quan xử lý</label>
                    <select 
                      value={childFormData.agency}
                      onChange={e => setChildFormData({...childFormData, agency: e.target.value, department: ''})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
                    >
                      <option value="">Chọn cơ quan...</option>
                      {processingAgencies.map(a => (
                        <option key={a.id} value={a.name}>{a.name}</option>
                      ))}
                    </select>
                  </div>

                  {childFormData.agency === 'Sở Xây dựng' && (
                    <div className="space-y-2">
                      <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Phòng ban xử lý</label>
                      <select 
                        value={childFormData.department}
                        onChange={e => setChildFormData({...childFormData, department: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
                      >
                        <option value="">Chọn phòng ban...</option>
                        {processingAgencies.find(a => a.name === 'Sở Xây dựng')?.departments?.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Số ngày thực hiện</label>
                    <input 
                      type="number" 
                      value={childFormData.slaDays}
                      onChange={e => setChildFormData({...childFormData, slaDays: e.target.value})}
                      placeholder="Nhập số ngày..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
                    />
                  </div>
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                  <button onClick={() => setIsChildModalOpen(false)} className="flex-1 py-3 text-lg font-bold text-slate-500 hover:bg-slate-200 rounded-2xl transition-all">
                    Hủy
                  </button>
                  <button onClick={handleSaveChild} className="flex-1 py-3 bg-blue-600 text-white text-lg font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                    Lưu thông tin
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-1">Danh mục Quy trình</h1>
          <p className="text-lg text-slate-500 font-medium">Quản lý danh sách các quy trình xử lý dự án</p>
        </div>
        <button 
          onClick={() => handleOpenProcessModal()}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all shrink-0 text-lg"
        >
          <Plus size={24} />
          Thêm quy trình mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processes.map((process) => (
          <div 
            key={process.id}
            onClick={() => setSelectedProcessId(process.id)}
            className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
              <button 
                onClick={(e) => { e.stopPropagation(); handleOpenProcessModal(process); }}
                className="p-2 bg-white/80 backdrop-blur shadow-sm rounded-xl text-slate-400 hover:text-blue-600 transition-all"
              >
                <Edit2 size={20} />
              </button>
              <button 
                onClick={(e) => handleDeleteProcess(process.id, e)}
                className="p-2 bg-white/80 backdrop-blur shadow-sm rounded-xl text-slate-400 hover:text-rose-600 transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
              <Layers size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">{process.name}</h3>
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-slate-400 font-black uppercase tracking-wider">Bước cha</span>
                <span className="text-lg font-bold text-slate-700">{process.parentSteps.length}</span>
              </div>
              <div className="w-px h-8 bg-slate-100"></div>
              <div className="flex flex-col">
                <span className="text-sm text-slate-400 font-black uppercase tracking-wider">Tổng bước con</span>
                <span className="text-lg font-bold text-slate-700">
                  {process.parentSteps.reduce((acc, ps) => acc + ps.childSteps.length, 0)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Process Modal */}
      <AnimatePresence>
        {isProcessModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-2xl font-black text-slate-900">{editingProcess ? 'Sửa quy trình' : 'Thêm quy trình'}</h3>
                <button onClick={() => setIsProcessModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-all">
                  <X size={24} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Tên quy trình</label>
                  <input 
                    type="text" 
                    value={processFormData.name}
                    onChange={e => setProcessFormData({...processFormData, name: e.target.value})}
                    placeholder="Nhập tên quy trình..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
                  />
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button onClick={() => setIsProcessModalOpen(false)} className="flex-1 py-3 text-lg font-bold text-slate-500 hover:bg-slate-200 rounded-2xl transition-all">
                  Hủy
                </button>
                <button onClick={handleSaveProcess} className="flex-1 py-3 bg-blue-600 text-white text-lg font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                  Lưu quy trình
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
