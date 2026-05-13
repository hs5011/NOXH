import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/Dashboard';
import DashboardApp from './components/DashboardApp';
import DashboardTPHCM from './components/DashboardTPHCM';
import TPHCMProjectList from './components/TPHCMProjectList';
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
import UserManagement from './components/UserManagement';
import StepManagementView, { Process } from './components/StepManagementView';
import ProjectGanttDetail from './components/ProjectGanttDetail';
import Login from './components/Login';
import { UserAccount } from './types';
import { Bell, Search, User, Menu, Settings, LogOut } from 'lucide-react';

import { 
  INITIAL_PROJECTS, 
  INITIAL_INVESTORS, 
  INITIAL_PROJECT_GROUPS, 
  INITIAL_PROJECT_CATEGORIES,
  INITIAL_BUILDING_GRADES,
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
  INITIAL_FOLLOWERS,
  INITIAL_USERS,
  INITIAL_ROLES
} from './data/appData';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedGanttProject, setSelectedGanttProject] = useState<any>(null);
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
  const [projectCategories, setProjectCategories] = useState(INITIAL_PROJECT_CATEGORIES);
  const [buildingGrades, setBuildingGrades] = useState(INITIAL_BUILDING_GRADES);
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
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [globalSearch, setGlobalSearch] = useState('');
  const [preselectedInvestor, setPreselectedInvestor] = useState<string | undefined>(undefined);
  const [tphcmListTitle, setTphcmListTitle] = useState('');
  const [tphcmListProjects, setTphcmListProjects] = useState<any[]>([]);
  const [ganttBackTab, setGanttBackTab] = useState('gantt-dashboard-noxh');

  const stepToAgencyMap = useMemo(() => {
    const map: Record<string, string> = {};
    processes.forEach(process => {
      process.parentSteps.forEach(ps => {
        ps.childSteps.forEach(cs => {
          map[cs.name] = cs.agency;
        });
      });
    });
    return map;
  }, [processes]);

  const visibleProjects = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.roleId === 'Admin') return projects;
    
    // Determine user's identity name
    let userAgencyName = '';
    if (currentUser.userType === 'agency') {
      const agency = processingAgencies.find(a => a.id === currentUser.agencyId);
      userAgencyName = agency?.name || '';
    } else if (currentUser.userType === 'investor') {
      userAgencyName = 'Chủ đầu tư';
    }

    // Lead agency (Sở Xây dựng) might see all, but let's check user requirement
    // Requirement: "nếu bước hiện tại là thuộc sở nào hay cdt nào thì hiện dự án tương ứng"
    // We strictly filter by current step's agency matching user's agency name
    
    return projects.filter(p => {
      const stepAgency = stepToAgencyMap[p.currentStep];
      
      // Admin hoặc Sở Xây dựng (ID '1') xem được tất cả dự án
      if (currentUser.roleId === 'Admin' || (currentUser.userType === 'agency' && currentUser.agencyId === '1')) {
        return true;
      }

      // Đối với các cơ quan NN khác, chỉ thấy dự án đang ở bước của mình
      if (currentUser.userType === 'agency') {
        const agency = processingAgencies.find(a => a.id === currentUser.agencyId);
        const userAgencyName = agency?.name || '';
        return stepAgency === userAgencyName;
      }
      
      // Đối với Chủ đầu tư, thấy dự án của mình
      if (currentUser.userType === 'investor') {
        return p.investor === currentUser.investorId;
      }
      
      return false;
    });
  }, [projects, currentUser, processingAgencies, stepToAgencyMap]);

  const visibleAgencies = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.roleId === 'Admin') return processingAgencies;
    if (currentUser.userType === 'agency' && currentUser.agencyId === '1') return processingAgencies; // Sở Xây dựng
    
    if (currentUser.userType === 'agency') {
      return processingAgencies.filter(a => a.id === currentUser.agencyId);
    }
    
    if (currentUser.userType === 'investor') {
      return processingAgencies;
    }
    
    return processingAgencies;
  }, [processingAgencies, currentUser]);

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
    if (filter?.view === 'all-progress') {
      setActiveTab('process-gantt');
      return;
    }
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
    if (tab !== 'user-management') {
      setPreselectedInvestor(undefined);
    }
  };

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden relative">
      <div className={`fixed inset-0 bg-slate-900/50 z-40 lg:hidden transition-opacity ${activeTab === 'sidebar-open' ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setActiveTab('dashboard')} />
      
      <div className={`fixed lg:static inset-y-0 left-0 z-50 transform lg:transform-none transition-transform duration-300 ${activeTab === 'sidebar-open' ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar 
          activeTab={activeTab === 'sidebar-open' ? 'dashboard' : activeTab} 
          onNavigate={(tab) => { setActiveTab(tab); }} 
          currentUser={currentUser}
          onLogout={() => setCurrentUser(null)}
        />
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
                <p className="text-xs font-bold">{currentUser.fullName}</p>
                <p className="text-[10px] text-slate-400 font-medium">{currentUser.roleId}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                <User size={20} />
              </div>
            </div>
            <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>
            <button 
              onClick={() => setCurrentUser(null)}
              className="p-2 hover:bg-rose-50 rounded-lg text-slate-500 hover:text-rose-600 transition-colors group relative"
              title="Thoát"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <main className={`flex-1 overflow-y-auto ${(activeTab === 'dashboard-app' || activeTab === 'agency-project-stats') ? 'p-0' : 'p-4 sm:p-8'}`}>
          {activeTab === 'dashboard' && (
            <DashboardView 
              projects={visibleProjects}
              onCreateClick={() => setShowCreateModal(true)} 
              onNavigateToProjects={handleNavigateToProjects}
              onProjectClick={(project: any) => {
                setSelectedGanttProject(project);
                setActiveTab('gantt-project-detail');
                setGanttBackTab('dashboard');
              }}
              processingAgencies={processingAgencies}
              projectStages={projectStages}
              processes={processes}
              currentUser={currentUser}
              onSeeProjects={(title: string, projects: any[]) => {
                setTphcmListTitle(title);
                setTphcmListProjects(projects);
                setActiveTab('dashboard-tphcm-list');
              }}
            />
          )}
          {activeTab === 'dashboard-app' && (
            <DashboardApp 
              projects={visibleProjects}
              processingAgencies={visibleAgencies} 
              investors={investors}
              projectStages={projectStages}
              locations={locations}
              currentUser={currentUser}
            />
          )}
          {activeTab === 'dashboard-tphcm-list' && (
            <TPHCMProjectList 
              title={tphcmListTitle}
              projects={tphcmListProjects}
              onBack={() => setActiveTab('dashboard')}
              onProjectClick={(project: any) => {
                setSelectedGanttProject(project);
                setActiveTab('gantt-project-detail');
                setGanttBackTab('dashboard-tphcm-list');
              }}
            />
          )}
          {activeTab === 'projects' && (
            <ProjectList 
              key={refreshKey} 
              projects={visibleProjects}
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
          {activeTab === 'gantt' && <GanttView projects={visibleProjects} />}
          {activeTab === 'gantt-dashboard-noxh' && (
            <GanttDashboardNOXH 
              projects={visibleProjects}
              reportDate={reportDate} 
              projectStatuses={projectStatuses}
              projectStages={projectStages}
              onProjectClick={(project) => {
                setSelectedGanttProject(project);
                setActiveTab('gantt-project-detail');
                setGanttBackTab('gantt-dashboard-noxh');
              }}
            />
          )}
          {activeTab === 'gantt-project-detail' && (
            <ProjectGanttDetail 
              project={selectedGanttProject}
              onBack={() => setActiveTab(ganttBackTab)}
            />
          )}
          {activeTab === 'process-gantt' && <ProcessGanttView projects={visibleProjects} />}
          {activeTab === 'annual-update' && <AnnualProgressUpdate projects={visibleProjects} reportDate={reportDate} setReportDate={setReportDate} />}
          {activeTab === 'agency-project-stats' && (
            <AgencyProjectStats 
              projects={visibleProjects} 
              processingAgencies={visibleAgencies} 
              projectStages={projectStages}
              locations={locations}
              investors={investors}
              projectSteps={projectSteps}
              onProjectClick={(project: any) => {
                setSelectedGanttProject(project);
                setActiveTab('gantt-project-detail');
                setGanttBackTab('agency-project-stats');
              }}
              currentUser={currentUser}
            />
          )}
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
          {activeTab === 'investor-management' && (
            <ListManagement 
              items={investors} 
              setItems={setInvestors} 
              title="Chủ đầu tư" 
              onAddUser={(investor) => {
                setPreselectedInvestor(investor);
                setActiveTab('user-management');
              }}
            />
          )}
          {activeTab === 'building-grade-management' && (
            <ListManagement 
              items={buildingGrades} 
              setItems={setBuildingGrades} 
              title="Cấp công trình" 
            />
          )}
          {activeTab === 'project-category-management' && (
            <ListManagement 
              items={projectCategories} 
              setItems={setProjectCategories} 
              title="Phân loại dự án" 
            />
          )}
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
          {activeTab === 'user-management' && (
            <UserManagement 
              users={users} 
              onUpdateUsers={setUsers} 
              roles={roles} 
              preselectedInvestor={preselectedInvestor}
              onClearInvestor={() => setPreselectedInvestor(undefined)}
            />
          )}
          {activeTab === 'role-management' && <ListManagement items={roles} setItems={setRoles} title="Danh mục vai trò" />}
          
          {!['dashboard', 'dashboard-app', 'dashboard-tphcm-list', 'projects', 'gis', 'gantt', 'gantt-dashboard-noxh', 'gantt-project-detail', 'process-gantt', 'annual-update', 'agency-project-stats', 'tasks', 'documents', 'kpi', 'settings', 'investor-management', 'building-grade-management', 'project-category-management', 'project-group-management', 'project-status-management', 'project-stage-management', 'funding-source-management', 'location-management', 'housing-update', 'step-status-management', 'priority-management', 'result-management', 'step-management', 'agency-management', 'project-step-management', 'user-management', 'role-management', 'sidebar-open'].includes(activeTab) && (
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
            projectCategories={projectCategories}
            buildingGrades={buildingGrades}
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
