import React, { useState } from 'react';
import { 
  ArrowLeft, MapPin, Building2, Calendar, Clock, 
  ChevronRight, Download, Filter, Maximize2, X, Save, Pin, Check
} from 'lucide-react';
import { MOCK_PROGRESS_DATA } from '../data/mockData';
import { parseDate, formatDate } from '../lib/projectUtils';

interface ProjectGanttDetailProps {
  project: any;
  onBack: () => void;
}

interface ActualProgress {
  cdtDate: string;
  nnDate: string;
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

const AGENCIES = [
  { id: 'sxd', name: 'Sở Xây dựng' },
  { id: 'sqhkt', name: 'Sở Quy hoạch Kiến trúc' },
  { id: 'ubnd_xa', name: 'UBND cấp xã, phường' },
  { id: 'pccc_agency', name: 'Công an TP (PCCC)' },
];

const formatDateForDisplay = (dateStr: string) => {
  if (!dateStr || dateStr === 'X' || dateStr === '--') return '';
  const date = parseDate(dateStr);
  if (!date || isNaN(date.getTime())) return dateStr;
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

const calculateDays = (d1: string | Date | null, d2: string | Date | null) => {
  if (!d1 || !d2) return null;
  const getDate = (d: string | Date) => {
    if (d instanceof Date) return d;
    if (d.includes('/')) return parseDate(d);
    return new Date(d);
  };
  
  const date1 = getDate(d1);
  const date2 = getDate(d2);
  
  if (!date1 || !date2 || isNaN(date1.getTime()) || isNaN(date2.getTime())) return null;
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return `${diffDays}n`;
};

export default function ProjectGanttDetail({ project, onBack }: ProjectGanttDetailProps) {
  const [actualProgressMap, setActualProgressMap] = useState<Record<string, ActualProgress>>(() => {
    const saved = localStorage.getItem(`actual_progress_${project.id}`);
    const savedData = saved ? JSON.parse(saved) : {};
    
    // Merge mock data with saved data
    return {
      ...(MOCK_PROGRESS_DATA[project.id.toString()] || {}),
      ...savedData
    };
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<any>(null);
  
  const [tempCdtDate, setTempCdtDate] = useState('');
  const [tempNnDate, setTempNnDate] = useState('');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activePhase = PHASES.find(phase => {
    const planCdt = project[phase.cdtKey];
    const planNn = project[phase.nnKey];
    const actual = actualProgressMap[phase.id];

    const cdtDone = planCdt === 'X' || (actual && actual.cdtDate && actual.cdtDate !== '');
    const nnDone = planNn === 'X' || (actual && actual.nnDate && actual.nnDate !== '');

    return !(cdtDone && nnDone);
  }) || PHASES[PHASES.length - 1];

  const activePhaseIndex = PHASES.findIndex(ph => ph.id === activePhase.id);

  const getKHStatus = (phaseIdx: number, isCDT: boolean) => {
    const phase = PHASES[phaseIdx];
    const planStr = isCDT ? project[phase.cdtKey] : project[phase.nnKey];
    const actual = actualProgressMap[phase.id];
    const actualDateStr = isCDT ? actual?.cdtDate : actual?.nnDate;

    // Green (Done): either marked 'X' or has an actual progress date
    if ((actualDateStr && actualDateStr !== '') || planStr === 'X') return 'done';
    
    // Gray (Not started): milestones after the current active phase
    if (phaseIdx > activePhaseIndex) return 'not_started';
    
    // Delayed or In Progress logic
    if (!planStr || planStr === '--' || planStr === '') return 'in_progress';
    const planDate = parseDate(planStr);
    if (planDate && today > planDate) return 'delayed';
    
    // If it's the current phase or before but not marked done and not past date
    return 'in_progress';
  };

  const getKHStatusStyles = (status: string) => {
    switch (status) {
      case 'done': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'in_progress': return 'bg-amber-50 text-amber-600 border border-amber-200';
      case 'delayed': return 'bg-rose-50 text-rose-700 border border-rose-200';
      case 'not_started': return 'bg-slate-50 text-slate-400 border border-slate-200';
      default: return 'bg-slate-50 text-slate-400 border border-slate-200';
    }
  };

  if (!project) return null;

  const getStatusColor = (phase: any, actual: ActualProgress) => {
    const planDateNNStr = project[phase.nnKey];
    if (!actual?.nnDate || !planDateNNStr || planDateNNStr === 'X') return 'bg-blue-600';
    
    const planDateNN = parseDate(planDateNNStr);
    const actualDateNN = parseDate(actual.nnDate);
    
    if (!planDateNN || !actualDateNN || isNaN(actualDateNN.getTime())) return 'bg-blue-600';
    
    return actualDateNN > planDateNN ? 'bg-rose-600' : 'bg-blue-600';
  };

  const handleOpenModal = (phase: any) => {
    setCurrentPhase(phase);
    const existing = actualProgressMap[phase.id];
    setTempCdtDate(existing?.cdtDate || '');
    setTempNnDate(existing?.nnDate || '');
    setIsModalOpen(true);
  };

  const handleSaveProgress = () => {
    if (currentPhase) {
      const updatedMap = {
        ...actualProgressMap,
        [currentPhase.id]: {
          cdtDate: tempCdtDate,
          nnDate: tempNnDate
        }
      };
      setActualProgressMap(updatedMap);
      localStorage.setItem(`actual_progress_${project.id}`, JSON.stringify(updatedMap));
    }
    setIsModalOpen(false);
  };

  const completedMilestones = PHASES.filter(phase => {
    const planCdt = project[phase.cdtKey];
    const planNn = project[phase.nnKey];
    const actual = actualProgressMap[phase.id];

    const cdtDone = planCdt === 'X' || (actual && actual.cdtDate && actual.cdtDate !== '');
    const nnDone = planNn === 'X' || (actual && actual.nnDate && actual.nnDate !== '');

    return cdtDone && nnDone;
  }).length;
  const overdueCount = Object.keys(actualProgressMap).filter(phaseId => {
    const phase = PHASES.find(p => p.id === phaseId);
    if (!phase) return false;
    const actual = actualProgressMap[phaseId];
    return getStatusColor(phase, actual) === 'bg-rose-600';
  }).length;

  return (
    <div className="flex flex-col bg-slate-50 space-y-6 animate-in fade-in duration-500 relative pb-12 px-6">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex items-start justify-between">
          <div className="space-y-2 max-w-4xl">
            <div className="flex items-center gap-3">
              <button 
                onClick={onBack}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            </div>
            <h1 className="text-xl font-black text-slate-900 leading-tight">
              {project.name}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-rose-500" />
                <span>{project.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-blue-500" />
                <span>{project.investor || 'Chưa có chủ đầu tư'}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {[
              { label: 'Căn hộ', value: project.apartmentCount || '0', color: 'blue' },
              { label: 'Tầng cao', value: project.height || '0', color: 'purple' },
              { label: 'TT đã hoàn thành', value: `${completedMilestones}/7`, color: 'emerald' },
            ].map((stat, idx) => (
              <div key={idx} className={`px-4 py-2 bg-${stat.color}-50 border border-${stat.color}-100 rounded-2xl text-center min-w-[100px]`}>
                <p className="text-[10px] font-bold text-slate-400 uppercase">{stat.label}</p>
                <p className={`text-lg font-black text-${stat.color}-600`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
            <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black rounded-lg uppercase tracking-wider">{project.projectCategory || 'CHƯA XÁC ĐỊNH'}</span>
            <div className="flex items-center gap-2 text-slate-600 border-l border-slate-200 pl-4 ml-2">
              <Calendar size={16} className="text-slate-400" />
              <span>Bắt đầu: <span className="text-slate-900">{formatDateForDisplay(project.startDate)}</span></span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock size={16} className="text-slate-400" />
              <span>Hoàn thành: <span className="text-amber-600">{formatDateForDisplay(project.endDate)}</span></span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-medium text-slate-600">
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
        </div>
      </div>

      {/* Gantt Chart Section - Full Display */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col mb-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <Maximize2 size={18} />
          </div>
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Sơ đồ gantt tiến độ thực hiện</h2>
        </div>

        <div className="overflow-x-hidden">
          <table className="w-full border-separate border-spacing-0 table-fixed">
            <thead>
              <tr className="h-16">
                <th className="sticky left-0 top-0 z-[60] bg-[#2C3E50] text-white text-[9px] font-black uppercase tracking-widest px-2 py-4 border-r border-slate-700 w-[120px] shadow-[2px_0_5px_rgba(0,0,0,0.1)]">Cơ quan NN</th>
                <th className="sticky left-[120px] top-0 z-[60] bg-[#2C3E50] text-white text-[9px] font-black uppercase tracking-widest px-1 py-4 border-r border-slate-700 w-10 text-center shadow-[0_2px_5px_rgba(0,0,0,0.1)]"></th>
                {PHASES.map((phase) => (
                  <th key={phase.id} className={`sticky top-0 z-50 px-1 py-4 border-r ${phase.borderColor} ${phase.color} ${phase.textColor} text-[9px] font-black uppercase tracking-tighter text-center shadow-[0_2px_5px_rgba(0,0,0,0.1)]`}>
                    <div className="line-clamp-2">{phase.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Chủ đầu tư Row */}
              <React.Fragment>
                <tr className="group">
                  <td rowSpan={2} className="sticky left-0 z-30 bg-white px-2 py-4 border-r border-b border-slate-200 align-middle shadow-[2px_0_5px_rgba(0,0,0,0.1)]">
                    <div className="text-[10px] font-black text-blue-700 leading-tight uppercase tracking-tighter">Chủ đầu tư</div>
                  </td>
                  <td className="sticky left-[120px] z-30 bg-white px-1 py-2 border-r border-b border-slate-200 text-center shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                    <span className="px-1.5 py-0.5 border border-blue-200 text-blue-600 text-[8px] font-black rounded-md uppercase">KH</span>
                  </td>
                  {PHASES.map((phase, mIdx) => {
                    const startDateStr = project[phase.cdtKey];
                    const khStatus = getKHStatus(mIdx, true);
                    const isDone = khStatus === 'done';
                    const hasData = startDateStr && startDateStr !== '--' && startDateStr !== '' && startDateStr !== 'X';
                    
                    return (
                      <td key={phase.id} className="border-r border-b border-slate-100 p-1 relative bg-white h-12">
                        {(hasData || startDateStr === 'X') && (
                          <div 
                            className={`absolute inset-y-2 left-1 right-1 rounded-lg flex items-center justify-center text-[10px] font-black shadow-sm uppercase leading-none ${getKHStatusStyles(khStatus)}`}
                          >
                            {isDone ? (
                              <span className="flex items-center gap-0.5"><Check size={10} strokeWidth={4} /> {startDateStr === 'X' ? 'Đã xong' : formatDateForDisplay(startDateStr)}</span>
                            ) : (
                              formatDateForDisplay(startDateStr)
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
                <tr className="group h-12">
                  <td className="sticky left-[120px] z-30 bg-[#F8FAFC] px-1 py-2 border-r border-b border-slate-200 text-center shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                    <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[8px] font-black rounded-md uppercase">TT</span>
                  </td>
                    {PHASES.map((phase) => {
                    const actual = actualProgressMap[phase.id];
                    const hasActual = actual && (actual.cdtDate && actual.cdtDate !== '');
                    const planCdtStr = project[phase.cdtKey];
                    const planNnStr = project[phase.nnKey];
                    const isPlanDone = planCdtStr === 'X' || planNnStr === 'X';
                    const hasPlan = (planCdtStr && planCdtStr !== '--' && planCdtStr !== '') || (planNnStr && planNnStr !== '--' && planNnStr !== '');
                    
                    const getCdtStatusColor = () => {
                      if (!actual?.cdtDate || !planCdtStr || planCdtStr === 'X') return 'bg-blue-600';
                      const planDate = parseDate(planCdtStr);
                      const actualDate = parseDate(actual.cdtDate);
                      if (!planDate || !actualDate || isNaN(actualDate.getTime())) return 'bg-blue-600';
                      return actualDate > planDate ? 'bg-rose-600' : 'bg-blue-600';
                    };

                    const dateDisplay = formatDateForDisplay(actual?.cdtDate || '');

                    return (
                      <td key={phase.id} className="border-r border-b border-slate-100 p-1 relative bg-[#F8FAFC] h-12">
                        {hasPlan && !hasActual && !isPlanDone && (
                          <button 
                            onClick={() => handleOpenModal(phase)}
                            className="absolute inset-x-1 inset-y-3 border border-dashed border-blue-300 bg-blue-50/50 rounded-lg text-blue-500 text-[8px] font-bold hover:bg-blue-100 transition-colors uppercase leading-none"
                          >
                            + nhập TT
                          </button>
                        )}
                        
                        {hasActual && (
                          <div 
                            onClick={() => handleOpenModal(phase)}
                            className={`absolute inset-y-2 left-1 right-1 ${getCdtStatusColor()} rounded-lg flex items-center justify-center text-[10px] font-black text-white shadow-md cursor-pointer hover:opacity-90 transition-all uppercase leading-none`}
                          >
                            {dateDisplay}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </React.Fragment>

              {AGENCIES.map((agency) => (
                <React.Fragment key={agency.id}>
                  {/* Kế hoạch Row */}
                  <tr className="group">
                    <td rowSpan={2} className="sticky left-0 z-30 bg-white px-2 py-4 border-r border-b border-slate-200 align-middle shadow-[2px_0_5px_rgba(0,0,0,0.1)]">
                      <div className="text-[10px] font-black text-slate-700 leading-tight uppercase tracking-tighter">{agency.name}</div>
                    </td>
                    <td className="sticky left-[120px] z-30 bg-white px-1 py-2 border-r border-b border-slate-200 text-center shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                      <span className="px-1.5 py-0.5 border border-blue-200 text-blue-600 text-[8px] font-black rounded-md uppercase">KH</span>
                    </td>
                    {PHASES.map((phase, mIdx) => {
                      const startDateStr = project[phase.cdtKey];
                      const endDateStr = project[phase.nnKey];
                      const isOwnerAgency = phase.agency === agency.id;
                      const khStatus = getKHStatus(mIdx, false);
                      const isDone = khStatus === 'done';
                      const hasData = endDateStr && endDateStr !== '--' && endDateStr !== '' && endDateStr !== 'X';
                      
                      return (
                        <td key={phase.id} className="border-r border-b border-slate-100 p-1 relative bg-white h-12">
                          {isOwnerAgency && (hasData || endDateStr === 'X') && (
                            <div 
                              className={`absolute inset-y-2 left-1 right-1 rounded-lg flex items-center justify-center text-[10px] font-black shadow-sm uppercase leading-none ${getKHStatusStyles(khStatus)}`}
                            >
                              {isDone ? (
                                <span className="flex items-center gap-0.5"><Check size={10} strokeWidth={4} /> {endDateStr === 'X' ? 'Đã xong' : formatDateForDisplay(endDateStr)}</span>
                              ) : (
                                formatDateForDisplay(endDateStr)
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                  {/* Thực tế Row */}
                  <tr className="group h-12">
                    <td className="sticky left-[120px] z-30 bg-[#F8FAFC] px-1 py-2 border-r border-b border-slate-200 text-center shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                      <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[8px] font-black rounded-md uppercase">TD</span>
                    </td>
                    {PHASES.map((phase) => {
                      const startDateStr = project[phase.cdtKey];
                      const endDateStr = project[phase.nnKey];
                      const isOwnerAgency = phase.agency === agency.id;
                      const isPlanDone = startDateStr === 'X' || endDateStr === 'X';
                      const hasPlan = (startDateStr && startDateStr !== '--' && startDateStr !== '') || (endDateStr && endDateStr !== '--' && endDateStr !== '');
                      const actual = actualProgressMap[phase.id];
                      const hasActualData = actual && (actual.nnDate && actual.nnDate !== '');

                      return (
                        <td key={phase.id} className="border-r border-b border-slate-100 p-1 relative bg-[#F8FAFC] h-12">
                          {isOwnerAgency && hasPlan && !hasActualData && !isPlanDone && (
                            <button 
                              onClick={() => handleOpenModal(phase)}
                              className="absolute inset-x-1 inset-y-3 border border-dashed border-blue-300 bg-blue-50/50 rounded-lg text-blue-500 text-[8px] font-bold hover:bg-blue-100 transition-colors uppercase leading-none"
                            >
                              + nhập TT
                            </button>
                          )}

                          {hasActualData && isOwnerAgency && (
                            <div 
                              onClick={() => handleOpenModal(phase)}
                              className={`absolute inset-y-2 left-1 right-1 ${getStatusColor(phase, actual)} rounded-lg flex items-center justify-center text-[10px] font-black text-white shadow-md cursor-pointer hover:opacity-90 transition-all uppercase leading-none`}
                            >
                              {formatDateForDisplay(actual.nnDate)}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actual Progress Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 leading-tight">Nhập tiến độ thực hiện</h3>
                <p className="text-xs text-slate-400 font-medium truncate max-w-[400px]">{project.name}</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Phase Banner */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Pin size={16} />
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đăng cập nhật</span>
                  <p className="text-sm font-black text-slate-900">Mốc: {currentPhase?.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {/* CĐT Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Building2 size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">CĐT NỘP (TIẾN ĐỘ)</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400">
                    Kế hoạch CĐT: <span className="text-slate-600">{project[currentPhase?.cdtKey] || '--'}</span>
                  </p>
                  <div 
                    className="relative group cursor-pointer"
                    onClick={(e) => {
                      const input = e.currentTarget.querySelector('input');
                      if (input && 'showPicker' in input) (input as any).showPicker();
                    }}
                  >
                    <input 
                      type="date" 
                      value={tempCdtDate}
                      onChange={(e) => setTempCdtDate(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-white cursor-pointer"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <Calendar size={16} />
                    </div>
                  </div>
                </div>

                {/* NN Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-amber-600">
                    <Maximize2 size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">CƠ QUAN NN (TIẾN ĐỘ)</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400">
                    Kế hoạch NN: <span className="text-slate-600">{project[currentPhase?.nnKey] || '--'}</span>
                  </p>
                  <div 
                    className="relative group cursor-pointer"
                    onClick={(e) => {
                      const input = e.currentTarget.querySelector('input');
                      if (input && 'showPicker' in input) (input as any).showPicker();
                    }}
                  >
                    <input 
                      type="date" 
                      value={tempNnDate}
                      onChange={(e) => setTempNnDate(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-white cursor-pointer"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <Calendar size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 bg-white border border-slate-200 text-slate-600 text-sm font-black rounded-2xl hover:bg-slate-50 transition-colors shadow-sm"
              >
                Hủy
              </button>
              <button 
                onClick={handleSaveProgress}
                className="px-6 py-3 bg-blue-600 text-white text-sm font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
              >
                <Save size={18} />
                Lưu tiến độ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

