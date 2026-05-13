import React from 'react';
import { 
  LayoutDashboard, Building2, GitBranch, FileText, 
  BarChart3, Settings, LogOut, Search, Bell, Menu, Clock, Layers, User, ShieldCheck
} from 'lucide-react';
import { UserAccount } from '../types';

interface SidebarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  currentUser: UserAccount;
  onLogout: () => void;
}

const menuItems = [
  { group: 'ĐIỀU HÀNH', items: [
    { id: 'dashboard', name: 'Tổng quan', icon: LayoutDashboard },
    { id: 'dashboard-app', name: 'Dashboard App', icon: LayoutDashboard },
  ]},
  { group: 'QUẢN LÝ TIẾN ĐỘ DA HIỆN TẠI', items: [
    { id: 'gantt-dashboard-noxh', name: 'Sơ đồ Gantt dự án NOXH', icon: BarChart3 },
    { id: 'annual-update', name: 'Cập nhật tiến độ năm', icon: Clock },
  ]},
  { group: 'QUẢN LÝ', items: [
    { id: 'projects', name: 'Danh sách dự án', icon: Building2 },
    { id: 'process-gantt', name: 'Sơ đồ Gantt quy trình', icon: GitBranch },
  ]},
  { group: 'HỆ THỐNG', items: [
    { id: 'step-management', name: 'Danh mục quy trình', icon: Layers },
    { id: 'investor-management', name: 'Danh mục CĐT', icon: Building2 },
    { id: 'project-group-management', name: 'Nhóm dự án', icon: Building2 },
    { id: 'project-category-management', name: 'Phân loại dự án', icon: Building2 },
    { id: 'building-grade-management', name: 'Cấp công trình', icon: Building2 },
    { id: 'project-status-management', name: 'Trạng thái dự án', icon: Settings },
    { id: 'project-stage-management', name: 'Giai đoạn dự án', icon: Settings },
    { id: 'agency-management', name: 'Cơ quan xử lý', icon: Settings },
    { id: 'funding-source-management', name: 'Nguồn vốn', icon: Building2 },
    { id: 'step-status-management', name: 'Trạng thái bước', icon: Settings },
    { id: 'priority-management', name: 'Mức độ ưu tiên', icon: Settings },
    { id: 'result-management', name: 'Kết quả xử lý', icon: Settings },    
    { id: 'follower-management', name: 'Danh mục người theo dõi', icon: User },
    { id: 'location-management', name: 'Danh mục Địa điểm', icon: Search },
    { id: 'user-management', name: 'Quản lý tài khoản', icon: User },
    { id: 'role-management', name: 'Danh mục vai trò', icon: ShieldCheck },
  ]}
];

export default function Sidebar({ activeTab, onNavigate, currentUser, onLogout }: SidebarProps) {
  const filterItemsByRole = (group: any) => {
    if (currentUser.roleId !== 'Admin') {
      return group.items.filter((item: any) => item.id !== 'dashboard-tphcm');
    }
    return group.items;
  };

  const filteredMenuItems = menuItems.map(group => ({
    ...group,
    items: filterItemsByRole(group)
  })).filter(group => {
    if (currentUser.roleId === 'Admin') return true;
    return group.group !== 'HỆ THỐNG';
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

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
        {filteredMenuItems.map((group) => (
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
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

    </div>
  );
}
