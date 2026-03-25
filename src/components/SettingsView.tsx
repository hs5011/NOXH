import React from 'react';
import { User, Bell, Shield, Globe, Save, Camera } from 'lucide-react';

export default function SettingsView() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Cấu hình Hệ thống</h2>
        <p className="text-slate-500 text-base">Quản lý thông tin cá nhân và thiết lập ứng dụng</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-3xl bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-bold border-4 border-white shadow-lg">
                AD
              </div>
              <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-slate-600 hover:text-blue-600 transition-colors">
                <Camera size={20} />
              </button>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Admin System</h3>
              <p className="text-base text-slate-500">Quản trị viên cấp cao • Sở Xây dựng TP.HCM</p>
              <div className="flex gap-2 mt-3">
                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg uppercase">Verified</span>
                <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg uppercase">Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Họ và tên</label>
              <input type="text" defaultValue="Admin System" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Email công vụ</label>
              <input type="email" defaultValue="admin.sxd@tphcm.gov.vn" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Số điện thoại</label>
              <input type="text" defaultValue="028.3932.1234" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Ngôn ngữ</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base outline-none focus:ring-2 focus:ring-blue-500/20">
                <option>Tiếng Việt</option>
                <option>English</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Bell size={20} className="text-blue-500" />
              Thông báo & Bảo mật
            </h4>
            <div className="space-y-3">
              {[
                { label: 'Nhận thông báo hồ sơ mới qua Email', active: true },
                { label: 'Cảnh báo dự án quá hạn xử lý', active: true },
                { label: 'Xác thực 2 lớp (2FA) khi đăng nhập', active: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <span className="text-base font-medium text-slate-700">{item.label}</span>
                  <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${item.active ? 'bg-blue-600' : 'bg-slate-300'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${item.active ? 'left-6' : 'left-1'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-xl text-base font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2">
              <Save size={20} />
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
