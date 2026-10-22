import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminHandleEmpService } from '../../../../services/admin-handle-emp.service';
import { EmployeeList } from '../../../../modelSchema/empList.model';

@Component({
  selector: 'app-salary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salary.component.html',
  styleUrl: './salary.component.scss'
})
export class SalaryComponent implements OnInit {
  employees: EmployeeList[] = [];
  loading = true;
  errorMessage = '';
  constructor(private api: AdminHandleEmpService) {}
  ngOnInit() {
    this.api.empList().subscribe({
      next: data => { this.employees = data; this.loading = false; },
      error: () => { this.errorMessage = 'Unable to load salaries.'; this.loading = false; }
    });
  }
}
