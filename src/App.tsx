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

const INITIAL_PROCESSES: Process[] = [
  {
    id: 'p1',
    name: 'Quy trình vốn ĐTC',
    parentSteps: [
      {
        id: 'ps1',
        name: 'Chuẩn bị đầu tư',
        slaDays: 45,
        childSteps: [
          { id: 'cs1', name: 'Giao nhiệm vụ chuẩn bị đầu tư', agency: 'Sở Xây dựng', slaDays: 15 },
          { id: 'cs2', name: 'Thẩm định nhiệm vụ', agency: 'Sở Tài chính', slaDays: 30 }
        ]
      }
    ]
  },
  {
    id: 'p2',
    name: 'Quy trình vốn ngoài ĐTC',
    parentSteps: [
      {
        id: 'ps2',
        name: 'Chấp thuận chủ trương đầu tư',
        slaDays: 30,
        childSteps: [
          { id: 'cs3', name: 'Lấy ý kiến các sở ngành', agency: 'Sở Kế hoạch và Đầu tư', slaDays: 20 },
          { id: 'cs4', name: 'Tổng hợp báo cáo UBND TP', agency: 'Sở Kế hoạch và Đầu tư', slaDays: 10 }
        ]
      }
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projectToUpdate, setProjectToUpdate] = useState<any>(null);
  const [projectToEdit, setProjectToEdit] = useState<any>(null);
  const [projectToUpdatePlan, setProjectToUpdatePlan] = useState<any>(null);
  const [housingUpdateProject, setHousingUpdateProject] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [projectFilter, setProjectFilter] = useState<any>(null);
  const [investors, setInvestors] = useState([
    'Ban Quản lý dự án đầu tư xây dựng các công trình dân dụng và công nghiệp',
    'Công ty CP Tập đoàn Khải Thịnh',
    'Công ty CP Pearl Land',
    'Công ty TNHH Xây dựng Thương mại Lê Thành',
    'Cty TNHH Phúc Lộc Thọ',
    'Tổng Công ty Đầu tư Phát triển nhà và Đô thị (HUD)',
    'Tổng công ty Đầu tư và Phát triển Công nghiệp - CTCP',
    'Công ty TNHH Sản xuất và Thương mại Phúc Đạt',
    'Công ty TNHH Đầu tư Xây dựng Thạnh Tân',
    'Công ty CP ĐTXD Xuân Mai Sài Gòn',
    'Cty CP SX KD XNK DV & ĐT Tân Bình Tanimex',
    'Công ty Cổ phần An Cư Đức Phú',
    'Công ty Cổ phần Bất động sản Nhà Bè',
    'Cty TNHH XD TM Hoàng Nam',
    'Cty CP Địa ốc Thảo Điền',
    'Cty CPXD & KD Địa ốc Hòa Bình',
    'Công ty Cổ phần Bất động sản Tiến Phước',
    'Công ty TNHH Đầu tư và phát triển đô thị Vũng Tàu',
    'Công ty Hodeco',
    'Công ty TNHH Xây dựng và Kinh doanh nhà Điền Phúc Thành',
    'Công ty Cổ phần Bất động sản Dragon Village',
    'Cty CP BĐS Exim',
    'Công ty CP Phát triển Thành phố Xanh',
    'Công ty TNHH MTV Phát triển Công nghiệp Tân Thuận (IPC)',
    'Công ty TNHH MTV Đầu tư Kinh doanh nhà Khang Phúc',
    'Công ty Cổ phần Đầu tư địa ốc Vạn Phúc',
    'Công ty IDICO',
    'Công ty TNHH MTV Đầu tư và Phát triển Đô thị',
    'Công ty Cổ phần Đầu tư Tân Tạo',
    'Công ty Cổ phần Đầu tư Kinh doanh Nhà'
  ]);
  const [projectGroups, setProjectGroups] = useState(['Phụ lục 01', 'Phụ lục 02', 'Phụ lục 03']);
  const [projectStatuses, setProjectStatuses] = useState(['Đúng tiến độ', 'Trễ', 'Hoàn thành']);
  const [projectStages, setProjectStages] = useState(['Chuẩn bị đầu tư', 'Thực hiện đầu tư', 'Kết thúc đầu tư', 'Hoàn thành']);
  const [projectSteps, setProjectSteps] = useState([
    'Chấp thuận chủ trương đầu tư',
    'Quy hoạch chi tiết 1/500',
    'Quyết định đầu tư',
    'Giao đất / Cho thuê đất',
    'Thẩm định thiết kế cơ sở',
    'Giấy phép xây dựng',
    'Thi công xây dựng',
    'Nghiệm thu / Bàn giao'
  ]);
  const [processingAgencies, setProcessingAgencies] = useState<Agency[]>([
    { id: '1', name: 'Sở Xây dựng', departments: ['Phòng Phát triển nhà và Thị trường BĐS', 'Phòng Quản lý nhà và Công sở', 'Phòng Thẩm định dự án'] },
    { id: '2', name: 'Sở Quy hoạch Kiến trúc', departments: ['Phòng Quản lý quy hoạch chung', 'Phòng Quản lý quy hoạch phân khu', 'Phòng Pháp chế'] },
    { id: '3', name: 'Sở NNMT', departments: ['Phòng Quy hoạch - Kế hoạch sử dụng đất', 'Phòng Kinh tế đất', 'Chi cục Quản lý đất đai'] },
    { id: '4', name: 'Sở Kế hoạch và Đầu tư', departments: ['Phòng Đăng ký kinh doanh', 'Phòng Đầu tư', 'Phòng Đấu thầu, Thẩm định và Giám sát đầu tư'] },
    { id: '5', name: 'Sở Tài chính', departments: ['Phòng Ngân sách', 'Phòng Quản lý giá', 'Phòng Tài chính đầu tư'] },
    { id: '8', name: 'UBND TP', departments: ['Văn phòng UBND TP', 'Phòng Nội chính', 'Phòng Kinh tế'] },
    { id: '9', name: 'HĐND TP', departments: ['Ban Kinh tế - Ngân sách', 'Ban Đô thị', 'Ban Pháp chế'] },
    { id: '10', name: 'Công an TP (PCCC)', departments: ['Phòng Cảnh sát PCCC & CNCH', 'Đội Thẩm duyệt'] },
    { id: '11', name: '168 Phường xã', departments: ['Phường An Lạc', 'Phường Hiệp Phú', 'Xã Hiệp Phước', 'Phường Long Trường', 'Phường Tân Thuận Tây', 'Xã Tân Kiên'] }
  ]);
  const [fundingSources, setFundingSources] = useState(['Vốn ngân sách', 'Vốn doanh nghiệp', 'Vốn vay', 'Nguồn tài chính công đoàn']);
  const [stepStatuses, setStepStatuses] = useState(['Chưa bắt đầu', 'Đang xử lý', 'Chờ bổ sung hồ sơ', 'Đã trình', 'Đã phê duyệt', 'Hoàn thành', 'Bị trả hồ sơ', 'Tạm dừng']);
  const [priorities, setPriorities] = useState(['Thấp', 'Trung bình', 'Cao', 'Khẩn cấp']);
  const [processingResults, setProcessingResults] = useState(['Chưa có kết quả', 'Chấp thuận', 'Có ý kiến', 'Phê duyệt', 'Không chấp thuận', 'Yêu cầu bổ sung']);
  const [locations, setLocations] = useState<{ ward: string, oldArea: string }[]>([
    { ward: 'Phường An Lạc', oldArea: 'TP.HCM' },
    { ward: 'Phường Hiệp Phú', oldArea: 'TP.HCM' },
    { ward: 'Xã Hiệp Phước', oldArea: 'TP.HCM' },
    { ward: 'Phường Long Trường', oldArea: 'TP.HCM' },
    { ward: 'Phường Tân Thuận Tây', oldArea: 'TP.HCM' },
    { ward: 'Xã Tân Kiên', oldArea: 'TP.HCM' }
  ]);
  const [reportDate, setReportDate] = useState('31/12/2026');
  const [processes, setProcesses] = useState<Process[]>(INITIAL_PROCESSES);
  const [followers, setFollowers] = useState(['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C']);

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    setProjectToEdit(null);
    setProjectFilter(null);
    setActiveTab('projects');
    setRefreshKey(prev => prev + 1);
  };

  const handleUpdateSuccess = () => {
    setProjectToUpdate(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleEditProject = (project: any) => {
    setProjectToEdit(project);
    setShowCreateModal(true);
  };

  const handleDeleteProject = async (project: any) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa dự án "${project.name}"?`)) {
      try {
        const res = await fetch(`/api/v1/projects/${project.id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          setRefreshKey(prev => prev + 1);
        }
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleNavigateToProjects = (filter?: any) => {
    setProjectFilter(filter || null);
    setActiveTab('projects');
  };

  const handleNavigateToHousingUpdate = (project: any) => {
    setHousingUpdateProject(project);
    setActiveTab('housing-update');
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'projects') {
      setProjectFilter(null);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar activeTab={activeTab} onNavigate={handleNavigate} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 lg:hidden">
              <Menu size={20} />
            </button>
            <div className="relative group hidden sm:block">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Tìm kiếm nhanh..." 
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

        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' && (
            <DashboardView 
              onCreateClick={() => setShowCreateModal(true)} 
              onNavigateToProjects={handleNavigateToProjects}
              processingAgencies={processingAgencies}
            />
          )}
          {activeTab === 'dashboard-app' && <DashboardApp processingAgencies={processingAgencies} />}
          {activeTab === 'projects' && (
            <ProjectList 
              key={refreshKey} 
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
              processes={processes}
              projectGroups={projectGroups}
              fundingSources={fundingSources}
              followers={followers}
            />
          )}
          {activeTab === 'gis' && <GISView />}
          {activeTab === 'gantt' && <GanttView />}
          {activeTab === 'gantt-dashboard-noxh' && (
            <GanttDashboardNOXH 
              reportDate={reportDate} 
              projectStatuses={projectStatuses}
              projectStages={projectStages}
            />
          )}
          {activeTab === 'process-gantt' && <ProcessGanttView />}
          {activeTab === 'annual-update' && <AnnualProgressUpdate reportDate={reportDate} setReportDate={setReportDate} />}
          {activeTab === 'agency-project-stats' && <AgencyProjectStats processingAgencies={processingAgencies} />}
          {activeTab === 'tasks' && <TasksView />}
          {activeTab === 'housing-update' && (
            <HousingUpdateView 
              project={housingUpdateProject} 
              onBack={() => setActiveTab('projects')}
              stepStatuses={stepStatuses}
              priorities={priorities}
              processingResults={processingResults}
              processes={processes}
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
          {activeTab === 'step-management' && <StepManagementView processingAgencies={processingAgencies} processes={processes} setProcesses={setProcesses} />}
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
            onSuccess={() => {
              setProjectToUpdatePlan(null);
              setRefreshKey(prev => prev + 1);
            }}
          />
        )}
      </div>
    </div>
  );
}
