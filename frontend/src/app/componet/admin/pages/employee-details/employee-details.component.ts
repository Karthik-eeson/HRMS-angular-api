import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { AdminHandleEmpService, EmployeeInput } from '../../../../services/admin-handle-emp.service';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.scss'
})
export class EmployeeDetailsComponent implements OnInit {
  employee: EmployeeInput = { name: '', email: '', salary: 0 };
  employeeId = 0;
  isLoading = false;
  isSaving = false;
  loadFailed = false;
  errorMessage = '';

  constructor(private api: AdminHandleEmpService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.employeeId = Number(id);
    if (!Number.isInteger(this.employeeId) || this.employeeId <= 0) {
      this.loadFailed = true;
      this.errorMessage = 'Invalid employee ID.';
      return;
    }
    this.isLoading = true;
    this.api.getEmployee(this.employeeId).pipe(finalize(() => this.isLoading = false)).subscribe({
      next: data => this.employee = { name: data.name, email: data.email, salary: data.salary },
      error: () => { this.loadFailed = true; this.errorMessage = 'Unable to find or load this employee.'; }
    });
  }

  save(form: NgForm) {
    if (form.invalid || !this.employee.name.trim() || this.isSaving || this.isLoading || this.loadFailed) {
      form.control.markAllAsTouched();
      this.errorMessage = 'Enter a name, valid email, and non-negative salary.';
      return;
    }
    this.isSaving = true;
    this.errorMessage = '';
    const request = this.employeeId
      ? this.api.updateEmployee(this.employeeId, this.employee)
      : this.api.addEmployee(this.employee);
    request.pipe(finalize(() => this.isSaving = false)).subscribe({
      next: () => this.router.navigate(['/employee-list']),
      error: error => this.errorMessage = error.status === 401
        ? 'Session expired. Please sign in again.' : 'Could not save. Check the fields and try again.'
    });
  }
}
