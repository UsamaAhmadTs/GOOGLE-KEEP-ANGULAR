import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelMenuComponent } from './label-menu.component';

describe('LabelMenuComponent', () => {
  let component: LabelMenuComponent;
  let fixture: ComponentFixture<LabelMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabelMenuComponent]
    });
    fixture = TestBed.createComponent(LabelMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
