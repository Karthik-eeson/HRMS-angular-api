import { Routes } from '@angular/router';
import { authGuard } from './services/auth.service';
import { LayoutComponent } from './componet/layout/layout.component';
import { LoginComponent } from './auth/login/login.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';

export const routes: Routes = [
  {path:'', component:LoginComponent, pathMatch:'full'},
  {path:'forgotpassword', component:ForgotPasswordComponent},
    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children:[
          {
            path:'',
            redirectTo:'admin-dashboard',
            pathMatch:'full'
          },
          {path:'admin-dashboard', loadComponent:()=>import('./componet/admin/pages/admin-dashboard/admin-dashboard.component').then((m)=>m.AdminDashboardComponent)},
          {path:'employee-list', loadComponent:()=>import('./componet/admin/pages/employee-list/employee-list.component').then((m)=>m.EmployeeListComponent)},
          {path:'user-list', loadComponent:()=>import('./componet/admin/pages/user-list/user-list.component').then((m)=>m.UserListComponent)},
          {path:'tempuser-list', loadComponent:()=>import('./componet/admin/pages/tempuserlist/tempuserlist.component').then((m)=>m.TempuserlistComponent)},
          {path:'employee-details', loadComponent:()=>import('./componet/admin/pages/employee-details/employee-details.component').then((m)=>m.EmployeeDetailsComponent)},
          {path:'employee-details/:id', loadComponent:()=>import('./componet/admin/pages/employee-details/employee-details.component').then((m)=>m.EmployeeDetailsComponent)}
        ]
    },
    { path: '**', redirectTo: '' }
];
