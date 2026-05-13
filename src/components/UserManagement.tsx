import React, { useState } from 'react';
import { 
  UserPlus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Save, 
  User, 
  Phone, 
  Mail, 
  Building2, 
  Briefcase,
  ShieldCheck,
  Building
} from 'lucide-react';
import { INITIAL_AGENCIES, INITIAL_INVESTORS } from '../data/appData';
import { UserAccount } from '../types';

interface UserManagementProps {
  users: UserAccount[];
  onUpdateUsers: (users: UserAccount[]) => void;
  roles: string[];
  preselectedInvestor?: string;
  onClearInvestor?: () => void;
}

export default function UserManagement({ users, onUpdateUsers, roles, preselectedInvestor, onClearInvestor }: UserManagementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUserType, setFilterUserType] = useState<string>('all');
  const [filterAgencyId, setFilterAgencyId] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('');
  const [filterInvestorId, setFilterInvestorId] = useState<string>('all');
  
  // Form state
  const [formData, setFormData] = useState<Partial<UserAccount>>({
    fullName: '',
    phone: '',
    email: '',
    username: '',
    password: '123456',
    userType: preselectedInvestor ? 'investor' : 'agency',
    agencyId: '',
    department: '',
    investorId: preselectedInvestor || '',
    roleId: roles[0] || ''
  });

  React.useEffect(() => {
    if (preselectedInvestor) {
      setIsModalOpen(true);
    }
  }, [preselectedInvestor]);

  const handleOpenModal = (user?: UserAccount) => {
    if (user) {
      setEditingUser(user);
      setFormData(user);
    } else {
      setEditingUser(null);
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        username: '',
        password: '123456',
        userType: preselectedInvestor ? 'investor' : 'agency',
        agencyId: '',
        department: '',
        investorId: preselectedInvestor || '',
        roleId: roles[0] || ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    if (onClearInvestor) {
      onClearInvestor();
    }
  };

  const handleSave = () => {
    if (!formData.fullName || !formData.email || !formData.username || !formData.password) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên, Email, Tên đăng nhập, Mật khẩu)');
      return;
    }

    if (editingUser) {
      const updatedUsers = users.map(u => u.id === editingUser.id ? { ...u, ...formData } as UserAccount : u);
      onUpdateUsers(updatedUsers);
    } else {
      const newUser: UserAccount = {
        ...formData,
        id: `u${Date.now()}`
      } as UserAccount;
      onUpdateUsers([...users, newUser]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      onUpdateUsers(users.filter(u => u.id !== id));
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.phone.includes(searchTerm);
    const matchesUserType = filterUserType === 'all' || u.userType === filterUserType;
    const matchesAgency = filterAgencyId === 'all' || u.agencyId === filterAgencyId;
    const matchesDepartment = !filterDepartment || u.department === filterDepartment;
    const matchesInvestor = filterInvestorId === 'all' || u.investorId === filterInvestorId;
    return matchesSearch && matchesUserType && matchesAgency && matchesDepartment && matchesInvestor;
  });

  const selectedAgency = INITIAL_AGENCIES.find(a => a.id === formData.agencyId);
  const isSoXayDung = selectedAgency?.name === 'Sở Xây dựng';

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý tài khoản</h1>
          <p className="text-slate-500">Quản lý danh sách người dùng và phân quyền trong hệ thống</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <UserPlus size={20} />
          Thêm tài khoản
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            value={filterUserType}
            onChange={(e) => setFilterUserType(e.target.value)}
          >
            <option value="all">Tất cả loại tài khoản</option>
            <option value="agency">Cơ quan nhà nước</option>
            <option value="investor">Chủ đầu tư</option>
          </select>
          {filterUserType === 'all' || filterUserType === 'agency' ? (
            <select
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={filterAgencyId + '|' + (filterDepartment || '')}
              onChange={(e) => {
                const [agencyId, department] = e.target.value.split('|');
                setFilterAgencyId(agencyId);
                setFilterDepartment(department || '');
              }}
            >
              <option value="all|">Tất cả cơ quan/phòng ban</option>
              {INITIAL_AGENCIES.map(a => (
                <optgroup key={a.id} label={a.name}>
                  <option value={`${a.id}|`}>{a.name}</option>
                  {a.departments.map(d => (
                    <option key={d} value={`${a.id}|${d}`}>{d}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          ) : null}
          {filterUserType === 'all' || filterUserType === 'investor' ? (
            <select
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={filterInvestorId}
              onChange={(e) => setFilterInvestorId(e.target.value)}
            >
              <option value="all">Tất cả chủ đầu tư</option>
              {INITIAL_INVESTORS.map(i => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          ) : null}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Họ tên</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Liên hệ</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Loại tài khoản</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Vai trò</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Đơn vị / Phòng ban</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-900">{user.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-sm">
                      <span className="text-slate-600 flex items-center gap-1"><Mail size={14} /> {user.email}</span>
                      <span className="text-slate-400 flex items-center gap-1"><Phone size={14} /> {user.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-sm font-bold ${
                      user.userType === 'agency' 
                        ? 'text-emerald-700' 
                        : 'text-orange-700'
                    }`}>
                      {user.userType === 'agency' ? <ShieldCheck size={16} /> : <Building size={16} />}
                      {user.userType === 'agency' ? 'Cơ quan nhà nước' : 'Chủ đầu tư'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-700">{user.roleId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-sm">
                      {user.userType === 'agency' ? (
                        <>
                          <span className="font-medium text-slate-700">{INITIAL_AGENCIES.find(a => a.id === user.agencyId)?.name}</span>
                          <span className="text-slate-400 text-xs">{user.department}</span>
                        </>
                      ) : (
                        <span className="font-medium text-slate-700">{user.investorId}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                    Không tìm thấy tài khoản nào...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingUser ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}
                </h2>
                <p className="text-sm text-slate-500">Điền thông tin chi tiết người dùng</p>
              </div>
              <button onClick={handleCloseModal} className="p-2 hover:bg-white rounded-full transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <User size={16} className="text-blue-500" /> Họ tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Nhập họ và tên"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <User size={16} className="text-blue-500" /> Tên đăng nhập <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Nhập tên đăng nhập"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-blue-500" /> Mật khẩu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Phone size={16} className="text-blue-500" /> Số điện thoại
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Nhập số điện thoại"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-blue-500" /> Vai trò <span className="text-rose-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    value={formData.roleId}
                    onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                  >
                    {roles.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Mail size={16} className="text-blue-500" /> Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="example@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700">Loại tài khoản</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="userType"
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      checked={formData.userType === 'agency'}
                      onChange={() => setFormData({ ...formData, userType: 'agency', investorId: '' })}
                    />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Cơ quan nhà nước</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="userType"
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      checked={formData.userType === 'investor'}
                      onChange={() => setFormData({ ...formData, userType: 'investor', agencyId: '', department: '' })}
                    />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Chủ đầu tư</span>
                  </label>
                </div>
              </div>

              {formData.userType === 'agency' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Building2 size={16} className="text-blue-500" /> Cơ quan xử lý
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      value={formData.agencyId + '|' + (formData.department || '')}
                      onChange={(e) => {
                        const [agencyId, department] = e.target.value.split('|');
                        setFormData({ ...formData, agencyId, department: department || '' });
                      }}
                    >
                      <option value="|">Chọn cơ quan/phòng ban</option>
                      {INITIAL_AGENCIES.map(a => (
                        <optgroup key={a.id} label={a.name}>
                          <option value={`${a.id}|`}>{a.name}</option>
                          {a.departments.map(d => (
                            <option key={d} value={`${a.id}|${d}`}>{d}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Building2 size={16} className="text-blue-500" /> Chủ đầu tư
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      value={formData.investorId}
                      onChange={(e) => setFormData({ ...formData, investorId: e.target.value })}
                    >
                      <option value="">Chọn chủ đầu tư</option>
                      {INITIAL_INVESTORS.map(i => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-white rounded-xl transition-all"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                <Save size={18} />
                Lưu tài khoản
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
