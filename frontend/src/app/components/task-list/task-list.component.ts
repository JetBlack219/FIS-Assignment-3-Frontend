import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CamundaService, Task } from '../../services/camunda.service';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="page">
      <div class="container">
        <h1 class="title">Purchase Workflow — Tasks</h1>
        <p class="subtitle">Review, submit, and approve purchase proposals.</p>

        <!-- User Selection -->
        <div class="section">
          <label for="userSelect">Select User</label>
          <div class="row">
            <input id="userSelect" type="text" [(ngModel)]="selectedUser" (ngModelChange)="onUserChange()" placeholder="e.g., demo"/>
            <button (click)="refreshTasks()" [disabled]="!selectedUser || isLoading()">Refresh</button>
          </div>
          <p *ngIf="!selectedUser" class="error">Please enter a username.</p>
        </div>

        <!-- Tasks -->
        <div *ngIf="isLoading()" class="loading">Loading tasks…</div>

        <div *ngIf="!isLoading() && tasks().length > 0" class="tasks">
          <h2>Tasks for <span class="highlight">{{ selectedUser }}</span></h2>
          <ul>
            <li *ngFor="let task of tasks()">
              <div class="task-info">
                <h3>{{ task.name }}</h3>
                <p><strong>Assignee:</strong> {{ task.assignee || 'Unassigned' }}</p>
                <p><strong>Process:</strong> {{ task.processInstanceId }}</p>
              </div>
              <button (click)="task.name === 'Submit purchase proposal' ? openSubmitModal(task) : openApprovalModal(task)">
                {{ task.name === 'Submit purchase proposal' ? 'Submit Proposal' : 'Approve / Reject' }}
              </button>
            </li>
          </ul>
        </div>

        <p *ngIf="!isLoading() && tasks().length === 0" class="empty">No tasks available for {{ selectedUser || 'user' }}.</p>
      </div>
    </div>
  `,
  styles: [`
    .page {
      min-height: 100vh;
      background: #f9fafb;
      padding: 1rem;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: #fff;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    .title {
      font-size: 1.8rem;
      margin: 0 0 0.5rem;
      color: #1e293b;
      text-align: center;
    }
    .subtitle {
      text-align: center;
      color: #64748b;
      margin-bottom: 1.5rem;
    }
    .section {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #334155;
    }
    .row {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    input {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
    }
    button {
      background: #2563eb;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover:enabled {
      background: #1d4ed8;
    }
    button:disabled {
      background: #93c5fd;
      cursor: not-allowed;
    }
    .error {
      color: #dc2626;
      font-size: 0.85rem;
      margin-top: 0.5rem;
    }
    .loading {
      text-align: center;
      padding: 2rem;
      color: #334155;
    }
    .tasks h2 {
      font-size: 1.2rem;
      margin-bottom: 1rem;
      color: #0f172a;
    }
    .highlight {
      color: #2563eb;
      font-weight: bold;
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 1rem;
    }
    li {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      transition: box-shadow 0.2s;
    }
    li:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .task-info h3 {
      margin: 0;
      font-size: 1rem;
      color: #1e293b;
    }
    .task-info p {
      margin: 0.25rem 0;
      font-size: 0.9rem;
      color: #475569;
    }
    .empty {
      text-align: center;
      color: #6b7280;
      margin-top: 2rem;
    }
    @media (min-width: 600px) {
      li {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
    }
  `]
})
export class TaskListComponent implements OnInit, OnDestroy {
  private camundaService = inject(CamundaService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);
  private subscriptions = new Subscription();

  selectedUser: string = '';
  tasks = signal<Task[]>([]);
  isLoading = signal<boolean>(false);

  ngOnInit() {
    this.selectedUser = this.camundaService.currentUser() || 'demo';
    if (this.selectedUser) this.onUserChange();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onUserChange() {
    if (this.selectedUser) {
      this.camundaService.setCurrentUser(this.selectedUser);
      this.refreshTasks();
    } else {
      this.notificationService.warning('Warning', 'Please enter a valid username');
      this.tasks.set([]);
    }
  }

  refreshTasks() {
    if (!this.selectedUser) return;
    this.isLoading.set(true);
    const sub = this.camundaService.getUserTasks(this.selectedUser).subscribe({
      next: tasks => {
        this.tasks.set(tasks);
        this.camundaService.updateUserTasks(tasks);
        this.isLoading.set(false);
      },
      error: () => {
        this.notificationService.error('Error', 'Failed to fetch tasks');
        this.isLoading.set(false);
      }
    });
    this.subscriptions.add(sub);
  }

  // Placeholders for modal functions (not simplified here)
  openSubmitModal(task: Task) {}
  openApprovalModal(task: Task) {}
}
