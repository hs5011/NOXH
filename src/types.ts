export interface Project {
  id: string;
  name: string;
  location: string;
  investor: string;
  status: 'On Track' | 'Delayed' | 'Completed' | 'Pending';
  progress: number;
  stage: string;
  lastUpdate: string;
  deadline: string;
}

export interface AgencyStats {
  name: string;
  total: number;
  completed: number;
  delayed: number;
  processing: number;
}

export interface WorkflowStep {
  id: string;
  name: string;
  agency: string;
  status: 'Done' | 'Doing' | 'Waiting';
  deadline: string;
  daysLeft?: number;
}
