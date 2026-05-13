// Cấu trúc khóa (keys) cho các cột mốc:
// 'chutruong': Chủ trương đầu tư
// 'qh1500'   : QH 1/500
// 'giaodat'  : QĐ giao đất
// 'htkt'     : Đấu nối HTKT/ĐTM
// 'bcnckt'   : Báo cáo nghiên cứu khả thi
// 'pccc'     : Thẩm duyệt PCCC
// 'gpxd'     : GPXD

export const MOCK_PROGRESS_DATA: Record<string, any> = {
  '1': {
    'chutruong': { cdtDate: '2026-05-10', nnDate: '2026-06-15' },
    'qh1500': { cdtDate: '', nnDate: '' },
    'giaodat': { cdtDate: '', nnDate: '' },
    'htkt': { cdtDate: '', nnDate: '' },
    'bcnckt': { cdtDate: '', nnDate: '' },
    'pccc': { cdtDate: '', nnDate: '' },
    'gpxd': { cdtDate: '', nnDate: '' }
  },
  '2': {
    'chutruong': { cdtDate: '', nnDate: '' },
    'qh1500': { cdtDate: '', nnDate: '' },
    'giaodat': { cdtDate: '', nnDate: '' },
    'htkt': { cdtDate: '', nnDate: '' },
    'bcnckt': { cdtDate: '', nnDate: '' },
    'pccc': { cdtDate: '', nnDate: '' },
    'gpxd': { cdtDate: '', nnDate: '' }
  },
  '3': {
    'chutruong': { cdtDate: '', nnDate: '' },
    'qh1500': { cdtDate: '', nnDate: '' },
    'giaodat': { cdtDate: '', nnDate: '' },
    'htkt': { cdtDate: '', nnDate: '' },
    'bcnckt': { cdtDate: '', nnDate: '' },
    'pccc': { cdtDate: '', nnDate: '' },
    'gpxd': { cdtDate: '', nnDate: '' }
  },
  '4': {
    'chutruong': { cdtDate: '', nnDate: '' },
    'qh1500': { cdtDate: '', nnDate: '' },
    'giaodat': { cdtDate: '', nnDate: '' },
    'htkt': { cdtDate: '', nnDate: '' },
    'bcnckt': { cdtDate: '', nnDate: '' },
    'pccc': { cdtDate: '', nnDate: '' },
    'gpxd': { cdtDate: '', nnDate: '' }
  },
  '5': {
    'chutruong': { cdtDate: '', nnDate: '' },
    'qh1500': { cdtDate: '', nnDate: '' },
    'giaodat': { cdtDate: '', nnDate: '' },
    'htkt': { cdtDate: '', nnDate: '' },
    'bcnckt': { cdtDate: '', nnDate: '' },
    'pccc': { cdtDate: '', nnDate: '' },
    'gpxd': { cdtDate: '', nnDate: '' }
  },
  // Khung trống cho các dự án còn lại để bạn tự điền
  ...Array.from({ length: 39 }, (_, i) => (i + 6).toString()).reduce((acc, id) => ({
    ...acc,
    [id]: {
      'chutruong': { cdtDate: '', nnDate: '' },
      'qh1500': { cdtDate: '', nnDate: '' },
      'giaodat': { cdtDate: '', nnDate: '' },
      'htkt': { cdtDate: '', nnDate: '' },
      'bcnckt': { cdtDate: '', nnDate: '' },
      'pccc': { cdtDate: '', nnDate: '' },
      'gpxd': { cdtDate: '', nnDate: '' }
    }
  }), {})
};
