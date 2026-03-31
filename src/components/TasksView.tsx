import React, { useState } from 'react';
import { Clock, AlertCircle, CheckCircle2, ArrowRight, User, Building2, ChevronLeft, ChevronRight } from 'lucide-react';

const allTasks = [
  {
    id: '1',
    title: 'Thẩm định Thiết kế cơ sở',
    project: 'Dự án NOXH ABC Quận 7',
    from: 'Sở Quy hoạch - Kiến trúc (Phòng Quản lý quy hoạch phân khu)',
    deadline: 'Còn 2 ngày',
    priority: 'High',
    status: 'Pending'
  },
  {
    id: '2',
    title: 'Rà soát pháp lý đất đai',
    project: 'Chung cư An Bình',
    from: 'Sở NNMT (Chi cục Quản lý đất đai)',
    deadline: 'Còn 5 ngày',
    priority: 'Medium',
    status: 'Pending'
  },
  {
    id: '3',
    title: 'Phê duyệt giá bán căn hộ',
    project: 'Khu nhà ở Bình Chánh',
    from: 'Sở Tài chính (Phòng Quản lý giá)',
    deadline: 'Quá hạn 1 ngày',
    priority: 'Critical',
    status: 'Overdue'
  },
  {
    id: '4',
    title: 'Cấp phép xây dựng giai đoạn 2',
    project: 'Dự án Lê Thành C',
    from: 'Sở Xây dựng (Phòng Thẩm định dự án)',
    deadline: 'Còn 10 ngày',
    priority: 'Low',
    status: 'Pending'
  },
  {
    id: '5',
    title: 'Thẩm định PCCC',
    project: 'Dự án NOXH Thủ Thiêm',
    from: 'Công an TP (Phòng Cảnh sát PCCC & CNCH)',
    deadline: 'Còn 3 ngày',
    priority: 'High',
    status: 'Pending'
  },
  {
    id: '6',
    title: 'Thỏa thuận đấu nối hạ tầng',
    project: 'Dự án NOXH Quận 12',
    from: 'Sở Xây dựng',
    deadline: 'Còn 7 ngày',
    priority: 'Medium',
    status: 'Pending'
  }
];

export default function TasksView() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(allTasks.length / itemsPerPage);
  const paginatedTasks = allTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Hồ sơ chờ xử lý</h2>
          <p className="text-slate-500 text-base">Danh sách các bước quy trình đang nằm tại bàn làm việc của bạn</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-rose-100 text-rose-600 text-base font-bold rounded-full flex items-center gap-1">
            <AlertCircle size={16} /> 1 Quá hạn
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-600 text-base font-bold rounded-full flex items-center gap-1">
            <Clock size={16} /> {allTasks.length - 1} Chờ xử lý
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginatedTasks.map((task) => (
          <div key={task.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <div className={`px-2 py-1 rounded-lg text-sm font-bold uppercase tracking-wider ${
                task.status === 'Overdue' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {task.status === 'Overdue' ? 'Quá hạn' : 'Đang xử lý'}
              </div>
              <span className={`text-base font-bold ${task.status === 'Overdue' ? 'text-rose-500' : 'text-slate-400'}`}>
                {task.deadline}
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{task.title}</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-base text-slate-500">
                <Building2 size={16} />
                <span className="truncate">{task.project}</span>
              </div>
              <div className="flex items-center gap-2 text-base text-slate-500">
                <User size={16} />
                <span>Từ: {task.from}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex -space-x-2">
                {[1, 2].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500">
                    U{i}
                  </div>
                ))}
              </div>
              <button className="flex items-center gap-2 text-base font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                Xử lý ngay <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button 
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-base font-bold transition-all ${
                currentPage === page 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {page}
            </button>
          ))}
          <button 
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
