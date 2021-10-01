import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SDropdownComponent } from './s-dropdown.component';

describe('SDropdownComponent', () => {
  let component: SDropdownComponent;
  let fixture: ComponentFixture<SDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
