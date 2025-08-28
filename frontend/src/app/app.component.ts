import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NotificationComponent } from './components/notification/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NotificationComponent
  ],
  template: `
    <div class="app-container">
      <!-- Animated Background -->
      <div class="background-decoration">
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
          <div class="shape shape-4"></div>
          <div class="shape shape-5"></div>
        </div>
      </div>

      <!-- Navigation Header -->
      <nav class="navbar" [class.scrolled]="isScrolled()">
        <div class="nav-container">
          <div class="nav-content">
            <!-- Logo Section -->
            <div class="logo-section">
              <div class="logo-container">
                <div class="logo-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9
                             m11 0a2 2 0 01-2 2H7a2 2 0 01-2-2m2-4h2m-2-4h2m-2-4h2m-2-4h2" />
                  </svg>
                </div>
                <div class="logo-text">
                  <span class="logo-main">Camunda</span>
                  <span class="logo-sub">Workflow</span>
                </div>
              </div>

              <!-- Desktop Navigation -->
              <div class="desktop-nav">
                <a
                  routerLink="/dashboard"
                  routerLinkActive="nav-link-active"
                  [routerLinkActiveOptions]="{ exact: true }"
                  class="nav-link"
                >
                  <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  Dashboard
                </a>

                <a
                  routerLink="/tasks"
                  routerLinkActive="nav-link-active"
                  class="nav-link"
                >
                  <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10,9 9,9 8,9"></polyline>
                  </svg>
                  Tasks
                </a>

                <a
                  routerLink="/start"
                  routerLinkActive="nav-link-active"
                  class="nav-link"
                >
                  <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="10,8 16,12 10,16 10,8"></polygon>
                  </svg>
                  Start Process
                </a>

                <a
                  routerLink="/status"
                  routerLinkActive="nav-link-active"
                  class="nav-link"
                >
                  <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                  Status
                </a>
              </div>
            </div>

            <!-- Mobile Menu Button -->
            <button
              class="mobile-menu-btn"
              (click)="toggleMobileMenu()"
              [class.active]="isMobileMenuOpen()"
            >
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div class="mobile-menu" [class.active]="isMobileMenuOpen()">
          <div class="mobile-menu-content">
            <a
              routerLink="/dashboard"
              routerLinkActive="mobile-nav-active"
              [routerLinkActiveOptions]="{ exact: true }"
              (click)="closeMobileMenu()"
              class="mobile-nav-link"
            >
              <svg class="mobile-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              Dashboard
            </a>

            <a
              routerLink="/tasks"
              routerLinkActive="mobile-nav-active"
              (click)="closeMobileMenu()"
              class="mobile-nav-link"
            >
              <svg class="mobile-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
              </svg>
              Tasks
            </a>

            <a
              routerLink="/start"
              routerLinkActive="mobile-nav-active"
              (click)="closeMobileMenu()"
              class="mobile-nav-link"
            >
              <svg class="mobile-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="10,8 16,12 10,16 10,8"></polygon>
              </svg>
              Start Process
            </a>

            <a
              routerLink="/status"
              routerLinkActive="mobile-nav-active"
              (click)="closeMobileMenu()"
              class="mobile-nav-link"
            >
              <svg class="mobile-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
              Process Status
            </a>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="main-content">
        <div class="content-wrapper">
          <router-outlet></router-outlet>
        </div>
      </main>

      <!-- Notifications -->
      <app-notification></app-notification>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    /* Main Container */
    .app-container {
      min-height: 100vh;
      position: relative;
      overflow-x: hidden;
    }

    /* Animated Background */
    .background-decoration {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
    }

    .floating-shapes {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .shape {
      position: absolute;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      animation: float 6s ease-in-out infinite;
    }

    .shape-1 {
      width: 80px;
      height: 80px;
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 120px;
      height: 120px;
      top: 20%;
      right: 10%;
      animation-delay: 1s;
    }

    .shape-3 {
      width: 60px;
      height: 60px;
      top: 60%;
      left: 20%;
      animation-delay: 2s;
    }

    .shape-4 {
      width: 100px;
      height: 100px;
      bottom: 20%;
      right: 20%;
      animation-delay: 3s;
    }

    .shape-5 {
      width: 140px;
      height: 140px;
      bottom: 10%;
      left: 50%;
      animation-delay: 4s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }

    /* Navigation Styles */
    .navbar {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      position: sticky;
      top: 0;
      z-index: 1000;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .navbar.scrolled {
      background: rgba(255, 255, 255, 0.98);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 70px;
    }

    /* Logo Section */
    .logo-section {
      display: flex;
      align-items: center;
      gap: 3rem;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .logo-container:hover {
      transform: scale(1.05);
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .logo-icon svg {
      width: 24px;
      height: 24px;
      stroke-width: 2.5;
    }

    .logo-text {
      display: flex;
      flex-direction: column;
      line-height: 1;
    }

    .logo-main {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a202c;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .logo-sub {
      font-size: 0.875rem;
      font-weight: 500;
      color: #64748b;
      margin-top: -2px;
    }

    /* Desktop Navigation */
    .desktop-nav {
      display: none;
      gap: 0.5rem;
    }

    @media (min-width: 768px) {
      .desktop-nav {
        display: flex;
      }
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      border-radius: 12px;
      font-weight: 500;
      font-size: 0.875rem;
      color: #64748b;
      text-decoration: none;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .nav-link::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      transition: left 0.5s;
    }

    .nav-link:hover::before {
      left: 100%;
    }

    .nav-link:hover {
      color: #667eea;
      background: rgba(102, 126, 234, 0.1);
      transform: translateY(-2px);
    }

    .nav-link-active {
      color: #667eea !important;
      background: rgba(102, 126, 234, 0.15) !important;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    }

    .nav-icon {
      width: 18px;
      height: 18px;
      stroke-width: 2;
    }

    /* Mobile Menu Button */
    .mobile-menu-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 44px;
      height: 44px;
      background: transparent;
      border: none;
      cursor: pointer;
      gap: 4px;
      transition: transform 0.2s ease;
    }

    @media (min-width: 768px) {
      .mobile-menu-btn {
        display: none;
      }
    }

    .mobile-menu-btn:hover {
      transform: scale(1.1);
    }

    .hamburger-line {
      width: 24px;
      height: 3px;
      background: #64748b;
      border-radius: 2px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .mobile-menu-btn.active .hamburger-line:nth-child(1) {
      transform: rotate(45deg) translate(6px, 6px);
      background: #667eea;
    }

    .mobile-menu-btn.active .hamburger-line:nth-child(2) {
      opacity: 0;
    }

    .mobile-menu-btn.active .hamburger-line:nth-child(3) {
      transform: rotate(-45deg) translate(6px, -6px);
      background: #667eea;
    }

    /* Mobile Menu */
    .mobile-menu {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      transform: translateY(-100%);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    .mobile-menu.active {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }

    .mobile-menu-content {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .mobile-nav-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-radius: 12px;
      font-weight: 500;
      color: #64748b;
      text-decoration: none;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .mobile-nav-link:hover {
      color: #667eea;
      background: rgba(102, 126, 234, 0.1);
      transform: translateX(8px);
    }

    .mobile-nav-active {
      color: #667eea !important;
      background: rgba(102, 126, 234, 0.15) !important;
    }

    .mobile-nav-icon {
      width: 20px;
      height: 20px;
      stroke-width: 2;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      position: relative;
    }

    .content-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
      min-height: calc(100vh - 70px);
    }

    @media (min-width: 768px) {
      .content-wrapper {
        padding: 3rem 2rem;
      }
    }

    /* Responsive Design */
    @media (max-width: 767px) {
      .nav-content {
        height: 60px;
      }

      .logo-main {
        font-size: 1.25rem;
      }

      .logo-sub {
        font-size: 0.75rem;
      }

      .logo-icon {
        width: 36px;
        height: 36px;
      }

      .logo-icon svg {
        width: 20px;
        height: 20px;
      }
    }

    /* Smooth Scrolling */
    @media (prefers-reduced-motion: no-preference) {
      html {
        scroll-behavior: smooth;
      }
    }

    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
    }

    ::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #5a67d8, #6b5b95);
    }
  `]
})
export class AppComponent {
  title = 'frontend';
  isMobileMenuOpen = signal<boolean>(false);
  isScrolled = signal<boolean>(false);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    this.isScrolled.set(scrollTop > 10);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    if (window.innerWidth >= 768) {
      this.isMobileMenuOpen.set(false);
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }
}
