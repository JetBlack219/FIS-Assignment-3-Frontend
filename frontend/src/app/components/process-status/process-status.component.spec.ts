import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessStatusComponent } from './process-status.component';

describe('ProcessStatusComponent', () => {
  let component: ProcessStatusComponent;
  let fixture: ComponentFixture<ProcessStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProcessStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
