import { Component } from '@angular/core';
import { AdminBreadcrumbsComponent } from '../../commoncomponet/admin-breadcrumbs/admin-breadcrumbs.component';
import { NgIf } from '@angular/common';
import { SalaryComponent } from '../salary/salary.component';
import { TempuserlistComponent } from '../tempuserlist/tempuserlist.component';
import { UserListComponent } from '../user-list/user-list.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [AdminBreadcrumbsComponent, NgIf, UserListComponent, TempuserlistComponent, SalaryComponent],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent {

  seleteTab = 0;
  pageTitle = "Employee List";
  
  isShow:boolean = false;
  clickTab(index:number) {
     this.seleteTab = index;
  }
}
