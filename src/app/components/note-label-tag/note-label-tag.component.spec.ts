import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteLabelTagComponent } from './note-label-tag.component';

describe('NoteLabelTagComponent', () => {
  let component: NoteLabelTagComponent;
  let fixture: ComponentFixture<NoteLabelTagComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoteLabelTagComponent]
    });
    fixture = TestBed.createComponent(NoteLabelTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
