import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempuserlistComponent } from './tempuserlist.component';

describe('TempuserlistComponent', () => {
  let component: TempuserlistComponent;
  let fixture: ComponentFixture<TempuserlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TempuserlistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TempuserlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
