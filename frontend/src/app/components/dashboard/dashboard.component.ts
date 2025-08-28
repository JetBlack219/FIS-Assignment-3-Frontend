import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CamundaService } from '../../services/camunda.service';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="container">
        <header class="header">
          <h1 class="title">Dashboard</h1>
          <p class="subtitle">Manage purchase proposals and workflow processes</p>
        </header>

        <!-- user info -->
        @if (currentUser()) {
          <section class="card user-info">
            <strong>Welcome,</strong> <span class="username">{{ currentUser() }}</span>
          </section>
        } @else {
          <section class="card user-info muted">
            No user logged in. Please select a user.
          </section>
        }

        <!-- quick actions -->
        <section class="card actions">
          <div class="actions-grid">
            <button class="btn" (click)="goToStartProcess()">Start New Process</button>
            <button class="btn" (click)="goToTasks()">View Tasks</button>
            <button class="btn" (click)="goToStatus()">Check Process Status</button>
            <button class="btn" (click)="goToHelp()">Help</button>
          </div>
        </section>

        <!-- tasks -->
        <section class="card tasks">
          @if (isLoading()) {
            <div class="center">
              <div class="spinner" aria-hidden="true"></div>
              <p>Loading tasks...</p>
            </div>
          } @else if (userTasks().length > 0) {
            <h2 class="section-title">Your Tasks</h2>
            <ul class="task-list">
              @for (task of userTasks(); track task.id) {
                <li class="task-item">
                  <div class="task-left">
                    <div class="task-name">{{ task.name }}</div>
                    <div class="task-meta"><span>Assignee:</span> {{ task.assignee || 'Unassigned' }}</div>
                  </div>
                  <div class="task-right">
                    <div class="task-process">Process: <code>{{ task.processInstanceId }}</code></div>
                  </div>
                </li>
              }
            </ul>
          } @else {
            <div class="center muted">No tasks available.</div>
          }
        </section>
      </div>
    </div>
  `,
  styles: [`
    /* Layout */
    :host { display: block; font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; color: #1f2937; }
    .page { background: #f7fafc; min-height: 100vh; padding: 24px 12px; }
    .container { max-width: 980px; margin: 0 auto; }

    /* Header */
    .header { text-align: left; margin-bottom: 18px; }
    .title { margin: 0; font-size: 24px; font-weight: 700; color: #111827; }
    .subtitle { margin: 6px 0 0; font-size: 14px; color: #4b5563; }

    /* Card */
    .card { background: #ffffff; border: 1px solid #e6edf3; border-radius: 10px; padding: 16px; box-shadow: 0 1px 2px rgba(16,24,40,0.03); margin-bottom: 16px; }

    .user-info { display:flex; align-items:center; gap:8px; }
    .user-info.muted { color: #6b7280; }

    .username { color: #0b5cff; font-weight:600; margin-left:6px; }

    /* Actions */
    .actions-grid { display:grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .btn {
      display: inline-block;
      padding: 10px 12px;
      border-radius: 8px;
      border: none;
      background: #0b5cff;
      color: #fff;
      font-weight: 600;
      cursor: pointer;
      transition: background .12s ease, transform .08s ease;
      text-align: center;
    }
    .btn:hover { background: #084acc; transform: translateY(-1px); }
    .btn:active { transform: translateY(0); }

    /* Tasks */
    .section-title { margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #111827; }
    .task-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
    .task-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid #e6edf3;
      background: #fff;
    }
    .task-name { font-weight: 600; color: #111827; }
    .task-meta { font-size: 13px; color: #6b7280; margin-top: 6px; }
    .task-left { min-width: 0; }
    .task-right { text-align: right; font-size: 13px; color: #374151; }
    .task-process code { background:#f3f4f6; padding: 2px 6px; border-radius: 6px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace; font-size: 12px; }

    /* Center area for loading/empty */
    .center { text-align: center; padding: 20px 6px; color: #374151; }
    .muted { color: #6b7280; }

    /* Spinner */
    .spinner {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 4px solid rgba(59,130,246,0.12);
      border-top-color: rgba(59,130,246,0.9);
      margin: 6px auto;
      animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Responsive */
    @media (min-width: 700px) {
      .actions-grid { grid-template-columns: repeat(4, 1fr); }
      .task-item { padding: 14px; }
    }

    @media (max-width: 420px) {
      .container { padding: 0 8px; }
      .title { font-size: 20px; }
      .btn { padding: 10px; font-size: 14px; }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private camundaService = inject(CamundaService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private subscription: Subscription | null = null;

  currentUser = this.camundaService.currentUser;
  userTasks = this.camundaService.userTasks;
  isLoading = this.camundaService.isLoading;

  ngOnInit() {
    const user = this.currentUser();
    if (user) {
      this.loadUserTasks(user);
    } else {
      this.notificationService.warning('Warning', 'No user selected. Please log in.');
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private loadUserTasks(user: string) {
    this.isLoading.set(true);
    this.subscription = this.camundaService.getUserTasks(user).subscribe({
      next: (tasks) => {
        this.camundaService.updateUserTasks(tasks);
        this.isLoading.set(false);
        if (tasks.length === 0) {
          this.notificationService.info('Info', 'No tasks found for this user.');
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.notificationService.error('Error', 'Failed to load user tasks.');
      }
    });
  }

  goToStartProcess() {
    this.router.navigate(['/start']);
  }

  goToTasks() {
    this.router.navigate(['/tasks']);
  }

  goToStatus() {
    this.router.navigate(['/status']);
  }

  goToHelp() {
    this.router.navigate(['/help']);
  }
}
