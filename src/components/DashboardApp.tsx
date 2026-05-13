import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, ChevronRight, ChevronLeft, 
  AlertCircle, Clock, FileText, LayoutDashboard, 
  MapPin, User, Search, Bell, Menu,
  CheckCircle2, TrendingUp, Filter, Circle,
  FileCheck, ClipboardList, Layers, Calendar, X,
  ArrowLeft, Download, Maximize2, Save, Pin, Check, History
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LabelList,
  PieChart,
  Pie,
  Label
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { PROJECT_REGIONS } from '../constants';
import { INITIAL_PROCESSES } from '../data/appData';
import { formatDate, parseDate, getStepAgency } from '../lib/projectUtils';
import { MOCK_PROGRESS_DATA } from '../data/mockData';

// --- Types ---
interface Agency {
  id: string;
  name: string;
  count: number;
  subtext: string;
  color: string;
  iconColor: string;
}

interface Department {
  id: string;
  name: string;
  projectCount: number;
  delayedCount: number;
}

interface Project {
  id: string;
  code: string;
  name: string;
  investor: string;
  location: string;
  progress: number;
  status: string;
  currentStep: string;
  parentStep?: string;
  childStep?: string;
  stepDeadline?: string;
  currentAgency: string;
  currentDepartment?: string;
  deadline: string;
  stage: string;
  delayDays?: number;
  processId?: string;
  milestones?: Record<string, { investor: string; agency: string }>;
  implementationPlan?: Record<string, { agencyActualDate: string }>;
  isPublicInvestment?: boolean;
  totalArea?: number;
  apartmentCount?: number;
  height?: number;
  startDate?: string;
  endDate?: string;
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
  baocaonckt_cdt_date?: string;
  baocaonckt_nn_date?: string;
  gpxaydung_cdt_date?: string;
  gpxaydung_nn_date?: string;
  progress_status_2026?: string;
  isKeyProject?: boolean;
  fundingSource?: string;
  projectGroup?: string;
  projectCategory?: string;
}

// --- Mock Data ---
import { Agency as AgencyType } from './AgencyManagement';

import { UserAccount } from '../types';

interface DashboardAppProps {
  projects?: Project[];
  processingAgencies?: AgencyType[];
  investors?: any[];
  projectStages?: any[];
  locations?: any[];
  currentUser?: UserAccount | null;
  initialView?: 'overview' | 'agencies' | 'departments' | 'projects' | 'detail' | 'search-results' | 'steps' | 'child-steps';
}

const PHASES = [
  { id: 'chutruong', name: 'CHỦ TRƯƠNG ĐẦU TƯ', cdtKey: 'chutruong_cdt_date', nnKey: 'chutruong_nn_date', agency: '1', borderColor: 'border-blue-100', color: 'bg-blue-50', textColor: 'text-blue-700' },
  { id: 'qh1500', name: 'QH 1/500', cdtKey: 'qh1500_cdt_date', nnKey: 'qh1500_nn_date', agency: '2', borderColor: 'border-emerald-100', color: 'bg-emerald-50', textColor: 'text-emerald-700' },
  { id: 'giaodat', name: 'QĐ GIAO ĐẤT', cdtKey: 'qdgiaodat_cdt_date', nnKey: 'qdgiaodat_nn_date', agency: '6', borderColor: 'border-purple-100', color: 'bg-purple-50', textColor: 'text-purple-700' },
  { id: 'htkt', name: 'ĐẤU NỐI HTKT/ĐTM', cdtKey: 'htkt_dtm_cdt_date', nnKey: 'htkt_dtm_nn_date', agency: '1', borderColor: 'border-orange-100', color: 'bg-orange-50', textColor: 'text-orange-700' },
  { id: 'bcnckt', name: 'BC NCKT', cdtKey: 'baocaonckt_cdt_date', nnKey: 'baocaonckt_nn_date', agency: '1', borderColor: 'border-indigo-100', color: 'bg-indigo-50', textColor: 'text-indigo-700' },
  { id: 'pccc', name: 'THẨM DUYỆT PCCC', cdtKey: 'pccc_cdt_date', nnKey: 'pccc_nn_date', agency: '9', borderColor: 'border-rose-100', color: 'bg-rose-50', textColor: 'text-rose-700' },
  { id: 'gpxd', name: 'GPXD', cdtKey: 'gpxaydung_cdt_date', nnKey: 'gpxaydung_nn_date', agency: '1', borderColor: 'border-sky-100', color: 'bg-sky-50', textColor: 'text-sky-700' },
];

const AGENCIES = [
  { id: '1', name: 'Sở Xây dựng' },
  { id: '2', name: 'Sở Quy hoạch Kiến trúc' },
  { id: '6', name: 'UBND cấp xã, phường' },
  { id: '9', name: 'Công an TP (PCCC)' },
];

