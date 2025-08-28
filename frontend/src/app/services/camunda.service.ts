import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface StartProcessRequest {
  initiator: string;
  itemName: string;
  amount: number;
  reason: string;
}

export interface StartProcessResponse {
  processInstanceId: string;
  status: string;
  isValid: boolean;
}

export interface Task {
  id: string;
  name: string;
  assignee: string;
  processInstanceId: string;
}

export interface ProcessStatus {
  processInstanceId: string;
  status: string;
  businessKey?: string;
  activeTasks: Task[];
}

export interface ApprovalRequest {
  approved: boolean;
  comments?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CamundaService {
  private readonly baseUrl = 'http://localhost:8080/api/process';

  // Signals for reactive state management
  currentUser = signal<string>('');
  userTasks = signal<Task[]>([]);
  processStatus = signal<ProcessStatus | null>(null);
  isLoading = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  // Start new process
  startProcess(request: StartProcessRequest): Observable<StartProcessResponse> {
    this.isLoading.set(true);
    return this.http.post<StartProcessResponse>(`${this.baseUrl}/start`, request);
  }

  // Get tasks for a specific user
  getUserTasks(assignee: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/tasks/${assignee}`);
  }

  // Submit initial proposal
  submitProposal(taskId: string, proposalData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/tasks/${taskId}/submit`, proposalData);
  }

  // Handle approval decision
  approveProposal(taskId: string, approvalData: { approved: boolean | null; comments: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/tasks/${taskId}/approve`, approvalData);
  }

  // Claim a task
  claimTask(taskId: string, userId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/tasks/${taskId}/claim?userId=${userId}`, {});
  }

  // Complete generic task
  completeTask(taskId: string, variables?: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/tasks/${taskId}/complete`, variables || {});
  }

  // Get process instance status
  getProcessStatus(processInstanceId: string): Observable<ProcessStatus> {
    return this.http.get<ProcessStatus>(`${this.baseUrl}/instance/${processInstanceId}/status`);
  }

  // Utility methods for updating signals
  setCurrentUser(user: string) {
    this.currentUser.set(user);
  }

  updateUserTasks(tasks: Task[]) {
    this.userTasks.set(tasks);
  }

  updateProcessStatus(status: ProcessStatus) {
    this.processStatus.set(status);
  }

  setLoading(loading: boolean) {
    this.isLoading.set(loading);
  }
}
