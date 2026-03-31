import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/Dashboard';
import DashboardApp from './components/DashboardApp';
import ProjectList from './components/ProjectList';
import CreateProject from './components/CreateProject';
import ProjectDetail from './components/ProjectDetail';
import GISView from './components/GISView';
import GanttView from './components/GanttView';
import TasksView from './components/TasksView';
import DocumentsView from './components/DocumentsView';
import KPIView from './components/KPIView';
import SettingsView from './components/SettingsView';
import ProcessGanttView from './components/ProcessGanttView';
import GanttDashboardNOXH from './components/GanttDashboardNOXH';
import UpdateProgress from './components/UpdateProgress';
import UpdatePlanModal from './components/UpdatePlanModal';
import HousingUpdateView from './components/HousingUpdateView';
import ListManagement from './components/ListManagement';
import LocationManagement from './components/LocationManagement';
import AgencyManagement, { Agency } from './components/AgencyManagement';
import ProjectGroupManagement from './components/ProjectGroupManagement';
import FundingSourceManagement from './components/FundingSourceManagement';
import AnnualProgressUpdate from './components/AnnualProgressUpdate';
import AgencyProjectStats from './components/AgencyProjectStats';
import StepManagementView, { Process } from './components/StepManagementView';
import { Bell, Search, User, Menu, Settings } from 'lucide-react';

