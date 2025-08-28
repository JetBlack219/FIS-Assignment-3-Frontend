import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { StartProcessComponent } from './components/start-process/start-process.component';
import { ProcessStatusComponent } from './components/process-status/process-status.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'tasks', component: TaskListComponent },
  { path: 'start', component: StartProcessComponent },
  { path: 'status', component: ProcessStatusComponent },
  { path: '**', redirectTo: 'dashboard' } // fallback
];
