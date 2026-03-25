import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- Mock Data ---
  let projects = [
    // Phụ lục 01: 10 projects
    { id: "1", code: "NOXH-HCM-01", name: "Nhà ở xã hội tại số 04 Phan Chu Trinh, Phường 12, quận Bình Thạnh", investor: "Ban Quản lý dự án đầu tư xây dựng các công trình dân dụng và công nghiệp", location: "Phường Bình Thạnh, TP.HCM", totalArea: 1.21, height: 20, apartmentCount: 864, progress: 85, status: "On Track", currentStep: "Thi công xây dựng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng Phát triển nhà và Thị trường BĐS", deadline: "2027-04-30", stage: "Thực hiện đầu tư", isKeyProject: true, isPublicInvestment: true, fundingSource: "Vốn ngân sách" },
    { id: "2", code: "NOXH-HCM-02", name: "Dự án Nhà ở xã hội Khải Vy, số 4 Đào Trí, P Phú Thuận, Quận 7", investor: "Công ty CP Tập đoàn Khải Thịnh", location: "Phường Phú Thuận, TP.HCM", totalArea: 0.26, height: 22, apartmentCount: 324, progress: 40, status: "On Track", currentStep: "Thi công xây dựng", currentAgency: "Sở Quy hoạch Kiến trúc", deadline: "2027-12-31", stage: "Thực hiện đầu tư", isKeyProject: true, isPublicInvestment: false, fundingSource: "Vốn doanh nghiệp" },
    { id: "3", code: "NOXH-HCM-03", name: "Khu đất tại số 165/5 Nguyễn Văn Luông, Phường 10, Quận 6", investor: "Công ty CP Pearl Land", location: "Phường Bình Phú, TP.HCM", totalArea: 0.41, height: 18, apartmentCount: 290, progress: 60, status: "On Track", currentStep: "Thi công xây dựng", currentAgency: "Sở NNMT", deadline: "2027-06-30", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "4", code: "NOXH-HCM-04", name: "Dự án tại 02 lô đất ký hiệu C2, D1 thuộc dự án Khu dân cư 28ha xã Nhơn Đức, huyện Nhà Bè", investor: "Công ty Cổ phần Pearl Land", location: "Xã Hiệp Phước, TP.HCM", totalArea: 1.57, height: 18, apartmentCount: 435, progress: 30, status: "Warning", currentStep: "Giao đất / Cho thuê đất", currentAgency: "Sở Tài chính", deadline: "2027-08-31", stage: "Thực hiện đầu tư", isKeyProject: true, isPublicInvestment: false },
    { id: "5", code: "NOXH-HCM-05", name: "DA Nhà ở xã hội Lê Thành Tân Kiên", investor: "Công ty TNHH Xây dựng Thương mại Lê Thành", location: "Xã Tân Nhật, TP.HCM", totalArea: 2.01, height: 18, apartmentCount: 1456, progress: 50, status: "On Track", currentStep: "Thi công xây dựng", currentAgency: "UBND TP", deadline: "2027-09-30", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "6", code: "NOXH-HCM-06", name: "Dự án Nhà ở xã hội tại số 35 Lê Văn Chí, Phường Linh Trung, thành phố Thủ Đức", investor: "Cty TNHH Phúc Lộc Thọ", location: "Phường Linh Xuân, TP.HCM", totalArea: 0.86, height: 17, apartmentCount: 160, progress: 100, status: "On Track", currentStep: "Nghiệm thu / Bàn giao", currentAgency: "HĐND TP", deadline: "2026-12-31", stage: "Hoàn thành", isKeyProject: false, isPublicInvestment: false },
    { id: "7", code: "NOXH-BD-01", name: "Nhà ở an sinh xã hội (thuộc dự án khu đô thị sinh thái Chánh Mỹ - giai đoạn 1)", investor: "Tổng Công ty Đầu tư Phát triển nhà và Đô thị (HUD)", location: "Phường Chánh Mỹ, Bình Dương", totalArea: 2.76, height: 12, apartmentCount: 522, progress: 80, status: "On Track", currentStep: "Thi công xây dựng", currentAgency: "168 Phường xã", deadline: "2027-05-30", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: true },
    { id: "8", code: "NOXH-BD-02", name: "Nhà ở an sinh xã hội - Khu 5 Định Hoà", investor: "Tổng công ty Đầu tư và Phát triển Công nghiệp - CTCP", location: "Phường Định Hòa, Bình Dương", totalArea: 2.30, height: 22, apartmentCount: 2372, progress: 40, status: "On Track", currentStep: "Thi công xây dựng", currentAgency: "Công an TP (PCCC)", deadline: "2027-12-31", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: true },
    { id: "9", code: "NOXH-BD-03", name: "Khu nhà ở xã hội cao tầng Phúc Đạt Tân Uyên", investor: "Công ty TNHH Sản xuất và Thương mại Phúc Đạt", location: "Phường Tân Hiệp, Bình Dương", totalArea: 1.14, height: 18, apartmentCount: 936, progress: 80, status: "On Track", currentStep: "Thi công xây dựng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng Quản lý nhà và Công sở", deadline: "2027-03-30", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "10", code: "NOXH-BD-04", name: "Dự án Khu chung cư Nhà ở xã hội Thạnh Tân", investor: "Công ty TNHH Đầu tư Xây dựng Thạnh Tân", location: "Phường Dĩ An, Bình Dương", totalArea: 0.88, height: 19, apartmentCount: 1160, progress: 80, status: "On Track", currentStep: "Thi công xây dựng", currentAgency: "Sở Quy hoạch Kiến trúc", deadline: "2027-05-30", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    // Phụ lục 02: 25 projects
    { id: "11", code: "NOXH-QHKT-01", name: "Nhà ở xã hội thuộc dự án Khu dân cư Tân Thuận Tây, Quận 7", investor: "Công ty CP ĐTXD Xuân Mai Sài Gòn", location: "Phường Tân Thuận Tây, TP.HCM", totalArea: 1.28, height: 38, apartmentCount: 1300, progress: 20, status: "On Track", currentStep: "Thô đến tầng 8", currentAgency: "Sở NNMT", deadline: "2027-12-31", stage: "Chuẩn bị đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "12", code: "NOXH-QHKT-02", name: "Nhà ở xã hội - Chung cư Tanimex tại Phường Bình Hưng Hòa, quận Bình Tân", investor: "Cty CP SX KD XNK DV & ĐT Tân Bình Tanimex", location: "Phường An Lạc, TP.HCM", totalArea: 1.99, height: 9, apartmentCount: 392, progress: 30, status: "On Track", currentStep: "Thô đến tầng 5", currentAgency: "Sở Tài chính", deadline: "2027-06-30", stage: "Chuẩn bị đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "13", code: "NOXH-QHKT-03", name: "Khu đất số 7/39 ấp Cây Dầu, Phường Tăng Nhơn Phú", investor: "Công ty Cổ phần An Cư Đức Phú", location: "Phường Tăng Nhơn Phú, TP.HCM", totalArea: 0.63, height: 22, apartmentCount: 477, progress: 20, status: "On Track", currentStep: "Thô đến tầng 8", currentAgency: "UBND TP", deadline: "2027-12-31", stage: "Chuẩn bị đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "14", code: "NOXH-QHKT-04", name: "Nhà ở xã hội thuộc dự án Khu dân cư Nhơn Đức Nhà Bè", investor: "Công ty Cổ phần Bất động sản Nhà Bè", location: "Xã Hiệp Phước, TP.HCM", totalArea: 2.10, height: 20, apartmentCount: 421, progress: 20, status: "On Track", currentStep: "Thô đến tầng 6", currentAgency: "HĐND TP", deadline: "2027-12-31", stage: "Chuẩn bị đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "15", code: "NOXH-QHKT-05", name: "Khu nhà ở cao tầng Hoàng Nam - Lê Cơ", investor: "Cty TNHH XD TM Hoàng Nam", location: "Phường An Lạc, TP.HCM", totalArea: 1.06, height: 18, apartmentCount: 750, progress: 20, status: "On Track", currentStep: "Thô đến tầng 4", currentAgency: "168 Phường xã", deadline: "2027-12-31", stage: "Chuẩn bị đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "16", code: "NOXH-NNMT-01", name: "Nhà ở xã hội Nam Lý, 91A Đỗ Xuân Hợp", investor: "Cty CP Địa ốc Thảo Điền", location: "Phường Phước Long, TP.HCM", totalArea: 0.46, height: 25, apartmentCount: 291, progress: 20, status: "On Track", currentStep: "Thô đến tầng 8", currentAgency: "Công an TP (PCCC)", deadline: "2027-12-31", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "17", code: "NOXH-NNMT-02", name: "Nhà ở xã hội xã Long Thới, huyện Nhà Bè", investor: "Cty CPXD & KD Địa ốc Hòa Bình", location: "Xã Hiệp Phước, TP.HCM", totalArea: 3.02, height: 12, apartmentCount: 462, progress: 20, status: "On Track", currentStep: "Thô đến tầng 3", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng Thẩm định dự án", deadline: "2027-09-30", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "18", code: "NOXH-CA-01", name: "Nhà ở xã hội - Khu 2 Việt Sing", investor: "Tổng Công ty Đầu tư và Phát triển Công nghiệp - CTCP", location: "Phường An Phú, Bình Dương", totalArea: 1.15, height: 22, apartmentCount: 755, progress: 20, status: "On Track", currentStep: "Thô đến tầng 10", currentAgency: "Sở Quy hoạch Kiến trúc", deadline: "2027-12-31", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "19", code: "NOXH-CA-02", name: "Nhà ở xã hội - Khu 7 Việt Sing", investor: "Tổng Công ty Đầu tư và Phát triển Công nghiệp - CTCP", location: "Phường Thuận Giao, Bình Dương", totalArea: 0.81, height: 22, apartmentCount: 766, progress: 20, status: "On Track", currentStep: "Thô đến tầng 10", currentAgency: "Sở NNMT", deadline: "2027-12-31", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "20", code: "NOXH-CA-03", name: "Căn hộ Lê Thành Tân Tạo 2", investor: "Công ty TNHH Thương mại – Xây dựng Lê Thành", location: "Phường Bình Tân, TP.HCM", totalArea: 0.33, height: 18, apartmentCount: 494, progress: 20, status: "On Track", currentStep: "Thô đến tầng 7", currentAgency: "Sở Tài chính", deadline: "2027-10-31", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "21", code: "NOXH-CA-04", name: "Nhà ở xã hội thuộc dự án Khu nhà ở Tiến Phước tại Khu B - Lô số 1 Khu 9AB- Đô thị mới Nam Thành phố", investor: "Công ty Cổ phần Bất động sản Tiến Phước", location: "Xã Bình Hưng, TP.HCM", totalArea: 0.19, height: 18, apartmentCount: 284, progress: 20, status: "On Track", currentStep: "Thô đến tầng 4", currentAgency: "UBND TP", deadline: "2027-12-31", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "22", code: "NOXH-CA-05", name: "Nhà ở xã hội trong dự án Khu đô thị 3 tháng 2, Phường 10 và Phường 11", investor: "Công ty TNHH Đầu tư và phát triển đô thị Vũng Tàu", location: "Phường Rạch Dừa, Bà Rịa - Vũng Tàu", totalArea: 4.60, height: 12, apartmentCount: 1300, progress: 20, status: "On Track", currentStep: "Thô đến tầng 4", currentAgency: "HĐND TP", deadline: "2028-06-30", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "23", code: "NOXH-CA-06", name: "Khu nhà ở Ecotown Phú Mỹ (Giai đoạn 2 thực hiện chung cư CC2), Phường Phú Mỹ", investor: "Công ty Hodeco", location: "Phường Phú Mỹ, Bà Rịa - Vũng Tàu", totalArea: 0.40, height: 18, apartmentCount: 352, progress: 20, status: "On Track", currentStep: "Thô đến tầng 8", currentAgency: "168 Phường xã", deadline: "2027-10-31", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "24", code: "NOXH-SXD-01", name: "Khu dân cư Phường Long Trường, thành phố Thủ Đức", investor: "Công ty TNHH Xây dựng và Kinh doanh nhà Điền Phúc Thành", location: "Phường Hiệp Phú, TP.HCM", totalArea: 1.43, height: 6, apartmentCount: 558, progress: 100, status: "On Track", currentStep: "Hoàn thành", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng Thẩm định dự án", deadline: "2026-12-31", stage: "Hoàn thành", isKeyProject: false, isPublicInvestment: false },
    { id: "25", code: "NOXH-SXD-02", name: "Nhà ở xã hội thuộc dự án Khu nhà ở tại Phường Phú Hữu, thành phố Thủ Đức (quỹ đất 20%)", investor: "Công ty Cổ phần Bất động sản Dragon Village", location: "Phường Long Trường, TP.HCM", totalArea: 1.89, height: 8, apartmentCount: 764, progress: 20, status: "On Track", currentStep: "Xong thô", currentAgency: "Sở Quy hoạch Kiến trúc", deadline: "2027-03-31", stage: "Kết thúc đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "26", code: "NOXH-SXD-03", name: "Nhà ở xã hội thuộc dự án Khu nhà ở Phường Phú Hữu, thành phố Thủ Đức (quỹ đất 20%)", investor: "Cty CP BĐS Exim", location: "Phường Long Trường, TP.HCM", totalArea: 1.70, height: 23, apartmentCount: 1379, progress: 20, status: "On Track", currentStep: "Thô đến tầng 6", currentAgency: "Sở NNMT", deadline: "2027-12-31", stage: "Kết thúc đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "27", code: "NOXH-SXD-04", name: "Nhà ở xã hội tại phường Long Phước, thành phố Thủ Đức (quỹ đất 20%)", investor: "Công ty CP Phát triển Thành phố Xanh", location: "Phường Long Phước, TP.HCM", totalArea: 26.60, height: 9, apartmentCount: 3284, progress: 20, status: "On Track", currentStep: "Thô đến tầng 6", currentAgency: "Sở Tài chính", deadline: "2027-06-30", stage: "Kết thúc đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "28", code: "NOXH-SXD-05", name: "Nhà ở xã hội thuộc dự án Khu dân cư Hiệp Phước I, xã Hiệp Phước, huyện Nhà Bè (quỹ đất 20%)", investor: "Công ty TNHH MTV Phát triển Công nghiệp Tân Thuận (IPC)", location: "Xã Hiệp Phước, TP.HCM", totalArea: 2.59, height: 5, apartmentCount: 800, progress: 20, status: "On Track", currentStep: "Thô đến tầng 4", currentAgency: "UBND TP", deadline: "2027-06-30", stage: "Kết thúc đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "29", code: "NOXH-SXD-06", name: "Nhà ở xã hội thuộc dự án Khu dân cư số 6 thuộc Khu dân cư Công viên giải trí Hiệp Bình Phước", investor: "Tổng Công ty Đầu tư Phát triển nhà và Đô thị", location: "Phường Hiệp Bình, TP.HCM", totalArea: 1.37, height: 7, apartmentCount: 209, progress: 100, status: "On Track", currentStep: "Xong thô", currentAgency: "HĐND TP", deadline: "2027-03-31", stage: "Kết thúc đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "30", code: "NOXH-SXD-07", name: "Nhà ở an sinh xã hội - Khu 3 Định Hoà (giai đoạn 1)", investor: "Tổng công ty Đầu tư và Phát triển Công nghiệp - CTCP", location: "Phường Chánh Hiệp, Bình Dương", totalArea: 0.95, height: 20, apartmentCount: 1178, progress: 20, status: "On Track", currentStep: "Thô đến tầng 10", currentAgency: "168 Phường xã", deadline: "2027-12-31", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "31", code: "NOXH-SXD-08", name: "Nhà ở an sinh xã hội - Khu 4 Định Hoà", investor: "Tổng công ty Đầu tư và Phát triển Công nghiệp - CTCP", location: "Phường Chánh Hiệp, Bình Dương", totalArea: 2.57, height: 20, apartmentCount: 3190, progress: 20, status: "On Track", currentStep: "Thô đến tầng 10", currentAgency: "168 Phường xã", deadline: "2027-12-31", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "32", code: "NOXH-SXD-09", name: "Nhà ở xã hội tại dự án Khu nhà ở 11A, xã Bình Hưng, huyện Bình Chánh (quỹ đất 20%)", investor: "Công ty TNHH MTV Đầu tư Kinh doanh nhà Khang Phúc", location: "Xã Tân Kiên, TP.HCM", totalArea: 1.33, height: 25, apartmentCount: 860, progress: 20, status: "On Track", currentStep: "Thô đến tầng 10", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng Phát triển nhà và Thị trường BĐS", deadline: "2027-12-31", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "33", code: "NOXH-SXD-10", name: "Nhà ở xã hội tại dự án Khu nhà ở Vạn Phúc 3, phường Hiệp Bình Phước, thành phố Thủ Đức (quỹ đất 20%)", investor: "Công ty Cổ phần Đầu tư địa ốc Vạn Phúc", location: "Phường Hiệp Bình, TP.HCM", totalArea: 1.50, height: 21, apartmentCount: 1085, progress: 20, status: "On Track", currentStep: "Thô đến tầng 5", currentAgency: "Sở Quy hoạch Kiến trúc", deadline: "2027-12-31", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "34", code: "NOXH-SXD-11", name: "Nhà ở xã hội tại dự án Khu nhà ở Vạn Phúc 2, phường Hiệp Bình Phước, thành phố Thủ Đức (quỹ đất 20%)", investor: "Công ty Cổ phần Đầu tư địa ốc Vạn Phúc", location: "Phường Hiệp Bình, TP.HCM", totalArea: 0.96, height: 18, apartmentCount: 882, progress: 20, status: "On Track", currentStep: "Thô đến tầng 10", currentAgency: "Sở NNMT", deadline: "2027-12-31", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "35", code: "NOXH-SXD-12", name: "Khu nhà ở xã hội Mỹ Xuân B1, Phường Phú Mỹ", investor: "Công ty IDICO", location: "Phường Phú Mỹ, Bà Rịa - Vũng Tàu", totalArea: 3.40, height: 15, apartmentCount: 1200, progress: 20, status: "On Track", currentStep: "Thô đến tầng 6", currentAgency: "Sở Tài chính", deadline: "2027-12-31", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    // Phụ lục 03: 22 projects
    { id: "36", code: "NOXH-P3-01", name: "Nhà ở xã hội tại khu dân cư Vĩnh Lộc, quận Bình Tân", investor: "Công ty TNHH MTV Đầu tư và Phát triển Đô thị", location: "Phường An Lạc, TP.HCM", totalArea: 1.10, height: 15, apartmentCount: 500, progress: 10, status: "On Track", currentStep: "Móng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng Quản lý nhà và Công sở", deadline: "2028-06-30", stage: "Chuẩn bị đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "37", code: "NOXH-P3-02", name: "Nhà ở xã hội tại khu dân cư Tân Tạo, quận Bình Tân", investor: "Công ty Cổ phần Đầu tư Tân Tạo", location: "Phường Tân Tạo, TP.HCM", totalArea: 0.80, height: 12, apartmentCount: 300, progress: 5, status: "On Track", currentStep: "Móng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng Thẩm định dự án", deadline: "2028-12-31", stage: "Chuẩn bị đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "38", code: "NOXH-P3-03", name: "Nhà ở xã hội tại khu dân cư Phong Phú, huyện Bình Chánh", investor: "Công ty Cổ phần Đầu tư Kinh doanh Nhà", location: "Xã Phong Phú, TP.HCM", totalArea: 2.00, height: 18, apartmentCount: 800, progress: 15, status: "On Track", currentStep: "Thô đến tầng 2", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng Phát triển nhà và Thị trường BĐS", deadline: "2028-09-30", stage: "Chuẩn bị đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "39", code: "NOXH-P3-04", name: "Nhà ở xã hội tại khu dân cư An Phú Tây, huyện Bình Chánh", investor: "Công ty Cổ phần Đầu tư Kinh doanh Nhà", location: "Xã An Phú Tây, TP.HCM", totalArea: 1.50, height: 15, apartmentCount: 600, progress: 10, status: "On Track", currentStep: "Móng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng Quản lý nhà và Công sở", deadline: "2028-12-31", stage: "Chuẩn bị đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "40", code: "NOXH-P3-05", name: "Nhà ở xã hội tại khu dân cư Tân Quý Tây, huyện Bình Chánh", investor: "Công ty Cổ phần Đầu tư Kinh doanh Nhà", location: "Xã Tân Quý Tây, TP.HCM", totalArea: 1.20, height: 12, apartmentCount: 400, progress: 5, status: "On Track", currentStep: "Móng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng Thẩm định dự án", deadline: "2029-06-30", stage: "Chuẩn bị đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "41", code: "NOXH-P3-06", name: "Nhà ở xã hội tại khu dân cư Bình Chánh, huyện Bình Chánh", investor: "Công ty Cổ phần Đầu tư Kinh doanh Nhà", location: "Xã Bình Chánh, TP.HCM", totalArea: 1.80, height: 15, apartmentCount: 700, progress: 10, status: "On Track", currentStep: "Móng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng Phát triển nhà và Thị trường BĐS", deadline: "2029-12-31", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "42", code: "NOXH-P3-07", name: "Nhà ở xã hội tại khu dân cư Đa Phước, huyện Bình Chánh", investor: "Công ty Cổ phần Đầu tư Kinh doanh Nhà", location: "Xã Đa Phước, TP.HCM", totalArea: 1.60, height: 15, apartmentCount: 650, progress: 10, status: "On Track", currentStep: "Móng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng Quản lý nhà và Công sở", deadline: "2029-12-31", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "43", code: "NOXH-P3-08", name: "Nhà ở xã hội tại khu dân cư Hưng Long, huyện Bình Chánh", investor: "Công ty Cổ phần Đầu tư Kinh doanh Nhà", location: "Xã Hưng Long, TP.HCM", totalArea: 1.40, height: 12, apartmentCount: 550, progress: 5, status: "On Track", currentStep: "Móng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng Thẩm định dự án", deadline: "2030-06-30", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "44", code: "NOXH-P3-09", name: "Nhà ở xã hội tại khu dân cư Quy Đức, huyện Bình Chánh", investor: "Công ty Cổ phần Đầu tư Kinh doanh Nhà", location: "Xã Quy Đức, TP.HCM", totalArea: 1.30, height: 12, apartmentCount: 500, progress: 5, status: "On Track", currentStep: "Móng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng Phát triển nhà và Thị trường BĐS", deadline: "2030-12-31", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "45", code: "NOXH-P3-10", name: "Nhà ở xã hội tại khu dân cư Tân Nhựt, huyện Bình Chánh", investor: "Công ty Cổ phần Đầu tư Kinh doanh Nhà", location: "Xã Tân Nhựt, TP.HCM", totalArea: 1.70, height: 15, apartmentCount: 700, progress: 10, status: "On Track", currentStep: "Móng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng Quản lý nhà và Công sở", deadline: "2030-12-31", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "46", code: "NOXH-P3-11", name: "Nhà ở xã hội tại khu dân cư Bình Lợi, huyện Bình Chánh", investor: "Công ty Cổ phần Đầu tư Kinh doanh Nhà", location: "Xã Bình Lợi, TP.HCM", totalArea: 1.50, height: 15, apartmentCount: 600, progress: 10, status: "On Track", currentStep: "Móng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng Thẩm định dự án", deadline: "2031-06-30", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "47", code: "NOXH-P3-12", name: "Nhà ở xã hội tại khu dân cư Lê Minh Xuân, huyện Bình Chánh", investor: "Công ty Cổ phần Đầu tư Kinh doanh Nhà", location: "Xã Lê Minh Xuân, TP.HCM", totalArea: 1.90, height: 18, apartmentCount: 800, progress: 15, status: "On Track", currentStep: "Thô đến tầng 2", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng Phát triển nhà và Thị trường BĐS", deadline: "2031-12-31", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "48", code: "NOXH-P3-13", name: "Nhà ở xã hội tại khu dân cư Phạm Văn Hai, huyện Bình Chánh", investor: "Công ty Cổ phần Đầu tư Kinh doanh Nhà", location: "Xã Phạm Văn Hai, TP.HCM", totalArea: 1.60, height: 15, apartmentCount: 650, progress: 10, status: "On Track", currentStep: "Móng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng Quản lý nhà và Công sở", deadline: "2031-12-31", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "49", code: "NOXH-P3-14", name: "Nhà ở xã hội tại khu dân cư Vĩnh Lộc A, huyện Bình Chánh", investor: "Công ty Cổ phần Đầu tư Kinh doanh Nhà", location: "Xã Vĩnh Lộc A, TP.HCM", totalArea: 1.80, height: 15, apartmentCount: 700, progress: 10, status: "On Track", currentStep: "Móng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng Thẩm định dự án", deadline: "2032-06-30", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "50", code: "NOXH-P3-15", name: "Nhà ở xã hội tại khu dân cư Vĩnh Lộc B, huyện Bình Chánh", investor: "Công ty Cổ phần Đầu tư Kinh doanh Nhà", location: "Xã Vĩnh Lộc B, TP.HCM", totalArea: 1.70, height: 15, apartmentCount: 650, progress: 10, status: "On Track", currentStep: "Móng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng Phát triển nhà và Thị trường BĐS", deadline: "2032-12-31", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "51", code: "NOXH-P3-16", name: "Nhà ở xã hội tại khu dân cư Tân Kiên, huyện Bình Chánh", investor: "Công ty Cổ phần Đầu tư Kinh doanh Nhà", location: "Xã Tân Kiên, TP.HCM", totalArea: 1.60, height: 15, apartmentCount: 600, progress: 10, status: "On Track", currentStep: "Móng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng Quản lý nhà và Công sở", deadline: "2032-12-31", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "52", code: "NOXH-P3-17", name: "Nhà ở xã hội tại khu dân cư Tân Túc, huyện Bình Chánh", investor: "Công ty Cổ phần Đầu tư Kinh doanh Nhà", location: "Xã Tân Túc, TP.HCM", totalArea: 1.50, height: 15, apartmentCount: 550, progress: 10, status: "On Track", currentStep: "Móng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng Thẩm định dự án", deadline: "2033-06-30", stage: "Thực hiện đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "53", code: "NOXH-P3-18", name: "Nhà ở xã hội tại khu dân cư Bình Hưng, huyện Bình Chánh", investor: "Công ty Cổ phần Đầu tư Kinh doanh Nhà", location: "Xã Bình Hưng, TP.HCM", totalArea: 1.40, height: 15, apartmentCount: 500, progress: 10, status: "On Track", currentStep: "Móng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng Phát triển nhà và Thị trường BĐS", deadline: "2033-12-31", stage: "Kết thúc đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "54", code: "NOXH-P3-19", name: "Nhà ở xã hội tại khu dân cư Phong Phú 2, huyện Bình Chánh", investor: "Công ty Cổ phần Đầu tư Kinh doanh Nhà", location: "Xã Phong Phú, TP.HCM", totalArea: 1.30, height: 12, apartmentCount: 450, progress: 5, status: "On Track", currentStep: "Móng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng Quản lý nhà và Công sở", deadline: "2033-12-31", stage: "Kết thúc đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "55", code: "NOXH-P3-20", name: "Nhà ở xã hội tại khu dân cư Đa Phước 2, huyện Bình Chánh", investor: "Công ty Cổ phần Đầu tư Kinh doanh Nhà", location: "Xã Đa Phước, TP.HCM", totalArea: 1.20, height: 12, apartmentCount: 400, progress: 5, status: "On Track", currentStep: "Móng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng Thẩm định dự án", deadline: "2034-06-30", stage: "Kết thúc đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "56", code: "NOXH-P3-21", name: "Nhà ở xã hội tại khu dân cư Hưng Long 2, huyện Bình Chánh", investor: "Công ty Cổ phần Đầu tư Kinh doanh Nhà", location: "Xã Hưng Long, TP.HCM", totalArea: 1.10, height: 12, apartmentCount: 350, progress: 5, status: "On Track", currentStep: "Móng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng Phát triển nhà và Thị trường BĐS", deadline: "2034-12-31", stage: "Kết thúc đầu tư", isKeyProject: false, isPublicInvestment: false },
    { id: "57", code: "NOXH-P3-22", name: "Nhà ở xã hội tại khu dân cư Quy Đức 2, huyện Bình Chánh", investor: "Công ty Cổ phần Đầu tư Kinh doanh Nhà", location: "Xã Quy Đức, TP.HCM", totalArea: 1.00, height: 12, apartmentCount: 300, progress: 5, status: "On Track", currentStep: "Móng", currentAgency: "Sở Xây dựng", currentDepartment: "Phòng Quản lý nhà và Công sở", deadline: "2035-06-30", stage: "Kết thúc đầu tư", isKeyProject: false, isPublicInvestment: false },
  ];

  // --- API Routes ---
  app.get("/api/v1/projects", (req, res) => {
    res.json(projects);
  });

  app.post("/api/v1/projects", (req, res) => {
    const newProject = {
      id: (projects.length + 1).toString(),
      ...req.body
    };
    projects.push(newProject);
    res.status(201).json(newProject);
  });

  app.put("/api/v1/projects/:id", (req, res) => {
    const index = projects.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...req.body };
      res.json(projects[index]);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  });

  app.delete("/api/v1/projects/:id", (req, res) => {
    const index = projects.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
      projects.splice(index, 1);
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  });

  app.get("/api/v1/projects/:id", (req, res) => {
    const project = projects.find(p => p.id === req.params.id);
    if (project) res.json(project);
    else res.status(404).json({ message: "Project not found" });
  });

  app.get("/api/v1/stats/summary", (req, res) => {
    res.json({
      totalProjects: projects.length, 
      totalArea: 107.24, 
      totalApartments: 44051, 
      onTrack: projects.filter(p => p.status === 'On Track').length,
      warning: projects.filter(p => p.status === 'Warning').length,
      critical: projects.filter(p => p.status === 'Delayed').length,
      agencyPerformance: [
        { name: 'Sở Xây dựng', p: 88, color: 'bg-blue-500' },
        { name: 'Sở TN & Môi trường', p: 65, color: 'bg-amber-500' },
        { name: 'Sở Quy hoạch KT', p: 82, color: 'bg-emerald-500' },
        { name: 'Sở Kế hoạch & Đầu tư', p: 75, color: 'bg-indigo-500' },
        { name: '168 Phường xã', p: 70, color: 'bg-rose-500' }
      ]
    });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
