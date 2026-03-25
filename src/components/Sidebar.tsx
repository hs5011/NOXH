import React from 'react';
import { 
  LayoutDashboard, Building2, GitBranch, FileText, 
  BarChart3, Settings, LogOut, Search, Bell, Menu, Clock, Layers, User
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
}

const menuItems = [
  { group: 'ĐIỀU HÀNH', items: [
    { id: 'dashboard', name: 'Tổng quan', icon: LayoutDashboard },
    { id: 'dashboard-app', name: 'Dashboard app', icon: LayoutDashboard },
    { id: 'gis', name: 'Bản đồ GIS', icon: Search },
  ]},
  { group: 'QUẢN LÝ TIẾN ĐỘ DA HIỆN TẠI', items: [
    { id: 'gantt-dashboard-noxh', name: 'Sơ đồ Gantt dự án NOXH', icon: BarChart3 },
    { id: 'annual-update', name: 'Cập nhật tiến độ năm', icon: Clock },
    { id: 'agency-project-stats', name: 'Thống kê DA theo cơ quan', icon: BarChart3 },
  ]},
  { group: 'QUẢN LÝ', items: [
    { id: 'projects', name: 'Danh sách dự án', icon: Building2 },
    { id: 'gantt', name: 'Sơ đồ Gantt dự án', icon: BarChart3 },
    { id: 'process-gantt', name: 'Sơ đồ Gantt quy trình', icon: GitBranch },
  ]},
  { group: 'NGHIỆP VỤ', items: [
    { id: 'tasks', name: 'Hồ sơ chờ xử lý', icon: GitBranch, badge: 5 },
    { id: 'documents', name: 'Kho hồ sơ số', icon: FileText },
  ]},
  { group: 'HỆ THỐNG', items: [
    { id: 'kpi', name: 'Báo cáo KPI', icon: BarChart3 },
    { id: 'investor-management', name: 'Danh mục CĐT', icon: Building2 },
    { id: 'project-group-management', name: 'Nhóm dự án', icon: Building2 },
    { id: 'project-status-management', name: 'Trạng thái dự án', icon: Settings },
    { id: 'project-stage-management', name: 'Giai đoạn dự án', icon: Settings },
    { id: 'agency-management', name: 'Cơ quan xử lý', icon: Settings },
    { id: 'funding-source-management', name: 'Nguồn vốn', icon: Building2 },
    { id: 'step-status-management', name: 'Trạng thái bước', icon: Settings },
    { id: 'priority-management', name: 'Mức độ ưu tiên', icon: Settings },
    { id: 'result-management', name: 'Kết quả xử lý', icon: Settings },
    { id: 'step-management', name: 'Danh mục quy trình', icon: Layers },
    { id: 'follower-management', name: 'Danh mục người theo dõi', icon: User },
    { id: 'location-management', name: 'Danh mục Địa điểm', icon: Search },
    { id: 'settings', name: 'Cấu hình', icon: Settings },
  ]}
];

export default function Sidebar({ activeTab, onNavigate }: SidebarProps) {
  return (
    <div className="w-72 h-screen bg-slate-900 text-slate-300 flex flex-col shrink-0">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
          H
        </div>
        <div>
          <h1 className="text-white font-bold text-base leading-tight">H-NOXH SXD</h1>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">TP. Hồ Chí Minh</p>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {menuItems.map((group) => (
          <div key={group.group}>
            <h3 className="text-sm font-bold text-slate-600 mb-2 px-2 uppercase tracking-widest">
              {group.group}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group ${
                    activeTab === item.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className={activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} />
                    <span className="text-base font-medium">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-sm font-bold px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-2 bg-slate-800/50 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-white truncate">Admin System</p>
            <p className="text-sm text-slate-500 truncate">Sở Xây dựng</p>
          </div>
          <LogOut size={14} className="text-slate-500 cursor-pointer hover:text-red-400" />
        </div>
      </div>
    </div>
  );
}
