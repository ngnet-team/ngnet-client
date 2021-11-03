import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePopupComponent } from './change-popup.component';

describe('ChangePopupComponent', () => {
  let component: ChangePopupComponent;
  let fixture: ComponentFixture<ChangePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
