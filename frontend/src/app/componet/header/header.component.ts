import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  email = '';
  ngOnInit() {
    this.auth.me().subscribe({
      next: user => this.email = user.email,
      error: () => this.router.navigate(['/'])
    });
  }
  logoutError = '';
  constructor(private auth: AuthService, private router: Router) {}
  logout() {
    this.logoutError = '';
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/']),
      error: (error) => {
        if (error.status === 401) this.router.navigate(['/']);
        else this.logoutError = 'Unable to log out. Please try again.';
      }
    });
  }

@Input() isCollapsed = false;
@Output() toggleSidebar = new EventEmitter<void>();
  currentDate: Date = new Date();

  toggleSidebarMenu() {
    this.toggleSidebar.emit();
  }
}
