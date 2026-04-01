
export const INITIAL_PROJECTS = [
  { 
    id: "1", 
    code: "NOXH-HCM-01", 
    name: "Dự án tại số 1193 Phạm Thế Hiển, Phường 5, Quận 8", 
    investor: "Chưa có chủ đầu tư", 
    location: "Phường Bình Đông, TP.HCM", 
    totalArea: 1.21, 
    height: 20, 
    apartmentCount: 864, 
    progress: 15, 
    status: "On Track", 
    currentStep: "Chủ trì giao nhiệm vụ chuẩn bị đầu tư", 
    parentStep: "Giao nhiệm vụ chuẩn bị đầu tư", 
    childStep: "Chủ trì giao nhiệm vụ chuẩn bị đầu tư", 
    stepDeadline: "2024-12-30", 
    currentAgency: "Chưa có chủ đầu tư", 
    currentDepartment: "Phòng Tài chính đầu tư",
    deadline: "2027-04-30", 
    stage: "CHUẨN BỊ ĐẦU TƯ", 
    isKeyProject: true, 
    isPublicInvestment: true, 
    fundingSource: "Vốn ngân sách", 
    processId: "p3",
    milestones: {
      cs1: { investor: "2024-12-15", agency: "2024-12-30" },
      cs2: { investor: "2024-12-20", agency: "2025-01-05" }
    },
    implementationPlan: {
      cs1: { agencyActualDate: "" },
      cs2: { agencyActualDate: "" }
    }
  },
  { 
    id: "2", 
    code: "NOXH-HCM-02", 
    name: "Dự án NOXH 324 Lý Thường Kiệt (Đức Mạnh)", 
    investor: "Chưa có chủ đầu tư", 
    location: "Phường Diên Hồng, TP.HCM", 
    totalArea: 0.26, 
    height: 22, 
    apartmentCount: 324, 
    progress: 40, 
    status: "On Track", 
    currentStep: "Chấp thuận chủ trương đầu tư", 
    parentStep: "Chấp thuận chủ trương đầu tư đồng thời giao chủ đầu tư theo pháp luật về nhà ở", 
    childStep: "Chấp thuận chủ trương đầu tư", 
    stepDeadline: "2025-06-30", 
    currentAgency: "Chưa có chủ đầu tư", 
    currentDepartment: "Phòng Thẩm định dự án",
    deadline: "2027-12-31", 
    stage: "CHUẨN BỊ ĐẦU TƯ", 
    isKeyProject: true, 
    isPublicInvestment: false, 
    fundingSource: "Vốn doanh nghiệp", 
    processId: "p1",
    milestones: {
      cs1: { investor: "2024-01-15", agency: "2024-01-30" },
      cs2: { investor: "2024-02-15", agency: "2024-02-28" },
      cs3: { investor: "2024-03-15", agency: "2024-03-30" },
      cs4: { investor: "2025-06-15", agency: "2025-06-30" },
      cs5: { investor: "2025-06-15", agency: "2025-06-30" }
    },
    implementationPlan: {
      cs1: { agencyActualDate: "2024-01-25" },
      cs2: { agencyActualDate: "2024-02-20" },
      cs3: { agencyActualDate: "2024-03-28" },
      cs4: { agencyActualDate: "" },
      cs5: { agencyActualDate: "" }
    }
  },
  { 
    id: "3", 
    code: "NOXH-HCM-03", 
    name: "Khu đất có diện tích khoảng 11,75 ha tại phường Tân Thới Hiệp", 
    investor: "Chưa có chủ đầu tư", 
    location: "Phường Tân Thới Hiệp, TP.HCM", 
    totalArea: 0.41, 
    height: 18, 
    apartmentCount: 290, 
    progress: 60, 
    status: "Warning", 
    currentStep: "Chấp thuận chủ trương đầu tư", 
    parentStep: "Chấp thuận chủ trương đầu tư đồng thời giao chủ đầu tư theo pháp luật về nhà ở", 
    childStep: "Chấp thuận chủ trương đầu tư", 
    stepDeadline: "2024-03-15", 
    delayDays: 10,
    currentAgency: "UBND TP", 
    currentDepartment: "Phòng Thẩm định dự án",
    deadline: "2027-06-30", 
    stage: "CHUẨN BỊ ĐẦU TƯ", 
    isKeyProject: false, 
    isPublicInvestment: false, 
    fundingSource: "Vốn doanh nghiệp",
    processId: "p1",
    milestones: {
      cs1: { investor: "2023-10-15", agency: "2023-10-30" },
      cs2: { investor: "2023-11-15", agency: "2023-11-30" },
      cs3: { investor: "2024-03-01", agency: "2024-03-15" }
    },
    implementationPlan: {
      cs1: { agencyActualDate: "2023-10-28" },
      cs2: { agencyActualDate: "2023-11-25" },
      cs3: { agencyActualDate: "" }
    }
  },
  { 
    id: "4", 
    code: "NOXH-HCM-04", 
    name: "Khu đất 0,98ha thuộc dự án Khu nhà ở Phường Trường Thạnh (quỹ đất 20%)", 
    investor: "Chưa có chủ đầu tư", 
    location: "Phường Long Phước, TP.HCM", 
    totalArea: 1.57, 
    height: 18, 
    apartmentCount: 435, 
    progress: 30, 
    status: "Delayed", 
    currentStep: "Thẩm định / lấy ý kiến quy hoạch", 
    parentStep: "Thẩm định, phê duyệt quy hoạch chi tiết tỷ lệ 1/500 hoặc chấp thuận quy hoạch tổng mặt bằng tỷ lệ 1/500 (quy hoạch chi tiết được lập theo quy trình rút gọn) theo pháp luật về quy hoạch đô thị và nông thôn", 
    childStep: "Thẩm định / lấy ý kiến quy hoạch", 
    stepDeadline: "2024-08-31", 
    delayDays: 45,
    currentAgency: "Sở Quy hoạch Kiến trúc", 
    currentDepartment: "Phòng Đầu tư",
    deadline: "2027-08-31", 
    stage: "CHUẨN BỊ ĐẦU TƯ", 
    isKeyProject: true, 
    isPublicInvestment: false, 
    fundingSource: "Vốn doanh nghiệp",
    processId: "p2",
    milestones: {
      cs31: { investor: "2024-08-15", agency: "2024-08-31" },
      cs41: { investor: "2024-09-15", agency: "2024-09-30" }
    },
    implementationPlan: {
      cs31: { agencyActualDate: "" },
      cs41: { agencyActualDate: "" }
    }
  },
  { 
    id: "5", 
    code: "NOXH-HCM-05", 
    name: "Dự án khu nhà ở xã hội 4,7ha, Phường 10, thành phố Vũng Tàu ", 
    investor: "Chưa có chủ đầu tư", 
    location: "Phường Rạch Dừa, TP.HCM", 
    totalArea: 2.01, 
    height: 18, 
    apartmentCount: 1456, 
    progress: 50, 
    status: "On Track", 
    currentStep: "Thẩm định / xử lý hồ sơ đất đai", 
    parentStep: "Giao đất, cho thuê đất hoặc cho phép chuyển mục đích sử dụng đất theo pháp luật về đất đai", 
    childStep: "Thẩm định / xử lý hồ sơ đất đai", 
    stepDeadline: "2025-03-31", 
    currentAgency: "Sở NNMT", 
    currentDepartment: "Phòng Thẩm định dự án",
    deadline: "2027-09-30", 
    stage: "THỰC HIỆN ĐẦU TƯ", 
    isKeyProject: false, 
    isPublicInvestment: false, 
    fundingSource: "Vốn doanh nghiệp",
    processId: "p1",
    milestones: {
      cs1: { investor: "2024-05-15", agency: "2024-05-30" },
      cs2: { investor: "2024-06-15", agency: "2024-06-30" },
      cs3: { investor: "2024-07-15", agency: "2024-07-30" },
      cs4: { investor: "2025-03-15", agency: "2025-03-31" },
      cs5: { investor: "2025-03-15", agency: "2025-03-31" }
    },
    implementationPlan: {
      cs1: { agencyActualDate: "2024-05-28" },
      cs2: { agencyActualDate: "2024-06-25" },
      cs3: { agencyActualDate: "2024-07-28" },
      cs4: { agencyActualDate: "" },
      cs5: { agencyActualDate: "" }
    }
  },
  { 
    id: "6", 
    code: "NOXH-HCM-06", 
    name: "Dự án chung cư cao tầng tại số 314 đường Âu Dương Lân", 
    investor: "Chưa có chủ đầu tư", 
    location: "Phường Rạch Ông, TP.HCM", 
    totalArea: 0.86, 
    height: 17, 
    apartmentCount: 160, 
    progress: 100, 
    status: "On Track", 
    currentStep: "Kiểm tra nghiệm thu hoàn thành công trình cấp II, III", 
    parentStep: "Kiểm tra công tác nghiệm thu hoàn thành công trình của cơ quan chuyên môn về xây dựng tại địa phương", 
    childStep: "Kiểm tra nghiệm thu hoàn thành công trình cấp II, III", 
    currentAgency: "Sở Xây dựng", 
    currentDepartment: "Phòng PTĐT",
    deadline: "2026-12-31", 
    stage: "KẾT THÚC ĐẦU TƯ", 
    isKeyProject: false, 
    isPublicInvestment: false, 
    processId: "p2",
    milestones: {
      cs31: { investor: "2023-01-15", agency: "2023-01-30" },
      cs41: { investor: "2023-02-15", agency: "2023-02-28" }
    },
    implementationPlan: {
      cs31: { agencyActualDate: "2023-01-28" },
      cs41: { agencyActualDate: "2023-02-25" }
    }
  },
  { 
    id: "7", 
    code: "NOXH-BD-01", 
    name: "Khu đất số 617-629 Bến Bình Đông, Phường Phú Định ", 
    investor: "Chưa có chủ đầu tư", 
    location: "Phường Phú Định, TP.HCM", 
    totalArea: 2.76, 
    height: 12, 
    apartmentCount: 522, 
    progress: 80, 
    status: "On Track", 
    currentStep: "Thẩm định thiết kế và dự toán công trình cấp II, III", 
    parentStep: "Lập thiết kế xây dựng triển khai sau thiết kế cơ sở và dự toán của dự án, trình thẩm định và phê duyệt", 
    childStep: "Thẩm định thiết kế và dự toán công trình cấp II, III", 
    stepDeadline: "2025-06-15", 
    currentAgency: "Sở Xây dựng", 
    currentDepartment: "Phòng PTĐT",
    deadline: "2027-05-30", 
    stage: "THỰC HIỆN ĐẦU TƯ", 
    isKeyProject: false, 
    isPublicInvestment: true, 
    processId: "p3",
    milestones: {
      cs1: { investor: "2024-01-15", agency: "2024-01-30" },
      cs2: { investor: "2024-02-15", agency: "2024-02-28" },
      cs3: { investor: "2024-03-15", agency: "2024-03-30" },
      cs4: { investor: "2025-06-01", agency: "2025-06-15" },
      cs5: { investor: "2025-06-01", agency: "2025-06-15" }
    },
    implementationPlan: {
      cs1: { agencyActualDate: "2024-01-28" },
      cs2: { agencyActualDate: "2024-02-25" },
      cs3: { agencyActualDate: "2024-03-28" },
      cs4: { agencyActualDate: "" },
      cs5: { agencyActualDate: "2025-06-10" }
    }
  },
  { 
    id: "8", 
    code: "NOXH-BD-02", 
    name: "Khu đất tại số H6 Nguyễn Văn Lượng, Phường Gò Vấp, Thành phố Hồ Chí Minh", 
    investor: "Chưa có chủ đầu tư", 
    location: "Phường An Nhơn, TP.HCM", 
    totalArea: 2.30, 
    height: 22, 
    apartmentCount: 2372, 
    progress: 40, 
    status: "On Track", 
    currentStep: "Thẩm định hồ sơ dự án nhóm B, C", 
    parentStep: "Lập, thẩm định Báo cáo nghiên cứu tiền khả thi (nhóm A) / Báo cáo đề xuất chủ trương đầu tư dự án (nhóm B, C) và trình cơ quan có thẩm quyền quyết định chủ trương đầu tư", 
    childStep: "Thẩm định hồ sơ dự án nhóm B, C", 
    currentAgency: "Sở Tài chính", 
    currentDepartment: "Phòng Thẩm định dự án",
    deadline: "2027-12-31", 
    stage: "CHUẨN BỊ ĐẦU TƯ", 
    isKeyProject: false, 
    isPublicInvestment: true, 
    processId: "p3",
    milestones: {
      cs1: { investor: "2024-08-15", agency: "2024-08-30" },
      cs2: { investor: "2024-09-15", agency: "2024-09-30" },
      cs3: { investor: "2025-01-15", agency: "2025-01-30" }
    },
    implementationPlan: {
      cs1: { agencyActualDate: "2024-08-28" },
      cs2: { agencyActualDate: "2024-09-25" },
      cs3: { agencyActualDate: "" }
    }
  },
  { 
    id: "9", 
    code: "NOXH-BD-03", 
    name: "Khu đất tại Phường An Khánh, Thành phố Hồ Chí Minh", 
    investor: "Chưa có chủ đầu tư", 
    location: "Phường An Khánh, TP.HCM", 
    totalArea: 1.14, 
    height: 18, 
    apartmentCount: 936, 
    progress: 80, 
    status: "On Track", 
    currentStep: "Công bố thông tin", 
    parentStep: "Chấp thuận chủ trương đầu tư đồng thời giao chủ đầu tư theo pháp luật về nhà ở", 
    childStep: "Công bố thông tin", 
    currentAgency: "Sở Xây dựng", 
    currentDepartment: "Phòng QLN & TTBĐS",
    deadline: "2027-03-30", 
    stage: "CHUẨN BỊ ĐẦU TƯ", 
    isKeyProject: false, 
    isPublicInvestment: false, 
    processId: "p1",
    milestones: {
      cs1: { investor: "2025-03-15", agency: "2025-03-30" },
      cs2: { investor: "2025-04-15", agency: "2025-04-30" }
    },
    implementationPlan: {
      cs1: { agencyActualDate: "" },
      cs2: { agencyActualDate: "" }
    }
  },
  { 
    id: "10", 
    code: "NOXH-BD-04", 
    name: "Khu đất tại Phường Thạnh Mỹ Tây, Thành phố Hồ Chí Minh", 
    investor: "Chưa có chủ đầu tư", 
    location: "Phường Thạnh Mỹ Tây, TP.HCM", 
    totalArea: 0.88, 
    height: 19, 
    apartmentCount: 1160, 
    progress: 80, 
    status: "On Track", 
    currentStep: "Thẩm định / lấy ý kiến quy hoạch", 
    parentStep: "Thẩm định, phê duyệt quy hoạch chi tiết tỷ lệ 1/500 hoặc chấp thuận quy hoạch tổng mặt bằng tỷ lệ 1/500 (quy hoạch chi tiết được lập theo quy trình rút gọn) theo pháp luật về quy hoạch đô thị và nông thôn", 
    childStep: "Thẩm định / lấy ý kiến quy hoạch", 
    currentAgency: "Sở Quy hoạch Kiến trúc", 
    currentDepartment: "Phòng Đầu tư",
    deadline: "2027-05-30", 
    stage: "CHUẨN BỊ ĐẦU TƯ", 
    isKeyProject: false, 
    isPublicInvestment: false, 
    processId: "p2",
    milestones: {
      cs31: { investor: "2025-05-15", agency: "2025-05-30" },
      cs41: { investor: "2025-06-15", agency: "2025-06-30" }
    },
    implementationPlan: {
      cs31: { agencyActualDate: "" },
      cs41: { agencyActualDate: "" }
    }
  },{ 
    id: "11", 
    code: "NOXH-QHKT-01", 
    name: "Nhà ở xã hội thuộc dự án Khu dân cư Tân Thuận Tây, Phường Tân Thuận Tây và Phường Bình Thuận, Quận 7 (khu MR1, MR2) (quỹ đất 20%).", 
    investor: "Công ty CP ĐTXD Xuân Mai Sài Gòn", 
    location: "Phường Tân Thuận, TP.HCM", 
    totalArea: 1.28, 
    height: 38, 
    apartmentCount: 1300, 
    progress: 20, 
    status: "On Track", 
    currentStep: "Thẩm định / lấy ý kiến quy hoạch", 
    parentStep: "Thẩm định, phê duyệt quy hoạch chi tiết tỷ lệ 1/500 hoặc chấp thuận quy hoạch tổng mặt bằng tỷ lệ 1/500 (quy hoạch chi tiết được lập theo quy trình rút gọn) theo pháp luật về quy hoạch đô thị và nông thôn", 
    childStep: "Thẩm định / lấy ý kiến quy hoạch", 
    currentAgency: "Sở Quy hoạch Kiến trúc", 
    currentDepartment: "Phòng Quy hoạch - Kế hoạch sử dụng đất",
    deadline: "2027-12-31", 
    stage: "CHUẨN BỊ ĐẦU TƯ", 
    isKeyProject: false, 
    isPublicInvestment: false, 
    processId: "p2",
    milestones: {
      cs31: { investor: "2025-01-15", agency: "2025-01-30" },
      cs41: { investor: "2025-02-15", agency: "2025-02-28" }
    },
    implementationPlan: {
      cs31: { agencyActualDate: "" },
      cs41: { agencyActualDate: "" }
    }
  },{ 
    id: "12", 
    code: "NOXH-QHKT-02", 
    name: "Nhà ở xã hội - Chung cư Tanimex tại Phường Bình Hưng Hòa, quận Bình Tân", 
    investor: "Cty CP SX KD XNK DV & ĐT Tân Bình Tanimex", 
    location: "Phường Bình Hưng Hòa A, TP.HCM", 
    totalArea: 1.99, 
    height: 9, 
    apartmentCount: 392, 
    progress: 30, 
    status: "On Track", 
    currentStep: "Thẩm định / lấy ý kiến quy hoạch", 
    parentStep: "Thẩm định, phê duyệt quy hoạch chi tiết tỷ lệ 1/500 hoặc chấp thuận quy hoạch tổng mặt bằng tỷ lệ 1/500 (quy hoạch chi tiết được lập theo quy trình rút gọn) theo pháp luật về quy hoạch đô thị và nông thôn", 
    childStep: "Thẩm định / lấy ý kiến quy hoạch", 
    currentAgency: "Sở Quy hoạch Kiến trúc", 
    currentDepartment: "Phòng Tài chính đầu tư",
    deadline: "2027-06-30", 
    stage: "CHUẨN BỊ ĐẦU TƯ", 
    isKeyProject: false, 
    isPublicInvestment: false, 
    processId: "p2",
    milestones: {
      cs31: { investor: "2025-03-15", agency: "2025-03-30" },
      cs41: { investor: "2025-04-15", agency: "2025-04-30" }
    },
    implementationPlan: {
      cs31: { agencyActualDate: "" },
      cs41: { agencyActualDate: "" }
    }
  },{ 
    id: "13", 
    code: "NOXH-QHKT-03", 
    name: "Khu đất số 7/39 ấp Cây Dầu, Phường Tăng Nhơn Phú", 
    investor: "Công ty Cổ phần An Cư Đức Phú", 
    location: "Phường Tăng Nhơn Phú, TP.HCM", 
    totalArea: 0.63, 
    height: 22, 
    apartmentCount: 477, 
    progress: 20, 
    status: "On Track", 
    currentStep: "Chấp thuận chủ trương đầu tư", 
    parentStep: "Chấp thuận chủ trương đầu tư", 
    childStep: "Lấy ý kiến các sở ngành", 
    currentAgency: "UBND TP", 
    currentDepartment: "Văn phòng UBND TP",
    deadline: "2027-12-31", 
    stage: "CHUẨN BỊ ĐẦU TƯ", 
    isKeyProject: false, 
    isPublicInvestment: false, 
    processId: "p2",
    milestones: {
      cs31: { investor: "2025-05-15", agency: "2025-05-30" },
      cs41: { investor: "2025-06-15", agency: "2025-06-30" }
    },
    implementationPlan: {
      cs31: { agencyActualDate: "" },
      cs41: { agencyActualDate: "" }
    }
  },{ 
    id: "14", 
    code: "NOXH-QHKT-04", 
    name: "Nhà ở xã hội thuộc dự án Khu dân cư Nhơn Đức Nhà Bè (quỹ đất 20%)", 
    investor: "Công ty Cổ phần Bất động sản Nhà Bè", 
    location: "Xã Hiệp Phước, TP.HCM", 
    totalArea: 2.10, 
    height: 20, 
    apartmentCount: 421, 
    progress: 20, 
    status: "On Track", 
    currentStep: "Chấp thuận chủ trương đầu tư", 
    parentStep: "Chấp thuận chủ trương đầu tư", 
    childStep: "Lấy ý kiến các sở ngành", 
    currentAgency: "HĐND TP", 
    currentDepartment: "Ban Kinh tế - Ngân sách",
    deadline: "2027-12-31", 
    stage: "CHUẨN BỊ ĐẦU TƯ", 
    isKeyProject: false, 
    isPublicInvestment: false, 
    processId: "p2",
    milestones: {
      cs31: { investor: "2025-07-15", agency: "2025-07-30" },
      cs41: { investor: "2025-08-15", agency: "2025-08-30" }
    },
    implementationPlan: {
      cs31: { agencyActualDate: "" },
      cs41: { agencyActualDate: "" }
    }
  },{ 
    id: "15", 
    code: "NOXH-QHKT-05", 
    name: "Khu nhà ở cao tầng Hoàng Nam - Lê Cơ", 
    investor: "Cty TNHH XD TM Hoàng Nam", 
    location: "Phường An Lạc, TP.HCM", 
    totalArea: 1.06, 
    height: 18, 
    apartmentCount: 750, 
    progress: 20, 
    status: "On Track", 
    currentStep: "Chấp thuận chủ trương đầu tư", 
    parentStep: "Chấp thuận chủ trương đầu tư", 
    childStep: "Lấy ý kiến các sở ngành", 
    currentAgency: "Sở Xây dựng", 
    currentDepartment: "Phòng PTĐT",
    deadline: "2027-12-31", 
    stage: "CHUẨN BỊ ĐẦU TƯ", 
    isKeyProject: false, 
    isPublicInvestment: false, 
    processId: "p2",
    milestones: {
      cs31: { investor: "2025-09-15", agency: "2025-09-30" },
      cs41: { investor: "2025-10-15", agency: "2025-10-30" }
    },
    implementationPlan: {
      cs31: { agencyActualDate: "" },
      cs41: { agencyActualDate: "" }
    }
  },{ id: "16", code: "NOXH-NNMT-01", name: "Nhà ở xã hội Nam Lý, 91A Đỗ Xuân Hợp", investor: "Cty CP Địa ốc Thảo Điền", location: "Phường Phước Long, TP.HCM", totalArea: 0.46, height: 25, apartmentCount: 291, progress: 20, status: "Delayed", currentStep: "Thô đến tầng 8", parentStep: "Thực hiện dự án", childStep: "Thi công phần thân", stepDeadline: "2025-11-15", delayDays: 20, currentAgency: "Chủ đầu tư", deadline: "2027-12-31", stage: "THỰC HIỆN ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p1" },
  { id: "17", code: "NOXH-NNMT-02", name: "Nhà ở xã hội xã Long Thới, huyện Nhà Bè", investor: "Cty CPXD & KD Địa ốc Hòa Bình", location: "Xã Hiệp Phước, TP.HCM", totalArea: 3.02, height: 12, apartmentCount: 462, progress: 20, status: "On Track", currentStep: "Thô đến tầng 3", parentStep: "Thực hiện dự án", childStep: "Thi công phần thân", currentAgency: "Chủ đầu tư", currentDepartment: "Phòng Thẩm định dự án", deadline: "2027-09-30", stage: "THỰC HIỆN ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p1" },
  { id: "18", code: "NOXH-CA-01", name: "Nhà ở xã hội - Khu 2 Việt Sing", investor: "Tổng Công ty Đầu tư và Phát triển Công nghiệp - CTCP", location: "Phường An Phú, Bình Dương", totalArea: 1.15, height: 22, apartmentCount: 755, progress: 20, status: "On Track", currentStep: "Thô đến tầng 10", parentStep: "Thực hiện dự án", childStep: "Thi công phần thân", currentAgency: "Công an TP (PCCC)", deadline: "2027-12-31", stage: "THỰC HIỆN ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p3" },
  { id: "19", code: "NOXH-CA-02", name: "Nhà ở xã hội - Khu 7 Việt Sing", investor: "Tổng Công ty Đầu tư và Phát triển Công nghiệp - CTCP", location: "Phường Thuận Giao, Bình Dương", totalArea: 0.81, height: 22, apartmentCount: 766, progress: 20, status: "On Track", currentStep: "Thô đến tầng 10", parentStep: "Thực hiện dự án", childStep: "Thi công phần thân", currentAgency: "Công an TP (PCCC)", currentDepartment: "Phòng Quy hoạch - Kế hoạch sử dụng đất", deadline: "2027-12-31", stage: "THỰC HIỆN ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p3" },
  { id: "20", code: "NOXH-CA-03", name: "Căn hộ Lê Thành Tân Tạo 2", investor: "Công ty TNHH Thương mại – Xây dựng Lê Thành", location: "Phường Bình Tân, TP.HCM", totalArea: 0.33, height: 18, apartmentCount: 494, progress: 20, status: "On Track", currentStep: "Thô đến tầng 7", parentStep: "Thực hiện dự án", childStep: "Thi công phần thân", currentAgency: "Sở Tài chính", currentDepartment: "Phòng Quản lý ngân sách", deadline: "2027-10-31", stage: "THỰC HIỆN ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p3" },
  { id: "21", code: "NOXH-CA-04", name: "Nhà ở xã hội thuộc dự án Khu nhà ở Tiến Phước tại Khu B - Lô số 1 Khu 9AB- Đô thị mới Nam Thành phố", investor: "Công ty Cổ phần Bất động sản Tiến Phước", location: "Xã Bình Hưng, TP.HCM", totalArea: 0.19, height: 18, apartmentCount: 284, progress: 20, status: "On Track", currentStep: "Thô đến tầng 4", parentStep: "Thực hiện dự án", childStep: "Thi công phần thân", currentAgency: "UBND TP", currentDepartment: "Văn phòng UBND TP", deadline: "2027-12-31", stage: "THỰC HIỆN ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p3" },
  { id: "22", code: "NOXH-CA-05", name: "Khu đất có diện tích 3.874,61 m2, tại lô D dự án hạ tầng kỹ thuật khu tái định cư tại Phường Rạch Dừa", investor: "Chưa có chủ đầu tư", location: "Phường Rạch Dừa, Bà Rịa - Vũng Tàu", totalArea: 4.60, height: 12, apartmentCount: 1300, progress: 20, status: "On Track", currentStep: "Thô đến tầng 4", parentStep: "Thực hiện dự án", childStep: "Thi công phần thân", currentAgency: "HĐND TP", currentDepartment: "Ban Kinh tế - Ngân sách", deadline: "2028-06-30", stage: "THỰC HIỆN ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p3" },
  { id: "23", code: "NOXH-CA-06", name: "Khu nhà ở Ecotown Phú Mỹ (Giai đoạn 2 thực hiện chung cư CC2), Phường Phú Mỹ", investor: "Công ty Hodeco", location: "Phường Phú Mỹ, Bà Rịa - Vũng Tàu", totalArea: 0.40, height: 18, apartmentCount: 352, progress: 20, status: "On Track", currentStep: "Thô đến tầng 8", parentStep: "Thực hiện dự án", childStep: "Thi công phần thân", stepDeadline: "2025-09-10", currentAgency: "UBND cấp xã, phường", currentDepartment: "Phường Phú Mỹ", deadline: "2027-10-31", stage: "THỰC HIỆN ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p3" },
  { id: "24", code: "NOXH-SXD-01", name: "Khu dân cư Phường Long Trường, thành phố Thủ Đức", investor: "Công ty TNHH Xây dựng và Kinh doanh nhà Điền Phúc Thành", location: "Phường Hiệp Phú, TP.HCM", totalArea: 1.43, height: 6, apartmentCount: 558, progress: 100, status: "On Track", currentStep: "Hoàn thành", parentStep: "Kết thúc dự án", childStep: "Bàn giao đưa vào sử dụng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng QLN & TTBĐS", deadline: "2026-12-31", stage: "KẾT THÚC ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p2" },
  { id: "25", code: "NOXH-SXD-02", name: "Nhà ở xã hội thuộc dự án Khu nhà ở tại Phường Phú Hữu, thành phố Thủ Đức (quỹ đất 20%)", investor: "Công ty Cổ phần Bất động sản Dragon Village", location: "Phường Long Trường, TP.HCM", totalArea: 1.89, height: 8, apartmentCount: 764, progress: 20, status: "On Track", currentStep: "Xong thô", parentStep: "Thực hiện dự án", childStep: "Hoàn thiện", currentAgency: "Sở Quy hoạch Kiến trúc", currentDepartment: "Phòng Quản lý quy hoạch chung", deadline: "2027-03-31", stage: "KẾT THÚC ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p2" },
  { id: "26", code: "NOXH-SXD-03", name: "Nhà ở xã hội thuộc dự án Khu nhà ở Phường Phú Hữu, thành phố Thủ Đức (quỹ đất 20%)", investor: "Cty CP BĐS Exim", location: "Phường Long Trường, TP.HCM", totalArea: 1.70, height: 23, apartmentCount: 1379, progress: 20, status: "On Track", currentStep: "Thô đến tầng 6", parentStep: "Thực hiện dự án", childStep: "Thi công phần thân", currentAgency: "Sở NNMT", currentDepartment: "Phòng Kinh tế đất", deadline: "2027-12-31", stage: "KẾT THÚC ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p2" },
  { id: "27", code: "NOXH-SXD-04", name: "Nhà ở xã hội tại phường Long Phước, thành phố Thủ Đức (quỹ đất 20%)", investor: "Công ty CP Phát triển Thành phố Xanh", location: "Phường Long Phước, TP.HCM", totalArea: 26.60, height: 9, apartmentCount: 3284, progress: 20, status: "On Track", currentStep: "Thô đến tầng 6", parentStep: "Thực hiện dự án", childStep: "Thi công phần thân", currentAgency: "Sở Tài chính", currentDepartment: "Phòng Tài chính đầu tư", deadline: "2027-06-30", stage: "KẾT THÚC ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p2" },
  { id: "28", code: "NOXH-SXD-05", name: "Nhà ở xã hội thuộc dự án Khu dân cư Hiệp Phước I, xã Hiệp Phước, huyện Nhà Bè (quỹ đất 20%)", investor: "Công ty TNHH MTV Phát triển Công nghiệp Tân Thuận (IPC)", location: "Xã Hiệp Phước, TP.HCM", totalArea: 2.59, height: 5, apartmentCount: 800, progress: 20, status: "On Track", currentStep: "Thô đến tầng 4", parentStep: "Thực hiện dự án", childStep: "Thi công phần thân", currentAgency: "UBND TP", currentDepartment: "Phòng Nội chính", deadline: "2027-06-30", stage: "KẾT THÚC ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p2" },
  { id: "29", code: "NOXH-SXD-06", name: "Nhà ở xã hội thuộc dự án Khu dân cư số 6 thuộc Khu dân cư Công viên giải trí Hiệp Bình Phước", investor: "Tổng Công ty Đầu tư Phát triển nhà và Đô thị", location: "Phường Hiệp Bình, TP.HCM", totalArea: 1.37, height: 7, apartmentCount: 209, progress: 100, status: "On Track", currentStep: "Xong thô", parentStep: "Thực hiện dự án", childStep: "Hoàn thiện", currentAgency: "HĐND TP", currentDepartment: "Ban Đô thị", deadline: "2027-03-31", stage: "KẾT THÚC ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p2" },
  { id: "30", code: "NOXH-SXD-07", name: "Nhà ở an sinh xã hội - Khu 3 Định Hoà (giai đoạn 1)", investor: "Tổng công ty Đầu tư và Phát triển Công nghiệp - CTCP", location: "Phường Chánh Hiệp, Bình Dương", totalArea: 0.95, height: 20, apartmentCount: 1178, progress: 20, status: "On Track", currentStep: "Thô đến tầng 10", parentStep: "Thực hiện dự án", childStep: "Thi công phần thân", stepDeadline: "2025-07-05", currentAgency: "UBND cấp xã, phường", currentDepartment: "Phường Chánh Hiệp", deadline: "2027-12-31", stage: "THỰC HIỆN ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p3" },
  { id: "31", code: "NOXH-SXD-08", name: "Nhà ở an sinh xã hội - Khu 4 Định Hoà", investor: "Tổng công ty Đầu tư và Phát triển Công nghiệp - CTCP", location: "Phường Chánh Hiệp, Bình Dương", totalArea: 2.57, height: 20, apartmentCount: 3190, progress: 20, status: "On Track", currentStep: "Thô đến tầng 10", parentStep: "Thực hiện dự án", childStep: "Thi công phần thân", stepDeadline: "2025-07-15", currentAgency: "UBND cấp xã, phường", currentDepartment: "Phường Chánh Hiệp", deadline: "2027-12-31", stage: "THỰC HIỆN ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p3" },
  { id: "32", code: "NOXH-SXD-09", name: "Nhà ở xã hội thuộc dự án Khu nhà ở Công ty Khang Phúc (quỹ đất 20%)", investor: "Công ty TNHH MTV Đầu tư Kinh doanh nhà Khang Phúc", location: "Xã Tân Kiên, TP.HCM", totalArea: 1.33, height: 25, apartmentCount: 860, progress: 20, status: "Delayed", currentStep: "Thô đến tầng 10", parentStep: "Thực hiện dự án", childStep: "Thi công phần thân", stepDeadline: "2025-10-15", delayDays: 45, currentAgency: "Sở Xây dựng", currentDepartment: "Phòng QLCL CTXD", deadline: "2027-12-31", stage: "THỰC HIỆN ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p3" },
  { id: "33", code: "NOXH-SXD-10", name: "Nhà ở xã hội của dự án Khu nhà ở Vạn Phúc 3, Thành phố Thủ Đức", investor: "Công ty Cổ phần Đầu tư địa ốc Vạn Phúc", location: "Phường Hiệp Bình, TP.HCM", totalArea: 1.50, height: 21, apartmentCount: 1085, progress: 20, status: "On Track", currentStep: "Thô đến tầng 5", parentStep: "Thực hiện dự án", childStep: "Thi công phần thân", currentAgency: "Sở Quy hoạch Kiến trúc", currentDepartment: "Phòng Quản lý quy hoạch phân khu", deadline: "2027-12-31", stage: "THỰC HIỆN ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p2" },
  { id: "34", code: "NOXH-SXD-11", name: "Nhà ở xã hội của dự án Khu nhà ở Vạn Phúc 2, Thành phố Thủ Đức", investor: "Công ty Cổ phần Đầu tư địa ốc Vạn Phúc", location: "Phường Hiệp Bình, TP.HCM", totalArea: 0.96, height: 18, apartmentCount: 882, progress: 20, status: "On Track", currentStep: "Thô đến tầng 10", parentStep: "Thực hiện dự án", childStep: "Thi công phần thân", currentAgency: "Sở NNMT", currentDepartment: "Chi cục Quản lý đất đai", deadline: "2027-12-31", stage: "THỰC HIỆN ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p2" },
  { id: "35", code: "NOXH-SXD-12", name: "Dự án Khu nhà ở xã hội Mỹ Xuân B1 tại phường Phú Mỹ, Thành phố Hồ Chí Minh ", investor: "Công ty IDICO", location: "Phường Phú Mỹ, Bà Rịa - Vũng Tàu", totalArea: 3.40, height: 15, apartmentCount: 1200, progress: 20, status: "On Track", currentStep: "Thô đến tầng 6", parentStep: "Thực hiện dự án", childStep: "Thi công phần thân", currentAgency: "Sở Tài chính", currentDepartment: "Phòng Quản lý ngân sách", deadline: "2027-12-31", stage: "THỰC HIỆN ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p3" },
  { id: "36", code: "NOXH-P3-01", name: "Khu đất tại số 15K Phan Văn Trị, Phường Hạnh Thông, Thành phố Hồ Chí Minh", investor: "Chưa có chủ đầu tư", location: "Phường An Lạc, TP.HCM", totalArea: 1.10, height: 15, apartmentCount: 500, progress: 10, status: "Delayed", currentStep: "Móng", parentStep: "Thực hiện dự án", childStep: "Thi công phần móng", stepDeadline: "2025-11-20", delayDays: 30, currentAgency: "Sở Xây dựng", currentDepartment: "Phòng QLN & TTBĐS", deadline: "2028-06-30", stage: "CHUẨN BỊ ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p3" },
  { id: "37", code: "NOXH-P3-02", name: "Khu đất có diện tích 5.539,7m2 tại Phường Tăng Nhơn Phú (trước đây thuộc thửa số 11, Tờ bản đồ số 1, Phường Tân Phú, thành phố Thủ Đức) ", investor: "Chưa có chủ đầu tư", location: "Phường Tân Tạo, TP.HCM", totalArea: 0.80, height: 12, apartmentCount: 300, progress: 5, status: "Delayed", currentStep: "Móng", parentStep: "Thực hiện dự án", childStep: "Thi công phần móng", stepDeadline: "2025-12-05", delayDays: 15, currentAgency: "Sở Xây dựng", currentDepartment: "Phòng QLN & TTBĐS", deadline: "2028-12-31", stage: "CHUẨN BỊ ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p3" },
  { id: "38", code: "NOXH-P3-03", name: "Khu đất có diện tích 8.872,7 m2 tại Phường Phước Long (trước đây thuộc thửa đất số 01, tờ bản đồ số 24, Phường Phước Long B, Thành phố Thủ Đức)", investor: "Chưa có chủ đầu tư", location: "Xã Phong Phú, TP.HCM", totalArea: 2.00, height: 18, apartmentCount: 800, progress: 15, status: "Delayed", currentStep: "Thô đến tầng 2", parentStep: "Thực hiện dự án", childStep: "Thi công phần thân", stepDeadline: "2026-01-10", delayDays: 5, currentAgency: "Sở Xây dựng", currentDepartment: "Phòng PTĐT", deadline: "2028-09-30", stage: "CHUẨN BỊ ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p3" },  
  { id: "39", code: "NOXH-P3-04", name: "Khu đất có diện tích 11.367 m2 tại đường Gò Nổi, Phường Long Trường", investor: "Chưa có chủ đầu tư", location: "Xã An Phú Tây, TP.HCM", totalArea: 1.50, height: 15, apartmentCount: 600, progress: 10, status: "On Track", currentStep: "Móng", parentStep: "Thực hiện dự án", childStep: "Thi công phần móng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng PTĐT", deadline: "2028-12-31", stage: "CHUẨN BỊ ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p3" },  
  { id: "40", code: "NOXH-P3-05", name: "Khu đất có diện tích 8.323,9m2 tại số 15/6C đường Đặng Văn Bi, Phường Trường Thọ, Thành phố Thủ Đức", investor: "Chưa có chủ đầu tư", location: "Phường Thủ Đức, TP.HCM", totalArea: 1.20, height: 12, apartmentCount: 400, progress: 5, status: "On Track", currentStep: "Móng", parentStep: "Thực hiện dự án", childStep: "Thi công phần móng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng QLN & TTBĐS", deadline: "2029-06-30", stage: "CHUẨN BỊ ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p3" },
  { id: "41", code: "NOXH-P3-06", name: "Khu đất ký hiệu I-HH có diện tích khoảng 2,63ha tại khu dân cư Bình Trưng Đông - Cát Lái, Phường Cát Lái", investor: "Chưa có chủ đầu tư", location: "Phường Cát Lái, TP.HCM", totalArea: 1.80, height: 15, apartmentCount: 700, progress: 10, status: "On Track", currentStep: "Móng", parentStep: "Thực hiện dự án", childStep: "Thi công phần móng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng QLN & TTBĐS", deadline: "2029-12-31", stage: "THỰC HIỆN ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p3" },
    { id: "42", code: "NOXH-P3-07", name: "Lô CT3 Khu tái định cư 38ha", investor: "Chưa có chủ đầu tư", location: "Xã Đa Phước, TP.HCM", totalArea: 1.60, height: 15, apartmentCount: 650, progress: 10, status: "On Track", currentStep: "Móng", parentStep: "Thực hiện dự án", childStep: "Thi công phần móng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng QLCL CTXD", deadline: "2029-12-31", stage: "THỰC HIỆN ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p3" },
  { id: "43", code: "NOXH-P3-08", name: "Lô CT4 Khu tái định cư 38ha", investor: "Chưa có chủ đầu tư", location: "Xã Hưng Long, TP.HCM", totalArea: 1.40, height: 12, apartmentCount: 550, progress: 5, status: "On Track", currentStep: "Móng", parentStep: "Thực hiện dự án", childStep: "Thi công phần móng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng QLCL CTXD", deadline: "2030-06-30", stage: "THỰC HIỆN ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p3" },  
  { id: "44", code: "NOXH-P3-09", name: "Lô CT7 Khu tái định cư 38ha", investor: "Chưa có chủ đầu tư", location: "Xã Quy Đức, TP.HCM", totalArea: 1.30, height: 12, apartmentCount: 500, progress: 5, status: "On Track", currentStep: "Móng", parentStep: "Thực hiện dự án", childStep: "Thi công phần móng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng PTĐT", deadline: "2030-12-31", stage: "THỰC HIỆN ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p3" },
  { id: "45", code: "NOXH-P3-10", name: "Khu nhà ở xã hội tại lô CT6 Khu tái định cư 38ha", investor: "Chưa có chủ đầu tư", location: "Xã Tân Nhựt, TP.HCM", totalArea: 1.70, height: 15, apartmentCount: 700, progress: 10, status: "On Track", currentStep: "Móng", parentStep: "Thực hiện dự án", childStep: "Thi công phần móng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng PTĐT", deadline: "2030-12-31", stage: "THỰC HIỆN ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p3" },
  { id: "46", code: "NOXH-P3-11", name: "Khu đất số 61B đường số 16, phường Khánh Hội", investor: "Chưa có chủ đầu tư", location: "Xã Bình Lợi, TP.HCM", totalArea: 1.50, height: 15, apartmentCount: 600, progress: 10, status: "On Track", currentStep: "Móng", parentStep: "Thực hiện dự án", childStep: "Thi công phần móng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng QLN & TTBĐS", deadline: "2031-06-30", stage: "THỰC HIỆN ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p3" },
  { id: "47", code: "NOXH-P3-12", name: "Nhà ở xã hội trong dự án Khu đô thị 3 tháng 2, Phường 10 và Phường 11", investor: "Công ty TNHH Đầu tư và phát triển đô thị Vũng Tàu", location: "Phường Vườn Lài, TP.HCM", totalArea: 1.90, height: 18, apartmentCount: 800, progress: 15, status: "On Track", currentStep: "Thô đến tầng 2", parentStep: "Thực hiện dự án", childStep: "Thi công phần thân", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng PTĐT", deadline: "2031-12-31", stage: "THỰC HIỆN ĐẦU TƯ", isKeyProject: false, isPublicInvestment: false, processId: "p3" }];

export const INITIAL_INVESTORS = [
  'Công ty TNHH Thương mại – Xây dựng Lê Thành',
  'Tổng công ty Đầu tư và Phát triển Công nghiệp - CTCP',
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
  'Tổng Công ty Đầu tư Phát triển nhà và Đô thị',
];

export const INITIAL_PROJECT_GROUPS = ['Nhóm A', 'Nhóm B', 'Nhóm C'];
export const INITIAL_PROJECT_STATUSES = ['Đúng tiến độ', 'Trễ', 'Hoàn thành'];
export const INITIAL_PROJECT_STAGES = ['CHUẨN BỊ ĐẦU TƯ', 'THỰC HIỆN ĐẦU TƯ', 'KẾT THÚC ĐẦU TƯ'];
export const INITIAL_PROJECT_STEPS = [
  'Chấp thuận chủ trương đầu tư',
  'Quy hoạch chi tiết 1/500',
  'Quyết định đầu tư',
  'Giao đất / Cho thuê đất',
  'Thẩm định thiết kế cơ sở',
  'Giấy phép xây dựng',
  'Thi công xây dựng',
  'Nghiệm thu / Bàn giao'
];

export const INITIAL_AGENCIES = [
  { id: '1', name: 'Sở Xây dựng', displayOrder: 1, departments: ['Phòng PTĐT', 'Phòng QLXDCT DDCN', 'Phòng QLN & TTBĐS', 'Phòng KT & VLXD', 'Phòng QLCL CTXD', 'Phòng HTKT', 'Phòng QLBT & KTCTGT'] },
  { id: '2', name: 'Sở Quy hoạch Kiến trúc', displayOrder: 2, departments: ['Phòng Đầu tư', 'Phòng Quy hoạch - Kế hoạch sử dụng đất', 'Phòng Tài chính đầu tư', 'Phòng Quản lý quy hoạch chung', 'Phòng Quản lý quy hoạch phân khu'] },
  { id: '3', name: 'Sở NNMT', displayOrder: 3, departments: ['Phòng Thẩm định dự án', 'Phòng Quy hoạch - Kế hoạch sử dụng đất', 'Phòng Kinh tế đất', 'Chi cục Quản lý đất đai'] },
  { id: '5', name: 'Sở Tài chính', displayOrder: 4, departments: ['Phòng Quản lý ngân sách', 'Phòng Tài chính đầu tư', 'Phòng Thẩm định dự án'] },
  { id: '6', name: 'UBND cấp xã, phường', displayOrder: 5, departments: ['Phường Bình Đông', 'Phường Diên Hồng',  'Phường Tân Thới Hiệp','Phường Long Phước','Phường Rạch Dừa', 'Phường Rạch Ông', 'Phường Phú Định', 'Phường Phường An Nhơn',  'Phường An Khánh', 'Phường Thạnh Mỹ Tây', 'Phường Tân Thuận', 'Phường Bình Hưng Hòa A',  'Phường Tăng Nhơn Phú', 'Xã Hiệp Phước',  'Phường An Lạc','Phường Phước Long','Phường An Phú', 'Phường Thuận Giao', 'Phường Bình Tân',  'Xã Bình Hưng', 'Phường Hiệp Bình', 'Phường Hiệp Phú', 'Phường Long Trường',  'Phường Chánh Hiệp', 'Xã Tân Kiên',  'Phường Phú Mỹ', 'Phường Tân Tạo', 'Xã Phong Phú',  'Xã An Phú Tây',  'Phường Thủ Đức',  'Phường Cát Lái',  'Xã Đa Phước',  'Xã Hưng Long', 'Xã Quy Đức',  'Xã Tân Nhựt',  'Xã Bình Lợi',  'Phường Vườn Lài'] },
  { id: '7', name: 'UBND TP', displayOrder: 6, departments: ['Phòng Thẩm định dự án', 'Văn phòng UBND TP', 'Phòng Nội chính'] },
  { id: '8', name: 'HĐND TP', displayOrder: 7, departments: ['Ban Kinh tế - Ngân sách', 'Ban Đô thị'] },
  { id: '9', name: 'Công an TP (PCCC)', displayOrder: 8, departments: [] }
];

export const INITIAL_FUNDING_SOURCES = ['Vốn ngân sách', 'Vốn doanh nghiệp', 'Vốn vay', 'Nguồn tài chính công đoàn'];
export const INITIAL_STEP_STATUSES = ['Chưa bắt đầu', 'Đang xử lý', 'Chờ bổ sung hồ sơ', 'Đã trình', 'Đã phê duyệt', 'Hoàn thành', 'Bị trả hồ sơ', 'Tạm dừng'];
export const INITIAL_PRIORITIES = ['Thấp', 'Trung bình', 'Cao', 'Khẩn cấp'];
export const INITIAL_PROCESSING_RESULTS = ['Chưa có kết quả', 'Chấp thuận', 'Có ý kiến', 'Phê duyệt', 'Không chấp thuận', 'Yêu cầu bổ sung'];
export const INITIAL_LOCATIONS = [
  { ward: 'Phường Bình Đông', oldArea: 'Quận 8' },
  { ward: 'Phường Diên Hồng', oldArea: 'Quận 10' },
  { ward: 'Phường Tân Thới Hiệp', oldArea: 'phường Tân Thới Hiệp' },
  { ward: 'Phường Long Phước', oldArea: 'TP. Thủ Đức' },
  { ward: 'Phường Rạch Dừa', oldArea: 'Quận 7' },
  { ward: 'Phường Rạch Ông', oldArea: 'Huyện Bình Chánh' },
  { ward: 'Phường Phú Định', oldArea: 'Quận Bình Thạnh' },
  { ward: 'Phường Phường An Nhơn', oldArea: 'Quận 7' },
  { ward: 'Phường An Khánh', oldArea: 'Quận 6' },
  { ward: 'Phường Thạnh Mỹ Tây', oldArea: 'TP. Thủ Đức' },
  { ward: 'Phường Tân Thuận', oldArea: 'Bình Dương' },
  { ward: 'Phường Bình Hưng Hòa A', oldArea: 'Bình Dương' },
  { ward: 'Phường Tăng Nhơn Phú', oldArea: 'Bình Dương' },
  { ward: 'Xã Hiệp Phước', oldArea: 'Bình Dương' },
  { ward: 'Phường An Lạc', oldArea: 'TP. Thủ Đức' },
  { ward: 'Phường Phước Long', oldArea: 'TP. Thủ Đức' },
  { ward: 'Phường An Phú', oldArea: 'Bình Dương' },
  { ward: 'Phường Thuận Giao', oldArea: 'Bình Dương' },
  { ward: 'Phường Bình Tân', oldArea: 'Quận Bình Tân' },
  { ward: 'Xã Bình Hưng', oldArea: 'Huyện Bình Chánh' },
  { ward: 'Phường Hiệp Bình', oldArea: 'Bà Rịa - Vũng Tàu' },
  { ward: 'Phường Hiệp Phú', oldArea: 'TP. Thủ Đức' },
  { ward: 'Phường Long Trường', oldArea: 'TP. Thủ Đức' },
  { ward: 'Phường Chánh Hiệp', oldArea: 'Bình Dương' },
  { ward: 'Xã Tân Kiên', oldArea: 'Quận Bình Tân' },
  { ward: 'Phường Phú Mỹ', oldArea: 'Huyện Bình Chánh' },
  { ward: 'Phường Tân Tạo', oldArea: 'Huyện Bình Chánh' },
  { ward: 'Xã Phong Phú', oldArea: 'Huyện Bình Chánh' },
  { ward: 'Xã An Phú Tây', oldArea: 'Huyện Bình Chánh' },
  { ward: 'Phường Thủ Đức', oldArea: 'Huyện Bình Chánh' },
  { ward: 'Phường Cát Lái', oldArea: 'Huyện Bình Chánh' },
  { ward: 'Xã Đa Phước', oldArea: 'Huyện Bình Chánh' },
  { ward: 'Xã Hưng Long', oldArea: 'Huyện Bình Chánh' },
  { ward: 'Xã Quy Đức', oldArea: 'Huyện Bình Chánh' },
  { ward: 'Xã Tân Nhựt', oldArea: 'Huyện Bình Chánh' },
  { ward: 'Xã Bình Lợi', oldArea: 'Huyện Bình Chánh' },
  { ward: 'Phường Vườn Lài', oldArea: 'Huyện Bình Chánh' }
];

export const INITIAL_PROCESSES = [
  {
    "id": "p1",
    "name": "Quy trình NOXH ĐẤT NN",
    "parentSteps": [
      {
        "id": "ps1",
        "name": "Chấp thuận chủ trương đầu tư đồng thời giao chủ đầu tư theo pháp luật về nhà ở",
        "slaDays": 40,
        "stage": "CHUẨN BỊ ĐẦU TƯ",
        "childSteps": [
          {
            "id": "cs1",
            "name": "Công bố thông tin",
            "agency": "Sở Xây dựng",
            "department": "",
            "slaDays": 30
          },
          {
            "id": "cs2",
            "name": "Chấp thuận chủ trương đầu tư",
            "agency": "UBND TP",
            "department": "",
            "slaDays": 7
          },
          {
            "id": "cs3",
            "name": "Luân chuyển / phê duyệt",
            "agency": "UBND TP",
            "department": "",
            "slaDays": 3
          }
        ]
      },
      {
        "id": "ps2",
        "name": "Thẩm định, phê duyệt quy hoạch chi tiết tỷ lệ 1/500 hoặc chấp thuận quy hoạch tổng mặt bằng tỷ lệ 1/500 (quy hoạch chi tiết được lập theo quy trình rút gọn) theo pháp luật về quy hoạch đô thị và nông thôn",
        "slaDays": 22,
        "stage": "CHUẨN BỊ ĐẦU TƯ",
        "childSteps": [
          {
            "id": "cs4",
            "name": "Thẩm định / lấy ý kiến quy hoạch",
            "agency": "Sở Quy hoạch Kiến trúc; UBND cấp xã, phường",
            "department": "",
            "slaDays": 15
          },
          {
            "id": "cs5",
            "name": "Phê duyệt / có ý kiến địa phương",
            "agency": "UBND TP; UBND xã phường",
            "department": "",
            "slaDays": 7
          }
        ]
      },
      {
        "id": "ps3",
        "name": "Giao đất, cho thuê đất hoặc cho phép chuyển mục đích sử dụng đất theo pháp luật về đất đai",
        "slaDays": 7,
        "stage": "CHUẨN BỊ ĐẦU TƯ",
        "childSteps": [
          {
            "id": "cs6",
            "name": "Thẩm định / xử lý hồ sơ đất đai",
            "agency": "Sở NNMT; UBND cấp xã, phường",
            "department": "",
            "slaDays": 5
          },
          {
            "id": "cs7",
            "name": "Phê duyệt / có ý kiến địa phương",
            "agency": "UBND TP; UBND xã phường",
            "department": "",
            "slaDays": 2
          }
        ]
      },
      {
        "id": "ps4",
        "name": "Cấp giấy phép xây dựng",
        "slaDays": 15,
        "stage": "THỰC HIỆN ĐẦU TƯ",
        "childSteps": [
          {
            "id": "cs8",
            "name": "Cấp giấy phép xây dựng",
            "agency": "Sở Xây dựng",
            "department": "",
            "slaDays": 15
          }
        ]
      },
      {
        "id": "ps5",
        "name": "Phê duyệt giá bán, giá thuê mua nhà ở xã hội",
        "slaDays": 0,
        "stage": "THỰC HIỆN ĐẦU TƯ",
        "childSteps": [
          {
            "id": "cs9",
            "name": "Phê duyệt giá bán, giá thuê mua nhà ở xã hội",
            "agency": "Chủ đầu tư",
            "department": "",
            "slaDays": 0
          }
        ]
      },
      {
        "id": "ps6",
        "name": "Công bố thời gian tiếp nhận hồ sơ đăng ký mua, thuê mua nhà ở xã hội và thủ tục thông báo nhà ở xã hội hình thành trong tương lai đủ điều kiện được bán, cho thuê mua",
        "slaDays": 30,
        "stage": "THỰC HIỆN ĐẦU TƯ",
        "childSteps": [
          {
            "id": "cs10",
            "name": "Công bố thời gian tiếp nhận hồ sơ",
            "agency": "Sở Xây dựng",
            "department": "",
            "slaDays": 30
          },
          {
            "id": "cs11",
            "name": "Thông báo nhà ở hình thành trong tương lai đủ điều kiện được bán, cho thuê mua",
            "agency": "Sở Xây dựng",
            "department": "",
            "slaDays": 15
          }
        ]
      },
      {
        "id": "ps7",
        "name": "Có ý kiến đối với danh sách các đối tượng dự kiến được giải quyết mua nhà ở xã hội đối với dự án nhà ở xã hội không sử dụng vốn đầu tư công, nguồn tài chính công đoàn",
        "slaDays": 10,
        "stage": "THỰC HIỆN ĐẦU TƯ",
        "childSteps": [
          {
            "id": "cs12",
            "name": "Có ý kiến đối với danh sách đối tượng dự kiến được giải quyết mua nhà ở xã hội",
            "agency": "Sở Xây dựng",
            "department": "",
            "slaDays": 10
          }
        ]
      },
      {
        "id": "ps8",
        "name": "Kiểm tra công tác nghiệm thu hoàn thành công trình của cơ quan chuyên môn về xây dựng tại địa phương",
        "slaDays": 15,
        "stage": "KẾT THÚC ĐẦU TƯ",
        "childSteps": [
          {
            "id": "cs13",
            "name": "Kiểm tra nghiệm thu hoàn thành công trình cấp II, III",
            "agency": "Sở Xây dựng",
            "department": "",
            "slaDays": 10
          },
          {
            "id": "cs14",
            "name": "Kiểm tra nghiệm thu hoàn thành công trình cấp I, đặc biệt",
            "agency": "Sở Xây dựng",
            "department": "",
            "slaDays": 15
          }
        ]
      },
      {
        "id": "ps9",
        "name": "Kiểm tra giá bán, giá thuê mua nhà ở xã hội",
        "slaDays": 15,
        "stage": "KẾT THÚC ĐẦU TƯ",
        "childSteps": [
          {
            "id": "cs15",
            "name": "Kiểm tra giá bán, giá thuê mua nhà ở xã hội",
            "agency": "Sở Xây dựng",
            "department": "",
            "slaDays": 15
          }
        ]
      }
    ]
  },
  {
    "id": "p2",
    "name": "Quy trình NOXH Đất Doanh nghiệp",
    "parentSteps": [
      {
        "id": "ps10",
        "name": "Chấp thuận chủ trương đầu tư đồng thời giao chủ đầu tư theo pháp luật về nhà ở",
        "slaDays": 18,
        "stage": "CHUẨN BỊ ĐẦU TƯ",
        "childSteps": [
          {
            "id": "cs16",
            "name": "Chấp thuận chủ trương đầu tư đồng thời giao chủ đầu tư",
            "agency": "Sở Xây dựng",
            "department": "",
            "slaDays": 15
          },
          {
            "id": "cs17",
            "name": "Phê duyệt / xử lý tại UBND TP",
            "agency": "UBND TP",
            "department": "",
            "slaDays": 3
          }
        ]
      },
      {
        "id": "ps11",
        "name": "Thẩm định, phê duyệt quy hoạch chi tiết tỷ lệ 1/500 hoặc chấp thuận quy hoạch tổng mặt bằng tỷ lệ 1/500 (quy hoạch chi tiết được lập theo quy trình rút gọn) theo pháp luật về quy hoạch đô thị và nông thôn",
        "slaDays": 22,
        "stage": "CHUẨN BỊ ĐẦU TƯ",
        "childSteps": [
          {
            "id": "cs18",
            "name": "Thẩm định / lấy ý kiến quy hoạch",
            "agency": "Sở Quy hoạch Kiến trúc; UBND cấp xã, phường",
            "department": "",
            "slaDays": 15
          },
          {
            "id": "cs19",
            "name": "Phê duyệt / có ý kiến địa phương",
            "agency": "UBND TP; UBND xã phường",
            "department": "",
            "slaDays": 7
          }
        ]
      },
      {
        "id": "ps12",
        "name": "Giao đất, cho thuê đất hoặc cho phép chuyển mục đích sử dụng đất theo pháp luật về đất đai",
        "slaDays": 7,
        "stage": "CHUẨN BỊ ĐẦU TƯ",
        "childSteps": [
          {
            "id": "cs20",
            "name": "Thẩm định / xử lý hồ sơ đất đai",
            "agency": "Sở NNMT; UBND cấp xã, phường",
            "department": "",
            "slaDays": 5
          },
          {
            "id": "cs21",
            "name": "Phê duyệt / có ý kiến địa phương",
            "agency": "UBND TP; UBND xã phường",
            "department": "",
            "slaDays": 2
          }
        ]
      },
      {
        "id": "ps13",
        "name": "Cấp giấy phép xây dựng",
        "slaDays": 15,
        "stage": "THỰC HIỆN ĐẦU TƯ",
        "childSteps": [
          {
            "id": "cs22",
            "name": "Cấp giấy phép xây dựng",
            "agency": "Sở Xây dựng",
            "department": "",
            "slaDays": 15
          }
        ]
      },
      {
        "id": "ps14",
        "name": "Phê duyệt giá bán, giá thuê mua nhà ở xã hội",
        "slaDays": 0,
        "stage": "THỰC HIỆN ĐẦU TƯ",
        "childSteps": [
          {
            "id": "cs23",
            "name": "Phê duyệt giá bán, giá thuê mua nhà ở xã hội",
            "agency": "Chủ đầu tư",
            "department": "",
            "slaDays": 0
          }
        ]
      },
      {
        "id": "ps15",
        "name": "Công bố thời gian tiếp nhận hồ sơ đăng ký mua, thuê mua nhà ở xã hội và thủ tục thông báo nhà ở xã hội hình thành trong tương lai đủ điều kiện được bán, cho thuê mua",
        "slaDays": 30,
        "stage": "THỰC HIỆN ĐẦU TƯ",
        "childSteps": [
          {
            "id": "cs24",
            "name": "Công bố thời gian tiếp nhận hồ sơ đăng ký mua, thuê mua nhà ở xã hội",
            "agency": "Sở Xây dựng",
            "department": "",
            "slaDays": 30
          },
          {
            "id": "cs25",
            "name": "Thông báo nhà ở xã hội hình thành trong tương lai đủ điều kiện được bán, cho thuê mua",
            "agency": "Sở Xây dựng",
            "department": "",
            "slaDays": 15
          }
        ]
      },
      {
        "id": "ps16",
        "name": "Có ý kiến đối với danh sách các đối tượng dự kiến được giải quyết mua nhà ở xã hội đối với dự án nhà ở xã hội không sử dụng vốn đầu tư công, nguồn tài chính công đoàn",
        "slaDays": 10,
        "stage": "THỰC HIỆN ĐẦU TƯ",
        "childSteps": [
          {
            "id": "cs26",
            "name": "Có ý kiến đối với danh sách các đối tượng dự kiến được giải quyết mua nhà ở xã hội",
            "agency": "Sở Xây dựng",
            "department": "",
            "slaDays": 10
          }
        ]
      },
      {
        "id": "ps17",
        "name": "Kiểm tra công tác nghiệm thu hoàn thành công trình của cơ quan chuyên môn về xây dựng tại địa phương",
        "slaDays": 15,
        "stage": "KẾT THÚC ĐẦU TƯ",
        "childSteps": [
          {
            "id": "cs27",
            "name": "Kiểm tra nghiệm thu hoàn thành công trình cấp II, III",
            "agency": "Sở Xây dựng",
            "department": "",
            "slaDays": 10
          },
          {
            "id": "cs28",
            "name": "Kiểm tra nghiệm thu hoàn thành công trình cấp I, đặc biệt",
            "agency": "Sở Xây dựng",
            "department": "",
            "slaDays": 15
          }
        ]
      },
      {
        "id": "ps18",
        "name": "Kiểm tra giá bán, giá thuê mua nhà ở xã hội",
        "slaDays": 15,
        "stage": "KẾT THÚC ĐẦU TƯ",
        "childSteps": [
          {
            "id": "cs29",
            "name": "Kiểm tra giá bán, giá thuê mua nhà ở xã hội",
            "agency": "Sở Xây dựng",
            "department": "",
            "slaDays": 15
          }
        ]
      }
    ]
  },
  {
    "id": "p3",
    "name": "Quy trình NOXH Vốn đầu tư công",
    "parentSteps": [
      {
        "id": "ps19",
        "name": "Giao nhiệm vụ chuẩn bị đầu tư",
        "slaDays": 12,
        "stage": "CHUẨN BỊ ĐẦU TƯ",
        "childSteps": [
          {
            "id": "cs30",
            "name": "Chủ trì giao nhiệm vụ chuẩn bị đầu tư",
            "agency": "Sở Tài chính (chủ trì)",
            "department": "",
            "slaDays": 5
          },
          {
            "id": "cs31",
            "name": "Phối hợp giao nhiệm vụ chuẩn bị đầu tư",
            "agency": "Sở Xây dựng (phối hợp)",
            "department": "",
            "slaDays": 2
          },
          {
            "id": "cs32",
            "name": "Phê duyệt / ban hành nhiệm vụ",
            "agency": "UBND TP",
            "department": "",
            "slaDays": 5
          }
        ]
      },
      {
        "id": "ps20",
        "name": "Lập, thẩm định Báo cáo nghiên cứu tiền khả thi (nhóm A) / Báo cáo đề xuất chủ trương đầu tư dự án (nhóm B, C) và trình cơ quan có thẩm quyền quyết định chủ trương đầu tư",
        "slaDays": 17,
        "stage": "CHUẨN BỊ ĐẦU TƯ",
        "childSteps": [
          {
            "id": "cs33",
            "name": "Thẩm định hồ sơ dự án nhóm B, C",
            "agency": "Sở Tài chính",
            "department": "",
            "slaDays": 14
          },
          {
            "id": "cs34",
            "name": "Thẩm định hồ sơ dự án nhóm A",
            "agency": "Hội đồng thẩm định Thành phố",
            "department": "",
            "slaDays": 20
          },
          {
            "id": "cs35",
            "name": "Trình / quyết định chủ trương đầu tư",
            "agency": "UBND TP; HĐND TP",
            "department": "",
            "slaDays": 3
          }
        ]
      },
      {
        "id": "ps21",
        "name": "Đăng ký kế hoạch vốn đầu tư công trung hạn",
        "slaDays": 0,
        "stage": "CHUẨN BỊ ĐẦU TƯ",
        "childSteps": [
          {
            "id": "cs36",
            "name": "Đăng ký kế hoạch vốn đầu tư công trung hạn",
            "agency": "Sở Tài chính",
            "department": "",
            "slaDays": 0
          },
          {
            "id": "cs37",
            "name": "Trình / phê duyệt kế hoạch vốn",
            "agency": "UBND TP; HĐND TP",
            "department": "",
            "slaDays": 0
          }
        ]
      },
      {
        "id": "ps22",
        "name": "Lập báo cáo nghiên cứu khả thi đầu tư xây dựng, trình thẩm định và phê duyệt quyết định đầu tư",
        "slaDays": 23,
        "stage": "THỰC HIỆN ĐẦU TƯ",
        "childSteps": [
          {
            "id": "cs38",
            "name": "Thẩm định dự án nhóm A",
            "agency": "Sở Xây dựng",
            "department": "",
            "slaDays": 20
          },
          {
            "id": "cs39",
            "name": "Thẩm định dự án nhóm B",
            "agency": "Sở Xây dựng",
            "department": "",
            "slaDays": 15
          },
          {
            "id": "cs40",
            "name": "Thẩm định dự án nhóm C",
            "agency": "Sở Xây dựng",
            "department": "",
            "slaDays": 10
          },
          {
            "id": "cs41",
            "name": "Phê duyệt quyết định đầu tư",
            "agency": "UBND TP (nhóm A); Sở Xây dựng (nhóm B, C)",
            "department": "",
            "slaDays": 3
          }
        ]
      },
      {
        "id": "ps23",
        "name": "Lập thiết kế xây dựng triển khai sau thiết kế cơ sở và dự toán của dự án, trình thẩm định và phê duyệt",
        "slaDays": 22,
        "stage": "THỰC HIỆN ĐẦU TƯ",
        "childSteps": [
          {
            "id": "cs42",
            "name": "Thẩm định thiết kế và dự toán công trình cấp I, đặc biệt",
            "agency": "Sở Xây dựng",
            "department": "",
            "slaDays": 20
          },
          {
            "id": "cs43",
            "name": "Thẩm định thiết kế và dự toán công trình cấp II, III",
            "agency": "Sở Xây dựng",
            "department": "",
            "slaDays": 15
          },
          {
            "id": "cs44",
            "name": "Phê duyệt thiết kế và dự toán",
            "agency": "Chủ đầu tư",
            "department": "",
            "slaDays": 0
          }
        ]
      },
      {
        "id": "ps24",
        "name": "Thủ tục cho thuê, cho thuê mua nhà ở xã hội do Nhà nước đầu tư xây dựng bằng vốn đầu tư công",
        "slaDays": 15,
        "stage": "THỰC HIỆN ĐẦU TƯ",
        "childSteps": [
          {
            "id": "cs45",
            "name": "Kiểm tra / xử lý thủ tục cho thuê, cho thuê mua",
            "agency": "Sở Xây dựng",
            "department": "",
            "slaDays": 10
          },
          {
            "id": "cs46",
            "name": "Phê duyệt / chấp thuận",
            "agency": "UBND TP hoặc Sở Xây dựng",
            "department": "",
            "slaDays": 5
          }
        ]
      },
      {
        "id": "ps25",
        "name": "Kiểm tra giá bán, giá thuê mua nhà ở xã hội",
        "slaDays": 15,
        "stage": "KẾT THÚC ĐẦU TƯ",
        "childSteps": [
          {
            "id": "cs47",
            "name": "Kiểm tra giá bán, giá thuê mua công trình cấp I, đặc biệt",
            "agency": "Sở Xây dựng",
            "department": "",
            "slaDays": 15
          },
          {
            "id": "cs48",
            "name": "Kiểm tra giá bán, giá thuê mua công trình cấp II, III",
            "agency": "Sở Xây dựng",
            "department": "",
            "slaDays": 10
          }
        ]
      },
      {
        "id": "ps26",
        "name": "Lập, trình phê duyệt giá thuê, giá thuê mua nhà ở xã hội",
        "slaDays": 18,
        "stage": "KẾT THÚC ĐẦU TƯ",
        "childSteps": [
          {
            "id": "cs49",
            "name": "Lập / thẩm định giá thuê, giá thuê mua",
            "agency": "Sở Xây dựng",
            "department": "",
            "slaDays": 15
          },
          {
            "id": "cs50",
            "name": "Phê duyệt giá thuê, giá thuê mua",
            "agency": "UBND TP",
            "department": "",
            "slaDays": 3
          }
        ]
      }
    ]
  }
];

export const INITIAL_FOLLOWERS = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C'];