export default function DashboardApp(props: DashboardAppProps) {
  const initialProjects = props.projects || [];
  const processingAgencies = props.processingAgencies || [];
  const investors = props.investors || [];
  const projectStages = props.projectStages || [];
  const locations = props.locations || [];
  const currentUser = props.currentUser || null;
  const initialView = props.initialView || 'overview';

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
          background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
          background-size: 200% 100%;
        }
      `}</style>
      <DashboardContent 
        initialProjects={initialProjects}
        processingAgencies={processingAgencies}
        investors={investors}
        projectStages={projectStages}
        locations={locations}
        currentUser={currentUser}
        initialView={initialView}
      />
    </>
  );
}

function DashboardContent({ 
  initialProjects = [],
  processingAgencies = [], 
  investors = [], 
  projectStages = [], 
  locations = [],
  currentUser = null,
  initialView = 'overview'
}: DashboardAppProps & { initialProjects: Project[] }) {
  const [view, setView] = useState<'overview' | 'agencies' | 'departments' | 'projects' | 'detail' | 'search-results' | 'steps' | 'child-steps'>(initialView);
  const [selectedAgency, setSelectedAgency] = useState<any | null>(null);
  const [selectedDept, setSelectedDept] = useState<any | null>(null);
  const [selectedParentStep, setSelectedParentStep] = useState<string | null>(null);
  const [filterParentStep, setFilterParentStep] = useState<string | null>(null);
  const [selectedChildStep, setSelectedChildStep] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [customFilterType, setCustomFilterType] = useState<string | null>(null);
  const [stepSearchTerm, setStepSearchTerm] = useState('');
  const [projects, setProjects] = useState<Project[]>(initialProjects || []);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'delayed' | 'ontime'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filterLocation, setFilterLocation] = useState('');
  const [filterAgencyName, setFilterAgencyName] = useState('');
  const [filterInvestor, setFilterInvestor] = useState('');
  const [filterProjectStage, setFilterProjectStage] = useState('');

  const [history, setHistory] = useState<string[]>(['overview']);

  const navigateTo = (newView: typeof view) => {
    setHistory(prev => {
      if (prev[prev.length - 1] === newView) return prev;
      return [...prev, newView];
    });
    setView(newView);
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // Remove current
      const prevView = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setView(prevView as any);
      
      // Always clear search when going back to non-search views
      if (prevView !== 'search-results') {
        setSearchQuery('');
      }

      // Intelligent reset based on target view (what we are going BACK TO)
      if (prevView === 'overview') {
        setSelectedAgency(null);
        setSelectedDept(null);
        setSelectedParentStep(null);
        setFilterParentStep(null);
        setSelectedChildStep(null);
        setCustomFilterType(null);
        setStatusFilter('all');
        setFilterProjectStage('');
        setFilterAgencyName('');
        setFilterLocation('');
        setFilterInvestor('');
        setSearchQuery('');
        setStepSearchTerm('');
      } else if (prevView === 'steps') {
        setFilterParentStep(null);
        setSelectedChildStep(null);
        setSelectedProject(null);
      } else if (prevView === 'child-steps') {
        setSelectedChildStep(null);
        setSelectedProject(null);
      } else if (prevView === 'projects') {
        setSelectedProject(null);
      } else if (prevView === 'agencies') {
        setSelectedAgency(null);
        setSelectedDept(null);
        setSelectedProject(null);
      } else if (prevView === 'departments') {
        setSelectedDept(null);
        setSelectedProject(null);
      }
    }
  };

  const goToOverview = () => {
    setHistory(['overview']);
    setView('overview');
    setSelectedAgency(null);
    setSelectedDept(null);
    setSelectedParentStep(null);
    setFilterParentStep(null);
    setSelectedChildStep(null);
    setCustomFilterType(null);
    setStatusFilter('all');
    setSearchQuery('');
    setFilterProjectStage('');
    setFilterAgencyName('');
    setFilterLocation('');
    setFilterInvestor('');
    setStepSearchTerm('');
  };

  // Helper to check if a project matches a location filter (District or Ward)
  function isProjectInLocation(projectLocation: string, filterLoc: string) {
    if (!filterLoc) return true;
    if (projectLocation.includes(filterLoc)) return true;
    
    // Check if the ward in projectLocation belongs to the district in filterLoc
    const wardName = projectLocation.split(',')[0].trim();
    const wardInfo = locations.find(l => l.ward === wardName);
    return wardInfo?.oldArea === filterLoc;
  }

  const parseVNDate = (dateStr: string) => {
    if (!dateStr || dateStr === 'X' || dateStr === '--') return null;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const year = parseInt(parts[2]);
    const fullYear = year < 100 ? 2000 + year : year;
    return new Date(fullYear, month, day);
  };

  const today = new Date();

  const getStepDateKey = (stepName: string, isInvestor: boolean = false) => {
    const lower = stepName?.toLowerCase() || "";
    const suffix = isInvestor ? "_cdt_date" : "_nn_date";
    if (lower.includes("chủ trương")) return "chutruong" + suffix;
    if (lower.includes("quy hoạch")) return "qh1500" + suffix;
    if (lower.includes("giao đất") || lower.includes("thuê đất")) return "qdgiaodat" + suffix;
    if (lower.includes("bc nckt") || lower.includes("nghiên cứu khả thi")) return "baocaonckt" + suffix;
    if (lower.includes("pccc")) return "pccc" + suffix;
    if (lower.includes("hạ tầng kỹ thuật")) return "htkt_dtm" + suffix;
    if (lower.includes("giấy phép xây dựng") || lower.includes("gpxd")) return "gpxaydung" + suffix;
    return "deadline"; // fallback
  };

  const getStepDepartment = (project: Project) => {
    if (!project.currentStep) return "";
    const process = INITIAL_PROCESSES.find(p => p.id === project.processId) || INITIAL_PROCESSES[0];
    for (const ps of process.parentSteps) {
      for (const cs of ps.childSteps) {
        if (cs.name === project.currentStep) {
          return cs.department || "";
        }
      }
    }
    return "";
  };

  const getProjectStatus = (project: Project) => {
    // Synchronize logic with GanttDashboardNOXH
    const projectActualData = MOCK_PROGRESS_DATA[project.id] || {};
    
    // Check localStorage for overrides
    const saved = typeof window !== 'undefined' ? localStorage.getItem(`actual_progress_${project.id}`) : null;
    let actualData = projectActualData;
    if (saved) {
      actualData = { ...projectActualData, ...JSON.parse(saved) };
    }

    const activePhase = PHASES.find(phase => {
      const planCdt = (project as any)[phase.cdtKey];
      const planNn = (project as any)[phase.nnKey];
      const actual = actualData[phase.id];

      const cdtDone = planCdt === 'X' || planCdt === '' || (actual && actual.cdtDate && actual.cdtDate !== '');
      const nnDone = planNn === 'X' || planNn === '' || (actual && actual.nnDate && actual.nnDate !== '');

      return !(cdtDone && nnDone);
    }) || PHASES[PHASES.length - 1];

    const planNnStr = (project as any)[activePhase.nnKey];
    const planNnDate = parseVNDate(planNnStr);
    
    if (planNnDate && today > planNnDate) {
      return 'delayed';
    }
    return 'ontime';
  };

  // Summary Stats
  // Base filter (without status filter) - used for the main stats cards and charts
  const baseFilteredProjects = useMemo(() => {
    return projects.filter(p => {
      let matches = true;
      if (filterAgencyName) matches = matches && getStepAgency(p, INITIAL_PROCESSES) === filterAgencyName;
      if (filterLocation) matches = matches && isProjectInLocation(p.location, filterLocation);
      if (filterInvestor) matches = matches && p.investor === filterInvestor;
      if (filterProjectStage) matches = matches && p.stage === filterProjectStage;
      if (filterParentStep) matches = matches && p.parentStep === filterParentStep;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        matches = matches && (
          p.name.toLowerCase().includes(q) || 
          p.investor.toLowerCase().includes(q) || 
          p.location.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q)
        );
      }

      if (customFilterType === 'announced') {
        // User criteria: "THỰC HIỆN ĐẦU TƯ"
        matches = matches && p.stage === 'THỰC HIỆN ĐẦU TƯ';
      } else if (customFilterType === 'approved') {
        // User criteria: "CHUẨN BỊ ĐẦU TƯ" and finished policy approval step
        const isChutruongDone = (p.chutruong_nn_date === 'X' || p.chutruong_cdt_date === 'X');
        const isLicensed = (p.gpxaydung_nn_date === 'X' || p.gpxaydung_cdt_date === 'X');
        matches = matches && p.stage === 'CHUẨN BỊ ĐẦU TƯ' && isChutruongDone && !isLicensed;
      } else if (customFilterType === 'licensed') {
        // User criteria: "CHUẨN BỊ ĐẦU TƯ" and finished building permit step
        const isLicensed = (p.gpxaydung_nn_date === 'X' || p.gpxaydung_cdt_date === 'X');
        matches = matches && p.stage === 'CHUẨN BỊ ĐẦU TƯ' && isLicensed;
      }

      return matches;
    });
  }, [projects, filterAgencyName, filterLocation, filterInvestor, filterProjectStage, filterParentStep, searchQuery, customFilterType]);

  // Display filter (includes status filter for project lists)
  const globalFilteredProjects = useMemo(() => {
    return baseFilteredProjects.filter(p => {
      const status = getProjectStatus(p);
      if (statusFilter === 'delayed') return status === 'delayed';
      if (statusFilter === 'ontime') return status === 'ontime';
      return true;
    });
  }, [baseFilteredProjects, statusFilter]);

  const totalProjectsCount = baseFilteredProjects.length;
  const getProjectExtendedInfo = (project: Project) => {
    const projectActualData = MOCK_PROGRESS_DATA[project.id] || {};
    const saved = typeof window !== 'undefined' ? localStorage.getItem(`actual_progress_${project.id}`) : null;
    let actualData = projectActualData;
    if (saved) {
      actualData = { ...projectActualData, ...JSON.parse(saved) };
    }

    const activePhase = PHASES.find(phase => {
      const planCdt = (project as any)[phase.cdtKey];
      const planNn = (project as any)[phase.nnKey];
      const actual = actualData[phase.id];
      const cdtDone = planCdt === 'X' || planCdt === '' || (actual && actual.cdtDate && actual.cdtDate !== '');
      const nnDone = planNn === 'X' || planNn === '' || (actual && actual.nnDate && actual.nnDate !== '');
      return !(cdtDone && nnDone);
    }) || PHASES[PHASES.length - 1];

    const planNnStr = (project as any)[activePhase.nnKey];
    const planNnDate = parseVNDate(planNnStr);
    const status = (planNnDate && today > planNnDate) ? 'delayed' : 'ontime';

    return { activePhase, status, planNnDate, planNnStr };
  };

  const overdueProjectsCount = baseFilteredProjects.filter(p => getProjectStatus(p) === 'delayed').length;
  const onTimeProjectsCount = totalProjectsCount - overdueProjectsCount;

  // Procedure Statistics (Always based on baseFilteredProjects to maintain consistent step status)
  const activeParentStepNames = Array.from(new Set(baseFilteredProjects.map(p => p.parentStep || 'Chưa có thủ tục')));
  const filteredSteps = activeParentStepNames.filter(stepName => {
    return baseFilteredProjects.some(p => (p.parentStep || 'Chưa có thủ tục') === stepName);
  });
  
  const totalActiveStepsCount = filteredSteps.length;
  const delayedStepsCount = filteredSteps.filter(stepName => 
    baseFilteredProjects.some(p => (p.parentStep || 'Chưa có thủ tục') === stepName && getProjectStatus(p) === 'delayed')
  ).length;
  const onTimeStepsCount = totalActiveStepsCount - delayedStepsCount;

  useEffect(() => {
    setProjects(initialProjects || []);
  }, [initialProjects]);


  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    setSearchQuery(query);
    setStatusFilter('all');
    navigateTo('search-results');
  };

  const showInvestorStat = !currentUser || currentUser.roleId === 'Admin' || (currentUser.userType === 'agency' && currentUser.agencyId === '1') || currentUser.userType === 'investor';

  const dynamicAgencies = [
    ...processingAgencies.map(a => {
      const agencyProjects = globalFilteredProjects.filter(p => getStepAgency(p, INITIAL_PROCESSES) === a.name);
      
      const overdueCount = agencyProjects.filter(p => getProjectStatus(p) === 'delayed').length;
      const ontimeCount = agencyProjects.filter(p => getProjectStatus(p) === 'ontime').length;
      const totalInAgency = overdueCount + ontimeCount;

      return {
        ...a,
        count: totalInAgency,
        delayedCount: overdueCount,
        ontimeCount: ontimeCount,
        subtext: 'dự án đang xử lý',
        color: 'bg-emerald-50',
        iconColor: 'text-emerald-500'
      };
    }).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),
    ...(showInvestorStat ? [{
      id: 'investor-stat',
      name: 'Chủ đầu tư',
      count: globalFilteredProjects.filter(p => {
        if (getStepAgency(p, INITIAL_PROCESSES) !== 'Chủ đầu tư') return false;
        const status = getProjectStatus(p);
        return status === 'delayed' || status === 'ontime';
      }).length,
      delayedCount: globalFilteredProjects.filter(p => {
        if (getStepAgency(p, INITIAL_PROCESSES) !== 'Chủ đầu tư') return false;
        return getProjectStatus(p) === 'delayed';
      }).length,
      ontimeCount: globalFilteredProjects.filter(p => {
        if (getStepAgency(p, INITIAL_PROCESSES) !== 'Chủ đầu tư') return false;
        return getProjectStatus(p) === 'ontime';
      }).length,
      subtext: 'dự án đang xử lý',
      color: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
      departments: []
    }] : [])
  ];

  const dynamicDepartments = selectedAgency ? (
    (selectedAgency.name.includes('Phường xã') || selectedAgency.name.includes('Phường/Xã') || selectedAgency.name.includes('UBND cấp xã, phường') 
      ? Array.from(new Set(locations.map(l => l.ward))) 
      : (selectedAgency.departments || [])
    ).map((deptName: string, index: number) => {
      const isWardView = selectedAgency.name.includes('Phường xã') || selectedAgency.name.includes('Phường/Xã') || selectedAgency.name.includes('UBND cấp xã, phường');
      
      // If ward view, check if it matches the location filter
      if (isWardView && filterLocation) {
        if (deptName !== filterLocation) {
          return null;
        }
      }

      const deptProjects = globalFilteredProjects.filter(p => {
        const agencyName = getStepAgency(p, INITIAL_PROCESSES);
        const matchesAgency = agencyName === selectedAgency.name;
        // Check if department matches (for normal agencies) or ward matches (for UBND cấp xã, phường)
        const projectDept = getStepDepartment(p);
        const matchesDept = projectDept === deptName || p.currentDepartment === deptName || p.location.includes(deptName);
        return matchesAgency && matchesDept;
      });

      const delayedCount = deptProjects.filter(p => getProjectStatus(p) === 'delayed').length;
      const ontimeCount = deptProjects.filter(p => getProjectStatus(p) === 'ontime').length;
      const totalCount = delayedCount + ontimeCount;
      
      let displayCount = totalCount;
      if (statusFilter === 'delayed') displayCount = delayedCount;
      if (statusFilter === 'ontime') displayCount = ontimeCount;

      return {
        id: `${selectedAgency.id}-${index}`,
        name: deptName,
        projectCount: displayCount,
        totalCount,
        delayedCount,
        ontimeCount
      };
    })
  ).filter((dept: any) => dept !== null && dept.projectCount > 0) : [];

  const handleAgencyClick = (agency: any, status: 'all' | 'delayed' | 'ontime' = 'all') => {
    setSelectedAgency(agency);
    setStatusFilter(status);
    setCustomFilterType(null);
    
    if (agency.id === 'investor-stat' || agency.id === 'no-investor-stat') {
      navigateTo('projects');
      return;
    }

    if (agency.departments && agency.departments.length > 0) {
      navigateTo('departments');
    } else {
      navigateTo('projects');
    }
  };

  const handleDeptClick = (dept: any, status: 'all' | 'delayed' | 'ontime' = 'all') => {
    setSelectedDept(dept);
    setStatusFilter(status);
    setCustomFilterType(null);
    navigateTo('projects');
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    navigateTo('detail');
  };

  const FilterPanel = ({ hideInvestorAndStage = false }: { hideInvestorAndStage?: boolean }) => {
    const agencies = Array.from(new Set((projects || []).map(p => p.currentAgency).filter(Boolean)));

    return (
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-slate-50 border-b border-slate-200 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cơ quan</label>
                  <select 
                    value={filterAgencyName}
                    onChange={(e) => setFilterAgencyName(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="">Tất cả</option>
                    {agencies.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Địa điểm
                  </label>
                  <select 
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="">Tất cả</option>
                    {locations.map((l, idx) => (
                      <option key={idx} value={l.ward || l}>{l.ward || l}</option>
                    ))}
                  </select>
                </div>
                {!hideInvestorAndStage && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Chủ đầu tư
                      </label>
                      <select 
                        value={filterInvestor}
                        onChange={(e) => setFilterInvestor(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                      >
                        <option value="">Tất cả</option>
                        {investors.map((i, idx) => (
                          <option key={idx} value={i}>{i}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Giai đoạn
                      </label>
                      <select 
                        value={filterProjectStage}
                        onChange={(e) => setFilterProjectStage(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                      >
                        <option value="">Tất cả</option>
                        {projectStages.map((s, idx) => (
                          <option key={idx} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>
              <button 
                onClick={() => {
                  setFilterAgencyName('');
                  setFilterLocation('');
                  setFilterInvestor('');
                  setFilterProjectStage('');
                  setStatusFilter(null);
                  setCustomFilterType(null);
                  setFilterParentStep(null);
                  setSelectedChildStep(null);
                  setSearchQuery('');
                  
                  // Clear focus elements
                  setSelectedAgency(null);
                  setSelectedDept(null);
                  setSelectedParentStep(null);
                }}
                className="w-full py-2 text-xs font-bold text-blue-600 uppercase tracking-widest hover:bg-blue-50 transition-colors rounded-lg"
              >
                Xóa bộ lọc
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const handleStageClick = (stage: string, status: 'all' | 'delayed' | 'ontime') => {
    setFilterProjectStage(stage);
    setStatusFilter(status);
    setCustomFilterType(null);
    navigateTo('steps');
  };

  // --- Views ---

  const CustomYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const displayName = payload.value;
    const match = displayName.match(/^(.*)\s\((.*)\)$/);
    
    if (match) {
      const name = match[1];
      const stats = `(${match[2]})`;
      return (
        <g transform={`translate(${x},${y})`}>
          <text x={-10} y={0} dy={-2} textAnchor="end" fill="#334155" fontSize={14} fontWeight="bold">
            {name}
          </text>
          <text x={-10} y={0} dy={16} textAnchor="end" fill="#64748b" fontSize={12} fontWeight="bold">
            {stats}
          </text>
        </g>
      );
    }

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={-10} y={0} dy={4} textAnchor="end" fill="#334155" fontSize={14} fontWeight="bold">
          {displayName}
        </text>
      </g>
    );
  };

  const StageStatsTable = () => {
    // Collect all unique parent steps from all processes to map them to stages correctly
    const allParentSteps: { name: string; shortName?: string; stage: string }[] = [];
    INITIAL_PROCESSES.forEach(proc => {
      proc.parentSteps.forEach(ps => {
        if (!allParentSteps.find(item => item.name === ps.name)) {
          allParentSteps.push({ name: ps.name, shortName: ps.shortName, stage: ps.stage });
        }
      });
    });

    const data = projectStages.map(stageName => {
      const stageProjects = baseFilteredProjects.filter(p => p.stage === stageName);
      
      // Get parent steps for this stage
      const stepsForStage = allParentSteps
        .filter(ps => ps.stage.toUpperCase() === stageName.toUpperCase());
      
      const subSteps = stepsForStage.map(step => {
        const stepProjects = stageProjects.filter(p => p.parentStep === step.name);
        const delayed = stepProjects.filter(p => getProjectStatus(p) === 'delayed').length;
        const total = stepProjects.length;
        const ontime = total - delayed;

        return { name: step.name, shortName: step.shortName, total, delayed, ontime };
      }).filter(s => s.total > 0);

      return {
        name: stageName,
        total: stageProjects.length,
        subSteps
      };
    }).filter(stage => stage.total > 0);

    if (data.length === 0) return null;

    return (
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-slate-800 tracking-tight text-center w-full">Thống kê theo giai đoạn</h2>
        </div>
        <div className="space-y-4">
          {data.map(stage => (
            <div key={stage.name} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Header */}
              <div 
                onClick={() => {
                  setFilterProjectStage(stage.name);
                  setFilterParentStep(null);
                  setSelectedChildStep(null);
                  setCustomFilterType(null);
                  setStatusFilter(null);
                  navigateTo('steps');
                }}
                className="bg-[#D1E9FF] text-[#1E3A8A] p-2 text-base font-black uppercase tracking-tight text-center cursor-pointer hover:bg-sky-300 transition-colors border-b border-slate-300"
              >
                {stage.name} ({stage.total})
              </div>
              
              {/* Sub-steps Grid */}
              <div 
                className="grid"
                style={{ 
                  gridTemplateColumns: `repeat(${stage.subSteps.length}, minmax(0, 1fr))`
                }}
              >
                {stage.subSteps.map((step, idx) => (
                  <div 
                    key={step.name}
                    className={`flex flex-col bg-white ${idx < stage.subSteps.length - 1 ? 'border-r border-slate-300' : ''}`}
                  >
                    {/* Sub-step Title */}
                    <div 
                      onClick={() => { 
                        setFilterParentStep(step.name); 
                        setSelectedChildStep(null);
                        setCustomFilterType(null);
                        setStatusFilter(null);
                        navigateTo('projects'); 
                      }}
                      className="p-2.5 text-[12px] font-black text-center h-20 flex items-center justify-center leading-tight uppercase border-b border-slate-300 cursor-pointer bg-slate-100 hover:bg-sky-100 transition-colors text-[#1e3a8a]"
                    >
                      <div className="line-clamp-4 px-1">{step.shortName || step.name}</div>
                    </div>
                    
                    {/* Sub-step Counts */}
                    <div className="flex h-12">
                      {/* Ontime Count */}
                      <div 
                        onClick={() => { 
                          setFilterParentStep(step.name); 
                          setSelectedChildStep(null);
                          setCustomFilterType(null);
                          setStatusFilter('ontime'); 
                          navigateTo('projects'); 
                        }}
                        className="flex-1 flex flex-col items-center justify-center bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer border-r border-slate-200"
                        title="Dự án Còn hạn"
                      >
                         <span className="text-xl font-black text-emerald-700 leading-none">{step.ontime}</span>
                         <span className="text-[10px] text-emerald-600 font-bold mt-0.5">CÒN HẠN</span>
                      </div>
                      
                      {/* Delayed Count */}
                      <div 
                        onClick={() => { 
                          setFilterParentStep(step.name); 
                          setSelectedChildStep(null);
                          setCustomFilterType(null);
                          setStatusFilter('delayed'); 
                          navigateTo('projects'); 
                        }}
                        className="flex-1 flex flex-col items-center justify-center bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                        title="Dự án Quá hạn"
                      >
                         <span className="text-xl font-black text-rose-700 leading-none">{step.delayed}</span>
                         <span className="text-[10px] text-rose-600 font-bold mt-0.5">QUÁ HẠN</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const Overview = () => {
    const stagesToDisplay = projectStages.map(stage => ({ name: stage, dataName: stage }));

    return (
      <div className="flex flex-col h-full bg-slate-50">
        {/* Header */}
        <div className="bg-[#1e40af] text-white p-6 pb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight uppercase">SỞ XÂY DỰNG TP.HCM</h1>
            <div className="flex items-center gap-2 mt-2 text-blue-100/80 text-sm sm:text-base font-bold tracking-widest uppercase">
              THEO DÕI TIẾN ĐỘ DỰ ÁN NOXH
              <ChevronRight size={16} className="text-blue-300" />
              <ChevronRight size={16} className="text-blue-300 -ml-2" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 -mt-8 bg-white rounded-t-[32px] p-6 shadow-2xl relative z-20 overflow-y-auto pb-24">
          
          {/* Header Summary Statistics - Bento Grid Style */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8 mt-4">
            {/* Main Stats Card - Spans 2 columns on large screens */}
            <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 flex flex-col items-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
              
              <div className="flex items-center gap-2 mb-4 self-start relative z-10">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <Layers size={16} />
                </div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Thống kê dự án</h3>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-8 w-full relative z-10">
                <div className="h-[180px] w-[180px] relative shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'KH bị chậm tiến độ', value: overdueProjectsCount, status: 'delayed' },
                          { name: 'CQNN Đang xử lý', value: onTimeProjectsCount, status: 'ontime' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                        onClick={(data) => {
                          const payload = data.payload || data;
                          setSelectedAgency(null);
                          setSelectedDept(null);
                          setSelectedParentStep(null);
                          setFilterParentStep(null);
                          setSelectedChildStep(null);
                          setCustomFilterType(null);
                          setStatusFilter(payload.status);
                          navigateTo('projects');
                        }}
                        className="cursor-pointer outline-none"
                      >
                        <Cell fill="#be123c" stroke="transparent" /> {/* KH bị chậm tiến độ */}
                        <Cell fill="#059669" stroke="transparent" /> {/* CQNN Đang xử lý */}
                        <Label 
                          content={({ viewBox }) => {
                            const { cx, cy } = viewBox as any;
                            return (
                              <g>
                                <text x={cx} y={cy - 8} textAnchor="middle" dominantBaseline="middle" className="fill-slate-900 text-5xl font-black italic">
                                  {totalProjectsCount}
                                </text>
                                <text x={cx} y={cy + 22} textAnchor="middle" dominantBaseline="middle" className="fill-slate-400 text-[10px] font-black uppercase tracking-[0.2em] italic">
                                  Dự án
                                </text>
                              </g>
                            );
                          }}
                        />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex-1 space-y-3 w-full">
                  <button 
                    onClick={() => { 
                      setSelectedAgency(null);
                      setSelectedDept(null);
                      setSelectedParentStep(null);
                      setFilterParentStep(null);
                      setSelectedChildStep(null);
                      setCustomFilterType(null);
                      setStatusFilter('delayed'); 
                      navigateTo('projects'); 
                    }}
                    className="w-full flex items-center justify-between p-4 bg-rose-50/50 hover:bg-rose-50 rounded-2xl border border-rose-100 transition-all hover:shadow-md active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                        <Clock className="text-rose-600" size={18} />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">KH bị chậm</p>
                        <p className="text-xs font-bold text-rose-900 opacity-60">Trễ hạn kế hoạch</p>
                      </div>
                    </div>
                    <span className="text-2xl font-black text-rose-700">{overdueProjectsCount}</span>
                  </button>

                  <button 
                    onClick={() => { 
                      setSelectedAgency(null);
                      setSelectedDept(null);
                      setSelectedParentStep(null);
                      setFilterParentStep(null);
                      setSelectedChildStep(null);
                      setCustomFilterType(null);
                      setStatusFilter('ontime'); 
                      navigateTo('projects'); 
                    }}
                    className="w-full flex items-center justify-between p-4 bg-emerald-50/50 hover:bg-emerald-50 rounded-2xl border border-emerald-100 transition-all hover:shadow-md active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <TrendingUp className="text-emerald-600" size={18} />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">CQNN đang xử lý</p>
                        <p className="text-xs font-bold text-emerald-900 opacity-60">Theo đúng tiến độ</p>
                      </div>
                    </div>
                    <span className="text-2xl font-black text-emerald-700">{onTimeProjectsCount}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Metrics Column */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              {/* metric: Chấp thuận chủ trương ĐT */}
              <div 
                onClick={() => {
                  setCustomFilterType('approved');
                  navigateTo('projects');
                }}
                className="bg-blue-50/30 border border-blue-100 p-5 rounded-[28px] cursor-pointer hover:shadow-lg hover:shadow-blue-100/50 transition-all active:scale-[0.98] flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                     <LayoutDashboard size={24} />
                   </div>
                   <div>
                     <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-0.5 whitespace-nowrap">Chấp thuận chủ trương</h3>
                     <p className="text-xs font-bold text-slate-400">Đã phê duyệt</p>
                   </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-blue-700">
                    {projects.filter(p => {
                      const isLicensed = (p.gpxaydung_nn_date === 'X' || p.gpxaydung_cdt_date === 'X');
                      const isChutruongDone = (p.chutruong_nn_date === 'X' || p.chutruong_cdt_date === 'X');
                      return p.stage === 'CHUẨN BỊ ĐẦU TƯ' && isChutruongDone && !isLicensed;
                    }).length}
                  </span>
                </div>
              </div>

              {/* metric: Được cấp phép xây dựng */}
              <div 
                onClick={() => {
                  setCustomFilterType('licensed');
                  navigateTo('projects');
                }}
                className="bg-sky-50/30 border border-sky-100 p-5 rounded-[28px] cursor-pointer hover:shadow-lg hover:shadow-sky-100/50 transition-all active:scale-[0.98] flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-sky-600 group-hover:scale-110 transition-transform">
                     <Building2 size={24} />
                   </div>
                   <div>
                     <h3 className="text-[10px] font-black text-sky-600 uppercase tracking-widest mb-0.5">GP xây dựng</h3>
                     <p className="text-xs font-bold text-slate-400">Sẵn sàng thi công</p>
                   </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-sky-700">
                    {projects.filter(p => {
                      const isLicensed = (p.gpxaydung_nn_date === 'X' || p.gpxaydung_cdt_date === 'X');
                      return p.stage === 'CHUẨN BỊ ĐẦU TƯ' && isLicensed;
                    }).length}
                  </span>
                </div>
              </div>

              {/* metric: Dự án đã công bố */}
              <div 
                onClick={() => {
                  setCustomFilterType('announced');
                  navigateTo('projects');
                }}
                className="bg-emerald-50/30 border border-emerald-100 p-5 rounded-[28px] cursor-pointer hover:shadow-lg hover:shadow-emerald-100/50 transition-all active:scale-[0.98] flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-emerald-600 group-hover:scale-110 transition-transform">
                     <FileCheck size={24} />
                   </div>
                   <div>
                     <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-0.5">Dự án đã công bố</h3>
                     <p className="text-xs font-bold text-slate-400">Danh mục chính thức</p>
                   </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-emerald-700">
                    {projects.filter(p => p.stage === 'THỰC HIỆN ĐẦU TƯ').length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Statistics by Stage */}
          <StageStatsTable />

        </div>
      </div>
    );
  };

  const AgenciesStats = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-[#1e40af] text-white p-6 pb-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase">Thống kê theo cơ quan</h1>
            <p className="text-blue-100/60 text-xs font-bold tracking-widest uppercase">
              {statusFilter === 'delayed' ? 'KH bị chậm tiến độ' : statusFilter === 'ontime' ? 'CQNN đang xử lý' : 'Tất cả dự án'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-xl transition-all ${showFilters ? 'bg-white text-blue-600' : 'bg-white/10 text-white'}`}
        >
          <Filter size={24} />
        </button>
      </div>

      <FilterPanel />

      <div className="flex-1 -mt-8 bg-white rounded-t-[32px] p-6 shadow-2xl overflow-y-auto">
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm mb-6 h-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={(showInvestorStat && currentUser?.userType !== 'investor' ? dynamicAgencies.concat({
                id: 'no-investor-stat',
                name: 'Chưa có chủ đầu tư',
                count: globalFilteredProjects.filter(p => p.investor === 'Chưa có chủ đầu tư').length,
                delayedCount: globalFilteredProjects.filter(p => p.investor === 'Chưa có chủ đầu tư' && getProjectStatus(p) === 'delayed').length,
                ontimeCount: globalFilteredProjects.filter(p => p.investor === 'Chưa có chủ đầu tư' && getProjectStatus(p) === 'ontime').length,
                subtext: 'dự án đang xử lý',
                color: 'bg-emerald-50',
                iconColor: 'text-emerald-500',
                departments: [],
                displayOrder: 999
              }) : dynamicAgencies)
              .filter(a => a.count > 0)
              .sort((a, b) => b.count - a.count)
              .map(a => ({
                originalName: a.name,
                displayName: `${a.name} (${a.count}/${totalProjectsCount})`,
                total: a.count,
                ontime: a.count - a.delayedCount,
                delayed: a.delayedCount,
                agency: a
              }))}
              margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
              barGap={2}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="displayName" 
                type="category" 
                width={200}
                tick={<CustomYAxisTick />}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-xl overflow-hidden">
                        <p className="text-xs font-black text-slate-800 mb-2">{data.originalName}</p>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">CQNN Đang xử lý</span>
                            <span className="text-xs font-black text-[#047857]">{data.ontime}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4 border-b border-slate-50 pb-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">KH bị chậm tiến độ</span>
                            <span className="text-xs font-black text-[#be123c]">{data.delayed}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4 pt-1">
                            <span className="text-[10px] font-bold text-[#1e40af] uppercase">Tổng đang xử lý</span>
                            <span className="text-xs font-black text-[#1e40af]">{data.total}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {(statusFilter === 'all' || statusFilter === 'ontime') && (
                <Bar 
                  dataKey="ontime" 
                  fill="#059669" 
                  radius={[0, 4, 4, 0]} 
                  barSize={24}
                  onClick={(data: any) => handleAgencyClick(data.agency || data.payload?.agency, 'ontime')}
                  className="cursor-pointer"
                >
                  <LabelList dataKey="ontime" position="right" style={{ fontSize: '14px', fontWeight: 'bold', fill: '#059669' }} />
                </Bar>
              )}
              {(statusFilter === 'all' || statusFilter === 'delayed') && (
                <Bar 
                  dataKey="delayed" 
                  fill="#e11d48" 
                  radius={[0, 4, 4, 0]} 
                  barSize={24}
                  onClick={(data: any) => handleAgencyClick(data.agency || data.payload?.agency, 'delayed')}
                  className="cursor-pointer"
                >
                  <LabelList dataKey="delayed" position="right" style={{ fontSize: '14px', fontWeight: 'bold', fill: '#e11d48' }} />
                </Bar>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const DepartmentStats = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-[#1e40af] text-white p-6 pb-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase">{selectedAgency?.name}</h1>
            <p className="text-blue-100/60 text-xs font-bold tracking-widest uppercase">
              {statusFilter === 'delayed' ? 'Dự án quá hạn' : statusFilter === 'ontime' ? 'Dự án đang xử lý' : 'Thống kê chi tiết'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-xl transition-all ${showFilters ? 'bg-white text-blue-600' : 'bg-white/10 text-white'}`}
        >
          <Filter size={24} />
        </button>
      </div>

      <FilterPanel hideInvestorAndStage={selectedAgency?.name.includes('Phường xã') || selectedAgency?.name.includes('Phường/Xã') || selectedAgency?.name.includes('UBND cấp xã, phường')} />

      <div className="flex-1 -mt-8 bg-white rounded-t-[32px] p-6 shadow-2xl overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {dynamicDepartments.map((dept: any) => (
            <div
              key={dept.id}
              onClick={() => handleDeptClick(dept, statusFilter)}
              className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col gap-0.5 group cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 text-left">
                  <p className="text-sm sm:text-base font-bold text-slate-800 leading-tight line-clamp-2">{dept.name}</p>
                  {statusFilter === 'all' && (
                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-none mt-1">
                      Tổng số {dept.totalCount}
                    </p>
                  )}
                </div>
                {statusFilter !== 'all' && (
                  <div className="flex-shrink-0">
                    <span className={`text-2xl sm:text-3xl font-black leading-none ${statusFilter === 'delayed' ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {dept.projectCount}
                    </span>
                  </div>
                )}
              </div>
              
              {statusFilter === 'all' && (
                <div className="flex justify-between items-end mt-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeptClick(dept, 'delayed');
                    }}
                    className="hover:scale-110 transition-transform"
                  >
                    <span className="text-2xl sm:text-3xl font-black text-rose-600 leading-none">{dept.delayedCount}</span>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeptClick(dept, 'ontime');
                    }}
                    className="hover:scale-110 transition-transform"
                  >
                    <span className="text-2xl sm:text-3xl font-black text-emerald-600 leading-none">{dept.ontimeCount}</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const getParentStepStats = () => {
    const parentSteps = new Set<string>();
    baseFilteredProjects.forEach(p => {
      parentSteps.add(p.parentStep || 'Chưa có thủ tục');
    });

    return Array.from(parentSteps)
      .filter(stepName => stepName.toLowerCase().includes(stepSearchTerm.toLowerCase()))
      .map(stepName => {
        const stepProjects = baseFilteredProjects.filter(p => (p.parentStep || 'Chưa có thủ tục') === stepName);
        const delayed = stepProjects.filter(p => getProjectStatus(p) === 'delayed').length;
        const ontime = stepProjects.filter(p => getProjectStatus(p) === 'ontime').length;
        const total = stepProjects.length;
        
        let count = total;
        if (statusFilter === 'delayed') count = delayed > 0 ? delayed : 0;
        if (statusFilter === 'ontime') count = (delayed === 0 && ontime > 0) ? ontime : 0;

        return {
          name: stepName,
          count,
          total: total,
          delayed,
          ontime,
          isDelayed: delayed > 0,
          isOnTime: delayed === 0 && ontime > 0
        };
      }).filter(s => {
        if (statusFilter === 'delayed') return s.isDelayed;
        if (statusFilter === 'ontime') return s.isOnTime;
        return s.count > 0;
      });
  };

  const getChildStepStats = (parentStepName: string) => {
    const childSteps = new Set<string>();
    baseFilteredProjects.forEach(p => {
      if (p.parentStep === parentStepName && p.childStep) childSteps.add(p.childStep);
    });

    return Array.from(childSteps)
      .filter(stepName => stepName.toLowerCase().includes(stepSearchTerm.toLowerCase()))
      .map(stepName => {
        const stepProjects = baseFilteredProjects.filter(p => p.parentStep === parentStepName && p.childStep === stepName);
        const delayed = stepProjects.filter(p => getProjectStatus(p) === 'delayed').length;
        const ontime = stepProjects.filter(p => getProjectStatus(p) === 'ontime').length;
        const total = stepProjects.length;
        
        let count = total;
        if (statusFilter === 'delayed') count = delayed > 0 ? delayed : 0;
        if (statusFilter === 'ontime') count = (delayed === 0 && ontime > 0) ? ontime : 0;

        return {
          name: stepName,
          count,
          total: total,
          delayed,
          ontime,
          isDelayed: delayed > 0,
          isOnTime: delayed === 0 && ontime > 0
        };
      }).filter(s => {
        if (statusFilter === 'delayed') return s.isDelayed;
        if (statusFilter === 'ontime') return s.isOnTime;
        return s.count > 0;
      });
  };

  const StepsStats = () => {
    const rawData = getParentStepStats();
    const totalCount = rawData.reduce((acc, curr) => acc + curr.count, 0);
    const chartData = rawData
      .sort((a, b) => b.count - a.count)
      .map(step => ({
        ...step,
        value: step.count,
        originalName: step.name,
        displayName: `${step.name} (${step.count})`,
      }));

    // Dynamic Color Schemes
    const theme = {
      header: statusFilter === 'delayed' ? 'bg-rose-700' : statusFilter === 'ontime' ? 'bg-emerald-700' : 'bg-[#1e40af]',
      subline: statusFilter === 'delayed' ? 'text-rose-100/60' : statusFilter === 'ontime' ? 'text-emerald-100/60' : 'text-blue-100/60',
      chartText: statusFilter === 'delayed' ? 'fill-rose-900' : statusFilter === 'ontime' ? 'fill-emerald-900' : 'fill-slate-800',
      palette: statusFilter === 'delayed' 
        ? ['#9f1239', '#be123c', '#fb7185', '#e11d48', '#fda4af', '#fecdd3', '#fff1f2']
        : statusFilter === 'ontime'
        ? ['#047857', '#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5']
        : ['#1e40af', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#eff6ff'],
      focus: statusFilter === 'delayed' ? 'focus:ring-rose-500/20' : statusFilter === 'ontime' ? 'focus:ring-emerald-500/20' : 'focus:ring-blue-500/20',
      dot: statusFilter === 'delayed' ? 'bg-rose-600' : statusFilter === 'ontime' ? 'bg-emerald-600' : 'bg-blue-600'
    };

    return (
      <div className="flex flex-col h-full bg-slate-50">
        <div className={`${theme.header} text-white p-6 pb-12 flex items-center justify-between transition-colors duration-500`}>
          <div className="flex items-center gap-4">
            <button onClick={goBack} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-black tracking-tight uppercase">Thống kê theo thủ tục</h1>
              <p className={`${theme.subline} text-[10px] font-bold tracking-widest uppercase leading-tight`}>
                {statusFilter === 'delayed' ? 'KH bị chậm tiến độ' : statusFilter === 'ontime' ? 'CQNN đang xử lý' : 'Tất cả thủ tục'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 -mt-8 bg-white rounded-t-[32px] p-6 shadow-2xl overflow-y-auto">
          <div className="relative mb-4">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm theo tên thủ tục..." 
              value={stepSearchTerm}
              onChange={(e) => setStepSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 ${theme.focus} transition-all font-bold`}
            />
          </div>

          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm mb-6 min-h-[400px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    onClick={(data) => {
                      const step = data.payload || data;
                      setSelectedParentStep(step.originalName);
                      setFilterParentStep(step.originalName);
                      setSelectedChildStep(null);
                      setStatusFilter(statusFilter);
                      navigateTo('projects');
                    }}
                    className="cursor-pointer outline-none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={theme.palette[index % theme.palette.length]} />
                    ))}
                    <Label 
                      content={({ viewBox }) => {
                        const { cx, cy } = viewBox as any;
                        return (
                          <g>
                            <text x={cx} y={cy - 5} textAnchor="middle" dominantBaseline="middle" className={`${theme.chartText} text-3xl font-black`}>
                              {chartData.length}
                            </text>
                            <text x={cx} y={cy + 20} textAnchor="middle" dominantBaseline="middle" className="fill-slate-400 text-[10px] font-black uppercase tracking-widest leading-none">
                              {statusFilter === 'all' ? 'Thủ tục' : statusFilter === 'delayed' ? 'KH bị chậm' : 'Đang xử lý'}
                            </text>
                          </g>
                        );
                      }}
                    />
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100 min-w-[200px]">
                            <p className="text-xs font-black text-slate-800 mb-2">{data.originalName}</p>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Số lượng dự án</span>
                                <span className={`text-sm font-black ${statusFilter === 'delayed' ? 'text-rose-600' : statusFilter === 'ontime' ? 'text-emerald-600' : 'text-blue-600'}`}>
                                  {data.count}
                                </span>
                              </div>
                              {statusFilter === 'all' && (
                                <div className="flex items-center justify-between gap-4">
                                  <span className="text-[10px] font-bold text-rose-500 uppercase">KH bị chậm</span>
                                  <span className="text-sm font-black text-rose-600">{data.delayed}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[350px] flex flex-col items-center justify-center text-slate-400 gap-2">
                <Search size={48} className="opacity-20" />
                <p className="text-sm font-bold">Không có dữ liệu phù hợp</p>
              </div>
            )}

            {/* Summary Bar for Procedures */}
            <div className={`mt-2 mb-4 p-3 rounded-2xl border ${statusFilter === 'delayed' ? 'bg-rose-50 border-rose-100' : statusFilter === 'ontime' ? 'bg-emerald-50 border-emerald-100' : 'bg-blue-50 border-blue-100'} flex items-center justify-between`}>
              <span className={`text-xs font-black uppercase tracking-widest ${statusFilter === 'delayed' ? 'text-rose-700' : statusFilter === 'ontime' ? 'text-emerald-700' : 'text-blue-700'}`}>
                Danh sách thủ tục
              </span>
              <div className={`px-3 py-1 rounded-full font-black text-xs ${statusFilter === 'delayed' ? 'bg-rose-600' : statusFilter === 'ontime' ? 'bg-emerald-600' : 'bg-blue-600'} text-white shadow-sm`}>
                {chartData.length} {statusFilter === 'delayed' ? 'Thủ tục quá hạn' : statusFilter === 'ontime' ? 'Thủ tục còn hạn' : 'Thủ tục'}
              </div>
            </div>

            {/* List for StepStats */}
            <div className="mt-4 space-y-2">
              {chartData.map((step, index) => (
                <button
                  key={step.originalName}
                  onClick={() => {
                    setSelectedParentStep(step.originalName);
                    setFilterParentStep(step.originalName);
                    setSelectedChildStep(null);
                    setStatusFilter(statusFilter);
                    navigateTo('projects');
                  }}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.palette[index % theme.palette.length] }}></div>
                    <span className="text-sm font-bold text-slate-700 text-left">{step.originalName}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className={`text-lg font-black ${statusFilter === 'delayed' ? 'text-rose-700' : statusFilter === 'ontime' ? 'text-emerald-700' : 'text-slate-800'}`}>
                        {step.count}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">dự án</span>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ChildStepsStats = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-[#1e40af] text-white p-6 pb-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase">{selectedParentStep}</h1>
            <p className="text-blue-100/60 text-xs font-bold tracking-widest uppercase">Thống kê bước con</p>
          </div>
        </div>
      </div>

      <div className="flex-1 -mt-8 bg-white rounded-t-[32px] p-6 shadow-2xl overflow-y-auto">
        <div className="relative mb-4">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Tìm theo tên bước con..." 
            value={stepSearchTerm}
            onChange={(e) => setStepSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {selectedParentStep && getChildStepStats(selectedParentStep).map((step) => (
            <div
              key={step.name}
              onClick={() => {
                setSelectedChildStep(step.name);
                setStatusFilter(statusFilter);
                navigateTo('projects');
              }}
              className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col gap-0.5 cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 text-left">
                  <p className="text-sm sm:text-base font-bold text-slate-800 leading-tight line-clamp-2">{step.name}</p>
                  {statusFilter === 'all' && (
                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-none mt-1">
                      Tổng số {step.total}
                    </p>
                  )}
                </div>
                {statusFilter !== 'all' && (
                  <div className="flex-shrink-0">
                    <span className={`text-2xl sm:text-3xl font-black leading-none ${statusFilter === 'delayed' ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {step.count}
                    </span>
                  </div>
                )}
              </div>
              
              {statusFilter === 'all' && (
                <div className="flex justify-between items-end mt-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedChildStep(step.name);
                      setStatusFilter('delayed');
                      navigateTo('projects');
                    }}
                    className="hover:scale-110 transition-transform"
                  >
                    <span className="text-2xl sm:text-3xl font-black text-rose-600 leading-none">{step.delayed}</span>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedChildStep(step.name);
                      setStatusFilter('ontime');
                      navigateTo('projects');
                    }}
                    className="hover:scale-110 transition-transform"
                  >
                    <span className="text-2xl sm:text-3xl font-black text-emerald-600 leading-none">{step.ontime}</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ProjectList = () => {
    const [localSearch, setLocalSearch] = useState('');

      const filteredProjects = globalFilteredProjects.filter(p => {
        let matches = true;
        if (selectedChildStep) {
          matches = p.currentStep === selectedChildStep;
        } else if (selectedDept) {
          const agencyName = getStepAgency(p, INITIAL_PROCESSES);
          const projectDept = getStepDepartment(p);
          matches = agencyName === selectedAgency?.name && (projectDept === selectedDept.name || p.currentDepartment === selectedDept.name || p.location.includes(selectedDept.name));
        } else if (selectedAgency) {
          if (selectedAgency.id === 'no-investor-stat') {
            matches = p.investor === 'Chưa có chủ đầu tư';
          } else if (selectedAgency.id === 'investor-stat') {
            matches = getStepAgency(p, INITIAL_PROCESSES) === 'Chủ đầu tư';
          } else {
            matches = getStepAgency(p, INITIAL_PROCESSES) === selectedAgency?.name;
          }
        }
        
        if (statusFilter === 'delayed') matches = matches && getProjectStatus(p) === 'delayed';
        if (statusFilter === 'ontime') matches = matches && getProjectStatus(p) === 'ontime';
        
        if (localSearch) {
        const searchLower = localSearch.toLowerCase();
        matches = matches && (p.name.toLowerCase().includes(searchLower) || p.investor.toLowerCase().includes(searchLower));
      }

      return matches;
    });
    
    return (
      <div className="flex flex-col h-full bg-slate-50">
        <div className="bg-[#1e40af] text-white p-6 pb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={goBack} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-black tracking-tight uppercase">
                {statusFilter === 'delayed' ? 'KH bị chậm' : statusFilter === 'ontime' ? 'CQNN đang xử lý' : 'Danh sách dự án'}
              </h1>
              <p className="text-blue-100/60 text-xs font-bold tracking-widest uppercase">
                {selectedDept?.name || selectedAgency?.name || filterParentStep || 'Tất cả dự án'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-xl transition-all ${showFilters ? 'bg-white text-blue-600' : 'bg-white/10 text-white'}`}
          >
            <Filter size={24} />
          </button>
        </div>

        <FilterPanel />

        <div className="bg-white px-6 py-4 border-b border-slate-100">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Tìm kiếm theo tên dự án, chủ đầu tư..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 bg-white rounded-t-[32px] p-6 shadow-2xl overflow-y-auto pb-24">
          <div className="space-y-4">
            {filteredProjects.length > 0 ? filteredProjects.map((p) => {
              const info = getProjectExtendedInfo(p);
              return (
                <motion.button
                  key={p.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleProjectClick(p)}
                  className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2 text-left"
                >
                  <div className="flex justify-between items-start">
                    <p className="text-base font-black text-slate-800 line-clamp-2 leading-tight flex-1">{p.name}</p>
                    {info.status === 'delayed' ? (
                      <AlertCircle size={20} className="text-rose-500 ml-2 flex-shrink-0" />
                    ) : (
                      <CheckCircle2 size={20} className="text-emerald-500 ml-2 flex-shrink-0" />
                    )}
                  </div>
                  
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">{p.investor}</p>
                  
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                    <span className="text-blue-600">{info.activePhase.name}</span>
                    <span className="text-slate-300">•</span>
                    <span>{getStepAgency(p, INITIAL_PROCESSES)}</span>
                    <span className="text-slate-300">•</span>
                    <span className={`font-bold ${info.status === 'delayed' ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {formatDate(info.planNnStr || p.deadline)}
                    </span>
                  </div>
                </motion.button>
              );
            }) : (
              <div className="text-center py-12 text-slate-400 italic text-sm">
                Không có dự án nào đang xử lý tại đây...
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const SearchResults = () => {
    const filteredProjects = globalFilteredProjects.filter(p => {
      let matches = (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     p.investor.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matches;
    });
    
    return (
      <div className="flex flex-col h-full bg-slate-50">
        <div className="bg-[#1e40af] text-white p-6 pb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={goBack} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-black tracking-tight uppercase">KẾT QUẢ TÌM KIẾM</h1>
              <p className="text-blue-100/60 text-xs font-bold tracking-widest uppercase">"{searchQuery}"</p>
            </div>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-xl transition-all ${showFilters ? 'bg-white text-blue-600' : 'bg-white/10 text-white'}`}
          >
            <Filter size={24} />
          </button>
        </div>

        <div className="bg-white px-6 py-4 border-b border-slate-100">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              defaultValue={searchQuery}
              placeholder="Tìm kiếm dự án khác..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch((e.target as HTMLInputElement).value);
                }
              }}
            />
          </div>
        </div>

        <FilterPanel />

        <div className="flex-1 -mt-8 bg-white rounded-t-[32px] p-6 shadow-2xl overflow-y-auto pb-24">
          <div className="space-y-4">
            {filteredProjects.length > 0 ? filteredProjects.map((p) => {
              const info = getProjectExtendedInfo(p);
              return (
                <motion.button
                  key={p.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleProjectClick(p)}
                  className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2 text-left"
                >
                <div className="flex justify-between items-start">
                   <p className="text-base font-black text-slate-800 line-clamp-2 leading-tight flex-1">{p.name}</p>
                   {getProjectStatus(p) === 'delayed' ? (
                     <AlertCircle size={20} className="text-rose-500 ml-2 flex-shrink-0" />
                   ) : (
                     <CheckCircle2 size={20} className="text-emerald-500 ml-2 flex-shrink-0" />
                   )}
                </div>
                
                <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">{p.investor}</p>
                
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                   <span className="text-blue-600">{info.activePhase.name}</span>
                   <span className="text-slate-300">•</span>
                   <span>{getStepAgency(p, INITIAL_PROCESSES)}</span>
                   <span className="text-slate-300">•</span>
                   <span className={`font-bold ${info.status === 'delayed' ? 'text-rose-600' : 'text-emerald-600'}`}>
                     {formatDate(info.planNnStr || p.deadline)}
                   </span>
                </div>
              </motion.button>
            );
          }) : (
            <div className="text-center py-12 text-slate-400 italic text-sm">
              Không tìm thấy dự án nào phù hợp...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

  const ProjectDetail = () => {
    if (!selectedProject) return null;

    interface ActualProgress {
      cdtDate: string;
      nnDate: string;
    }

    // --- State Hook for Progress ---
    const [actualProgressMap, setActualProgressMap] = useState<Record<string, ActualProgress>>(() => {
      const saved = localStorage.getItem(`actual_progress_${selectedProject.id}`);
      const savedData = saved ? JSON.parse(saved) : {};
      
      return {
        ...(MOCK_PROGRESS_DATA[selectedProject.id.toString()] || {}),
        ...savedData
      };
    });

    const activePhase = PHASES.find(phase => {
      const planCdt = (selectedProject as any)[phase.cdtKey];
      const planNn = (selectedProject as any)[phase.nnKey];
      const actual = actualProgressMap[phase.id];

      const cdtDone = planCdt === 'X' || planCdt === '' || (actual && actual.cdtDate && actual.cdtDate !== '');
      const nnDone = planNn === 'X' || planNn === '' || (actual && actual.nnDate && actual.nnDate !== '');

      return !(cdtDone && nnDone);
    }) || PHASES[PHASES.length - 1]; // Mặc định là bước cuối nếu tất cả đã xong

    const activePlanCdt = activePhase ? (selectedProject as any)[activePhase.cdtKey] : null;
    const activePlanNn = activePhase ? (selectedProject as any)[activePhase.nnKey] : null;

    const formatDateForDisplay = (dateStr: string) => {
      if (!dateStr || dateStr === 'X' || dateStr === '--') return '';
      const date = parseDate(dateStr);
      if (!date || isNaN(date.getTime())) return dateStr;
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPhase, setCurrentPhase] = useState<any>(null);
    const [tempCdtDate, setTempCdtDate] = useState('');
    const [tempNnDate, setTempNnDate] = useState('');

    const getStatusColor = (phase: any, actual: ActualProgress) => {
      const planDateNNStr = (selectedProject as any)[phase.nnKey];
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
        localStorage.setItem(`actual_progress_${selectedProject.id}`, JSON.stringify(updatedMap));
      }
      setIsModalOpen(false);
    };

    const completedMilestones = PHASES.filter(phase => {
      const planCdt = (selectedProject as any)[phase.cdtKey];
      const planNn = (selectedProject as any)[phase.nnKey];
      const actual = actualProgressMap[phase.id];

      const cdtDone = planCdt === 'X' || planCdt === '' || (actual && actual.cdtDate && actual.cdtDate !== '');
      const nnDone = planNn === 'X' || planNn === '' || (actual && actual.nnDate && actual.nnDate !== '');

      return cdtDone && nnDone;
    }).length;

    const overdueCount = Object.keys(actualProgressMap).filter(phaseId => {
      const phase = PHASES.find(p => p.id === phaseId);
      if (!phase) return false;
      const actual = actualProgressMap[phaseId];
      return getStatusColor(phase, actual) === 'bg-rose-600';
    }).length;

    const currentStepDisplay = useMemo(() => {
      if (!activePhase) return selectedProject.childStep || selectedProject.currentStep;
      
      const phaseId = activePhase.id;
      const parentStep = selectedProject.parentStep?.toLowerCase() || "";
      
      const isMatch = (phaseId === 'chutruong' && parentStep.includes('chủ trương')) ||
                     (phaseId === 'qh1500' && parentStep.includes('quy hoạch')) ||
                     (phaseId === 'giaodat' && (parentStep.includes('giao đất') || parentStep.includes('thuê đất'))) ||
                     (phaseId === 'htkt' && parentStep.includes('hạ tầng')) ||
                     (phaseId === 'bcnckt' && (parentStep.includes('bc nckt') || parentStep.includes('khả thi'))) ||
                     (phaseId === 'pccc' && parentStep.includes('pccc')) ||
                     (phaseId === 'gpxd' && parentStep.includes('giấy phép'));

      if (isMatch && selectedProject.currentStep) {
        return selectedProject.currentStep;
      }
      
      return activePhase.name;
    }, [activePhase, selectedProject]);

    const agencyDisplay = useMemo(() => {
      if (!activePhase) return selectedProject.currentAgency;

      const phaseId = activePhase.id;
      const parentStep = selectedProject.parentStep?.toLowerCase() || "";
      
      const isMatch = (phaseId === 'chutruong' && parentStep.includes('chủ trương')) ||
                     (phaseId === 'qh1500' && parentStep.includes('quy hoạch')) ||
                     (phaseId === 'giaodat' && (parentStep.includes('giao đất') || parentStep.includes('thuê đất'))) ||
                     (phaseId === 'htkt' && parentStep.includes('hạ tầng')) ||
                     (phaseId === 'bcnckt' && (parentStep.includes('bc nckt') || parentStep.includes('khả thi'))) ||
                     (phaseId === 'pccc' && parentStep.includes('pccc')) ||
                     (phaseId === 'gpxd' && parentStep.includes('giấy phép'));

      if (isMatch && selectedProject.currentAgency) {
        return `${selectedProject.currentAgency}${selectedProject.currentDepartment ? ` - ${selectedProject.currentDepartment}` : ''}`;
      }

      return AGENCIES.find(a => a.id === activePhase.agency)?.name || selectedProject.currentAgency;
    }, [activePhase, selectedProject, AGENCIES]);

    return (
      <div className="flex flex-col h-full bg-slate-50 relative pb-24 overflow-y-auto">
        {/* Header Section */}
        <div className="bg-[#1e40af] text-white p-6 pb-12 flex items-center gap-4 shrink-0">
          <button onClick={goBack} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
               <span className="px-2 py-0.5 bg-white/20 text-white text-[9px] font-black rounded uppercase tracking-widest">{selectedProject.code}</span>
            </div>
            <h1 className="text-xl font-black tracking-tight leading-tight uppercase">CHI TIẾT DỰ ÁN GANTT</h1>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
              <Download size={20} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 -mt-8 bg-slate-50 rounded-t-[32px] p-4 sm:p-6 shadow-2xl space-y-6">
          {/* Summary Info Card */}
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <h2 className="text-lg font-black text-slate-900 leading-tight">{selectedProject.name}</h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-bold">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-rose-500" />
                    <span>{selectedProject.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building2 size={14} className="text-blue-500" />
                    <span>{selectedProject.investor}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100">
                    <FileText size={14} className="text-emerald-500" />
                    <span className="uppercase tracking-wider">{selectedProject.projectCategory || 'Chưa phân loại'}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 self-start md:self-center">
                {[
                  { label: 'Căn hộ', value: selectedProject.apartmentCount || '0', color: 'blue' },
                  { label: 'Tầng cao', value: selectedProject.height || '0', color: 'purple' },
                  { label: 'Mốc xong', value: `${completedMilestones}/7`, color: 'emerald' },
                ].map((stat, idx) => (
                  <div key={idx} className={`px-3 py-2 bg-${stat.color}-50 border border-${stat.color}-100 rounded-2xl text-center min-w-[70px] sm:min-w-[90px]`}>
                    <p className="text-[8px] font-black text-slate-400 uppercase">{stat.label}</p>
                    <p className={`text-sm font-black text-${stat.color}-600`}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                 <div className="flex items-center gap-2 text-slate-600">
                   <div className="w-3.5 h-3.5 bg-emerald-500 rounded-lg" />
                   <span>Hoàn thành</span>
                 </div>
                 <div className="flex items-center gap-2 text-slate-600">
                   <div className="w-3.5 h-3.5 bg-amber-400 rounded-lg" />
                   <span>Đang thực hiện</span>
                 </div>
                 <div className="flex items-center gap-2 text-slate-600">
                   <div className="w-3.5 h-3.5 bg-blue-600 rounded-lg" />
                   <span>Đúng hạn</span>
                 </div>
                 <div className="flex items-center gap-2 text-slate-600">
                   <div className="w-3.5 h-3.5 bg-rose-500 rounded-lg" />
                   <span>Quá hạn</span>
                 </div>
                 <div className="flex items-center gap-2 text-slate-600">
                   <div className="w-3.5 h-3.5 bg-slate-200 rounded-lg" />
                   <span>Chưa bắt đầu</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Current Step Status Card */}
          <div className="bg-blue-600 rounded-[28px] p-6 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-2 opacity-80">Bước hiện tại</p>
                <div className="flex items-start gap-3">
                   <div className="p-2 bg-white/20 rounded-xl shrink-0 mt-0.5">
                     <Circle size={18} className="fill-white" />
                   </div>
                   <p className="text-sm font-bold leading-tight">{currentStepDisplay}</p>
                </div>
              </div>

              <div className="md:col-span-1">
                <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-2 opacity-80">Cơ quan xử lý</p>
                <div className="flex items-start gap-3">
                   <div className="p-2 bg-white/20 rounded-xl shrink-0 mt-0.5">
                     <Building2 size={18} />
                   </div>
                   <p className="text-sm font-bold leading-tight">{agencyDisplay}</p>
                </div>
              </div>

              <div className="md:col-span-1">
                <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-2 opacity-80">Thời hạn CĐT</p>
                <div className="flex items-start gap-3">
                   <div className="p-2 bg-white/20 rounded-xl shrink-0 mt-0.5">
                     <User size={18} />
                   </div>
                   <div>
                     <p className="text-sm font-bold leading-tight">{activePlanCdt ? formatDate(activePlanCdt) : formatDate(selectedProject.stepDeadline || selectedProject.deadline)}</p>
                     <p className="text-[9px] font-bold text-blue-100 mt-1 opacity-60">Dự kiến hoàn thành</p>
                   </div>
                </div>
              </div>

              <div className="md:col-span-1">
                <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-2 opacity-80">Thời hạn Cơ quan NN</p>
                <div className="flex items-start gap-3">
                   <div className="p-2 bg-white/20 rounded-xl shrink-0 mt-0.5">
                     <Building2 size={18} />
                   </div>
                   <div>
                     <p className="text-sm font-bold leading-tight">{activePlanNn ? formatDate(activePlanNn) : formatDate(selectedProject.deadline)}</p>
                     <p className="text-[9px] font-bold text-blue-100 mt-1 opacity-60">Dự kiến phê duyệt</p>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gantt Table section */}
          <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <Maximize2 size={18} />
              </div>
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">Sơ đồ gantt tiến độ thực hiện</h2>
            </div>

            <div className="overflow-x-auto overflow-y-hidden custom-scrollbar">
              <table className="w-full border-separate border-spacing-0 min-w-[1000px]">
                <thead>
                  <tr className="h-14">
                    <th className="sticky left-0 top-0 z-30 bg-[#2C3E50] text-white text-[9px] font-black uppercase tracking-widest px-3 py-3 border-r border-slate-700 w-[140px] text-left">Cơ quan NN</th>
                    <th className="sticky left-[140px] top-0 z-30 bg-[#2C3E50] text-white text-[9px] font-black uppercase tracking-widest px-2 py-3 border-r border-slate-700 w-12 text-center"></th>
                    {PHASES.map((phase) => (
                      <th key={phase.id} className={`px-2 py-3 border-r ${phase.borderColor} ${phase.color} ${phase.textColor} text-[9px] font-black uppercase tracking-wider text-center max-w-[120px]`}>
                        <div className="line-clamp-2">{phase.name}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Chủ đầu tư Rows */}
                  <React.Fragment>
                    <tr className="h-10">
                      <td rowSpan={2} className="sticky left-0 bg-white px-3 py-3 border-r border-b border-slate-200 align-middle z-20 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                        <div className="text-[11px] font-black text-blue-700 uppercase leading-none">Chủ đầu tư</div>
                      </td>
                      <td className="sticky left-[140px] bg-white px-1 py-1 border-r border-b border-slate-200 text-center z-20 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                        <span className="px-1.5 py-0.5 border border-blue-200 text-blue-600 text-[8px] font-black rounded uppercase">KH</span>
                      </td>
                    {PHASES.map((phase, mIdx) => {
                      const startDateStr = (selectedProject as any)[phase.cdtKey];
                      const actual = actualProgressMap[phase.id];
                      const isDone = startDateStr === 'X' || (actual && actual.cdtDate && actual.cdtDate !== '');
                      const hasData = (startDateStr && startDateStr !== 'X' && startDateStr !== '--' && startDateStr !== '') || isDone;
                      
                      const getKHStyles = () => {
                        if (isDone) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
                        const activeIdx = PHASES.indexOf(activePhase);
                        if (mIdx > activeIdx) return 'bg-slate-50 text-slate-400 border-slate-200';
                        
                        if (!startDateStr || startDateStr === '--' || startDateStr === '') return 'bg-amber-50 text-amber-600 border-amber-200';
                        const planDate = parseDate(startDateStr);
                        if (!planDate) return 'bg-amber-50 text-amber-600 border-amber-200';
                        if (today > planDate) return 'bg-rose-50 text-rose-700 border-rose-100';
                        return 'bg-amber-50 text-amber-600 border-amber-200';
                      };

                      return (
                        <td key={phase.id} className="border-r border-b border-slate-100 p-1 relative bg-white min-w-[120px]">
                          {hasData && (
                            <div className={`absolute inset-y-1.5 left-1.5 right-1.5 rounded-md flex items-center justify-center text-[9px] font-black leading-none border shadow-sm uppercase ${getKHStyles()}`}>
                              {isDone ? (
                                <span className="flex items-center gap-0.5"><Check size={10} strokeWidth={4} /> {startDateStr === 'X' || !startDateStr ? 'Đã xong' : formatDateForDisplay(startDateStr)}</span>
                              ) : (
                                formatDateForDisplay(startDateStr)
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}
                    </tr>
                    <tr className="h-10">
                      <td className="sticky left-[140px] bg-[#F8FAFC] px-1 py-1 border-r border-b border-slate-200 text-center z-20 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                        <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[8px] font-black rounded uppercase">TT</span>
                      </td>
                      {PHASES.map((phase) => {
                        const actual = actualProgressMap[phase.id];
                        const hasActual = actual && (actual.cdtDate || actual.nnDate);
                        const planCdtStr = (selectedProject as any)[phase.cdtKey];
                        const planNnStr = (selectedProject as any)[phase.nnKey];
                        const hasPlan = (planCdtStr && planCdtStr !== 'X') || (planNnStr && planNnStr !== 'X');
                        
                        const getCdtStatusColor = () => {
                          if (!actual?.cdtDate || !planCdtStr || planCdtStr === 'X') return 'bg-blue-600';
                          const planDate = parseDate(planCdtStr);
                          const actualDate = parseDate(actual.cdtDate);
                          if (!planDate || !actualDate || isNaN(actualDate.getTime())) return 'bg-blue-600';
                          return actualDate > planDate ? 'bg-rose-600' : 'bg-blue-600';
                        };

                        const isInvestor = currentUser?.userType === 'investor';
                        const isAdminUser = currentUser?.roleId === 'Admin';
                        const isSXD = currentUser?.agencyId === '1';
                        const canEditCdt = isInvestor || isAdminUser || isSXD;

                        return (
                          <td key={phase.id} className="border-r border-b border-slate-100 p-1 relative bg-[#F8FAFC]">
                            {hasActual ? (
                               <div onClick={() => handleOpenModal(phase)} className={`absolute inset-y-1.5 left-1.5 right-1.5 rounded-md flex items-center justify-center text-[9px] font-black text-white cursor-pointer shadow-sm ${getCdtStatusColor()}`}>
                                 {formatDateForDisplay(actual.cdtDate)}
                               </div>
                            ) : hasPlan && canEditCdt ? (
                               <button onClick={() => handleOpenModal(phase)} className="absolute inset-x-2 inset-y-2 border border-dashed border-blue-300 bg-blue-50/50 rounded-md text-blue-500 text-[8px] font-bold hover:bg-blue-100 transition-colors uppercase">
                                 + nhập TT
                               </button>
                            ) : null}
                          </td>
                        );
                      })}
                    </tr>
                  </React.Fragment>

                  {/* Agency Rows */}
                  {AGENCIES.map((agency) => (
                    <React.Fragment key={agency.id}>
                      <tr className="h-10">
                        <td rowSpan={2} className="sticky left-0 bg-white px-3 py-3 border-r border-b border-slate-200 align-middle z-20 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                          <div className="text-[11px] font-black text-slate-700 leading-none">{agency.name}</div>
                        </td>
                        <td className="sticky left-[140px] bg-white px-1 py-1 border-r border-b border-slate-200 text-center z-20 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                          <span className="px-1.5 py-0.5 border border-slate-200 text-slate-500 text-[8px] font-black rounded uppercase">KH</span>
                        </td>
                        {PHASES.map((phase, mIdx) => {
                          const endDateStr = (selectedProject as any)[phase.nnKey];
                          const isOwnerAgency = phase.agency === agency.id;
                          const actual = actualProgressMap[phase.id];
                          const isDone = endDateStr === 'X' || (actual && actual.nnDate && actual.nnDate !== '');
                          const hasData = (endDateStr && endDateStr !== 'X' && endDateStr !== '--' && endDateStr !== '') || isDone;

                          const getKHStyles = () => {
                            if (isDone) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
                            const activeIdx = PHASES.indexOf(activePhase);
                            if (mIdx > activeIdx) return 'bg-slate-50 text-slate-400 border-slate-200';

                            if (!endDateStr || endDateStr === '--' || endDateStr === '') return 'bg-amber-50 text-amber-600 border-amber-200';
                            const planDate = parseDate(endDateStr);
                            if (!planDate) return 'bg-amber-50 text-amber-600 border-amber-200';
                            if (today > planDate) return 'bg-rose-50 text-rose-700 border-rose-100';
                            return 'bg-amber-50 text-amber-600 border-amber-200';
                          };

                          return (
                            <td key={phase.id} className="border-r border-b border-slate-100 p-1 relative bg-white">
                              {isOwnerAgency && (hasData || isDone) && (
                                <div className={`absolute inset-y-1.5 left-1.5 right-1.5 rounded-md flex items-center justify-center text-[9px] font-black leading-none border shadow-sm uppercase ${getKHStyles()}`}>
                                  {isDone ? (
                                    <span className="flex items-center gap-0.5"><Check size={10} strokeWidth={4} /> {endDateStr === 'X' || !endDateStr ? 'Đã xong' : formatDateForDisplay(endDateStr)}</span>
                                  ) : (
                                    formatDateForDisplay(endDateStr)
                                  )}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                      <tr className="h-10">
                        <td className="sticky left-[140px] bg-[#F8FAFC] px-1 py-1 border-r border-b border-slate-200 text-center z-20 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                          <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[8px] font-black rounded uppercase">TT</span>
                        </td>
                        {PHASES.map((phase) => {
                          const isOwnerAgency = phase.agency === agency.id;
                          const actual = actualProgressMap[phase.id];
                          const hasActual = actual && actual.nnDate;
                          const planNnStr = (selectedProject as any)[phase.nnKey];
                          const hasPlan = planNnStr && planNnStr !== 'X';

                          const isAgencyUser = currentUser?.userType === 'agency';
                          const isAdminUser = currentUser?.roleId === 'Admin';
                          const isSXD = currentUser?.agencyId === '1';
                          const canEditAgency = isAdminUser || isSXD || (isAgencyUser && String(currentUser?.agencyId) === String(agency.id));

                          return (
                            <td key={phase.id} className="border-r border-b border-slate-100 p-1 relative bg-[#F8FAFC]">
                              {isOwnerAgency && hasActual ? (
                                <div onClick={() => handleOpenModal(phase)} className={`absolute inset-y-1.5 left-1.5 right-1.5 rounded-md flex items-center justify-center text-[9px] font-black text-white cursor-pointer shadow-sm ${getStatusColor(phase, actual)}`}>
                                  {formatDateForDisplay(actual.nnDate)}
                                </div>
                              ) : isOwnerAgency && hasPlan && canEditAgency ? (
                                <button onClick={() => handleOpenModal(phase)} className="absolute inset-x-2 inset-y-2 border border-dashed border-blue-300 bg-blue-50/50 rounded-md text-blue-500 text-[8px] font-bold hover:bg-blue-100 transition-colors uppercase">
                                  + nhập TT
                                </button>
                              ) : null}
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

          {/* History Section - Preserved logic */}
          <section className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-1 flex items-center gap-2">
              <History size={16} className="text-blue-600" />
              Lịch sử xử lý dự án
            </h3>
            <div className="space-y-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
               <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-blue-100 border-4 border-white shadow-sm flex items-center justify-center z-10 scale-110">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:bg-blue-50 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between gap-4">
                       <div>
                          <p className="text-sm font-black text-slate-800 leading-tight group-hover:text-blue-700">{activePhase ? activePhase.name : (selectedProject.childStep || selectedProject.currentStep)}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">
                            {activePhase 
                              ? AGENCIES.find(a => a.id === activePhase.agency)?.name 
                              : (getStepAgency(selectedProject, INITIAL_PROCESSES) || selectedProject.currentAgency)}
                          </p>
                       </div>
                       <div className="text-right shrink-0">
                          <span className="text-[9px] font-black text-blue-600 bg-white px-2 py-0.5 rounded-lg border border-blue-200 uppercase tracking-widest">Đang xử lý</span>
                          <p className="text-[10px] font-bold text-slate-400 mt-1">{activePlanNn ? formatDate(activePlanNn) : formatDate(selectedProject.stepDeadline || selectedProject.deadline)}</p>
                       </div>
                    </div>
                  </div>
               </div>

               {[
                 { action: 'Tiếp nhận hồ sơ và kiểm tra tính hợp lệ', agency: 'Văn phòng Sở', date: '15/03/2024', status: 'Hoàn thành' },
                 { action: 'Đăng ký dự án đầu tư xây dựng NOXH', agency: 'Chủ đầu tư', date: '10/03/2024', status: 'Hoàn thành' },
                 { action: 'Khởi tạo hồ sơ dự án trên hệ thống', agency: 'Admin', date: '01/03/2024', status: 'Hoàn thành' }
               ].map((item, i) => (
                 <div key={i} className="relative pl-10 opacity-70 hover:opacity-100 transition-opacity">
                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-emerald-100 border-4 border-white shadow-sm flex items-center justify-center z-10 transition-transform group-hover:scale-110">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 italic transition-all">
                       <div className="flex items-center justify-between gap-4">
                          <div>
                             <p className="text-sm font-bold text-slate-700 leading-tight">{item.action}</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{item.agency}</p>
                          </div>
                          <div className="text-right shrink-0">
                             <p className="text-[10px] font-bold text-slate-500">{item.date}</p>
                          </div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </section>
        </div>

        {/* --- Actual Progress Modal --- */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
                <div className="space-y-0.5">
                  <h3 className="text-lg font-black text-slate-900 leading-tight">Cập nhật tiến độ</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mốc: {currentPhase?.name}</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                 <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-600">
                        <Building2 size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">TIẾN ĐỘ CĐT</span>
                      </div>
                      <div className="relative">
                        <input 
                          type="date" 
                          value={tempCdtDate}
                          onChange={(e) => setTempCdtDate(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                        />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <div className="flex items-center gap-2 text-emerald-600">
                        <Maximize2 size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">TIẾN ĐỘ NN</span>
                      </div>
                      <div className="relative">
                        <input 
                          type="date" 
                          value={tempNnDate}
                          onChange={(e) => setTempNnDate(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                        />
                      </div>
                   </div>
                 </div>
              </div>

              <div className="px-6 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 text-xs font-black rounded-2xl hover:bg-slate-50 transition-colors uppercase tracking-widest">Hủy</button>
                <button onClick={handleSaveProgress} className="px-6 py-3 bg-blue-600 text-white text-xs font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2 uppercase tracking-widest">
                  <Save size={16} />
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div className="flex items-center justify-center h-full text-slate-400">Đang tải dữ liệu...</div>;

  return (
    <div className="h-full w-full max-w-7xl mx-auto bg-slate-100 shadow-2xl overflow-hidden relative sm:border-x border-slate-200">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {view === 'overview' && <Overview />}
          {view === 'agencies' && <AgenciesStats />}
          {view === 'steps' && <StepsStats />}
          {view === 'child-steps' && <ChildStepsStats />}
          {view === 'search-results' && <SearchResults />}
          {view === 'departments' && <DepartmentStats />}
          {view === 'projects' && <ProjectList />}
          {view === 'detail' && <ProjectDetail />}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 z-30">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <button 
            onClick={goToOverview}
            className={`flex flex-col items-center gap-1 ${view === 'overview' ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <LayoutDashboard size={24} />
            <span className="text-xs font-bold">Trang chủ</span>
          </button>
          <button 
            onClick={() => {
              if (view !== 'search-results') {
                setSearchQuery('');
                navigateTo('search-results');
              }
            }}
            className={`flex flex-col items-center gap-1 ${view === 'search-results' ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <Search size={24} />
            <span className="text-xs font-bold">Tìm kiếm</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400">
            <Bell size={24} />
            <span className="text-xs font-bold">Thông báo</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400">
            <User size={24} />
            <span className="text-xs font-bold">Cá nhân</span>
          </button>
        </div>
      </div>
    </div>
  );
}
