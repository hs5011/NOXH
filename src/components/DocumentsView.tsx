import React from 'react';
import { Folder, FileText, Search, Plus, MoreVertical, Download, Eye } from 'lucide-react';

const folders = [
  { name: 'Hồ sơ Pháp lý', count: 12, color: 'text-blue-500' },
  { name: 'Bản vẽ Thiết kế', count: 45, color: 'text-emerald-500' },
  { name: 'Văn bản Phê duyệt', count: 28, color: 'text-amber-500' },
  { name: 'Báo cáo Tiến độ', count: 110, color: 'text-indigo-500' },
];

const recentFiles = [
  { name: 'Quyết định phê duyệt 1/500.pdf', size: '2.4 MB', date: '10/03/2024', type: 'PDF' },
  { name: 'Bản vẽ mặt bằng tổng thể.dwg', size: '15.8 MB', date: '08/03/2024', type: 'CAD' },
  { name: 'Công văn tháo gỡ vướng mắc.docx', size: '450 KB', date: '05/03/2024', type: 'DOC' },
  { name: 'Ảnh hiện trạng thi công.jpg', size: '4.2 MB', date: '01/03/2024', type: 'IMG' },
];

export default function DocumentsView() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Kho Hồ sơ số</h2>
          <p className="text-slate-500 text-sm">Lưu trữ và tra cứu toàn bộ tài liệu dự án</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm tài liệu..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm w-64 outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200">
            <Plus size={16} /> Tải lên
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {folders.map((f) => (
          <div key={f.name} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <Folder size={32} className={`${f.color} mb-4 group-hover:scale-110 transition-transform`} fill="currentColor" fillOpacity={0.1} />
            <h3 className="font-bold text-slate-900 text-sm">{f.name}</h3>
            <p className="text-xs text-slate-400 font-medium">{f.count} tài liệu</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Tài liệu gần đây</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {recentFiles.map((file) => (
            <div key={file.name} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{file.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{file.size} • {file.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Eye size={16} />
                </button>
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Download size={16} />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
