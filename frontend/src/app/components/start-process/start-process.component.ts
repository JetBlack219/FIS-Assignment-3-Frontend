import { Component, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CamundaService, StartProcessRequest } from '../../services/camunda.service';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-start-process',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="form-card">
        <h2 class="title">Start New Purchase Proposal</h2>

        <form [formGroup]="processForm" (ngSubmit)="onSubmit()" class="form">
          <!-- Initiator -->
          <div class="form-group">
            <label for="initiator">Initiator <span class="required">*</span></label>
            <input id="initiator" type="text" formControlName="initiator" placeholder="Enter your username"/>
            @if (processForm.get('initiator')?.invalid && processForm.get('initiator')?.touched) {
              <p class="error">Initiator is required (minimum 2 characters)</p>
            }
          </div>

          <!-- Item Name -->
          <div class="form-group">
            <label for="itemName">Item Name <span class="required">*</span></label>
            <input id="itemName" type="text" formControlName="itemName" placeholder="e.g., MacBook Pro, Office Chair"/>
            @if (processForm.get('itemName')?.invalid && processForm.get('itemName')?.touched) {
              <p class="error">Item name is required (minimum 2 characters)</p>
            }
          </div>

          <!-- Amount -->
          <div class="form-group">
            <label for="amount">Amount ($) <span class="required">*</span></label>
            <input id="amount" type="number" min="1" formControlName="amount" placeholder="Enter amount in USD"/>
            @if (processForm.get('amount')?.invalid && processForm.get('amount')?.touched) {
              <p class="error">
                @if (processForm.get('amount')?.errors?.['required']) { Amount is required }
                @if (processForm.get('amount')?.errors?.['min']) { Amount must be greater than 0 }
              </p>
            }
          </div>

          <!-- Reason -->
          <div class="form-group">
            <label for="reason">Reason <span class="required">*</span></label>
            <textarea id="reason" rows="3" formControlName="reason" placeholder="Explain why you need this item"></textarea>
            @if (processForm.get('reason')?.invalid && processForm.get('reason')?.touched) {
              <p class="error">Reason is required (minimum 10 characters)</p>
            }
          </div>

          <!-- Button -->
          <div class="actions">
            <button type="submit" [disabled]="processForm.invalid || isSubmitting()">
              @if (isSubmitting()) {
                <span class="loading">⏳ Starting Process...</span>
              } @else {
                Start Process
              }
            </button>
          </div>
        </form>

        <!-- Success -->
        @if (processInstanceId()) {
          <div class="success">
            ✅ Process Started Successfully!<br/>
            <small>Process ID: <code>{{ processInstanceId() }}</code></small><br/>
            <small>Status: {{ processStatus() }}</small>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      justify-content: center;
      padding: 1rem;
    }
    .form-card {
      background: #fff;
      padding: 1.5rem;
      border-radius: 0.75rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      width: 100%;
      max-width: 600px;
    }
    .title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      color: #1f2937;
      text-align: center;
    }
    .form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
    }
    label {
      font-size: 0.9rem;
      font-weight: 500;
      margin-bottom: 0.4rem;
      color: #374151;
    }
    .required {
      color: #e11d48;
    }
    input, textarea {
      padding: 0.6rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.95rem;
      transition: border 0.2s, box-shadow 0.2s;
    }
    input:focus, textarea:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 2px rgba(37,99,235,0.3);
    }
    .error {
      font-size: 0.8rem;
      color: #dc2626;
      margin-top: 0.25rem;
    }
    .actions {
      margin-top: 1rem;
    }
    button {
      width: 100%;
      padding: 0.75rem;
      background: #2563eb;
      color: #fff;
      font-weight: 600;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover:enabled {
      background: #1d4ed8;
    }
    button:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .success {
      margin-top: 1.5rem;
      padding: 1rem;
      border-radius: 0.5rem;
      background: #ecfdf5;
      color: #065f46;
      font-size: 0.9rem;
      text-align: center;
    }
    @media (max-width: 640px) {
      .form-card {
        padding: 1rem;
      }
      .title {
        font-size: 1.25rem;
      }
    }
  `]
})
export class StartProcessComponent implements OnDestroy {
  processForm: FormGroup;
  isSubmitting = signal(false);
  processInstanceId = signal<string>('');
  processStatus = signal<string>('');
  private subscription: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private camundaService: CamundaService,
    private notificationService: NotificationService
  ) {
    this.processForm = this.fb.group({
      initiator: ['', [Validators.required, Validators.minLength(2)]],
      itemName: ['', [Validators.required, Validators.minLength(2)]],
      amount: [null, [Validators.required, Validators.min(1)]],
      reason: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  onSubmit() {
    if (this.processForm.valid) {
      this.isSubmitting.set(true);
      this.processInstanceId.set('');
      this.processStatus.set('');

      const request: StartProcessRequest = this.processForm.value;

      this.subscription = this.camundaService.startProcess(request).subscribe({
        next: (response) => {
          this.processInstanceId.set(response.processInstanceId);
          this.processStatus.set(response.status);

          if (response.isValid) {
            this.notificationService.success('Process Started', `Purchase proposal for "${request.itemName}" has been initiated.`);
          } else {
            this.notificationService.warning('Invalid Proposal', 'Proposal will be auto-rejected due to invalid data.');
          }

          this.processForm.reset();
          Object.keys(this.processForm.controls).forEach(key => {
            this.processForm.get(key)?.setErrors(null);
            this.processForm.get(key)?.markAsUntouched();
          });
          this.isSubmitting.set(false);
        },
        error: () => {
          this.notificationService.error('Process Failed', 'Failed to start the process.');
          this.isSubmitting.set(false);
        }
      });
    }
  }
}
