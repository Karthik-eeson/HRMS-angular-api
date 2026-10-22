import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { EmployeeList } from '../modelSchema/empList.model';

export interface EmployeeInput {
  name: string;
  email: string;
  salary: number;
}

@Injectable({ providedIn: 'root' })
export class AdminHandleEmpService {
  private apiUrl = environment.api_url + '/Employees';
  constructor(private http: HttpClient) {}

  empList() { return this.http.get<EmployeeList[]>(this.apiUrl); }
  getEmployee(id: number) { return this.http.get<EmployeeList>(this.apiUrl + '/' + id); }
  addEmployee(employee: EmployeeInput) { return this.http.post<EmployeeList>(this.apiUrl, employee); }
  updateEmployee(id: number, employee: EmployeeInput) {
    return this.http.put<EmployeeList>(this.apiUrl + '/' + id, employee);
  }
  deleteEmployee(id: number) { return this.http.delete<void>(this.apiUrl + '/' + id); }
  summary() {
    return this.http.get<{ employeeCount: number; totalSalary: number }>(this.apiUrl + '/summary');
  }
}
