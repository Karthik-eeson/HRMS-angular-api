import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminHandleEmpService } from '../../../../services/admin-handle-emp.service';
import { EmployeeList } from '../../../../modelSchema/empList.model';
import { CommonModule, NgFor } from '@angular/common';



@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [RouterModule, CommonModule, NgFor],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit{

 employeeList: EmployeeList []=[];
 isLoading = false;
 errorMessage = '';
 deletingId: number | null = null;
 deleteEmployee(employee: EmployeeList) {
   if (this.deletingId !== null || !window.confirm('Delete ' + employee.name + '?')) return;
   this.deletingId = employee.employeeId;
   this.errorMessage = '';
   this.adminEmpServices.deleteEmployee(employee.employeeId).subscribe({
     next: () => { this.deletingId = null; this.getAllEmp(); },
     error: () => { this.deletingId = null; this.errorMessage = 'Unable to delete employee. Please try again.'; }
   });
 }

constructor(private adminEmpServices: AdminHandleEmpService){}

ngOnInit(): void {
  this.getAllEmp();
}


getAllEmp(){
  this.isLoading = true;
  this.errorMessage = '';
  this.adminEmpServices.empList().subscribe({
    next:(data)=>{
      this.employeeList = data;
      this.isLoading = false;
    },
    error:(err)=>{
      this.isLoading = false;
      this.errorMessage = err.status === 401 ? 'Your session expired. Please sign in again.' : 'Unable to load employees. Please try again later.';
    }
  });

}
}
