import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoLinkComponent } from './auto-link.component';

describe('AutoLinkComponent', () => {
  let component: AutoLinkComponent;
  let fixture: ComponentFixture<AutoLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
