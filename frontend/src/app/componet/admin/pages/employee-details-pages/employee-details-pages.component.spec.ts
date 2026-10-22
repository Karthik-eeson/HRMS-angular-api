import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDetailsPagesComponent } from './employee-details-pages.component';

describe('EmployeeDetailsPagesComponent', () => {
  let component: EmployeeDetailsPagesComponent;
  let fixture: ComponentFixture<EmployeeDetailsPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeDetailsPagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeDetailsPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
