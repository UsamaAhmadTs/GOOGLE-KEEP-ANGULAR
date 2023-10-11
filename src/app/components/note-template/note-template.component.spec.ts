import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteTemplateComponent } from './note-template.component';

describe('NoteTemplateComponent', () => {
  let component: NoteTemplateComponent;
  let fixture: ComponentFixture<NoteTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoteTemplateComponent]
    });
    fixture = TestBed.createComponent(NoteTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
