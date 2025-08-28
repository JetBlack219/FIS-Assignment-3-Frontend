import { Component, signal, computed, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CamundaService, ProcessStatus } from '../../services/camunda.service';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-process-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="card">
        <h2>Process Status Tracker</h2>

        <!-- Process ID Input -->
        <div class="form-group">
          <label for="processId">Process Instance ID</label>
          <div class="form-inline">
            <input
              id="processId"
              type="text"
              [(ngModel)]="processId"
              (ngModelChange)="onProcessIdChange($event)"
              placeholder="Enter process instance ID"
              [attr.aria-invalid]="isInvalidProcessId()"
              aria-describedby="processIdError"
            />
            <button (click)="checkStatus()" [disabled]="isInvalidProcessId() || isLoading()">
              <span *ngIf="isLoading()">Checking...</span>
              <span *ngIf="!isLoading()">Check Status</span>
            </button>
          </div>
          <p *ngIf="isInvalidProcessId()" id="processIdError" class="error-text">
            Please enter a valid process instance ID.
          </p>
        </div>

        <!-- Process Status Display -->
        <div *ngIf="status() as status" class="status-card">
          <div class="status-header">
            <h3>Process Information</h3>
            <span [class.active]="status.status === 'ACTIVE'" [class.inactive]="status.status !== 'ACTIVE'">
              {{ status.status === 'ACTIVE' ? '🟢 Active' : '⚪ Completed/Ended' }}
            </span>
          </div>

          <div class="status-grid">
            <div>
              <label>Process Instance ID</label>
              <p>{{ status.processInstanceId }}</p>
            </div>
            <div>
              <label>Status</label>
              <p>{{ status.status }}</p>
            </div>
            <div *ngIf="status.businessKey">
              <label>Business Key</label>
              <p>{{ status.businessKey }}</p>
            </div>
          </div>

          <!-- Active Tasks -->
          <div *ngIf="status.activeTasks && status.activeTasks.length > 0">
            <h4>Active Tasks</h4>
            <div *ngFor="let task of status.activeTasks; trackBy: trackByTaskId" class="task">
              <div class="task-header">
                <div>
                  <h5>{{ task.name }}</h5>
                  <p><strong>Task ID:</strong> {{ task.id }}</p>
                  <p><strong>Assignee:</strong> {{ task.assignee || 'Unassigned' }}</p>
                </div>
                <span class="tag" [ngClass]="taskStatusStyles(task.name)">
                  {{ taskStatusLabel(task.name) }}
                </span>
              </div>
            </div>
          </div>

          <div *ngIf="(!status.activeTasks || status.activeTasks.length === 0) && status.status === 'ACTIVE'" class="empty">
            <p>No active tasks found for this process.</p>
          </div>

          <div *ngIf="status.status !== 'ACTIVE'" class="empty">
            <p>Process has been completed or terminated.</p>
          </div>
        </div>

        <!-- Error -->
        <div *ngIf="error()" class="error-box">
          <h3>Error</h3>
          <p>{{ error() }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 20px auto;
      padding: 10px;
    }
    .card {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      border: 1px solid #ddd;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    h2 { margin-bottom: 20px; font-size: 20px; }
    .form-group { margin-bottom: 20px; }
    label { display: block; font-weight: bold; margin-bottom: 6px; }
    input {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      flex: 1;
    }
    button {
      padding: 8px 16px;
      margin-left: 8px;
      border: none;
      border-radius: 4px;
      background: #007bff;
      color: white;
      cursor: pointer;
    }
    button:disabled { background: #999; cursor: not-allowed; }
    .form-inline { display: flex; align-items: center; }
    .error-text { color: red; font-size: 13px; margin-top: 5px; }

    .status-card { margin-top: 20px; padding: 15px; border: 1px solid #eee; border-radius: 6px; }
    .status-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .status-header span {
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 12px;
    }
    .status-header span.active { background: #d1fae5; color: #065f46; }
    .status-header span.inactive { background: #f3f4f6; color: #374151; }

    .status-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 15px;
    }
    .status-grid label { font-size: 13px; color: #666; }
    .status-grid p { margin: 2px 0 0; }

    h4 { margin-bottom: 8px; }
    .task { padding: 10px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 10px; }
    .task-header { display: flex; justify-content: space-between; }
    .tag {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 80px;           /* keeps pill width balanced */
      height: 22px;              /* fixes vertical height */
      padding: 0 10px;           /* horizontal padding only */
      border-radius: 999px;      /* makes it a nice pill */
      font-size: 12px;
      font-weight: 500;
      line-height: 1;            /* keeps text centered */
      white-space: nowrap;       /* prevent wrapping */
    }

    .bg-blue-100 { background: #e0f2fe; color: #0369a1; }
    .bg-yellow-100 { background: #fef9c3; color: #92400e; }
    .bg-gray-100 { background: #f3f4f6; color: #374151; }

    .empty { text-align: center; padding: 20px; color: #666; font-size: 14px; }

    .error-box {
      margin-top: 20px;
      padding: 12px;
      border: 1px solid #fca5a5;
      background: #fee2e2;
      border-radius: 6px;
      color: #b91c1c;
    }
  `]
})
export class ProcessStatusComponent implements OnDestroy {
  private camundaService = inject(CamundaService);
  private notificationService = inject(NotificationService);
  private subscription: Subscription | null = null;

  processId = signal<string>('');
  status = signal<ProcessStatus | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string>('');
  isInvalidProcessId = computed(() => !this.processId().trim());

  private taskStatusMap: { [key: string]: { label: string; styles: string } } = {
    'Submit purchase proposal': { label: 'Pending Submission', styles: 'bg-blue-100' },
    'Head of Approval': { label: 'Pending Approval', styles: 'bg-yellow-100' }
  };

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  onProcessIdChange(value: string) {
    this.processId.set(value);
    this.error.set('');
  }

  checkStatus() {
    if (this.isInvalidProcessId()) {
      this.notificationService.warning('Warning', 'Please enter a valid process instance ID');
      return;
    }

    this.isLoading.set(true);
    this.error.set('');
    this.status.set(null);

    this.subscription = this.camundaService.getProcessStatus(this.processId()).subscribe({
      next: (processStatus) => {
        this.status.set(processStatus);
        this.isLoading.set(false);

        if (processStatus.status === 'COMPLETED_OR_NOT_FOUND') {
          this.notificationService.info('Info', 'Process has completed or not found');
        } else {
          this.notificationService.success('Success', 'Process status retrieved successfully');
        }
      },
      error: (err: any) => {
        const errorMessage = err.status === 404
          ? 'Process instance not found. Please check the process ID.'
          : `Failed to retrieve process status: ${err.message || 'Unknown error'}`;
        this.error.set(errorMessage);
        this.notificationService.error('Error', errorMessage);
        this.isLoading.set(false);
      }
    });
  }

  taskStatusLabel(taskName: string): string {
    return this.taskStatusMap[taskName]?.label || 'In Progress';
  }

  taskStatusStyles(taskName: string): string {
    return this.taskStatusMap[taskName]?.styles || 'bg-gray-100';
  }

  trackByTaskId(index: number, task: { id: string }): string {
    return task.id;
  }
}