import { 
  INITIAL_PROJECTS, 
  INITIAL_INVESTORS, 
  INITIAL_PROJECT_GROUPS, 
  INITIAL_PROJECT_STATUSES, 
  INITIAL_PROJECT_STAGES, 
  INITIAL_PROJECT_STEPS, 
  INITIAL_AGENCIES, 
  INITIAL_FUNDING_SOURCES, 
  INITIAL_STEP_STATUSES, 
  INITIAL_PRIORITIES, 
  INITIAL_PROCESSING_RESULTS, 
  INITIAL_LOCATIONS, 
  INITIAL_PROCESSES, 
  INITIAL_FOLLOWERS 
} from './data/appData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projectToUpdate, setProjectToUpdate] = useState<any>(null);
  const [projectToEdit, setProjectToEdit] = useState<any>(null);
  const [projectToUpdatePlan, setProjectToUpdatePlan] = useState<any>(null);
  const [housingUpdateProject, setHousingUpdateProject] = useState<any>(null);
  const [initialStepId, setInitialStepId] = useState<string | undefined>(undefined);
  const [initialSubStepId, setInitialSubStepId] = useState<string | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0);
  const [projectFilter, setProjectFilter] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>(INITIAL_PROJECTS);
  const [investors, setInvestors] = useState(INITIAL_INVESTORS);
  const [projectGroups, setProjectGroups] = useState(INITIAL_PROJECT_GROUPS);
  const [projectStatuses, setProjectStatuses] = useState(INITIAL_PROJECT_STATUSES);
  const [projectStages, setProjectStages] = useState(INITIAL_PROJECT_STAGES);
  const [projectSteps, setProjectSteps] = useState(INITIAL_PROJECT_STEPS);
  const [processingAgencies, setProcessingAgencies] = useState<Agency[]>(INITIAL_AGENCIES);
  const [fundingSources, setFundingSources] = useState(INITIAL_FUNDING_SOURCES);
  const [stepStatuses, setStepStatuses] = useState(INITIAL_STEP_STATUSES);
  const [priorities, setPriorities] = useState(INITIAL_PRIORITIES);
  const [processingResults, setProcessingResults] = useState(INITIAL_PROCESSING_RESULTS);
  const [locations, setLocations] = useState<{ ward: string, oldArea: string }[]>(INITIAL_LOCATIONS);
  const [reportDate, setReportDate] = useState('31/12/2026');
  const [processes, setProcesses] = useState<Process[]>(INITIAL_PROCESSES);
  const [followers, setFollowers] = useState(INITIAL_FOLLOWERS);
  const [globalSearch, setGlobalSearch] = useState('');

  const handleCreateSuccess = (newProject?: any) => {
    if (newProject) {
      if (projectToEdit) {
        setProjects(prev => prev.map(p => p.id === newProject.id ? newProject : p));
      } else {
        setProjects(prev => [...prev, { ...newProject, id: (prev.length + 1).toString() }]);
      }
    }
    setShowCreateModal(false);
    setProjectToEdit(null);
    setProjectFilter(null);
    setActiveTab('projects');
    setRefreshKey(prev => prev + 1);
  };

  const handleUpdateSuccess = (updatedProject: any) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    setHousingUpdateProject(updatedProject);
    setProjectToUpdate(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleEditProject = (project: any) => {
    setProjectToEdit(project);
    setShowCreateModal(true);
  };

  const handleDeleteProject = (project: any) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa dự án "${project.name}"?`)) {
      setProjects(prev => prev.filter(p => p.id !== project.id));
      setRefreshKey(prev => prev + 1);
    }
  };


  const handleNavigateToProjects = (filter?: any) => {
    setProjectFilter(filter || null);
    setActiveTab('projects');
  };

  const handleNavigateToHousingUpdate = (project: any, stepId?: string, subStepId?: string) => {
    setHousingUpdateProject(project);
    setInitialStepId(stepId);
    setInitialSubStepId(subStepId);
    setActiveTab('housing-update');
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'projects') {
      setProjectFilter(null);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden relative">
      <div className={`fixed inset-0 bg-slate-900/50 z-40 lg:hidden transition-opacity ${activeTab === 'sidebar-open' ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setActiveTab('dashboard')} />
      
      <div className={`fixed lg:static inset-y-0 left-0 z-50 transform lg:transform-none transition-transform duration-300 ${activeTab === 'sidebar-open' ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar activeTab={activeTab === 'sidebar-open' ? 'dashboard' : activeTab} onNavigate={(tab) => { setActiveTab(tab); }} />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('sidebar-open')}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="relative group hidden sm:block">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Tìm kiếm nhanh..." 
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleNavigateToProjects({ searchTerm: globalSearch });
                  }
                }}
                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm w-64 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-slate-100 rounded-lg text-slate-500">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold">Nguyễn Văn A</p>
                <p className="text-[10px] text-slate-400 font-medium">Lãnh đạo Sở</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        <main className={`flex-1 overflow-y-auto ${activeTab === 'dashboard-app' ? 'p-0' : 'p-4 sm:p-8'}`}>
          {activeTab === 'dashboard' && (
            <DashboardView 
              projects={projects}
              onCreateClick={() => setShowCreateModal(true)} 
              onNavigateToProjects={handleNavigateToProjects}
              processingAgencies={processingAgencies}
              projectStages={projectStages}
              processes={processes}
            />
          )}
          {activeTab === 'dashboard-app' && (
            <DashboardApp 
              projects={projects}
              processingAgencies={processingAgencies} 
              investors={investors}
              projectStages={projectStages}
              locations={locations}
            />
          )}
          {activeTab === 'projects' && (
            <ProjectList 
              key={refreshKey} 
              projects={projects}
              filter={projectFilter}
              onProjectClick={setSelectedProject} 
              onEditClick={handleEditProject}
              onDeleteClick={handleDeleteProject}
              onUpdateProgressClick={setProjectToUpdate}
              onUpdatePlanClick={setProjectToUpdatePlan}
              onHousingUpdateClick={handleNavigateToHousingUpdate}
              onCreateClick={() => setShowCreateModal(true)}
              projectStages={projectStages}
              projectSteps={projectSteps}
              processingAgencies={processingAgencies}
              locations={locations}
              investors={investors}
              processes={processes}
              projectGroups={projectGroups}
              fundingSources={fundingSources}
              followers={followers}
            />
          )}

          {activeTab === 'gis' && <GISView />}
          {activeTab === 'gantt' && <GanttView projects={projects} />}
          {activeTab === 'gantt-dashboard-noxh' && (
            <GanttDashboardNOXH 
              projects={projects}
              reportDate={reportDate} 
              projectStatuses={projectStatuses}
              projectStages={projectStages}
            />
          )}
          {activeTab === 'process-gantt' && <ProcessGanttView projects={projects} />}
          {activeTab === 'annual-update' && <AnnualProgressUpdate projects={projects} reportDate={reportDate} setReportDate={setReportDate} />}
          {activeTab === 'agency-project-stats' && <AgencyProjectStats projects={projects} processingAgencies={processingAgencies} />}
          {activeTab === 'tasks' && <TasksView />}
          {activeTab === 'housing-update' && (
            <HousingUpdateView 
              project={housingUpdateProject} 
              onBack={() => {
                setActiveTab('projects');
                setInitialStepId(undefined);
                setInitialSubStepId(undefined);
              }}
              onSuccess={handleUpdateSuccess}
              stepStatuses={stepStatuses}
              priorities={priorities}
              processingResults={processingResults}
              processes={processes}
              initialStepId={initialStepId}
              initialSubStepId={initialSubStepId}
            />
          )}
          {activeTab === 'documents' && <DocumentsView />}
          {activeTab === 'kpi' && <KPIView />}
          {activeTab === 'settings' && <SettingsView />}
          {activeTab === 'investor-management' && <ListManagement items={investors} setItems={setInvestors} title="Chủ đầu tư" />}
          {activeTab === 'project-group-management' && <ProjectGroupManagement projectGroups={projectGroups} setProjectGroups={setProjectGroups} />}
          {activeTab === 'project-status-management' && <ListManagement items={projectStatuses} setItems={setProjectStatuses} title="Trạng thái dự án" />}
          {activeTab === 'project-stage-management' && <ListManagement items={projectStages} setItems={setProjectStages} title="Giai đoạn dự án" />}
          {activeTab === 'project-step-management' && <ListManagement items={projectSteps} setItems={setProjectSteps} title="Danh mục bước" />}
          {activeTab === 'agency-management' && <AgencyManagement agencies={processingAgencies} setAgencies={setProcessingAgencies} />}
          {activeTab === 'funding-source-management' && <FundingSourceManagement fundingSources={fundingSources} setFundingSources={setFundingSources} />}
          {activeTab === 'step-status-management' && <ListManagement items={stepStatuses} setItems={setStepStatuses} title="Trạng thái bước" />}
          {activeTab === 'priority-management' && <ListManagement items={priorities} setItems={setPriorities} title="Mức độ ưu tiên" />}
          {activeTab === 'result-management' && <ListManagement items={processingResults} setItems={setProcessingResults} title="Kết quả xử lý" />}
          {activeTab === 'location-management' && <LocationManagement locations={locations} setLocations={setLocations} />}
          {activeTab === 'step-management' && <StepManagementView processingAgencies={processingAgencies} processes={processes} setProcesses={setProcesses} projectStages={projectStages} />}
          {activeTab === 'follower-management' && <ListManagement items={followers} setItems={setFollowers} title="Người theo dõi" />}
          
          {!['dashboard', 'dashboard-app', 'projects', 'gis', 'gantt', 'gantt-dashboard-noxh', 'process-gantt', 'annual-update', 'agency-project-stats', 'tasks', 'documents', 'kpi', 'settings', 'investor-management', 'project-group-management', 'project-status-management', 'project-stage-management', 'funding-source-management', 'location-management', 'housing-update', 'step-status-management', 'priority-management', 'result-management', 'step-management', 'agency-management', 'project-step-management'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                <Settings size={32} />
              </div>
              <p className="font-medium italic">Tính năng "{activeTab}" đang được phát triển...</p>
            </div>
          )}
        </main>

        {showCreateModal && (
          <CreateProject 
            project={projectToEdit}
            investors={investors}
            locations={locations}
            projectGroups={projectGroups}
            fundingSources={fundingSources}
            projectStages={projectStages}
            projectSteps={projectSteps}
            processingAgencies={processingAgencies}
            processes={processes}
            followers={followers}
            onClose={() => {
              setShowCreateModal(false);
              setProjectToEdit(null);
            }} 
            onSuccess={handleCreateSuccess} 
          />
        )}

        {selectedProject && (
          <ProjectDetail 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}

        {projectToUpdate && (
          <UpdateProgress
            project={projectToUpdate}
            onClose={() => setProjectToUpdate(null)}
            onSuccess={handleUpdateSuccess}
          />
        )}

        {projectToUpdatePlan && (
          <UpdatePlanModal
            project={projectToUpdatePlan}
            processes={processes}
            onClose={() => setProjectToUpdatePlan(null)}
            onSuccess={handleUpdateSuccess}
          />
        )}
      </div>
    </div>
  );
}
