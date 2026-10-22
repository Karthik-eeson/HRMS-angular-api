import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminHandleEmpService } from '../../../../services/admin-handle-emp.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  summary: { employeeCount: number; totalSalary: number } | null = null;
  errorMessage = '';
  constructor(private api: AdminHandleEmpService) {}
  ngOnInit() {
    this.api.summary().subscribe({
      next: data => this.summary = data,
      error: () => this.errorMessage = 'Unable to load dashboard data.'
    });
  }
}
