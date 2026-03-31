import { Process } from '../components/StepManagementView';

export const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export interface ProjectStatus {
  progress: number;
  currentStep: string;
  status: string;
  currentAgency: string;
  childStep: string;
  parentStep: string;
}

export const calculateProjectStatus = (milestones: any, processId: string, processes: Process[], implementationPlan: any = {}): ProjectStatus => {
  const selectedProcess = processes.find(p => p.id === processId);
  if (!selectedProcess) return { progress: 0, currentStep: 'Chưa chọn quy trình', status: 'On Track', currentAgency: '', childStep: '', parentStep: '' };

  const allSteps: { id: string, name: string, agency?: string, parentName: string }[] = [];
  selectedProcess.parentSteps.forEach(ps => {
    ps.childSteps.forEach(cs => {
      allSteps.push({ id: cs.id, name: cs.name, agency: cs.agency, parentName: ps.name });
    });
  });
  
  let completedCount = 0;
  let status = 'On Track';
  
  const activeSteps = allSteps.filter(s => {
    const m = milestones[s.id] || {};
    const ip = implementationPlan[s.id] || {};
    
    // A step is completed if it has an actual date in either milestones or implementationPlan
    const actualDate = m.actualDate || ip.agencyActualDate || ip.investorActualDate;
    
    if (actualDate) {
      completedCount++;
      return false;
    }
    
    // A step is active if it has a milestone date (investor or agency deadline)
    const hasMilestone = !!m.investor || !!m.agency;
    if (hasMilestone) return true;
    
    // Or if it's the very first step and no steps are completed yet
    const noStepsCompleted = allSteps.every(step => {
      const stepM = milestones[step.id] || {};
      const stepIp = implementationPlan[step.id] || {};
      return !(stepM.actualDate || stepIp.agencyActualDate || stepIp.investorActualDate);
    });

    const isFirstStep = s.id === allSteps[0]?.id;
    if (noStepsCompleted && isFirstStep) return true;
    
    return false;
  });

  // Check for delays in active steps
  activeSteps.forEach(s => {
    const m = milestones[s.id] || {};
    const deadline = m.agency || m.investor;
    if (deadline) {
      const deadlineDate = new Date(deadline);
      if (new Date() > deadlineDate) {
        status = 'Delayed';
      }
    }
  });

  const currentStep = activeSteps.map(s => s.name).join(', ') || (allSteps.length > 0 && completedCount === allSteps.length ? 'Hoàn thành' : 'Khởi tạo hồ sơ');
  const childStep = activeSteps.length > 0 ? activeSteps.map(s => s.name).join(', ') : '';
  const parentStep = activeSteps.length > 0 ? activeSteps[0].parentName : '';
  const currentAgency = activeSteps.length > 0 ? activeSteps[0].agency || 'Chủ đầu tư' : 'N/A';
  const progress = allSteps.length > 0 ? Math.round((completedCount / allSteps.length) * 100) : 0;

  return { progress, currentStep, status, currentAgency, childStep, parentStep };
};
