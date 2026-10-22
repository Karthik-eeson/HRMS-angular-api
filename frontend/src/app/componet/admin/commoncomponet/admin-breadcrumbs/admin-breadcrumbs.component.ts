import { Component, Input } from '@angular/core';
import { Location, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-breadcrumbs',
  standalone: true,
  imports: [NgIf, RouterModule],
  templateUrl: './admin-breadcrumbs.component.html',
  styleUrl: './admin-breadcrumbs.component.scss'
})
export class AdminBreadcrumbsComponent {

breadcrumbs: any[] = [];

constructor(private location: Location) {}
  @Input() bradcumsName:string="";
  @Input() isHide:boolean = true;
  goBack(){
    this.location.back()
  }
}
