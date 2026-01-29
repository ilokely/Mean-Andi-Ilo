import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccueilAdminComponent } from './accueil-admin.component';

describe('AccueilAdminComponent', () => {
  let component: AccueilAdminComponent;
  let fixture: ComponentFixture<AccueilAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccueilAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccueilAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
