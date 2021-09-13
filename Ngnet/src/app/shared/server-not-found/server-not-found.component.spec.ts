import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerNotFoundComponent } from './server-not-found.component';

describe('ServerNotFoundComponent', () => {
  let component: ServerNotFoundComponent;
  let fixture: ComponentFixture<ServerNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerNotFoundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
